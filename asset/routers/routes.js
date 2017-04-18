/* views */

import Login from '../views/Login.vue';

import Register from '../views/Register.vue';

import FindPassword from '../views/FindPassword.vue';

import Home from '../views/Home.vue';

import { requestAuth, CanNotGetInWhenLogged } from '../utils/auth';

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: '主页'
    }
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    },
    beforeEnter: (to, from, next) => {
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  {
    path: '/register',
    component: Register,
    meta: {
      title: '注册'
    },
    beforeEnter: (to, from, next) => {
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  {
    path: '/findpassword',
    component: FindPassword,
    meta: {
      title: '找回密码'
    },
    beforeEnter: (to, from, next) => {
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  { // 我的
    path: '/my',
    component: require('../views/Account/my.vue'),
    meta: {
      title: '个人中心'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask
    path: '/ask',
    component: require('../views/Ask.vue'),
    meta: {
      title: '提问'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // message
    path: '/message',
    component: require('../views/message.vue'),
  },
];

export default routes;
