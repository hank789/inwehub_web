<template>
  <div id="app">
    <div v-wechat-title="wechatTitle"></div>

    <div class='view'>
      <keep-alive>
        <router-view class="pageWrapper" id="router-view" v-if="$route.meta.keepAlive"
                     @countChange="onCountChange($event)" ref="routerView"
                     @changeWechatTitle="onChangeWechatTitle($event)"></router-view>
      </keep-alive>
      <router-view class="pageWrapper" :id="'router-view'" v-if="!$route.meta.keepAlive"
                   @countChange="onCountChange($event)" ref="routerView"
                   @changeWechatTitle="onChangeWechatTitle($event)"></router-view>
    </div>
    <FooterComponent ref="Footer" id="Footer"
                     @messagecountchange="messagecountchange"
                     @chat="chat"
    ></FooterComponent>
    <div id="toast"></div>
    <OpenAppComponent></OpenAppComponent>
    <inwehubDialog ref="inwehubDialog"></inwehubDialog>
    <MessageComponent ref="MessageComponent"></MessageComponent>
  </div>
</template>

<script>
  import FooterComponent from '../../components/Footer.vue'
  import OpenAppComponent from '../../components/OpenApp.vue'
  import { goBack, goThirdPartyArticle } from '../../utils/webview'
  import EventObj from '../../utils/event'
  import { setIncBadgeNumber } from '../../utils/notice'
  import inwehubDialog from '../../components/Dialog.vue'
  import userAbility from '../../utils/userAbility'
  import MessageComponent from '../../components/Message.vue'
  import { saveLocationInfo, checkClipbord, noticeOpenNotifitionPermission } from '../../utils/allPlatform'
  import localEvent from '../../stores/localStorage'
  import { setWebviewNewUrl, getWebviewNewUrl } from '../../utils/plus'

  export default {
    data () {
      return {
        wechatTitle: this.$route.meta.title
      }
    },
    methods: {
      messagecountchange (obj) {
        if (this.$refs.routerView.messagecountchange) {
          this.$refs.routerView.messagecountchange(obj)
        }
      },
      chat (obj) {
        if (this.$refs.routerView.chat) {
          this.$refs.routerView.chat(obj)
        }
      },
      onCountChange (count) {
        this.$refs.Footer.onCountChange(count)
      },
      onChangeWechatTitle (title) {
        this.wechatTitle = title
      },
      goRecommand: function () {
        this.expertNav()
        this.$router.push('/expert/recommend')
      },
      goExpert: function () {
        this.expertNav()
        this.$router.push('/expert')
      },
      expertNav: function () {
        window.mui('#expert').popover('toggle')
      },
      linkTo (dest) {
        this.$router.push(dest)
      }
    },
    created () {

    },
    components: {
      FooterComponent,
      OpenAppComponent,
      inwehubDialog,
      MessageComponent
    },
    watch: {
      $route (to) {
        this.wechatTitle = this.$route.meta.title
      }
    },
    mounted () {
      console.log('refreshDataAppMounted')
      var router = this.$router
      var self = this

      if (process.env.NODE_ENV === 'production') {
        // mixpanel
        window.mixpanelIdentify()
      }

      window.mui.plusReady(function () {
        if (window.mui.os.plus) {
          window.mui.init({
            swipeBack: true, // 启用右滑关闭功能
            beforeback: goBack
          })

          var ws = window.plus.webview.currentWebview()
          // 监听自定义事件，前往页面
          document.addEventListener('go_to_target_page', (event) => {
            var url = event.detail.url
            console.log('go_to_target_page:' + url)

            var ws = window.plus.webview.currentWebview()
            var currentUrl = getWebviewNewUrl()
            console.log('go_to_target_page currentUrl:' + currentUrl + ', url:' + url)

            router.replace(url, () => {
              window.mui.fire(ws, 'autoHeight', true)
              if (currentUrl === url || (currentUrl === '/home' && url === '/home?refresh=1')) {
                window.mui.fire(ws, 'refreshPageData', true)
              }
              setWebviewNewUrl()
            }, () => {
              window.mui.fire(ws, 'autoHeight', true)
              if (currentUrl === url) {
                window.mui.fire(ws, 'refreshPageData', true)
              }
              setWebviewNewUrl()
            })
          })
          // 只在主页面监听一次
          if (ws.id === window.plus.runtime.appid) {
            EventObj.addEventListener('refreshData', (e) => {
              // 执行刷新
              if (self.$refs.Footer.showBottom) {
                if (self.$refs.routerView.hasOwnProperty('initData')) {
                  console.log('refreshDataApp')
                  self.$refs.routerView.initData()
                }
              }
            })

            // 应用从后台切换回前台事件
            EventObj.addIntervalOnceEventListener('resume', () => {
              // 存储用户位置信息
              var currentUser = localEvent.getLocalItem('UserInfo')
              if (currentUser.user_id) {
                saveLocationInfo()
              }

              var routerFullPath = self.$router.currentRoute.fullPath
              console.log('routerFullPath:' + routerFullPath)
              if (routerFullPath === '/ad') {
                return
              }

              // 每日签到
              userAbility.signIGift(self)
              // 剪贴板
              checkClipbord()

              if (window.mui.os.ios) {
                noticeOpenNotifitionPermission(self)
              }

              // resume callback
              if (self.$refs.routerView.hasOwnProperty('refreshResumeData')) {
                self.$refs.routerView.refreshResumeData()
              }
            }, false)

            // 监听推送
            var noticeTo = function (payload) {
              if (window.mixpanel.track) {
                window.mixpanel.track(
                  'inwehub:push:click:' + payload.object_type,
                  {'app': 'inwehub', 'user_device': window.getUserAppDevice(), 'page': payload.object_id, 'page_title': '打开推送'}
                )
              }
              switch (payload.object_type) {
                case 'question':
                case 'pay_question_answered':
                case 'question_answer_confirmed':
                  // mui.alert('/ask/' + payload.object_id + '?time=' + Date.parse(new Date()));
                  // router.go(-1);
                  router.pushPlus('/ask/' + payload.object_id + '?time=' + Date.parse(new Date()))
                  break
                case 'pay_question_answered_askCommunity':
                  router.pushPlus('/askCommunity/major/' + payload.object_id)
                  break
                case 'free_question_answered':
                  router.pushPlus('/askCommunity/interaction/' + payload.object_id)
                  break
                case 'pay_answer':
                case 'answer':
                  // router.go(-1);
                  // mui.alert('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()))
                  router.pushPlus('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()))
                  break
                case 'free_answer':
                  router.pushPlus('/askCommunity/interaction/answers/' + payload.object_id)
                  break
                case 'authentication_success':
                  // 专家认证成功
                  router.pushPlus('/my?needalert=1')
                  break
                case 'authentication_fail':
                  // 专家认证失败
                  router.pushPlus('/my/pilot')
                  break
                case 'company_auth_success':
                  // 企业认证成功
                  router.pushPlus('/company/my')
                  break
                case 'company_auth_fail':
                  // 企业认证失败
                  router.pushPlus('/company/my')
                  break
                case 'notification_money':
                  // 资金变动通知
                  router.pushPlus('/my/Finance')
                  break
                case 'user_following':
                  // 用户关注通知
                  router.pushPlus('/share/resume/' + payload.object_id + '?goback=1')
                  break
                case 'readhub_submission_upvoted':
                case 'readhub_new_submission':
                case 'readhub_comment_replied':
                  // 阅读发现评论回复,payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
                  router.pushReadHubPage(payload.object_id)
                  break
                case 'readhub_submission_replied':
                  // 阅读发现文章回复，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
                  router.pushReadHubPage(payload.object_id)
                  break
                case 'readhub_username_mentioned':
                  // 阅读发现@某人，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
                  router.pushReadHubPage(payload.object_id)
                  break
                case 'push_notice_readhub':
                  // 推送阅读发现的文章
                  if (payload.object) {
                    goThirdPartyArticle(
                      payload.object.view_url,
                      payload.object.id,
                      payload.object.title,
                      payload.object.comment_url,
                      payload.object.img_url
                    )
                  }
                  break
                case 'push_notice_app_self':
                  // 推送app内页
                  router.push(payload.object_id)
                  break
                case 'push_notice_article':
                  // 推送公告文章
                  window.mui.openWindow({
                    url: '/public/index.html#/webview/notice',
                    id: payload.object_id,
                    preload: false, // 一定要为false
                    createNew: false,
                    show: {
                      autoShow: true,
                      aniShow: 'pop-in'
                    },
                    styles: {
                      popGesture: 'close'
                    },
                    waiting: {
                      autoShow: false
                    }
                  })
                  break
                case 'notification_level_up':
                  // 用户积分等级提升;
                  userAbility.upgradeLevel(this)
                  break
                case 'activity_enroll_fail':
                case 'activity_enroll_success':
                  // 活动报名事件
                  router.pushPlus('/EnrollmentStatus/' + payload.object_id)
                  break
                case 'pay_answer_new_comment':
                  // 专业回答新的回复
                  router.pushPlus('/askCommunity/major/' + payload.object_id)
                  break
                case 'free_answer_new_comment':
                  // 互动问答新的回复
                  router.pushPlus('/askCommunity/interaction/' + payload.object_id)
                  break
                case 'pay_answer_new_support':
                  // 专业回答赞
                  router.pushPlus('/askCommunity/major/' + payload.object_id)
                  break
                case 'free_answer_new_support':
                  // 专业回答赞
                  router.pushPlus('/askCommunity/interaction/' + payload.object_id)
                  break
                case 'im_message':
                  // 聊天信息
                  router.pushPlus('/chat/' + payload.object_id)
                  break
                case 'invite_user_register':
                  // 邀请用户注册成功
                  router.pushPlus('/invitation/friends')
                  break
              }
            }

            // 监听点击消息事件
            window.plus.push.addEventListener('click', (msg) => {
              // 判断是从本地创建还是离线推送的消息
              switch (msg.payload) {
                case 'LocalMSG':
                  console.log('点击本地创建消息启动：')
                  break
                default:
                  console.log(msg)
                  break
              }

              // 提示点击的内容
              if (msg.payload) {
                // plus.nativeUI.alert( "click:payload(JSON): "+JSON.stringify(msg.payload) )
                var payload = ''
                if (window.mui.os.ios) {
                  payload = msg.payload
                } else {
                  payload = JSON.parse(msg.payload)
                }

                noticeTo(payload)
              }
            }, false)
            // 监听在线消息事件
            window.plus.push.addEventListener('receive', (msg) => {
              if (msg.aps) {  // Apple APNS message
                console.log('接收到在线APNS消息：')
              } else {
                console.log('接收到在线透传消息：')
              }
              if (msg.payload) {
                // plus.nativeUI.alert( "receive:payload: "+JSON.stringify(msg.payload) );
                var payload = ''
                if (window.mui.os.ios) {
                  payload = msg.payload.payload
                } else {
                  payload = JSON.parse(msg.payload)
                }
                setIncBadgeNumber()

                console.log('接收到通知:' + payload.title)
                self.$refs.MessageComponent.show(payload.title, () => {
                  noticeTo(payload)
                })
              }
            }, false)
          }
        } else {
          window.mui.init({
            swipeBack: true, // 启用右滑关闭功能
            beforeback: goBack
          })
        }
      })
    }
  }
</script>

