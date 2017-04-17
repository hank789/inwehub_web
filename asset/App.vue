<template>
  <div id="app">
    <div v-wechat-title="$route.meta.title"></div>

    <div class='view'>
      <transition name='none' mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <div class="bottom-navigation" v-show='showBottom'>
        <div class="item"  @click="linkTo('/')" :class="{ active : isHome}">
          <div class="icon-wrapper">
            <i class="icon ion-home"></i>
          </div>
          <div class="text-wrapper">
            首页
          </div>
        </div>
        <div class="item"  @click="linkTo('ask')" :class="{ active : isAsk}">
          <div class="icon-wrapper">
            <i class="icon ion-plus"></i>
          </div>
          <div class="text-wrapper">
              提问
          </div>
        </div>
        <div class="item"  @click="linkTo('my')" :class="{ active : isMy}">
          <div class="icon-wrapper">
            <i class="icon ion-person"></i>
          </div>
          <div class="text-wrapper">
              我的
          </div>
        </div>
    </div>
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
        switch(curPath) {
          case 'home':
            this.isHome = true;
            break;
          case 'ask':
            this.isAsk = true;
            break;
          case 'my':
            this.isMy = true;
            break;
          case 'login':
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

