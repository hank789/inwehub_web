/* views */

import Login from '../views/Login.vue';

import Register from '../views/Register.vue';

import FindPassword from '../views/FindPassword.vue';

import Home from '../views/Home.vue';

import { requestAuth, CanNotGetInWhenLogged } from '../utils/auth';

import localEvent from '../stores/localStorage';

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: '主页'
    },
    beforeEnter: (to, from, next) => {
      if(mui.os.plus){
        var lauch = localEvent.getLocalItem('lauchFlag');
        if (!lauch.showGuide) {
          mui.plusReady(function () {
            plus.navigator.setFullscreen(true);
            next({
              path: '/guide'
            });
          });
        } else {
          next({
            path: '/home'
          });
        }
      } else {
        next({
          path: '/home'
        });
      }
    }
  },
  { // message
    path: '/home',
    component: require('../views/Home.vue'),
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
  { // 我的
    path: '/my/info',
    component: require('../views/Account/info.vue'),
    meta: {
      title: '个人信息'
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
  { //ask-pay-success
    path: '/pay/ask/:id',
    component: require('../views/Pay/AskSuccess.vue'),
    meta: {
      title: '支付成功'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-success
    path: '/askSuccess/:id',
    component: require('../views/Ask/AskSuccess.vue'),
    meta: {
      title: '提问成功'
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
    component: require('../views/Task/TaskListSub.vue'),
    meta: {
      title: '任务'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  /*
  { //task sub
    path: '/task/list',
    component: require('../views/Task/TaskListSub.vue'),
    meta: {
      title: '任务'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  */
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
  },
  { // header
    path: '/header',
    component: require('../views/Account/selectHeader.vue'),
  },
  { // discover
    path: '/discover',
    component: require('../views/Discover/Discover.vue'),
  },
  { // guide
    path: '/guide',
    component: require('../views/Guide.vue'),
  },
  { // feedback
    path: '/feedback',
    component: require('../views/Feedback.vue'),
  },
  { // message
    path: '/*',
    component: require('../views/404.vue'),
  }
];

export default routes;
