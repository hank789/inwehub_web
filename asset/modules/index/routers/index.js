import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import localEvent from '../../../stores/localStorage';
import {autoHeight} from '../../../utils/statusBar';
import {openWebviewByUrl} from '../../../utils/webview';

//统计用户的浏览行为;
import ga from 'vue-ga';
import VueMultianalytics from 'vue-multianalytics';

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
const gaCode = process.env.GA_CODE;

ga(router, gaCode);

let mixpanelConfig = {
  token: '688ee16000ddf4f44891e06b79847d4e'
}
Vue.use(VueMultianalytics, {
  modules: {
    mixpanel: mixpanelConfig
  },
  routing: {
    vueRouter: router, //  Pass the router instance to automatically sync with router (optional)
    preferredProperty: 'path', // By default 'path' and related with vueRouter (optional)
    ingoredViews: [], // Views that will not be tracked
    ignoredModules: ['ga','facebook','segment'] // Modules that will not send route change events. The event sent will be this.$ma.trackView({viewName: 'homepage'}, ['ga'])
  }
})

router.pushPlus = function (url, autoShow=true, aniShow='pop-in', popGesture='hide', forceWebView = false) {
  console.log('url:'+url);
  if (mui.os.plus && (mui.os.ios || forceWebView)) {
    this.app.$ma.trackEvent({category: 'Page Viewed', action: url},['ga']);
    openWebviewByUrl(url, autoShow, aniShow, popGesture);
  } else {
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

export default router;
