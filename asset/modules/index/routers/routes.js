/* views */

import Login from '../../../views/Login.vue'

import Register from '../../../views/Register.vue'

import FindPassword from '../../../views/FindPassword.vue'

import Home from '../../../views/404.vue'

import { requestAuth, CanNotGetInWhenLogged } from '../../../utils/auth'

import localEvent from '../../../stores/localStorage'
import { checkUpdate } from '../../../utils/updateVersion'
const currentUser = localEvent.getLocalItem('UserInfo')
import { closeSplashscreen, openFullscreen } from '../../../utils/plus'

const routes = [
  {
    path: '/',
    component: Home,
    name: 'land-home',
    meta: {
      title: '主页'
    },
    beforeEnter: (to, from, next) => {
      if (window.mui.os.plus) {
        // 检查版本更新
        window.mui.plusReady(function () {
          checkUpdate()
        })
        var lauch = localEvent.getLocalItem('lauchFlag')
        if (!lauch.showGuide) {
          window.mui.plusReady(function () {
            openFullscreen()
            closeSplashscreen()
            next({
              path: '/guide'
            })
          })
        } else {
          closeSplashscreen()
          next({
            path: '/home'
          })
        }
      } else {
        closeSplashscreen()
        next({
          path: '/home'
        })
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
    component: require('../../../views/Feed.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // feed
    path: '/feed',
    name: 'feed',
    meta: {
      title: 'Inwehub',
      wechatHideHeader: true,
      keepAlive: false
    },
    component: require('../../../views/Feed.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 首页活动列表页
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
  { // 首页机遇列表页
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
  { // 首页报名页面
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
  { // 新人引导第一步
    path: '/userGuide/stepone',
    name: 'userGuide-stepone',
    meta: {
      title: '新人引导第一步',
      wechatHideHeader: true
    },
    component: require('../../../views/NewcomerGuidance/StepOne.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 新人引导第二步
    path: '/userGuide/steptwo',
    name: 'userGuide-stepone',
    meta: {
      title: '新人引导第二步',
      wechatHideHeader: true
    },
    component: require('../../../views/NewcomerGuidance/StepTwo.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 新人引导第三步
    path: '/userGuide/stepthree',
    name: 'userGuide-stepone',
    meta: {
      title: '新人引导第三步',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/NewcomerGuidance/StepThree.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 问答社区-专业问答
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
  { // 问答社区-专业回答-问答详情；
    path: '/askCommunity/major/:id',
    name: 'ask-major-detail',
    meta: {
      title: '问答社区-专业问答详情',
      wechatHideHeader: false
    },
    component: require('../../../views/AskCommunity/MajorDetail.vue')
  },
  { // 问答社区-互动回答
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
  { // 问答社区-互动回答-回答列表；
    path: '/askCommunity/interaction/answers/:id',
    name: 'ask-interaction',
    meta: {
      title: '问答社区-互动回答-回答列表',
      wechatHideHeader: false
    },
    component: require('../../../views/AskCommunity/InteractionAnswers.vue')
  },
  { // 问答社区-互动回答-问答详情；
    path: '/askCommunity/interaction/:id',
    name: 'ask-interaction-detail',
    meta: {
      title: '问答社区-互动问答详情',
      wechatHideHeader: false
    },
    component: require('../../../views/AskCommunity/InteractionDetail.vue')
  },
  { // 邀请用户
    path: '/RecommendInvitation/:id',
    name: 'recommendInvitation',
    meta: {
      title: '邀请用户',
      wechatHideHeader: true
    },
    component: require('../../../views/RecommendInvitationUsers.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 邀请回答
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
      window.mui.plusReady(function () {
        checkUpdate()
      })
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
      // CanNotGetInWhenLogged(to, from, next)
      next()
    }
  },
  { // 邀请好友；
    path: '/invitation/friends',
    name: 'invitation-friends',
    meta: {
      title: '邀请好友',
      keepAlive: true
    },
    component: require('../../../views/Invitation/Friends.vue'),
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 邀请分享图片页
    path: '/invitation/share',
    name: 'invitation-share',
    meta: {
      title: '邀请分享图片页',
      keepAlive: true
    },
    component: require('../../../components/invitation/image.vue')
  },
  { // 邀请好友分享页
    path: '/invitation/info',
    name: 'invitation-info',
    meta: {
      title: '邀请好友分享页',
      keepAlive: true
    },
    component: require('../../../views/Invitation/Info.vue')
  },
  { // 邀请好友注册页
    path: '/invitation/register',
    name: 'invitation-register',
    meta: {
      title: '邀请好友注册页',
      keepAlive: true
    },
    component: require('../../../views/Invitation/Register.vue')
  },
  { // 邀请首页
    path: '/invitation/index',
    name: 'invitation-index',
    meta: {
      title: '邀请注册',
      keepAlive: true
    },
    component: require('../../../views/Invitation/index.vue'),
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 邀请成功
    path: '/invitation/success',
    name: 'invitation-success',
    meta: {
      title: '邀请成功',
      keepAlive: true
    },
    component: require('../../../views/Invitation/Success.vue'),
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 邀请图片预览
    path: '/invitation/preview',
    name: 'invitation-preview',
    meta: {
      title: '图片预览',
      keepAlive: true
    },
    component: require('../../../views/Invitation/Preview.vue'),
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 邀请图片预览
    path: '/invitation/image',
    name: 'invitation-image',
    meta: {
      title: '图片',
      keepAlive: true
    },
    component: require('../../../views/Invitation/Image.vue')
  },
  { // 发现_企业服务列表；
    path: '/discover/company/services',
    name: 'discover_companyServices',
    component: require('../../../views/Discover/CompanyServices.vue'),
    meta: {
      title: '企业服务',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 发现；
    path: '/discover/hottopic',
    name: 'discover_hottopic',
    component: require('../../../views/Discover/HotTopic.vue'),
    meta: {
      title: '发现',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 最新；
    path: '/discover/newest',
    name: 'discover_newest',
    component: require('../../../views/Discover/Newest.vue'),
    meta: {
      title: '发现',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 发布文章；
    path: '/discover/publishArticles',
    name: 'discover_publishArticles',
    component: require('../../../views/Discover/PublishArticles.vue'),
    meta: {
      title: '发现',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 发布成功；
    path: '/discover/add/success',
    name: 'discover_publishSuccessfully',
    component: require('../../../views/Discover/AddSuccess.vue'),
    meta: {
      title: '发现',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 发现；
    path: '/discover',
    name: 'discover',
    component: require('../../../views/Discover/List.vue'),
    meta: {
      title: '发现',
      keepAlive: true,
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  {
    path: '/c/:category_id/:slug',
    name: 'discover_detail',
    component: require('../../../views/Discover/Detail.vue'),
    meta: {
      title: '分享',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      next()
    }
  },
  { // 邀请榜；
    path: '/invitationList',
    name: 'invitation-list',
    component: require('../../../views/Activity/InvitationList.vue'),
    meta: {
      title: '邀请榜',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 成长榜；
    path: '/creditsList',
    name: 'credit-list',
    component: require('../../../views/Activity/CreditsList.vue'),
    meta: {
      title: '成长榜',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 贡献榜；
    path: '/cionsList',
    name: 'cions-list',
    component: require('../../../views/Activity/CionsList.vue'),
    meta: {
      title: '贡献榜',
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
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
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 我的收藏——回答
    path: '/my/collectedAnswers',
    name: 'my-collected_answers',
    meta: {
      title: '我的收藏',
      wechatHideHeader: true
    },
    component: require('../../../views/Account/Collected.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的收藏——文章
    path: '/my/collectedArticle',
    name: 'my-collected_article',
    meta: {
      title: '我的收藏',
      wechatHideHeader: true
    },
    component: require('../../../views/Account/CollectedArticle.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的擅长
    path: '/my/advantage',
    name: 'my-advantage',
    meta: {
      title: '我的擅长',
      wechatHideHeader: true
    },
    component: require('../../../views/Account/Advantage.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 选择标签
    path: '/selecttags',
    name: 'selecttags',
    meta: {
      title: '选择标签',
      wechatHideHeader: true
    },
    component: require('../../../views/Tags/SelectionTags.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 标签问答
    path: '/tag/detail/:tag/questions',
    name: 'tag_detail_questions',
    meta: {
      title: '标签详情-问答',
      wechatHideHeader: true
    },
    component: require('../../../views/Tags/TagsQuestions.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 标签动态
    path: '/tag/detail/:tag/discover',
    name: 'tag_detail_discover',
    meta: {
      title: '标签详情-动态',
      wechatHideHeader: true
    },
    component: require('../../../views/Tags/TagsSubmissions.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 标签用户
    path: '/tag/detail/:tag/users',
    name: 'tag_detail_users',
    meta: {
      title: '标签详情-用户',
      wechatHideHeader: true
    },
    component: require('../../../views/Tags/TagsUsers.vue'),
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
  { // 成长说明；
    path: '/my/Growth',
    name: 'my-Growtht',
    component: require('../../../views/Account/Growth.vue'),
    meta: {
      title: '成长说明',
      keepAlive: true,
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
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
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // 关注我的
    path: '/my/focus/:id',
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
  { // 我的发布_回答；
    path: '/my/publishAnswers/:id?',
    name: 'my-publish_answers',
    component: require('../../../views/Account/publish/publishAnswers.vue'),
    meta: {
      title: '我的发布',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      to.params.id = to.params.id ? to.params.id : currentUser.uuid
      requestAuth(to, from, next)
    }
  },
  { // 我的发布_提问；
    path: '/my/publishQuestions/:id?',
    name: 'my-publish_questions',
    component: require('../../../views/Account/publish/publishQuestions.vue'),
    meta: {
      title: '我的发布',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      to.params.id = to.params.id ? to.params.id : currentUser.uuid
      requestAuth(to, from, next)
    }
  },
  { // 我的发布_文章；
    path: '/my/publishArticle/:id?',
    name: 'my-publish_article',
    component: require('../../../views/Account/publish/publishArticle.vue'),
    meta: {
      title: '我的发布',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      to.params.id = to.params.id ? to.params.id : currentUser.uuid
      requestAuth(to, from, next)
    }
  },
  { // 我的发布_评论；
    path: '/my/publishComment/:id?',
    name: 'my-publish_comment',
    component: require('../../../views/Account/publish/publishComment.vue'),
    meta: {
      title: '我的发布',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      to.params.id = to.params.id ? to.params.id : currentUser.uuid
      requestAuth(to, from, next)
    }
  },
  { // Ta的专栏；
    path: '/article/list',
    name: 'article_list',
    component: require('../../../views/Account/ArticleList.vue'),
    meta: {
      title: 'Ta的专栏',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // Ta的动态；
    path: '/dynamic/list',
    name: 'dynamic_list',
    component: require('../../../views/Account/DynamicList.vue'),
    meta: {
      title: 'Ta的动态',
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
    }

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
      next()
    }

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
      next()
    }

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
    children: [
      {
        path: '',
        name: 'my-info-basic',
        meta: {
          title: '基本资料',
          wechatHideHeader: true
        },
        component: require('../../../views/Account/infos/basic.vue')
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
      window.mui.plusReady(function () {
        checkUpdate()
      })
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
      window.mui.plusReady(function () {
        checkUpdate()
      })
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
  { // ask
    path: '/ask',
    name: 'ask',
    component: require('../../../views/Ask/Ask.vue'),
    meta: {
      title: '提问',
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // ask-interaction
    path: '/ask/interaction',
    name: 'ask/interaction',
    component: require('../../../views/Ask/AskInteraction.vue'),
    meta: {
      title: '提问',
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // ask-pay-success
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
  { // ask-success
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
  { // ask-success
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
  { // ask-type
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
  { // task
    path: '/task',
    name: 'task',
    component: require('../../../views/Task/TaskListSub.vue'),
    meta: {
      title: '动态',
      wechatHideHeader: true,
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // /inform 消息
    path: '/inform',
    name: 'inform-list',
    component: require('../../../views/Task/InformList.vue'),
    meta: {
      title: '通知',
      wechatHideHeader: true,
      keepAlive: true
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // taskbar 任务动态
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
  { // readbar 阅读发现
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
  { // informbar 通知公告
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
  { // integralbar 积分变动
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
  { // balancebar 余额变动
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
  { // chat 客服
    path: '/chat/:id',
    name: 'inform-chat',
    component: require('../../../views/Task/chat.vue'),
    meta: {
      title: '客服',
      wechatHideHeader: true,
      keepAlive: false
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // ask-detail
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
  { // asks
    path: '/asks',
    name: 'ask-list-unfinish',
    component: require('../../../views/Ask/AskList.vue'),
    meta: {
      title: '我的提问',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // asks
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
  { // answer
    path: '/answers',
    name: 'answer-list-unfinish',
    component: require('../../../views/Answer/AnswerList.vue'),
    meta: {
      title: '我的回答',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // answer
    path: '/answers/finished',
    name: 'answer-list-finished',
    component: require('../../../views/Answer/AnswerListFinished.vue'),
    meta: {
      title: '我的回答',
      wechatHideHeader: true
    },
    beforeEnter: (to, from, next) => {
      // 检查版本更新
      window.mui.plusReady(function () {
        checkUpdate()
      })
      requestAuth(to, from, next)
    }
  },
  { // answer-detail
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
  { // answerrefuse
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
    name: 'answer-question-answerid',
    component: require('../../../views/Answer/Answer.vue'),
    meta: {
      title: '回答'
    },
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // ask-comment
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
  // { // discover
  //   path: '/discover',
  //   name: 'discover',
  //   meta: {
  //     title: '发现',
  //     wechatHideHeader: true,
  //     keepAlive: true
  //   },
  //   component: require('../../../views/Readhub/Readhub.vue'),
  //   beforeEnter: (to, from, next) => {
  //     requestAuth(to, from, next)
  //   }
  // },
  { // 附近企业companyDetails.vue
    path: '/selectCompany',
    name: 'selectCompany',
    meta: {
      title: '企业',
      wechatHideHeader: true
    },
    component: require('../../../views/Account/selectCompany.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 附近的人
    path: '/nearbyPeople',
    name: 'nearby-people',
    meta: {
      title: '附近发现',
      wechatHideHeader: true
    },
    component: require('../../../views/Nearby/nearbyPeople.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 附近企业
    path: '/nearbyCompany',
    name: 'nearbyCompany',
    meta: {
      title: '附近发现',
      wechatHideHeader: true
    },
    component: require('../../../views/Nearby/nearbyCompany.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 附近发现的人地图详情页
    path: '/nearbyPeople/MapDetail',
    name: 'nearby-map-detail',
    meta: {
      title: '附近发现',
      wechatHideHeader: true
    },
    component: require('../../../views/Nearby/nearbyPeopleMapDetail.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 附近发现的公司地图详情页
    path: '/nearbyCompany/MapDetail',
    name: 'nearby-map-detail',
    meta: {
      title: '附近发现',
      wechatHideHeader: true
    },
    component: require('../../../views/Nearby/nearbyCompanyMapDetail.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 附近企业
    path: '/companyDetails/:id',
    name: 'companyDetails',
    meta: {
      title: '企业详情',
      wechatHideHeader: true
    },
    component: require('../../../views/Nearby/companyDetails.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 待答问题
    path: '/unansweredquestions',
    name: 'unansweredquestions',
    meta: {
      title: '待您回答',
      wechatHideHeader: true
    },
    component: require('../../../views/UnansweredQuestions.vue')
  },
  { // 精华推荐
    path: '/selectionrecommend',
    name: 'selection-recommend',
    meta: {
      title: '精华推荐',
      wechatHideHeader: true
    },
    component: require('../../../views/SelectionRecommend.vue')
  },
  {
    path: '/discover/add2',
    name: 'discover_add2',
    meta: {
      title: '发现',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/Discover/Add4.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/discover/add',
    name: 'discover_add',
    meta: {
      title: '发现',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/Discover/Add.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  {
    path: '/nearby',
    name: 'nearby',
    meta: {
      title: '发现',
      wechatHideHeader: true
    },
    component: require('../../../views/Address/Nearby.vue'),
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
      keepAlive: false
    },
    component: require('../../../views/Readhub/Readhub.vue')
  },
  {
    path: '/discover/comment/:slug',
    name: 'discover-comment',
    meta: {
      title: '发现',
      wechatHideHeader: true,
      keepAlive: false
    },
    component: require('../../../views/Discover/Comment.vue')
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
    component: require('../../../views/Guide.vue')
  },
  { // feedback
    path: '/feedback/:type',
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
  { // 推送设置
    path: '/push/setting',
    name: '/push-setting',
    meta: {
      title: '推送设置',
      wechatHideHeader: true
    },
    component: require('../../../views/Setting/pushSetting.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 我的关注
    path: '/push/setting/follow',
    name: 'push-setting-follow',
    meta: {
      title: '我的关注',
      wechatHideHeader: true
    },
    component: require('../../../views/Setting/pushSettingFollow.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // 与我有关
    path: '/push/setting/aboutme',
    name: 'push-setting-aboutme',
    meta: {
      title: '与我有关',
      wechatHideHeader: true
    },
    component: require('../../../views/Setting/pushSettingAboutMe.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // seekingCooperation
    path: '/seekingCooperation',
    name: 'seekingCooperation',
    meta: {
      title: '寻求合作',
      wechatHideHeader: true
    },
    component: require('../../../views/SeekingCooperation.vue'),
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
      wechatHideHeader: true,
      keepAlive: false
    },
    component: require('../../../views/Help/Ask.vue'),
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
    path: '/selectUser',
    name: 'selectUser',
    meta: {
      title: '选择用户',
      wechatHideHeader: true,
      keepAlive: false
    },
    component: require('../../../views/SelectUser/SelectUsers.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover detail
    path: '/collectUser',
    name: 'my-collect-user',
    meta: {
      title: '我的关注',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/Account/collectUser.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover detail
    path: '/collectTags',
    name: 'my-collectTags',
    meta: {
      title: '我的关注',
      wechatHideHeader: true,
      keepAlive: true
    },
    component: require('../../../views/Account/collectTags.vue'),
    beforeEnter: (to, from, next) => {
      requestAuth(to, from, next)
    }
  },
  { // discover detail
    path: '/collectQuestion',
    name: 'my-collect-question',
    meta: {
      title: '我的关注',
      wechatHideHeader: true,
      keepAlive: false
    },
    component: require('../../../views/Account/collectQuestion.vue'),
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
      title: '企业认证引导页'
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
      title: '首次提问优惠'
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
    component: require('../../../views/Project/List.vue')
  },
  { // 项目-预览
    path: '/project/review',
    name: 'project-review',
    meta: {
      title: '项目预览'
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
  { // protocol/register
    path: '/protocol/invitation',
    name: 'protocol-invitation',
    meta: {
      title: '邀请活动规则',
      wechatHideHeader: true
    },
    component: require('../../../views/Help/Invitation.vue')
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
      // CanNotGetInWhenLogged(to, from, next)
      next()
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
      // CanNotGetInWhenLogged(to, from, next)
      next()
    }
  },
  {
    path: '/webview/notice',
    name: 'webview-notice',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/notice.vue')
  },
  {
    path: '/webview/vendor/:url',
    name: 'webview-vendor',
    meta: {
      title: 'vendor'
    },
    component: require('../../../views/Webview/Vendor.vue')
  },
  {
    path: '/webview/article',
    name: 'webview-article',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/article.vue')
  },
  {
    path: '/webview/share',
    name: 'webview-share',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/Share.vue')
  },
  {
    path: '/webview/registerForm',
    name: 'webview-registerForm',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/Webview/registerForm.vue')
  },
  // app内的弹窗样式
  {
    path: '/dialog/list',
    name: 'dialog-list',
    meta: {
      title: 'InweHub'
    },
    component: require('../../../views/DialogList.vue')
  },
  {
    path: '/exception',
    name: 'exception',
    meta: {
      title: 'exception'
    },
    component: require('../../../views/Exception/Error.vue')
  },
  {
    path: '/hongbao',
    name: 'hongbao',
    meta: {
      title: 'hongbao'
    },
    component: require('../../../views/Hongbao.vue')
  },
  {
    path: '/ad',
    name: 'ad',
    meta: {
      title: 'ad'
    },
    component: require('../../../views/Ad.vue')
  },
  {
    path: '/mask',
    name: 'mask',
    meta: {
      title: 'mask'
    },
    component: require('../../../components/ShortTcut.vue')
  },
  { // message
    path: '/*',
    name: '404',
    meta: {
      title: '404'
    },
    component: require('../../../views/404.vue')
  }
]

export default routes
