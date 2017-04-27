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
        <span class="mui-icon mui-icon-help"></span>
        <span class="mui-tab-label">提问</span>
      </div>
      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/task')" :class="{ 'mui-active' : isAsk}">
        <span class="mui-icon mui-icon-plus"></span>
        <span class="mui-tab-label">任务</span>
      </div>
      <div class="mui-tab-item" @tap.stop.prevent="linkTo('/my')" :class="{ 'mui-active':isMy}">
        <span class="mui-icon mui-icon-contact"></span>
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
      }
    },
    methods: {
      linkTo(dest){
         this.$router.push(dest);
      },
      changeNav(path, fullPath)
      {
        var curPath = path == ''?'home':path;
        this.isHome = this.isAsk = this.isMy = false;
        this.showBottom = true;
        mui.each(mui(".mui-tab-item"), function(index,item){
          item.className = "mui-tab-item";
        });

        switch(fullPath) {
          case '/':
          case '/home':
            this.isHome = true;
            break;
          case '/my':
            this.isMy = true;
            break;
          case '/task':
            this.isAsk = true;
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
    }
  }
</script>

