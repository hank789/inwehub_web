<template>
  <div>
    <ShortTcutComponent ref="short"></ShortTcutComponent>
    <nav class="mui-bar mui-bar-tab footer-bar" v-show='showBottom'>

      <div class="mui-tab-item mui-active" v-if="isHome">
        <svg class="icon oneIcon" aria-hidden="true">
          <use xlink:href="#icon-shouye-hover"></use>
        </svg>
      </div>

      <div class="mui-tab-item" @tap.stop.prevent="$router.push('/home')" v-else>
        <svg class="icon oneIcon" aria-hidden="true">
          <use xlink:href="#icon-shouye1"></use>
        </svg>
      </div>
      <!--发现-->
      <div class="mui-tab-item mui-active" @tap.stop.prevent="$router.push('/discover')" v-if="isDiscover">
        <svg class="icon threeIcon" aria-hidden="true">
          <use xlink:href="#icon-faxian-hover"></use>
        </svg>
      </div>

      <div class="mui-tab-item" @tap.stop.prevent="$router.push('/discover')" v-else>
        <svg class="icon threeIcon" aria-hidden="true">
          <use xlink:href="#icon-faxian1"></use>
        </svg>
      </div>
      <!--发现-->
      <div class="askWrapper">
        <div class="askPlus" @tap.stop.prevent="show()">
          <div class="askImgBg"></div>
          <div class="askImg"></div>
        </div>
      </div>
      <!--消息-->
      <div class="mui-tab-item mui-active" @tap.stop.prevent="$router.push('/inform')" v-if="isAsk">
        <svg class="icon twoIcon" aria-hidden="true">
          <use xlink:href="#icon-xiaoxi-hover"></use>
        </svg>
        <span class="mui-badge" v-if="taskCount">{{ taskCount }}</span>
      </div>
      <div class="mui-tab-item taskWrapper" @tap.stop.prevent="$router.push('/inform')" v-else>
        <svg class="icon twoIcon" aria-hidden="true">
          <use xlink:href="#icon-xiaoxi1"></use>
        </svg>
        <span class="mui-badge" v-if="taskCount">{{ taskCount }}</span>
      </div>
      <!--消息-->

      <div class="mui-tab-item mui-active" @tap.stop.prevent="$router.push('/my')" v-if="isMy">
        <svg class="icon fourIcon" aria-hidden="true">
          <use xlink:href="#icon-wode-hover"></use>
        </svg>
      </div>

      <div class="mui-tab-item" @tap.stop.prevent="$router.push('/my')" v-else>
        <svg class="icon fourIcon" aria-hidden="true">
          <use xlink:href="#icon-wode1"></use>
        </svg>
      </div>


    </nav>

    <Share ref="FooterShareBtn"
           :title="shareoption.shareTitle"
           :shareName="shareoption.shareName"
           :link="shareoption.shareUrl"
           :content="shareoption.shareContent"
           :imageUrl="shareoption.shareImg"
           :thumbUrl="shareoption.shareImg"
           :targetId="shareoption.targetId"
           :targetType="shareoption.targetType"
           :hideShareBtn="true"></Share>
  </div>
</template>

<script type="text/javascript">
  import { postRequest } from '../utils/request'
  import localEvent from '../stores/localStorage'
  import { setAppBadgeNumber } from '../utils/notice'
  import { socketResponseManage } from '../utils/socketResponeManage'
  import ShortTcutComponent from '../components/ShortTcut.vue'
  import Share from '../components/Share.vue'

  export default {
    data () {
      return {
        isHome: false,
        isAsk: false,
        isMy: false,
        showBottom: true,
        isDiscover: false,
        isSocketListened: false,
        taskCount: 0,
        message_total_count: 0,
        shareoption: {
          shareUrl: '',
          shareImg: '',
          shareContent: '',
          shareTitle: '',
          shareName: '',
          targetType: '',
          targetId: '',
          id: ''
        }
      }
    },
    props: {},
    mounted () {
      this.listen()
      // this.$refs.short.show();
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        if (this.showBottom) {
          console.log('refresh-app')
          this.getCount()
        }
      })

      window.addEventListener('refreshTaskCount', (e) => {
        // 执行刷新
        if (this.showBottom) {
          console.log('refresh-task-count')

          var taskCount = localEvent.getLocalItem('taskCount')
          if (taskCount.value) {
            this.taskCount = taskCount.value
          }
        }
      })
    },
    methods: {
      share () {
        this.$refs.FooterShareBtn.share()
      },
      show () {
        this.$refs.short.show()
      },
      listen () {
        var currentUser = localEvent.getLocalItem('UserLoginInfo')
        var userInfo = localEvent.getLocalItem('UserInfo')
        if (userInfo.user_id && window.Echo && this.isSocketListened === false) {
          console.log('listen notification')
          this.isSocketListened = true
          window.Echo.options.auth.headers['Authorization'] = 'Bearer ' + currentUser.token
          // 监听通知事件
          window.Echo.channel('notification.user.' + userInfo.user_id)
            .notification((notification) => {
              socketResponseManage(notification, this)
            })
        }
      },
      onCountChange (count) {
        this.taskCount = count

        window.mui.plusReady(function () {
          localEvent.setLocalItem('taskCount', {
            value: count
          })
        })
      },
      getCount () {
        let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo')
        if (!UserLoginInfo.token) {
          return
        }

        postRequest(`notification/count`, {}, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          // 消息的数字角标；
//          var moneyMessage = response.data.data.money_message.unread_count
//          var noticeMessage = response.data.data.notice_message.unread_count
//          var readhubMessage = response.data.data.readhub_message.unread_count
//          var taskMessage = response.data.data.task_message.unread_count
          var imMessages = response.data.data.im_messages.length > 0 ? response.data.data.im_messages[0] : {}
          this.message_total_count = response.data.data.total_unread_count

          this.$emit('messagecountchange', imMessages)

          var taskCount = this.message_total_count
          setAppBadgeNumber(taskCount)
          this.onCountChange(taskCount)
        })
      },
      changeNav (path, fullPath) {
        this.isHome = this.isAsk = this.isMy = this.isDiscover = false
        this.showBottom = true
        window.mui.each(window.mui('.mui-tab-item'), function (index, item) {
          item.className = 'mui-tab-item'
        })

        switch (fullPath) {
          case '/home':
          case '/home?refresh=1':
            this.isHome = true
            break
          case '/my':
            this.isMy = true
            break
          case '/discover':
            this.isDiscover = true
            break
          case '/discoverGroup':
            this.isDiscover = true
            break
          case '/discoverRecommend':
            this.isDiscover = true
            break
          case '/inform':
            this.isAsk = true
            break
          default:
            this.showBottom = false
        }

        if (this.showBottom) {
          this.getCount()
        }
      }
    },
    components: {
      ShortTcutComponent,
      Share
    },
    watch: {
      $route (to) {
        var tmpArr = to.path.split('/')
        var curPath = tmpArr[1] === '' ? 'home' : tmpArr[1]
        this.changeNav(curPath, this.$route.path)
      }
    },
    created () {
      var tmpArr = this.$route.path.split('/')
      var curPath = tmpArr[1] === '' ? 'home' : tmpArr[1]
      this.changeNav(curPath, this.$route.path)
    }
  }
</script>
<style scoped>
  .footer-bar {
    background-color: #f3f4f6;
    box-shadow: none;
    position: absolute;
    overflow: hidden;
  }

  .footer-bar .mui-tab-item .mui-icon {
    width: 0.693rem;
    height: 0.693rem;
  }

  .footer-bar .mui-tab-item {
    position: relative;
  }

  .footer-bar .mui-active div {
    position: absolute;
    width: 100%;
    bottom: 0.133rem;
  }

  .footer-bar .mui-active .myicon-point-hover {
    width: 0.08rem;
    height: 0.08rem;
    top: 0.106rem;
  }

  .oneIcon {
    font-size: 0.613rem;
  }

  .twoIcon {
    position: relative;
  }

  .twoIcon {
    font-size: 0.613rem;
  }

  .twoIcon ~ .mui-badge {
    position: absolute;
    display: inline-block;
    background: #fa4975;
    color: #fff;
    padding: 0 0.08rem;
    min-width: 0.4rem;
    min-height: 0.4rem;
    border-radius: 0.4rem;
    line-height: 0.4rem;
    right: 0;
  }

  .threeIcon {
    font-size: 0.72rem;
  }

  .fourIcon {
    font-size: 0.64rem;
  }

  .askWrapper {
    position: relative;
    display: table-cell;
    width: 1%;
    text-align: center;
  }

  .askWrapper .askPlus {
    position: relative;
    top: 0.026rem;
    width: 100%;
    text-align: center;
    border-radius: 1.413rem;
  }

  .askWrapper .askPlus .askImg {
    position: absolute;
    top: 0.16rem;
    left: 50%;
    margin-left: -0.533rem;
    width: 1.066rem;
    height: 1.066rem;
    background: url("../statics/images/home_ask_btn@2x.png") no-repeat;
    background-size: 0.933rem 0.933rem;
  }

  .askWrapper .askPlus .askImgBg {
    position: absolute;
    left: 50%;
    margin-left: -0.706rem;
    width: 1.413rem;
    height: 1.413rem;
    background: #f3f4f6;
    border-radius: 1.413rem;
  }

  .askWrapper .title {
    position: absolute;
    width: 100%;
    bottom: 0.133rem;
    color: #808080;
    font-size: 0.32rem;
    text-align: center;
  }

  .mui-bar-tab .mui-tab-item.mui-active:before {
    position: absolute;
    content: '';
    background: #03aef9;
    width: 0.106rem;
    height: 0.106rem;
    bottom: 0.213rem;
    left: 50%;
    margin-left: -0.053rem;
    border-radius: 0.053rem;
  }

  .taskWrapper {
    z-index: 777;
  }
</style>
