import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import {checkUpdate} from '../utils/updateVersion';
import localEvent from '../stores/localStorage';


VueRouter.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1)
}

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'hash',
  routes
});

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
