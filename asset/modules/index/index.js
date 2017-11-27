import '../../js/mui'
import '../../js/mui.zoom'
import '../../js/mui.previewimage'
import Vue from 'vue'

// Vuejs 单页应用在iOS系统下部分APP的webview中 标题不能通过 document.title = xxx 的方式修改;
import VueWechatTitle from 'vue-wechat-title'
// vue 使用时间的插件；
import TimeAgo from 'vue-timeago'

import router from './routers/index'

// import VueLazyloadImg from 'vue-lazyload-img';
// import VueLazyload from 'vue-lazyload';

// vuex 状态管理器；
import store from './../../stores/store'
// 主体的组件；
import App from './App'

// 检查错误信息插件
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (typeof (isLocalEnv) === 'undefined') {
  window.isLocalEnv = false
} else {
  console.log('isLocalEnv')
  window.isLocalEnv = true
}

if (typeof window.isLocalEnv === 'undefined') {
  console.log('in raven')
  var sentryUrl = 'https://6cd9e4811e7f4ade86ff3d4a18b28e19@sentry.io/167478'
  if (process.env.NODE_ENV === 'production') {
    sentryUrl = 'https://0b85668d118943ffa71c7b6c34f0a6bf@sentry.io/175782'
  }
  Raven
    .config(sentryUrl)
    .addPlugin(RavenVue, Vue)
    .install()
}
var infiniteScroll = require('vue-infinite-scroll')
Vue.use(infiniteScroll)

// 正在加载的图片；
import loadingGif from './../../statics/images/loading.gif'
// vue 评分插件；
import StarRating from './../../components/star-rating/star-rating'

Vue.component('star-rating', StarRating)
window.loading_gif = loadingGif

// mui的插件；
import './../../styles/mui.css'
import './../../styles/common.css'
import './../../styles/feed.min.css'
import './../../styles/immersed.css'
import './../../styles/mui.picker.all.css'
import './../../styles/iconfont.css'
import './../../styles/percircle.css'
import './../../styles/imagePreview.css'

import './../../js/iconfont.js'

Vue.use(VueWechatTitle)
// Vue.use(VueLazyload, {
//   loading: loading_img,
//   try: 3
// });

import { bindWaitting } from '../../utils/waiting'
bindWaitting(window.mui)

import { bindUploadWaiting } from '../../utils/uploadProgress'
bindUploadWaiting(window.mui)

Vue.use(TimeAgo, {
  name: 'timeago',
  locale: 'zh-CN',
  locales: {
    'zh-CN': require('vue-timeago/locales/zh-CN.json'),
    'zh-Diff': [
      '刚刚',
      '%s 秒',
      '%s 分钟',
      '%s 小时',
      '%s 天',
      '%s 周',
      '%s 月',
      '%s 年'
    ]
  }
})

import { showWebview, clearAllWebViewCache, goBack } from '../../utils/webview'
import localEvent from '../../stores/localStorage'

window.showInwehubWebview = showWebview
window.clearAllWebViewCache = clearAllWebViewCache
window.getUserAppDevice = function () {
  var os = window.mui.os
  if (os) {
    if (os.plus) {
      if (os.ios) {
        return 'app_ios'
      } else if (os.android) {
        return 'app_android'
      } else {
        return 'other_app'
      }
    } else if (os.wechat) {
      return 'wechat'
    } else {
      return 'web'
    }
  } else {
    return 'web'
  }
}

window.mixpanelIdentify = function () {
  if (process.env.NODE_ENV === 'production') {
    // mixpanel
    var appVersion = localEvent.getLocalItem('app_version')
    var currentUser = localEvent.getLocalItem('UserInfo')
    if (currentUser.user_id) {
      window.mixpanel.identify(currentUser.user_id)
      window.mixpanel.people.set({
        'email': currentUser.email,
        'app_version': appVersion.version,
        'gender': currentUser.gender,
        'phone': currentUser.phone,
        'name': currentUser.name,
        'avatar': currentUser.avatar_url
      })
    }
  }
}

import '../../js/socket.io.min'

import Echo from 'laravel-echo'
window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: process.env.ECHO_SERVER_ADDRESS,
  auth: {
    headers: {
      'Authorization': 'Bearer ' + 'nb35mdq2ca9828qgl4sgjf4imil5811sn41qsmcaph0p3h6sa5ht8hoktdeg'
    }
  }
})

import VueQRCodeComponent from 'vue-qrcode-component'
Vue.component('qr-code', VueQRCodeComponent)

import { hideHeaderHandler } from '../../utils/wechat'

import { autoHeight } from '../../utils/statusBar'

import { scrollToTop } from '../../utils/scrollToTop'

import EventObj from '../../utils/event'

import { toast } from '../../utils/toast'
window.mui.toast = toast

Vue.mixin({
  activated () {
    if (!this.$el || this.$el.id !== 'router-view') {
      return
    }

    autoHeight(this.$el)
    hideHeaderHandler(this, 'activated')
  },
  mounted () {
    if (!this.$el || this.$el.id !== 'router-view') {
      return
    }

    // 调节状态栏高度方法
    EventObj.addEventListener('autoHeight', (e) => {
      console.log('calledEvent: autoHeight')
      autoHeight()
    })

    // 刷行数据方法
    EventObj.addEventListener('refreshPageData', (e) => {
      console.log('calledEvent: refreshPageData')
      if (this.refreshPageData) {
        console.log('calledMethod: refreshPageData')
        this.refreshPageData()
      }
    })

    autoHeight(this.$el)
    hideHeaderHandler(this, 'mounted')
    scrollToTop(this.$el)
  },
  created () {
    // 当使用webview方式打开的话，会显示webview，并绑定侧滑事件
    if (this.$parent && this.$parent.$el && this.$parent.$el.id === 'app') {
      window.mui.plusReady(function () {
        var currentWebview = window.plus.webview.currentWebview()
        var index = window.location.href.indexOf('#')
        if (index !== -1) {
          var url = window.location.href.slice(index + 1)
          console.log('bindCurrentUrl:' + url)
          currentWebview.setStyle({
            additionalHttpHeaders: {
              url: url
            }
          })
        }
      })

      showWebview()
    }
  }
})

window.mui.muiOldBack = window.mui.back
window.mui.back = function () {
  if (window.mui.os.plus) {
    console.log('back:')
    var currentWebview = window.plus.webview.currentWebview()
    var needHide = [
      'inwehub_notice_view',
      'list-detail-page',
      'list-detail-page-two',
      'readhub_submission_webview'
    ]

    var needWebviewBack = [
      'inwehub_article_title',
      'inwehub_article_view'
    ]
    console.log('back: ' + currentWebview.id)

    if (currentWebview.id === window.plus.runtime.appid) {
      console.log('back: root webview')
      goBack()
      window.mui.muiOldBack()
      return
    } else if (needHide.indexOf(currentWebview.id) !== -1) {
      console.log('back: 准备隐藏当前webview')
      goBack()
      currentWebview.hide()
      return
    } else if (window.mui.os.plus || needWebviewBack.indexOf(currentWebview.id) !== -1) {
      console.log('back: 准备close当前webview')
      goBack()
      window.mui.muiOldBack()
      return
    } else {
      console.log('back: 准备vue go(-1)')
      console.log('go(-1)')
      router.go(-1)
    }
  } else {
    router.go(-1)
  }
}

window.mui.initGlobal({
  gestureConfig: {
    doubletap: true
  }
})

const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})

export { app, router }
