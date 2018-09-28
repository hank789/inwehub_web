<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">输入手机号</h1>
    </header>

    <div class="mui-content">
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
          <input class="text" ref="code" v-tooltip="{content:'请输入验证码', placement:'bottom', trigger:'manual'}"
                 type="text"
                 @focus="focus" @blur="blur" placeholder="输入验证码" name="code" v-model.trim.num="code"
                 autocomplete="off"/>
        </div>

        <div class="buttonWrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" :disabled="disableRegister"
                  @click.prevent="register">确认
          </button>
        </div>
    </div>
  </div>
</template>


<script>

  import { postRequest } from '../../utils/request'
  import errorCodes from '../../stores/errorCodes'

  import Vue from 'vue'
  import { USERS_APPEND } from '../../stores/types'
  import VTooltip from 'v-tooltip'
  import { getUserInfo } from '../../utils/user'
  import { alertPhoneBindWarning } from '../../utils/dialogList'

  Vue.use(VTooltip)

  export default {
    data: () => ({
      phone: '', // 手机号码
      isCanGetCode: false,
      time: 0, // 时间倒计时
      openid: '',
      code: '', // 手机验证码,
      disableRegister: true,
      disableSendCode: true,
      errorMsg: '',
      redirect: '',
      type: 1, // 1不合并账户 2合并微信账户, 默认1
      loading: true
    }),
    computed: {
      getCodeText () {
        return this.time === 0 ? '发送验证' : this.time + '秒后重发'
      }
    },
    created () {},
    watch: {
      phone: function (newValue, oldValue) {
        this.checkSendCodeValid()
        this.checkValid()
      },
      code: function (newValue, oldValue) {
        this.checkValid()
      }
    },
    methods: {
      jumpToForm () {
        window.location.href = 'https://jinshuju.net/f/bWXY8y'
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
          'registration_code': ''
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
        var data = {
          mobile: this.phone,
          code: this.code,
          type: this.type
        }

        postRequest('auth/changePhone', data)
          .then(response => {
            var code = response.data.code

            if (code !== 1000) {
              switch (code) {
                case 1127:
                  alertPhoneBindWarning(
                    this,
                    '此手机号已注册',
                    response.data.data.mobile,
                    response.data.data.avatar,
                    response.data.data.is_expert,
                    response.data.data.name,
                    '合并账号并绑定',
                    () => {
                      this.type = 2
                      this.register()
                    }
                  )
                  return
                case 1128:
                  alertPhoneBindWarning(
                    this,
                    '此手机号已绑定其他微信',
                    response.data.data.mobile,
                    response.data.data.avatar,
                    response.data.data.is_expert,
                    response.data.data.name,
                    '联系管理员',
                    () => {
                      this.$router.pushPlus('/chat/79')
                    }
                  )
                  return
                default:
                  window.mui.toast(response.data.message)
                  return
              }
            }

            this.$store.dispatch(USERS_APPEND, cb => getUserInfo(response.data.data.user_id, user => {
              cb(user)
              window.mixpanelIdentify()
              window.mui.back()
            }))
          })
      }
    },
    mounted () {}
  }
</script>


<style lang="less" rel="stylesheet/less" scoped>
  .mui-content{
    background:#fff;
  }
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
    top: 0.866rem;
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
    top: 0.6rem;

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
  .register_logo {
    width: 100%;
    height: 3.2rem;
    background: #f3f4f6;
    position: absolute;
    top: 0;
    padding-left: 1.013rem;
  }

  .register_logo svg {
    font-size: 3.733rem;
    position: absolute;
    top: -0.906rem;
  }

  .register_logo p {
    margin: 0;
    padding: 0;
    font-size: 0.373rem;
    color: #444444;
  }

  .register_logo p:nth-of-type(1) {
    font-weight: 600;
    margin-top: 1.573rem;
  }

</style>
