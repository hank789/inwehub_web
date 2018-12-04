/**
 * 用户能力权限检查
 *
 *  //.step1 导入组件
 import userAbilityCheck from 'utils/userAbilityCheck'

 //使用

 **/
import { getLocalUserInfo } from '../utils/user'
import router from '../modules/index/routers/index'
import { alertSimple, getDialogObj } from '../utils/dialog'
import { alertRealNameAuthentication } from './dialogList'

var UserAbilityCheck = () => {
  /**
   * 申请专家条件验证
   */
  var applyProfessor = (context) => {
    var userInfo = getLocalUserInfo()

    // 验证资料的完善程度
    var accountInfoCompletePercent = userInfo.account_info_complete_percent
    if (accountInfoCompletePercent < 96) {
      var font = '<p style= "text-align:left">' + '申请专家认证需要保证个人资料完整度在96%以上，请前往进行维护。' + '</p>'
      var title = '<p style="font-size:16px; margin-bottom:15px">' + '温馨提示 ' + '</p>'
      window.mui.confirm(font, title, function (e) {
        if (e.index === 1) {
          router.replace('/my/info')
        } else {

        }
      }, 'div')
      return false
    }

    // 验证用户等级
    if (userInfo.user_level < 2) {
      var dialogObj = getDialogObj(context)
      if (dialogObj) {
        dialogObj.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth')
            }
          }, true)
        })
      }
      return false
    }

    // 验证用户状态
    var expertStatus = parseInt(userInfo.expert_apply_status)
    switch (parseInt(expertStatus)) {
      case 0:
      case 3:
        // is ok
        break
      case 2:
        window.mui.toast('您已经是专家')
        return false
      case 1:
        if (context.$route.path === '/my') {
          router.pushPlus('/expert/apply/success?type=0')
        } else {
          router.push('/expert/apply/success?type=0')
        }
        break
    }
    return true
  }

  /**
   * 首页查看更多专家
   */
  var moreProfessor = (context) => {
    var userInfo = getLocalUserInfo()
    if (userInfo.user_level < 4) {
      var dialogObj = getDialogObj(context)
      if (dialogObj) {
        dialogObj.getHtml('test', {level: userInfo.user_level}, (html) => {
          alertSimple(html, '查看等级详情', (num) => {
            if (num.index === 0) {
              router.pushPlus('/my/Growth')
            }
          }, true)
        })
      }
      return false
    }

    return true
  }

  /**
   * 实名认证检查
   */
  var checkPhoneCertification = (context) => {
    var userInfo = getLocalUserInfo()
    if (userInfo.phone) {
      return true
    }

    alertRealNameAuthentication(() => {
      router.push('/wechat/bindPhone')
    })

    return false
  }

  return {
    applyProfessor: applyProfessor,
    moreProfessor: moreProfessor,
    checkPhoneCertification
  }
}

export default new UserAbilityCheck()
