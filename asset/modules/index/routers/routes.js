/* views */

import Login from '../../../views/Login.vue';

import Register from '../../../views/Register.vue';

import FindPassword from '../../../views/FindPassword.vue';

import Home from '../../../views/Home.vue';

import {requestAuth, CanNotGetInWhenLogged} from '../../../utils/auth';

import localEvent from '../../../stores/localStorage';
import {checkUpdate} from '../../../utils/updateVersion';

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      title: '主页'
    },
    beforeEnter: (to, from, next) => {
      if (mui.os.plus) {
        // 检查版本更新
        mui.plusReady(function() {
          checkUpdate();
        });
        var lauch = localEvent.getLocalItem('lauchFlag');
        if (!lauch.showGuide && 1 === 2) {
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
    meta: {
      title: 'Inwehub',
      keepAlive: true
    },
    component: require('../../../views/Home.vue'),
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
    component: require('../../../views/Account/my.vue'),
    meta: {
      title: '我的',
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function() {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
   { // 我的关注
    path: '/my/focus',
    component: require('../../../views/Account/focus.vue'),
    meta: {
      title: '我的关注',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 个人信息
    path: '/my/info',
    component: require('../../../views/Account/info.vue'),
    meta: {
      title: '我的名片',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 个人名片
    path: '/my/resume',
    component: require('../../../views/Account/Resume.vue'),
    meta: {
      title: '个人名片',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    },

  },
  { // 共享个人名片
    path: '/share/resume',
    component: require('../../../views/Account/Resume.vue'),
    meta: {
      title: '个人名片',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      next();
    },

  },

  { // 个人信息
    path: '/my/info/job/:id',
    component: require('../../../views/Account/infos/job.vue'),
    meta: {
      title: '工作经历'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目经历
    path: '/my/info/project/:id',
    component: require('../../../views/Account/infos/project.vue'),
    meta: {
      title: '项目经历'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 教育经历
    path: '/my/info/edu/:id',
    component: require('../../../views/Account/infos/edu.vue'),
    meta: {
      title: '教育经历'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 教育经历
    path: '/my/info/edus',
    component: require('../../../views/Account/infos/edus.vue'),
    meta: {
      title: '教育经历'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 工作经历
    path: '/my/info/jobs',
    component: require('../../../views/Account/infos/jobs.vue'),
    meta: {
      title: '工作经历'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目经历
    path: '/my/info/projects',
    component: require('../../../views/Account/infos/projects.vue'),
    meta: {
      title: '项目经历'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 培训经历
    path: '/my/info/trains',
    component: require('../../../views/Account/infos/trains.vue'),
    meta: {
      title: '培训经历'
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
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    },
    children: [{
      path: '',
      meta:{
        title: '我的档案',
        wechatHideHeader:true
      },
      component: require('../../../views/Account/infos/basic.vue'),
    },
      { // 个人签名
        path: '/my/info/basic/description',
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
    component: require('../../../views/Account/infos/privacy.vue'),
    meta: {
      title: '隐私设置',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 培训经历
    path: '/my/info/train/:id',
    component: require('../../../views/Account/infos/train.vue'),
    meta: {
      title: '培训经历'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的钱包
    path: '/my/Finance',
    component: require('../../../views/Finance/info.vue'),
    meta: {
      title: '我的钱包'
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function() {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { // 资金明细
    path: '/my/Finance/list',
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
    component: require('../../../views/Finance/withdraw.vue'),
    meta: {
      title: '提现'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 安全设置
    path: '/my/Finance/setting',
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
    component: require('../../../views/Expert/apply.vue'),
    meta: {
      title: '专家申请'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 推荐专家
    path: '/expert/recommend',
    component: require('../../../views/Expert/recommend.vue'),
    meta: {
      title: '推荐专家',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask
    path: '/ask',
    component: require('../../../views/Ask/Ask.vue'),
    meta: {
      title: '提问'
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function() {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //ask-pay-success
    path: '/pay/ask/:id',
    component: require('../../../views/Pay/AskSuccess.vue'),
    meta: {
      title: '支付成功',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-success
    path: '/paySuccess',
    component: require('../../../views/Pay/PaySuccess.vue'),
    meta: {
      title: '支付成功',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //ask-success
    path: '/askSuccess/:id',
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
    component: require('../../../views/Ask/AskType.vue'),
    meta: {
      title: '选择问题分类',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //task
    path: '/task',
    component: require('../../../views/Task/TaskListSub.vue'),
    meta: {
      title: '任务',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function() {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //ask-detail
    path: '/ask/:id',
    component: require('../../../views/Ask/AskDetail.vue'),
    meta: {
      title: '提问',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //asks
    path: '/asks',
    component: require('../../../views/Ask/AskList.vue'),
    meta: {
      title: '我的提问',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function() {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //asks
    path: '/asks/finish',
    component: require('../../../views/Ask/AskListFinish.vue'),
    meta: {
      title: '我的提问',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //answer
    path: '/answers',
    component: require('../../../views/Answer/AnswerList.vue'),
    meta: {
      title: '我的回答',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      mui.plusReady(function() {
        checkUpdate();
      });
      requestAuth(to, from, next)
    }
  },
  { //answer-detail
    path: '/answer/:id',
    component: require('../../../views/Answer/AnswerDetail.vue'),
    meta: {
      title: '回答问题',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { //answerrefuse
    path: '/answerrefuse/:id',
    component: require('../../../views/Answer/Refuse.vue'),
    meta: {
      title: '拒绝应答',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // answerTime
    path: '/answerTime/:id',
    component: require('../../../views/Answer/SelectTime.vue'),
    meta: {
      title: '确认应答',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // answer
    path: '/realAnswer/:id',
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
    component: require('../../../views/Ask/Comment.vue'),
    meta: {
      title: '评价',
      wechatHideHeader:true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // message
    path: '/message',
    component: require('../../../views/message.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // header
    path: '/header',
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
    meta: {
      title: '发现',
      wechatHideHeader:true,
      keepAlive: true
    },
    component: require('../../../views/Discover/Discover.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // setting
    path: '/setting',
    meta: {
      title: '设置',
      wechatHideHeader:true
    },
    component: require('../../../views/Account/Setting.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // guide
    path: '/guide',
    component: require('../../../views/Guide.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // feedback
    path: '/feedback',
    meta: {
      title: '反馈建议',
      wechatHideHeader:true
    },
    component: require('../../../views/Feedback.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // about
    path: '/about',
    meta: {
      title: '关于我们',
      wechatHideHeader:true
    },
    component: require('../../../views/About.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // project
    path: '/project',
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
    meta: {
      title: '提问帮助',
      wechatHideHeader:true
    },
    component: require('../../../views/Help/Ask.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // bid
    path: '/bid',
    meta: {
      title: '我的竞标',
      wechatHideHeader:true
    },
    component: require('../../../views/Bid.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
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
    meta: {
      title: '项目协作',
      wechatHideHeader:true
    },
    component: require('../../../views/Discover/Project.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover company
    path: '/discover/company',
    meta: {
      title: '附近企业',
      wechatHideHeader:true
    },
    component: require('../../../views/Discover/Company.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover activity
    path: '/discover/activity',
    meta: {
      title: '最新活动',
      wechatHideHeader:true
    },
    component: require('../../../views/Discover/Activity.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // project submit
    path: '/project/submit/:id',
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
    meta: {
      title: '我的收藏',
      wechatHideHeader:true,
      keepAlive: true
    },
    component: require('../../../views/Account/Collect.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // company
    path: '/company/my',
    meta: {
      title: 'InweHub企业版',
      wechatHideHeader:true
    },
    component: require('../../../views/Company/My.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // company-help
    path: '/company/help',
    meta: {
      title: '',
    },
    component: require('../../../views/Company/Help.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 认证企业用户
    path: '/company/submit',
    meta: {
      title: '认证企业用户',
      wechatHideHeader:true
    },
    component: require('../../../views/Company/Submit.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 企业用户申请成功
    path: '/company/success',
    meta: {
      title: ''
    },
    component: require('../../../views/Company/Success.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 活动-首次提问优惠活动
    path: '/activity/ask',
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
    meta: {
      title: '项目概括',
      wechatHideHeader:true
    },
    component: require('../../../views/Project/Basic.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目-具体需求
    path: '/project/concrete',
    meta: {
      title: '具体需求',
      wechatHideHeader:true
    },
    component: require('../../../views/Project/Concrete.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目-偏好设置
    path: '/project/like',
    meta: {
      title: '偏好设置',
      wechatHideHeader:true
    },
    component: require('../../../views/Project/Like.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 项目-企业信息
    path: '/project/company',
    meta: {
      title: '企业信息',
      wechatHideHeader:true
    },
    component: require('../../../views/Project/Company.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },

  { // 项目-需求管理
    path: '/project/list',
    meta: {
      title: '需求管理',
      wechatHideHeader:true
    },
    component: require('../../../views/Project/List.vue'),
  },
  { // 项目-预览
    path: '/project/review',
    meta: {
      title: '',
    },
    component: require('../../../views/Project/Review.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // protocol/register
    path: '/protocol/register',
    meta: {
      title: '注册协议',
      wechatHideHeader:true
    },
    component: require('../../../views/Help/Protocol.vue')
  },
  { // help/question
    path: '/help/question',
    meta: {
      title: '常见问题',
      wechatHideHeader:true
    },
    component: require('../../../views/Help/Question.vue')
  },
  {
    path: '/wechat/register',
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
    path: '/webview/article',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/article.vue'),
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
