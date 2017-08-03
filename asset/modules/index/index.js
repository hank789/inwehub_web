import "../../js/mui"
import Vue from 'vue';

//Vuejs 单页应用在iOS系统下部分APP的webview中 标题不能通过 document.title = xxx 的方式修改;
import VueWechatTitle from 'vue-wechat-title';
// vue 使用时间的插件；
import TimeAgo from 'vue-timeago';

import router from './routers/index';

// import VueLazyloadImg from 'vue-lazyload-img';
//import VueLazyload from 'vue-lazyload';

 //vuex 状态管理器；
import store from './../../stores/store';
//主体的组件；
import App from './App';

//检查错误信息插件
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

//正在加载的图片；
import loading_gif from './../../statics/images/loading.gif';
//vue 评分插件；
import StarRating from './../../components/star-rating/star-rating';

Vue.component('star-rating', StarRating);
window.loading_gif = loading_gif;

 //mui的插件；
import './../../styles/mui.css';
import './../../styles/common.css';
import './../../styles/mui.picker.all.css';
import './../../styles/iconfont.css';
import './../../styles/percircle.css';

import './../../js/iconfont.js';

Vue.use(VueWechatTitle);
// Vue.use(VueLazyload, {
//   loading: loading_img,
//   try: 3
// });

import {bindWaitting} from '../../utils/waiting';
bindWaitting(mui);

import {bindUploadWaiting} from '../../utils/uploadProgress';
bindUploadWaiting(mui);

Vue.use(TimeAgo, {
  name: 'timeago',
  locale: 'zh-CN',
  locales: {
    'zh-CN': require('vue-timeago/locales/zh-CN.json'),
    'zh-Diff': [
      "刚刚",
      "%s 秒",
      "%s 分钟",
      "%s 小时",
      "%s 天",
      "%s 周",
      "%s 月",
      "%s 年"
    ]
  }
});


import {showWebview,clearAllWebViewCache} from '../../utils/webview';
window.showInwehubWebview = showWebview;
window.clearAllWebViewCache = clearAllWebViewCache;

import VueQRCodeComponent from 'vue-qrcode-component';
Vue.component('qr-code', VueQRCodeComponent);


import {hideHeaderHandler} from '../../utils/wechat';

import {autoHeight} from '../../utils/statusBar';

Vue.mixin({
  activated(){
    autoHeight();
    hideHeaderHandler(this, 'activated');
  },
  mounted() {
    autoHeight();
    hideHeaderHandler(this, 'mounted');
  }
})

mui.muiOldBack = mui.back;
mui.back = function(){
  if (mui.os.plus) {
    mui.muiOldBack();
  } else {
    router.go(-1);
  }
};


const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});

export { app, router };
