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

import '../../js/socket.io.min';

import Echo from "laravel-echo";
window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: process.env.ECHO_SERVER_ADDRESS,
  auth:
    {
      headers:
        {
          'Authorization': 'Bearer ' + 'nb35mdq2ca9828qgl4sgjf4imil5811sn41qsmcaph0p3h6sa5ht8hoktdeg'
        }
    }
});

import VueQRCodeComponent from 'vue-qrcode-component';
Vue.component('qr-code', VueQRCodeComponent);


import {hideHeaderHandler} from '../../utils/wechat';

import {autoHeight} from '../../utils/statusBar';

import EventObj from '../../utils/event';


//mui.toast = (str) => {
//   var oldtoast = mui.toast;
//   mui.toast = (str) => { return false }
//
//   var toast = document.querySelector("#toast");
//   toast.style.display ="block";
//   //console.log(toast.innerHTML);
//   toast.innerHTML = str;
//
//   var timer = setInterval(() => {
//     toast.style.display = "none";
//     mui.toast = oldtoast;
//     clearTimeout(timer);
//   },3000);
//}


Vue.mixin({
  activated(){
    if (!this.$el || this.$el.id !== 'router-view') {
      return;
    }

    autoHeight();
    hideHeaderHandler(this, 'activated');
  },
  mounted() {
    if (!this.$el || this.$el.id !== 'router-view') {
       return;
    }

    //调节状态栏高度方法
    EventObj.addEventListener('autoHeight', (e) => {
       console.log('calledEvent: autoHeight');
       autoHeight();
    });

    //刷行数据方法
    EventObj.addEventListener('refreshPageData', (e) => {
       console.log('calledEvent: refreshPageData');
       if (this.refreshPageData) {
           this.refreshPageData();
       }
    });

    autoHeight();
    hideHeaderHandler(this, 'mounted');
  },
  created(){
    //当使用webview方式打开的话，会显示webview，并绑定侧滑事件
    if (this.$parent && this.$parent.$el && this.$parent.$el.id === 'app') {
      showWebview();
    }
  }
});


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
