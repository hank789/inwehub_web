// jQuery and Bootstrap-SASS
// -------------------------
// Questions: Why use CommonJS require?
// Answer: Because es6 module export lead to jquery plug-in can not run.
// -------------------------
// window.$ = window.jQuery = require('jquery');
// require('bootstrap-sass');

import "./js/mui"
import Vue from 'vue';

import VueWechatTitle from 'vue-wechat-title';
import TimeAgo from 'vue-timeago';
import router from './routers/index';

// import VueLazyloadImg from 'vue-lazyload-img';
import VueLazyload from 'vue-lazyload';

import store from './stores/store';
import App from './App';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
Raven
  .config('https://6cd9e4811e7f4ade86ff3d4a18b28e19@sentry.io/167478')
  .addPlugin(RavenVue, Vue)
  .install();


import loading_img from './statics/images/image-loading.png';
import loading_gif from './statics/images/loading.gif';
import StarRating from 'vue-star-rating'
Vue.component('star-rating', StarRating);

window.loading_gif = loading_gif;

import './styles/mui.css';
import './styles/icons-extra.css';
import './styles/iconfont.css';
import './styles/common.css';
import './styles/mui.picker.all.css';
import './styles/font-awesome.css';


Vue.use(VueWechatTitle);
Vue.use(VueLazyload, {
  loading: loading_img,
  try: 3
});

mui.init({swipeBack:true});

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
