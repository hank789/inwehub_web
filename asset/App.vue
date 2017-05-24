<template>
  <div id="app">
    <div v-wechat-title="$route.meta.title"></div>

    <div class='view'>
      <transition name='none' mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <nav class="mui-bar mui-bar-tab footer-bar" v-show='showBottom'>
      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/')" :class="{ 'mui-active' : isHome}">
        <span class="mui-icon myicon myicon-home"></span><span class="mui-icon myicon myicon-point" v-show="isHome"></span>

      </div>

      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/task')" :class="{ 'mui-active' : isAsk}">
        <span class="mui-icon myicon myicon-task"><span class="mui-badge" v-if="taskCount">{{ taskCount }}</span></span><span class="mui-icon myicon myicon-point" v-show="isAsk"></span>

      </div>

      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/discover')" :class="{ 'mui-active' : isDiscover}">
        <span class="mui-icon myicon myicon-find"></span><span class="mui-icon myicon myicon-point" v-show="isDiscover"></span>

      </div>

      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/my')" :class="{ 'mui-active':isMy}">
        <span class="mui-icon myicon myicon-my"></span><span class="mui-icon myicon myicon-point" v-show="isMy"></span>

      </div>
    </nav>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {createAPI, addAccessToken, postRequest} from './utils/request';
  import localEvent from './stores/localStorage';

  export default {
    data () {
      return {
        isHome: false,
        isAsk: false,
        isMy:false,
        showBottom:true,
        div:false,
        isDiscover:false,
        taskCount:0
      }
    },
    methods: {
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
        var curPath = path == ''?'home':path;
        this.isHome = this.isAsk = this.isMy = this.isDiscover = false;
        this.showBottom = true;
        mui.each(mui(".mui-tab-item"), function(index,item){
          item.className = "mui-tab-item";
        });

        switch(fullPath) {
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
      var curPath = tmpArr[1] == ''?'home':tmpArr[1];
      this.changeNav(curPath, this.$route.path);
    },
    watch: {
      $route(to) {
        var tmpArr = to.path.split('/');
        var curPath = tmpArr[1] == ''?'home':tmpArr[1];
        this.changeNav(curPath, this.$route.path);
      }
    },
    mounted () {
      var router = this.$router;

      //监听推送
      mui.plusReady(function() {
        if (mui.os.plus) {
          var noticeTo = function(payload){
            switch(payload.object_type) {
                 case 'question':
                     router.push('/ask/'+payload.object_id);
                     break;
                 case 'answer':
                     router.push('/answer/'+payload.object_id);
                     break;
               }
          };

          // 监听点击消息事件
          plus.push.addEventListener( "click", ( msg ) => {
            // 判断是从本地创建还是离线推送的消息
            switch( msg.payload ) {
              case "LocalMSG":
                console.log( "点击本地创建消息启动：" );
                break;
              default:
                console.log(msg);
                break;
            }
            // 提示点击的内容
            if ( msg.payload ) {
              //plus.nativeUI.alert( "click:payload(JSON): "+JSON.stringify(msg.payload) );
              if (mui.os.ios) {
                var payload =  msg.payload;
              } else {
                var payload =  JSON.parse(msg.payload);
              }
              noticeTo(payload);
            }

          }, false );
          // 监听在线消息事件
          plus.push.addEventListener( "receive", ( msg ) => {
            if ( msg.aps ) {  // Apple APNS message
              console.log( "接收到在线APNS消息：" );
            } else {
              console.log( "接收到在线透传消息：" );
            }

            if ( msg.payload ) {
              //plus.nativeUI.alert( "receive:payload: "+JSON.stringify(msg.payload) );
              if (mui.os.ios) {
                var payload =  msg.payload.payload;
              } else {
                var payload =  JSON.parse(msg.payload);
              }

              var btnArray = ['取消', '前往查看'];
              mui.confirm(payload.title, '提示', btnArray, (e) => {
                if (e.index == 1) {
                  noticeTo(payload);
                }
              });
            }

          }, false );
        }
      });
    }
  }
</script>

<style scoped>
  .footer-bar{
    background-color:#fff;
    box-shadow: none;
  }
  .footer-bar{
    border-top: 1px solid #D9D9D9;
  }

  .footer-bar .mui-tab-item{
    position:relative;
  }

  .footer-bar .mui-active .myicon-point{
    position: absolute;
    width: 3px;
    height: 3px;
    top: 39px;
    left: 51px;
  }
</style>

