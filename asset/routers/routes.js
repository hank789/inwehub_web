/* views */
//import Login from '../views/Login.vue';
import Login from '../views/Login2.vue';
//import Register from '../views/Register.vue';
import Register from '../views/Register2.vue';
//import FindPassword from '../views/FindPassword.vue';
import FindPassword2 from '../views/FindPassword2.vue';

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
    component: FindPassword2,
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
  { // test
    path: '/test',
    component: require('../views/test.vue'),
  },
];

export default routes;
