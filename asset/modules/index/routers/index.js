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


router.pushPlus = function (url) {
  var id = url.replace(/\//g, '');
  if (mui.os.plus) {
    mui.plusReady(function(){
      var fullUrl = plus.webview.currentWebview().getURL();

      console.log('id:'+id);
      console.log('url:'+url);

      console.log('fullUrl1:' + fullUrl);

      fullUrl = fullUrl.replace(/#\/.*?$/, '#'+url);

      if (!fullUrl) {
        fullUrl = 'index.html#' + url;
      }

      console.log('fullUrl2:' + fullUrl);

      mui.openWindow({
        url: fullUrl,
        id: id,
        preload: true,
        show: {
          autoShow:false,
          aniShow: 'pop-in'
        },
        styles: {
          popGesture: 'close'
        },
        waiting: {
          autoShow: true
        }
      });
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
