<template>
  <div class="mui-content">
    <div class="info">

      <div class="inputWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-denglu"></use>
        </svg>
        <input class="text" type="text" @focus="focus" @blur="blur" placeholder="填写您的真实姓名" name="realname"
               v-model.trim.num="realname" autocomplete="off"/>
      </div>

      <div class="inputWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-mima"></use>
        </svg>
        <input class="text" ref="password" type="password" @focus="focus" @blur="blur" placeholder="填写您的登陆密码"
               name="password"
               v-model.trim.num="password" autocomplete="off"/>
      </div>


      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :disabled="disableRegister"
                @click.prevent="register">确认


        </button>
      </div>

      <div class="help">
        注册即同意 <a href="javascript:void(0)" @tap.stop.prevent="$router.push('/protocol/register')">《用户注册服务协议》</a>
      </div>
    </div>
  </div>
</template>


<script>
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import { NOTICE, USERS_APPEND } from '../../stores/types'
  import { getUserInfo } from '../../utils/user'
  import { saveLocationInfo } from '../../utils/allPlatform'

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
      redirect: ''
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
          device_code: this.device_code
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
                    'page': 'register-wechat',
                    'page_name': 'register-wechat',
                    'page_title': '注册成功',
                    'referrer_page': ''
                  }
                )
                window.mixpanelIdentify(true)
              }
              // 存储用户位置信息
              saveLocationInfo()

              if (window.mui.os.plus) {
                this.$router.pushPlus('/home', '', true, 'none', 'none', true, true)
              } else {
                this.$router.replace(this.redirect)
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


<style lang="less" rel="stylesheet/less" scoped>

  .inputWrapper .icon {
    position: absolute;
    top: 0.106rem;
    font-size: 0.64rem;
    color: #c8c8c8;
  }

  .inputWrapper {
    margin: 0 0.88rem 0.586rem;
    position: relative;

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

  .info {
    background: #f3f4f6;
    position: absolute;

    padding-top: 0.8rem;

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

    &:disabled {
      background: #dcdcdc;
      border: 0.026rem solid #dcdcdc;
      color: #b4b4b6;

    }
  }

  .help {
    font-size: 0.373rem;
    color: #808080;
    text-align: center;

    a {
      color: #3c95f9;
    }
  }
</style>
