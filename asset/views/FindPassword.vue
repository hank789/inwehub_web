<template>
  <div class="container">

      <Form :label-width="80">

        <Form-item label="手机号">
          <Row class="formChildrenRow bottom-border">
            <Col span="15">
              <Input type="text" size="large" autocomplete="off" placeholder="输入手机号码" v-model.trim.num="phone" id="phone" name="phone" />
            </Col>
            <Col span="1" class="flexend">
              <i v-on:click="cleanPhone" v-show="isShowClean" class="ivu-icon ivu-icon-close-circled"></i>
            </Col>
            <Col class="text-align-right" span="6" >
            <Button
              type="text"
              @click.native="getCode"
              htmlType="button"
              :disabled="!isCanGetCode"
              size="large"
              class="text-button nopadding"
            >
              {{ getCodeText }}
              </Button>
            </Col>
          </Row>
        </Form-item>


        <Form-item label="验证码">
          <Row>
          <Col span="10">
          <Input type="text" autocomplete="off" placeholder="请输入验证码" v-model.number.trim="code" id="code" name="code" />
          </Col>
          </Row>
        </Form-item>

        <Form-item label="新密码">
          <Row>
          <Col span="15" class="flexend">
          <Input type="password" v-show="isShowPassword" v-model.trim="password" placeholder="请输入6位以上登录密码" id="password" name="password" />
          <Input type="text"  v-model.trim="passwordText" v-show="isShowPasswordText" value="" placeholder="请输入6位以上登录密码" />
          </Col>
          <Col span="3" class="flexend">
          <i
            v-on:click="showPassword"
            class="ivu-icon"
            :class="{ 'ivu-icon-eye-disabled': isShowPasswordText, 'ivu-icon-eye': isShowPassword }"
          >
          </i>
          </Col>
          </Row>
        </Form-item>

        <Form-item>
          <Row :gutter="16">
            <Col span="24">
            <p class="notice error">{{ error }}</p>
            </Col>
          </Row>
        </Form-item>

        <Form-item>
          <Row :gutter="16">
            <Col span="24">

              <Button type="primary" htmlType="submit" :loading="isLoading" :disabled="isDisabled" class="loginButton" size="large" @click.prevent="submit">确认</Button>
            </Col>
          </Row>
        </Form-item>
      </Form>
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
      isCanGetCode: false,
      errors: {}, // 错误对象
      isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      CodeText: '获取验证码', // 获取验证码按钮文字
      time: 0, // 时间倒计时
      isLoading: false // 登录loading
    }),
    methods: {
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

          var code = response.data.code;
          if (code !== 1000) {
            this.isCanGetCode = true;
            this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code]});
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

          this.$Message.info('密码重置成功', 2, () => {
            router.push({ path: 'login' });
          });
        })
        .catch(({ response: { data = {} } ={} }) => {
          this.isDisabled = false;
          const { code = 'xxxx' } = data;
          this.isLoading = false;
          this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code] });
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
  .container{
    padding-top:10px;
    padding-right:10px;
  }
  .error{
    color:red;
  }
</style>
