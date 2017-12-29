var defaultBgColor = '#3c3e44'
var defaultMode = 'light'
var defaultBackground = ''

var bgColor = null
var mode = null
var background = null
var isStatusBarDebug = false

function setStatusBarBackgroundAndStyle (baColor, style) {
  window.mui.plusReady(function () {
    if (window.mui.os.plus) {
      var ss = window.plus.navigator.getStatusBarBackground()
      var statusBarStyle = window.plus.navigator.getStatusBarStyle()

      console.log('当前状态栏: bacolor:' + ss + ', style:' + statusBarStyle)

      if (ss !== baColor) {
        console.log('设置' + ss + '=>statusBgcolor:' + baColor)
        window.plus.navigator.setStatusBarBackground(baColor)
      }

      if (style === 'light' && statusBarStyle !== 'UIStatusBarStyleBlackTranslucent') {
        console.log('设置' + statusBarStyle + '=>statusBarStyle:' + style)
        window.plus.navigator.setStatusBarStyle(style)
      }

      if (style === 'dark' && statusBarStyle !== 'UIStatusBarStyleDefault') {
        console.log('设置' + statusBarStyle + '=>statusBarStyle:' + style)
        window.plus.navigator.setStatusBarStyle(style)
      }
    }
  })
}

function getStatusBarBackgroundAndStyle (callback) {
  window.mui.plusReady(function () {
    var statusBarBackground = window.plus.navigator.getStatusBarBackground()
    var statusBarStyle = window.plus.navigator.getStatusBarStyle()
    callback(statusBarBackground, statusBarStyle)
  })
}

function setStatusBarStyle (style) {
  window.mui.plusReady(function () {
    if (window.mui.os.plus) {
      console.log('statusBarStyle:' + style)
      window.plus.navigator.setStatusBarStyle(style)
    }
  })
}

/**
 * 获取页面配置
 */
function getPageConfig (context) {
  bgColor = null
  mode = null
  background = null

  var statusBarStyleElement = context.querySelector('#statusBarStyle')

  if (statusBarStyleElement) {
    bgColor = statusBarStyleElement.getAttribute('bgColor')
    mode = statusBarStyleElement.getAttribute('mode')
    background = statusBarStyleElement.getAttribute('background')

    console.log('监测到#statusBarStyle: bgColor:' + bgColor + ',mode:' + mode + ',background:' + background)
  } else {
    console.log('未监测到#statusBarStyle')
  }
}

function autoStatusBar (context) {
  if (!context) {
    context = document.getElementById('router-view')
  }

  getPageConfig(context)

  bgColor = bgColor || defaultBgColor
  mode = mode || defaultMode
  background = background || defaultBackground

  console.log('准备设置#statusBarStyle: bgColor:' + bgColor + ',mode:' + mode + ',background:' + background)

  if (bgColor && mode) {
    setStatusBarBackgroundAndStyle(bgColor, mode)
  } else if (mode) {
    setStatusBarStyle(mode)
  }

  if (background) {
    document.body.style.background = background
  } else {
    document.body.style.background = ''
  }

  console.log('bodyBackground:' + background)
}

/**
 * 沉浸式处理:
 * 1. 为body添加class .immersed
 * 2. 检测<div id="statusBarStyle" background="#000000" mode="dark"></div>设置mode
 *
 * 非沉浸式处理方式:
 * 1. 检测<div id="statusBarStyle" bgColor="#000000" mode="dark"></div>设置bgcolor 和 mode
 */
function autoHeight (context) {
  if (!context) {
    context = document.getElementById('router-view')
  }
  console.log('in autoHeight')

  initImmersed(context)

  autoStatusBar(context)
}

function initImmersed (context) {
  var immersedHeight = getImmersedHeight()
  document.body.classList.add('immersed' + immersedHeight)

  var routerView = context // document.getElementById('router-view')

  var firstChildren = routerView.children[0]
  if (firstChildren && firstChildren.className === 'child-view') {
    firstChildren = firstChildren.children[0]
  }

  var firstBackground = getStyle(firstChildren, 'background')

  var firstChildrenClassName = firstChildren ? firstChildren.className : ''

  console.log('#immersedWrapper firstChildrenId:' + firstChildren.id + 'firstChildrenClass:' + firstChildrenClassName + ', background:' + firstBackground)

  var immersedWrapper = context.querySelector('#immersedWrapper')
  if (!immersedWrapper) {
    immersedWrapper = document.createElement('div')
    immersedWrapper.id = 'immersedWrapper'

    routerView.appendChild(immersedWrapper)
  }

  immersedWrapper.style.background = firstBackground

  console.log('#immersedWrapper background:' + firstBackground)
}

function getStyle (elem, property) {
  if (!elem || !property) {
    return false
  }

  if (document.defaultView && document.defaultView.getComputedStyle) {
    var css = document.defaultView.getComputedStyle(elem, null)
    var value = css ? css.getPropertyValue(property) : null
    return value
  }

  return false
}

/**
 * 是否启用沉浸式模式
 */
function isEnableImmersed () {
  if (isStatusBarDebug) {
    console.log('调试模式下开启沉浸式')
    return true
  }
  if (window.plus) {
    return window.plus.navigator.isImmersedStatusbar()
  } else {
    return false
  }
}

function getImmersedHeight () {
  if (isStatusBarDebug) {
    console.log('调试模式下immersedHeight:28')
    return 44
  }

  var status = isEnableImmersed()
  if (!status) {
    console.log('最终immersedHeight:0')
    return 0
  }

  var immersed = 0
  var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent)
  if (ms && ms.length >= 3) {    // 当前环境为沉浸式状态栏模式
    immersed = parseFloat(ms[2])   // 获取状态栏的高度
  }

  if (window.plus && immersed === 0) {
    immersed = 20
    console.log('app内没有监测到immersed, 初始化为:' + immersed)
  }

  // iphoneX 顶部距离缩小
  if (immersed === 44) {
    immersed = 44
  }

  console.log('最终immersedHeight:' + immersed)
  return immersed
}

export {
  setStatusBarStyle,
  setStatusBarBackgroundAndStyle,
  getStatusBarBackgroundAndStyle,
  autoHeight,
  getImmersedHeight,
  isEnableImmersed
}
