/**
 * 用户能力
 *
 *  //.step1 导入组件
 import UserAbility from 'utils/UserAbility'

 //使用
 bool UserAbility.canDo(string what) --- 是否可以做某事

 **/
import localEvent from '../stores/localStorage'
import {getLocalUserInfo, isCompanyStatus, getLocalUuid} from '../utils/user'
import router from '../modules/index/routers/index'
import {alertZoom, alertSimple, getDialogObj, alertHtml} from '../utils/dialog'
import {postRequest} from '../utils/request'
import { alertSignIn, alertGetCredits, alertGetCoupon, alertChat, alertFreeAskGuide, alertGroups } from '../utils/dialogList'
import { TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND } from '../stores/types'
import { getContacts, toSettingSystem } from '../utils/plus'
import { isLogined } from '../utils/auth'
import { joinIn } from '../utils/group'
import userAbilityCheck from '../utils/userAbilityCheck'

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
    var isValid = userAbilityCheck.checkPhoneCertification(context)
    if (isValid) {
      router.pushPlus(url)
    }
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
      router.pushPlus('/ask/offers')
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
   * 新人引导页面
   */
  var newbieTask = (context, id) => {
    var userInfo = getLocalUserInfo()
    var mobile = userInfo.phone
    var num = parseInt(localEvent.getLocalItem('num' + mobile).value)
    if (num !== 1) {
      if (userInfo.newbie_unfinish_tasks && userInfo.newbie_unfinish_tasks.show_guide) {
        context.$router.pushPlus('/userGuide/interst')
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

  // 受邀红包样式
  var InvitationCoupon = (context) => {
    // 红包请求
    postRequest('activity/getCoupon', {coupon_type: 4}).then(response => {
      var code = response.data.code
      if (code !== 1000) {
        window.mui.toast(response.data.message)
        return
      }
      // 红包弹窗
      var Coupon = response.data.data
      alertGetCoupon(context, Coupon)
      // 领取成功提示
      window.mui.toast(response.data.data.tip)
    })
  }

  // 签到列表
  var signIGift = (context, callback) => {
    var userInfo = getLocalUserInfo()
    var mobile = userInfo.phone
    if (mobile) {
      // localEvent.setLocalItem('sign_day_' + mobile, {value: '2018-4-1'})
      var tody = new Date()
      var isTody = tody.getFullYear() + '-' + (tody.getMonth() + 1) + '-' + tody.getDate()
      var day = localEvent.getLocalItem('sign_day_' + mobile).value
      // if (day !== isTody) {
      postRequest('activity/sign/dailyInfo', {}).then(response => {
        var code = response.data.code
        if (code !== 1000) {
          window.mui.alert(response.data.message)
          window.mui.back()
          return
        }
        var infoList = response.data.data
        alertSignIn(context, infoList, (num) => {
          if (day !== isTody) {
            if (num.index >= 0) {
              postRequest('activity/sign/daily', {}).then(response => {
                var code = response.data.code
                if (code !== 1000) {
                  window.mui.alert(response.data.message)
                  window.mui.back()
                  return
                }

                callback()

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
                      window.mui.toast(response.data.message)
                      return
                    }
                    // 红包弹窗
                    var Coupon = response.data.data
                    alertGetCoupon(context, Coupon)
                    // 领取成功提示
                    window.mui.toast(response.data.data.tip)
                  })
                }
                if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
                  // mixpanel
                  window.mixpanel.track(
                    'inwehub:activity:sign_daily',
                    {
                      'app': 'inwehub',
                      'user_device': window.getUserAppDevice(),
                      'page': 'sign_daily',
                      'page_name': 'sign_daily',
                      'page_title': '签到有礼',
                      'referrer_page': ''
                    }
                  )
                }
              })
            }
          }
        })
      })
      // }
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
  // 抽奖弹窗
  var luckDraw = (context, invitation) => {
    console.log(invitation)
    var dialogObj = getDialogObj(context)
    if (dialogObj) {
      dialogObj.getHtml('luckDraw', {invitation: invitation}, (html) => {
        alertHtml(html, (num) => {
          document.querySelector('.mui-content').style.position = 'relative'
          return true
        }, 'mui-popup mui-popup-in alertluckDraw')
      })
    }
  }

  /**
   * 跳转到标签详情页
   * @param tag
   */
  var jumpToTagDetail = (tag) => {
    var newTag = encodeURIComponent(tag)
    if (['贺新春', '提建议', '谈工作'].indexOf(tag) >= 0) {
      router.pushPlus('/tag/detail/' + newTag + '/discover')
    } else {
      router.pushPlus('/tag/detail/' + newTag + '/questions')
    }
  }

  /**
   * 跳转到聊天页
   */
  var jumpToChat = (resumeId, context) => {
    if (!isLogined()) {
      context.$router.pushPlus('/login')
      return
    }
    const currentUser = getLocalUserInfo()
    var percent = currentUser.account_info_complete_percent
    if (percent >= 90) {
      context.$router.pushPlus('/chat/' + resumeId)
    } else {
      alertChat(context)
    }
  }

  /**
   * 跳到简历详情页
   * @param uuid
   * @param context
   */
  var jumpToResume = (uuid, context) => {
    var localUuid = getLocalUuid()
    if (localUuid === uuid) {
      context.$router.pushPlus('/my/resume')
    } else {
      context.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
    }
  }

  // 获取本地通讯录
  var getLocalContact = (context) => {
    if (window.plus) {
      postRequest(`profile/needAddressBookRefresh`, {}).then(response => {
        var code = response.data.code
        if (code !== 1000) {
          window.mui.toast(response.data.message)
          return
        }

        if (response.data.data.refresh) {
          // 需要重新读取
          getContacts((list) => {
            postRequest(`profile/saveAddressBook`, {contacts: list}).then(response => {
              var code = response.data.code
              if (code !== 1000) {
                window.mui.toast(response.data.message)
                return
              }
              context.$router.pushPlus('/addressBooks')
            })
          }, () => {
            var btnArray = ['取消', '确定']
            window.mui.confirm('获取联系人失败, 前往设置权限？', ' ', btnArray, function (e) {
              if (e.index === 1) {
                toSettingSystem('Contact')
              }
            })
          })
        } else {
          // 不需要重新读取
          context.$router.pushPlus('/addressBooks')
        }
      })
    } else {
      window.mui.alert('请App内打开')
    }
  }

  function showFreeAskGuide (context) {
    var history = parseInt(localEvent.getLocalItem('showFreeAskGuide_' + getLocalUuid()))
    if (!history) {
      localEvent.setLocalItem('showFreeAskGuide_' + getLocalUuid(), 1)
      alertFreeAskGuide(context)
    }
  }

  function jumpToDiscoverAdd (context) {
    var isValid = userAbilityCheck.checkPhoneCertification(context)
    if (isValid) {
      context.$router.pushPlus('/discover/add')
    }
  }

  /* 邀请用户加入圈子 */
  var inviteJoinInGroup = (context, groupInfo, groupId, callback) => {
    alertGroups(context, groupInfo, (num) => {
      joinIn(groupId, callback)
    })
  }

  var jumpToGroupAdd = (context) => {
    var isValid = userAbilityCheck.checkPhoneCertification(context)
    if (isValid) {
      context.$router.pushPlus('/group/add')
    }
  }

  var jumpToDianpingAdd = (context, productName) => {
    var isValid = userAbilityCheck.checkPhoneCertification(context)
    if (isValid) {
      context.$router.pushPlus('/dianping/add/' + productName)
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
    logout: logout,
    jumpToTagDetail: jumpToTagDetail,
    InvitationCoupon: InvitationCoupon,
    luckDraw: luckDraw,
    jumpToChat: jumpToChat,
    jumpToResume: jumpToResume,
    getLocalContact: getLocalContact,
    showFreeAskGuide: showFreeAskGuide,
    inviteJoinInGroup: inviteJoinInGroup,
    jumpToDiscoverAdd: jumpToDiscoverAdd,
    jumpToGroupAdd: jumpToGroupAdd,
    jumpToDianpingAdd: jumpToDianpingAdd
  }
}

export default new UserAbility()
