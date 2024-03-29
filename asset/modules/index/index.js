console.log('当前环境(process.env.NODE_ENV):' + process.env.NODE_ENV)

import '../../js/mui'
import '../../js/mui.zoom'
import '../../js/mui.previewimage'
import Vue from 'vue'

// Vuejs 单页应用在iOS系统下部分APP的webview中 标题不能通过 document.title = xxx 的方式修改;
import VueWechatTitle from 'vue-wechat-title'
// vue 使用时间的插件；
import TimeAgo from 'vue-timeago'
import timeago from '../../utils/timeComponent'
Vue.use(timeago)

import router from './routers/index'

require('swiper/dist/css/swiper.css')

// import VueLazyloadImg from 'vue-lazyload-img';
import VueLazyload from 'vue-lazyload'

// vuex 状态管理器；
import store from './../../stores/store'
// 主体的组件；
import App from './App'

// 检查错误信息插件
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (process.env.NODE_ENV !== 'development') {
  require('../../js/mixpanel')
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
import StarRating from 'vue-star-rating'
Vue.component('star-rating', StarRating)

import VueClipboards from 'vue-clipboards'
Vue.use(VueClipboards)

import Back from './../../components/Back.vue'
Vue.component('Back', Back)

import ImageView from './../../components/image/ImageView.vue'
Vue.component('ImageView', ImageView)

window.loading_gif = loadingGif
if (window.plus) {
  window.appUserAgent = window.plus.navigator.getUserAgent()
}
// mui的插件；
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.core.css'
import './../../styles/cropper.min.css'
import './../../styles/mui.css'
import './../../styles/common.css'
import './../../styles/feed.min.css'
import './../../styles/immersed.css'
import './../../styles/mui.picker.all.css'
import './../../styles/percircle.css'
import './../../styles/imagePreview.css'

import './../../js/iconfont.js'

Vue.use(VueWechatTitle)

// import { getCacheImage } from '../../utils/plus'

Vue.use(VueLazyload, {
  preLoad: 1.3, // 预加载的高度比例
  loading: '',
  attempt: 8, // 尝试次数
  listenEvents: [ 'scroll' ]
  // filter: {
    // progressive (listener, options) {
      // getCacheImage(listener.src, (imgUrl) => {
      //   if (listener.src !== imgUrl) {
      //     listener.src = imgUrl
      //   }
      // })
      // }
  // }
})

import { bindWaitting } from '../../utils/waiting'
bindWaitting(window.mui)

import { bindUploadWaiting } from '../../utils/uploadProgress'
bindUploadWaiting(window.mui)

Vue.use(TimeAgo, {
  name: 'timeago',
  locale: 'zh-CN',
  maxTime: 86400 * 365,
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

import { showWebview, clearAllWebViewCache, getPrevWebview } from '../../utils/webview'
import localEvent from '../../stores/localStorage'

import refreshPageData from '../../plugins/refreshPageData'
Vue.use(refreshPageData)

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

window.mixpanelIdentify = function (alias = false) {
  if (process.env.NODE_ENV === 'production') {
    // mixpanel
    var appVersion = localEvent.getLocalItem('app_version')
    var currentUser = localEvent.getLocalItem('UserInfo')
    if (currentUser.user_id) {
      if (alias) {
        var distinctId = window.mixpanel.get_distinct_id()
        if (distinctId && distinctId.length >= 10) {
          window.mixpanel.alias(currentUser.user_id)
        }
      } else {
        window.mixpanel.identify(currentUser.user_id)
      }
      window.mixpanel.people.set({
        'email': currentUser.email,
        'app_version': appVersion.version,
        'gender': currentUser.gender,
        'phone': currentUser.phone,
        'name': currentUser.name,
        'avatar': currentUser.avatar_url,
        'user_id': currentUser.user_id
      })
    }
  }
}
window.trackMixpanelEvent = function (eventName, page, pageName, pageTitle, referrerPage = '') {
  if (process.env.NODE_ENV === 'production' && window.mixpanel) {
    // mixpanel
    window.mixpanel.track(
      'inwehub:' + eventName,
      {
        'app': 'inwehub',
        'user_device': window.getUserAppDevice(),
        'page': page,
        'page_name': pageName,
        'page_title': pageTitle,
        'referrer_page': referrerPage
      }
    )
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

import { toast } from '../../utils/toast'
window.mui.toast = toast

import { autoBlur } from '../../utils/dom'

window.mui.muiOldBack = window.mui.back
window.mui.back = function () {
  autoBlur()

  if (window.mui.os.plus && window.mui.os.ios) {
    console.log('run event back')
    var currentWebview = window.plus.webview.currentWebview()
    // 'resume-page','list-page'
    var needHide = [
      'inwehub_notice_view',
      'list-detail-page',
      'list-detail-page-two',
      'list-detail-page-three',
      'readhub_submission_webview'
    ]

    var needWebviewBack = [
      'inwehub_article_title',
      'inwehub_article_view'
    ]
    console.log('back currentWebviewId:' + currentWebview.id)

    if (currentWebview.id === window.plus.runtime.appid) {
      window.mui.muiOldBack()
      return
    } else if (needHide.indexOf(currentWebview.id) !== -1) {
      console.log('back 准备隐藏当前webview')
      currentWebview.hide()
      // 获得父页面的webview
      var parentWebview = getPrevWebview() // self.opener()
      if (parentWebview) {
        // 触发父页面的自定义事件(refresh),从而进行刷新
        window.mui.fire(parentWebview, 'refreshData')
        // 触发父页面的自定义事件(refresh),从而进行刷新
        window.mui.fire(parentWebview, 'refreshPageData', {childId: currentWebview.id, type: 'back'})
        // 子页面也刷新数据
        // window.mui.fire(currentWebview, 'refreshData')
      }
      return
    } else if (window.mui.os.plus || needWebviewBack.indexOf(currentWebview.id) !== -1) {
      console.log('back 准备close当前webview')
      window.mui.muiOldBack()
      return
    } else {
      console.log('back 准备vue go(-1)')
      console.log('go(-1)')
      router.go(-1)
    }
  } else if (window.mui.os.plus && window.mui.os.android) {
    console.log('back android 准备close当前webview')
    window.mui.muiOldBack()
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
