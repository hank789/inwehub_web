<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">我的关注</h1>
    </header>

    <div class="mui-content" v-show="!loading">
      <ul class="notice">
        <li>
          关注的用户有新动态
          <Switches  v-model="notices.new_user"   type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        <li>
          关注的问题有新回答
        <Switches v-model="notices.new_answered"  type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { checkPermission, toSettingSystem } from '../../utils/plus'
  import Switches from 'vue-switches'

  export default {
    data () {
      return {
        loading: 1,
        isOpenNotification: -1, // -1， 未知, 1 yes 0 no
        isNotificationPermission: -1, // -1， 未知, 1 yes 0 no
        notices: {
          new_user: 1,
          new_answered: 1
        }
      }
    },
    components: {
      Switches
    },
    methods: {
      // 应用从后台切换回前台事件
      refreshResumeData () {
        this.checkPermission()
      },
      closeAll () {
        this.notices = {
          new_user: 0,
          new_answered: 0
        }
        this.isOpenNotification = 0
      },
      getNotification () {
        postRequest(`notification/push/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.notices.new_user = response.data.data.push_my_user_new_activity
          this.notices.new_answered = response.data.data.push_my_question_new_answered
//           console.log(this.notices.new_user, this.notices.new_answered)
          this.loading = 0
        })
      },
      openNotification (type) {
        console.log(type)
        var value = this.notices[type]
        if (value && this.isOpenNotification === 0) {
          this.notices[type] = 0
          var btnArray = ['取消', '去设置']
          window.mui.confirm('现在开启通知，不错过任何一次可能的平台合作机会呦~。', '开启通知', btnArray, (e) => {
            if (e.index === 1) {
              toSettingSystem('NOTIFITION')
            } else {
              window.mui.back()
            }
          })
        } else {
          this.updateNotification()
        }
      },
      // 检查权限
      checkPermission () {
        checkPermission('NOTIFITION', () => {
          //  成功的回调
          this.isOpenNotification = 1
          this.isNotificationPermission = 1
          this.getNotification()
        }, (result) => {
          //  失败的回调
          this.isOpenNotification = 0
          this.isNotificationPermission = 0
          this.closeAll()
          this.loading = 0
          // 去系统开启通知
//          toSettingSystem('NOTIFITION')
        })
      },
      // 设置权限
      updateNotification () {
        if (this.isNotificationPermission !== 1) {
          return
        }

        postRequest(`notification/push/update`, {
          push_my_user_new_activity: this.notices.new_user ? 1 : 0,
          push_my_question_new_answered: this.notices.new_answered ? 1 : 0
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.notices.new_user = response.data.data.push_my_user_new_activity
          this.notices.new_answered = response.data.data.push_my_question_new_answered
        })
      }
    },
    watch: {
      'notices.new_user': function (newValue, oldValue) {
        this.openNotification('new_user')
      },
      'notices.new_answered': function (newValue, oldValue) {
        this.openNotification('new_answered')
      }
    },
    created () {
    },
    mounted () {
      this.checkPermission()
    }
  }
</script>

<style scoped>
  /*清掉自带样式*/
  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
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
  .mui-content{
    background: #ffffff;
  }
  .notice{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .notice li{
    width:100%;
    height:1.173rem;
    line-height: 1.173rem;
    font-size: 0.373rem;
    color: #444444;
    position: relative;
  }
  .vue-switcher {
    float: right;
    top: 0.453rem;
  }
</style>
