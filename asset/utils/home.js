import { postRequest } from './request'

function getHomeData (successCallback) {
  postRequest(`home`, {}).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    var result = {}
    result.banners = response.data.data.notices
    successCallback(result)
  })
}

export {
  getHomeData
}

