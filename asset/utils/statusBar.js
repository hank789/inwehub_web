var defaultBgColor = '#3c3e44';
var defaultMode = 'light';
var defaultBackground = '';

var bgColor = null, mode = null, background = null;

function setStatusBarBackgroundAndStyle(baColor, style) {
  if (window.plus) {
    var ws = plus.webview.currentWebview();
    if (!ws.isVisible()) {
      return false;
    }
  } else {
    return false;
  }

  mui.plusReady(function () {
    if (mui.os.plus) {
      var ss = plus.navigator.getStatusBarBackground();
      if (ss !== baColor) {
        console.log("statusBgcolor:" + baColor);
        console.log("statusBarStyle:" + style);
        plus.navigator.setStatusBarBackground(baColor);
        plus.navigator.setStatusBarStyle(style);
      }
    }
  });
}

function getStatusBarBackgroundAndStyle(callback) {
  mui.plusReady(function () {
    var statusBarBackground = plus.navigator.getStatusBarBackground();
    var statusBarStyle = plus.navigator.getStatusBarStyle();
    callback(statusBarBackground, statusBarStyle);
  });
}

function setStatusBarStyle(style) {

  if (window.plus) {
    var ws = plus.webview.currentWebview();
    if (!ws.isVisible()) {
      return false;
    }
  } else {
    return false;
  }

  mui.plusReady(function () {
    if (mui.os.plus) {
      console.log("statusBarStyle:" + style);
      plus.navigator.setStatusBarStyle(style);
    }
  });
}

/**
 * 获取页面配置
 */
function getPageConfig() {
  var statusBarStyleElement = context.querySelector('#statusBarStyle');

  if (statusBarStyleElement) {
    console.log('监测到#statusBarStyle');
    bgColor = statusBarStyleElement.getAttribute('bgColor');
    mode = statusBarStyleElement.getAttribute('mode');
    background = statusBarStyleElement.getAttribute('background');
  }
}

function autoStatusBar(context) {
  if (!context) {
    context = document.getElementById('router-view');
  }

  getPageConfig();

  bgColor = bgColor ? bgColor : defaultBgColor;
  mode = mode ? mode : defaultMode;
  background = background ? background : defaultBackground;

  if (bgColor && mode) {
    setStatusBarBackgroundAndStyle(bgColor, mode);
  } else if (mode) {
    setStatusBarStyle(mode);
  }

  if (background) {
    document.body.style.background = background;
  } else {
    document.body.style.background = '';
  }

  console.log("bodyBackground:" + background);
}

/**
 * 沉浸式处理:
 * 1. 为body添加class .immersed
 * 2. 检测<div id="statusBarStyle" background="#000000" mode="dark"></div>设置mode
 *
 * 非沉浸式处理方式:
 * 1. 检测<div id="statusBarStyle" bgColor="#000000" mode="dark"></div>设置bgcolor 和 mode
 */
function autoHeight(context) {
  if (!context) {
    context = document;
  }

  initImmersed();

  if (window.plus) {
    var ws = plus.webview.currentWebview();
    if (!ws.isVisible()) {
      return false;
    }
  } else {
    return false;
  }

  autoStatusBar();
}

function initImmersed(){
  var immersedHeight = getImmersedHeight();
  document.body.classList.add('immersed' + immersedHeight);

  var routerView = document.getElementById('router-view');

  var firstBackground = getStyle(routerView.children[0], 'background');

  var immersedWrapper = document.getElementById('immersedWrapper');
  if (!immersedWrapper) {
    immersedWrapper = document.createElement('div');
    immersedWrapper.id = 'immersedWrapper';

    routerView.appendChild(immersedWrapper);
  }

  immersedWrapper.style.background = firstBackground;
}

function getStyle(elem, property){
  if(!elem || !property){
    return false;
  }

  if(document.defaultView && document.defaultView.getComputedStyle){
     var css = document.defaultView.getComputedStyle(elem, null);
     var value = css ? css.getPropertyValue(property) : null;
     return value;
  }

  return false;
}

/**
 * 是否启用沉浸式模式
 */
function isEnableImmersed()
{
  if (window.plus && mui.os.ios) {
    return false;
  }

  return true;
}


function getImmersedHeight() {

  var status = isEnableImmersed();
  if (!status) {
    return 0;
  }

  var immersed = 0;
  var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
  if (ms && ms.length >= 3) {    // 当前环境为沉浸式状态栏模式
    immersed = parseFloat(ms[2]);   // 获取状态栏的高度
  }

  if (window.plus && immersed === 0) {
    immersed = 20;
    console.log('app内没有监测到immersed, 初始化为:' + immersed);
  }

  console.log('immersed:' + immersed);
  return immersed;
}


export {
  setStatusBarStyle,
  setStatusBarBackgroundAndStyle,
  getStatusBarBackgroundAndStyle,
  autoHeight,
  getImmersedHeight,
  isEnableImmersed
};
