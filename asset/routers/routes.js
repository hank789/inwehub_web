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
        if (!lauch.showGuide && 1===2) {
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
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
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
  { // 个人信息
    path: '/my/info',
    component: require('../views/Account/info.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },

  { // 个人信息
    path: '/my/info/job/:id',
    component: require('../views/Account/infos/job.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目经历
    path: '/my/info/project/:id',
    component: require('../views/Account/infos/project.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 教育经历
    path: '/my/info/edu/:id',
    component: require('../views/Account/infos/edu.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 教育经历
    path: '/my/info/edus',
    component: require('../views/Account/infos/edus.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 工作经历
    path: '/my/info/jobs',
    component: require('../views/Account/infos/jobs.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目经历
    path: '/my/info/projects',
    component: require('../views/Account/infos/projects.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 培训经历
    path: '/my/info/trains',
    component: require('../views/Account/infos/trains.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 基本信息
    path: '/my/info/basic',
    component: require('../views/Account/infos/basic.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 培训经历
    path: '/my/info/train/:id',
    component: require('../views/Account/infos/train.vue'),
    meta: {
      title: '个人信息'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的钱包
    path: '/my/Finance',
    component: require('../views/Finance/info.vue'),
    meta: {
      title: '我的钱包'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 资金明细
    path: '/my/Finance/list',
    component: require('../views/Finance/list.vue'),
    meta: {
      title: '资金明细'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 提现
    path: '/my/Finance/withdraw',
    component: require('../views/Finance/withdraw.vue'),
    meta: {
      title: '提现'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 行业领域
    path: '/tags/industry',
    component: require('../views/Tags/industryTagsIndexedlist.vue'),
    meta: {
      title: '行业领域'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 专家管理
    path: '/expert',
    component: require('../views/Expert/index.vue'),
    meta: {
      title: '专家管理'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 推荐专家
    path: '/expert/recommend',
    component: require('../views/Expert/recommend.vue'),
    meta: {
      title: '推荐专家'
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
  { //asks
    path: '/asks/finish',
    component: require('../views/Ask/AskListFinish.vue'),
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
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // header
    path: '/header',
    component: require('../views/Account/selectHeader.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover
    path: '/discover',
    component: require('../views/Discover/Discover.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // setting
    path: '/setting',
    component: require('../views/Account/Setting.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // guide
    path: '/guide',
    component: require('../views/Guide.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // feedback
    path: '/feedback',
    component: require('../views/Feedback.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // about
    path: '/about',
    component: require('../views/About.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // project
    path: '/project',
    component: require('../views/Project.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // project
    path: '/help',
    component: require('../views/Account/Help.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // project
    path: '/help/ask',
    component: require('../views/Help/Ask.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // bid
    path: '/bid',
    component: require('../views/Bid.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover detail
    path: '/discover/detail',
    component: require('../views/Discover/Detail.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover project
    path: '/discover/project',
    component: require('../views/Discover/Project.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover company
    path: '/discover/company',
    component: require('../views/Discover/Company.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover activity
    path: '/discover/activity',
    component: require('../views/Discover/Activity.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover detail
    path: '/collect',
    component: require('../views/Account/Collect.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // protocol/register
    path: '/protocol/register',
    component: require('../views/Help/Protocol.vue')
  },
  { // help/question
    path: '/help/question',
    component: require('../views/Help/Question.vue')
  },
  { // message
    path: '/*',
    component: require('../views/404.vue'),
  }
];

export default routes;
