<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">提问</h1>
    </header>

    <div class="mui-content form form-ask">
      <div class="mui-table-view">
        <div class="mui-table-view-cell">
          <form>
            <div class="textarea-wrapper">
              <textarea v-model.trim="description" class=".mui-input-speech"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>
            <span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>

            <div class="title">请选择提问金额</div>
            <div class="category">
              <span :class="money == 88 &&  selectOther == false ?'active':''"
                    @tap.stop.prevent="selectMoney(88)">88元</span>
              <span :class="money == 188 &&  selectOther == false  ?'active':''" @tap.stop.prevent="selectMoney(188)">188元</span>
              <span @tap.stop.prevent="selectMoney(0)" v-show="!selectOther">其他金额</span>
              <span v-show="selectOther" class="active"><input type="text" value="" placeholder="其他"
                                                               v-model.number="money"/></span>
            </div>
            <div class="title">请选择分类问题：</div>
            <div class="select" v-show="type">已选择: <span class="active selected">{{ type }}</span></div>
            <div class="button-wrapper">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                      @tap.stop.prevent="selectType">点击选择分类

              </button>
            </div>
          </form>
        </div>
      </div>


      <div class="mui-table-view mt15">
        <div class="mui-table-view-cell">
          <div class="button-wrapper">
            <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
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
</template>

<script>

  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  const Ask = {
    data: () => ({
      money: 0,
      description: '',
      selectOther: false,
      hide: 0,
      descMaxLength: 500
    }),
    mounted(){
      mui.init();
    },
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
      if (info.money || info.desc) {
        this.money = info.money;
        this.description = info.desc;
        this.hide = info.hide;
        this.selectOther = info.selectOther;
      }
      this.check();
    },
    methods: {
      selectMoney(money) {
        if (!money) {
          this.selectOther = true;
          this.money = 88;
        } else {
          this.selectOther = false;
          this.money = money
        }
      },
      speech(){
        var options = {};
        options.engine = 'iFly';
        var t = this;
        plus.speech.startRecognize(options, function (s) {
          t.description += s;
        }, function (e) {
          mui.alert("语音识别失败：" + e.message);
        });
      },
      selectType () {
        var info = {
          money: this.money,
          desc: this.description,
          hide: this.hide,
          selectOther: this.selectOther
        };
        this.$store.dispatch(ASK_INFO, info);
        this.$router.push('ask/type');
      },
      check(){
        var t = this;

        postRequest(`question/request`, {}).then(response => {

          var code = response.data.code;

          if (code == 3000) {
            mui.alert(response.data.message, null, null, function () {
              t.$router.push('/my');
            });
            return;
          }

          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }
        });
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

        if (this.money < 88) {
          mui.toast('提问金额不能小于88');
          return;
        }

        if (this.money > 500) {
          mui.toast('打赏钱有点多，提问金额的上限为500元');
          return;
        }

        if (!this.description) {
          mui.toast('请填写提问内容');
          return;
        }

        var data = {
          tags: this.type.split('-')[1],
          price: this.money,
          description: this.description,
          hide: this.hide
        };

        postRequest(`question/store`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          var info = {};
          this.$store.dispatch(ASK_INFO, info);

          this.$store.dispatch(ASK_TYPE_SELECT, '');

          var result = response.data.data;
          var id = result.id;
          var timeend = result.waiting_second ? result.waiting_second : 15;
          this.$router.push({path: '/pay/ask/' + id + '?money=' + result.price + '&timeend=' + timeend});
        });
      }
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength);
        }
      },
      money: function (newMoney) {
        const askDetail = /^[0-9]+$/;
        if (!askDetail.test(newMoney) && this.money) {
          this.money = parseInt(this.money);
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

  .form-ask .category span {
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

  .form-ask .select span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    padding: 0 10px;
    display: inline-block;
    height: 32px;
    margin-right: 6px;
    margin-bottom: 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

</style>
