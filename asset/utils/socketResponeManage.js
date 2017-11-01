import {
  alertMajorReplySuccess,
  alertMajorAskSuccess,
  perfectCard,
  expertcertification,
  alertAskCommunityInteractiveAnswer,
  alertAskCommunityQuestioningSuccess,
  alertMajorCommentSuccess
} from '../utils/dialogList'

import { postRequest } from '../utils/request'
import { getAskCommunityMajorDetail, getAskCommunityInteractionDetail } from '../utils/shareTemplate'

function getDetailByAnswerId (answerId, context) {
  postRequest(`answer/info`, {
    id: answerId
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    var ask = response.data.data

    // 1为专业问答  2为互动问答
    var answer = {}
    var username = {}
    var shareOption = {}
    if (ask.question.question_type === 1) {
      answer = ask.answer ? ask.answer : {}
      username = answer.user_name ? answer.user_name : ''
      shareOption = getAskCommunityMajorDetail(ask.question.id, ask.question.description, username)

      context.shareoption.shareTitle = shareOption.title
      context.shareoption.shareContent = shareOption.content
      context.shareoption.shareUrl = shareOption.link
      context.shareoption.shareImg = shareOption.imageUrl
    } else {
      answer = ask.answer ? ask.answer : {}
      username = answer.user_name ? answer.user_name : ''
      shareOption = getAskCommunityInteractionDetail(answerId, ask.question.description, username)

      context.shareoption.shareTitle = shareOption.title
      context.shareoption.shareContent = shareOption.content
      context.shareoption.shareUrl = shareOption.link
      context.shareoption.shareImg = shareOption.imageUrl
    }
  })
}

function socketResponseManage (notification, context) {
  switch (notification.type) {
    case 'App\\Notifications\\AuthenticationUpdated':
      // 专家认证有新的通知;
      console.log(notification.body)
      break
    case 'App\\Notifications\\NewMessage':
      // 新的聊天信息；
      console.log(notification)
      context.$emit('chat', notification)
      break
  }

  switch (notification.notification_type) {
    case 1:
      // 通知公告有新的通知
      break
    case 2:
      // 资金有新的通知
      break
    case 3:
      // 任务有新的通知
      break
    case 4:
      // 阅读发现有新的通知
      break
    case 5:
      // 积分变动通知

      if (window.mui.os.plus) {
        var topWs = window.plus.webview.getTopWebview()
        var ws = window.plus.webview.currentWebview()

        if (topWs.id !== ws.id) return
      }

      switch (notification.integral_action) {
        case 'first_community_ask':
        case 'community_ask':
          // 互动提问成功的弹窗；
          // 成长值；
          var askCoins = notification.add_coins
          // 贡献alertAskCommunityInteractiveAnswer值；
          var askCredits = notification.add_credits
          // id
          var id = notification.source_id
          // 请求数据；
          postRequest(`question/info`, {
            id: id
          }).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }
            var ask = response.data.data.question
            alertAskCommunityQuestioningSuccess(context, askCoins, askCredits, ask)
          })
          break
        case 'first_community_answer':
        case 'community_answer':
          // 互动社区参与回答成功后的弹窗；
          // 成长值；
          var answerCoins = notification.add_coins
          // 贡献值；
          var answerCredits = notification.add_credits
          // id
          context.shareoption.id = notification.source_id
          getDetailByAnswerId(notification.source_id, context)
          alertAskCommunityInteractiveAnswer(context, answerCoins, answerCredits)
          break
        case 'expert_valid':
          // 专家认证成功之后的弹窗；
          // 成长值；
          var expertCredits = notification.add_credits
          // 贡献值；
          var expertCoins = notification.add_coins
          expertcertification(context, expertCredits, expertCoins)
          break
        case 'readhub_new_comment':
          // 发现评论成功的弹窗；
          // 成长值；
          // var readhubCommentCredits = notification.add_credits
          // readhubCommenSuccess(context, readhubCommentCredits);
          break
        case 'user_info_complete':
          // 简历完成在96%的弹窗；
          // 成长值；
          var infoCompleteCredits = notification.add_credits
          perfectCard(context, infoCompleteCredits)
          break
        case 'first_ask':
        case 'ask':
          // 专业问答提问成功的弹窗；
          // 成长值；
          var majorAskCoins = notification.add_coins
          // 贡献值；
          var majorAskCredits = notification.add_credits
          alertMajorAskSuccess(context, majorAskCredits, majorAskCoins)
          break
        case 'first_answer':
        case 'answer':
          // 问答社区回答成功的弹窗；
          // 成长值；
          var majorAnswerCoins = notification.add_coins
          // 贡献值；
          var majorAnswerCredits = notification.add_credits
          // id
          context.shareoption.id = notification.source_id
          getDetailByAnswerId(notification.source_id, context)
          alertMajorReplySuccess(context, majorAnswerCredits, majorAnswerCoins)
          break
        case 'rate_answer':
          // 问答社区评价成功的弹窗；
          // 成长值；
          var majorCommentCoins = notification.add_coins
          // 贡献值；
          var majorCommentCredits = notification.add_credits
          // id
          context.shareoption.id = notification.source_id
          getDetailByAnswerId(notification.source_id, context)
          alertMajorCommentSuccess(context, majorCommentCredits, majorCommentCoins)
          break
        default:
          window.mui.toast(notification.title + ' ' + notification.body)
          break
      }
      break
  }
}

export {
  socketResponseManage
}

