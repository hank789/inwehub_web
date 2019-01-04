
import { alertSkyTwo, alertSimple, getDialogObj, alertZoom, alertHtml } from '../utils/dialog'
import { getLocalUserInfo } from './user'
import { run, select } from '../utils/createjs.js'
import { upvote, deleteItem } from '../utils/discover'

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
          context.$router.pushPlus('/ask/offers')
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
            context.$router.pushPlus('/RecommendInvitation/' + ask.id + '?username=' + ask.user_name + '&title=' + ask.description + '&answernum=' + ask.answer_num + '&followednum=' + ask.follow_num, 'list-detail-page')
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
            context.$router.pushPlus('/ask/offers')
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
            context.$router.pushPlus('/ask/offers')
            return true
          } else {
            context.$router.pushPlus('/ask/offers')
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

/**
 * 悬赏问答指引
 * @param context
 * @param signDaily
 */
function alertFreeAskGuide (context) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('freeAskGuideDialog', {}, (html) => {
      alertHtml(html, (num) => {
        if (num > -1) {
          return true
        }
      })
    })
  }
}

function alertPhoneBindWarning (context, title, phone, avatar, isVip, name, buttonText, callback) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('phoneBindWarning', {phoneBindWaring: {
      title,
      phone,
      avatar,
      name,
      isVip
    }}, (html) => {
      alertSimple(html, buttonText, (num) => {
        if (num.index === 0) {
          callback()
        }
      }, true)
    })
  }
}

// 去实名认证
function alertRealNameAuthentication (callback) {
  alertSkyTwo('<span class="font-family-medium authenticationRealNameTitle">请完成实名认证</span> <span class="authenticationNetWorkTitle">使用互联网服务需依法实名认证</span>', '<span class="goAuthentication alertConfirm">去认证</span>', 'icon-chengweizhuanjia1', (num) => {
    if (num.index === 0) {
      callback()
    }
  }, true)
}

// 圈子弹窗
var alertGroups = (context, groupInfo, callback) => {
  var dialog = getDialogObj(context)
  if (dialog) {
    dialog.getHtml('groups', { groupInfo: groupInfo }, (html) => {
      alertSimple(html, '立刻加入', (num) => {
        if (num.index === 0) {
          callback()
        }
      }, true)
    })
  }
}

// 引导补全头像和昵称
function alertHeadAndNickname (context, callback) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('headAndNickname', {}, (html) => {
      alertHtml(html, (num) => {
        if (num === 0) {
          callback()
        }
      })
    })
  }
}

// 圈子弹窗-旧版
function alertGroupsOld (context, callback) {
  var dialog = getDialogObj(context)
  if (dialog) {
    dialog.getHtml('groupsOld', {}, (html) => {
      alertSimple(html, '加入圈子', (num) => {
        if (num.index === 0) {
          callback()
        }
      }, true)
    })
  }
}

function alertAddWeHub (context, callback) {
  var dialog = getDialogObj(context)
  if (dialog) {
    dialog.getHtml('addInweHub', {}, (html) => {
      alertHtml(html, (num) => {
        if (num.index === 0) {
          callback()
        }
      })
    })
  }
}

// 我的 页面 弹窗
// function alertshi (context) {
//   var dialogObj = getDialogObj(context)
//   if (dialogObj) {
//     dialogObj.getHtml('noPublish', {}, (html) => {
//       alertHtml(html, (num) => {
//         if (num > -1) {
//           return true
//         }
//       })
//     })
//   }
// }

function alertReport (context, callback) {
  var rs = ''
  var dialog = getDialogObj(context)
  if (dialog) {
    dialog.getHtml('report', {}, (html) => {
      alertHtml(html, (num) => {
        if (num < 5 && num >= 0) {
          var box = document.querySelectorAll('.true .component-report .reportxxx .title')
          for (let i = 0; i < box.length; i++) {
            box[i].classList.remove('addActive')
          }
          box[num].classList.add('addActive')
          rs = document.getElementById('span_' + num).innerHTML
        }
        if (num === 5) {
          var text = document.getElementsByClassName('inputText')[1].value
          callback(rs, text)
          return true
        }
      }, true)
    })
  }
}

// 首页加热度
function alertHomeHeat (context, regions, item) {
  var dialogObj = getDialogObj(context)
  if (dialogObj) {
    dialogObj.getHtml('homeHeat', {regions: {region: regions}}, (html) => {
      alertHtml(html, (num) => {
        console.log(num + '：数字')
        if (num === 2) {
          upvote(this, item.id, () => {
            setTimeout(() => {
              return true
            }, 1000)
          })
        }
        if (num === 3) {
          deleteItem(item.id)
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
  alertMajorCommentOnlookersSuccess,
  alertAnswerRepeat,
  alertCompanyUser,
  alertCompany,
  alertDiscoverCompany,
  alertChat,
  alertSignIn,
  alertGetCredits,
  alertGetCoupon,
  alertNoticeOpenNotifitionPermission,
  alertFreeAskGuide,
  alertPhoneBindWarning,
  alertRealNameAuthentication,
  alertGroups,
  alertHeadAndNickname,
  alertGroupsOld,
  alertAddWeHub,
  alertReport,
  alertHomeHeat
  // alertshi
}
