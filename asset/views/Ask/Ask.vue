<template>
  <div class="page page-white">
    <div class="page-container">
      <header class="mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">提问</h1>
      </header>

      <div class="mui-content form form-ask">
        <div class="mui-table-view">
          <div class="mui-table-view-cell">
            <form>
              <div class="textarea-wrapper">
                <textarea v-model.trim="description"></textarea>
                <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
              </div>

              <div class="title">请选择提问金额</div>
              <div class="category">
                <span :class="money == 88 ?'active':''" @tap.stop.prevent="selectMoney(88)">88元</span>
                <span :class="money == 188 ?'active':''" @tap.stop.prevent="selectMoney(188)">188元</span>
                <!--<span>其他金额</span>-->
                <!--<span class="active">88元</span>-->
                <!--<span>188元</span>-->
                <!--<span><input type="text" value=""/> </span>-->
              </div>
              <div class="title">请选择分类问题：</div>
              <div class="select" v-show="type">已选择: <span class="active selected">{{ type }}</span></div>
              <div class="button-wrapper">
                <button type="button" class="mui-btn mui-btn-block mui-btn-primary mui-btn-outlined"
                        @tap.stop.prevent="selectType">点击选择分类


                </button>
              </div>
            </form>
          </div>
        </div>


        <div class="mui-table-view mt15">
          <div class="mui-table-view-cell">
            <div class="button-wrapper">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary mui-btn-outlined"
                      @tap.stop.prevent="goAsk">立即提问


              </button>
            </div>
            <div class="options">
              <input type="checkbox" v-model="hide"/> 匿名



            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  import {NOTICE, ASK_INFO} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';

  const Ask = {
    data: () => ({
      money: 0,
      description: '',
      hide: 0,
      descMaxLength: 500
    }),
    computed: {
      type () {
        return this.$store.state.askType.selected
      },
      descLength() {
        return this.description.length;
      }
    },
    created () {
      var info = this.$store.state.askType.info;
      if (info.money) {
        this.money = info.money;
        this.description = info.desc;
        this.hide = info.hide;
      }
    },
    methods: {
      selectMoney(money) {
        this.money = money
      },
      selectType () {
        var info = {
          money: this.money,
          desc: this.description,
          hide: this.hide
        };
        this.$store.dispatch(ASK_INFO, info);
        this.$router.push('ask/type');
      },
      goAsk(){
        if (!this.type) {
          mui.toast('请选择问题分类');
          return;
        }

        if (!this.money) {
          mui.toast('请选择提问金额');
          return;
        }

        if (!this.description) {
          mui.toast('请填写提问内容');
          return;
        }

        var data = {
          tags: this.type,
          price: this.money,
          description: this.description,
          hide: this.hide
        };
        addAccessToken().post(createAPI(`question/store`), data,
          {
            validateStatus: status => status === 200
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }

            var id = response.data.data.id;
            this.$router.push('ask/' + id);
          })
          .catch(({response: {message = '网络状况堪忧'} = {}}) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          })
      }
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength);
        }
      }
    }
  }
  export default Ask;
</script>


<style scoped>
  .form-ask textarea {
    width: 100%;
    height: 100px;
    border: 1px solid #efefef;
  }

  .form-ask .title {
    margin-top: 10px;
    color: #8b8b8b;
    height: 32px;
  }

  .form-ask .category span.active, .form-ask .select span.active {
    border: 1px solid #4a90e2;
  }

  .form-ask .selected {
    width: auto;
  }

  .form-ask .category span, .form-ask .select span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    width: 30%;
    display: inline-block;
    height: 32px;
    margin-right: 6px;
    margin-bottom: 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

  .form-ask .category span input {
    display: inline-block;
    position: relative;
    border: none;
    height: 90%;
    margin-top: -4px;
    width: 90%;
    text-align: center;
  }

  .form-ask .options {
    text-align: center;
  }

  .form-ask .button-wrapper {
    margin-top: 15px;
  }

  .textarea-wrapper {
    position: relative;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 10px;
    bottom: 30px;
    color: #999;
  }

</style>
