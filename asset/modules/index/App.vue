<template>
  <div id="app">
        <div v-wechat-title="$route.meta.title"></div>

        <div class='view'>
          <transition name='none' mode="out-in">
            <router-view></router-view>
          </transition>
        </div>

        <nav class="mui-bar mui-bar-tab footer-bar" v-show='showBottom'>
          <div class="mui-tab-item mui-active" v-if="isHome">
            <span class="mui-icon myicon myicon-home-hover"></span>
            <div><span class="mui-icon myicon myicon-point-hover"></span></div>
          </div>

          <div class="mui-tab-item" @tap.stop.prevent="$router.pushPlus('/home',true,'none','none')" v-else>
            <span class="mui-icon myicon myicon-home"></span>
          </div>

          <div class="mui-tab-item" @tap.stop.prevent="$router.pushPlus('/task',true,'none','none')" :class="{ 'mui-active' : isAsk}">
            <span class="mui-icon myicon myicon-find" v-if="!isAsk"><span class="mui-badge" v-if="taskCount">{{ taskCount
              }}</span></span>
            <span class="mui-icon myicon myicon-find-hover" v-else><span class="mui-badge" v-if="taskCount">{{ taskCount
              }}</span></span>
            <div><span class="mui-icon myicon myicon-point-hover" v-show="isAsk"></span></div>

          </div>

          <div class="mui-tab-item" @tap.stop.prevent="$router.pushPlus('/discover',true,'none','none')" :class="{ 'mui-active' : isDiscover}">
            <span class="mui-icon myicon myicon-task" v-if="!isDiscover"></span>
            <span class="mui-icon myicon myicon-task-hover" v-else></span>
            <div><span class="mui-icon myicon myicon-point-hover" v-show="isDiscover"></span></div>

          </div>

          <div class="mui-tab-item" @tap.stop.prevent="$router.pushPlus('/my',true,'none','none')" :class="{ 'mui-active':isMy}">
            <span class="mui-icon myicon myicon-my" v-if="!isMy"></span>
            <span class="mui-icon myicon myicon-my-hover" v-else></span>
            <div><span class="mui-icon myicon myicon-point-hover" v-show="isMy"></span></div>

          </div>
        </nav>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export default {
    data () {
      return {
        isHome: false,
        isAsk: false,
        isMy: false,
        showBottom: true,
        div: false,
        isDiscover: false,
        taskCount: 0
      }
    },
    methods: {
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
      getCount(){

        let UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
        if (!UserLoginInfo.token) {
          return;
        }

        postRequest(`notification/count`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }
          this.taskCount = response.data.data.todo_tasks;

        });
      },
      linkTo(dest){
        this.$router.push(dest);
      },
      changeNav(path, fullPath)
      {
        var curPath = path == '' ? 'home' : path;
        this.isHome = this.isAsk = this.isMy = this.isDiscover = false;
        this.showBottom = true;
        mui.each(mui(".mui-tab-item"), function (index, item) {
          item.className = "mui-tab-item";
        });

        switch (fullPath) {
          case '/home':
            this.isHome = true;
            break;
          case '/my':
            this.isMy = true;
            break;
          case '/task':
            this.isAsk = true;
            break;
          case '/discover':
            this.isDiscover = true;
            break;
          default:
            this.showBottom = false;
        }

        if (this.showBottom) {
          this.getCount();
        }
      }
    },
    created(){
      var tmpArr = this.$route.path.split('/')
      var curPath = tmpArr[1] == '' ? 'home' : tmpArr[1];
      this.changeNav(curPath, this.$route.path);
    },
    watch: {
      $route(to) {
        var tmpArr = to.path.split('/');
        var curPath = tmpArr[1] == '' ? 'home' : tmpArr[1];
        this.changeNav(curPath, this.$route.path);
      }
    },
    mounted () {

      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        if (this.showBottom) {
          console.log('refresh-app');
          this.getCount();

          mui.plusReady(function () {
            var webv = plus.webview.getWebviewById('index.html#/home');
            mui.fire(webv, 'refreshData');

            var webv = plus.webview.getWebviewById('index.html#/discover');
            mui.fire(webv, 'refreshData');

            var webv = plus.webview.getWebviewById('index.html#/my');
            mui.fire(webv, 'refreshData');
          });
        }
      });

      var router = this.$router;

      //监听推送
      mui.plusReady(function () {
        if (mui.os.plus) {

          plus.navigator.setStatusBarBackground("#161616");
          plus.navigator.setStatusBarStyle('light');

          var noticeTo = function (payload) {
            switch (payload.object_type) {
              case 'question':
                 // mui.alert('/ask/' + payload.object_id + '?time=' + Date.parse(new Date()));
                //router.go(-1);
                router.pushPlus('/ask/' + payload.object_id);
                break;
              case 'answer':
                //router.go(-1);
                 // mui.alert('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()));
                router.pushPlus('/answer/' + payload.object_id);
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

      mui.init({
        swipeBack:true, //启用右滑关闭功能
        beforeback: function(){
          console.log('beforeback');
          if (mui.os.plus) {
            var self = plus.webview.currentWebview();
            //获得父页面的webview
            var parent_webview = self.opener();
            if (parent_webview){
              console.log('Webview窗口：'+parent_webview.getURL());
              //触发父页面的自定义事件(refresh),从而进行刷新
              mui.fire(parent_webview, 'refreshData');
              //子页面也刷新数据
              mui.fire(self, 'refreshData');
            }
          }
          return true;
        }
      });
    }
  }
</script>

<style scoped>
  .footer-bar {
    background-color: #fff;
    box-shadow: none;
  }

  .footer-bar .mui-tab-item .mui-icon{
    width:26px;
    height:26px;
  }

  .footer-bar {
    border-top: 1px solid #D9D9D9;
  }

  .footer-bar .mui-tab-item {
    position: relative;
  }

  .footer-bar .mui-active div {
    position: absolute;
    width: 100%;
    bottom: 5px;
  }

  .footer-bar .mui-active .myicon-point-hover {
    width: 3px;
    height: 3px;
    top: 4px;
  }
</style>

