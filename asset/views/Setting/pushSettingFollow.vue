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
          <div class="mui-switch mui-switch-blue  mui-switch-mini  " :class="new_user ? 'mui-active': '' " @tap.stop.prevent="openNotification('new_user')">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          关注的问题有新回答
          <div class="mui-switch mui-switch-blue  mui-switch-mini  " :class="new_answered ? 'mui-active': '' " @tap.stop.prevent="openNotification('new_answered')">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { checkPermission, toSettingSystem } from '../../utils/plus'

  export default {
    data () {
      return {
        new_user: 1,
        new_answered: 1,
        show: 1
      }
    },
    components: {
    },
    methods: {
      // 应用从后台切换回前台事件
      refreshResumeData () {
        this.checkPermission()
      },
      getNotification () {
        postRequest(`notification/push/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.new_user = response.data.data.push_my_user_new_activity
          this.new_answered = response.data.data.push_my_question_new_answered
        })
      },
      openNotification (type) {
        if (this.show) {
          if (type === 'new_user') {
            switch (this.new_user) {
              case 0:
                this.new_user = 1
                break
              case 1:
                this.new_user = 0
                break
            }
          } else {
            switch (this.new_answered) {
              case 0:
                this.new_answered = 1
                break
              case 1:
                this.new_answered = 0
                break
            }
          }
          this.updateNotification()
        } else {
          this.new_user = 0
          this.new_answered = 0
          toSettingSystem('NOTIFITION')
        }
      },
      // 检查权限
      checkPermission () {
        checkPermission('NOTIFITION', () => {
          //  成功的回调
          this.show = 1
          this.getNotification()
        }, (result) => {
          //  失败的回调
          this.show = 0
          this.new_user = 0
          this.new_answered = 0
          // 去系统开启通知
          toSettingSystem('NOTIFITION')
        })
      },
      // 设置权限
      updateNotification () {
        postRequest(`notification/push/update`, {
          push_my_user_new_activity: this.new_user,
          push_my_question_new_answered: this.new_answered
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.new_user = response.data.data.push_my_user_new_activity
          this.new_answered = response.data.data.push_my_question_new_answered
        })
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
  .notice li .mui-switch{
    float: right;
    margin-top:7px;
  }
  .mui-switch-blue.mui-active {
    border: 2px solid #03aef9;
    background-color: #03aef9;
  }
</style>
