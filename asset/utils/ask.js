import { postRequest } from './request'

/**
 * 邀人回答
 */
function toContact (context, askId, username, description, answerNum, followedNum) {
  description = encodeURIComponent(description.replace(/\s/g, '').substr(0, 200))
  username = encodeURIComponent(username.replace(/\s/g, ''))
  answerNum = answerNum || 0
  followedNum = followedNum || 0
  var url = '/RecommendInvitation/' + askId + '?username=' + username + '&title=' + description + '&answernum=' + answerNum + '&followednum=' + followedNum
  context.$router.pushPlus(url, 'backAndClose', true, 'pop-in', 'close', true)
}

/**
 * 参与回答
 */
function toAnswer (context, askId) {
  context.$router.pushPlus('/realAnswer/' + askId + '?interaction=1', 'backAndClose')
}

/**
 * 查看我的回答
 */
function toSeeSelfAnswer (context, myAnswerId) {
  context.$router.pushPlus('/askCommunity/interaction/' + myAnswerId, 'list-detail-page-two')
}

/**
 * 关注提问
 */
function collectQuestion (context, questionId, increaseCallback, decreaseCallback) {
  postRequest(`follow/question`, {
    id: questionId
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.alert(response.data.message)
      return
    }

    var isFollowed = response.data.data.type === 'follow' ? 1 : 0

    window.mui.toast(response.data.data.tip)
    if (isFollowed) {
      increaseCallback()
    } else {
      decreaseCallback()
    }
  })
}

/**
 * 获取提问者状态描述
 * @param state
 * @returns {*}
 */
function getQuestionStateDesc (state) {
  switch (state) {
    case 8:
      return '已采纳'
    case 9:
      return '已关闭'
    default:
      return '悬赏中'
  }
}

export {
  toContact,
  toAnswer,
  toSeeSelfAnswer,
  collectQuestion,
  getQuestionStateDesc
}
