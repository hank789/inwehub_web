<template>
  <div>
    <ShortTcutComponent ref="short"></ShortTcutComponent>

    <div class="container-footer" v-show='showBottom'>
      <div class="menu active" v-if="isHome">
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shouye-hover"></use>
          </svg>
        </div>
        <div class="desc">首页</div>
      </div>
      <div class="menu" @tap.stop.prevent="$router.push('/home')" v-else>
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shouye1"></use>
          </svg>
        </div>
        <div class="desc">首页</div>
      </div>

      <div class="menu active" v-if="isDiscover">
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-faxian-hover"></use>
          </svg>
        </div>
        <div class="desc">发现</div>
      </div>
      <div class="menu" @tap.stop.prevent="$router.push('/discover')" v-else>
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-faxian1"></use>
          </svg>
        </div>
        <div class="desc">发现</div>
      </div>

      <div class="menu" @tap.stop.prevent="show()">
        <div class="imgWrapper"></div>
      </div>

      <div class="menu active" v-if="isAsk">
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiaoxi-hover"></use>
          </svg>
        </div>
        <div class="desc">消息</div>
        <span class="mui-badge" v-if="taskCount">{{ taskCount }}</span>
      </div>
      <div class="menu" @tap.stop.prevent="$router.push('/inform')" v-else>
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xiaoxi1"></use>
          </svg>
        </div>
        <div class="desc">消息</div>
        <span class="mui-badge" v-if="taskCount">{{ taskCount }}</span>
      </div>

      <div class="menu active" v-if="isMy">
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wode-hover"></use>
          </svg>
        </div>
        <div class="desc">我的</div>
      </div>
      <div class="menu" @tap.stop.prevent="$router.push('/my')" v-else>
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wode1"></use>
          </svg>
        </div>
        <div class="desc">我的</div>
      </div>

    </div>

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
  .container-footer {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 50px;  /* px不转换 */
    background: #F3F4F6;
    position: fixed;
    width: 100%;
    bottom: 0;
    padding: 0 12px; /* px不转换 */ }
  .container-footer .menu {
    height: 100%;
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    position: relative;
    width: 100%; }
  .container-footer .menu .desc {
    font-size: 11px; /* px不转换 */
    color: #808080;
    position: absolute;
    bottom: 0rem; }
  .container-footer .menu .iconWrapper {
    position: absolute;
    top: 5px; /* px不转换 */
    font-size: 24px; /* px不转换 */
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center; }
  .container-footer .menu:nth-child(2) .iconWrapper {
    font-size: 27px; /* px不转换 */
    top: 4px; /* px不转换 */}
  .container-footer .menu:nth-child(4) .iconWrapper {
    font-size: 25px; /* px不转换 */
    top: 5px; /* px不转换 */}
  .container-footer .menu .imgWrapper {
    width: 40.5px; /* px不转换 */
    height: 40.5px; /* px不转换 */
    background: url("../statics/images/home_ask_btn@2x.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%; }
  .container-footer.active .desc {
    color: #444; }

  .mui-badge {
    position: absolute;
    display: inline-block;
    background: #fa4975;
    color: #fff;
    padding: 0rem 0.08rem;
    min-width: 0.4rem;
    min-height: 0.4rem;
    border-radius: 0.4rem;
    line-height: 0.4rem;
    right: 0;
    top: 5px; /* px不转换 */
  }
</style>
