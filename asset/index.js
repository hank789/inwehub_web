// jQuery and Bootstrap-SASS
// -------------------------
// Questions: Why use CommonJS require?
// Answer: Because es6 module export lead to jquery plug-in can not run.
// -------------------------
// window.$ = window.jQuery = require('jquery');
// require('bootstrap-sass');

import Vue from 'vue';
import VueWechatTitle from 'vue-wechat-title';
import TimeAgo from 'vue-timeago';
import router from './routers/index';

// import VueLazyloadImg from 'vue-lazyload-img';
import VueLazyload from 'vue-lazyload';
import store from './stores/store';
import App from './App';

import loading_img from './statics/images/image-loading.png';

import 'iview/dist/styles/iview.css';

import Form from 'iview/src/components/form';
import { Row, Col } from 'iview/src/components/grid';
import Input from 'iview/src/components/input';
import Button from 'iview/src/components/button';

Vue.component('Form', Form);
Vue.component('iForm', Form);
Vue.component('FormItem', Form.Item);
Vue.component(Row.name, Row)
Vue.component(Input.name, Input)
Vue.component('iInput', Input)
Vue.component('Col', Col)
Vue.component('iCol', Col)
Vue.component('iButton', Button)
Vue.component('Button', Button)

import 'muse-components/styles/base.less' // 加载基础的样式
import bottomNav from 'muse-components/bottomNav/bottomNav'
import bottomNavItem from 'muse-components/bottomNav/bottomNavItem'
import paper from 'muse-components/paper/paper'
import card from 'muse-components/card/card'
import cardHeader from 'muse-components/card/cardHeader'
import cardText from 'muse-components/card/cardText'
import avatar from 'muse-components/avatar/avatar'
import divider from 'muse-components/divider/divider'
import menu from 'muse-components/menu/menu'
import menuItem from 'muse-components/menu/menuItem'

// ..
Vue.component(bottomNav.name, bottomNav)
Vue.component(bottomNavItem.name, bottomNavItem)
Vue.component(paper.name, paper)
Vue.component(card.name, card)
Vue.component(cardHeader.name, cardHeader)
Vue.component(cardText.name, cardText)
Vue.component(avatar.name, avatar)
Vue.component(divider.name, divider)
Vue.component(menu.name, menu)
Vue.component(menuItem.name, menuItem)


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
