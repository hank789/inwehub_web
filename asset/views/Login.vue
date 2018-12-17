<template>
  <div>
    <div class="mui-content absolute">
      <div class="login">
        <div class="logo">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-logowenzi"></use>
          </svg>
        </div>


        <div class="inputWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoujihao"></use>
          </svg>
          <input ref="phone" type="text" pattern="\d*" autocomplete="off" v-model.number.trim="phone" placeholder="手机号码"
                 v-tooltip="{content:errorMsg, placement:'bottom', trigger:'manual'}" @focus="focus" @blur="blur"
                 @tap.stop.prevent="entryPhone"/>
        </div>
        <div class="inputWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-mima"></use>
          </svg>
          <input type="password" v-model.trim="password" placeholder="输入密码" @focus="focus" @blur="blur"
                 @tap.stop.prevent="entryPassword"/>
        </div>

        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.prevent="submit">登录</button>

        <!--忘记密码和账号-->
        <div class="apply">
          <span @tap.stop.prevent="$router.pushPlus('/findpassword/')">忘记密码？</span>
          <span class="font-family-medium" @tap.stop.prevent="$router.pushPlus('/login')">验证码登录</span>
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
  import Vue from 'vue'
  import { apiRequest } from '../utils/request'
  import localEvent from '../stores/localStorage'
  import { getUserInfo } from '../utils/user'
  import { USERS_APPEND } from '../stores/types'
  import { rebootAuth } from '../utils/wechat'
  import oauth from '../components/oauth/oauth'
  import { openFullscreen, closeFullscreen } from '../utils/plus'
  import { saveLocationInfo } from '../utils/allPlatform'
  import VTooltip from 'v-tooltip'
  Vue.use(VTooltip)

//  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/
  const phoneReg = /^[0-9]+$/
  const login = {
    data: () => ({
      phone: '', // 手机号码
      password: '', // 密码
      passwordText: '', // 明文密码
      isLoading: false, // 登录loading
      showPhoneLabel: true,
      showPasswordLabel: true,
      errorMsg: '',
      redirect: ''
    }),
    created () {},
    components: {
      oauth
    },
    watch: {
      phone: function (newMoney, oldValue) {
        const askDetail = /^[0-9]+$/
        if (!askDetail.test(newMoney) && this.phone) {
          this.phone = oldValue
        }
      }
    },
    mounted () {
      this.redirect = this.$route.query.redirect ? this.$route.query.redirect : '/home'
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-login')
        this.phone = ''
        this.password = ''
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

      next()
    },
    methods: {
      wechatLoginSuccess (token, openid, nickname = '', isNewUser = '') {
        console.log(token)
        console.log(openid)
        if (token) {
          this.$router.pushPlus('/wechat/register?newUser=' + isNewUser + '&token=' + token + '&openid=' + openid)
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
      entryPhone () {
        this.showPhoneLabel = false
      },
      entryPassword () {
        this.showPasswordLabel = false
      },
      goback () {
        window.mui.back()
      },
      loginSuccessCallback (newUser = 0) {
        if (!window.mui.os.plus) {
          this.$parent.$refs.OpenAppComponent.refreshData()
        }

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
          if (newUser >= 1) {
            window.trackMixpanelEvent('register:success', 'code-login', 'code-login', '验证码注册')
            window.mixpanelIdentify(true)
          } else {
            window.mixpanelIdentify()
          }
          // 存储用户位置信息
          saveLocationInfo()
          this.$router.pushPlus(this.redirect, '', true, 'none', 'none', true, true)
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

        if (!this.password) {
          window.mui.toast('请输入密码')
          return
        }

        if (this.password.length < 6) {
          window.mui.toast('密码长度必须大于等于6位')
          return
        }

        let {phone, password} = this
        let deviceSystem = ''
        let deviceName = ''
        let deviceModel = ''
        let deviceCode = ''
        if (window.mui.os.plus) {
          deviceName = window.plus.os.name
          deviceModel = window.plus.os.version
          deviceCode = window.plus.device.uuid
        }
        this.isLoading = true
        this.isDisabled = true
        apiRequest('auth/login', {
          mobile: phone,
          password,
          deviceSystem,
          deviceName,
          deviceModel,
          deviceCode
        })
          .then(response => {
            if (response === false) {
              return
            }
            localEvent.setLocalItem('UserLoginInfo', response)
            this.loginSuccessCallback(response.newUser)
          })
      }
    }
  }

  export default login

</script>

<style lang="less" rel="stylesheet/less" scoped>
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
  .login {
    position: absolute;
    width: 100%;
    min-height: 100%;
    background: #FFFFFF;
    background-size: cover;
    /*text-align: center;*/
  }

  /*图标*/
  .logo {
    font-size: 3.946rem;
    text-align: center;
    margin: 0.133rem 0;
    padding-top: 0.533rem;
    height: 3.946rem;
  }

  /*忘记密码和账号*/
  .apply {
    padding: 0 0.986rem;
    display: flex;
    line-height: 0.586rem;
    margin-top: 0.32rem;
    justify-content: space-between;
    span {
      &:nth-of-type(1) {
        color: #03AEF9;
        font-size: 0.32rem;
      }
      &:nth-of-type(2) {
        color: #444444;
        font-size: 0.4rem;
      }
    }
  }
  /*登录*/
  .button, .mui-btn {
    color: #FFFFFF;
    width: 80%;
    margin-left: 10%;
    margin-top: 0.133rem;
    background: #03AEF9;
    border-radius: 0.133rem;
  }
  .mui-btn-block {
    margin-bottom: 0;
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
    margin: 0 0.88rem 0.666rem;
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
    font-size: 0.373rem;
    color: #3c95f9;
    position: absolute;
    right: 0.053rem;
    top: 0.16rem;
    border: 0.026rem solid #3c95f9;
    border-radius: 0.133rem;
    padding: 0.08rem 0.373rem;
  }

  .inputWrapper .getYzm.disabled {
    border: 0.026rem solid #dcdcdc;
    color: #c8c8c8;
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
    /*padding: 0 0 0 0.96rem;*/
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

  .inputWrapper:nth-of-type(2) .icon {
    position: absolute;
    top: 0.133rem;
    font-size: 0.533rem;
    /*color: #c8c8c8;*/
    left: 0;
  }

  .wechatWrapper {
    position: absolute;
    bottom: 0.853rem;
    left: 50%;
    margin-left: -1.52rem;
    font-size: 0.373rem;
    color: #808080;
  }

  .myicon {
    display: inline-block;
    width: 0.693rem;
    height: 0.56rem;
    position: relative;
    top: 0.186rem;
  }

  .mui-content {
    background-color: #FFFFFF;
    min-height: 15.146rem;
  }
</style>

