
import { postRequest } from './request'
import userAbility from './userAbility'
import { alertReport } from './dialogList'

/* 点赞 */
function upvote (context, submissionId, increaseCallback, decreaseCallback) {
  postRequest(`article/upvote-submission`, {
    submission_id: submissionId
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      if (code === 6108) {
        userAbility.inviteJoinInGroup(context, response.data.data.group_id)
        return
      }

      window.mui.toast(response.data.message)
      return
    }

    var isFollowed = response.data.data.type === 'upvote' ? 1 : 0

    // window.mui.toast(response.data.data.tip)
    if (isFollowed) {
      increaseCallback(response)
    } else {
      decreaseCallback(response)
    }
  })
}

/* 点赞 */
function upvoteOnlyHome (context, submissionId, increaseCallback, decreaseCallback) {
  postRequest(`article/upvote-submission`, {
    submission_id: submissionId
  }, false).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      if (code === 6108) {
        userAbility.inviteJoinInGroup(context, response.data.data.group_id)
        return
      }

      window.mui.toast(response.data.message)
      return
    }

    var isFollowed = response.data.data.type === 'upvote' ? 1 : 0

    // window.mui.toast(response.data.data.tip)
    if (isFollowed) {
      increaseCallback(response)
    } else {
      decreaseCallback(response)
    }
  })
}

/* 点踩 */
function downVote (context, submissionId, increaseCallback, decreaseCallback) {
  postRequest(`article/downvote-submission`, {
    submission_id: submissionId
  }).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      if (code === 6108) {
        userAbility.inviteJoinInGroup(context, response.data.data.group_id)
        return
      }

      window.mui.toast(response.data.message)
      return
    }

    var isFollowed = response.data.data.type === 'downvote' ? 1 : 0

    // window.mui.toast(response.data.data.tip)
    if (isFollowed) {
      increaseCallback(response)
    } else {
      decreaseCallback(response)
    }
  })
}

/* 收藏，取消收藏 */
function collect (context, submissionId, increaseCallback, decreaseCallback) {
  var data = {
    id: submissionId
  }

  postRequest(`article/bookmark-submission`, data).then(response => {
    var code = response.data.code
    if (code === 6108) {
      userAbility.inviteJoinInGroup(context, response.data.data.group_id)
      return
    } else if (code !== 1000) {
      window.mui.alert(response.data.message)
      return
    }
    var isCollected = false
    if (response.data.data.type === 'unbookmarked') {
      decreaseCallback()
      isCollected = false
      window.mui.toast('已取消收藏')
    } else {
      increaseCallback()
      isCollected = true
      window.mui.toast('收藏成功')
    }
    if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
      // mixpanel
      window.mixpanel.track(
        'inwehub:bookmark:success',
        {
          'app': 'inwehub',
          'user_device': window.getUserAppDevice(),
          'page': submissionId,
          'page_name': 'submission',
          'page_title': !isCollected ? 'cancel' : 'bookmark',
          'referrer_page': ''
        }
      )
    }
  })
}

/* 删除 */
function deleteItem (id, successCallback) {
  var btnArray = ['取消', '确定']
  window.mui.confirm('确定删除吗？', ' ', btnArray, (e) => {
    if (e.index === 1) {
      // 进行删除
      postRequest(`article/destroy-submission`, {
        id: id
      }).then(response => {
        var code = response.data.code
        // 如果请求不成功提示信息 并且返回上一页；
        if (code !== 1000) {
          window.mui.toast(response.data.message)
        } else {
          window.mui.toast('删除成功')
          successCallback()
        }
      })
    }
  })
}

/* 设置为精选 */
function addGood (submissionId, callback) {
  postRequest(`group/setSubmissionRecommend`, {submission_id: submissionId}).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }
    window.mui.toast('操作成功')
    callback()
  })
}

/* 取消精选 */
function cancelGood (submissionId, callback) {
  postRequest(`group/cancelSubmissionRecommend`, {submission_id: submissionId}).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    window.mui.toast('操作成功')
    callback()
  })
}

/* 设为置顶 */
function setTop (submissionId, callback) {
  postRequest(`group/setSubmissionTop`, {submission_id: submissionId}).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }
    window.mui.toast('操作成功')
    callback()
  })
}

/* 取消置顶 */
function cancelTop (submissionId, callback) {
  postRequest(`group/cancelSubmissionTop`, {submission_id: submissionId}).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }
    window.mui.toast('操作成功')
    callback()
  })
}

/* 举报 */
function report (context, link) {
  setTimeout(() => {
    alertReport(context, (rs, describe) => {
      link = process.env.H5_ROOT + link

      if (!rs) {
        window.mui.toast('请选择举报类型')
      } else if (!describe) {
        window.mui.toast('请输入举报内容')
      } else {
        postRequest(`system/feedback`, {
          title: '举报内容',
          content: '举报类型:' + rs + '/举报内容:' + describe + '/链接:' + link
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          } else {
            window.mui.toast('举报成功')
          }
        })
      }
    })
  }, 500)
}



export {
  upvote,
  downVote,
  deleteItem,
  collect,
  addGood,
  cancelGood,
  cancelTop,
  setTop,
  report,
  upvoteOnlyHome
}
