import {
  alertMajorReplySuccess,
  alertMajorAskSuccess,
  perfectCard,
  readhubCommenSuccess,
  expertcertification,
  alertAskCommunityInteractiveAnswer,
  alertAskCommunityQuestioningSuccess,
  alertMajorCommentSuccess
} from '../utils/dialogList';

import {postRequest} from '../utils/request';
import {getAskCommunityMajorDetail} from '../utils/shareTemplate';

function getDetailByAnswerId(answerId, context) {

  postRequest(`answer/info`, {
    id: answerId
  }).then(response => {

    var code = response.data.code;
    if (code !== 1000) {
      mui.toast(response.data.message);
      return;
    }

    var ask = response.data.data;

    //1为专业问答  2为互动问答
    if (ask.question.question_type == 1) {

      var answer = ask.answer ? ask.answer : {};
      var username = answer.user_name ? answer.user_name : '';

      var shareOption = getAskCommunityMajorDetail(ask.question.id, ask.question.description, username);

      context.shareoption.shareTitle = shareOption.title;
      context.shareoption.shareContent = shareOption.content;
      context.shareoption.shareUrl = shareOption.link;
      context.shareoption.shareImg = shareOption.imageUrl;

    } else {
      context.shareoption.shareTitle = '问答|' + ask.question.description;
      var currentUrl = '/askCommunity/interaction/' + ask.question.id;
      context.shareoption.shareUrl = process.env.API_ROOT + 'wechat/oauth?redirect=' + currentUrl;
      var answerNum = ask.question.answer_num;
      var followNum = ask.question.follow_num;
      context.shareoption.shareContent = '已有' + answerNum + '个回答、' + followNum + '个关注，点击前往查看详情或参与回答互动';
    }

  });
}

function socketResponseManage(notification, context) {

  switch (notification.type) {
    case 'App\\Notifications\\AuthenticationUpdated':
      // 专家认证有新的通知;
      console.log(notification.body);

      break;
  }

  switch (notification.notification_type) {
    case 1:
      // 通知公告有新的通知
      break;
    case 2:
      // 资金有新的通知
      break;
    case 3:
      // 任务有新的通知
      break;
    case 4:
      // 阅读发现有新的通知
      break;
    case 5:
      // 积分变动通知

      if (mui.os.plus) {
        var top_ws = plus.webview.getTopWebview();
        var ws = plus.webview.currentWebview();

        if (top_ws.id !== ws.id) return;
      }

      switch (notification.integral_action) {
        case 'first_community_ask':
        case 'community_ask':
          //互动提问成功的弹窗；
          //成长值；
          var ask_coins = notification.add_coins;
          //贡献alertAskCommunityInteractiveAnswer值；
          var ask_credits = notification.add_credits;
          //id
          var id = notification.source_id;
          //请求数据；
          postRequest(`question/info`, {
            id: id
          }).then(response => {
            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              mui.back();
              return;
            }
            var ask = response.data.data.question;
            alertAskCommunityQuestioningSuccess(context, ask_coins, ask_credits, ask);

          });
          break;
        case 'first_community_answer':
        case 'community_answer':
          //互动社区参与回答成功后的弹窗；
          //成长值；
          var answer_coins = notification.add_coins;
          //贡献值；
          var answer_credits = notification.add_credits;
          //id
          context.shareoption.id = notification.source_id;
          getDetailByAnswerId(notification.source_id, context);
          alertAskCommunityInteractiveAnswer(context, answer_coins, answer_credits);
          break;
        case 'expert_valid':
          //专家认证成功之后的弹窗；
          //成长值；
          var expert_credits = notification.add_credits;
          //贡献值；
          var expert_coins = notification.add_coins;
          expertcertification(context, expert_credits, expert_coins);
          break;
        case 'readhub_new_comment':
          //发现评论成功的弹窗；
          //成长值；
          var readhub_comment_credits = notification.add_credits;
          //	                       readhubCommenSuccess(context,readhub_comment_credits);
          break;
        case 'user_info_complete':
          //简历完成在96%的弹窗；
          //成长值；
          var info_complete_credits = notification.add_credits;
          perfectCard(context, info_complete_credits);
          break;
        case 'first_ask':
        case 'ask':
        //专业问答提问成功的弹窗；
          //成长值；
          var major_ask_coins = notification.add_coins;
          //贡献值；
          var major_ask_credits = notification.add_credits;
          alertMajorAskSuccess(context, major_ask_credits, major_ask_coins);
          break;
        case 'first_answer':
        case 'answer':
        //问答社区回答成功的弹窗；
          //成长值；
          var major_answer_coins = notification.add_coins;
          //贡献值；
          var major_answer_credits = notification.add_credits;
          //id
          context.shareoption.id = notification.source_id;
          getDetailByAnswerId(notification.source_id, context);
          alertMajorReplySuccess(context, major_answer_credits, major_answer_coins);
          break;
        case 'rate_answer':
        //问答社区评价成功的弹窗；
          //成长值；
          var major_comment_coins = notification.add_coins;
          //贡献值；
          var major_comment_credits = notification.add_credits;
          //id
          context.shareoption.id = notification.source_id;
          getDetailByAnswerId(notification.source_id, context);
          alertMajorCommentSuccess(context, major_comment_credits, major_comment_coins);
          break;
        default:
          mui.toast(notification.title + " " + notification.body);
          break;
      }
      break;
  }
}

export {
  socketResponseManage
};

