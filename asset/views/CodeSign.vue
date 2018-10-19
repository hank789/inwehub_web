<template>
  <div>
    <div class="mui-content">
      <div class="login">
        <div class="logo">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-logowenzi"></use>
          </svg>
        </div>
        <div class="inputWrapper half">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoujihao"></use>
          </svg>
          <input placeholder="请输入手机号" pattern="\d*" ref="phone" @focus="focus" @blur="blur"
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

        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :loading="isLoading" @click.prevent="submit"
                :disabled="disableRegister">登录
        </button>
        <div class="registerPassword">
          <span>未注册验证即自动创建账号</span>
          <span class="font-family-medium" @tap.stop.prevent="$router.pushPlus('/passwordlogin')">密码登录</span>
        </div>

        <div class="weChat" @tap.stop.prevent="wechatLogin()">
          <div class="weChatIcon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wechat"></use>
            </svg>
          </div>
          <span>微信授权登录</span>
        </div>

        <div class="protocol">注册即同意<span @tap.stop.prevent="$router.pushPlus('/protocol/register')">《用户注册服务协议》</span></div>
      </div>

      <oauth ref="oauth" :isShowBtn="false" @success="wechatLoginSuccess" @fail="wechatLoginFail"
             style="display:none"></oauth>
    </div>
  </div>
</template>

<script>
  import { apiRequest, postRequest } from '../utils/request'
  import localEvent from '../stores/localStorage'
  import errorCodes from '../stores/errorCodes'
  import oauth from '../components/oauth/oauth'
  import { getUserInfo } from '../utils/user'
  import { USERS_APPEND } from '../stores/types'
  import { openFullscreen, closeFullscreen } from '../utils/plus'
  import { saveLocationInfo } from '../utils/allPlatform'
  import { rebootAuth } from '../utils/wechat'
  import { clearAllWebViewCache } from '../utils/webview'
  import Vue from 'vue'
  import VTooltip from 'v-tooltip'
  Vue.use(VTooltip)

  // 手机号码规则
  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/
  const register = {
    data: () => ({
      phone: '', // 手机号码
      code: '', // 手机验证码
      isCanGetCode: false,
      errors: {}, // 错误对象
      isValidCode: false, // 验证码合法性
      isValidPhone: false, // 是否合法手机号
      CodeText: '发送验证', // 获取验证码按钮文字
      registrationCode: '',
      time: 0, // 时间倒计时
      showYzmLabel: true,
      showPhoneLabel: true,
      disableRegister: true,
      errorMsg: '',
      isRegisterSuccess: false,
      isLoading: false // 登录loading
    }),
    computed: {
      getCodeText () {
        return this.time === 0 ? '发送验证' : this.time + '秒后重发'
      }
    },
    created () {
      clearAllWebViewCache()
    },
    components: {
      oauth
    },
    mounted () {
      window.mui('.login').on('focusout', 'input', (e) => {
        switch (e.target.name) {
          case 'code':
            if (!this.code) this.showYzmLabel = true
            break
          case 'phone':
            if (!this.phone) this.showPhoneLabel = true
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
        }
      })
    },
    beforeRouteEnter (to, from, next) {
      if (window.mui.os.wechat) {
        if (process.env.NODE_ENV === 'development') {
          next()
          return
        }

        var hash = null
        if (to.query.redirect) {
          hash = to.query.redirect
        }

        var userAgent = window.navigator.userAgent

        if (userAgent.match(/WindowsWechat/)) {
          next()
          return false
        }

        rebootAuth(hash)
        // -----
        return
      }

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
      wechatLoginSuccess (token, openid, nickname = '', isNewUser = '') {
        console.log(token)
        console.log(openid)
        if (token) {
          this.$router.pushPlus('/wechat/register?token=' + token + '&openid=' + openid + '&newUser=' + isNewUser)
        } else {
          this.$router.pushPlus('/wechat/register?openid=' + openid)
        }
      },
      wechatLoginFail (errorMessage) {
        console.log(errorMessage)
        window.mui.toast(errorMessage)
      },
      wechatLogin () {
        this.$refs.oauth.login('weixin')
      },
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
      entryPhone () {
        this.showPhoneLabel = false
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
      cleanUsername () {
        this.username = ''
      },
      // 获取验证码
      getCode () {
        let mobile = this.phone ? this.phone : ''
        let type = 'login'

        if (!this.isCanGetCode) {
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
      loginSuccessCallback () {
        this.$parent.$refs.OpenAppComponent.refreshData()

        // 存储设备信息
        window.mui.plusReady(function () {
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
        })

        // 获取用户信息
        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user)
          window.mixpanelIdentify()
          clearAllWebViewCache()
          // 存储用户位置信息
          saveLocationInfo()
          this.$router.pushPlus('/home', '', true, 'none', 'none', true, true)
        }))
      },

      submit () {
        if (!this.phone) {
          window.mui.toast('请输入手机号')
          return
        }

        if (!phoneReg.test(this.phone)) {
          window.mui.toast('请输入正确的手机号')
          return
        }

        let {phone, code} = this
        this.isLoading = true
        apiRequest('auth/login', {
          mobile: phone,
          phoneCode: code
        })
          .then(response => {
            if (response === false) {
              return
            }
            localEvent.setLocalItem('UserLoginInfo', response)

            this.loginSuccessCallback()
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
  .registerPassword {
    padding: 0 0.986rem;
    display: flex;
    justify-content: space-between;
    span {
      &:nth-of-type(1) {
        color: #B4B4B6;
        font-size: 0.32rem;
        text-align: left;
      }
      &:nth-of-type(2) {
        color: #444444;
        font-size: 0.4rem;
      }
    }
  }
  .weChat {
    position: absolute;
    bottom: 1.493rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    .weChatIcon {
      width: 1.066rem;
      height: 1.066rem;
      margin: 0 auto;
      color: #FFFFFF;
      font-size: 0.666rem;
      line-height: 1.066rem;
      border-radius: 50%;
      background: linear-gradient(155deg,#7ADF75 0%,#51C944 100%);
    }
    span {
      color: #B4B4B6;
      font-size: 0.293rem;
      margin-top: 0.16rem;
    }
  }
  .mui-content{
    background: #FFFFFF;
    min-height: 15.146rem;
  }
  .login {
    position: absolute;
    width: 100%;
    min-height: 100%;
    background: #FFFFFF;
    background-size: cover;
  }
  /*协议*/
  .protocol {
    position: absolute;
    bottom: 0.533rem;
    left: 50%;
    transform: translateX(-50%);
    color: #808080;
    text-align: center;
    font-size: 0.32rem;
    span {
      color: #3C95F9;
    }
  }

  /*登录*/
  .button, .mui-btn {
    border-radius: 0.133rem;
    width: 80%;
    margin-left: 10%;
    margin-top: 0.4rem;
    margin-bottom: 0.32rem;
  }

  button {
    border-radius: 0.133rem;
    &:disabled {
      background: #DCDCDC;
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
    font-size: 3.946rem;
    text-align: center;
    margin: 0.133rem 0;
    padding-top: 0.533rem;
    height: 3.946rem;
  }

  /*输入框的内容*/
  .inputWrapper {
    margin: 0 0.88rem 0.666rem;
    position: relative;
    width: 80%;
    margin-left: 10%;
    .icon {
      position: absolute;
      top: 0.133rem;
      font-size: 0.586rem;
      color: #c8c8c8;
      left: 0;
    }
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
    color: #444444;
    position: absolute;
    right: 0.053rem;
    top: 0.12rem;
    height: 0.8rem;
    padding: 0 0.4rem;
    line-height: 0.8rem;
    border-radius: 0.133rem;
    border: 0.026rem solid #dcdcdc;
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
