<template>
  <div id="app">
    <div v-wechat-title="$route.meta.title"></div>

    <div class='view'>
      <transition name='none' mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <nav class="mui-bar mui-bar-tab" v-show='showBottom'>
      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/')" :class="{ 'mui-active' : isHome}">
        <span class="mui-icon fa fa-question"></span>
        <span class="mui-tab-label">提问</span>
      </div>

      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/task')" :class="{ 'mui-active' : isAsk}">
        <span class="mui-icon fa fa-tasks"></span>
        <span class="mui-tab-label">任务</span>
      </div>

      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/discover')" :class="{ 'mui-active' : isDiscover}">
        <span class="mui-icon fa fa-search"></span>
        <span class="mui-tab-label">发现</span>
      </div>

      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/my')" :class="{ 'mui-active':isMy}">
        <span class="mui-icon fa fa-user"></span>
        <span class="mui-tab-label">我的</span>
      </div>
    </nav>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'


  export default {
    data () {
      return {
        isHome: false,
        isAsk: false,
        isMy:false,
        showBottom:true,
        div:false,
        isDiscover:false
      }
    },
    methods: {
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
      //监听推送
      mui.plusReady(function() {
        if (mui.os.plus) {
          // 监听点击消息事件
          plus.push.addEventListener( "click", function( msg ) {
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
            var payload =  JSON.parse(msg.payload);
            plus.ui.alert( 'click:payload:type:' + payload.object_type );
            plus.ui.alert( 'click:payload:id:' + payload.object_id );
          }, false );
          // 监听在线消息事件
          plus.push.addEventListener( "receive", function( msg ) {
            if ( msg.aps ) {  // Apple APNS message
              console.log( "接收到在线APNS消息：" );
            } else {
              console.log( "接收到在线透传消息：" );
            }
            var payload =  JSON.parse(msg.payload);

            plus.ui.alert( 'receive:payload:type:' + payload.object_type );
            plus.ui.alert( 'receive:payload:id:' + payload.object_id );


          }, false );

          //检查版本更新
         // checkUpdate();
        }
      });
    }
  }
</script>

