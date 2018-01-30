<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">与我有关</h1>
    </header>

    <div class="mui-content">
      <ul class="notice">
        <li>
          赞了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          关注了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          提到了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          回复了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          邀请了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          私聊了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
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
        upvoted: 1,
        followed: 1,
        mentioned: 1,
        commented: 1,
        invited: 1,
        chatted: 1,
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
     // 获取推送信息
      getNotification () {
        postRequest(`notification/push/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.upvoted = response.data.data.push_rel_mine_upvoted
          this.followed = response.data.data.push_rel_mine_followed
          this.mentioned = response.data.data.push_rel_mine_mentioned
          this.commented = response.data.data.push_rel_mine_commented
          this.invited = response.data.data.push_rel_mine_invited
          this.chatted = response.data.data.push_rel_mine_chatted
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
          this.show = 0
          this.upvoted = 0
          this.followed = 0
          this.mentioned = 0
          this.commented = 0
          this.invited = 0
          this.chatted = 0
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
          this.upvoted = 0
          this.followed = 0
          this.mentioned = 0
          this.commented = 0
          this.invited = 0
          this.chatted = 0
          // 去系统开启通知
          toSettingSystem('NOTIFITION')
        })
      },
      // 设置权限
      updateNotification () {
        postRequest(`notification/push/update`, {
          push_rel_mine_upvoted: this.upvoted,
          push_rel_mine_followed: this.followed,
          push_rel_mine_mentioned: this.mentioned,
          push_rel_mine_commented: this.commented,
          push_rel_mine_invited: this.invited,
          push_rel_mine_chatted: this.chatted
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.upvoted = response.data.data.push_rel_mine_upvoted
          this.followed = response.data.data.push_rel_mine_followed
          this.mentioned = response.data.data.push_rel_mine_mentioned
          this.commented = response.data.data.push_rel_mine_commented
          this.invited = response.data.data.push_rel_mine_invited
          this.chatted = response.data.data.push_rel_mine_chatted
        })
      }
    },
    created () {
    },
    mounted () {
      this.checkPermission()
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

  .notice li .mui-switch{
    float: right;
    margin-top:7px;
  }
  .mui-switch-blue.mui-active {
      border: 2px solid #03aef9;
      background-color: #03aef9;
    }
</style>
