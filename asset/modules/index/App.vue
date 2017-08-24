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
      OpenAppComponent
    },
    watch: {
      $route(to) {
        this.wechatTitle = this.$route.meta.title;
      }
    },
    mounted () {
      console.log('refreshDataAppMounted');
      var currentUser = localEvent.getLocalItem('UserInfo');
      if (mui.os.plus) {
        if (currentUser.uuid) {
          var url = process.env.READHUB_URL + '/h5?uuid=' + currentUser.uuid;
          //通过mui.preload()方法预加载，可立即返回对应webview的引用，但一次仅能预加载一个页面；若需加载多个webview，则需多次调用mui.preload()方法；
          mui.preload({
            url: url,
            id: 'inwehub_embed',
            styles: {
              popGesture: 'hide',
              top: '0px',
              dock: 'top',
              bottom: '75px',
              bounce:'none'},
            extras: {}
          });
        }
        mui.init({
          swipeBack:true, //启用右滑关闭功能
          beforeback: goBack
        });
      } else {
        mui.init({
          swipeBack:true, //启用右滑关闭功能
        });
      }

      if (mui.os.plus) {
        mui.plusReady(() => {
          var ws = plus.webview.currentWebview();
          console.log('bindEvent-runtime:' + plus.runtime.appid);
          console.log('bindEvent-wsid:' + ws.id);
          if (ws.id === plus.runtime.appid) {
            EventObj.addEventListener('refreshData', (e) => {
              //执行刷新
              if (this.$refs.Footer.showBottom) {
                if (this.$refs.routerView.hasOwnProperty('initData')) {
                  console.log('refreshDataApp');
                  this.$refs.routerView.initData();
                }
              }
            });
          }
        });
      }

      var router = this.$router;

      //监听推送
      mui.plusReady(function () {
        if (mui.os.plus) {

          var noticeTo = function (payload) {
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
                  break;
              case 'authentication_fail':
                  // 专家认证失败
                  break;
              case 'company_auth_success':
                  // 企业认证成功
                  break;
              case 'company_auth_fail':
                  // 企业认证失败
                  break;
              case 'notification_money':
                  // 资金变动通知
                  break;
              case 'user_following':
                  // 用户关注通知
                  break;
              case 'readhub_comment_replied':
                  // 阅读发现评论回复,payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
                  break;
              case 'readhub_submission_replied':
                  // 阅读发现文章回复，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
                  break;
              case 'readhub_username_mentioned':
                  // 阅读发现@某人，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
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
              var repeatKey = payload.object_type + payload.object_id;
              var isRepeat = localEvent.getLocalItem(repeatKey);
              if (isRepeat.key) {
                return;
              } else {
                localEvent.setLocalItem(repeatKey,{key:repeatKey});
              }
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
              var repeatKey = payload.object_type + payload.object_id;
              var isRepeat = localEvent.getLocalItem(repeatKey);
              if (isRepeat.key) {
                return;
              } else {
                localEvent.setLocalItem(repeatKey,{key:repeatKey});
              }

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
      });
    }
  }
</script>

