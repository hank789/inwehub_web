<template>
  <div>
    <div class="mui-content">
      <div class="login">
        <svg class="icon logo" aria-hidden="true">
          <use xlink:href="#icon-logo"></use>
        </svg>
        <!--返回箭头-->
        <svg class="icon leftNav" aria-hidden="true" @tap.stop.prevent="goback">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        <!--账号密码输入框-->

        <div class="inputWrapper" v-if="isNeedRegistrationCode">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yaoqingma"></use>
          </svg>
          <input placeholder="请输入邀请码" @focus="focus" @blur="blur" class="text" type="text" name="yqm"
                 v-model.trim="registrationCode" autocomplete="off" @tap.stop.prevent="entryYqCode"/>
        </div>
        <div class="inputWrapper half">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoujihao"></use>
          </svg>
          <input placeholder="请输入手机号" ref="phone" @focus="focus" @blur="blur"
                 v-tooltip="{content:errorMsg, placement:'bottom', trigger:'manual'}" @tap.stop.prevent="entryPhone"
                 class="text" type="text" name="phone" v-model.trim.num="phone" autocomplete="off">

          <span class="getYzm disabled" @tap.stop.prevent="getCode" v-if="!isCanGetCode">{{getCodeText}}</span>
          <span class="getYzm" @tap.stop.prevent="getCode" v-else>{{getCodeText}}</span>
        </div>
        <div class="inputWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yanzhengma"></use>
          </svg>
          <input placeholder="请输入验证码" @focus="focus" @blur="blur" class="text" type="text" name="code"
                 v-model.trim.num="code" autocomplete="off" @tap.stop.prevent="entryYzm"/>
        </div>
        <div class="inputWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-denglu"></use>
          </svg>
          <input placeholder="请输入真实姓名" @focus="focus" @blur="blur" class="text" type="text" name="username"
                 v-model.trim="username" autocomplete="off" @tap.stop.prevent="entryUsername"/>
        </div>
        <div class="inputWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-mima"></use>
          </svg>
          <input placeholder="请输入登录密码" @focus="focus" @blur="blur" class="text" type="password" name="password"
                 v-model.trim="password" autocomplete="off"/>
        </div>

        <div class="protocol">注册即同意<span @tap.stop.prevent="$router.pushPlus('/protocol/register')">《用户注册服务协议》</span>
        </div>

        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :loading="isLoading" @click.prevent="register"
                :disabled="disableRegister">确认

      </button>

        <div class="help" @tap.stop.prevent="jumpToForm" v-if="isNeedRegistrationCode">
          我没有邀请码?


        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import request, { createAPI, apiRequest, postRequest } from '../utils/request'
  import localEvent from '../stores/localStorage'
  import errorCodes from '../stores/errorCodes'
  import { getUserInfo } from '../utils/user'
  import { USERS_APPEND } from '../stores/types'
  import { openFullscreen, closeFullscreen } from '../utils/plus'
  import { saveLocationInfo } from '../utils/allPlatform'
  import Vue from 'vue'
  import VTooltip from 'v-tooltip'
  Vue.use(VTooltip)

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/
  const usernameReg = /^[a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9_\u4E00-\u9FA5\uF900-\uFA2D]*$/
  const codeReg = /^[0-9]{4}$/
  const register = {
    data: () => ({
      isNeedRegistrationCode: false,
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
      isCanGetCode: false,
      errors: {}, // 错误对象
      isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      isValidPassword: false, // 是否合法密码
      isValidUsername: false, // 用户名是否合法
      CodeText: '获取验证码', // 获取验证码按钮文字
      registrationCode: '',
      time: 0, // 时间倒计时
      showUsernameLabel: true,
      showYqCodeLabel: true,
      showYzmLabel: true,
      showPhoneLabel: true,
      showPasswordLabel: true,
      disableRegister: true,
      errorMsg: '',
      formItem: {
        input: ''
      },
      isRegisterSuccess: false,
      isLoading: false // 登录loading
    }),
    computed: {
      getCodeText () {
        return this.time === 0 ? '获取验证码' : this.time + '秒后重发'
      }
    },
    created () {
      window.showInwehubWebview()
    },
    mounted () {
      this.getCacheData()

      window.mui('.login').on('focusout', 'input', (e) => {
        switch (e.target.name) {
          case 'username':
            if (!this.username) this.showUsernameLabel = true
            break
          case 'yqm':
            if (!this.registrationCode) this.showYqCodeLabel = true
            break
          case 'code':
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
          case 'username':
            this.showUsernameLabel = false
            break
          case 'yqm':
            this.showYqCodeLabel = false
            break
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
    beforeRouteEnter (to, from, next) {
      openFullscreen()

      next()
    },
    beforeRouteLeave (to, from, next) {
      closeFullscreen()

      if (!this.isRegisterSuccess) {
        this.setCacheData()
      }

      next()
    },
    methods: {
      // 判断否有值（改变button按钮的状态来改变颜色）；
      checkValid () {
        // 手机；
        if (!this.phone) {
          this.disableRegister = true
          return false
        }
        // 验证码；
        if (!this.code) {
          this.disableRegister = true
          return false
        }
        // 邀请码；
        if (this.isNeedRegistrationCode && !this.registrationCode) {
          this.disableRegister = true
          return false
        }
        // 姓名；
        if (!this.username) {
          this.disableRegister = true
          return false
        }
        // 密码
        if (!this.password) {
          this.disableRegister = true
          return false
        }

        this.disableRegister = false
      },
      // 判断手机号是否为空；改变颜色（状态）；
      checkSendCodeValid () {
        if (!this.phone) {
          this.isCanGetCode = false
          return false
        }

        this.isCanGetCode = true
      },
      // 提示
      showTip (obj, msg) {
        this.errorMsg = msg
        obj._tooltip.show()
        setTimeout(() => {
          obj._tooltip.hide()
        }, 2000)
      },
      // 弹窗；
      warm (content, point, callback) {
        var title =
          '<svg class="icon colse" aria-hidden="true" style="font-size:0.48rem; color:#808080; position: absolute; right:0.213rem; top:0.213rem;" id="warmClosealert">' +
          '<use xlink:href="#icon-guanbi"></use>' +
          '</svg>'

        var cont = '<p style="font-size:0.426rem; margin-bottom:0.4rem" >' +
          point +
          '</p>'

        var alertobj = window.mui.alert(content, title, cont, (index, animate) => {
          if (index.index === -1) {
            callback()
          }
        }, 'div')

        document.getElementById('warmClosealert').onclick = () => {
          alertobj.close({index: 1, value: ''})
        }
      },
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
      jumpToForm () {
        this.$router.pushPlus('/register/nocode')
      },
      goback () {
        window.mui.back()
      },
      entryUsername () {
        this.showUsernameLabel = false
      },
      entryPhone () {
        this.showPhoneLabel = false
      },
      entryPassword () {
        this.showPasswordLabel = false
      },
      entryYqCode () {
        this.showYqCodeLabel = false
      },
      entryYzm () {
        this.showYzmLabel = false
      },
      timer () {
        if (this.time > 0) {
          this.isCanGetCode = true
          this.time -= 1
          if (this.time === 0) {
            this.isCanGetCode = false
            return
          }
          setTimeout(this.timer, 1000)
        }
      },
      cleanPhone () {
        this.phone = ''
      },
      setCacheData () {
        var CacheRegister = {
          'username': this.username,
          'registrationCode': this.registrationCode,
          'phone': this.phone,
          'code': this.code,
          'password': this.password
        }
        localEvent.setLocalItem('CacheRegister', CacheRegister)
      },
      getCacheData () {
        var data = localEvent.getLocalItem('CacheRegister')
        if (data) {
          this.username = data.username
          this.registrationCode = data.registrationCode
          this.phone = data.phone
          this.code = data.code
          this.password = data.password

          if (this.username) {
            this.showUsernameLabel = false
          }

          if (this.registrationCode) {
            this.showYqCodeLabel = false
          }

          if (this.phone) {
            this.showPhoneLabel = false
          }

          if (this.code) {
            this.showYzmLabel = false
          }

          if (this.password) {
            this.showPasswordLabel = false
          }
        }
      },
      cleanUsername () {
        this.username = ''
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
        let mobile = this.phone ? this.phone : ''
        let type = 'register'

        if (!this.isCanGetCode) {
          return
        }

        if (this.isNeedRegistrationCode && !this.registrationCode) {
          window.mui.toast('请输入邀请码')
          return
        }

        if (this.isNeedRegistrationCode && this.registrationCode.length < 6) {
          window.mui.toast('邀请码至少6位')
          return
        }

        if (mobile.length !== 11) {
          this.showTip(this.$refs.phone, '请输入有效的手机号码')
          return
        }

        this.isCanGetCode = false

        postRequest('auth/sendPhoneCode', {
          mobile,
          type,
          'registration_code': this.registrationCode
        })
          .then(response => {
            var code = response.data.code
            if (code !== 1000) {
              this.isCanGetCode = true
              var message = response.data.message
              // 验证码超时 邀请码错误；
              if (message.indexOf('邀请码错误') > 0) {
                this.warm(message, '获取邀请码', () => {
                  this.$router.push('/register/nocode')
                })
              } else if (message.indexOf('无效') > 0) {
                this.warm(message, '重新发送', () => {
                  this.getCode()
                })
              } else if (message.indexOf('超时') > 0) {
                this.warm(message, '重新发送', () => {
                  this.getCode()
                })
              }
              window.mui.toast(response.data.message)

              return
            }

            this.time = 60
            this.timer()

            window.mui.toast('验证码发送成功')
            if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
              // mixpanel
              window.mixpanel.track(
                'inwehub:register:sendPhoneCode',
                {
                  'app': 'inwehub',
                  'user_device': window.getUserAppDevice(),
                  'page': 'register',
                  'page_name': 'register',
                  'page_title': '发送注册验证码',
                  'referrer_page': ''
                }
              )
            }
          })
          .catch(({response: {data = {}} = {}}) => {
            this.isCanGetCode = true
            const {code = 'xxxx'} = data
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]})
          })
      },

      // 注册
      register () {
        let {username, phone, code, password} = this
        this.isLoading = true
        this.isDisabled = true

        if (this.isNeedRegistrationCode && !this.registrationCode) {
          window.mui.toast('请输入邀请码')
          return
        }

        if (this.isNeedRegistrationCode && this.registrationCode.length < 6) {
          window.mui.toast('邀请码至少6位')
          return
        }

        if (!phoneReg.test(this.phone)) {
          this.showTip(this.$refs.phone, '请输入有效的手机号码')
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

        if (!this.username) {
          window.mui.toast('请输入真实姓名')
          return
        }

        if (!usernameReg.test(this.username)) {
          window.mui.toast('用户名不能包含特殊符号以及空格')
          return
        } else if (this.username.length > 12 || this.username.length <= 1) {
          window.mui.toast('请输入2-12位姓名')
        }

        if (this.password.length < 6) {
          window.mui.toast('密码长度必须大于6位')
          return
        }
        if (window.mui.os.plus) {
          window.mui.waiting()
        }

        request.post(createAPI('auth/register'), {
          name: username,
          mobile: phone,
          code,
          password,
          'registration_code': this.registrationCode
        })
          .then(response => {
            if (window.mui.os.plus) {
              window.mui.closeWaiting()
            }
            var code = response.data.code
            if (code !== 1000) {
              this.isDisabled = false
              this.isLoading = false
              // 邀请码；
              var message = response.data.message

              if (message.indexOf('无效') > 0) {
                this.wran(message, '获取邀请码', () => {
                  this.$router.push('/register/nocode')
                })
              }
              window.mui.toast(response.data.message)
              return
            }
            window.clearAllWebViewCache()

            localEvent.clearLocalItem('CacheRegister')
            this.isRegisterSuccess = true

            // 已经有通知发送注册成功的消息，并有积分提示
            // mui.toast("注册成功！");
            localEvent.setLocalItem('UserLoginInfo', response.data.data)
            this.isLoading = false
            // 存储设备信息
            if (window.mui.os.plus) {
              var deviceInfo = window.plus.push.getClientInfo()
              apiRequest(`system/device`, {
                client_id: deviceInfo.clientid,
                device_token: deviceInfo.token,
                appid: deviceInfo.appid,
                appkey: deviceInfo.appkey,
                device_type: window.plus.os.name === 'iOS' ? 2 : 1
              }, false).then(res => {
              })
            }

            this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
              cb(user)
              if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
                // mixpanel
                window.mixpanel.track(
                  'inwehub:register:success',
                  {
                    'app': 'inwehub',
                    'user_device': window.getUserAppDevice(),
                    'page': 'register',
                    'page_name': 'register',
                    'page_title': '注册成功',
                    'referrer_page': ''
                  }
                )
              }
              // 存储用户位置信息
              saveLocationInfo()
              this.$router.pushPlus('/home', '', true, 'none', 'none', true, true)
            }))
          })
          .catch(({response: {data = {}} = {}}) => {
            if (window.mui.os.plus) {
              window.plus.nativeUI.closeWaiting()
            }
            this.isDisabled = false
            const {code = 'xxxx'} = data
            this.isLoading = false
            this.errors = Object.assign({}, this.errors, {serverError: errorCodes[code]})
            window.mui.toast(errorCodes[code])
          })
      }
    },
    watch: {
      registrationCode: function (newValue, oldValue) {
        this.checkValid()
      },
      phone: function (newMoney, oldValue) {
        const askDetail = /^[0-9]+$/
        if (!askDetail.test(newMoney) && this.phone) {
          this.phone = oldValue
        }
        this.checkSendCodeValid()
        this.checkValid()
      },
      code: function (newValue, oldValue) {
        this.checkValid()
      },
      username: function (newValue, oldValue) {
        this.checkValid()
      },
      password: function (newValue, oldValue) {
        this.checkValid()
      }
    }
  }

  export default register

</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mui-content{
    background:#f3f4f6;
  }
  .login {
    position: absolute;
    width: 100%;
    min-height: 100%;
    background: #f3f4f6;
    background-size: cover;
    text-align: center;
  }

  /*协议*/
  .protocol {
    color: rgb(128, 128, 128);
    font-size: 0.32rem;
    width: 80%;
    margin-left: 10%;
    text-align: left;

  }

  .protocol span {
    color: #3c95f9;
  }

  /*登录*/
  .button, .mui-btn {
    border-radius: 0.133rem;
    width: 80%;
    margin-left: 10%;
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;

  }

  button {
    border-radius: 0.133rem;

    &:disabled {
      background: #dcdcdc;
      border: 0.026rem solid #dcdcdc;
      color: #b4b4b6;

    }
  }

  /*邀请码*/
  .help {
    font-size: 0.373rem;
    color: #3c95f9;
    text-align: center;

  }

  /*小箭头*/

  .leftNav {

    position: absolute;
    left: 0.32rem;
    top: 0.4rem;
    font-size: 0.533rem;
    color: #808080;
  }

  /*图标*/
  .logo {

    font-size: 2.933rem;
    margin: 1.066rem 0 1.2rem;

  }

  /*输入框的内容*/
  .inputWrapper .icon {
    position: absolute;
    top: 0.133rem;
    font-size: 0.586rem;
    color: #c8c8c8;
    left: 0;

  }

  .inputWrapper {
    margin: 0 0.88rem 0.586rem;
    position: relative;
    width: 80%;
    margin-left: 10%;

  }

  .inputWrapper.focus {

    &:after {
      background-color: #3c95f9;
    }

    .icon {
      color: #3c95f9;
    }
  }

  /*验证码*/
  .inputWrapper .getYzm {
    display: inline-block;
    font-size: 0.373rem;
    color: #3c95f9;
    position: absolute;
    right: 0.053rem;
    top: 0.112rem;
    border: 0.026rem solid #3c95f9;
    border-radius: 0.133rem;
    padding: 0.08rem 0.373rem;
  }

  .inputWrapper .getYzm.disabled {
    border: 0.026rem solid #dcdcdc;
    color: #444;
  }

  .inputWrapper:after {
    position: absolute;
    right: 0;
    bottom: 0.08rem;
    left: 0;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .inputWrapper input {
    color: #444;
    border: none;
    margin: 0;
    font-size: 0.373rem;
    background: none;
    display: inline-block;
    height: 0.96rem;
    margin-left: 0.4rem;
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

  /*手机号input输入框的调整*/
  .inputWrapper:nth-of-type(2) input {
    color: #444;
    border: none;
    margin: 0;
    font-size: 0.373rem;
    background: none;
    display: inline-block;
    height: 0.96rem;
    margin-left: 0.32rem;
    /*background: #ccc;*/
    width: 60%;
    margin-right: 40%;
  }

  .half:after {
    position: absolute;
    right: 36%;
    bottom: 0.08rem;
    left: 0;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }

  /*2 3图标大小的微调*/
  .inputWrapper:nth-of-type(3) .icon {
    position: absolute;
    top: 0.08rem;
    font-size: 0.666rem;
    /*color: #c8c8c8;*/
    left: 0;
  }

  .inputWrapper:nth-of-type(4) .icon {
    position: absolute;
    top: 0.08rem;
    font-size: 0.666rem;
    /*color: #c8c8c8;*/
    left: 0;
  }

  .inputWrapper:nth-of-type(5) .icon {
    position: absolute;
    top: 0.133rem;
    font-size: 0.533rem;
    /*color: #c8c8c8;*/
    left: 0;
  }

</style>
