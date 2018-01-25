
import { alertSkyTwo, alertSimple, getDialogObj, alertZoom, alertHtml } from '../utils/dialog'
import { getLocalUserInfo } from './user'
import { run, select } from '../utils/createjs.js'

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

// 专业问答 提问者评价成功弹窗 ；
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
// 专业问答  围观者提问者评价成功弹窗 ；
function alertMajorCommentOnlookersSuccess (context, credits, coins) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('OnlookersAskcomment_t', {
      Onlookers_comment_credits: credits,
      Onlookers_comment_coins: coins
    }, (titlehtml) => {
      dialogObj.getHtml('OnlookersAskcomment_b', {}, (contenthtml) => {
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
function alertCompanyUser (context, callback) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('CompanyUser', {}, (html) => {
      alertSimple(html, '确定', (num) => {
        if (num.index === 0) {
          // window.mui.toast('申请成功！我们将尽快与您取得联系')
          if (callback) {
            callback()
          }
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
        if (num.index === 0) {
          context.$router.pushPlus('/company/my?back=/discover')
        }
      }, true)
    })
  }
}
// 不是企业用户（申请企业服务）
function alertChat (context) {
  var userInfo = getLocalUserInfo()
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('chat', {
      percent: userInfo.account_info_complete_percent
    }, (html) => {
      alertSimple(html, '前往完善资料', (num) => {
        if (num.index === 0) {
          context.$router.pushPlus('/my/info')
        }
      }, true)
    })
  }
}

// 签到列表
function alertSignIn (context, signList, callback) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('signIn', {signList: signList}, (html) => {
      alertZoom(html, callback, true, 'alertSignInContainerWrapper')
    })
  }
}

// 签到领取成长值
function alertGetCredits (context, signDaily) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('scoreDetail', {signDaily: signDaily}, (html) => {
      alertHtml(html, (num) => {
        if (num > -1) {
          context.$router.pushPlus('/my/Growth')
          return true
        }
      })
    })
  }
}

// 签到领取红包
function alertGetCoupon (context, Coupon) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('animationContainerTop', {Coupon: Coupon}, (html) => {
    //
      alertHtml(html, (index) => {
        if (index === 0) {
          if (Coupon.coupon_type === 4) {
            context.$router.pushPlus('/askCommunity/majors')
            return true
          } else {
            context.$router.pushPlus('/my/Finance')
            return true
          }
        }
      }, 'animationContainerWrapper', () => {
        setTimeout(() => {
          var containerWrapper = document.getElementById('animationContainerWrapper')
          if (!containerWrapper) {
            return
          }

          var canvas = containerWrapper.querySelector('#canvas')
          var domOverlayContainer = containerWrapper.querySelector('#domOverlayContainer')
          var animContainer = containerWrapper.querySelector('#animationContainer')
          var stage = select(canvas, window.lib.红包)
          run(canvas, stage, domOverlayContainer, animContainer, window.lib)
          var apper = containerWrapper.querySelector('#my-cash')
          var wallet = containerWrapper.querySelector('#my-wallet')
          setTimeout(() => {
            apper.style.opacity = '1'
          }, 1500)
          setTimeout(() => {
            wallet.style.opacity = '1'
          }, 1000)
        }, 400)
      })
    //
    })
  }
}

/**
 * 通知用户开推送通知权限
  */
function alertNoticeOpenNotifitionPermission (context, callback) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('openNotice', {}, (html) => {
      alertHtml(html, callback)
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
  alertMajorCommentOnlookersSuccess,
  alertAnswerRepeat,
  alertCompanyUser,
  alertCompany,
  alertDiscoverCompany,
  alertChat,
  alertSignIn,
  alertGetCredits,
  alertGetCoupon,
  alertNoticeOpenNotifitionPermission
}
