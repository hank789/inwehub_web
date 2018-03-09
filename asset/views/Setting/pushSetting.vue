<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">设置</h1>
    </header>

    <div class="mui-content">
      <div class="notice_t">
        <!--v-if="!notices.all"-->
        <div class="system" v-if="isOpenNotification === 0">
          开启系统通知
          <Switches v-model="notices.all" type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        </div>
        <p v-if="isOpenNotification === 0">你可能错过重要的活动机会推荐，点击前往“设置”开启通知</p>
      </div>
      <div class="grey"  v-if="isOpenNotification === 0"></div>
      <ul class="notice_m">
        <li>
          活动通知及系统公告
           <Switches v-model="notices.system_notify" type-bold="true" theme="custom" color="blue"></Switches>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/push/setting/aboutme')">
          与我有关
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/push/setting/follow')">
          我的关注
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
      </ul>

      <div class="grey"></div>
      <div class="notice_b">
        免打扰<span>（22:00-07:30自动关闭推送）</span>
        <Switches v-model="notices.disturb" type-bold="true" theme="custom" color="blue"></Switches>
        <i class="bot"></i>
      </div>
    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import { checkPermission as checkPermissionMy, toSettingSystem } from '../../utils/plus'
  import EventObj from '../../utils/event'
  import Switches from 'vue-switches'

  export default {
    data () {
      return {
        isOpenNotification: -1, // -1， 未知, 1 yes 0 no
        notices: {
          all: 1,
          disturb: 0,
          system_notify: 0
        }
      }
    },
    components: {
      Switches
    },
    methods: {
      refreshResumeData () {
        this.checkPermissionSelf()
      },
      closeAll () {
        this.notices = {
          all: 0,
          disturb: 0,
          system_notify: 0
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
          this.notices.disturb = response.data.data.push_do_not_disturb
          this.notices.system_notify = response.data.data.push_system_notify
        })
      },
      openDisturb (type) {
        if (type === 'all' && !this.notices.all) {
          this.closeAll()
        } else {
          var value = this.notices[type]
          if (value && this.isOpenNotification === 0) {
            //  todo 显示confirm 提示用户去开启通知权限
            this.notices[type] = 0
            var btnArray = ['取消', '去设置']
            window.mui.confirm('现在开启通知，不错过任何一次可能的平台合作机会呦~。', '开启通知', btnArray, (e) => {
              if (e.index === 1) {
                toSettingSystem('NOTIFITION')
              } else {
           // 点击取消
           //  window.mui.back()
              }
            })
          }
          this.updateNotification()
        }
      },
      checkPermissionSelf () {
        checkPermissionMy('NOTIFITION', () => {
          this.notices.all = 1
          this.isOpenNotification = 1
          this.getNotification()
        }, (result) => {
          this.notices.all = 0
          this.isOpenNotification = 0
          this.closeAll()
        })
      },
      updateNotification () {
        postRequest(`notification/push/update`, {
          push_system_notify: this.notices.system_notify ? 1 : 0,
          push_do_not_disturb: this.notices.disturb ? 1 : 0
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.notices.disturb = response.data.data.push_do_not_disturb
          this.notices.system_notify = response.data.data.push_system_notify
        })
      }
    },
    computed: {},
    created () {
    },
    mounted () {
      EventObj.addIntervalOnceEventListener('resume', () => {
        this.refreshResumeData()
      })
      this.checkPermissionSelf()
    },
    watch: {
      'notices.all': function (newValue, oldValue) {
        this.openDisturb('all')
      },
      'notices.disturb': function (newValue, oldValue) {
        this.openDisturb('disturb')
      },
      'notices.system_notify': function (newValue, oldValue) {
        this.openDisturb('system_notify')
      }
    }
  }
</script>

<style scoped>
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

  .mui-content {
    background: #ffffff;
  }

  .grey {
    width: 100%;
    height: 0.266rem;
    background: #F3F4F5;
  }

  .notice_t {
    width: 100%;
    overflow: hidden;
    padding: 0 4%;
  }

  .notice_t p {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    font-size: 0.32rem;
    color: #03aef9;
  }

  .system {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    font-size: 0.373rem;
    color: #444444;
    position: relative;
  }

  .system .mui-switch {
    float: right;
    margin-top: 0.186rem;
  }

  .notice_m {
    width: 100%;
    overflow: hidden;
    padding: 0 4%;
  }

  .notice_m li {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    font-size: 0.373rem;
    color: #444444;
    position: relative;
  }

  .notice_m li svg {
    /*font-size: 0.373rem;*/
    float: right;
    margin-top: 0.4rem;
    color: #808080;
  }

  .notice_m li .mui-switch {
    float: right;
    margin-top: 0.186rem;
  }

  .notice_b {
    width: 100%;
    height: 1.173rem;
    line-height: 1.173rem;
    font-size: 0.373rem;

    padding: 0 4%;
    position: relative;
  }

  .notice_b span:nth-of-type(1) {
    color: rgb(128, 128, 128);
  }

  .notice_b span:nth-of-type(2) {
    color: #808080;
  }

  .notice_b .mui-switch {
    float: right;
    margin-top: 0.186rem;
  }

  .vue-switcher{
    float: right;
    top: 0.453rem;
  }
</style>
<style>
  .vue-switcher-color--blue div {
    background-color: #03aef9;
  }
  .vue-switcher-color--blue div:after{
    background-color: #fff;
  }
  .vue-switcher--bold--unchecked div {
    background-color: rgb(220, 220, 220);
  }
</style>
