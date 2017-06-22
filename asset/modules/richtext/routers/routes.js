import Home from '../../../views/Home.vue';

import {requestAuth, CanNotGetInWhenLogged} from '../../../utils/auth';

import localEvent from '../../../stores/localStorage';

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: '主页'
    },
    beforeEnter: (to, from, next) => {
      next({
        path: '/home'
      });

    }
  },
  { //answer-detail
    path: '/answer/:id',
    component: require('../../../views/Answer/AnswerDetail.vue'),
    meta: {
      title: '应答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-detail
    path: '/ask/:id',
    component: require('../../../views/Ask/AskDetail.vue'),
    meta: {
      title: '提问'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // answer
    path: '/realAnswer/:id',
    component: require('../../../views/Answer/Answer.vue'),
    meta: {
      title: '应答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // message
    path: '/*',
    meta: {
      title: '404'
    },
    component: require('../../../views/404.vue'),
  }
];

export default routes;
