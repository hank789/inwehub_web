import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import localEvent from '../../../stores/localStorage'
import { openWebviewByUrl } from '../../../utils/webview'
import { openFullscreen, closeFullscreen } from '../../../utils/plus'
import { checkClipbord } from '../../../utils/allPlatform'
import { autoBlur } from '../../../utils/dom'

// 统计用户的浏览行为;
import ga from 'vue-ga'

VueRouter.prototype.goBack = function () {
  autoBlur()
  this.isBack = true
  window.history.go(-1)
}

VueRouter.prototype.jump = function (url) {
  autoBlur()
  window.location.href = url
}

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'hash',
  routes
})

if (process.env.NODE_ENV !== 'development') {
  const gaCode = process.env.GA_CODE
  ga(router, gaCode)
}

router.pushReadHubPage = function (url) {
  autoBlur()
  router.pushPlus(url, 'list-detail-page')
}

router.pushPlus = function (url, id = '', autoShow = true, aniShow = 'slide-in-right', popGesture = 'hide', forceWebView = false, reload = false) {
  autoBlur()
  console.log('pushPlus 准备打开:' + url)
  var footerTab = ['ask-offer-list', 'home', 'inform-list', 'my', 'discover', 'group-list', 'dianping', 'userGuide-interst']
  var detailUrlName = ['discover_detail', 'dianping-comment-detail', 'dianping-product-detail', 'passwordlogin']
  var nextUrl = ''
  if (window.mui.os.plus && window.mui.os.ios) {
    var matchedRoute = this.resolve(url)
    if (process.env.NODE_ENV !== 'development') {
      if (window.mixpanel.track) {
        var mixpanelEvent = 'inwehub:'
        if (matchedRoute.route.name) {
          mixpanelEvent += matchedRoute.route.name
        } else {
          mixpanelEvent += matchedRoute.route.fullPath
        }
        var currentRoute = this.history.current
        window.mixpanel.track(
          mixpanelEvent,
          {
            'app': 'inwehub',
            'user_device': window.getUserAppDevice(),
            'page': matchedRoute.route.fullPath,
            'page_name': matchedRoute.route.name,
            'page_title': matchedRoute.route.meta.title,
            'referrer_page': (currentRoute && currentRoute.name) ? currentRoute.fullPath : '/home'
          }
        )
        if (currentRoute && currentRoute.name) {
          window.mixpanel.track(
            'inwehub:analysis:router:count',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': currentRoute.fullPath,
              'page_name': currentRoute.name,
              'page_title': currentRoute.meta.title
            }
          )
        }
        window.mixpanel.time_event('inwehub:analysis:router:count')
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
        if (process.env.NODE_ENV === 'development') {
          nextUrl = 'index.html#' + url // location.protocol + '//' + window.location.host + '/' + 'index.html#' + url
        } else {
          nextUrl = '/public/index.html#' + url
        }
      }
    }
    if (!id) {
      id = nextUrl
    }
    // 底部4个tab的页面默认为主页
    var urlSplit = url.split('?', 1)
    var currentWebview = window.plus.webview.currentWebview()
    if (footerTab.indexOf(urlSplit[0]) >= 0 || (matchedRoute.route.name && footerTab.indexOf(matchedRoute.route.name) >= 0)) {
      id = window.plus.runtime.appid
    } else if (id === nextUrl) {
      urlSplit = url.split('/')
      // 判断是否是详情页面, 详情页面id为list-detail-page
      if (urlSplit[urlSplit.length - 1] > 0 || (matchedRoute.route.name && detailUrlName.indexOf(matchedRoute.route.name) >= 0)) {
        id = 'list-detail-page'
      } else if (id.includes('/resume') || id.includes('?from')) {
        id = 'resume-page'
      } else {
        id = 'list-page'
      }
      if (currentWebview.id === id) {
        id = 'list-detail-page-two'
      }
      if (currentWebview.id === 'list-detail-page-two' && id === 'list-page') {
        id = 'list-detail-page-three'
      }
    } else if (currentWebview.id === id) {
      id = 'list-detail-page-three'
    }
    openWebviewByUrl(id, nextUrl, autoShow, aniShow, popGesture, reload)
  } else {
    console.log('pushPlusUrl-router:' + url)
    router.push(url)
  }
}

router.beforeEach((to, from, next) => {
  autoBlur()
  var referer = from.path
  localEvent.setLocalItem('referer', {path: referer})
  if (to.path !== '/ad' && to.path !== '/') {
    checkClipbord()
  }

  if (from.path === 'login') {
    openFullscreen()
  } else {
    closeFullscreen()
  }

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
    var fromEvent = {
      'app': 'inwehub',
      'user_device': window.getUserAppDevice(),
      'page': from.fullPath,
      'page_name': from.name,
      'page_title': from.meta.title
    }
    baseEvent = Object.assign(baseEvent, to.query)
    window.mixpanel.track(
      mixpanelEvent,
      baseEvent
    )
    window.mixpanel.track(
      'inwehub:analysis:router:count',
      Object.assign(fromEvent, from.query)
    )
    window.mixpanel.time_event('inwehub:analysis:router:count')
  }
})

export default router
