<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">订阅热点推荐</h1>
    </header>
    <div class="mui-content">
      <div class="notice_b">
        APP推送
        <Switches v-model="isOpenAppPush" type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
      <div class="notice_b">
        邮件订阅<span class="Email" v-if="emailText" @tap.stop.prevent="editEmail">{{ emailText }}</span>
        <Switches v-model="isOpenEmailPush" type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
      <div class="notice_b">
        微信订阅
        <Switches v-model="isOpenWeChatPush" type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
    </div>
  </div>

</template>

<script>
  import { postRequest } from '../../utils/request'
  import Switches from 'vue-switches'
  import { alertSubscribeGZH, alertEmailSubscribe, alertEditEmailSubscribe } from '../../utils/dialogList'
  import { setHotRecommendAppPushStatus, setHotRecommendEmailStatus, setHotRecommendWechatStatus, needNotifitionPermission } from '../../utils/push'

  export default {
    data () {
      return {
        isOpenAppPush: -1,
        isOpenEmailPush: -1,
        isOpenWeChatPush: -1,
        emailText: ''
      }
    },
    components: {
      Switches
    },
    methods: {
      editEmail () {
        alertEditEmailSubscribe(this, (num, text) => {
          if (num === 0) {
            this.emailText = text
            setHotRecommendEmailStatus(this.isOpenEmailPush, this.emailText, () => {
              window.mui.toast('订阅邮箱修改成功')
            }, () => {})
          }
        })
      },
      refreshPageData () {
        this.getNotification()
      },
      openApp () {
        window.mui.trigger(document.querySelector('.AppOne'), 'tap')
      },
      openDisturb (text) {
        if (text === 'isOpenAppPush') {
          if (!window.mui.os.plus) {
            this.openApp()
            return
          }
          setHotRecommendAppPushStatus(this, this.isOpenAppPush, () => {
            if (this.isOpenAppPush) {
              window.mui.toast('“APP订阅”成功')
            } else {
              window.mui.toast('已关闭“APP订阅”')
            }
          }, () => {
            this.isOpenAppPush = 0
          })
        }

        if (text === 'isOpenEmailPush') {
          if (this.isOpenEmailPush) {
            if (!this.emailText) {
              alertEmailSubscribe(this, (num, text) => {
                if (num === 0) {
                  this.emailText = text
                  setHotRecommendEmailStatus(this.isOpenEmailPush, this.emailText, () => {
                    if (this.isOpenEmailPush) {
                      window.mui.toast('“邮箱订阅”成功')
                    }
                  }, () => {
                    this.isOpenEmailPush = 0
                  })
                }
              })
              return
            }
          }
          setHotRecommendEmailStatus(this.isOpenEmailPush, this.emailText, () => {
            window.mui.toast('已关闭“邮箱订阅”')
          }, () => {
            this.isOpenEmailPush = 0
          })
        }

        if (text === 'isOpenWeChatPush') {
          setHotRecommendWechatStatus(this.isOpenWeChatPush, () => {
            if (this.isOpenWeChatPush) {
              alertSubscribeGZH(this)
            } else {
              window.mui.toast('已关闭“微信订阅”')
            }
          }, () => {
            this.isOpenWeChatPush = 0
          })
        }
      },
      getNotification () {
        postRequest(`notification/push/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          var res = response.data.data

          this.isOpenAppPush = res.push_daily_subscribe
          this.emailText = res.email_daily_subscribe
          this.isOpenWeChatPush = res.wechat_daily_subscribe
          if (this.emailText) {
            this.isOpenEmailPush = 1
          } else {
            this.isOpenEmailPush = 0
          }

          if (this.isOpenAppPush) {
            needNotifitionPermission(this)
          }
        })
      }
    },
    created () {
      this.refreshPageData()
    },
    watch: {
      'isOpenAppPush': function (newValue, oldValue) {
        if (oldValue === -1) return
        this.openDisturb('isOpenAppPush')
      },
      'isOpenEmailPush': function (newValue, oldValue) {
        if (oldValue === -1) return
        this.openDisturb('isOpenEmailPush')
      },
      'isOpenWeChatPush': function (newValue, oldValue) {
        if (oldValue === -1) return
        this.openDisturb('isOpenWeChatPush')
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .notice_b {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    font-size: 0.373rem;
    padding: 0 0.426rem;
    position: relative;
    .mui-switch {
      float: right;
      margin-top: 0.186rem;
    }
    span {
      color: #808080;
    }
    .Email {
      color: #03AEF9;
      margin-left: 0.266rem;
    }
  }

  .vue-switcher{
    float: right;
    top: 0.453rem;
  }
</style>
