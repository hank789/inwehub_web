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

import './../../js/iconfont.js';

Vue.use(VueWechatTitle);
// Vue.use(VueLazyload, {
//   loading: loading_img,
//   try: 3
// });

var waitingElements = [];
mui.waiting = function () {

  //var canShutdown = false;

  // var mask = mui.createMask(function(){
  //   return canShutdown;
  // });

  var indicator = document.getElementsByClassName('mint-indicator');
  if (indicator.length) {
    return;
  }

  var element = document.createElement('div');
  element.innerHTML='<div class="mint-indicator" style="display: block;"><div class="mint-indicator-wrapper" style="padding: 8px 8px 4px 8px;"><div class="mint-indicator-spin"><div class="mint-spinner-fading-circle circle-color-19" style="width: 20px; height: 20px;"><div class="mint-spinner-fading-circle-circle is-circle2"></div><div class="mint-spinner-fading-circle-circle is-circle3"></div><div class="mint-spinner-fading-circle-circle is-circle4"></div><div class="mint-spinner-fading-circle-circle is-circle5"></div><div class="mint-spinner-fading-circle-circle is-circle6"></div><div class="mint-spinner-fading-circle-circle is-circle7"></div><div class="mint-spinner-fading-circle-circle is-circle8"></div><div class="mint-spinner-fading-circle-circle is-circle9"></div><div class="mint-spinner-fading-circle-circle is-circle10"></div><div class="mint-spinner-fading-circle-circle is-circle11"></div><div class="mint-spinner-fading-circle-circle is-circle12"></div><div class="mint-spinner-fading-circle-circle is-circle13"></div></div></div></div><div class="mint-indicator-mask"></div></div>';
  document.body.appendChild(element);

  waitingElements.push(element);

  mui.closeWaiting = function(){
    var element = waitingElements.pop();
    if (element) {
      //mask.close();
      document.body.removeChild(element);
    }
  }

  //mask.show();//显示遮罩
}



Vue.use(TimeAgo, {
  name: 'timeago',
  locale: 'zh-CN',
  locales: {
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
});


import {showWebview,clearAllWebViewCache} from '../../utils/webview';
window.showInwehubWebview = showWebview;
window.clearAllWebViewCache = clearAllWebViewCache;

import VueQrcode from 'vue-qrcode'
Vue.component('qrcode', VueQrcode);


Vue.mixin({
  mounted() {
    if (mui.os.wechat && this.$router.currentRoute.meta.wechatHideHeader) {
       var header = document.getElementsByTagName('header');
       if (header && header[0]) {
         header[0].className = header[0].className.replace("mui-bar", "");
         header[0].className = header[0].className.replace("mui-bar-nav", "");

         header[0].className += " mui-wechat-hidden";
       }
    }
  }
})


const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});

export { app, router };
