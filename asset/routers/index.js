import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import {checkUpdate} from '../utils/updateVersion';

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'hash',
  routes
});

router.beforeEach((to, from, next) => {
  //...
  mui.plusReady(function() {
    checkUpdate();
  });

  next();
});

export default router;
