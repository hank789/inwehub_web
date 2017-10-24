var defaultBgColor = '#3c3e44';
var defaultMode = 'light';
var defaultBackground = '';

var bgColor = null, mode = null, background = null;

function setStatusBarBackgroundAndStyle(baColor, style)
{
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

function getStatusBarBackgroundAndStyle(callback)
{
    mui.plusReady(function () {
      var statusBarBackground =  plus.navigator.getStatusBarBackground();
      var statusBarStyle = plus.navigator.getStatusBarStyle();
      callback(statusBarBackground, statusBarStyle);
    });
}

function setStatusBarStyle(style)
{

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
function getPageConfig(){
  var statusBarStyleElement = context.querySelector('#statusBarStyle');

  if (statusBarStyleElement) {
    console.log('监测到#statusBarStyle');
    bgColor = statusBarStyleElement.getAttribute('bgColor');
    mode = statusBarStyleElement.getAttribute('mode');
    background = statusBarStyleElement.getAttribute('background');
  }
}

function autoStatusBar(context)
{
  if (!context) {
    context =  document.getElementById('router-view');
  }

  getPageConfig();

  bgColor = bgColor?bgColor:defaultBgColor;
  mode = mode?mode:defaultMode;
  background = background?background:defaultBackground;

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
 * 3. 为.immersedPaddingTop 自动添加paddingTop值为状态栏高度值
 * 4. 为.immersedTop 自动添加top值为状态栏高度值
 *
 * 非沉浸式处理方式:
 * 1. 检测<div id="statusBarStyle" bgColor="#000000" mode="dark"></div>设置bgcolor 和 mode
 */
function autoHeight(context)
{
  if (!context) {
    context = document;
  }

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


function getImmersedHeight(){
  var immersed = 0;
  var ms=(/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
  if(ms&&ms.length>=3){ // 当前环境为沉浸式状态栏模式
    immersed=parseFloat(ms[2]);// 获取状态栏的高度
  }
  console.log('immersed:' + immersed);
  return immersed;
}

export {
  setStatusBarStyle,
  setStatusBarBackgroundAndStyle,
  getStatusBarBackgroundAndStyle,
  autoHeight,
  getImmersedHeight
};
