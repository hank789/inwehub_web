import { postRequest } from './request'
import localEvent from '../stores/localStorage'

function getHomeData (successCallback) {
  var homeData = localEvent.getLocalItem('HomeData')
  if (window.mui.os.plus && homeData.regions) {
    successCallback(homeData)
  } else {
    postRequest(`home`, {}, false, {}, 0, false).then(response => {
      var code = response.data.code
      if (code !== 1000) {
        window.mui.toast(response.data.message)
        return
      }
      localEvent.setLocalItem('HomeData', response.data.data)
      successCallback(response.data.data)
    })
  }
}

function clearHomeData () {
  localEvent.setLocalItem('HomeDataBanners', {})
  localEvent.setLocalItem('HomeData', {})
}

function resetHomeData (successCallback) {
  clearHomeData()
  getHomeData(successCallback)
}

/**
 * 是否显示广告页
 */
function checkShowAd () {
  postRequest(`system/boot_guide`, {}, false, {}, 6000).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    // 是否显示启动页面
    if (response.data.data.show_guide) {
      localEvent.setLocalItem('isShowAd', {status: true})
    } else {
      localEvent.setLocalItem('isShowAd', {status: false})
    }
  })
}

/**
 * 是否显示ad
 */
function isShowAd () {
  var isShowAd = localEvent.getLocalItem('isShowAd')
  if (isShowAd && isShowAd.status) {
    return true
  }
  return false
}

export {
  getHomeData,
  resetHomeData,
  clearHomeData,
  checkShowAd,
  isShowAd
}

