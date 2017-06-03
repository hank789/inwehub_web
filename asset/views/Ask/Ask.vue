<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <button type="button" class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="cancelAsk">取消

      </button>
      <h1 class="mui-title">提问</h1>
      <a @tap.stop.prevent="$router.push('/help/ask')"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">帮助</a>
    </header>

    <div class="mui-content form form-ask">
      <div class="textarea-wrapper">
        <textarea v-model.trim="description" @keydown.stop="enterWords"
                  placeholder="请在这里提出问题。为了更好的通过平台解决问题，提问需要遵循相应规范，请点击帮助了解详情。"></textarea>
      </div>
      <!--<span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>-->
    </div>

    <div class="fixedDiv">
      <div class="fixedContainer">
        <span class="counter">(<span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span>)</span>
        <span class="niming"><label><input type="checkbox" v-model="hide"/> 匿名</label></span>
      </div>
      <div class="title select" v-show="!isShowMoneyDev">问题分类：<span class="active"
                                                                        @tap.stop.prevent="selectType">{{ type ? type.split(':')[0] : '请选择'
        }}</span></div>

      <div class="button-wrapper" v-show="!isShowMoneyDev">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="showMoney();">
          提好问题了

        </button>
      </div>
    </div>

    <div id="sheet1" class="mui-popover mui-popover-bottom mui-popover-action ">
      <div class="selectMoney">
        <div class="category">
          <span :class="money == 88 &&  selectOther == false ?'active':''"
                @tap.stop.prevent="selectMoney(88)">88元</span>
          <span :class="money == 188 &&  selectOther == false  ?'active':''"
                @tap.stop.prevent="selectMoney(188)">188元</span>
          <span :class="money == 38 &&  selectOther == false  ?'active':''"
                @tap.stop.prevent="selectMoney(38)">38元</span>
          <!--<span @tap.stop.prevent="selectMoney(0)" v-show="!selectOther">其他金额</span>-->
          <!--<span v-show="selectOther" class="active"><input type="number" pattern="\d*" value="" placeholder="其他"-->
                                                           <!--v-model.number="money"/></span>-->
        </div>
        <div class="help">你若问的用心，我将答的精彩</div>
        <div class="button-wrapper">
          <pay :pay_object_type="pay_object_type" :pay_money="money" v-on:pay_success="goAsk">

          </pay>
        </div>
      </div>
    </div>


  </div>
</template>

<script>

  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import pay from '../../components/pay/pay.vue';

  const Ask = {
    data: () => ({
      money: 88,
      uid:0,
      description: '',
      selectOther: false,
      hide: 0,
      descMaxLength: 500,
      isShowMoneyDev: false,
      test: 0,
      pay_object_type: 'ask'
    }),
    components: {
      pay
    },
    mounted(){
      mui.init();

      var fixedDiv = mui('.fixedDiv')[0];
      var textareaWrapper = mui('.textarea-wrapper')[0];

      if (mui.os.ios) {

        mui(".textarea-wrapper").on('focusin', 'textarea', function () {
          fixedDiv.style.position = 'absolute';
          fixedDiv.style.top = '200px';
          textareaWrapper.style.height='156px';
        });

        mui(".textarea-wrapper").on('focusout', 'textarea', function () {
          fixedDiv.style.position = 'fixed';
          fixedDiv.style.top = 'auto';
          textareaWrapper.style.height='100%';
        });
      }

      var inputElem = document.querySelector('textarea');
      inputElem.focus();


    },
    computed: {
      type () {
        return this.$store.state.askType.selected ? this.$store.state.askType.selected : '';
      },
      descLength() {
        return this.description.length;
      }
    },
    created () {

        if (this.$route.query.id) {
          var id = parseInt(this.$route.query.id);
          if (id) {
              this.uid = id;
          }
        }

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
      enterWords(event){
        var key = event.key;
        var code = event.keyCode;

        if (code == 13) {
          if (window.event) {
            window.event.returnValue = false;
          } else {
            event.preventDefault();//for firefox
          }
        }

        return false;
      },
      cancelAsk(){

        var inputElem = document.querySelector('textarea');
        inputElem.blur();

        if (!this.type && !this.description) {
          this.$router.go(-1);
          return;
        }

        mui.confirm("退出此处编辑？", null, ['确定', '取消'], e => {
          if (e.index == 0) {
            this.clearCache();
            this.$router.go(-1);
          }
        }, 'div');
      },
      showMoney(){

        if (!this.type) {
          mui.toast('请选择问题分类');
          return;
        }

        if (!this.description) {

          mui.toast('请填写提问内容');
          return;
        }

        mui('#sheet1').popover('toggle');
      },
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
              t.$router.replace('/my/info');
            });
            return;
          }

          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }
        });
      },
      clearCache(){
        var info = {};
        this.$store.dispatch(ASK_INFO, info);
        this.$store.dispatch(ASK_TYPE_SELECT, '');
      },
      goAsk(order_id,pay_object_type){
        if (!this.type) {
          mui.toast('请选择问题分类');
          return;
        }

        if (!this.money) {
          mui.toast('请选择提问金额');
          return;
        }

        if (this.money < 38) {
          mui.toast('提问金额不能小于38');
          return;
        }

        if (this.money > 188) {
          mui.toast('打赏钱有点多，提问金额的上限为188元');
          return;
        }

        if (!this.description) {
          mui.toast('请填写提问内容');
          return;
        }



        var data = {
          order_id: order_id,
          answer_uid:this.uid,
          tags: this.type.split(':')[1],
          price: this.money,
          description: this.description,
          hide: this.hide
        };

        mui('#sheet1').popover('toggle');



        postRequest(`question/store`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          this.clearCache();

          var result = response.data.data;
          var id = result.id;
          var timeend = result.waiting_second ? result.waiting_second : 15;

          this.$router.replace({path: '/pay/ask/' + id + '?money=' + result.price + '&timeend=' + timeend});
        });
      }
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength);
        }

        this.description = this.description.replace("\n", "");
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
  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }

  .mui-bar-nav ~ .mui-content {
    padding-top: 0;
  }

  .form-ask {
    padding-top: 0;
    background: #fff;
    position: fixed;
    top: 44px;
    bottom: 148px;
    width: 100%;
    z-index: 0;
  }

  .form-ask textarea {
    width: 100%;
    height: 100%;
    border: none;
    margin: 0;
    padding: 10px;
  }

  .selectMoney {
    background: #fff;
  }

  .selectMoney .category span.active, .form-ask .select span.active {
    border: 1px solid #4990E2;
    color:#4990E2;
  }

  .selectMoney .category span {
    border: 1px solid #b6b6b6;
    border-radius: 5px;
    width: 30%;
    display: inline-block;
    height: 32px;
    margin: 0 3px 10px;
    text-align: center;
    line-height: 32px;
    position: relative;
  }

  .selectMoney .help{
      margin:30px 0;
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

  .selectMoney .category span input {
    display: inline-block;
    position: relative;
    border: none;
    height: 90%;
    margin-top: -4px;
    width: 90%;
    text-align: center;
  }

  .form-ask .button-wrapper {
    margin-top: 15px;
    padding: 0 80px
  }

  .textarea-wrapper {
    height: 100%;
    background: #fff;
  }

  .textarea-wrapper .counter {
    position: absolute;
    left: 10px;
    bottom: 5px;
    color: #999;
  }

  .textarea-wrapper .niming {
    position: absolute;
    right: 10px;
    bottom: 5px;
    color: #999;
  }

  .mui-bar .mui-btn-link {
    color: #fff;
  }

  .mui-bar .mui-btn-nav.mui-pull-left {
    margin-left: 5px;
  }

  .selectMoney {
    text-align: center;
    padding: 40px 30px 20px;
  }

  .selectMoney .payDesc {
    position: relative;
    font-size: 14px;
  }

  .selectMoney .payDesc {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    color: #999;
  }

  .selectMoney .button-wrapper {
    margin: 10px 0 20px;
    padding: 0 30px;
  }

  .selectMoney .payDesc .dash {
    position: relative;
    top: -4px;
    margin: 0 5px;
    display: inline-block;
    border-top: 1px solid #999;
    width: 45px;
  }

  .selectMoney .payDesc .mui-icon {
    margin-right: 5px;
  }

  .fixedContainer {
    position: relative;
    background: #fff;
    padding: 5px 10px;
  }

  .fixedContainer .counter {
    color: #999;
  }

  .fixedContainer .niming {
    float: right;
    color: #999;
  }

  .fixedDiv .title {
    margin: 10px 0;
    text-align: center;
    color: #8b8b8b;
    height: 32px;
  }

  .fixedDiv {
    padding-bottom: 10px;
    position: absolute;
    background-color: #f4f4f4;
    bottom: 0;
    width: 100%;
  }

  .fixedDiv .select span {
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

  .fixedDiv .select span.active {
    border: 1px solid #4a90e2;
  }

  .fixedDiv .button-wrapper {
    margin-top: 15px;
    padding: 0 90px
  }
</style>
