<template>
  <div>
    <div class="mui-content">
      <div class="privilege_T">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logolanse"></use>
        </svg>
        <div class="privilege_avatar">
          <img :src="inviterAvatar"/>
        </div>
        <div class="privilege_share">
          <span>{{ inviterName }}向你发送了特权～</span>
          <span>邀请好友注册立享5%现金分红</span>
        </div>
        <div class="privilege_verification">
          <p class="verification_t">（首次登陆可获1元提问特权）</p>
          <ul>
            <li>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoujihao"></use>
              </svg>
              <input ref="phone" pattern="\d*" type="text" @focus="focus" @blur="blur" maxlength="11"
                     placeholder="请输入手机号"
                     name="phone" @hover.stop.prevent="" v-model.trim.num="phone" autocomplete="off"
                     v-tooltip="{content:errorMsg, placement:'bottom', trigger:'manual'}"/>
              <span @tap.stop.prevent="getCode" v-if="!isCanGetCode">{{getCodeText}}</span>
              <span class="getYzm" @tap.stop.prevent="getCode" v-else>{{getCodeText}}</span>
            </li>
            <li>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yanzhengma"></use>
              </svg>
              <input type="text" placeholder="请输入验证码" ref="code"
                     v-tooltip="{content:'请输入验证码', placement:'bottom', trigger:'manual'}" @focus="focus" @blur="blur"
                     name="code" v-model.trim.num="code" autocomplete="off"/>

            </li>
            <li>
              <button :disabled="disableRegister" @click.prevent="register">领取特权</button>
              <img src="../../statics/images/money@3x.png"/>
            </li>
          </ul>
          <p class="verification_b">号码将作为您InweHub账号</p>
        </div>
        <div class="verification_bg">

        </div>
      </div>
      <div class="privilege_B">
        <P>最具品质的咨询顾问社区</P>
        <P>长见识 / 解疑惑／寻合作／树形象／得收益</P>
        <div class="margin-10-0-0">
          <img src="../../statics/images/privilege@3x.png"/>
        </div>
        <P>www.inwehub.com</P>
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

          window.clearAllWebViewCache()

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
        if (!openid) {
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
          openid: this.openid,
          rcCode: this.rcCode
        }

        postRequest('auth/wxgzh/check_rg', data)
          .then(response => {
            var code = response.data.code

            if (code !== 1000) {
              if (code === 1115) {
                // 去填写注册信息
                data.redirect = this.redirect
                localEvent.setLocalItem('wechatInfo', data)
                this.$router.push({path: '/invitation/info'})
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
                this.$router.pushPlus('/my', '', true, 'none', 'none', true, true)
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


<style scoped>
  /*清除样式*/
  div, ul, li, p, span, a, i {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .mui-content {
    background: #ececee;
  }

  /*领取特权部分*/
  .privilege_T {
    width: 100%;
    height: 602px;

    background: -webkit-gradient(linear, 0 0, 0 bottom, from(#44474B), to(rgba(113, 117, 120, 1)));

  }

  .privilege_T svg {
    font-size: 77px;
    margin-left: 16px;
  }

  /*用户头像部分*/
  .privilege_avatar {
    width: 100%;
    height: 93px;
    position: relative;
    top: -25px;
    /*border:1px solid #000000;*/
  }

  .privilege_avatar img {
    width: 73px;
    height: 73px;
    border: 2px solid #DBDCDB;
    border-radius: 50%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
  }

  /*分享现金红包cash*/
  .privilege_share {
    width: 92%;
    margin-left: 4%;
    height: 60px;
    background: #fcc816;
    border-radius: 14px;
    text-align: center;
    padding-top: 10px;
    margin-top: -10px;
    position: relative;

    /*border:1px solid #000000;*/
  }

  .privilege_share:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fcc816;
    position: absolute;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    left: 0px;
    right: 0;
    top: -10px;
    margin: auto;

  }

  .privilege_share span:nth-of-type(1) {
    display: block;
    font-size: 18px;
    color: #444444;
    font-weight: 600;
  }

  .privilege_share span:nth-of-type(2) {
    display: block;
    font-size: 14px;
    color: #444444;
  }

  /*验证部分*/
  .privilege_verification {
    width: 80%;
    margin-left: 10%;
    height: 237px;
    margin-top: 25px;
    position: relative;
    /*border:1px solid #000000;*/
  }

  .verification_t {
    font-size: 14px;
    color: #FFFFFF;
  }

  .verification_b {
    text-align: center;
    font-size: 12px;
    color: #b4b4b6;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .privilege_verification ul {
    width: 100%;
    overflow: hidden;
  }

  .privilege_verification ul li {
    height: 30px;
    position: relative;
  }

  .privilege_verification ul li svg {
    font-size: 22px;
    color: #c8c8c8;
    margin-left: 5px;
    float: left;
  }

  .privilege_verification ul li input {
    width: 60%;
    height: 80%;
    float: left;
    background: #595D60;
    border: none;
    font-size: 14px;
    color: #FFFFFF;
    margin-left: -3.5px;
  }

  .privilege_verification ul li input::-webkit-input-placeholder {
    color: #b4b4b6;
    font-size: 14px;
  }

  .privilege_verification ul li input::-moz-placeholder {
    /* Firefox 18- */
    color: #b4b4b6;
    font-size: 14px;
  }

  .privilege_verification ul li input::-moz-placeholder {
    /* Firefox 19+ */
    color: #b4b4b6;
    font-size: 14px;
  }

  .privilege_verification ul li input::-moz-placeholder {
    /* Firefox 19+ */
    color: #b4b4b6;
    font-size: 14px;
  }

  .privilege_verification ul li span {
    width: 25%;
    height: 30px;
    border: 0.5px solid #808080;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 30px;
    float: right;
  }

  .privilege_verification ul li:nth-of-type(1) {
    margin-top: 17px;
    /*border:1px solid #000000;*/
  }

  .privilege_verification ul li:nth-of-type(2) {
    margin-top: 28px;
    /*border:1px solid #000000;*/
  }

  .privilege_verification ul li:nth-of-type(2) svg {
    font-size: 23px;
  }

  .privilege_verification ul li:nth-of-type(2) input {
    background: #5E6265;
  }

  .privilege_verification ul li:nth-of-type(1):after {
    position: absolute;
    right: 30%;
    bottom: 3px;
    left: 2%;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #808080;
  }

  .privilege_verification ul li:nth-of-type(2):after {
    position: absolute;
    right: 0px;
    bottom: 3px;
    left: 2%;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #808080;
  }

  .privilege_verification ul li:nth-of-type(3) {
    margin-top: 30px;
    height: 53px;

  }

  .privilege_verification ul li:nth-of-type(3) button {
    width: 150px;
    height: 53px;
    background: #03aef9;
    border-radius: 100px;
    border-color: #03aef9;
    font-size: 18px;
    color: #FFFFFF;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 99;
  }

  .privilege_verification ul li:nth-of-type(3) img {
    width: 41px;
    height: 29px;
    position: absolute;
    left: 66%;
    top: 37%;
  }

  /*信息部分*/
  .privilege_B {
    width: 100%;
    padding-bottom: 25px;
    position: relative;
    margin-top: 38px;
  }

  .privilege_B p:nth-of-type(1) {
    font-size: 18px;
    color: #444444;
    text-align: center;
    font-weight: 600;

  }

  .privilege_B p:nth-of-type(2) {
    font-size: 14px;
    color: #444444;
    text-align: center;
    margin-top: 8px;
    margin-bottom: 22px;

  }

  .privilege_B p:nth-of-type(3) {
    font-size: 14px;
    color: #808080;
    text-align: center;
    margin-top: 16px;

  }

  .privilege_B div {
    width: 100%;
    height: 347px;
    position: relative;

  }

  .privilege_B div img {
    width: 253px;
    height: 347px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;

  }

  .verification_bg {
    width: 100%;
    height: 120px;
    background: url("../../statics/images/graywave@3x.png") no-repeat;
    background-size: 100% 100%;
  }


</style>
