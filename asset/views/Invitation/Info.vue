<template>
  <div>
    <div class="mui-content absolute">
      <div class="share_t">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logoxin"></use>
        </svg>
        <div class="share_bg">

        </div>
      </div>
      <!--注册-->
      <ul>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoujihao"></use>
          </svg>
          <input type="text" placeholder="请输入真实姓名" @focus="focus" @blur="blur" name="realname"
                 v-model.trim.num="realname" autocomplete="off">
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-denglu"></use>
          </svg>
          <input type="text" placeholder="请输入登录密码" @focus="focus" @blur="blur" name="password"
                 v-model.trim.num="password" autocomplete="off" ref="password">
        </li>
        <button :disabled="disableRegister"
                @click.prevent="register">离成功只差一步!</button>
        <p>点击即同意<i @tap.stop.prevent="$router.push('/protocol/register')">《用户注册服务协议》</i></p>
      </ul>

    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import { NOTICE, USERS_APPEND } from '../../stores/types'
  import { getUserInfo } from '../../utils/user'

  export default {
    data: () => ({
      isNeedRegistrationCode: false,
      phone: '',
      code: '',
      registration_code: '',
      openid: '',
      realname: '', // 真实姓名
      password: '', // 登录密码
      disableRegister: true,
      isRegisterSuccess: false,
      device_code: '',
      redirect: '',
      rcCode: ''
    }),
    watch: {
      realname: function (newValue, oldValue) {
        this.checkValid()
      },
      password: function (newValue, oldValue) {
        this.checkValid()
      }
    },
    created () {
      var data = localEvent.getLocalItem('wechatInfo')

      if (!data || data.length === 0) {
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

      this.phone = data.mobile
      this.code = data.code
      this.registration_code = data.registration_code
      this.openid = data.openid
      this.redirect = data.redirect
      this.rcCode = data.rcCode

      var self = this
      if (window.mui.os.plus) {
        window.mui.plusReady(() => {
          if (window.plus) {
            self.device_code = window.plus.device.uuid
          }
        })
      }
    },
    methods: {
      checkValid () {
        if (!this.realname) {
          this.disableRegister = true
          return false
        }

        if (!this.password) {
          this.disableRegister = true
          return false
        }

        this.disableRegister = false
      },
      getCacheData () {
        var data = localEvent.getLocalItem('weChatCacheRegister')
        if (data) {
          this.realname = data.realname
          this.password = data.password
        }
      },
      setCacheData () {
        var CacheRegister = {
          'realname': this.realname,
          'password': this.password
        }
        localEvent.setLocalItem('weChatCacheRegister', CacheRegister)
      },
      getCode () {

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
      register () {
        var data = {
          mobile: this.phone,
          name: this.realname,
          code: this.code,
          password: this.password,
          registration_code: this.registration_code,
          openid: this.openid,
          device_code: this.device_code,
          rc_code: this.rcCode
        }
        postRequest('auth/wxgzh/register', data)
          .then(response => {
            var code = response.data.code

            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }

            this.isRegisterSuccess = true

            localEvent.clearLocalItem('wechatInfo')
            localEvent.clearLocalItem('weChatCacheRegister')

            localEvent.setLocalItem('UserLoginInfo', response.data.data)

            this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
              cb(user)
              if (process.env.NODE_ENV === 'production' && window.mixpanel) {
                // mixpanel
                window.mixpanel.track(
                  'inwehub:register:success',
                  {
                    'app': 'inwehub',
                    'user_device': window.getUserAppDevice(),
                    'page': 'register-invitation',
                    'page_name': 'register-invitation',
                    'page_title': '邀请注册成功',
                    'referrer_page': ''
                  }
                )
                window.mixpanelIdentify(true)
              }

              if (window.mui.os.plus) {
                this.$router.pushPlus('/invitation/success', '', true, 'none', 'none', true, true)
              } else {
                this.$router.replace('/invitation/success')
              }
            }))
          })
      }
    },
    mounted () {
      if (!this.isRegisterSuccess) {
        this.getCacheData()
      }
    },
    beforeRouteLeave (to, from, next) {
      if (!this.isRegisterSuccess) {
        this.setCacheData()
      }

      next()
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

  header {
    background: #44464B;
  }

  .mui-icon-back:before, .mui-icon-left-nav:before {
    color: #808080;
  }

  .mui-content {
    background: #EBECED;
  }

  .share_t {
    width: 100%;
    height:6.32rem;
    background: -webkit-gradient(linear, 0 0, 0 bottom, from(#44474B), to(rgba(113, 117, 120, 1)));
    position: relative;
  }

  .share_t svg {
    font-size: 2.933rem;
    position: absolute;
    left: 0;
    right: 0;
    top:1.173rem;
    margin: auto;

  }

  .share_bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 2.8rem;
    background: url("../../statics/images/graywave@3x.png") no-repeat;
    background-size: 100% 100%;
  }

  ul {
    width: 80%;
    margin-left: 10%;
    height: 6.453rem;
    padding-top: 1.12rem;
  }

  ul li {
    width: 100%;
    height: 0.746rem;

    border-bottom: 0.026rem solid #dcdcdc;
  }

  ul li:nth-of-type(2) {
    margin-top: 0.8rem;
  }

  ul li svg {
    font-size: 0.586rem;
    color: #b4b4b6;
    float: left;
    margin-right: -0.08rem;
  }

  ul li:nth-of-type(2) svg {
    font-size: 0.666rem;
  }

  ul li input {
    width: 80%;
    height: 0.693rem;
    float: left;
    background: #EBECED;
    border: none;
    padding: 0.266rem 0.133rem;
    margin-left: 0.133rem;
  }

  input::-webkit-input-placeholder {
    color: #808080;
    font-size: 0.373rem;
  }

  input::-moz-placeholder {
    /* Firefox 18- */
    color: #808080;
    font-size: 0.373rem;
  }

  input::-moz-placeholder {
    /* Firefox 19+ */
    color: #808080;
    font-size: 0.373rem;
  }

  input::-moz-placeholder {
    /* Firefox 19+ */
    color: #808080;
    font-size: 0.373rem;
  }



  ul button {
    width: 100%;
    height: 1.173rem;
    background: #03aef9;
    font-size: 0.426rem;
    color: #FFFFFF;
    border-radius: 0;
    margin-top: 0.933rem;
    border-radius: 0.133rem;
  }

  ul p {
    font-size: 0.32rem;
    color: rgb(60, 149, 249);
    margin-top: 0.48rem;
    color:rgb(128,128,128);
  }

  ul p i {
    color: #3c95f9;
    font-style: normal;
  }

</style>
