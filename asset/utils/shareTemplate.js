var whiteLogo = 'https://cdn.inwehub.com/system/whiteLogo@2x.png'

/**
 * 专业问答详情页-微信分享模版
 * url: /askCommunity/major/221
 */
function getAskCommunityMajorDetail (questionId, questionDescription, answerUsername) {
  var link = process.env.API_ROOT + 'wechat/oauth?redirect=/askCommunity/major/' + questionId

  return {
    title: '专业问答|' + questionDescription + '-' + answerUsername + '的回答',
    link: link,
    content: '专家' + answerUsername + '的回答，点击前往围观互动',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo
  }
}

/**
 * 互动问答详情页-微信分享模版
 * url: /askCommunity/interaction/356
 */
function getAskCommunityInteractionDetail (answerId, questionDescription, answerUsername) {
  var link = process.env.API_ROOT + 'wechat/oauth?redirect=/askCommunity/interaction/' + answerId

  return {
    title: '问答|' + questionDescription + '-' + answerUsername + '的回答',
    link: link,
    content: answerUsername + '的回答，点击前往围观互动',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo
  }
}

/**
 * 邀请注册-模版
 */
function getInvitation (username, rcCode) {
  var link = process.env.API_ROOT + 'wechat/oauth?redirect=/invitation/register?rc_code=' + rcCode

  return {
    title: username + '邀请您加入InweHub',
    link: link,
    content: '受邀请特权与福利，点击领取',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo
  }
}

export {
  getAskCommunityMajorDetail,
  getAskCommunityInteractionDetail,
  getInvitation
}
