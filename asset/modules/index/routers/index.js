import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import localEvent from '../../../stores/localStorage';
import {autoHeight} from '../../../utils/statusBar';
import {openWebviewByUrl} from '../../../utils/webview';

//统计用户的浏览行为;
import ga from 'vue-ga';

VueRouter.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1)
}



VueRouter.prototype.jump = function (url) {
  window.location.href=url;
}

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'hash',
  routes
});

if (!window.isLocalEnv) {
  const gaCode = process.env.GA_CODE;

  ga(router, gaCode);
}

router.pushPlus = function (url, autoShow=true, aniShow='pop-in', popGesture='hide', forceWebView = false, reload = false) {
  console.log('pushPlusUrl:'+url);
  var footerTab = ['/discover','/home','/task','/my'];

  if (mui.os.plus && ((mui.os.ios && footerTab.indexOf(url) === -1) || forceWebView)) {
    if (!window.isLocalEnv) {

      window.mixpanel.track(
        url
      );

      if (/^http/.test(url)) {
        var nextUrl =  url;
      } else {
        var nextUrl = 'index.html#' + url;
      }
    } else {
        if (/^http/.test(url)) {
          var nextUrl =  url;
        } else {
          nextUrl = location.protocol + '//' + window.location.host + '/' + 'index.html#' + url;
        }
    }
    var id = nextUrl;
    //底部4个tab的页面默认为主页
    var urlSplit = url.split('?',1);
    if (footerTab.indexOf(urlSplit[0]) >=0){
      id = plus.runtime.appid;
    }

    console.log('pushPlusUrl-Webview:' + nextUrl);
    openWebviewByUrl(id, nextUrl, autoShow, aniShow, popGesture, reload);
  } else {
    console.log('pushPlusUrl-router:' + url);
    router.push(url);
  }
};

router.beforeEach((to, from, next) => {
  var referer = from.path;
  localEvent.setLocalItem('referer', {path:referer});

  mui.plusReady(function () {
    if (from.path === 'login') {
      plus.navigator.setFullscreen(true);
    } else {
      plus.navigator.setFullscreen(false);
    }
  });

  next();
});

router.afterEach((to, from) => {
  if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
    window.mixpanel.track(
      to.fullPath,
      {"url_name": to.name, "referrer_url": from.fullPath}
    );
  }
});

export default router;
