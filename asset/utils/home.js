import { postRequest } from './request'
import localEvent from '../stores/localStorage'

function getHomeData (successCallback) {
  var homeData = localEvent.getLocalItem('HomeData')
  if (homeData.regions) {
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

export {
  getHomeData,
  resetHomeData,
  clearHomeData
}

