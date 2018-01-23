var whiteLogo = 'https://cdn.inwehub.com/system/whiteLogo@2x.png'

/**
 * 专业问答详情页-微信分享模版
 * url: /askCommunity/major/221
 */
function getAskCommunityMajorDetail (questionId, questionDescription, answerUsername) {
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=/askCommunity/major/' + questionId
  var link = process.env.H5_ROOT + '/#' + '/askCommunity/major/' + questionId

  return {
    title: '专业问答|' + questionDescription + '-' + answerUsername + '的回答',
    link: link,
    content: '专家' + answerUsername + '的回答，点击前往围观互动',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo,
    shareName: '专业问题分享'
  }
}

/**
 * 互动问答详情页-微信分享模版
 * url: /askCommunity/interaction/356
 */
function getAskCommunityInteractionDetail (answerId, questionDescription, answerUsername) {
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=/askCommunity/interaction/' + answerId
  var link = process.env.H5_ROOT + '/#' + '/askCommunity/interaction/' + answerId

  return {
    title: '问答|' + questionDescription + '-' + answerUsername + '的回答',
    link: link,
    content: answerUsername + '的回答，点击前往围观互动',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo,
    shareName: '互动问答回复分享'
  }
}

/**
 * 互动问答回答列表页-微信分享模版
 */
function getAskCommunityInteractionAnswers (questionId, description, answerNum, followNum) {
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + '/askCommunity/interaction/answers/' + questionId
  var link = process.env.H5_ROOT + '/#' + '/askCommunity/interaction/answers/' + questionId

  return {
    title: '问答|' + description,
    link: link,
    content: '已有' + answerNum + '个回答、' + followNum + '个关注，点击前往查看详情或参与回答互动',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo,
    shareName: '互动问答分享'
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
    content: '受邀特权与福利，点击领取 >',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo,
    shareName: '邀请注册分享'
  }
}

/**
 * 发现详情-模版
 */
function getDiscoverDetail (pathUrl, title, imgUrl) {
  var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + pathUrl + encodeURIComponent('?noback=1')

  if (!imgUrl) {
    imgUrl = whiteLogo
  }

  return {
    title: 'InweHub发现 | ' + title,
    link: link,
    content: '来自「 频道」，这里有特别的评论，点击去看看或者参与互动？',
    imageUrl: imgUrl,
    thumbUrl: imgUrl + '?x-oss-process=image/resize,h_100,w_100',
    shareName: '文章分享'
  }
}

/**
 * 发现详情-文本类型
 * @param pathUrl
 * @param title
 * @param imgUrl
 * @param username
 * @returns {{title: string, link: string, content: *, imageUrl: *, thumbUrl: string}}
 */
function getTextDiscoverDetail (pathUrl, title, imgUrl, username) {
  var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + pathUrl + encodeURIComponent('?noback=1')

  if (!imgUrl) {
    imgUrl = whiteLogo
  }

  return {
    title: '分享 ' + username + ' 的InweHub动态',
    link: link,
    content: title,
    imageUrl: imgUrl,
    thumbUrl: imgUrl + '?x-oss-process=image/resize,h_100,w_100',
    shareName: '动态分享'
  }
}

/**
 * 邀请回答详情页分享
 * @param questionId
 * @param description
 * @param answernum
 * @param followednum
 * @returns {{title: string, link: *, content: (*|String), imageUrl: *, thumbUrl: string, shareName: string}}
 */
function getInviteAnswerDetail (questionId, description, answernum, followednum) {
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + '/askCommunity/interaction/answers/' + questionId
  var link = process.env.H5_ROOT + '/#' + '/askCommunity/interaction/answers/' + questionId

  return {
    title: '邀您回答|' + description,
    link: link,
    content: '诚挚的邀请您前往参与回答和互动，已有' + answernum + '个回答、' + followednum + '个关注',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo,
    shareName: '邀请回答分享'
  }
}

export {
  getAskCommunityMajorDetail,
  getAskCommunityInteractionDetail,
  getInvitation,
  getDiscoverDetail,
  getTextDiscoverDetail,
  getAskCommunityInteractionAnswers,
  getInviteAnswerDetail
}
