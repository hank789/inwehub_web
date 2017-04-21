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
    component: require('../views/Ask/Ask.vue'),
    meta: {
      title: '提问'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-type
    path: '/ask/type',
    component: require('../views/Ask/AskType.vue'),
    meta: {
      title: '选择问题分类'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //task
    path: '/task',
    component: require('../views/Task/Task.vue'),
    meta: {
      title: '任务'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-detail
    path: '/ask/:id',
    component: require('../views/Ask/AskDetail.vue'),
    meta: {
      title: '受理成功'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //asks
    path: '/asks',
    component: require('../views/Ask/AskList.vue'),
    meta: {
      title: '我的提问'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //answer
    path: '/answers',
    component: require('../views/Answer/AnswerList.vue'),
    meta: {
      title: '我的回答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //answer-detail
    path: '/answer/:id',
    component: require('../views/Answer/AnswerDetail.vue'),
    meta: {
      title: '应答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //answerrefuse
    path: '/answerrefuse/:id',
    component: require('../views/Answer/Refuse.vue'),
    meta: {
      title: '拒绝应答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // answerTime
    path: '/answerTime/:id',
    component: require('../views/Answer/SelectTime.vue'),
    meta: {
      title: '确认应答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // answer
    path: '/realAnswer/:id',
    component: require('../views/Answer/Answer.vue'),
    meta: {
      title: '确认应答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-comment
    path: '/askComment/:id',
    component: require('../views/Ask/Comment.vue'),
    meta: {
      title: '应答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // message
    path: '/message',
    component: require('../views/message.vue'),
  }
];

export default routes;
