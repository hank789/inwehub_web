<template>
  <div class="container-fluid" id="app">
    <div v-wechat-title="$route.meta.title"></div>

    <div class='view'>
      <transition name='none' mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <mu-paper class='bottom_menu' v-show='showBottom'>
      <mu-bottom-nav :value="bottomNav" @change="handleChange">
        <mu-bottom-nav-item value="home" title="首页" icon="home"       href='#/' />
        <mu-bottom-nav-item value="server"  title="服务" icon="message"       href='#/message' />
        <mu-bottom-nav-item value="my"    title="我的" icon="account_circle" href='#/my' />
      </mu-bottom-nav>
    </mu-paper>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        bottomNav: 'home'
      }
    },
    computed: mapGetters([
      // 监测底部显示状态
      'showBottom'
    ]),
    methods: {
      handleChange (val) {
        this.bottomNav = val
      },
      // 底部状态
      footerChange(path) {
          this.$store.dispatch('showFooter')
      },
    },
    created(){
      // 当created函数时监测路由信息,防止页面刷新tab高亮错误
      var tmpArr = this.$route.path.split('/')
      this.handleChange(tmpArr[1])
      console.log(tmpArr[1])
      // 防止在index页刷新时底部显示
      var path = this.$route.path.substring(1)
      this.footerChange(path)
    },
    watch: {
      $route(to) {
        // 去掉  '/'
        var path = to.path.substring(1)
        this.footerChange(path)
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  #app {
    .view {
      margin-bottom: 60px;
    }
  }

  .bottom_menu{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background: #fff;
    z-index: 11;
  }
</style>
