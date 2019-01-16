
import { checkPermission, toSettingSystem } from './plus'
import { postRequest } from './request'
import { alertHotOpenNotice } from './dialogList'
import localEvent from '../stores/localStorage'

function _apiNotificationPushUpdate (data, successCallback, failCallback) {
  postRequest(`notification/push/update`, data).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      failCallback(response.data.message)
      return
    }

    successCallback(response.data.message)
    // window.mui.toast(response.data.message)
  })
}

/**
 * 打开或关闭热点推荐-app推送
* */
function setHotRecommendAppPushStatus (isOpen, successCallback, failCallback) {
  if (isOpen) {
    if (window.mui.os.plus) {
      checkPermission('NOTIFITION', () => {
        _apiNotificationPushUpdate({
          push_daily_subscribe: 1
        }, successCallback, failCallback)
      }, () => {
        alertHotOpenNotice(this, (num) => {
          switch (num) {
            case -1:
              failCallback()
              break
            case 0:
              toSettingSystem('NOTIFITION')
              localEvent.setLocalItem('hotRecommendAppMonitor', {isTrue: 1})
              window.addEventListener('resume', () => {
                var hotRecommendAppMonitor = localEvent.getLocalItem('hotRecommendAppMonitor')
                if (hotRecommendAppMonitor && hotRecommendAppMonitor.isTrue) {
                  localEvent.clearLocalItem('hotRecommendAppMonitor')
                  setHotRecommendAppPushStatus(isOpen, successCallback, failCallback)
                }
              }, false)
              break
            case 1:
              failCallback()
              break
          }
        })
      })
    } else {
      _apiNotificationPushUpdate({
        push_daily_subscribe: 1
      }, successCallback, failCallback)
    }
  } else {
    _apiNotificationPushUpdate({
      push_daily_subscribe: 0
    }, successCallback, failCallback)
  }
}

/**
 * 打开或关闭邮件订阅
 */
function setHotRecommendEmailStatus (isOpen, email, successCallback, failCallback) {
  if (isOpen && !email) return

  if (!isOpen) {
    email = 0
  }

  _apiNotificationPushUpdate({
    email_daily_subscribe: email
  }, successCallback, failCallback)
}

/**
 * 打开或关闭微信订阅
 */
function setHotRecommendWechatStatus (isOpen, successCallback, failCallback) {
  _apiNotificationPushUpdate({
    wechat_daily_subscribe: isOpen ? 1 : 0
  }, successCallback, failCallback)
}

export {
  setHotRecommendAppPushStatus,
  setHotRecommendEmailStatus,
  setHotRecommendWechatStatus
}
