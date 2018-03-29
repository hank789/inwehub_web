import { setStatusBarBackgroundAndStyle, getImmersedHeight } from './statusBar'
import router from '../modules/index/routers/index'
import { getDiscoverDetail } from './shareTemplate'
import { getIndexPath } from './plus'
import localEvent from '../stores/localStorage'

function getIdByUrl (url, id) {
  if (id === 'backAndClose') {
    console.log('getIdByUrl: id:backAndClose')
    return 'backAndClose'
  } else if (id === window.plus.runtime.appid) {
    console.log('getIdByUrl: id:' + id)
    return id
  } else if (/\/[0-9]+$/.test(url)) {
    var newId = url
    newId = newId.replace(/[^a-z]+/g, '')
    console.log('getIdByUrl-id:' + newId)
    return newId
  } else if (/\/c\/.*?\/.*?/.test(url)) {
    return 'discover_detail'
  }
  console.log('getIdByUrl: id:' + url)
  return url
}

/**
 * 打开webview
 */
function openWebviewByUrl (id, url, autoShow = true, aniShow = 'slide-in-right', popGesture = 'hide', reload = false) {
  window.mui.plusReady(function () {
    console.log('calledMethod: openWebviewByUrl, url:' + url + ', id:' + id)
    // id = getIdByUrl(url, id)
    var preloadBackClose = true
    if (id === url || id === 'backAndClose') {
      // 非特殊页面返回时关闭webview
      preloadBackClose = false
      popGesture = 'close'
    }
    var currentWebview = window.plus.webview.getWebviewById(id)

    if (currentWebview) {
      var currentWebviewUrl = currentWebview.getURL()
      var bindHttpUrl = currentWebview.getURL()

      if (currentWebview.getStyle()) {
        var httpHeader = currentWebview.getStyle().additionalHttpHeaders
        if (httpHeader && httpHeader.url) {
          bindHttpUrl = httpHeader.url
        }
      }

      var urlIndex = url.indexOf('#')
      var shotUrl = url
      if (urlIndex !== -1) {
        shotUrl = url.slice(urlIndex + 1)
      }

      console.log('openWebviewByUrl:current_webview_url:' + currentWebviewUrl + ', shortUrl:' + shotUrl)

      if (currentWebviewUrl !== shotUrl || bindHttpUrl !== shotUrl) {
        console.log('openWebviewByUrl:load:' + url)
        if (/^http/.test(url)) {
          currentWebview.loadURL(url)
        } else {
          saveCurrentWebviewId(id)
          window.mui.fire(currentWebview, 'go_to_target_page', {url: shotUrl})
        }
      }
      setTimeout(function () {
        currentWebview.show('slide-in-right', 300)
        window.mui.fire(currentWebview, 'autoHeight', false)
        // mui.fire(current_webview, 'refreshPageData', false);
      }, 150)
    } else {
      saveCurrentWebviewId(id)
      var webview = window.mui.openWindow({
        url: url,
        id: id,
        preload: false, // 一定要为false
        show: {
          autoShow: autoShow,
          aniShow: aniShow
        },
        styles: {
          popGesture: popGesture
        },
        extras: {preload: preloadBackClose},
        waiting: {
          autoShow: true
        }
      })
      console.log('openWindow url:' + url + ', popGesture: ' + popGesture + ',aniShow:' + aniShow)
      console.log('bind event popGesture')
      webview.addEventListener('popGesture', (e) => {
        console.log('run in event popGesture')
        if (e.type === 'end' && e.result === true) {
          var parentWebview = getPrevWebview() // self.opener()
          if (parentWebview) {
            console.log('calledEvent: popGesture：' + parentWebview.id)

            // 触发父页面的自定义事件(refresh),从而进行刷新
            window.mui.fire(parentWebview, 'refreshData', {childId: webview.id})
            // 刷新当前页数据
            // window.mui.fire(self, 'refreshData', {parentId: parentWebview.id})

            // 触发父页面的自定义事件(refresh),从而进行刷新
            window.mui.fire(parentWebview, 'refreshPageData', {childId: webview.id})
            // 刷新当前页数据
            // window.mui.fire(self, 'refreshPageData', {parentId: parentWebview.id})

            window.mui.fire(parentWebview, 'autoHeight', {childId: webview.id})
          }
        }
      }, false)
      if (reload) {
        webview.loadURL(url)
      }
    }
  })
}

/**
 * 打开阅读站的页面（高性能）
 * @param url
 */
function openReadhubPage (url) {
  setTimeout(() => {
    setStatusBarBackgroundAndStyle('#3c3e44', 'light')
  }, 100)

  var webview = window.mui.openWindow({
    url: process.env.READHUB_URL + '/h5',
    id: 'readhub_submission_webview',
    preload: false,   // 一定要为false
    show: {
      autoShow: false,
      aniShow: 'pop-in'
    },
    styles: {
      popGesture: 'hide'
    },
    extras: {preload: true},
    waiting: {
      autoShow: false
    }
  })
  window.mui.fire(webview, 'go_to_target_page', {url: url})
  setTimeout(() => {
    webview.show('slide-in-right', 300)
  }, 100)
}

// 首页打开readhub的详情页
function openWebviewByHome (ws, id, url, pathUrl, title, imgUrl) {
  var currentWebview = ws

  setStatusBarBackgroundAndStyle('#3c3e44', 'light')

  var footerPathUrl = pathUrl

  var shareUrl = getIndexPath() + '#/webview/share'

  var shareOptions = getDiscoverDetail(pathUrl, title, imgUrl)
  console.log('shareOptions:' + JSON.stringify(shareOptions))

  var immersedHeight = getImmersedHeight()

  // body部分
  console.log('body url:' + url)

  var bodyTop = '0px'
  var bodyBottom = '0px'
  if (window.mui.os.android) {
    bodyTop = '44px'
    bodyBottom = '44px'
  }

  var webview = window.mui.openWindow({
    url: url,
    id: 'inwehub_article_body',
    styles: {
      popGesture: 'hide',
      top: bodyTop,
      bottom: bodyBottom,
      zindex: 6,
      position: 'absolute',
      backButtonAutoControl: 'hide',
      statusbar: {background: '#3c3e44'},
      bounce: 'vertical'
    }
  })

  console.log('bodyWebviewUrl:' + webview.getURL())
  if (webview.getURL() !== url) {
    webview.hide()
    var plusWaiting = window.plus.nativeUI.showWaiting()
    webview.loadURL(url)
  }
  webview.onloaded = function (event) {
    console.log('webivew-body-onloaded')
    if (plusWaiting) {
      plusWaiting.close()
    }
    webview.show('slide-in-right', 300)
  }
  currentWebview.append(webview)

  // 创建底部菜单
  var Slugindex = pathUrl.lastIndexOf('/')
  var slug = pathUrl.substring(Slugindex + 1)
  var toolUrl = getIndexPath() + '#/discover/comment/' + slug
  console.log('底部url:' + toolUrl)

  var embed = window.mui.openWindow({
    url: toolUrl,
    id: 'inwehub_article_footer',
    preload: false,    // 一定要为false
    show: {
      autoShow: false,
      aniShow: 'pop-in'
    },
    styles: {
      popGesture: 'hide',
      bottom: '0px',
      height: '44px',
      dock: 'bottom',
      position: 'dock',
      zindex: 7,
      backButtonAutoControl: 'hide',
      bounce: 'none', // 不允许滑动
      scrollIndicator: 'none' // 不显示滚动条
    },
    extras: {},
    waiting: {
      autoShow: false
    }
  })
  window.mui.fire(embed, 'go_to_target_page', {url: '/discover/comment/' + slug})

  // 创建评论链接
  var commentUrl = getIndexPath() + '#' + footerPathUrl
  var view = new window.plus.nativeObj.View('test', {bottom: '0px', left: '0', height: '44px', width: '60%'})

  view.draw([
    {
      tag: 'rect',
      id: 'rect',
      rectStyles: {color: 'rgba(0,0,0,0)'},
      position: {bottom: '0px', left: '0px', width: '100%', height: '44px'}
    }
  ])
  view.addEventListener('click', () => {
    console.log('准备跳转:' + commentUrl)
    openWebviewByUrl('read_comment_link_' + id, commentUrl)
  }, false)

  embed.append(view)

  currentWebview.append(embed)

  // 标题栏
  var shareViewParams = {
    page_title: title,
    title: shareOptions.title,
    link: shareOptions.link,
    content: shareOptions.content,
    imageUrl: shareOptions.imageUrl,
    thumbUrl: shareOptions.thumbUrl
  }
  console.log('标题栏地址:' + shareUrl)
  var shareView = window.mui.openWindow({
    url: shareUrl,
    id: 'inwehub_article_title',
    preload: false,
    show: {
      autoShow: false,
      aniShow: 'pop-in'
    },
    styles: {
      cachemode: 'noCache',
      popGesture: 'hide',
      top: '0px',
      right: '0px',
      zindex: 9,
      width: '100%',
      height: (immersedHeight + 44) + 'px',
      dock: 'top',
      position: 'dock',
      backButtonAutoControl: 'hide',
      bounce: 'none', // 不允许滑动
      scrollIndicator: 'none' // 不显示滚动条
    },
    extras: shareViewParams,
    waiting: {
      autoShow: false
    }
  })

  window.mui.fire(shareView, 'load_inwehub_article_share', shareViewParams)
  currentWebview.append(shareView)

  return currentWebview
}

/**
 * 显示webview并绑定侧滑关闭事件
 */
function showWebview () {
  console.log('准备为新webview绑定侧滑返回事件')
  if (window.mui.os.plus) {
    window.mui.plusReady(() => {
      var self = window.plus.webview.currentWebview()
      if (self.custom_preload === false || self.custom_preload === undefined) {
        // 关闭等待框
        window.plus.nativeUI.closeWaiting()
        self.show('slide-in-right', 300)
      }
    })
  }
}

/**
 * webview 回退处理函数
 */
function goBack () {
  console.log('goBack() fired')
  if (window.mui.os.plus) {
    var self = window.plus.webview.currentWebview()
    // 获得父页面的webview
    var parentWebview = getPrevWebview() // self.opener()
    if (parentWebview) {
      // 触发父页面的自定义事件(refresh),从而进行刷新
      window.mui.fire(parentWebview, 'refreshData')

      // 触发父页面的自定义事件(refresh),从而进行刷新
      window.mui.fire(parentWebview, 'refreshPageData', {childId: self.id})

      // 子页面也刷新数据
      window.mui.fire(self, 'refreshData')
      window.mui.fire(parentWebview, 'autoHeight')
    }
  }

  return true
}

/**
 * 清空webview缓存
 */
function clearAllWebViewCache () {
  if (window.mui.os.plus) {
    window.mui.plusReady(function () {
      var self = window.plus.webview.currentWebview()
      var wvs = window.plus.webview.all()
      for (var i = 0; i < wvs.length; i++) {
        if (wvs[i].id !== window.plus.runtime.appid && wvs[i].id !== self.id && wvs[i].id !== 'inwehub_embed' && wvs[i].id !== 'readhub_submission_webview') {
          wvs[i].close()
        }
      }
    })
  }
}

/**
 * 打开第三方网页
 * @param url 第三方网页地址
 * @param articleId 文章id
 * @param title 文章标题
 * @param detailUrl 文章详情url
 * @param imgUrl 文章图片地址
 */
function goThirdPartyArticle (url, articleId, title, detailUrl, imgUrl) {
  console.log('打开第三方网页 url:' + url + ', articleId:' + articleId + ', title' + title + ', detailUrl' + detailUrl + ', imgUrl' + imgUrl)
  var id = articleId
  var pathUrl = detailUrl

  if (/^http/i.test(url)) {
    if (window.mui.os.plus) {
      if (window.mixpanel.track) {
        window.mixpanel.track(
          'inwehub:read_page_detail', {
            'app': 'inwehub',
            'user_device': window.getUserAppDevice(),
            'page': url,
            'page_title': title
          }
        )
      }
      if (window.ga) {
        window.ga('set', 'page', url)
        window.ga('send', 'pageview')
      }
      var articleParams = {
        article_id: id,
        article_url: url,
        article_title: title,
        article_comment_url: pathUrl,
        article_img_url: imgUrl,
        preload: true
      }
      var articleWs = window.mui.openWindow({
        url: getIndexPath() + '#/webview/article',
        id: 'inwehub_article_view',
        preload: false, // 一定要为false
        createNew: false,
        show: {
          autoShow: true,
          aniShow: 'slide-in-right'
        },
        styles: {
          popGesture: 'hide'
        },
        waiting: {
          autoShow: false
        },
        extras: articleParams
      })
      window.mui.fire(articleWs, 'load_article', articleParams)
    } else {
      // var pathUrl = process.env.READHUB_URL + pathUrl + '/webview';

      // url = '/discover/iframe?redirect_url=' + pathUrl + '?' + encodeURIComponent('from=h5')
      // router.push(pathUrl)
      // window.location.href = url
      window.open(url)
    }
  } else {
    router.pushReadHubPage(url)
  }
}

/**
 * 打开第三方任意网页
 * @param url
 */
function goVendorUrl (url, callback) {
  var currentWebview = window.plus.webview.currentWebview()

  var immersedHeight = getImmersedHeight()

  var ws = window.mui.openWindow({
    url: url,
    id: 'vendor_url_open',
    preload: false,
    popGesture: 'hide',
    show: {
      autoShow: false,
      aniShow: 'slide-in-right'
    },
    extras: {preload: false},
    waiting: {
      autoShow: false
    },
    styles: {
      statusbar: {
        background: '#3c3e44'
      },
      backButtonAutoControl: 'hide',
      popGesture: 'hide',
      top: (immersedHeight + 44) + 'px'
    }
  })

  ws.onloaded = (event) => {
    var title = ws.getTitle()
    if (callback) {
      callback(title)
    }
  }

  currentWebview.append(ws)
}

/**
 * 保存当前webviewid
 */
function saveCurrentWebviewId (futureId) {
  window.mui.plusReady(() => {
    var currentWebview = window.plus.webview.currentWebview()
    if (currentWebview.id !== futureId) {
      localEvent.setLocalItem('webview_referer_id', {id: currentWebview.id})
    }
  })
}

function getPrevWebview () {
  var options = localEvent.getLocalItem('webview_referer_id')
  if (options && options.id) {
    return window.plus.webview.getWebviewById(options.id)
  }
}

export {
  openWebviewByUrl,
  openReadhubPage,
  goBack,
  showWebview,
  clearAllWebViewCache,
  openWebviewByHome,
  goThirdPartyArticle,
  goVendorUrl,
  getPrevWebview
}

