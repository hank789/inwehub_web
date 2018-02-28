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
  import inwehubDialog from '../../components/Dialog.vue'
  import MessageComponent from '../../components/Message.vue'
  import { initDocRem } from '../../utils/dom'
  import { AppPageInit } from '../../utils/plus'

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

      if (process.env.NODE_ENV === 'production') {
        // mixpanel
        window.mixpanelIdentify()
      }

      initDocRem()
      AppPageInit()
    }
  }
</script>

