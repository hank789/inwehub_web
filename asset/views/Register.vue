<template>

  <div class="mui-content">
    <div class="login">
      <div class="title">用户注册</div>
      <div class="leftNav" @tap.stop.prevent="goback"><span></span></div>
      <div class="inputWrapper">
        <input class="text" type="text" name="username" v-model.trim="username" autocomplete="off"/>
        <label @tap.stop.prevent="entryUsername" v-show="showUsernameLabel">真实姓名</label>
      </div>
      <div class="inputWrapper">
        <input class="text" type="text" name="yqm" v-model.trim="registrationCode" autocomplete="off"/>
        <label @tap.stop.prevent="entryYqCode" v-show="showYqCodeLabel">邀请码</label>
      </div>
      <div class="inputWrapper">
        <input class="text" type="text" name="phone" v-model.trim.num="phone" autocomplete="off"/>
        <label @tap.stop.prevent="entryPhone" v-show="showPhoneLabel">手机号码</label>
      </div>
      <div class="inputWrapper">
        <input class="text" type="text" name="yzm" v-model.trim.num="code" autocomplete="off"/>
        <label @tap.stop.prevent="entryYzm" v-show="showYzmLabel">验证码</label>
        <span class="getYzm" @click.stop.prevent="getCode">{{ getCodeText }}</span>
      </div>
      <div class="inputWrapper">
        <input class="text" type="password" name="password" v-model.trim="password" autocomplete="off"/>
        <label @tap.stop.prevent="entryPassword" v-show="showPasswordLabel">登录密码</label>
      </div>
      <div class="protocol">注册即同意<span>《用户注册服务协议》</span></div>

      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :loading="isLoading"
                @click.prevent="register">注册
        </button>
      </div>
    </div>
  </div>


</template>

<script>
  import router from '../routers/index';
  import request, {createAPI, apiRequest} from '../utils/request';
  import detecdOS from '../utils/detecdOS';
  import localEvent from '../stores/localStorage';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import {getUserInfo} from '../utils/user';
  import {USERS_APPEND} from '../stores/types';

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/;
  const codeReg = /^[0-9]{4}$/;
  const register = {
    data: () => ({
      phone: '', // 手机号码
      password: '', // 密码
      username: '', // 昵称
      code: '', // 手机验证码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isShowClean: false, // 是否显示清除手机号按钮
      isShowUserClean: false,
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      isCanGetCode: true,
      errors: {}, // 错误对象
      isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      isValidUsername: false, // 用户名是否合法
      CodeText: '获取验证码', // 获取验证码按钮文字
      registrationCode: "",
      time: 0, // 时间倒计时
      showUsernameLabel: true,
      showYqCodeLabel: true,
      showYzmLabel: true,
      showPhoneLabel: true,
      showPasswordLabel: true,
      formItem: {
        input: ''
      },
      isLoading: false // 登录loading
    }),
    computed: {
      getCodeText () {
        return this.time == 0 ? '获取验证码' : this.time + '秒后重发';
      }
    },
    mounted(){

      mui(".login").on('focusout', 'input', (e) => {
        switch (e.target.name) {
          case 'username':
            if (!this.username) this.showUsernameLabel = true;
            break;
          case 'yqm':
            if (!this.registrationCode) this.showYqCodeLabel = true;
            break;
          case 'yzm':
            if (!this.code) this.showYzmLabel = true;
            break;
          case 'phone':
            if (!this.phone) this.showPhoneLabel = true;
            break;
          case 'password':
            if (!this.password) this.showPasswordLabel = true;
            break;
        }
      });

      mui(".login").on('focusin', 'input', (e) => {

        switch (e.target.name) {
          case 'username':
            this.showUsernameLabel = false;
            break;
          case 'yqm':
            this.showYqCodeLabel = false;
            break;
          case 'code':
            this.showYzmLabel = false;
            break;
          case 'phone':
            this.showPhoneLabel = false;
            break;
          case 'password':
            this.showPasswordLabel = false;
            break;
        }
      });
    },
    methods: {
      goback () {
        this.$router.go(-1);
      },
      entryUsername(){
        this.showUsernameLabel = false;
      },
      entryPhone(){
        this.showPhoneLabel = false;
      },
      entryPassword(){
        this.showPasswordLabel = false;
      },
      entryYqCode(){
        this.showYqCodeLabel = false;
      },
      entryYzm(){
        this.showYzmLabel = false;
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
      cleanPhone () {
        this.phone = '';
      },
      cleanUsername () {
        this.username = '';
      },
      showPassword () {
        if (this.isShowPassword) {
          this.isShowPassword = false;
          this.isShowPasswordText = true;
        } else {
          this.isShowPassword = true;
          this.isShowPasswordText = false;
        }
      },
      // 获取验证码
      getCode () {
        let mobile = this.phone;
        let type = 'register';

        if (!this.isCanGetCode) {
          return;
        }

        if (!this.registrationCode) {
          mui.toast("请输入邀请码");
          return;
        }

        if (this.registrationCode.length < 6) {
          mui.toast("邀请码至少6位");
          return;
        }

        if (mobile.length !== 11) {
          mui.toast("请正确填写手机号");
          return;
        }

        this.isCanGetCode = false;

        request.post(createAPI('auth/sendPhoneCode'), {
            mobile,
            type,
            'registration_code': this.registrationCode
          }
        )
          .then(response => {
            if (response.data.code === 0 || response.data.status) {
              // 删除网络问题
              this.cleanErrors();
              this.time = 60;
              this.timer();
            }

            var code = response.data.code;
            if (code !== 1000) {
              this.isCanGetCode = true;
              mui.toast(response.data.message);
              return;
            }
          })
          .catch(({response: {data = {}} = {}}) => {
            this.isCanGetCode = true;
            const {code = 'xxxx'} = data;
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]});
          })
      },
      // 注册
      register () {
        let {username, phone, code, password} = this;
        let device_code = detecdOS();
        this.isLoading = true;
        this.isDisabled = true;

        if (!this.username) {
          mui.toast("请输入真实姓名");
          return;
        }

        if (!usernameReg.test(this.username)) {
          mui.toast("用户名不能包含特殊符号以及空格");
          return;
        } else if (this.username.length > 12 || this.username.length <= 1) {
          mui.toast("请输入2-12位姓名");
        }

        if (!this.registrationCode) {
          mui.toast("请输入邀请码");
          return;
        }

        if (this.registrationCode.length < 6) {
          mui.toast("邀请码至少6位");
          return;
        }

        if (!phoneReg.test(this.phone)) {
          mui.toast("请正确输入手机号");
          return;
        }


        if (!this.code) {
          mui.toast("请输入验证码");
          return;
        }

        if (!codeReg.test(this.code)) {
          mui.toast('验证码错误');
          return;
        }

        if (this.registrationCode.length < 6) {
          mui.toast("邀请码至少6位");
          return;
        }

        if (this.password.length < 6) {
          mui.toast("密码长度必须大于6位");
          return;
        }

        request.post(createAPI('auth/register'), {
            name: username,
            mobile: phone,
            code,
            password,
            device_code,
            'registration_code': this.registrationCode
          }
        )
          .then(response => {
            var code = response.data.code;
            if (code !== 1000) {
              this.isDisabled = false;
              this.isLoading = false;
              mui.toast(response.data.message);
              return;
            }

            localEvent.setLocalItem('UserLoginInfo', response.data.data);
            this.isLoading = false;
            //存储设备信息
            if (mui.os.plus) {
              var device_info = plus.push.getClientInfo();
              apiRequest(`system/device`, {
                client_id: device_info.clientid,
                device_token: device_info.token,
                appid: device_info.appid,
                appkey: device_info.appkey,
                device_type: plus.os.name === 'iOS' ? 2 : 1
              }).then(res => {

              });
            }

            this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
              let currentUser = user;
              //localEvent.setLocalItem('userInfo', currentUser);
              cb(currentUser);
              router.push({path: 'my'});
            }));
          })
          .catch(({response: {data = {}} = {}}) => {
            this.isDisabled = false;
            const {code = 'xxxx'} = data;
            this.isLoading = false;
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]});
            mui.toast(errorCodes[code]);
          })
      }
    },
    watch: {
      phone: function (newMoney,oldValue) {
        const askDetail = /^[0-9]+$/;
        if (!askDetail.test(newMoney) && this.phone) {
          this.phone = oldValue;
        }
      }
    },
  }

  export default register;

</script>

<style lang="less" rel="stylesheet/less" scoped>
  .login {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url(../statics/images/bg_register.png);
    background-size: cover;
    text-align: center;
  }

  .title {
    margin: 140px 0 50px;
    font-size: 36px;
    color: #fff;
  }

  input[type='text'], input[type='password'] {
    background-color: transparent;
    border: none;
    text-align: center;

    color: #fff;
    margin-bottom: 0;

  }

  .inputWrapper {
    border-bottom: 1px solid rgba(255, 255, 255, .9);
    margin: 0 60px;
    padding: 10px 0;
    position: relative;
  }

  .inputWrapper label {
    position: absolute;
    left: 0;
    color: #fff;
    width: 100%;
    text-align: center;
    top: 50%;
    margin-top: -8px;
  }

  .inputWrapper .getYzm {
    position: absolute;
    right: 0;
    color: rgba(255, 255, 255, .6);
    bottom: 5px;
    font-size: 14px;
  }

  .protocol {
    color: #fff;
    font-size: 14px;
    padding: 10px 80px;

  }

  .protocol span {
    color: #F6A623;
  }

  .buttonWrapper {
    padding: 0 122px;
    margin-top: 40px;
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
