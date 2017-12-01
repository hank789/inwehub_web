<template>
  <div>
    <div class="mui-content absolute">
      <div class="login">

        <svg class="icon logo" aria-hidden="true">
          <use xlink:href="#icon-logo"></use>
        </svg>


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


        <!--忘记密码和账号-->
        <div class="apply">
          <div>
            <span class="forget" @tap.stop.prevent="$router.pushPlus('/findpassword/')">忘记密码</span>
            <span class="nothing" @tap.stop.prevent="$router.pushPlus('/register/')">还没有账号?</span>
          </div>
        </div>
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.prevent="submit">登录</button>


        <div class="wechatWrapper" @tap.stop.prevent="wechatLogin()">
          <div class="myicon myicon-wechat"></div>
          通过微信登录



        </div>

      </div>

      <oauth ref="oauth" :isShowBtn="false" @success="wechatLoginSuccess" @fail="wechatLoginFail"
             style="display:none"></oauth>

    </div>
  </div>
</template>

<script>
  import { apiRequest } from '../utils/request'
  import localEvent from '../stores/localStorage'
  import detecdOS from '../utils/detecdOS'
  import errorCodes from '../stores/errorCodes'
  import { getUserInfo } from '../utils/user'
  import { USERS_APPEND } from '../stores/types'
  import { rebootAuth } from '../utils/wechat'
  import oauth from '../components/oauth/oauth'
  import { clearAllWebViewCache } from '../utils/webview'
  import { openFullscreen, closeFullscreen } from '../utils/plus'

  const phoneReg = /^(((13[0-9]{1})|14[0-9]{1}|(15[0-9]{1})|17[0-9]{1}|(18[0-9]{1}))+\d{8})$/
  const login = {
    data: () => ({
      phone: '', // 手机号码
      password: '', // 密码
      passwordText: '', // 明文密码
      isLoading: false, // 登录loading
      showPhoneLabel: true,
      showPasswordLabel: true,
      errorMsg: ''
    }),
    created () {
      clearAllWebViewCache()
    },
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
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-login')
        this.phone = ''
        this.password = ''
      })
    },
    beforeRouteEnter (to, from, next) {
      if (window.mui.os.wechat) {
        var hash = null
        if (to.query.redirect) {
          hash = to.query.redirect
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
      wechatLoginSuccess (token, openid) {
        console.log(token)
        console.log(openid)
        if (token) {
          this.$router.pushPlus('/wechat/register?token=' + token)
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
      loginSuccessCallback () {
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

          this.$router.pushPlus('/my', '', true, 'none', 'none', true, true)
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
        let deviceSystem = detecdOS()
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
            clearAllWebViewCache()

            this.loginSuccessCallback()
          })
          .catch(({response: {data = {}} = {}}) => {
            this.isDisabled = false
            const {code = 'xxxx'} = data
            this.isLoading = false
            window.mui.toast(errorCodes[code])
          })
      }
    }
  }

  export default login

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

  /*图标*/
  .logo {

    font-size: 110px;
    margin: 110px 0 75px;

  }

  /*忘记密码和账号*/
  .apply {
    width: 100%;
    height: 30px;
    position: relative;
    top: -22px;

  }

  .apply > div {
    width: 80%;
    height: 100%;
    position: absolute;
    top: 15px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    /*background: #DDDDDD;*/

  }

  .apply > div > span {
    color: #3c95f9;
    font-size: 14px;
  }

  .apply > div > span:nth-of-type(1) {
    display: block;
    float: left;
    width: 50%;
    text-align: left;
  }

  .apply > div > span:nth-of-type(2) {
    display: block;
    float: right;
    width: 50%;
    text-align: right;
  }

  /*登录*/
  .button, .mui-btn {
    border-radius: 5px;
    color: #f2f2f2;
    width: 80%;
    margin-left: 10%;
    margin-top: 5px;
    background: #3C95F9;
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

  .inputWrapper:nth-of-type(2) .icon {
    position: absolute;
    top: 5px;
    font-size: 20px;
    /*color: #c8c8c8;*/
    left: 0;
  }

  .wechatWrapper {
    position: absolute;
    bottom: 32px;
    left: 50%;
    margin-left: -57px;
    font-size: 14px;
    color: #808080;
  }

  .myicon {
    display: inline-block;
    width: 26px;
    height: 21px;
    position: relative;
    top: 7px;
  }

  .mui-content {
    background-color: #f3f4f6;
    min-height: 568px;
  }
</style>

