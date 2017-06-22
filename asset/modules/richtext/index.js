import "../../js/mui"
import Vue from 'vue';

import VueWechatTitle from 'vue-wechat-title';

import router from './routers/index';

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

window.loading_gif = loading_gif;

import './../../styles/mui.css';
import './../../styles/common.css';

Vue.use(VueWechatTitle);

const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});

export { app, router };
