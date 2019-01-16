<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">订阅热点推荐</h1>
    </header>
    <div class="mui-content">
      <div class="notice_b">
        APP推送
        <Switches v-model="AppPush" type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
      <div class="notice_b">
        邮件订阅<span class="Email" v-if="EmailText" @tap.stop.prevent="editEmail">{{ EmailText }}</span>
        <Switches v-model="EmailText" type-bold="true" theme="custom" color="blue"></Switches>
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
        AppPush: 0,
        EmailText: 1
      }
    },
    components: {
      Switches
    },
    methods: {
      editEmail () {
        alertEditEmailSubscribe(this, (num, text) => {
          if (num === 0) {
            this.EmailText = text
            this.updateNotification()
            return true
          }
        })
      },
      closeAll () {
        // this.AppPush = 0
        console.log('closeAll')
      },
      refreshResumeData () {
        this.checkPermissionSelf()
      },
      checkPermissionSelf () {
        checkPermissionMy('NOTIFITION', () => {
          this.getNotification()
          console.log('checkPermissionSelf')
        }, (result) => {
          // this.closeAll()
        })
      },
      openDisturb (text) {
        if (text === 'AppPush') {
          alertHotOpenNotice(this, (num) => {
            console.log(num + '数字')
            if (num === 0) {
              toSettingSystem('NOTIFITION')
            } else {
              this.AppPush = 0
            }
          })
        }
        if (text === 'EmailText') {
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
          this.AppPush = res.push_daily_subscribe
          this.EmailText = res.email_daily_subscribe
        })
      },
      updateNotification (text) {
        postRequest(`notification/push/update`, {
          push_daily_subscribe: this.AppPush ? 1 : 0,
          email_daily_subscribe: this.EmailText ? this.EmailText : 0
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          var res = response.data.data
          this.AppPush = res.push_daily_subscribe
          this.EmailText = res.email_daily_subscribe
          if (text === 'AppPush') {
            var tips = this.AppPush ? '“APP订阅”成功' : '已关闭“APP订阅”'
            window.mui.toast(tips)
          }
          if (text === 'EmailText') {
            var tipsText = this.EmailText ? '“邮箱订阅”成功' : '已关闭“邮箱订阅”'
            window.mui.toast(tipsText)
          }
        })
      }
    },
    mounted () {
      this.getNotification()
      // this.refreshResumeData()
      this.checkPermissionSelf()
    },
    watch: {
      'AppPush': function (newValue, oldValue) {
        this.openDisturb('AppPush')
      },
      'EmailText': function (newValue, oldValue) {
        this.openDisturb('EmailText')
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
