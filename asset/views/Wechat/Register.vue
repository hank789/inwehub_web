<template>
  <div class="mui-content">
    <div class="register" v-show="!loading">
      <!--<div class="logo">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-logo"></use>-->
        <!--</svg>-->
      <!--</div>-->

      <div class="register_logo">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-inwehubzuoyou"></use>
        </svg>
        <p>企业级应用&amp;服务广场</p>
        <p>长见识 / 解疑惑／寻合作／树形象／得收益</p>
      </div>

      <div class="inputWrapper" v-if="isNeedRegistrationCode">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yaoqingma"></use>
        </svg>
        <input class="text" ref="registrationCode" type="text" @focus="focus" @blur="blur" placeholder="请输入邀请码 已注册用户可忽略"
               name="registrationCode" v-model.trim.num="registrationCode" autocomplete="off"
               v-tooltip="{content:errorMsg, placement:'bottom', trigger:'manual'}"/>
      </div>

      <div class="inputWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoujihao"></use>
        </svg>
        <input class="text" ref="phone" pattern="\d*" type="text" @focus="focus" @blur="blur" maxlength="11"
               placeholder="输入手机号"
               name="phone" @hover.stop.prevent="" v-model.trim.num="phone" autocomplete="off"
               v-tooltip="{content:errorMsg, placement:'bottom', trigger:'manual'}"/>


        <span class="getYzm disabled" @tap.stop.prevent="getCode" v-if="!isCanGetCode">{{getCodeText}}</span>
        <span class="getYzm" @tap.stop.prevent="getCode" v-else>{{getCodeText}}</span>
      </div>

      <div class="inputWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yanzhengma"></use>
        </svg>
        <input class="text" ref="code" v-tooltip="{content:'请输入验证码', placement:'bottom', trigger:'manual'}" type="text"
               @focus="focus" @blur="blur" placeholder="输入验证码" name="code" v-model.trim.num="code" autocomplete="off"/>
      </div>

      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :disabled="disableRegister"
                @click.prevent="register">确认
        </button>
      </div>


      <div class="help" @tap.stop.prevent="jumpToForm" v-if="isNeedRegistrationCode">
        我没有邀请码？


      </div>
    </div>
  </div>
</template>


<script>

  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import errorCodes from '../../stores/errorCodes'

  import Vue from 'vue'
  import { NOTICE, USERS_APPEND } from '../../stores/types'
  import VTooltip from 'v-tooltip'
  import { getUserInfo } from '../../utils/user'
  import { saveLocationInfo } from '../../utils/allPlatform'

  Vue.use(VTooltip)

  export default {
    data: () => ({
      isNeedRegistrationCode: false,
      registrationCode: '', // 邀请码
      phone: '', // 手机号码
      isCanGetCode: false,
      time: 0, // 时间倒计时
      openid: '',
      code: '', // 手机验证码,
      disableRegister: true,
      disableSendCode: true,
      errorMsg: '',
      redirect: '',
      loading: true
    }),
    computed: {
      getCodeText () {
        return this.time === 0 ? '发送验证' : this.time + '秒后重发'
      }
    },
    created () {
      var isContinue = this.checkRcCode()
      console.log('isContinue:' + isContinue)
      if (isContinue) {
        this.checkToken()
        this.getOpenId()
        this.checkCache()
      }
    },
    watch: {
      registrationCode: function (newValue, oldValue) {
        this.checkValid()
      },
      phone: function (newValue, oldValue) {
        this.checkSendCodeValid()
        this.checkValid()
      },
      code: function (newValue, oldValue) {
        this.checkValid()
      }
    },
    methods: {
      checkRcCode () {
        this.redirect = this.$route.query.redirect || '/my'
        if (/invitation/.test(this.redirect)) {
          var token = this.$route.query.token || ''
          var openid = this.$route.query.openid || ''
          this.$router.replace({path: this.redirect + '&token=' + token + '&openid=' + openid})
          return false
        }
        return true
      },
      checkCache () {
        var cache = localEvent.getLocalItem('wechatInfo')
        if (cache.openid) {
          var openid = cache.openid
          if (openid === this.openid) {
            this.phone = cache.mobile
            this.code = cache.code
            this.registrationCode = cache.registration_code
          }
        }
      },
      jumpToForm () {
        window.location.href = 'https://jinshuju.net/f/bWXY8y'
      },
      checkToken () {
        let token = this.$route.query.token
        console.log('token:' + token)
        this.redirect = this.$route.query.redirect ? this.$route.query.redirect : '/my'
        if (token) {
          window.mui.waiting()
          var data = {
            token: token
          }
          localEvent.setLocalItem('UserLoginInfo', data)

          this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
            cb(user)
            window.mui.closeWaiting()
            var newUser = this.$route.query.newUser || ''
            if (newUser >= 1) {
              window.trackMixpanelEvent('register:success', 'oauth', 'wechat-oauth', '微信注册-' + newUser)
              window.mixpanelIdentify(true)
            } else {
              window.mixpanelIdentify()
            }
            // 存储用户位置信息
            saveLocationInfo()
            if (window.mui.os.plus) {
              this.$router.pushPlus('/home', '', true, 'none', 'none', true, true)
            } else {
              this.$router.replace({path: this.redirect})
            }
          }))
        } else {
          this.loading = false
        }
      },
      getOpenId () {
        let openid = this.$route.query.openid
        let redirect = this.$route.query.redirect ? this.$route.query.redirect : '/my'
        this.redirect = redirect
        if (!openid) {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '发生一些错误',
              time: 1500,
              status: false
            })
          })
          window.mui.toast('出错了：未找到openid')
          return
        }
        this.openid = openid
      },
      // 提示
      showTip (obj, msg) {
        this.errorMsg = msg
        obj._tooltip.show()
        setTimeout(() => {
          obj._tooltip.hide()
        }, 2000)
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
      getCode () {
        let mobile = this.phone
        let type = 'wx_gzh_register'

        if (!this.isCanGetCode) {
          return
        }

        if (mobile.length !== 11 || /^1\d{10}$/.test(mobile) === false) {
          this.showTip(this.$refs.phone, '请输入有效的手机号码')
          return
        }

        this.isCanGetCode = true

        postRequest('auth/sendPhoneCode', {
          mobile,
          type,
          openid: this.openid,
          'registration_code': this.registrationCode
        })
          .then(response => {
            var code = response.data.code
            if (code !== 1000) {
              this.isCanGetCode = true
              window.mui.toast(response.data.message)
              return
            }

            this.time = 120
            this.timer()

            window.mui.toast('验证码发送成功')
            if (process.env.NODE_ENV === 'production' && window.mixpanel) {
              // mixpanel
              window.mixpanel.track(
                'inwehub:register:sendPhoneCode',
                {
                  'app': 'inwehub',
                  'user_device': window.getUserAppDevice(),
                  'page': 'register-invitation',
                  'page_name': 'register-invitation',
                  'page_title': '发送邀请注册验证码',
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
      checkSendCodeValid () {
        if (!this.phone) {
          this.isCanGetCode = false
          return false
        }

        this.isCanGetCode = true
      },
      checkValid () {
        if (!this.phone) {
          this.disableRegister = true
          return false
        }

        if (!this.code) {
          this.disableRegister = true
          return false
        }

        this.disableRegister = false
      },
      register () {
        var data = {
          mobile: this.phone,
          code: this.code,
          registration_code: this.registrationCode,
          openid: this.openid
        }

        postRequest('auth/wxgzh/check_rg', data)
          .then(response => {
            var code = response.data.code

            if (code !== 1000) {
              if (code === 1115) {
                // 去填写注册信息
                data.redirect = this.redirect
                localEvent.setLocalItem('wechatInfo', data)
                this.$router.push({path: '/wechat/info'})
                return
              } else {
                window.mui.toast(response.data.message)
                return
              }
            }

            localEvent.setLocalItem('UserLoginInfo', response.data.data)

            this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
              cb(user)
              window.mixpanelIdentify()
              if (window.mui.os.plus) {
                this.$router.pushPlus('/home', '', true, 'none', 'none', true, true)
              } else {
                this.$router.replace({path: this.redirect})
              }
            }))
          })
      },
      mounted () {

      }
    }
  }
</script>


<style lang="less" rel="stylesheet/less" scoped>
  .logo {
    margin: 1.12rem 0 1.013rem;
    text-align: center;
  }

  .logo .icon {
    font-size: 3.333rem;
  }

  .inputWrapper .icon {
    position: absolute;
    top: 0.106rem;
    font-size: 0.64rem;
    color: #c8c8c8;
  }

  .inputWrapper {
    margin: 0 0.88rem 0.586rem;
    position: relative;
    top: 3.866rem;

  }

  .inputWrapper.focus {

    &:after {
      background-color: #3c95f9;
    }

    .icon {
      color: #3c95f9;
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
    padding: 0 0 0 0.96rem;
    font-size: 0.373rem;
    background: none;
    display: inline-block;
  }

  .register {
    background: #ffffff;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .buttonWrapper {
    margin: 1.066rem 0.96rem 0.426rem;
  }

  ::-webkit-input-placeholder {
    color: #b4b4b6;
  }

  .buttonWrapper button {
    border-radius: 0.133rem;
    top:3.6rem;

    &:disabled {
      background: #dcdcdc;
      border: 0.026rem solid #dcdcdc;
      color: #b4b4b6;

    }
  }

  .help {
    font-size: 0.373rem;
    color: #3c95f9;
    text-align: center;
  }
/*register_logo*/
  .register_logo{
    width:100%;
    height:3.2rem;
    background: #f3f4f6;
    position: absolute;
    top:0;
    padding-left: 1.013rem;
  }
  .register_logo svg{
    font-size: 3.733rem;
    position: absolute;
    top: -0.906rem;
  }
  .register_logo p{
    margin:0;
    padding:0;
    font-size: 0.373rem;
    color: #444444;
  }
  .register_logo p:nth-of-type(1){
     font-weight: 600;
     margin-top: 1.573rem;
  }

</style>
