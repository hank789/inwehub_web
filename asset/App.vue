<template>
  <div id="app">
    <div v-wechat-title="$route.meta.title"></div>

    <div class='view'>
      <transition name='none' mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <nav class="mui-bar mui-bar-tab" v-show='showBottom'>
      <a class="mui-tab-item" @click="linkTo('/')" :class="{ 'mui-active' : isHome}">
        <span class="mui-icon mui-icon-home"></span>
        <span class="mui-tab-label">首页</span>
      </a>
      <a class="mui-tab-item" @click="linkTo('ask')" :class="{ 'mui-active' : isAsk}">
        <span class="mui-icon mui-icon-plus"></span>
        <span class="mui-tab-label">提问</span>
      </a>
      <a class="mui-tab-item" @click="linkTo('my')" :class="{ 'mui-active':isMy}">
        <span class="mui-icon mui-icon-contact"></span>
        <span class="mui-tab-label">我的</span>
      </a>
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
      changeNav(path)
      {
        var curPath = path == ''?'home':path;
        this.isHome = this.isAsk = this.isMy = false;
        this.showBottom = true;
        mui.each(mui(".mui-tab-item"), function(index,item){
          item.className = "mui-tab-item";
        });
        switch(curPath) {
          case 'home':
            this.isHome = true;
            break;
          case 'my':
            this.isMy = true;
            break;
          case 'login':
          case 'register':
          case 'findpassword':
          case 'ask':
            this.showBottom = false;
            break;
        }
      }
    },
    created(){
      var tmpArr = this.$route.path.split('/')
      var curPath = tmpArr[1] == ''?'home':tmpArr[1];
      this.changeNav(curPath);
    },
    watch: {
      $route(to) {
        var tmpArr = to.path.split('/');
        var curPath = tmpArr[1] == ''?'home':tmpArr[1];
        this.changeNav(curPath);
      }
    }
  }
</script>

