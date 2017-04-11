<template>
  <transition name="slide-left">
    <div class="container">
        <Form :label-width="80">

          <Form-item label="手机号">
            <Input type="text" size="large" autocomplete="off" placeholder="请输入手机号" v-model.number.trim="phone" id="phone" name="phone" />
          </Form-item>

          <Form-item label="密码">
            <Row>
              <Col span="17">
              <Input type="password"  size="large" v-show="isShowPassword" v-model.trim="password" placeholder="请输入6位以上密码" id="password" name="password" />
              <Input type="text"  v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="请输入6位以上密码" />
              </Col>
              <Col span="3" class="flexend">
              <i @click="showPassword" class="ivu-icon" :class="{ 'ivu-icon-eye-disabled': isShowPasswordText, 'ivu-icon-eye': isShowPassword }"></i>
              </Col>
            </Row>

          </Form-item>

          <Form-item>
            <Button type="primary" htmlType="submit" :loading="isLoading" :disabled="isDisabled" class="loginButton" size="large" @click.prevent="submit">登录</Button>
          </Form-item>

          <Form-item>
            <div class="otherOperation">
              <Row :gutter="16" >
                <Col span="6" >
                <router-link to="/register">
                  注册账号
                </router-link>
                </Col>
                <Col span="6">
                <router-link style="float: right" to="/findpassword">
                  找回密码
                </router-link>
                </Col>
              </Row>
            </div>
          </Form-item>

          <Form-item>
            <Row :gutter="16">
              <Col span="24">
              <p class="notice error">{{ error }}</p>
              </Col>
            </Row>
          </Form-item>
        </Form>
    </div>
  </transition>
</template>

<script>
  import request, { createAPI } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import router from '../routers/index';
  import detecdOS from '../utils/detecdOS';
  import errorCodes from '../stores/errorCodes';
  import deleteObjectItems from '../utils/deleteObjectItems';
  import { getUserInfo, getAvatar } from '../utils/user';
  import { USERS_APPEND } from '../stores/types';
  import defaultAvatar from '../statics/images/common_ico_bottom_me_normal@3x.png';

  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/;
  const login = {
    data: () => ({
      phone: '', // 手机号码
      password: '', // 密码
      passwordText: '', // 明文密码
      isDisabled: true, // 提交按钮disabled状态
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      isShowClean: false, // 是否显示清除手机号按钮
      isShowPasswordText: false, // 是否显示明文密码
      isShowPassword: true, // 是否显示真实密码
      errors: {}, // 错误对象
      isLoading: false // 登录loading
    }),
    watch: {
      phone: function (newPhone) {
        this.isShowClean = (newPhone > 0) > 0 ? true : false;
        this.cleanErrors();
        if(!phoneReg.test(newPhone)) {
          this.errors = Object.assign({}, this.errors, { phone: '请输入正确的手机号码' });
          this.isValidPhone = false;
        } else {
          let errors = this.errors;
          this.isValidPhone = true;
          delete errors['phone'];
          this.errors = Object.assign({}, errors);
        }
        this.isDisabled = this.checkIsDisabled()
      },
      password: function (newPassword) {
        this.cleanErrors();
        if(newPassword.length < 6) {
          this.errors = Object.assign({}, this.errors, { password: '密码长度必须大于6位' })
          this.isValidPassword = false;
        } else {
          let errors = this.errors;
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = Object.assign({}, errors);
        }
        this.passwordText = newPassword;
        this.isDisabled = this.checkIsDisabled()
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors();
        if(newPasswordText.length < 6) {
          this.errors = Object.assign({}, this.errors, { password: '密码长度必须大于6位' })
          this.isValidPassword = false;
        } else {
          let errors = this.errors;
          this.isValidPassword = true;
          delete errors['password'];
          this.errors = Object.assign({}, errors);
        }
        this.password = newPasswordText;
        this.isDisabled = this.checkIsDisabled();
      }
    },
    computed: {
      error: function () {
        let errors = Object.values(this.errors);
        return errors[0] || '';
      }
    },
    methods: {
      // 清理服务端错误信息
      cleanErrors () {
        let errors = this.errors;
        let newErrors = deleteObjectItems(errors, [
          'code'
        ]);
        this.errors = Object.assign({}, newErrors);
      },
      checkIsDisabled () {
         return !(this.isValidPassword && this.isValidPhone);
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
      submit () {
        let { phone, password } = this;
        let device_code = detecdOS();
        this.isLoading = true;
        this.isDisabled = true;
        request.post(createAPI('auth/login'), {
            mobile:phone,
            password,
            device_code
          }
        )
        .then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            this.isDisabled = false;
            this.isLoading = false;
            this.errors = Object.assign({}, this.errors, { code: errorCodes[code] });
          }

          let errors = {};
          this.errors = Object.assign({}, errors);
          localEvent.setLocalItem('UserLoginInfo', response.data.data);
          this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
            let currentUser = user;
            localEvent.setLocalItem('user_info', currentUser);
            cb(currentUser);
            router.push({ path: 'my' });
          }));
        })
        .catch(({ response: { data = {} } = {} } ) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = Object.assign({}, this.errors, { code: errorCodes[code] });
        });
      }
    }
  };

  export default login;

</script>

<style lang="less" rel="stylesheet/less" scoped>
  .container{
    padding-top:10px;
    padding-right:10px;
  }
  .error{
    color:red;
  }
</style>

