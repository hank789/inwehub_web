
import { postRequest } from './request'

function upvote (context, submissionId, increaseCallback, decreaseCallback) {
  postRequest(`article/upvote-submission`, {
    submission_id: submissionId
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.alert(response.data.message)
      return
    }

    var isFollowed = response.data.data.type === 'upvote' ? 1 : 0

    window.mui.toast(response.data.data.tip)
    if (isFollowed) {
      increaseCallback(response)
    } else {
      decreaseCallback(response)
    }
  })
}

function downVote (context, submissionId, increaseCallback, decreaseCallback) {
  postRequest(`article/downvote-submission`, {
    submission_id: submissionId
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.alert(response.data.message)
      return
    }

    var isFollowed = response.data.data.type === 'downvote' ? 1 : 0

    window.mui.toast(response.data.data.tip)
    if (isFollowed) {
      increaseCallback(response)
    } else {
      decreaseCallback(response)
    }
  })
}

export {
  upvote,
  downVote
}
