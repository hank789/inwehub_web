// jQuery and Bootstrap-SASS
// -------------------------
// Questions: Why use CommonJS require?
// Answer: Because es6 module export lead to jquery plug-in can not run.
// -------------------------
// window.$ = window.jQuery = require('jquery');
// require('bootstrap-sass');

import mui from "./js/mui"
import Vue from 'vue';

import VueWechatTitle from 'vue-wechat-title';
import TimeAgo from 'vue-timeago';
import router from './routers/index';

// import VueLazyloadImg from 'vue-lazyload-img';
import VueLazyload from 'vue-lazyload';

import store from './stores/store';
import App from './App';

window.mui = mui;

import loading_img from './statics/images/image-loading.png';
import loading_gif from './statics/images/loading.gif';

window.loading_gif = loading_gif;

import './styles/mui.css';
import './styles/icons-extra.css';
import './styles/iconfont.css';
import './styles/common.css';

mui.init();

Vue.use(VueWechatTitle);
Vue.use(VueLazyload, {
  loading: loading_img,
  try: 3
});
Vue.use(TimeAgo, {
  name: 'timeago',
  locale: 'zh-CN',
  locales: {
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
});

const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});

export { app, router };
