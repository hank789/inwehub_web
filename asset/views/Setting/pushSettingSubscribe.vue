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
        <Switches type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
    </div>
  </div>

</template>

<script>
  import { postRequest } from '../../utils/request'
  import { checkPermission as checkPermissionMy, toSettingSystem } from '../../utils/plus'
  import Switches from 'vue-switches'
  import { alertHotOpenNotice, alertSubscribeGZH, alertEmailSubscribe, alertEditEmailSubscribe } from '../../utils/dialogList'

  export default {
    data () {
      return {
        isOpenAppPush: -1,
        isOpenEmailPush: -1,
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
            this.updateNotification()
          }
        })
      },
      refreshPageData () {
        this.getNotification()
      },
      openDisturb (text) {
        if (text === 'isOpenAppPush') {
          if (this.isOpenAppPush) {
            checkPermissionMy('NOTIFITION', () => {
              // @todo 接api
            }, () => {
              alertHotOpenNotice(this, (num) => {
                console.log(num + '数字')
                switch (num) {
                  case -1:
                    this.isOpenAppPush = 0
                    break
                  case 0:
                    toSettingSystem('NOTIFITION')
                    break
                  case 1:
                    this.isOpenAppPush = 0
                    break
                }
              })
            })
          } else {
            // @todo 接api
          }
        }

        if (text === 'isOpenEmailPush') {
          if (this.isOpenEmailPush) {
            if (!this.emailText) {
              this.editEmail()
              return
            }
          }
          this.updateNotification(text)
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
          if (this.emailText) {
            this.isOpenEmailPush = 1
          }
        })
      },
      updateNotification (text) {
        postRequest(`notification/push/update`, {
          push_daily_subscribe: parseInt(this.isOpenAppPush),
          email_daily_subscribe: this.emailText
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (text === 'isOpenAppPush') {
            var tips = this.isOpenAppPush ? '“APP订阅”成功' : '已关闭“APP订阅”'
            window.mui.toast(tips)
          }
          if (text === 'isOpenEmailPush') {
            var tipsText = this.isOpenEmailPush ? '“邮箱订阅”成功' : '已关闭“邮箱订阅”'
            window.mui.toast(tipsText)
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
    padding: 0 16px;
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
      margin-left: 10px;
    }
  }

  .vue-switcher{
    float: right;
    top: 0.453rem;
  }
</style>
