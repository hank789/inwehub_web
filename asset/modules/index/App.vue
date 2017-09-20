<template>
  <div id="app">
        <div v-wechat-title="wechatTitle"></div>

        <div class='view'>
          <keep-alive>
            <router-view id="router-view" v-if="$route.meta.keepAlive" @countChange="onCountChange($event)" ref="routerView" @changeWechatTitle="onChangeWechatTitle($event)"></router-view>
          </keep-alive>
          <router-view id="router-view" v-if="!$route.meta.keepAlive" @countChange="onCountChange($event)" ref="routerView" @changeWechatTitle="onChangeWechatTitle($event)"></router-view>
        </div>
        <FooterComponent ref="Footer" id="Footer"></FooterComponent>
        <div id="toast"></div>
        <OpenAppComponent></OpenAppComponent>
        <inwehubDialog ref="inwehubDialog"></inwehubDialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import FooterComponent from '../../components/Footer.vue';
  import OpenAppComponent from '../../components/OpenApp.vue';
  import {goBack} from '../../utils/webview';
  import EventObj from '../../utils/event';
  import {setIncBadgeNumber} from '../../utils/notice';
  import inwehubDialog from '../../components/Dialog.vue';
  import userAbility from '../../utils/userAbility';
  export default {
    data () {
      return {
        wechatTitle:this.$route.meta.title,
      }
    },
    methods: {
      onCountChange(count){
          this.$refs.Footer.onCountChange(count);
      },
      onChangeWechatTitle(title) {
          this.wechatTitle = title;
      },
      goRecommand: function () {
        this.expertNav();
        this.$router.push('/expert/recommend')
      },
      goExpert: function () {
        this.expertNav();
        this.$router.push('/expert')
      },
      expertNav: function () {
        mui('#expert').popover('toggle');
      },
      linkTo(dest){
        this.$router.push(dest);
      }
    },
    created(){

    },
    components: {
      FooterComponent,
      OpenAppComponent,
      inwehubDialog
    },
    watch: {
      $route(to) {
        this.wechatTitle = this.$route.meta.title;
      }
    },
    mounted () {

      console.log('refreshDataAppMounted');
      var currentUser = localEvent.getLocalItem('UserInfo');
      var router = this.$router;
      var self = this;

      if (process.env.NODE_ENV === 'production') {
        // mixpanel
        window.mixpanel.init("688ee16000ddf4f44891e06b79847d4e");
        var app_version = localEvent.getLocalItem('app_version');
        if (currentUser.user_id){
          window.mixpanel.identify(currentUser.user_id);
          window.mixpanel.people.set({ "email": currentUser.email,"user_level": currentUser.user_level, "app_version": app_version.version, "gender": currentUser.gender, "phone": currentUser.phone ,"name": currentUser.name, "avatar": currentUser.avatar_url });
        }
      }

      mui.plusReady(function () {
        if (mui.os.plus) {
          var url = process.env.READHUB_URL + '/h5';
          if (currentUser.uuid) {
            url = url + '?uuid=' + currentUser.uuid;
          }
          //通过mui.preload()方法预加载，可立即返回对应webview的引用，但一次仅能预加载一个页面；若需加载多个webview，则需多次调用mui.preload()方法；
          var inwehub_embed_view = mui.preload({
            url: url,
            id: 'inwehub_embed',
            styles: {
              popGesture: 'none',
              top: '0px',
              dock: 'top',
              bottom: '75px',
              bounce:'none'},
            extras: {preload: true}
          });
          mui.preload({
            url: url,
            id: 'readhub_submission_webview',
            styles: {
              popGesture: 'hide'
            },
            extras: {preload: true}
          });

          console.log("inwehub_embed:"+inwehub_embed_view.getURL());
          if (inwehub_embed_view.getURL() && inwehub_embed_view.getURL() !== url){
            console.log('inwehub_embed:reload:'+ url);
            inwehub_embed_view.loadURL(url);
          }
          mui.init({
            swipeBack:true, //启用右滑关闭功能
            beforeback: goBack
          });


          var ws = plus.webview.currentWebview();
          console.log('bindEvent-runtime:' + plus.runtime.appid);
          console.log('bindEvent-wsid:' + ws.id);
          // 只在主页面监听一次
          if (ws.id === plus.runtime.appid) {
            EventObj.addEventListener('refreshData', (e) => {
              //执行刷新
              if (self.$refs.Footer.showBottom) {
                if (self.$refs.routerView.hasOwnProperty('initData')) {
                  console.log('refreshDataApp');
                  self.$refs.routerView.initData();
                }
              }
            });

            //监听推送
            var noticeTo = function (payload) {
              if (window.mixpanel.track) {
                window.mixpanel.track(
                  'inwehub:push:click:'+ payload.object_type,
                  {"app": "inwehub", "user_device": getUserAppDevice(), "page": payload.object_id, "page_title": "打开推送"}
                );
              }
              switch (payload.object_type) {
                case 'question':
                case 'question_answered':
                case 'question_answer_confirmed':
                  // mui.alert('/ask/' + payload.object_id + '?time=' + Date.parse(new Date()));
                  //router.go(-1);
                  router.pushPlus('/ask/' + payload.object_id+ '?time=' + Date.parse(new Date()));
                  break;
                case 'answer':
                  //router.go(-1);
                  // mui.alert('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()));
                  router.pushPlus('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()));
                  break;
                case 'authentication_success':
                  // 专家认证成功
                  router.pushPlus('/my');
                  break;
                case 'authentication_fail':
                  // 专家认证失败
                  router.pushPlus('/my/pilot');
                  break;
                case 'company_auth_success':
                  // 企业认证成功
                  router.pushPlus('/company/my');
                  break;
                case 'company_auth_fail':
                  // 企业认证失败
                  router.pushPlus('/company/my');
                  break;
                case 'notification_money':
                  // 资金变动通知
                  router.pushPlus('/my/Finance');
                  break;
                case 'user_following':
                  // 用户关注通知
                  router.pushPlus('/share/resume?id=' + payload.object_id + '&goback=1');
                  break;
                case 'readhub_comment_replied':
                  // 阅读发现评论回复,payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
                  router.pushReadHubPage(payload.object_id);
                  break;
                case 'readhub_submission_replied':
                  // 阅读发现文章回复，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
                  router.pushReadHubPage(payload.object_id);
                  break;
                case 'readhub_username_mentioned':
                  // 阅读发现@某人，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
                  router.pushReadHubPage(payload.object_id);
                  break;
                case 'push_notice_readhub':
                  // 推送阅读发现的文章
                  if (payload.object) {
                    mui.openWindow({
                      url: 'index.html#/webview/article',
                      id: 'readhub_article_'+payload.object.id,
                      preload: false, //一定要为false
                      createNew: false,
                      show: {
                        autoShow: true,
                        aniShow: 'pop-in'
                      },
                      styles: {
                        popGesture: 'hide'
                      },
                      waiting: {
                        autoShow: false
                      },
                      extras: {
                        article_id: payload.object.id,
                        article_url: payload.object.view_url,
                        article_title: payload.object.title,
                        article_comment_url: payload.object.comment_url,
                        article_img_url:payload.object.img_url,
                      }
                    });
                  }
                  break;
                case 'push_notice_app_self':
                  // 推送app内页
                  router.push(payload.object_id);
                  break;
                case 'push_notice_article':
                  // 推送公告文章
                  mui.openWindow({
                    url: 'index.html#/webview/notice',
                    id: payload.object_id,
                    preload: false, //一定要为false
                    createNew: false,
                    show: {
                      autoShow: true,
                      aniShow: 'pop-in'
                    },
                    styles: {
                      popGesture: 'hide'
                    },
                    waiting: {
                      autoShow: false
                    }
                  });
                  break;
                case 'notification_level_up':
                    // 用户积分等级提升
                    userAbility.upgradeLevel(this);
                    break;
                case 'activity_enroll_fail':
                case 'activity_enroll_success':
                    // 活动报名事件
                  router.pushPlus("/EnrollmentStatus/"+payload.object_id);
                  break;
              }
            };

            // 监听点击消息事件
            plus.push.addEventListener("click", (msg) => {
              // 判断是从本地创建还是离线推送的消息
              switch (msg.payload) {
                case "LocalMSG":
                  console.log("点击本地创建消息启动：");
                  break;
                default:
                  console.log(msg);
                  break;
              }
              // 提示点击的内容
              if (msg.payload) {
                //plus.nativeUI.alert( "click:payload(JSON): "+JSON.stringify(msg.payload) );
                if (mui.os.ios) {
                  var payload = msg.payload;
                } else {
                  var payload = JSON.parse(msg.payload);
                }
                //var repeatKey = payload.object_type + payload.object_id;
                //var isRepeat = localEvent.getLocalItem(repeatKey);
                /*if (isRepeat.key) {
                 return;
                 } else {
                 localEvent.setLocalItem(repeatKey,{key:repeatKey});
                 }*/
                noticeTo(payload);
              }

            }, false);
            // 监听在线消息事件
            plus.push.addEventListener("receive", (msg) => {
              if (msg.aps) {  // Apple APNS message
                console.log("接收到在线APNS消息：");
              } else {
                console.log("接收到在线透传消息：");
              }

              if (msg.payload) {
                //plus.nativeUI.alert( "receive:payload: "+JSON.stringify(msg.payload) );
                if (mui.os.ios) {
                  var payload = msg.payload.payload;
                } else {
                  var payload = JSON.parse(msg.payload);
                }
                /*var repeatKey = payload.object_type + payload.object_id;
                var isRepeat = localEvent.getLocalItem(repeatKey);
                if (isRepeat.key) {
                  return;
                } else {
                  localEvent.setLocalItem(repeatKey,{key:repeatKey});
                }*/

                setIncBadgeNumber();

                var btnArray = ['取消', '前往查看'];
                mui.confirm(payload.title, '提示', btnArray, (e) => {
                  if (e.index == 1) {
                    noticeTo(payload);
                  }
                });
              }

            }, false);
          }
        } else {
          mui.init({
            swipeBack:true, //启用右滑关闭功能
          });
        }
      });
    }
  }
</script>

