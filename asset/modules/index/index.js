import "../../js/mui"
import Vue from 'vue';

import VueWechatTitle from 'vue-wechat-title';
import TimeAgo from 'vue-timeago';
import router from './routers/index';

// import VueLazyloadImg from 'vue-lazyload-img';
//import VueLazyload from 'vue-lazyload';

import store from './../../stores/store';
import App from './App';

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

var sentry_url = 'https://6cd9e4811e7f4ade86ff3d4a18b28e19@sentry.io/167478';
if (process.env.NODE_ENV === 'production') {
  sentry_url = 'https://0b85668d118943ffa71c7b6c34f0a6bf@sentry.io/175782';
}
Raven
  .config(sentry_url)
  .addPlugin(RavenVue, Vue)
  .install();

import loading_gif from './../../statics/images/loading.gif';
import StarRating from './../../components/star-rating/star-rating';

Vue.component('star-rating', StarRating);
window.loading_gif = loading_gif;

import './../../styles/mui.css';
import './../../styles/common.css';
import './../../styles/mui.picker.all.css';
import './../../styles/font-awesome.css';

Vue.use(VueWechatTitle);
// Vue.use(VueLazyload, {
//   loading: loading_img,
//   try: 3
// });

mui.init({swipeBack:true});

mui.waiting = function () {

  var canShutdown = false;

  var mask = mui.createMask(function(){
    return canShutdown;
  });

  var element = document.createElement('div');
  element.innerHTML='<div class="mint-indicator" style="display: block;"><div class="mint-indicator-wrapper" style="padding: 8px 8px 4px 8px;"><div class="mint-indicator-spin"><div class="mint-spinner-fading-circle circle-color-19" style="width: 20px; height: 20px;"><div class="mint-spinner-fading-circle-circle is-circle2"></div><div class="mint-spinner-fading-circle-circle is-circle3"></div><div class="mint-spinner-fading-circle-circle is-circle4"></div><div class="mint-spinner-fading-circle-circle is-circle5"></div><div class="mint-spinner-fading-circle-circle is-circle6"></div><div class="mint-spinner-fading-circle-circle is-circle7"></div><div class="mint-spinner-fading-circle-circle is-circle8"></div><div class="mint-spinner-fading-circle-circle is-circle9"></div><div class="mint-spinner-fading-circle-circle is-circle10"></div><div class="mint-spinner-fading-circle-circle is-circle11"></div><div class="mint-spinner-fading-circle-circle is-circle12"></div><div class="mint-spinner-fading-circle-circle is-circle13"></div></div></div></div></div>';
  document.body.appendChild(element);

  mui.closeWaiting = function(){
    canShutdown = true;
    mask.close();
    document.body.removeChild(element);
  }

  mask.show();//显示遮罩
}





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
