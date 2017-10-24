/* views */

import Login from '../../../views/Login.vue';

import Register from '../../../views/Register.vue';

import FindPassword from '../../../views/FindPassword.vue';

import Home from '../../../views/Home.vue';

import {requestAuth, CanNotGetInWhenLogged} from '../../../utils/auth';

import localEvent from '../../../stores/localStorage';
import {checkUpdate} from '../../../utils/updateVersion';

const routes = [{
  path: '/',
  component: Home,
  name: 'land-home',
  meta: {
    title: '主页'
  },
  beforeEnter: (to, from, next) => {
    if (mui.os.plus) {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
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
    name: 'home',
    meta: {
      title: 'Inwehub',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/Home.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //首页活动列表页
    path: '/home/ActiveList',
    name: 'activity-list',
    meta: {
      title: '活动列表',
      wechatHideHeader: true
    },
    component: require('../../../views/Activity/ActiveList.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //首页机遇列表页
    path: '/home/OpportunityList',
    name: 'opportunity-list',
    meta: {
      title: '机遇列表',
      wechatHideHeader: true
    },
    component: require('../../../views/Activity/OpportunityList.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //首页报名页面
    path: '/EnrollmentStatus/:id',
    name: 'activity-detail',
    meta: {
      title: '活动详情',
      wechatHideHeader: true
    },
    component: require('../../../views/Activity/EnrollmentStatus.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //问答社区-专业问答
    path: '/askCommunity/majors',
    name: 'askCommunity-major-list',
    meta: {
      title: '问答社区-专业问答',
      wechatHideHeader: true
    },
    component: require('../../../views/AskCommunity/MajorList.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //问答社区-专业回答-问答详情；
    path: '/askCommunity/major/:id',
    name: 'ask-major-detail',
    meta: {
      title: '问答社区-专业问答详情',
      wechatHideHeader: false
    },
    component: require('../../../views/AskCommunity/MajorDetail.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //问答社区-互动回答
    path: '/askCommunity/interactions',
    name: 'askCommunity-interaction-list',
    meta: {
      title: '问答社区-互动回答',
      wechatHideHeader: true
    },
    component: require('../../../views/AskCommunity/InteractionList.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //问答社区-互动回答-回答列表；
    path: '/askCommunity/interaction/answers/:id',
    name: 'ask-interaction',
    meta: {
      title: '问答社区-互动回答-回答列表',
      wechatHideHeader: false
    },
    component: require('../../../views/AskCommunity/InteractionAnswers.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //问答社区-互动回答-问答详情；
    path: '/askCommunity/interaction/:id',
    name: 'ask-interaction-detail',
    meta: {
      title: '问答社区-互动问答详情',
      wechatHideHeader: false
    },
    component: require('../../../views/AskCommunity/InteractionDetail.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //邀请回答
    path: '/contact/:id',
    name: 'contact',
    meta: {
      title: '邀请回答',
      wechatHideHeader: true
    },
    component: require('../../../views/Contact.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录'
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      CanNotGetInWhenLogged(to, from, next)
    }
  },
  {
    path: '/register',
    name: 'register',
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
    name: 'findpassword',
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
    name: 'my',
    component: require('../../../views/Account/my.vue'),
    meta: {
      title: '我的',
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { // 我的收藏
    path: '/my/collected',
    name: 'my-collected',
    meta: {
      title: '我的收藏',
      wechatHideHeader: true
    },
    component: require('../../../views/Account/Collected.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的报名 活动
    path: '/my/Discount',
    name: 'my-Discount',
    meta: {
      title: '我的报名',
      wechatHideHeader: true
    },
    component: require('../../../views/Account/DiscountList.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的报名 机遇
    path: '/my/Chance',
    name: 'my-enroll',
    meta: {
      title: '我的报名',
      wechatHideHeader: true
    },
    component: require('../../../views/Account/ChanceList.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //成长说明；
    path: '/my/Growth',
    name: 'my-Growtht',
    component: require('../../../views/Account/Growth.vue'),
    meta: {
      title: '成长说明',
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { // 专家认证引导
    path: '/my/pilot',
    name: 'my-pilot',
    component: require('../../../views/Account/Expertpilot.vue'),
    meta: {
      title: '专家认证引导',
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { // 关注我的
    path: '/my/focus',
    name: 'my-followed',
    component: require('../../../views/Account/focus.vue'),
    meta: {
      title: '关注我的',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 个人信息
    path: '/my/info',
    name: 'my-info',
    component: require('../../../views/Account/info.vue'),
    meta: {
      title: '我的信息',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 个人名片
    path: '/my/resume',
    name: 'my-resume',
    component: require('../../../views/Account/Resume.vue'),
    meta: {
      title: '个人名片',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    },

  },
  { // 共享个人名片
    path: '/share/resume',
    name: 'share-resume-old',
    component: require('../../../views/Account/Resume.vue'),
    meta: {
      title: '分享名片',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      next();
    },

  },
  { // 共享个人名片
    path: '/share/resume/:id',
    name: 'share-resume',
    component: require('../../../views/Account/Resume.vue'),
    meta: {
      title: '分享名片',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      next();
    },

  },

  { // 个人信息
    path: '/my/info/job/:id',
    name: 'my-info-job',
    component: require('../../../views/Account/infos/job.vue'),
    meta: {
      title: '工作经历详情',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目经历
    path: '/my/info/project/:id',
    name: 'my-info-project',
    component: require('../../../views/Account/infos/project.vue'),
    meta: {
      title: '项目经历详情',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 教育经历
    path: '/my/info/edu/:id',
    name: 'my-info-edu',
    component: require('../../../views/Account/infos/edu.vue'),
    meta: {
      title: '教育经历详情',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 教育经历
    path: '/my/info/edus',
    name: 'my-info-edus',
    component: require('../../../views/Account/infos/edus.vue'),
    meta: {
      title: '教育经历列表',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 工作经历
    path: '/my/info/jobs',
    name: 'my-info-jobs',
    component: require('../../../views/Account/infos/jobs.vue'),
    meta: {
      title: '工作经历列表',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目经历
    path: '/my/info/projects',
    name: 'my-info-projects',
    component: require('../../../views/Account/infos/projects.vue'),
    meta: {
      title: '项目经历列表',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 培训经历
    path: '/my/info/trains',
    name: 'my-info-trains',
    component: require('../../../views/Account/infos/trains.vue'),
    meta: {
      title: '培训经历列表',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的档案
    path: '/my/info/basic',
    component: require('../../../components/PageTransition.vue'),
    meta: {
      title: '我的档案',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    },
    children: [{
      path: '',
      name: 'my-info-basic',
      meta: {
        title: '基本资料',
        wechatHideHeader: true
      },
      component: require('../../../views/Account/infos/basic.vue'),
    },
      { // 个人签名
        path: '/my/info/basic/description',
        name: 'my-info-basic-description',
        component: require('../../../views/Account/infos/basic_description.vue'),
        meta: {
          title: '个人签名'
        },
        beforeEnter: (to, from, next) => {
          requestAuth(to, from, next)
        }
      },
      { // 姓名
        path: '/my/info/basic/name',
        name: 'my-info-basic-name',
        component: require('../../../views/Account/infos/basic_name.vue'),
        meta: {
          title: '用户姓名'
        },
        beforeEnter: (to, from, next) => {
          requestAuth(to, from, next)
        }
      },
      { // 地址
        path: '/my/info/basic/address',
        name: 'my-info-basic-address',
        component: require('../../../views/Account/infos/basic_address.vue'),
        meta: {
          title: '详细地址'
        },
        beforeEnter: (to, from, next) => {
          requestAuth(to, from, next)
        }
      },
      { // 公司
        path: '/my/info/basic/company',
        name: 'my-info-basic-company',
        component: require('../../../views/Account/infos/basic_company.vue'),
        meta: {
          title: '当前公司'
        },
        beforeEnter: (to, from, next) => {
          requestAuth(to, from, next)
        }
      },
      { // 职位
        path: '/my/info/basic/position',
        name: 'my-info-basic-position',
        component: require('../../../views/Account/infos/basic_position.vue'),
        meta: {
          title: '当前职位'
        },
        beforeEnter: (to, from, next) => {
          requestAuth(to, from, next)
        }
      },
      { // email
        path: '/my/info/basic/email',
        name: 'my-info-basic-email',
        component: require('../../../views/Account/infos/basic_email.vue'),
        meta: {
          title: '电子邮箱'
        },
        beforeEnter: (to, from, next) => {
          requestAuth(to, from, next)
        }
      }
    ]
  },

  { // 隐私设置
    path: '/my/info/privacy',
    name: 'my-info-privacy',
    component: require('../../../views/Account/infos/privacy.vue'),
    meta: {
      title: '隐私设置',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 培训经历
    path: '/my/info/train/:id',
    name: 'my-info-train',
    component: require('../../../views/Account/infos/train.vue'),
    meta: {
      title: '培训经历',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的钱包
    path: '/my/Finance',
    name: 'my-finance',
    component: require('../../../views/Finance/info.vue'),
    meta: {
      title: '我的钱包'
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { // 资金明细
    path: '/my/Finance/list',
    name: 'my-finance-list',
    component: require('../../../views/Finance/list.vue'),
    meta: {
      title: '资金明细'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 提现
    path: '/my/Finance/withdraw',
    name: 'my-finance-withdraw',
    component: require('../../../views/Finance/withdraw.vue'),
    meta: {
      title: '提现'
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { // 安全设置
    path: '/my/Finance/setting',
    name: 'my-finance-setting',
    component: require('../../../views/Finance/setting.vue'),
    meta: {
      title: '安全设置'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 行业领域
    path: '/tags/industry',
    name: 'select-tags-industry',
    component: require('../../../views/Tags/industryTagsIndexedlist.vue'),
    meta: {
      title: '行业领域'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 专家管理
    path: '/expert',
    name: 'expert',
    component: require('../../../views/Expert/index.vue'),
    meta: {
      title: '专家管理'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 专家申请
    path: '/expert/apply',
    name: 'expert-apply',
    component: require('../../../views/Expert/apply.vue'),
    meta: {
      title: '专家申请',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 专家申请成功
    path: '/expert/apply/success',
    name: 'expert-apply-success',
    component: require('../../../views/Expert/applySuccess.vue'),
    meta: {
      title: '申请专家成功'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 推荐专家
    path: '/expert/recommend',
    name: 'expert-recommend',
    component: require('../../../views/Expert/recommend.vue'),
    meta: {
      title: '推荐专家',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask
    path: '/ask',
    name: 'ask',
    component: require('../../../views/Ask/Ask.vue'),
    meta: {
      title: '提问'
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //ask-interaction
    path: '/ask/interaction',
    name: 'ask/interaction',
    component: require('../../../views/Ask/AskInteraction.vue'),
    meta: {
      title: '提问'
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //ask-pay-success
    path: '/pay/ask/:id',
    name: 'pay-ask',
    component: require('../../../views/Pay/AskSuccess.vue'),
    meta: {
      title: '支付成功',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-success
    path: '/paySuccess',
    name: 'pay-success',
    component: require('../../../views/Pay/PaySuccess.vue'),
    meta: {
      title: '支付成功',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-success
    path: '/askSuccess/:id',
    name: 'ask-success',
    component: require('../../../views/Ask/AskSuccess.vue'),
    meta: {
      title: '提问成功'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-type
    path: '/ask/type',
    name: 'select-ask-type',
    component: require('../../../views/Ask/AskType.vue'),
    meta: {
      title: '选择问题分类',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //task
    path: '/task',
    name: 'task',
    component: require('../../../views/Task/TaskListSub.vue'),
    meta: {
      title: '动态',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { ///inform 消息
    path: '/inform',
    name: 'inform-list',
    component: require('../../../views/Task/InformList.vue'),
    meta: {
      title: '动态',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //taskbar 任务动态
    path: '/taskbar',
    name: 'inform-task',
    component: require('../../../views/Task/Taskbar.vue'),
    meta: {
      title: '任务动态',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //readbar 阅读发现
    path: '/readbar',
    name: 'inform-read',
    component: require('../../../views/Task/readbar.vue'),
    meta: {
      title: '阅读发现',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //informbar 通知公告
    path: '/informbar',
    name: 'inform-notice',
    component: require('../../../views/Task/informbar.vue'),
    meta: {
      title: '通知公告',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //integralbar 积分变动
    path: '/integralbar',
    name: 'inform-integral',
    component: require('../../../views/Task/integralbar.vue'),
    meta: {
      title: '积分变动',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //balancebar 余额变动
    path: '/balancebar',
    name: 'inform-balance',
    component: require('../../../views/Task/balancebar.vue'),
    meta: {
      title: '余额变动',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //chat 客服
    path: '/chat',
    name: 'inform-chat',
    component: require('../../../views/Task/chat.vue'),
    meta: {
      title: '客服',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-detail
    path: '/ask/:id',
    name: 'ask-detail',
    component: require('../../../views/Ask/AskDetail.vue'),
    meta: {
      title: '提问',
      wechatHideHeader: false
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //asks
    path: '/asks',
    name: 'ask-list-unfinish',
    component: require('../../../views/Ask/AskList.vue'),
    meta: {
      title: '我的提问',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //asks
    path: '/asks/finish',
    name: 'ask-list-finished',
    component: require('../../../views/Ask/AskListFinish.vue'),
    meta: {
      title: '我的提问',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //answer
    path: '/answers',
    name: 'answer-list-unfinish',
    component: require('../../../views/Answer/AnswerList.vue'),
    meta: {
      title: '我的回答',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //answer
    path: '/answers/finished',
    name: 'answer-list-finished',
    component: require('../../../views/Answer/AnswerListFinished.vue'),
    meta: {
      title: '我的回答',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function () {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //answer-detail
    path: '/answer/:id',
    name: 'answer-detail',
    component: require('../../../views/Answer/AnswerDetail.vue'),
    meta: {
      title: '回答问题',
      wechatHideHeader: false
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //answerrefuse
    path: '/answerrefuse/:id',
    name: 'answer-refuse',
    component: require('../../../views/Answer/Refuse.vue'),
    meta: {
      title: '拒绝应答',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // answerTime
    path: '/answerTime/:id',
    name: 'answer-confirm',
    component: require('../../../views/Answer/SelectTime.vue'),
    meta: {
      title: '确认应答',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // answer
    path: '/realAnswer/:id',
    name: 'answer-question',
    component: require('../../../views/Answer/Answer.vue'),
    meta: {
      title: '回答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // answer
    path: '/realAnswer/:id/:answerId',
    name: 'answer-question',
    component: require('../../../views/Answer/Answer.vue'),
    meta: {
      title: '回答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-comment
    path: '/askComment/:id',
    name: 'ask-feedback',
    component: require('../../../views/Ask/Comment.vue'),
    meta: {
      title: '评价',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // message
    path: '/message',
    name: 'message',
    component: require('../../../views/message.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // header
    path: '/header',
    name: 'app-select-avatar',
    meta: {
      title: '选择头像'
    },
    component: require('../../../views/Account/selectHeader.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // header
    path: '/header-h5',
    name: 'h5-select-avatar',
    meta: {
      title: '选择头像'
    },
    component: require('../../../views/Account/selectHeaderH5.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover
    path: '/discover',
    name: 'discover',
    meta: {
      title: '发现',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/Readhub/Readhub.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover
    path: '/discover/share',
    name: 'share-discover',
    meta: {
      title: '发现',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/Readhub/Readhub.vue')
  },
  { // readhub
    path: '/readhub/detail',
    name: 'readhub-detail',
    meta: {
      title: '发现详情页',
      wechatHideHeader: true,
      keepAlive: false
    },
    component: require('../../../views/Readhub/DetailH5.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // setting
    path: '/setting',
    name: 'setting',
    meta: {
      title: '设置',
      wechatHideHeader: true
    },
    component: require('../../../views/Account/Setting.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // guide
    path: '/guide',
    name: 'guide',
    meta: {
      title: '引导页'
    },
    component: require('../../../views/Guide.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // feedback
    path: '/feedback',
    name: 'feedback',
    meta: {
      title: '反馈建议',
      wechatHideHeader: true
    },
    component: require('../../../views/Feedback.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // about
    path: '/about',
    name: 'about',
    meta: {
      title: '关于我们',
      wechatHideHeader: true
    },
    component: require('../../../views/About.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // project
    path: '/project',
    name: 'my-project',
    meta: {
      title: '发布项目'
    },
    component: require('../../../views/Project.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 提问帮助
    path: '/help/ask',
    name: 'help-ask',
    meta: {
      title: '提问帮助',
      wechatHideHeader: true
    },
    component: require('../../../views/Help/Ask.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
//	{ // bid
//		path: '/bid',
//  name: 'my-bid',
//  meta: {
//			title: '我的竞标',
//			wechatHideHeader: true
//		},
//		component: require('../../../views/Bid.vue'),
//		beforeEnter: (to, from, next) => {
//			requestAuth(to, from, next)
//		}
//	},
  // { // discover detail
  //   path: '/discover/detail',
  //   meta: {
  //     title: '发现'
  //   },
  //   component: require('../../../views/Discover/Detail.vue'),
  //   beforeEnter: (to, from, next) => {
  //     requestAuth(to, from, next)
  //   }
  // },
  { // discover project
    path: '/discover/project',
    name: 'discover-project',
    meta: {
      title: '项目协作',
      wechatHideHeader: true
    },
    component: require('../../../views/Discover/Project.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover company
    path: '/discover/company',
    name: 'discover-company',
    meta: {
      title: '附近企业',
      wechatHideHeader: true
    },
    component: require('../../../views/Discover/Company.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover activity
    path: '/discover/activity',
    name: 'discover-activity',
    meta: {
      title: '最新活动',
      wechatHideHeader: true
    },
    component: require('../../../views/Discover/Activity.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // project submit
    path: '/project/submit/:id',
    name: 'project-submit',
    meta: {
      title: '发布项目'
    },
    component: require('../../../views/ProjectForm.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover detail
    path: '/collect',
    name: 'my-collect',
    meta: {
      title: '我的关注',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/Account/Collect.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // company
    path: '/company/my',
    name: 'my-company',
    meta: {
      title: 'InweHub企业版',
      wechatHideHeader: true
    },
    component: require('../../../views/Company/My.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // company-help
    path: '/company/help',
    name: 'company-help',
    meta: {
      title: '企业认证引导页',
    },
    component: require('../../../views/Company/Help.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 认证企业用户
    path: '/company/submit',
    name: 'company-submit',
    meta: {
      title: '认证企业用户',
      wechatHideHeader: true
    },
    component: require('../../../views/Company/Submit.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 企业用户申请成功
    path: '/company/success',
    name: 'company-submit-success',
    meta: {
      title: '企业认证申请成功'
    },
    component: require('../../../views/Company/Success.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 活动-首次提问优惠活动
    path: '/activity/ask',
    name: 'activity-first-ask',
    meta: {
      title: '首次提问优惠',
    },
    component: require('../../../views/Activity/Ask.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目-项目概况
    path: '/project/basic',
    name: 'project-submit-step-one',
    meta: {
      title: '项目概括',
      wechatHideHeader: true
    },
    component: require('../../../views/Project/Basic.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目-具体需求
    path: '/project/concrete',
    name: 'project-submit-step-two',
    meta: {
      title: '具体需求',
      wechatHideHeader: true
    },
    component: require('../../../views/Project/Concrete.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目-偏好设置
    path: '/project/like',
    name: 'project-submit-step-four',
    meta: {
      title: '偏好设置',
      wechatHideHeader: true
    },
    component: require('../../../views/Project/Like.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目-企业信息
    path: '/project/company',
    name: 'project-submit-step-three',
    meta: {
      title: '企业信息',
      wechatHideHeader: true
    },
    component: require('../../../views/Project/Company.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },

  { // 项目-需求管理
    path: '/project/list',
    name: 'project-list',
    meta: {
      title: '需求管理',
      wechatHideHeader: true
    },
    component: require('../../../views/Project/List.vue'),
  },
  { // 项目-预览
    path: '/project/review',
    name: 'project-review',
    meta: {
      title: '项目预览',
    },
    component: require('../../../views/Project/Review.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // protocol/register
    path: '/protocol/register',
    name: 'protocol-register',
    meta: {
      title: '注册协议',
      wechatHideHeader: true
    },
    component: require('../../../views/Help/Protocol.vue')
  },
  { // help/question
    path: '/help/question',
    name: 'help-question',
    meta: {
      title: '常见问题',
      wechatHideHeader: true
    },
    component: require('../../../views/Help/Question.vue')
  },
  {
    path: '/wechat/register',
    name: 'wechat-register',
    component: require('../../../views/Wechat/Register.vue'),
    meta: {
      title: '绑定注册'
    },
    beforeEnter: (to, from, next) => {
      //CanNotGetInWhenLogged(to, from, next)
      next();
    }
  },
  {
    path: '/wechat/info',
    name: 'wechat-register-info',
    component: require('../../../views/Wechat/Info.vue'),
    meta: {
      title: '填写信息'
    },
    beforeEnter: (to, from, next) => {
      //CanNotGetInWhenLogged(to, from, next)
      next();
    }
  },
  {
    path: '/webview/notice',
    name: 'webview-notice',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/notice.vue'),
  },
  {
    path: '/webview/article',
    name: 'webview-article',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/article.vue'),
  },
  {
    path: '/webview/share',
    name: 'webview-share',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/Share.vue'),
  },
  {
    path: '/test/open',
    name: 'open-app',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/OpenApp.vue'),
  },
  {
    path: '/webview/registerForm',
    name: 'webview-registerForm',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/registerForm.vue'),
  },
  {
    path: '/register/nocode',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/NoCode.vue'),
  },
  {
    path: '/dialog/list',
    name: 'dialog-list',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/DialogList.vue'),
  },
  {
    path: '/exception',
    name: 'exception',
    meta: {
      title: 'exception'
    },
    component: require('../../../views/Exception/Error.vue'),
  },
  { // message
    path: '/*',
    name: '404',
    meta: {
      title: '404'
    },
    component: require('../../../views/404.vue'),
  }
];

export default routes;
