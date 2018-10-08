<template>
  <div>
    <div class="mui-content" v-show="!loading">
      <div class="privilege_T">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logolanse"></use>
        </svg>
        <div class="privilege_avatar">
          <div class="outermost"></div>
          <div class="innermost"></div>
          <img :src="inviterAvatar"/>
        </div>
        <div class="privilege_share">
          <span>{{ inviterName }}向你发送了特权～</span>
          <span>受邀注册可获随机现金奖励-可用于付费围观等</span>
        </div>
        <div class="privilege_verification">
          <button class="receivePrivilege" @click.prevent="register">领取特权</button>
          <img class="receivePrivilege-img" src="../../statics/images/money@3x.png"/>
          <div class="verification_b">点击即同意<span @tap.stop.prevent="$router.push('/protocol/register')">《用户注册服务协议》</span></div>
        </div>
        <div class="verification_bg"></div>
      </div>
      <div class="privilege_B">
        <span class="font-family-medium">企业级应用&amp;服务广场</span>
        <span>长见识／解疑惑／寻合作／树形象／得收益</span>
        <div class="margin-10-0-0">
          <img src="../../statics/images/privilege@3x.png"/>
        </div>
        <span>www.inwehub.com</span>
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
      inviterName: '',
      inviterAvatar: '',
      rcCode: '',
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
      this.checkRcCode()
      this.checkToken()
      this.getOpenId()
      this.checkCache()
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
        this.rcCode = this.$route.query.rc_code
        if (!this.rcCode) {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '发生一些错误',
              time: 1500,
              status: false
            })
          })
          this.$router.back()
          return
        }

        postRequest('activity/inviteRegister/getInviterInfo', {
          rc_code: this.rcCode
        })
          .then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }
            this.inviterName = response.data.data.inviter_name
            this.inviterAvatar = response.data.data.inviter_avatar
          })
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
      checkToken () {
        let token = this.$route.query.token
        if (token) {
          window.mui.waiting()
          var data = {
            token: token
          }
          localEvent.setLocalItem('UserLoginInfo', data)
          this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
            cb(user)
            window.mui.closeWaiting()
            window.mixpanelIdentify()
            if (window.mui.os.plus) {
              this.$router.pushPlus('/invitation/success', '', true, 'none', 'none', true, true)
            } else {
              this.$router.replace('/invitation/success')
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
            if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
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
        window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/invitation/register?rc_code=' + this.rcCode
      },
      mounted () {

      }
    }
  }
</script>


<style scoped lang="less">

  .mui-content {
    background: #ececee;
  }

  /*领取特权部分*/
  .privilege_T {
    width: 100%;
    height: 13rem;
    position: relative;
    background: -webkit-gradient(linear, 0 0, 0 bottom, from(#44474B), to(rgba(113, 117, 120, 1)));
    svg {
      font-size: 2.826rem;
      margin-left: 0.426rem;
      margin-top: -0.586rem;
    }
  }

  .privilege_avatar {
    width: 100%;
    height: 2.48rem;
    position: relative;
    top: -0.666rem;
    img {
      width: 1.946rem;
      height: 1.946rem;
      border: 0.053rem solid #A0A7AC;
      border-radius: 50%;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
      z-index: 12;
    }
  }

  .outermost {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    border:0.12rem solid #767a80;
    opacity: 0.2;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    opacity: 0;
    z-index: 9;
    animation: myapper 2s  0.1s infinite;
    -moz-animation: myapper 2s 0.1s infinite; /* Firefox */
    -webkit-animation: myapper 2s 0.1s infinite; /* Safari and Chrome */
    -o-animation: myapper  2s 0.1s infinite; /* Opera */
    animation-direction: alternate;
    -webkit-animation-direction: alternate;
  }
  @keyframes myapper {
    0% {
      opacity:0.2;
    }
    100% {
      opacity: 0;
    }
  }

  @-moz-keyframes myapper /* Firefox */
  {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-webkit-keyframes myapper /* Safari and Chrome */
  {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-o-keyframes myapper /* Opera */
  {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }


  .innermost {
    width: 2.133rem;
    height: 2.133rem;
    border: 0.106rem solid #757A7F;
    border-radius: 50%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    z-index: 11;
    opacity: 0;
    animation: myopactity 2s infinite;
    -moz-animation: myopactity 2s  infinite; /* Firefox */
    -webkit-animation: myopactity 2s  infinite; /* Safari and Chrome */
    -o-animation: myopactity 2s  infinite; /* Opera */
    animation-direction: alternate;
    -webkit-animation-direction: alternate;
  }
  @keyframes myopactity {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-moz-keyframes myopactity /* Firefox */
  {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-webkit-keyframes myopactity /* Safari and Chrome */
  {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-o-keyframes myopactity/* Opera */
  {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .privilege_share {
    width: 9.146rem;
    height: 1.653rem;
    margin: -0.266rem auto 0;
    background: #DCDCDC;
    text-align: center;
    padding-top: 0.213rem;
    position: relative;
    border-radius: 0.373rem;
    &:after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      border-left: 0.266rem solid transparent;
      border-right: 0.266rem solid transparent;
      border-bottom: 0.266rem solid #DCDCDC;
      position: absolute;
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      left: 0rem;
      right: 0;
      top: -0.24rem;
      margin: auto;
    }
    span {
      &:nth-of-type(1) {
        display: block;
        font-size: 0.48rem;
        color: #444444;
        font-weight: 600;
        line-height: 0.666rem;
      }
      &:nth-of-type(2) {
        display: block;
        font-size: 0.373rem;
        color: #444444;
        line-height: 0.533rem;
      }
    }
  }

  .verification_b {
    text-align: center;
    font-size: 0.32rem;
    color: #b4b4b6;
    position: absolute;
    bottom: 0.346rem;
    left: 0;
    right: 0;
    margin: auto;
    span {
      color: #FFFFFF;
    }
  }
  .privilege_verification {
    height: 3.013rem;
    margin-top: 0.8rem;
    position: relative;
    .receivePrivilege {
      width: 4rem;
      height: 1.413rem;
      background: #03aef9;
      border-radius: 2.666rem;
      border-color: #03aef9;
      font-size: 0.48rem;
      color: #FFFFFF;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 99;
    }
    .receivePrivilege-img {
      width: 1.093rem;
      height: 0.773rem;
      position: absolute;
      left: 6.426rem;
      top: 0.586rem;
    }
  }
  /*信息部分*/
  .privilege_B {
    width: 100%;
    padding-bottom: 0.666rem;
    position: relative;
    margin-top: 1.013rem;
    text-align: center;
      span {
        &:nth-of-type(1) {
          display: block;
          color: #444444;
          line-height: 0.666rem;
          font-size: 0.48rem;
        }
        &:nth-of-type(2) {
          color: #444444;
          line-height: 0.533rem;
          font-size: 0.373rem;
          margin-top: 0.186rem;
        }
        &:nth-of-type(3) {
          color: #808080;
          line-height: 0.533rem;
          font-size: 0.373rem;
          margin-top: 0.426rem;
        }
      }
    div {
      margin-top: 0.56rem;
      img {
        width: 6.746rem;
        height: 9.253rem;
        margin: 0 auto;
      }
    }
  }
  .verification_bg {
    width: 100%;
    height: 3.226rem;
    position: absolute;
    bottom: 0;
    background: url("../../statics/images/graywave@3x.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
