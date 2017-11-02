import localEvent from '../stores/localStorage'

/**
 * 设置ios角标数
 * @param number
 */
function setAppBadgeNumber (number) {
  if (window.mui.os.plus) {
    window.mui.plusReady(function () {
      localEvent.setLocalItem('notice', {badgeNumber: number})
      window.plus.runtime.setBadgeNumber(number)
    })
  }
}

/**
 * 设置ios角标数+1
 */
function setIncBadgeNumber () {
  var notice = localEvent.getLocalItem('notice', {badgeNumber: number})
  var number = 1
  if (notice.badgeNumber) {
    number = notice.badgeNumber + 1
  }
  setAppBadgeNumber(number)
  return number
}

export {
  setAppBadgeNumber,
  setIncBadgeNumber
}
