var whiteLogo = 'https://cdn.inwehub.com/system/whiteLogo@2x.png'
import { getLocalUuid } from './user'

/**
 * 专业问答详情页-微信分享模版
 * url: /askCommunity/major/221
 */
function getAskCommunityMajorDetail (questionId, questionDescription, answerUsername) {
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=/askCommunity/major/' + questionId
  var link = process.env.H5_ROOT + '/#' + '/askCommunity/major/' + questionId + '?uuid=' + getLocalUuid()

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
  var link = process.env.H5_ROOT + '/#' + '/ask/offer/' + answerId + '?uuid=' + getLocalUuid()

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
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + '/ask/offer/answers/' + questionId
  var link = process.env.H5_ROOT + '/#' + '/ask/offer/answers/' + questionId + '?uuid=' + getLocalUuid()

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
  var link = process.env.H5_ROOT + '/#' + '/invitation/register?rc_code=' + rcCode + '&uuid=' + getLocalUuid()
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=/invitation/register?rc_code=' + rcCode

  return {
    title: username + '邀请您加入InweHub' + '-企业级应用&服务广场',
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
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + pathUrl + encodeURIComponent('?noback=1')
  var link = process.env.H5_ROOT + '/#' + pathUrl + '?noback=1' + '&uuid=' + getLocalUuid()

  if (!imgUrl) {
    imgUrl = whiteLogo
  }

  return {
    title: '' + title,
    link: link,
    content: '来自Inwehub圈子，点击查看更多热度分享。',
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
 * @param groupName
 * @returns {{title: string, link: string, content: *, imageUrl: *, thumbUrl: string}}
 */
function getTextDiscoverDetail (pathUrl, title, imgUrl, username, groupName) {
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + pathUrl + encodeURIComponent('?noback=1')
  var link = process.env.H5_ROOT + '/#' + pathUrl + '?noback=1&uuid=' + getLocalUuid()

  if (!imgUrl) {
    imgUrl = whiteLogo
  }

  var content = ''
  if (groupName) {
    content = '来自InweHub「' + groupName + '」' + username + '的发布'
  } else {
    content = '来自InweHub的发布'
  }

  return {
    title: title, // '分享 ' + username + ' 的InweHub动态',
    link: link,
    content: content,
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
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + '/ask/offer/answers/' + questionId
  var link = process.env.H5_ROOT + '/#' + '/ask/offer/answers/' + questionId + '?uuid=' + getLocalUuid()

  return {
    title: '邀您回答|' + description,
    link: link,
    content: '诚挚的邀请您前往参与回答和互动，已有' + answernum + '个回答、' + followednum + '个关注',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo,
    shareName: '邀请回答分享'
  }
}

function getResumeDetail (uuid, realname, companyName, avatarUrl) {
  var link = process.env.H5_ROOT + '/#/share/resume/' + uuid + '?time=' + (new Date().getTime()) + '&uuid=' + getLocalUuid()

  return {
    title: 'InweHub名片 | ' + realname + '@' + companyName,
    link: link,
    content: 'Powered by InweHub',
    imageUrl: avatarUrl,
    thumbUrl: avatarUrl + '?x-oss-process=image/resize,h_100,w_100',
    shareName: '名片分享'
  }
}

/**
 * 圈子详情页-微信分享模版
 * url: /group/detail/221
 */
function getGroupDetail (id, title, username, userCount, logo) {
  var link = process.env.H5_ROOT + '/#' + '/group/detail/' + id + '?uuid=' + getLocalUuid()

  return {
    title: '邀您加入InweHub圈子：' + title,
    link: link,
    content: username + '创建，已有' + userCount + '人气 | 点击查看加入',
    pyqTitle: '向您推荐一个不错的圈子「' + title + '」',
    pyqContent: username + '创建，已有' + userCount + '人气 | 点击查看加入',
    imageUrl: logo,
    thumbUrl: logo + '?x-oss-process=image/resize,h_100,w_100',
    shareName: '圈子分享'
  }
}

/**
 * 精选推荐页-微信分享模版
 * url: /recommends
 */
function getRecommends (count) {
  var link = process.env.H5_ROOT + '/#' + '/recommends' + '?uuid=' + getLocalUuid()

  return {
    title: 'InweHub精选推荐-企业级应用&服务广场',
    link: link,
    content: '点击查看',
    imageUrl: whiteLogo,
    thumbUrl: whiteLogo,
    shareName: '精选推荐'
  }
}

/**
 * 点评详情
 * @param pathUrl
 * @param title
 * @param imgUrl
 * @param username
 * @returns {{title: string, link: string, content: *, imageUrl: *, thumbUrl: string}}
 */
function getDianpingCommentDetail (slug, title, imgUrl, username, rateStar) {
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + pathUrl + encodeURIComponent('?noback=1')
  var link = process.env.H5_ROOT + '/#' + '/dianping/comment/' + slug + '?noback=1&uuid=' + getLocalUuid()

  if (!imgUrl) {
    imgUrl = whiteLogo
  }

  return {
    title: title, // '分享 ' + username + ' 的InweHub动态',
    link: link,
    content: rateStar + '星-来自' + username + '的点评',
    imageUrl: imgUrl,
    thumbUrl: imgUrl + '?x-oss-process=image/resize,h_100,w_100',
    shareName: '点评'
  }
}

/**
 * 点评产品详情
 * @param username
 * @param productName
 * @param productDesc
 * @param imgUrl
 * @returns {{title: string, link: string, content: *, imageUrl: *, thumbUrl: string}}
 */
function getDianpingProductDetail (username, productName, productDesc, imgUrl) {
  // var link = process.env.API_ROOT + 'wechat/oauth?redirect=' + pathUrl + encodeURIComponent('?noback=1')
  var link = process.env.H5_ROOT + '/#' + '/dianping/product/' + encodeURIComponent(productName) + '?noback=1&uuid=' + getLocalUuid()

  if (!imgUrl) {
    imgUrl = whiteLogo
  }

  return {
    title: username + '邀请您点评',
    pyqTitle: username + '邀请您点评' + productName,
    link: link,
    content: productName,
    imageUrl: imgUrl,
    thumbUrl: imgUrl + '?x-oss-process=image/resize,h_100,w_100',
    shareName: '点评产品'
  }
}

export {
  getAskCommunityMajorDetail,
  getAskCommunityInteractionDetail,
  getInvitation,
  getDiscoverDetail,
  getTextDiscoverDetail,
  getAskCommunityInteractionAnswers,
  getInviteAnswerDetail,
  getResumeDetail,
  getGroupDetail,
  getRecommends,
  getDianpingCommentDetail,
  getDianpingProductDetail
}
