<template>
  <div class="mui-content">
    <div class="login">
      <div class="logo"></div>
      <div class="inputWrapper">
        <input class="text"  type="text" pattern="\d*" autocomplete="off" v-model.number.trim="phone" />
        <label v-show="showPhoneLabel" @tap.stop.prevent="entryPhone">手机号码</label>
      </div>
      <div class="inputWrapper">
        <input class="text" type="password" v-model.trim="password"/>
        <label v-show="showPasswordLabel" @tap.stop.prevent="entryPassword">输入密码</label>
      </div>
      <div class="forget" @tap.stop.prevent="$router.pushPlus('/findpassword/')">忘记密码</div>

      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.prevent="submit">点击登录</button>
        <button type="button" class="mui-btn mui-btn-block mui-btn-outlined" @tap.stop.prevent="$router.pushPlus('/register/')">注册账号</button>
      </div>
    </div>
  </div>
</template>

<script>
  import request, { createAPI,apiRequest } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import router from '../modules/index/routers/index';
  import detecdOS from '../utils/detecdOS';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import { getUserInfo, getAvatar } from '../utils/user';
  import { USERS_APPEND } from '../stores/types';

  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const login = {
    data: () => ({
      phone: '', // 手机号码
      password: '', // 密码
      passwordText: '', // 明文密码
      isLoading: false, // 登录loading
      showPhoneLabel:true,
      showPasswordLabel:true
    }),
    created () {
      showInwehubWebview();
      clearAllWebViewCache();
    },
    watch: {
      phone: function (newMoney,oldValue) {
        const askDetail = /^[0-9]+$/;
        if (!askDetail.test(newMoney) && this.phone) {
          this.phone = oldValue;
        }
      }
    },
    mounted(){
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-login');
        this.phone = '';
        this.password = '';
      });
      mui(".login").on('focusout', 'input', (e) => {
          if (e.target.type === 'text' && !this.phone) {
             this.showPhoneLabel = true;
          }

        if (e.target.type === 'password' && !this.password) {
          this.showPasswordLabel = true;
        }
      });

      mui(".login").on('focusin', 'input', (e) => {


        if (e.target.type === 'text' && !this.phone) {
          this.showPhoneLabel = false;
        }

        if (e.target.type === 'password' && !this.password) {
          this.showPasswordLabel = false;
        }
      });
    },
    beforeRouteEnter (to, from, next) {

      mui.plusReady(function () {

        plus.navigator.setFullscreen(true);
      });
      next();
    },
    beforeRouteLeave(to, from, next) {

      mui.plusReady(function () {
        plus.navigator.setFullscreen(false);
      });

      next();
    },
    methods: {
      entryPhone(){
        this.showPhoneLabel = false;
      },
      entryPassword(){
        this.showPasswordLabel = false;
      },
      goback () {
          mui.back();
      },
      submit () {

        if (!this.phone) {
          mui.toast('请输入手机号码');
          return;
        }

        if(!phoneReg.test(this.phone)) {
          mui.toast('请输入正确的手机号码');
          return;
        }

        if (!this.password) {
          mui.toast('请输入密码');
          return;
        }

        if(this.password.length < 6) {
          mui.toast('密码长度必须大于等于6位');
          return;
        }


        let { phone, password } = this;
        let device_system = detecdOS();
        let device_name = '';
        let device_model = '';
        let device_code  = '';
        if (mui.os.plus) {
          device_name = plus.os.name;
          device_model = plus.os.version;
          device_code  = plus.device.uuid;
        }
        this.isLoading = true;
        this.isDisabled = true;
        apiRequest('auth/login', {
            mobile:phone,
            password,
            device_system,
            device_name,
            device_model,
            device_code
          }
        )
        .then(response => {
          if (response === false) {
              return;
          }
          localEvent.setLocalItem('UserLoginInfo', response);
          clearAllWebViewCache();
          //存储设备信息
          mui.plusReady(function(){
            if (mui.os.plus) {
              var device_info = plus.push.getClientInfo();
              apiRequest(`system/device`,{
                client_id: device_info.clientid,
                device_token: device_info.token,
                appid: device_info.appid,
                appkey: device_info.appkey,
                device_type: plus.os.name === 'iOS' ? 2 : 1
              }).then(res => {

              });
            }
          });

          this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.user_id, user => {
            let currentUser = user;
            //localEvent.setLocalItem('userInfo', currentUser);
            cb(currentUser);
            router.pushPlus('/my',true,'none','none');
          }));
        })
        .catch(({ response: { data = {} } = {} } ) => {

          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          mui.toast(errorCodes[code]);
        });
      }
    }
  };

  export default login;

</script>

<style lang="less" rel="stylesheet/less" scoped>
  .login{
    position:absolute;
    width:100%;
    height:100%;
    background: url(../statics/images/bg_login.png);
    background-size: cover;
    text-align: center;
  }

  .logo{
    display: inline-block;
    background: url(../statics/images/login-logo.png);
    background-size: cover;
    width:182px;
    height:37px;
    margin:140px 0 80px;
  }

  input[type='text'],input[type='password'],input[type='number']{
    background-color:transparent;
    border:none;
    text-align: center;
    color:#fff;
    margin-bottom:0;
  }

  .inputWrapper{
    border-bottom:1px solid rgba(255,255,255, 0.3);
    margin:0 60px;
    padding:10px 0;
    position: relative;
  }

  .inputWrapper label{
    position: absolute;
    left:0;
    color:#fff;
    width:100%;
    text-align: center;
    top:50%;
    margin-top:-8px;

  }
  .forget{
    color:rgba(255,255,255, .6);
    font-size:14px;
    text-align: right;
    padding: 10px 60px;
  }

  .buttonWrapper{
    padding:0 112px;
    margin-top:80px;
  }

  .buttonWrapper button{
    margin-bottom:30px;
  }

  .mui-btn-outlined{
    color:#fff;
    border:1px solid #fff;
  }

  .mui-btn-block {
    padding: 10px 0;
  }

  .leftNav{
    position: absolute;
    padding:30px;
    left:0;
    top:0;
  }
  .leftNav span{
    background: url(../statics/images/icon-login-left.png)  no-repeat ;
    background-size: cover;
    width:10px;
    height:17px;
    position: absolute;
    left:10px;
    top:10px;
  }
</style>

