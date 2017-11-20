import { alertSkyTwo, alertSimple, getDialogObj } from '../utils/dialog'

function alertFenhongxize (context) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('fenhongxize', {}, (html) => {
      alertSimple(html, '确定', () => {
        // ...
      }, false)
    })
  }
}

/**
 * 专业问答被抢答之后的弹窗；
 */
function alertAnswerRepeat (context) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('AnswerRepeat', {}, (html) => {
      alertSimple(html, '去互动问答看看', (num) => {
        console.error(num.index)
        if (num.index === 0) {
          context.$router.pushPlus('/askCommunity/interactions')
        }
      }, true)
    })
  }
}

/**
 * 问答社区详情分享成功后弹窗；
 */
function alertAskCommunityDetailShareSuccess (context) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('askCommunityDetailShare_title', {}, (titlehtml) => {
      dialogObj.getHtml('askCommunityDetailShare_body', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-fenxiangchenggong', (num) => {
        }, true)
      })
    })
  }
}
// 互动问答 答案提交成功弹窗；
function alertAskCommunityInteractiveAnswer (context, coins, credits) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('community_t', {answercoins: coins, answercredits: credits}, (titlehtml) => {
      dialogObj.getHtml('community_b', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => {
          if (num.index === 0) {
            if (context.share) {
              context.share()
            }
          }
        }, true)
      })
    })
  }
}

// 专家认证提示;
function expertcertification (context, coins, credits) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('expertapplication-t', {expert_coins: coins, expert_credits: credits}, (titlehtml) => {
      dialogObj.getHtml('expertapplication-b', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-chengweizhuanjia1', (num) => {
          if (num.index === 0) {
            context.$router.pushPlus('/my/resume')
          }
        }, true)
      })
    })
  }
}

// 互动提问完成；

function alertAskCommunityQuestioningSuccess (context, coins, credits, ask) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('ask_t', {askcoins: coins, askcredits: credits}, (titlehtml) => {
      dialogObj.getHtml('ask_b', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => {
          if (num.index === 0) {
            context.$router.pushPlus('/contact/' + ask.id + '?username=' + ask.user_name + '&title=' + ask.description + '&answernum=' + ask.answer_num + '&followednum=' + ask.follow_num, 'list-detail-page')
          }
        }, true)
      })
    })
  }
}

// 阅读的评论完成;
function readhubCommenSuccess (context, credits) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('comment_t', {readhub_commen_credits: credits}, (titlehtml) => {
      dialogObj.getHtml('comment_b', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-huifuchenggong', (num) => {
          if (num.index === 0) {
            // 分享评论的方法；
          }
        }, true)
      })
    })
  }
}

// 完善名片；
/**
 * 完善名片的提示框；
 */
function perfectCard (context, credits) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('perfectCard-t', {perfectCard_credits: credits}, (titlehtml) => {
      dialogObj.getHtml('perfectCard-b', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-mingpianwanshan', (num) => {
          if (num.index === 0) {
            context.$router.pushPlus('/my/resume')
          }
        }, true)
      })
    })
  }
}

// 专业问答 答案提交成功弹窗；
function alertMajorAskSuccess (context, credits, coins) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('majoraskSubmit_t', {major_ask_credits: credits, major_ask_coins: coins}, (titlehtml) => {
      dialogObj.getHtml('majoraskSubmit_b', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => {
          if (num.index === 0) {
            // 返回专业问答社区;
            context.$router.pushPlus('/askCommunity/majors')
          }
        }, true)
      })
    })
  }
}

// 专业问答 答案回复成功弹窗；
function alertMajorReplySuccess (context, credits, coins) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('majoraskAnswer_t', {major_answer_credits: credits, major_answer_coins: coins}, (titlehtml) => {
      dialogObj.getHtml('majoraskAnswer_b', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => {
          if (num.index === 0) {
            if (context.share) {
              context.share()
            }
          }
        }, true)
      })
    })
  }
}

// 专业问答 评价成功弹窗；
function alertMajorCommentSuccess (context, credits, coins) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('majoraskcomment_t', {
      major_comment_credits: credits,
      major_comment_coins: coins
    }, (titlehtml) => {
      dialogObj.getHtml('majoraskcomment_b', {}, (contenthtml) => {
        alertSkyTwo(titlehtml, contenthtml, 'icon-tiwenchenggongdaantijiaochenggongpingjiatijiaochenggong', (num) => {
          if (num.index === 0) {
            if (context.share) {
              context.share()
            }
          }
        }, true)
      })
    })
  }
}

// 不是企业用户（申请企业服务）
function alertCompanyUser (context) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('CompanyUser', {}, (html) => {
      alertSimple(html, '确定', (num) => {
        console.error(num.index)
        if (num.index === 0) {
          window.mui.toast('申请成功！我们将尽快与您取得联系')
        }
      }, true)
    })
  }
}

// 不是企业用户（申请企业服务）
function alertCompany (context) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('Company', {}, (html) => {
      alertSimple(html, '企业用户认证', (num) => {
        console.error(num.index)
        if (num.index === 0) {
          context.$router.pushPlus('/company/my?back=/discover/company/services')
        }
      }, true)
    })
  }
}


// 不是企业用户（申请企业服务）
function alertDiscoverCompany (context) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('Company', {}, (html) => {
      alertSimple(html, '企业用户认证', (num) => {
        console.error(num.index)
        if (num.index === 0) {
          context.$router.pushPlus('/company/my?back=/discover')
        }
      }, true)
    })
  }
}

export {
  alertFenhongxize,
  alertAskCommunityDetailShareSuccess,
  expertcertification,
  alertAskCommunityInteractiveAnswer,
  alertAskCommunityQuestioningSuccess,
  readhubCommenSuccess,
  perfectCard,
  alertMajorAskSuccess,
  alertMajorReplySuccess,
  alertMajorCommentSuccess,
  alertAnswerRepeat,
  alertCompanyUser,
  alertCompany,
  alertDiscoverCompany
}
