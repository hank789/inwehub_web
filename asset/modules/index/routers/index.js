import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import localEvent from '../../../stores/localStorage'
import { openWebviewByUrl } from '../../../utils/webview'

// 统计用户的浏览行为;
import ga from 'vue-ga'

VueRouter.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

VueRouter.prototype.jump = function (url) {
  window.location.href = url
}

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'hash',
  routes
})

if (!window.isLocalEnv) {
  const gaCode = process.env.GA_CODE

  ga(router, gaCode)
}

router.pushReadHubPage = function (url) {
  router.pushPlus(url, 'list-detail-page')
}

router.pushPlus = function (url, id = '', autoShow = true, aniShow = 'pop-in', popGesture = 'hide', forceWebView = false, reload = false) {
  console.log('pushPlusUrl:' + url)
  var footerTab = ['/discover', '/home', '/task', '/my']

  var nextUrl = ''
  if (window.mui.os.plus && ((footerTab.indexOf(url) === -1) || forceWebView)) {
    if (!window.isLocalEnv) {
      if (window.mixpanel.track) {
        var matchedRoute = this.resolve(url)
        var mixpanelEvent = 'inwehub:'
        if (matchedRoute.route.name) {
          mixpanelEvent += matchedRoute.route.name
        } else {
          mixpanelEvent += matchedRoute.route.fullPath
        }
        window.mixpanel.track(
          mixpanelEvent,
          {
            'app': 'inwehub',
            'user_device': window.getUserAppDevice(),
            'page': matchedRoute.route.fullPath,
            'page_name': matchedRoute.route.name,
            'page_title': matchedRoute.route.meta.title
          }
        )
      }
      if (window.ga) {
        window.ga('set', 'page', url)
        window.ga('send', 'pageview')
      }
      if (/^http/.test(url)) {
        nextUrl = url
      } else {
        nextUrl = '/public/index.html#' + url
      }
    } else {
      if (/^http/.test(url)) {
        nextUrl = url
      } else {
        nextUrl = location.protocol + '//' + window.location.host + '/' + 'index.html#' + url
      }
    }
    if (!id) {
      id = nextUrl
    }
    // 底部4个tab的页面默认为主页
    var urlSplit = url.split('?', 1)
    if (footerTab.indexOf(urlSplit[0]) >= 0) {
      id = window.plus.runtime.appid
    } else if (id === nextUrl) {
      urlSplit = url.split('/')
      // 判断是否是详情页面, 详情页面id为list-detail-page
      if (urlSplit[urlSplit.length - 1] > 0) {
        id = 'list-detail-page'
      }
    }
    openWebviewByUrl(id, nextUrl, autoShow, aniShow, popGesture, reload)
  } else {
    console.log('pushPlusUrl-router:' + url)
    router.push(url)
  }
}

router.beforeEach((to, from, next) => {
  var referer = from.path
  localEvent.setLocalItem('referer', {path: referer})

  window.mui.plusReady(function () {
    if (from.path === 'login') {
      window.plus.navigator.setFullscreen(true)
    } else {
      window.plus.navigator.setFullscreen(false)
    }
  })

  next()
})

router.afterEach((to, from) => {
  if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
    var mixpanelEvent = 'inwehub:'
    if (to.name) {
      mixpanelEvent += to.name
    } else {
      mixpanelEvent += to.fullPath
    }
    var baseEvent = {
      'app': 'inwehub',
      'user_device': window.getUserAppDevice(),
      'page': to.fullPath,
      'page_name': to.name,
      'page_title': to.meta.title,
      'referrer_page': from.fullPath
    }
    baseEvent = Object.assign(baseEvent, to.query)
    window.mixpanel.track(
      mixpanelEvent,
      baseEvent
    )
  }
})

export default router
