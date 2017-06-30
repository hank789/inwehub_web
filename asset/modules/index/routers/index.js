import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
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
  console.log('url:'+url);
  if (mui.os.plus && mui.os.ios) {
    mui.plusReady(function(){
      var currentUrl = plus.webview.currentWebview().getURL();

      console.log('current_url:' + currentUrl);

      //nextUrl = nextUrl.replace(/#\/.*?$/, '#'+url);
      var nextUrl = 'index.html#' + url;

      console.log('nextUrl:' + nextUrl);

      mui.openWindow({
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
    });
  } else {
    router.push(url);
  }
}

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
