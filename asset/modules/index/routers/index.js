import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import localEvent from '../../../stores/localStorage';
import {autoHeight} from '../../../utils/statusBar';
import {openWebviewByUrl, openReadhubPage} from '../../../utils/webview';

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

router.pushReadHubPage = function (url) {
  if (mui.os.plus) {
    openReadhubPage(url);
  } else {
    router.push('/discover?redirect_url='+url);
  }
}

router.pushPlus = function (url, id = '', autoShow=true, aniShow='pop-in', popGesture='hide', forceWebView = false, reload = false) {
  console.log('pushPlusUrl:'+url);
  var footerTab = ['/discover','/home','/task','/my'];

  if (mui.os.plus && ((footerTab.indexOf(url) === -1) || forceWebView)) {
    if (!window.isLocalEnv) {

      if (window.mixpanel.track) {
        var matchedRoute = this.resolve(url);
        var mixpanel_event = 'inwehub:';
        if (matchedRoute.route.name) {
          mixpanel_event += matchedRoute.route.name;
        } else {
          mixpanel_event += matchedRoute.route.fullPath;
        }
        window.mixpanel.track(
          mixpanel_event,
          {"app": "inwehub", "user_device": getUserAppDevice(), "page": matchedRoute.route.fullPath, "page_name": matchedRoute.route.name, "page_title": matchedRoute.route.meta.title}
        );
      }
      if (window.ga) {
        window.ga('set', 'page', url);
        window.ga('send', 'pageview');
      }

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
    if (!id) {
      id = nextUrl;
    }
    //底部4个tab的页面默认为主页
    var urlSplit = url.split('?',1);
    if (footerTab.indexOf(urlSplit[0]) >=0){
      id = plus.runtime.appid;
    } else if (id === nextUrl){
      urlSplit = url.split('/');
      //判断是否列表页面
      if (urlSplit[urlSplit.length-1] >= 0) {
        id = 'list-detail-page';
      }
    }
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
    var mixpanel_event = 'inwehub:';
    if (to.name) {
      mixpanel_event += to.name;
    } else {
      mixpanel_event += to.fullPath;
    }
    window.mixpanel.track(
      mixpanel_event,
      {"app": "inwehub", "user_device": getUserAppDevice(), "page": to.fullPath, "page_name": to.name, "page_title": to.meta.title, "referrer_page": from.fullPath}
    );
  }
});

export default router;
