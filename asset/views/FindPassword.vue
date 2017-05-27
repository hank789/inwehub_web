<template>

  <div class="mui-content">
    <div class="login">
      <div class="title">找回密码</div>
      <div class="leftNav" @tap.stop.prevent="goback"><span></span></div>
      <div class="inputWrapper">
        <input class="text" type="text" v-model.trim.num="phone" name="phone"/>
        <label @tap.stop.prevent="entryPhone" v-show="showPhoneLabel">手机号码</label>
      </div>
      <div class="inputWrapper">
        <input class="text" type="text" v-model.number.trim="code" name="code"/>
        <label @tap.stop.prevent="entryYzm" v-show="showYzmLabel">验证码</label>
        <span class="getYzm" @click="getCode" :disabled="!isCanGetCode">{{ getCodeText }}</span>
      </div>
      <div class="inputWrapper">
        <input class="text" type="password" v-model.trim="password" name="password"/>
        <label @tap.stop.prevent="entryPassword" v-show="showPasswordLabel">输入新密码</label>
      </div>


      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit">确认</button>
      </div>
    </div>
  </div>

</template>

<script>
  import router from '../routers/index';
  import request, { createAPI } from '../utils/request';
  import detecdOS from '../utils/detecdOS';
  import localEvent from '../stores/localStorage';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const codeReg = /^[0-9]{4}$/;
  const findPassword = {
    data: () => ({
      phone: '', // 手机号码
      password: '', // 密码
      code: '', // 手机验证码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isShowClean: false, // 是否显示清除手机号按钮
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      isCanGetCode: true,
      errors: {}, // 错误对象
      isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      CodeText: '获取验证码', // 获取验证码按钮文字
      time: 0, // 时间倒计时
      isLoading: false, // 登录loading
      showYzmLabel: true,
      showPhoneLabel: true,
      showPasswordLabel: true,
    }),
    mounted(){

      mui(".login").on('focusout', 'input', (e) => {
        switch (e.target.name) {
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
      entryPhone(){
        this.showPhoneLabel = false;
      },
      entryPassword(){
        this.showPasswordLabel = false;
      },
      entryYzm(){
        this.showYzmLabel = false;
      },
      // 清理请求错误
      cleanErrors () {
        let errors = this.errors;
        let newErrors = deleteObjectItems(errors, [
          'serverError'
        ]);
        this.errors = Object.assign({}, newErrors);
      },
      checkIsDisabled () {
         return !(this.isValidPassword && this.isValidPhone && this.isValidCode);
      },
      timer () {
        if (this.time > 0) {
          this.isCanGetCode = false;
          this.time -= 1;
          if(this.time == 0) {
            this.isCanGetCode = true;
            return;
          }
          setTimeout(this.timer, 1000)
        }
      },
      cleanPhone () {
        this.phone = '';
      },
      showPassword () {
        if(this.isShowPassword) {
          this.isShowPassword = false;
          this.isShowPasswordText = true;
        } else {
          this.isShowPassword = true;
          this.isShowPasswordText = false;
        }
      },
      // 获取验证码
      getCode () {
        let phone = this.phone;
        let type = 'change';

        if (!this.isCanGetCode) return;

        if (phone.length !== 11) {
            mui.toast("请正确输入手机号");
            return;
        }

        this.isCanGetCode = false;


        request.post(createAPI('auth/sendPhoneCode'), {
            mobile:phone,
            type
          }
        )
        .then(response => {
          if(response.data.code === 0 || response.data.status) {
            // 删除网络问题
            this.cleanErrors();
            this.time = 60;
            this.timer();
          }

          this.timer ();

          var code = response.data.code;
          if (code !== 1000) {
            this.isCanGetCode = true;
            mui.toast(response.data.message);
            return;
          }
        })
        .catch(({ response: { data = {} } = {} }) => {
          this.isCanGetCode = true;
          const { code = 'xxxx' } = data;
          this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code]});
        })
      },
      submit () {
        let { phone, code, password } = this;
        this.isLoading = true;
        this.isDisabled = true;

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

        if (!this.password) {
          mui.toast('请输入新密码');
          return;
        }

        if (this.password.length < 6) {
          mui.toast("新密码长度必须大于6位");
          return;
        }

        request.post(createAPI('auth/forgot'), {
            mobile:phone,
            code,
            password
          }
        )
        .then(response => {

          var code = response.data.code;


          if (code !== 1000) {
            this.isDisabled = false;
            this.isLoading = false;
            this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code] });
            return;
          }

          mui.toast('密码重置成功');
          this.$router.push({ path: '/login' });

        })
        .catch(({ response: { data = {} } ={} }) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code] });
          mui.toast(errorCodes[code]);
        })
      }
    },
    computed: {
      error: function () {
        let errors = Object.values(this.errors);
        return errors[0] || '';
      },
      getCodeText () {
        return this.time == 0 ? '获取验证码' : this.time + '秒后重发';
      }
    },
    watch: {
      phone: function (newPhone) {
        this.cleanErrors();
        this.isShowClean = (newPhone > 0) > 0 ? true : false;
        let errors = this.errors;
        if(!phoneReg.test(newPhone)) {
          this.errors = Object.assign({}, errors, { phone: '请输入正确的手机号码'});
          this.isValidPhone = false;
          this.isCanGetCode = false;
        } else {
          this.isValidPhone = true;
          this.isCanGetCode = true;
          delete errors['phone'];
          this.errors = Object.assign({}, errors);
        }

        this.isDisabled = this.checkIsDisabled();
      },
      password: function (newPassword) {
        this.cleanErrors();
        let errors = this.errors;
        if(newPassword.length < 6) {
          this.errors = Object.assign({}, errors, { password: '密码长度必须大于6位'})
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = Object.assign({}, errors);
        }
        this.passwordText = newPassword;
        this.isDisabled = this.checkIsDisabled();
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors();
        let errors = this.errors;
        if(newPasswordText.length < 6) {
          this.errors = Object.assign({}, errors, { password: '密码长度必须大于6位'})
          this.isValidPassword = false;
        } else {
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = Object.assign({}, errors);
        }
        this.password = newPasswordText;
        this.isDisabled = this.checkIsDisabled();
      },
      code: function (newCode) {
        this.cleanErrors();
        let errors = this.errors;
        if(!codeReg.test(newCode)) {
          this.errors = Object.assign({}, errors, { code: '验证码错误'});
          this.isValidCode = false;
        } else {
          this.isValidCode = true;
          delete errors['code'];
          this.errors = Object.assign({}, errors);
        }
        this.isDisabled = this.checkIsDisabled();
      }
    }
  }

  export default findPassword;

</script>
<style lang="less" rel="stylesheet/less" scoped>
  .login{
    position:absolute;
    width:100%;
    height:100%;
    background:#161616;
    background-size: cover;
    text-align: center;
  }

  .title{
    margin:140px 0 50px;
    font-size:36px;
    color:#fff;
  }

  input[type='text'],input[type='password']{
    background-color:transparent;
    border:none;
    text-align: center;
    color:#fff;
    margin-bottom:0;

  }

  .inputWrapper{
    border-bottom:1px solid rgba(255,255,255,.6);
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

  .inputWrapper .getYzm{
    position: absolute;
    right:0;
    color:rgba(255,255,255,.6);
    bottom:5px;
    font-size:14px;
  }

  .protocol{
    color:#fff;
    font-size:14px;
    padding: 10px 80px;

  }
  .protocol span{
    color:#F6A623;
  }

  .buttonWrapper{
    padding:0 122px;
    margin-top:40px;
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
