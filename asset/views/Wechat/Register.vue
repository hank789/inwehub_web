<template>
  <div class="register">


    <div class="logo">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-logo"></use>
      </svg>
    </div>

    <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yaoqingma"></use>
      </svg>
      <input class="text" ref="registrationCode" type="text" @focus="focus" @blur="blur" placeholder="请输入邀请码 已注册用户可忽略"
             name="registrationCode" v-model.trim.num="registrationCode" autocomplete="off"
             v-tooltip="{content:errorMsg, placement:'bottom', trigger:'manual'}"/>
    </div>

    <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shoujihao"></use>
      </svg>
      <input class="text" ref="phone" type="text" @focus="focus" @blur="blur" maxlength="11" placeholder="输入手机号"
             name="phone" @hover.stop.prevent="" v-model.trim.num="phone" autocomplete="off"
             v-tooltip="{content:errorMsg, placement:'bottom', trigger:'manual'}"/>


      <span class="getYzm disabled" @tap.stop.prevent="getCode" v-if="!isCanGetCode">{{getCodeText}}</span>
      <span class="getYzm" @tap.stop.prevent="getCode" v-else>{{getCodeText}}</span>
    </div>

    <div class="inputWrapper">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yanzhengma"></use>
      </svg>
      <input class="text" ref="code" v-tooltip="{content:'请输入验证码', placement:'bottom', trigger:'manual'}" type="text"
             @focus="focus" @blur="blur" placeholder="输入验证码" name="code" v-model.trim.num="code" autocomplete="off"/>
    </div>

    <div class="buttonWrapper">
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :disabled="disableRegister"
              @click.prevent="register">确认


      </button>
    </div>


    <div class="help" @tap.stop.prevent="jumpToForm">
      我没有邀请码？
    </div>


  </div>
</template>


<script>

  import request, {createAPI, apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  import Vue from 'vue'
  import {USERS_APPEND} from '../../stores/types';
  import VTooltip from 'v-tooltip';
  import router from '../../routers/index';
  import {NOTICE} from '../../stores/types';
  import { getUserInfo, getAvatar } from '../../utils/user';

  Vue.use(VTooltip);

  export default {
    data: () => ({
      registrationCode: '', //邀请码
      phone: '', // 手机号码
      isCanGetCode: false,
      time: 0, // 时间倒计时
      openid: '',
      code: '', // 手机验证码,
      disableRegister: true,
      disableSendCode: true,
      errorMsg: '',
    }),
    computed: {
      getCodeText () {
        return this.time == 0 ? '发送验证' : this.time + '秒后重发';
      }
    },
    created () {
      this.checkToken();
      this.getOpenId();
    },
    watch: {
      registrationCode: function (newValue, oldValue) {
        this.checkValid();
      },
      phone: function (newValue, oldValue) {
        this.checkSendCodeValid();
        this.checkValid();
      },
      code: function (newValue, oldValue) {
        this.checkValid();
      }
    },
    methods: {
      jumpToForm(){
          window.location.href="http://cn.mikecrm.com/ovYy1u4";
      },
      checkToken(){
        let token = this.$route.query.token;
        if (token) {
          var data = {
            token:token
          };
          localEvent.setLocalItem('UserLoginInfo', data);

          this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
            let currentUser = user;
            cb(currentUser);
            router.replace({path: '/my'});
          }));
        }

      },
      getOpenId(){
        let openid = this.$route.query.openid;
        if (!openid) {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '发生一些错误',
              time: 1500,
              status: false
            });
          });
          this.$router.back();
          return;
        }
        this.openid = openid;
      },
      showTip(obj, msg){
        this.errorMsg = msg;
        obj._tooltip.show();
        setTimeout(() => {
          obj._tooltip.hide();
        }, 2000);
      },
      timer () {
        if (this.time > 0) {
          this.isCanGetCode = false;
          this.time -= 1;
          if (this.time == 0) {
            this.isCanGetCode = true;
            return;
          }
          setTimeout(this.timer, 1000)
        }
      },
      getCode(){
        let mobile = this.phone;
        let type = 'wx_gzh_register';

        if (!this.isCanGetCode) {
          return;
        }

//        if (!this.registrationCode) {
//          this.showTip(this.$refs.registrationCode, '请输入邀请码');
//          return;
//        }
//
//        if (this.registrationCode.length < 6) {
//          this.showTip(this.$refs.registrationCode, '邀请码至少6位');
//          return;
//        }

        if (mobile.length !== 11 || /^1\d{10}$/.test(mobile) === false) {
          this.showTip(this.$refs.phone, '请输入有效的手机号码');
          return;
        }

        this.isCanGetCode = false;

        postRequest('auth/sendPhoneCode', {
            mobile,
            type,
            openid:this.openid,
            'registration_code': this.registrationCode
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              this.isCanGetCode = true;
              mui.toast(response.data.message);
              return;
            }

            this.time = 120;
            this.timer();

            mui.toast('验证码发送成功');
          })
          .catch(({response: {data = {}} = {}}) => {
            this.isCanGetCode = true;
            const {code = 'xxxx'} = data;
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]});
          })
      },
      focus(event){
        event.target.parentElement.className = event.target.parentElement.className.replace('focus', '');
        event.target.parentElement.className = event.target.parentElement.className.replace('blur', '');
        event.target.parentElement.className += ' focus';
      },
      blur(){
        event.target.parentElement.className = event.target.parentElement.className.replace('focus', '');
        event.target.parentElement.className = event.target.parentElement.className.replace('blur', '');
        event.target.parentElement.className += ' blur';
      },
      checkSendCodeValid(){
        if (!this.phone) {
          this.isCanGetCode = false;
          return false;
        }

        this.isCanGetCode = true;
      },
      checkValid(){
//        if (!this.registrationCode) {
//          this.disableRegister = true;
//          return false;
//        }

        if (!this.phone) {
          this.disableRegister = true;
          return false;
        }

        if (!this.code) {
          this.disableRegister = true;
          return false;
        }

        this.disableRegister = false;
      },
      register () {
        var data = {
          mobile: this.phone,
          code: this.code,
          registration_code: this.registrationCode,
          openid: this.openid
        };

        postRequest('auth/wxgzh/check_rg', data)
          .then(response => {
            var code = response.data.code;

            if (code !== 1000) {
              if (code === 1115) {
                //去填写注册信息
                localEvent.setLocalItem('wechatInfo', data);
                router.replace({path: '/wechat/info'});
              } else {
                mui.toast(response.data.message);
                return;
              }
            }

            localEvent.setLocalItem('UserLoginInfo', response.data.data);

            this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
              let currentUser = user;
              cb(currentUser);
              router.push({path: '/my'});
            }));

          });
      },
      mounted(){

      }
    }
  }
</script>


<style lang="less" rel="stylesheet/less" scoped>
  .logo {
    margin: 42px 0 38px;
    text-align: center;
  }

  .logo .icon {
    font-size: 125px;
  }

  .inputWrapper .icon {
    position: absolute;
    top: 4px;
    font-size: 24px;
    color: #c8c8c8;
  }

  .inputWrapper {
    margin: 0 33px 22px;
    position: relative;

  }

  .inputWrapper.focus {

    &:after {
      background-color: #3c95f9;
    }

    .icon {
      color: #3c95f9;
    }
  }

  .inputWrapper .getYzm {
    display: inline-block;
    font-size: 14px;
    color: #3c95f9;
    position: absolute;
    right: 2px;
    top: 6px;
    border: 1px solid #3c95f9;
    border-radius: 5px;
    padding: 3px 14px;
  }

  .inputWrapper .getYzm.disabled {
    border: 1px solid #dcdcdc;
    color: #c8c8c8;
  }

  .inputWrapper:after {
    position: absolute;
    right: 0;
    bottom: 3px;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .inputWrapper input {
    color: #444;
    border: none;
    margin: 0;
    padding: 0 0 0 36px;
    font-size: 14px;
    background: none;
    display: inline-block;
  }

  .register {
    background: #f3f4f6;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .buttonWrapper {
    margin: 40px 36px 16px;
  }

  ::-webkit-input-placeholder {
    color: #b4b4b6;
  }

  .buttonWrapper button {
    border-radius: 5px;

    &:disabled {
      background: #dcdcdc;
      border: 1px solid #dcdcdc;
      color: #b4b4b6;

    }
  }

  .help {
    font-size: 14px;
    color: #3c95f9;
    text-align: center;
  }


</style>
