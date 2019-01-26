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
  context.$router.pushPlus('/ask/offer/' + myAnswerId, 'list-detail-page-two')
}

/**
 * 修改我的回答
 * @param context
 * @param questionId
 * @param answerId
 */
function modifySelfAnswer (context, questionId, answerId) {
  context.$router.pushPlus('/realAnswer/' + questionId + '/' + answerId, 'backAndClose')
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

function getQuestionStateClass (state) {
  switch (state) {
    case 8:
      return 'component-label-success'
    case 9:
      return 'component-label-fail'
    default:
      return 'component-label-warn'
  }
}

/**
 * 关注回答
 */
function collectAnswer (context, answerId, increaseCallback, decreaseCallback) {
  var data = {
    id: answerId
  }

  postRequest(`collect/answer`, data).then(response => {
    var code = response.data.code

    if (code !== 1000) {
      window.mui.alert(response.data.message)
      return
    }

    if (response.data.data.type === 'uncollect') {
      decreaseCallback()
    } else {
      increaseCallback()
    }
    window.mui.toast(response.data.data.tip)
  })
}

/**
 * 点赞回答
 */
function supportAnswer (context, answerId, increaseCallback, decreaseCallback) {
  var data = {
    id: answerId
  }
  postRequest(`support/answer`, data).then(response => {
    var code = response.data.code

    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    if (response.data.data.type === 'unsupport') {
      decreaseCallback(response)
    } else {
      increaseCallback(response)
    }
    if (process.env.NODE_ENV === 'production' && window.mixpanel) {
      // mixpanel
      window.mixpanel.track(
        'inwehub:support:success',
        {
          'app': 'inwehub',
          'user_device': window.getUserAppDevice(),
          'page': answerId,
          'page_name': 'answer',
          'page_title': response.data.data.type !== 'unsupport' ? 'support' : 'cancel',
          'referrer_page': ''
        }
      )
    }
    window.mui.toast(response.data.data.tip)
  })
}

/**
 * 踩回答
 */
function unSupportAnswer (context, answerId, increaseCallback, decreaseCallback) {
  var data = {
    id: answerId
  }
  postRequest(`downvote/answer`, data).then(response => {
    var code = response.data.code

    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    if (response.data.data.type === 'cancel_downvote') {
      decreaseCallback(response)
    } else {
      increaseCallback(response)
    }
    if (process.env.NODE_ENV === 'production' && window.mixpanel) {
      // mixpanel
      window.mixpanel.track(
        'inwehub:support:success',
        {
          'app': 'inwehub',
          'user_device': window.getUserAppDevice(),
          'page': answerId,
          'page_name': 'answer',
          'page_title': response.data.data.type !== 'cancel_downvote' ? 'cancel_downvote' : 'downvote',
          'referrer_page': ''
        }
      )
    }
    window.mui.toast(response.data.data.tip)
  })
}

/**
 * 采纳回答
 * @param context
 * @param answerId
 */
function adoptAnswer (context, answerId, succeeCallback) {
  postRequest(`answer/adopt`, {
    answer_id: answerId
  }).then(response => {
    var code = response.data.code

    if (code !== 1000) {
      window.mui.alert(response.data.message)
      return
    }

    succeeCallback()
  })
}

export {
  toContact,
  toAnswer,
  toSeeSelfAnswer,
  collectQuestion,
  getQuestionStateDesc,
  collectAnswer,
  getQuestionStateClass,
  supportAnswer,
  unSupportAnswer,
  adoptAnswer,
  modifySelfAnswer
}
