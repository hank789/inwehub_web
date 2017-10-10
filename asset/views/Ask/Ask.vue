<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="cancelAsk"></a>
      <h1 class="mui-title">发起提问</h1>
    </header>

    <div class="mui-content absolute askWrapper">

      <div class="category"><span class="tip">问题分类</span>
        <button class="mui-btn mui-btn-block mui-btn-primary" type="button" @tap.stop.prevent="selectType()">
          {{ type ? type.split(':')[0] : '选择'
          }}
        </button>
      </div>

      <div class="form form-ask">
        <div class="textarea-wrapper">
        <textarea id="description" v-model.trim="description" @keydown.stop="enterWords" @focus="textareaFocus" @blur="textareaBlur"></textarea>
        </div>
      </div>

      <div class="fixedDiv">
        <div class="fixedContainer">
          <span class="niming" @tap.stop.prevent="toggleHide"><label class="nimingCheckbox" :class="{'active':hide}"></label>匿名</span>
          <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
        </div>

        <div class="button-wrapper" v-show="!isShowMoneyDev">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="showMoney();">
            提好问题了


          </button>
        </div>

        <div class="help">
          <div class="item" @tap.stop.prevent="$router.pushPlus('/help/ask')">如何提一个好问题？</div>
          <div class="item" @tap.stop.prevent="fenhongxize()">问答被查看后我的分成细则？</div>


        <div class="button-wrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @tap.stop.prevent="toAskCommunity">
            去问答社区看看
            </button>
          </div>
        </div>
      </div>

    </div>



    <div id="sheet1" class="mui-popover mui-popover-bottom mui-popover-action ">
      <div class="selectMoney">

        <div class="title">您若问的用心，我将答的精彩</div>

        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <div class="mui-input-row">
              <div @tap.stop.prevent="selectMajor2" class="mui-navigate-right"><label>付费选项</label><label
                class="mui-pull-right account-setting-field">{{ getSelectMoneyMethod }}</label></div>
            </div>
          </li>
          <li class="mui-table-view-cell">
            <div class="mui-input-row">
              <div><label>支付金额</label><label
                class="mui-pull-right account-setting-field">¥ {{money}}.00</label></div>
            </div>
          </li>
          <li class="mui-table-view-cell">
            <div class="mui-input-row">
              <div><label>支付方式</label><label
                class="mui-pull-right account-setting-field apple-icon ">
                <svg class="icon mui-icon" aria-hidden="true">
                  <use :xlink:href="getMethodIcon()"></use>
                </svg>
              </label></div>
            </div>
          </li>
        </ul>

        <div class="button-wrapper">
          <pay :pay_object_type="pay_object_type" :pay_object_id="0" :pay_money="money" v-on:pay_success="goAsk">

          </pay>
        </div>
      </div>
    </div>


    <div id="expert" class="mui-popover mui-popover-action mui-popover-bottom">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell" v-for="(item, index) in payItems">
          <a @tap.stop.prevent="selectMoney(item.value)">{{ item.text }}</a>
        </li>
      </ul>
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="selectMajor2()"><b>取消</b></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import pay from '../../components/pay/pay.vue';
  import {setStatusBarBackgroundAndStyle} from '../../utils/statusBar';
  import {alertFenhongxize} from '../../utils/dialogList';
  import localEvent from '../../stores/sessionStorage';
  import {alertSimple, getDialogObj} from '../../utils/dialog';
  import userAbility from '../../utils/userAbility';

  const Ask = {
    data: () => ({
      money: 88,
      payItems: [],
      uid: 0,
      description: '',
      question_type:1,  //提问类型，1为付费专业问答，2为免费问答互助,默认为1
      selectOther: false,
      hide: 0,
      descMaxLength: 1000,
      isShowMoneyDev: false,
      test: 0,
      pay_object_type: 'ask',
      descPlaceholder:'1.请精确描述输入问题详情，并等待平台专家回答' + "\n"
        + '2.答案每被查看一次，你和回答者可从中获取分成' + "\n"
        + '3.请根据问题难易程度等合理选择支付金额',
    }),
    components: {
      pay
    },
    mounted(){
      setStatusBarBackgroundAndStyle('#3c3e44', 'light');

      window.addEventListener('refreshData', function (e) {
        //执行刷新
        console.log('refresh-ask');
      });
      mui.init();

      this.helpWrapper();

      this.textareaBlur();
    },
    computed: {
      type () {
        return this.$store.state.askType.selected ? this.$store.state.askType.selected : '';
      },
      descLength() {
        return this.description.length;
      },
      getSelectMoneyMethod(){
        for (var i in this.payItems) {
          var item = this.payItems[i];
          if (this.money == item.value) {
            return item.text.replace(/（.*?）/, '');
          }
        }
      }
    },
    created () {
      //showInwehubWebview();
      if (this.$route.query.id) {
        var id = this.$route.query.id;
        if (id) {
          this.uid = id;
        }
      }

      if (this.$route.query.question_type) {
        var question_type = parseInt(this.$route.query.question_type);
        if (question_type) {
          this.question_type = question_type;
          if (this.question_type === 2) {
              this.descPlaceholder = '可征集多人答案，可在详情页进行回答邀请。';
          }
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
      textareaFocus(){
          if (this.description === this.descPlaceholder) {
              this.description = '';
          }
      },
      textareaBlur(){
        if (this.description === '') {
          this.description = this.descPlaceholder;
        }
      },
      toggleHide(){
          this.hide = !this.hide;
      },
      toAskCommunity() {
        userAbility.jumpToAskCommunity(this);
      },
      helpWrapper(){

        var showHelpWrapper = localEvent.getLocalItem('showHelpWrapper');
        if (typeof showHelpWrapper.closed === 'undefined') {
          var dialogObj = getDialogObj(this);
          if (dialogObj) {
            dialogObj.getHtml('helpWrapper', {}, (html) => {
              alertSimple(html, '确定', (num) => {
                if (num.index <= 0) {
                  localEvent.setLocalItem('showHelpWrapper', {closed:true});
                }
              }, true);
            });
          }
        }
      },
      fenhongxize(){
        alertFenhongxize(this);
      },
      developing(){
        mui.toast('开发中...');
      },
      getMethodIcon(){
        if (mui.os.plus && mui.os.ios) {
          return '#icon-apple';
        }

        return '#icon-wechat';
      },
      selectMajor2(){

        if (mui.os.plus) {

          var options = [];
          mui.each(this.payItems, function (index, item) {
            options.push({
              title: item.text
            });
          });

          var a = options;
          plus.nativeUI.actionSheet({
            cancel: "取消",
            buttons: a
          }, (b) => {
            var vIndex = b.index - 1;

            if (this.payItems[vIndex]) {
              this.money = this.payItems[vIndex].value;
            }
          })
        } else {
          mui('#expert').popover('toggle');
        }
      },
      enterWords(event){
//        var key = event.key;
//        var code = event.keyCode;
//
//        if (code == 13) {
//          if (window.event) {
//            window.event.returnValue = false;
//          } else {
//            event.preventDefault();//for firefox
//          }
//        }
//
//        return false;
      },
      cancelAsk(){

        var inputElem = document.querySelector('textarea');
        inputElem.blur();

        if (!this.type && !this.description) {
          mui.back();
          return;
        }

        mui.confirm("退出此处编辑？", null, ['确定', '取消'], e => {
          if (e.index == 0) {
            this.clearCache();
            mui.back();
          }
        }, 'div');
      },
      showMoney(){

        var inputElem = document.querySelector('textarea');
        inputElem.blur();

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

        this.selectMajor2();
        this.showMoney();

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
        this.$router.push('/ask/type');
      },
      check(){
        var t = this;

        postRequest(`question/request`, {uuid: this.uid}).then(response => {

          var code = response.data.code;

          if (code == 3000) {
            mui.alert(response.data.message, null, null, function () {
              t.$router.replace('/my/info');
            });
            return;
          }

          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
            return;
          }

          this.payItems = response.data.data.pay_items;

          for (var i in this.payItems) {
            var item = this.payItems[i];
            if (item.default) {
              this.money = parseInt(item.value);
            }
          }

        });
      },
      clearCache(){
        var info = {};
        this.$store.dispatch(ASK_INFO, info);
        this.$store.dispatch(ASK_TYPE_SELECT, '');
      },
      goAsk(order_id, pay_object_type){
        if (!this.type) {
          mui.toast('请选择问题分类');
          return;
        }

        if (!this.money) {
          mui.toast('请选择提问金额');
          return;
        }

        if (this.money < 0) {
          mui.toast('提问金额不能小于0');
          return;
        }

        if (!this.description) {
          mui.toast('请填写提问内容');
          return;
        }

        // 提问设备，1为IOS，2为安卓，3为网页，4为微信小程序
        var device = 1;
        if (mui.os.plus) {
          if (mui.os.android) {
            device = 2;
          }
        } else {
          device = 3;
        }

        var data = {
          order_id: order_id,
          question_type:this.question_type,
          answer_uuid: this.uid,
          description: this.description,
          price: this.money,
          tags: this.type.split(':')[1],
          hide: this.hide,
          device: device
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

        //this.description = this.description.replace("\n", "");
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


  .askWrapper .category {
    background: #fff;
    padding: 15px 17px;
    position: relative;
  }

  .askWrapper .category .tip {
    font-size: 16px;
    color: #444444;
  }

  .askWrapper .category button {
    position: absolute;
    border: 1px solid #03aef9;
    background-color: #03aef9;
    width: auto;
    font-size: 14px;
    padding: 4px 17px;
    right: 10px;
    top: 12px;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }

  .mui-content{
    background-color: #fff;
  }

  .mui-bar-nav ~ .mui-content {
    padding-top: 0;
  }

  .form-ask {
    padding-top: 0;
    background: #fff;
    height:313px;
    width: 100%;
    z-index: 0;
  }

  .form-ask textarea {
    width: 100%;
    height: 100%;
    border: none;
    margin: 0;
    padding: 10px 17px;
    color: #9b9b9b;
  }

  .selectMoney {
    background: #fff;
  }

  .selectMoney .category span.active, .form-ask .select span.active {
    border: 1px solid #4990E2;
    color: #4990E2;
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

  .selectMoney .help {
    margin: 30px 0;
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
    background: #f3f4f6;
  }

  .textarea-wrapper textarea {
    background: #f3f4f6;
  }

  .mui-bar .mui-btn-link {
    color: #fff;
  }

  .mui-bar .mui-btn-nav.mui-pull-left {
    margin-left: 5px;
  }

  .selectMoney {
    text-align: center;
    padding: 0 15px 15px 15px;
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
    margin: 20px 0 10px;
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
    background: #f3f4f6;
    padding: 5px 10px;
  }

  .fixedContainer .counter {
    float: right;
    color: #c8c8c8;
  }

  .fixedContainer .niming {
    color: #808080;
    position: relative;
    font-size: 14px;
    padding-left: 9px;
  }

  .fixedContainer .niming input {
    position: absolute;
    top: 4px;
    left: 0;
    vertical-align: bottom;
  }

  .fixedDiv .title {
    margin: 10px 0;
    text-align: center;
    color: #8b8b8b;
    height: 32px;
  }

  .fixedDiv {
    padding-bottom: 10px;
    background-color: #fff;
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
    padding: 0 15px;
  }

  .fixedDiv .button-wrapper button {
    background: #03aef9;
    color: #f2f2f2;
    border-radius: 5px;
    border: 1px solid #03aef9;
  }

  .mui-popover .mui-table-view {
    background: none !important;
    margin-top: 0 !important;
    border-radius: 0 !important;
    color: rgba(155, 155, 155, 100) !important;
  }

  #expert.mui-popover .mui-table-view {
    background: #fff !important;
    border-radius: 5px !important;
    color: #4990E2 !important;
  }

  #expert.mui-popover .mui-table-view-cell {
    padding: 13px 15px;
  }

  .selectMoney .title {
    padding: 22px 0;
    margin: 0 8px;
    text-align: center;
    position: relative;
  }

  .selectMoney .title:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .selectMoney .mui-table-view-cell {
    padding: 10px 0;
  }

  .selectMoney .mui-pull-right {
    float: right !important;
    padding-right: 35px;

    color: rgba(74, 144, 226, 100) !important;
    text-align: right;
  }

  .selectMoney .mui-icon {
    color: rgba(138, 138, 138, 100);
    opacity: 0.67;
    font-size: 24px;
  }

  .selectMoney .apple-icon {
    padding: 8px 35px 0 0;
  }

  .mui-popover .mui-table-view .mui-table-view-cell:last-child, .mui-popover .mui-table-view .mui-table-view-cell:last-child > a:not(.mui-btn) {
    border-radius: 0 !important;
  }

  .mui-table-view-cell:after {
    left: 0 !important;
  }

  .mui-input-row label {
    padding-left: 5px;
    text-align: left;
  }

  .help {
    color: #03aef9;
    font-size: 14px;
    padding: 0 15px;

  }

  .help .item {
    padding: 10px 0 0;
  }

  .help .button-wrapper {
    margin-top: 46px;
    padding: 0 75px;
  }

  .help .button-wrapper button {
    border-radius: 50px;
    border: 1px solid #dcdcdc;
    background: #fff;
    color: #444;
    padding: 5px 0;
  }

  .nimingCheckbox{
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    border: 1px solid #c8c8c8;
    border-radius: 50%;
    top: 3px;
    right: 5px;
  }


  .nimingCheckbox.active:after{
    content:' ';
    display: inline-block;
    width: 4px;
    height: 4px;
    position: absolute;
    border: 1px solid #03aef9;
    background-color: #03aef9;
    border-radius: 50%;
    left:50%;
    margin-left:-3px;
    top:50%;
    margin-top:-3px;
  }

  @media screen and (max-width: 374px) {
    .form-ask{
      height:220px;
    }
  }
</style>
