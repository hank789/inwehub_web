import { postRequest } from './request'
import localEvent from '../stores/localStorage'

function getHomeData (successCallback) {
  var homeData = localEvent.getLocalItem('HomeDataBanners')
  if (homeData.banners) {
    successCallback(homeData)
  } else {
    postRequest(`home`, {}, false).then(response => {
      var code = response.data.code
      if (code !== 1000) {
        window.mui.toast(response.data.message)
        return
      }

      var result = {}
      result.banners = response.data.data.notices
      localEvent.setLocalItem('HomeDataBanners', result)
      successCallback(result)
    })
  }
}

function clearHomeData () {
  localEvent.setLocalItem('HomeDataBanners', {})
}

function resetHomeData (successCallback) {
  clearHomeData()
  getHomeData(successCallback)
}

export {
  getHomeData,
  resetHomeData,
  clearHomeData
}

