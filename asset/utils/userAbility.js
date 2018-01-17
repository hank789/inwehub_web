/**
 * 用户能力
 *
 *  //.step1 导入组件
 import UserAbility from 'utils/UserAbility'

 //使用
 bool UserAbility.canDo(string what) --- 是否可以做某事

 **/
import localEvent from '../stores/localStorage'
import {getLocalUserInfo, isCompanyStatus} from '../utils/user'
import router from '../modules/index/routers/index'
import {alertZoom, alertSimple, getDialogObj} from '../utils/dialog'
import {postRequest} from '../utils/request'
import { alertSignIn, alertGetCredits, alertGetCoupon } from '../utils/dialogList'
import { TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND } from '../stores/types'

var UserAbility = () => {
  /**
   * 是否可以做某事
   * @param what
   * @returns {boolean}
   */
  var canDo = (what, context = null) => {
    var result = false
    switch (what) {
      case 'apply_professor':  // 申请专家

        break
    }
    return result
  }

  /**
   * 跳转到发布需求
   */
  var jumpToAddProject = (context) => {
    if (isCompanyStatus()) {
      router.push('/project/basic')
    } else {
      router.push('/company/my?back=%2Fmy')
    }
  }

  /**
   * 跳转到申请专家
   */
  var jumpToApplyProfessor = (context) => {
    var userInfo = getLocalUserInfo()
    var expertStatus = parseInt(userInfo.expert_apply_status)
    switch (parseInt(expertStatus)) {
      case 0:
      case 3:
        if (context.$route.path === '/my') {
          router.pushPlus('/my/pilot')
        } else {
          router.push('/my/pilot')
        }
        break
      case 2:
        window.mui.toast('您已经是专家')
        break
      case 1:
        if (context.$route.path === '/my') {
          router.pushPlus('/expert/apply/success?type=0')
        } else {
          router.push('/expert/apply/success?type=0')
        }

        break
    }
  }

  /**
   * 跳转到专家提问
   */
  var jumpToAddAsk = (context, id = '') => {
    var url = '/ask'
    if (id) {
      url = '/ask/' + id
    }
    router.pushPlus(url)
  }

  /**
   * 跳转到提交文章
   */
  var jumpToAddArticle = (context) => {
    context.$router.pushPlus('/discover/add')
    // context.$router.pushReadHubPage('/submit')
    // router.push('/discover?redirect_url=%2Fsubmit' + '?' + encodeURIComponent('from=h5' + '&time=' + (new Date()).getTime()));
  }

  /**
   * 跳转到问答社区
   */
  var jumpToAskCommunity = (context) => {
    var userInfo = getLocalUserInfo()

    if (userInfo.user_level >= 1) {
      router.pushPlus('/askCommunity/majors')
    } else {
      var dialog = getDialogObj(context)
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth')
            }
          }, true)
        })
      }
    }
  }

  /**
   * 跳转到问答社区具体问答详情页
   */
  var jumpToAskCommunityDetail = (context, id) => {
    var userInfo = getLocalUserInfo()

    if (userInfo.user_level >= 1) {
      router.pushPlus('/askCommunity/major/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
    } else {
      var dialog = getDialogObj(context)
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth')
            }
          }, true)
        })
      }
    }
  }

  /**
   * 跳转到活动报名
   */
  var jumpToApplyActivity = (context, id) => {
    var userInfo = getLocalUserInfo()

    if (userInfo.user_level >= 2) {
      router.pushPlus('/EnrollmentStatus/' + id)
    } else {
      var dialog = getDialogObj(context)
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth')
            }
          }, true)
        })
      }
    }
  }

  /**
   * 跳转到机遇报名
   */
  var jumpToApplyOpportunity = (context, id) => {
    var userInfo = getLocalUserInfo()

    if (userInfo.user_level >= 3) {
      router.pushPlus('/EnrollmentStatus/' + id)
    } else {
      var dialog = getDialogObj(context)
      if (dialog) {
        dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth')
            }
          }, true)
        })
      }
    }
  }

  /**
   * 升级等级Newbie Task
   */
  var upgradeLevel = (context, id) => {
    var userInfo = getLocalUserInfo()
    var dialogObj = getDialogObj(context)
    if (dialogObj) {
      dialogObj.getHtml('p-upgrade', {level: userInfo.user_level}, (html) => {
        alertZoom(html, (num) => {
        }, false)
      })
    }
  }

  /**
   * 新手任务Newbie Task  console.log(localEvent.getLocalItem('num'));
   */
  var newbieTask = (context, id) => {
    var userInfo = getLocalUserInfo()
    var mobile = userInfo.phone
    var num = parseInt(localEvent.getLocalItem('num' + mobile).value)
    if (num !== 1) {
      if (!userInfo.newbie_unfinish_tasks.ask) {
        var dialogObj = getDialogObj(context)
        if (dialogObj) {
          dialogObj.getHtml('p-task', {level: userInfo.user_level}, (html) => {
            alertZoom(html, (num) => {
              postRequest(`activity/getCoupon`, {coupon_type: 1}).then(response => {
                var code = response.data.code
                // 如果请求不成功提示信息 并且返回上一页；
                if (code !== 1000) {
                  return
                }
                localEvent.setLocalItem('num' + mobile, {value: '1'})
              })
              if (window.mixpanel.track) {
                window.mixpanel.track(
                  'inwehub:newbie:dialog',
                  {
                    'app': 'inwehub',
                    'user_device': window.getUserAppDevice(),
                    'page': 'newbie-dialog',
                    'page_title': '新手任务弹窗'
                  }
                )
              }
            }, false)
          })
        }
      }
    }
  }

  /**
   * 等级样式弹窗；
   */
  var jumpJudgeGrade = (context) => {
    var userInfo = getLocalUserInfo()
    var dialog = getDialogObj(context)
    if (dialog) {
      dialog.getHtml('test', {level: userInfo.user_level}, (html) => {
        alertSimple(html, '查看等级详情', (num) => {
          if (num.index === 0) {
            router.pushPlus('/my/Growth')
          }
        }, true)
      })
    }
  }
  // 签到列表
  var signIGift = (context) => {
    var userInfo = getLocalUserInfo()
    var mobile = userInfo.phone
    if (mobile) {
      var tody = new Date()
      var isTody = tody.getFullYear() + '-' + (tody.getMonth() + 1) + '-' + tody.getDate()
      var day = localEvent.getLocalItem('sign_day_' + mobile).value
      if (day !== isTody) {
        postRequest('activity/sign/dailyInfo', {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data.current_day_signed === 0) {
            var infoList = response.data.data
            alertSignIn(context, infoList, (num) => {
              if (num.index >= 0) {
                postRequest('activity/sign/daily', {}).then(response => {
                  var code = response.data.code
                  if (code !== 1000) {
                    window.mui.alert(response.data.message)
                    window.mui.back()
                    return
                  }
                  // 签到请求成功
                  localEvent.setLocalItem('sign_day_' + mobile, {value: isTody})
                  if (response.data.data.coupon_type === 0) {
                    // 积分奖励弹窗
                    var signDaily = response.data.data
                    alertGetCredits(context, signDaily)
                  } else {
                    // 红包请求
                    postRequest('activity/getCoupon', {coupon_type: response.data.data.coupon_type}).then(response => {
                      var code = response.data.code
                      if (code !== 1000) {
                        window.mui.alert(response.data.message)
                        window.mui.back()
                      }
                      // 红包弹窗
                      var Coupon = response.data.data
                      alertGetCoupon(context, Coupon)
                      // 领取成功提示
                      window.mui.toast(response.data.data.tip)
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  }

  /**
   * 用户退出登录
   */
  var logout = (context, callback) => {
    if (window.mui.os.plus) {
      window.mui.plusReady(() => {
        var deviceInfo = window.plus.push.getClientInfo()
        postRequest(`auth/logout`, {
          client_id: deviceInfo.clientid,
          device_token: deviceInfo.token,
          appid: deviceInfo.appid,
          appkey: deviceInfo.appkey,
          device_type: window.plus.os.name === 'iOS' ? 2 : 1
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          localEvent.clearLocalItem('UserLoginInfo')
          localEvent.clearLocalItem('UserInfo')
          context.$store.dispatch(ASKS_LIST_APPEND, {})
          context.$store.dispatch(ANSWERS_LIST_APPEND, {})
          context.$store.dispatch(TASK_LIST_APPEND, {})

          if (callback) {
            callback()
          }
        })
      })
    } else {
      localEvent.clearLocalItem('UserLoginInfo')
      localEvent.clearLocalItem('UserInfo')
      context.$store.dispatch(ASKS_LIST_APPEND, {})
      context.$store.dispatch(ANSWERS_LIST_APPEND, {})
      context.$store.dispatch(TASK_LIST_APPEND, {})
      if (callback) {
        callback()
      }
    }
  }



  return {
    canDo: canDo,
    jumpToAddProject: jumpToAddProject,
    jumpToApplyProfessor: jumpToApplyProfessor,
    jumpToAddAsk: jumpToAddAsk,
    jumpToAddArticle: jumpToAddArticle,
    jumpToApplyActivity: jumpToApplyActivity,
    jumpToApplyOpportunity: jumpToApplyOpportunity,
    jumpToAskCommunity: jumpToAskCommunity,
    jumpToAskCommunityDetail: jumpToAskCommunityDetail,
    upgradeLevel: upgradeLevel,
    newbieTask: newbieTask,
    jumpJudgeGrade: jumpJudgeGrade,
    signIGift: signIGift,
    logout: logout
  }
}

export default new UserAbility()
