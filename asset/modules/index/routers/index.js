import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import {checkUpdate} from '../../../utils/updateVersion';
import localEvent from '../../../stores/localStorage';


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


router.pushPlus = function (url, autoShow=true, aniShow='pop-in', popGesture='hide') {
  if (mui.os.plus && mui.os.ios) {
    mui.plusReady(function(){
      var currentUrl = plus.webview.currentWebview().getURL();

      var nextUrl = currentUrl;

      console.log('url:'+url);

      console.log('current_url:' + currentUrl);

      //nextUrl = nextUrl.replace(/#\/.*?$/, '#'+url);
      nextUrl = 'index.html#' + url;

      console.log('nextUrl:' + nextUrl);

      var nw = mui.openWindow({
        url: nextUrl,
        id: nextUrl,
        preload: false,//一定要为false
        show: {
          autoShow: autoShow,
          aniShow: aniShow
        },
        styles: {
          popGesture: popGesture
        },
        waiting: {
          autoShow: false
        }
      });
      console.log(nw.id);
    });
  } else {
    router.push(url);
  }
}

router.beforeEach((to, from, next) => {
  // 检查版本更新
  mui.plusReady(function() {
    checkUpdate();
  });

  var referer = from.path;
  localEvent.setLocalItem('referer', {path:referer});

  next();
});

export default router;
