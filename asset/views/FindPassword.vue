<template>

  <div class="mui-content">
    <div class="login">
      <svg class="icon logo" aria-hidden="true">
        <use xlink:href="#icon-logo"></use>
      </svg>

      <svg class="icon leftNav" aria-hidden="true" @tap.stop.prevent="goback">
        <use xlink:href="#icon-fanhui"></use>
      </svg>

      <!--输入框-->
      <div class="inputWrapper half">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoujihao"></use>
        </svg>
        <input class="text" type="text" v-model.trim.num="phone" name="phone" @tap.stop.prevent="entryPhone"
               @focus="focus" @blur="blur" placeholder="输入手机号"/>
        <!--<span class="getYzm disabled" @click="getCode" v-if="!isCanGetCode">{{getCodeText}}</span>
       <span class="getYzm" @click="getCode"" v-else>{{getCodeText}}</span>-->

        <span class="getYzm" @click="getCode" :disabled="!isCanGetCode">{{ getCodeText }}</span>
      </div>
      <div class="inputWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yanzhengma"></use>
        </svg>
        <input class="text" type="text" v-model.number.trim="code" name="code" @tap.stop.prevent="entryYzm"
               @focus="focus" @blur="blur" placeholder="请输入验证码"/>
      </div>
      <div class="inputWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-mima"></use>
        </svg>
        <input type="password" placeholder="输入新密码" class="text" v-model.trim="password" name="password" @focus="focus"
               @blur="blur" @tap.stop.prevent="entryPassword"/>
      </div>

      <!--点击登录-->
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit">确认修改</button>

      <!--<div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit">确认</button>
      </div>-->
    </div>
  </div>

</template>

<script>
  import request, { createAPI } from '../utils/request'
  import errorCodes from '../stores/errorCodes'
  import deleteObjectItems from '../utils/deleteObjectItems'
  import { openFullscreen, closeFullscreen } from '../utils/plus'

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/
  const codeReg = /^[0-9]{4}$/
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
      showPasswordLabel: true
    }),
    created () {
      // showInwehubWebview();
    },
    mounted () {
      window.mui('.login').on('focusout', 'input', (e) => {
        switch (e.target.name) {
          case 'yzm':
            if (!this.code) this.showYzmLabel = true
            break
          case 'phone':
            if (!this.phone) this.showPhoneLabel = true
            break
          case 'password':
            if (!this.password) this.showPasswordLabel = true
            break
        }
      })

      window.mui('.login').on('focusin', 'input', (e) => {
        switch (e.target.name) {
          case 'code':
            this.showYzmLabel = false
            break
          case 'phone':
            this.showPhoneLabel = false
            break
          case 'password':
            this.showPasswordLabel = false
            break
        }
      })
    },
    methods: {
      // 变颜色；
      focus (event) {
        event.target.parentElement.className = event.target.parentElement.className.replace('focus', '')
        event.target.parentElement.className = event.target.parentElement.className.replace('blur', '')
        event.target.parentElement.className += ' focus'
      },
      blur () {
        event.target.parentElement.className = event.target.parentElement.className.replace('focus', '')
        event.target.parentElement.className = event.target.parentElement.className.replace('blur', '')
        event.target.parentElement.className += ' blur'
      },
      goback () {
        window.mui.back()
      },
      entryPhone () {
        this.showPhoneLabel = false
      },
      entryPassword () {
        this.showPasswordLabel = false
      },
      entryYzm () {
        this.showYzmLabel = false
      },
      // 清理请求错误
      cleanErrors () {
        let errors = this.errors
        let newErrors = deleteObjectItems(errors, [
          'serverError'
        ])
        this.errors = Object.assign({}, newErrors)
      },
      checkIsDisabled () {
        return !(this.isValidPassword && this.isValidPhone && this.isValidCode)
      },
      timer () {
        if (this.time > 0) {
          this.isCanGetCode = false
          this.time -= 1
          if (this.time === 0) {
            this.isCanGetCode = true
            return
          }
          setTimeout(this.timer, 1000)
        }
      },
      cleanPhone () {
        this.phone = ''
      },
      showPassword () {
        if (this.isShowPassword) {
          this.isShowPassword = false
          this.isShowPasswordText = true
        } else {
          this.isShowPassword = true
          this.isShowPasswordText = false
        }
      },
      // 获取验证码
      getCode () {
        let phone = this.phone
        let type = 'change'

        if (!this.isCanGetCode) return

        if (phone.length !== 11) {
          window.mui.toast('请正确输入手机号')
          return
        }

        this.isCanGetCode = false

        request.post(createAPI('auth/sendPhoneCode'), {
          mobile: phone,
          type
        })
          .then(response => {
            var code = response.data.code
            if (code !== 1000) {
              this.isCanGetCode = true
              window.mui.toast(response.data.message)
            } else {
              this.time = 60
              this.timer()
            }
          })
          .catch(({response: {data = {}} = {}}) => {
            this.isCanGetCode = true
            const {code = 'xxxx'} = data
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]})
          })
      },
      submit () {
        let {phone, code, password} = this
        this.isLoading = true
        this.isDisabled = true

        if (!phoneReg.test(this.phone)) {
          window.mui.toast('请正确输入手机号')
          return
        }

        if (!this.code) {
          window.mui.toast('请输入验证码')
          return
        }

        if (!codeReg.test(this.code)) {
          window.mui.toast('验证码错误')
          return
        }

        if (!this.password) {
          window.mui.toast('请输入新密码')
          return
        }

        if (this.password.length < 6) {
          window.mui.toast('新密码长度必须大于6位')
          return
        }

        request.post(createAPI('auth/forgot'), {
          mobile: phone,
          code,
          password
        })
          .then(response => {
            var code = response.data.code

            if (code !== 1000) {
              this.isDisabled = false
              this.isLoading = false
              this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]})
              return
            }

            window.mui.toast('密码重置成功')
            this.$router.push({path: '/login'})
          })
          .catch(({response: {data = {}} = {}}) => {
            this.isDisabled = false
            const {code = 'xxxx'} = data
            this.isLoading = false
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]})
            window.mui.toast(errorCodes[code])
          })
      }
    },
    beforeRouteEnter (to, from, next) {
      openFullscreen()
      next()
    },
    beforeRouteLeave (to, from, next) {
      closeFullscreen()
      next()
    },
    computed: {
      error: function () {
        let errors = Object.values(this.errors)
        return errors[0] || ''
      },
      getCodeText () {
        return this.time === 0 ? '获取验证码' : this.time + '秒后重发'
      }
    },
    watch: {
      phone: function (newPhone) {
        this.cleanErrors()
        this.isShowClean = (newPhone > 0) > 0
        let errors = this.errors
        if (!phoneReg.test(newPhone)) {
          this.errors = Object.assign({}, errors, {phone: '请输入正确的手机号码'})
          this.isValidPhone = false
          this.isCanGetCode = false
        } else {
          this.isValidPhone = true
          this.isCanGetCode = true
          delete errors['phone']
          this.errors = Object.assign({}, errors)
        }

        this.isDisabled = this.checkIsDisabled()
      },
      password: function (newPassword) {
        this.cleanErrors()
        let errors = this.errors
        if (newPassword.length < 6) {
          this.errors = Object.assign({}, errors, {password: '密码长度必须大于6位'})
          this.isValidPassword = false
        } else {
          this.isValidPassword = true
          delete errors['password']
          this.errors = Object.assign({}, errors)
        }
        this.passwordText = newPassword
        this.isDisabled = this.checkIsDisabled()
      },
      passwordText: function (newPasswordText) {
        this.cleanErrors()
        let errors = this.errors
        if (newPasswordText.length < 6) {
          this.errors = Object.assign({}, errors, {password: '密码长度必须大于6位'})
          this.isValidPassword = false
        } else {
          this.isValidPassword = true
          delete errors['password']
          this.errors = Object.assign({}, errors)
        }
        this.password = newPasswordText
        this.isDisabled = this.checkIsDisabled()
      },
      code: function (newCode) {
        this.cleanErrors()
        let errors = this.errors
        if (!codeReg.test(newCode)) {
          this.errors = Object.assign({}, errors, {code: '验证码错误'})
          this.isValidCode = false
        } else {
          this.isValidCode = true
          delete errors['code']
          this.errors = Object.assign({}, errors)
        }
        this.isDisabled = this.checkIsDisabled()
      }
    }
  }

  export default findPassword

</script>
<style lang="less" rel="stylesheet/less" scoped>
  .login {
    position: absolute;
    width: 100%;
    min-height: 100%;
    background: #f3f4f6;
    background-size: cover;
    text-align: center;
  }

  .logo {

    font-size: 110px;
    margin: 110px 0 75px;

  }

  /*小箭头*/
  .leftNav {

    position: absolute;
    left: 12px;
    top: 15px;
    font-size: 20px;
    color: #808080;
  }

  /*输入框的内容*/
  .inputWrapper .icon {
    position: absolute;
    top: 5px;
    font-size: 22px;
    color: #c8c8c8;
    left: 0;

  }

  .inputWrapper {
    margin: 0 33px 22px;
    position: relative;
    width: 80%;
    margin-left: 10%;

  }

  .inputWrapper.focus {

    /*&:after {
      background-color: #3c95f9;
    }*/

    .icon {
      color: #808080;
    }
  }

  .inputWrapper .getYzm {
    display: inline-block;
    font-size: 14px;
    color: #444;
    position: absolute;
    right: 2px;
    top: 4.5px;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    padding: 3px 14px;
  }

  .inputWrapper .getYzm.disabled {
    border: 1px solid #3c95f9;
    color: #3c95f9;
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
    /*padding: 0 0 0 36px;*/
    font-size: 14px;
    background: none;
    display: inline-block;
    height: 36px;
    margin-left: 15px;
  }

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: #b4b4b6;
  }

  input:-moz-placeholder, textarea:-moz-placeholder {
    color: #b4b4b6;
  }

  input::-moz-placeholder, textarea::-moz-placeholder {
    color: #b4b4b6;
  }

  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: #b4b4b6;
  }

  /*登录*/
  .button, .mui-btn {
    border-radius: 5px;
    color: #f2f2f2;
    width: 80%;
    margin-left: 10%;
    margin-top: 30px;
    background: #3C95F9;
  }

  /*2 3图标大小的微调*/
  .inputWrapper:nth-of-type(2) .icon {
    position: absolute;
    top: 5px;
    font-size: 25px;
    /*color: #c8c8c8;*/

    left: 0;
  }

  .inputWrapper:nth-of-type(3) .icon {
    position: absolute;
    top: 5px;
    font-size: 21px;
    /*color: #c8c8c8;*/
    left: 0;
  }

  /*手机号input输入框的调整*/
  .inputWrapper:nth-of-type(1) input {
    color: #444;
    border: none;
    margin: 0;
    font-size: 14px;
    background: none;
    display: inline-block;
    height: 36px;
    margin-left: 12px;
    /*background: #ccc; */
    width: 60%;
    margin-right: 40%;
  }

  .half:after {
    position: absolute;
    right: 36%;
    bottom: 3px;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }
</style>
