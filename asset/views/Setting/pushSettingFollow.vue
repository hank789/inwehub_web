<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的关注</h1>
    </header>

    <div class="mui-content">
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
          console.log(this.notices.new_user, this.notices.new_answered)
        })
      },
      openNotification (type) {
        console.log(type)
        var value = this.notices[type]
        if (value && this.isOpenNotification === 0) {
          //  todo 显示confirm 提示用户去开启通知权限
          this.notices[type] = 0
          var btnArray = ['取消', '去设置']
          window.mui.confirm('现在开启通知，不错过任何一次可能的平台合作机会呦~。', '开启通知', btnArray, (e) => {
            if (e.index === 1) {
              toSettingSystem('NOTIFITION')
            } else {
              window.mui.back()
            }
          })
        }
      },
      // 检查权限
      checkPermission () {
        checkPermission('NOTIFITION', () => {
          //  成功的回调
          this.isOpenNotification = 1
          this.getNotification()
        }, (result) => {
          //  失败的回调
          this.isOpenNotification = 0
          this.closeAll()
          // 去系统开启通知
          toSettingSystem('NOTIFITION')
        })
      },
      // 设置权限
      updateNotification () {
        postRequest(`notification/push/update`, {
          push_my_user_new_activity: this.notices.new_user,
          push_my_question_new_answered: this.notices.new_answered
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
      this.getNotification()
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
    height: 1px;
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
    height:44px;
    line-height: 44px;
    font-size: 14px;
    color: #444444;
    position: relative;
  }
  .vue-switcher {
    float: right;
    top: 17px;
  }
</style>
