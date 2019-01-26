import localEvent from '../stores/localStorage'
import router from '../modules/index/routers/index'
import { goThirdPartyArticle } from './webview'
import userAbility from './userAbility'

/**
 * 设置ios角标数
 * @param number
 */
function setAppBadgeNumber (number) {
  if (window.mui.os.plus) {
    window.mui.plusReady(function () {
      localEvent.setLocalItem('notice', {badgeNumber: number})
      window.plus.runtime.setBadgeNumber(number)
    })
  }
}

/**
 * 设置ios角标数+1
 */
function setIncBadgeNumber () {
  var notice = localEvent.getLocalItem('notice', {badgeNumber: number})
  var number = 1
  if (notice.badgeNumber) {
    number = notice.badgeNumber + 1
  }
  setAppBadgeNumber(number)
  return number
}

function noticeHandler (context, payload) {
  if (!payload) return
  if (window.mixpanel) {
    window.mixpanel.track(
      'inwehub:push:click',
      {'app': 'inwehub', 'user_device': window.getUserAppDevice(), 'page': payload.object_id, 'page_name': payload.object_type, 'page_title': '打开推送'}
    )
  }
  switch (payload.object_type) {
    case 'question':
    case 'pay_question_answered':
    case 'question_answer_confirmed':
      // mui.alert('/ask/' + payload.object_id + '?time=' + Date.parse(new Date()));
      // router.go(-1);
      router.pushPlus('/ask/detail/' + payload.object_id + '?time=' + Date.parse(new Date()), 'list-page')
      break
    case 'pay_question_answered_askCommunity':
      router.pushPlus('/askCommunity/major/' + payload.object_id, 'list-page')
      break
    case 'free_question_answered':
      router.pushPlus('/ask/offer/' + payload.object_id, 'list-page')
      break
    case 'pay_answer_awake':
    case 'pay_answer':
    case 'answer':
      // router.go(-1);
      // mui.alert('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()))
      router.pushPlus('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()), 'list-page')
      break
    case 'free_answer_awake':
    case 'free_answer':
      router.pushPlus('/ask/offer/answers/' + payload.object_id, 'list-page')
      break
    case 'authentication_success':
      // 专家认证成功
      router.pushPlus('/my?needalert=1', 'list-page')
      break
    case 'authentication_fail':
      // 专家认证失败
      router.pushPlus('/my/pilot', 'list-page')
      break
    case 'company_auth_success':
      // 企业认证成功
      router.pushPlus('/company/my', 'list-page')
      break
    case 'company_auth_fail':
      // 企业认证失败
      router.pushPlus('/company/my', 'list-page')
      break
    case 'notification_money':
      // 资金变动通知
      router.pushPlus('/my/Finance', 'list-page')
      break
    case 'user_following':
      // 用户关注通知
      router.pushPlus('/share/resume/' + payload.object_id + '?goback=1', 'list-page')
      break
    case 'readhub_submission_upvoted':
    case 'readhub_new_submission':
    case 'readhub_comment_replied':
      // 阅读发现评论回复,payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
      router.pushPlus(payload.object_id, 'list-page')
      break
    case 'readhub_submission_replied':
      // 阅读发现文章回复，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
      router.pushPlus(payload.object_id, 'list-page')
      break
    case 'readhub_username_mentioned':
      // 阅读发现@某人，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
      router.pushPlus(payload.object_id, 'list-page')
      break
    case 'push_notice_readhub':
      // 推送阅读发现的文章
      if (payload.object) {
        goThirdPartyArticle(
          payload.object.view_url,
          payload.object.id,
          payload.object.title,
          payload.object.comment_url,
          payload.object.img_url
        )
      }
      break
    case 'push_notice_app_self':
      // 推送app内页
      router.push(payload.object_id)
      break
    case 'push_notice_article':
      // 推送公告文章
      window.mui.openWindow({
        url: '/public/index.html#/webview/notice',
        id: payload.object_id,
        preload: false, // 一定要为false
        createNew: false,
        show: {
          autoShow: true,
          aniShow: 'pop-in'
        },
        styles: {
          popGesture: 'close'
        },
        waiting: {
          autoShow: false
        }
      })
      break
    case 'notification_level_up':
      // 用户积分等级提升;
      userAbility.upgradeLevel(context)
      break
    case 'activity_enroll_fail':
    case 'activity_enroll_success':
      // 活动报名事件
      router.pushPlus('/EnrollmentStatus/' + payload.object_id, 'list-page')
      break
    case 'pay_answer_new_comment':
      // 专业回答新的回复
      router.pushPlus('/askCommunity/major/' + payload.object_id, 'list-page')
      break
    case 'free_answer_new_comment':
      // 互动问答新的回复
      router.pushPlus('/ask/offer/' + payload.object_id, 'list-page')
      break
    case 'pay_answer_new_support':
      // 专业回答赞
      router.pushPlus('/askCommunity/major/' + payload.object_id, 'list-page')
      break
    case 'free_answer_new_support':
      // 专业回答赞
      router.pushPlus('/ask/offer/' + payload.object_id, 'list-page')
      break
    case 'im_message':
      // 聊天信息
      router.pushPlus('/chat/' + payload.object_id, 'list-page')
      break
    case 'im_group_message':
      // 群聊信息
      router.pushPlus('/group/chat/' + payload.object_id, 'list-page')
      break
    case 'invite_user_register':
      // 邀请用户注册成功
      router.pushPlus('/invitation/friends', 'list-page')
      break
    case 'group_member_apply':
      // 申请加入圈子通知
      router.pushPlus('/group/setting/' + payload.object_id, 'list-page')
      break
    case 'group_member_join':
      // 成功加入圈子
      router.pushPlus('/group/detail/' + payload.object_id, 'list-page')
      break
    case 'group_audit_result':
      // 圈子审核结果
      router.pushPlus('/group/detail/' + payload.object_id, 'list-page')
      break
    case 'recommend_daily_subscribe':
      // 每日热点推荐
      router.pushPlus('/hotrecommend/' + payload.object_id, 'list-page')
      break
  }
}

export {
  setAppBadgeNumber,
  setIncBadgeNumber,
  noticeHandler
}
