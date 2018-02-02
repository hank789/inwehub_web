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
          <Switches v-model="notices.upvoted"  type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        </li>
        <li>
          关注了我
          <Switches v-model="notices.followed"  type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        </li>
        <li>
          提到了我
          <Switches v-model="notices.mentioned"  type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        </li>
        <li>
          回复了我
          <Switches  v-model="notices.commented"  type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        </li>
        <li>
          邀请了我
          <Switches v-model="notices.invited"  type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        </li>
        <li>
          私聊了我
          <Switches  v-model="notices.chatted"  type-bold="true" theme="custom" color="blue"></Switches>
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
          upvoted: 1,
          followed: 1,
          mentioned: 1,
          commented: 1,
          invited: 1,
          chatted: 1
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
          upvoted: 0,
          followed: 0,
          mentioned: 0,
          commented: 0,
          invited: 0,
          chatted: 0
        }
        this.isOpenNotification = 0
      },
     // 获取推送信息
      getNotification () {
        postRequest(`notification/push/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.notices.upvoted = response.data.data.push_rel_mine_upvoted
          this.notices.followed = response.data.data.push_rel_mine_followed
          this.notices.mentioned = response.data.data.push_rel_mine_mentioned
          this.notices.commented = response.data.data.push_rel_mine_commented
          this.notices.invited = response.data.data.push_rel_mine_invited
          this.notices.chatted = response.data.data.push_rel_mine_chatted
        })
      },
      openNotification (type) {
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
        } else {
          this.updateNotification()
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
          this.closeAll()
          // 去系统开启通知
          toSettingSystem('NOTIFITION')
        })
      },
      // 设置权限
      updateNotification () {
        postRequest(`notification/push/update`, {
          push_rel_mine_upvoted: this.notices.upvoted ? 1 : 0,
          push_rel_mine_followed: this.notices.followed ? 1 : 0,
          push_rel_mine_mentioned: this.notices.mentioned ? 1 : 0,
          push_rel_mine_commented: this.notices.commented ? 1 : 0,
          push_rel_mine_invited: this.notices.invited ? 1 : 0,
          push_rel_mine_chatted: this.notices.chatted ? 1 : 0
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.notices.upvoted = response.data.data.push_rel_mine_upvoted
          this.notices.followed = response.data.data.push_rel_mine_followed
          this.notices.mentioned = response.data.data.push_rel_mine_mentioned
          this.notices.commented = response.data.data.push_rel_mine_commented
          this.notices.invited = response.data.data.push_rel_mine_invited
          this.notices.chatted = response.data.data.push_rel_mine_chatted
        })
      }
    },
    watch: {
      'notices.upvoted': function (newValue, oldValue) {
          this.openNotification('upvoted')
      },
      'notices.followed': function (newValue, oldValue) {
          this.openNotification('followed')
      },
      'notices.mentioned': function (newValue, oldValue) {
          this.openNotification('mentioned')
      },
      'notices.commented': function (newValue, oldValue) {
          this.openNotification('commented')
      },
      'notices.invited': function (newValue, oldValue) {
          this.openNotification('invited')
      },
      'notices.chatted': function (newValue, oldValue) {
          this.openNotification('chatted')
      }
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

  .vue-switcher {
    float: right;
    top: 17px;
  }
</style>
