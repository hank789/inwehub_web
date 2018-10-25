import { postRequest } from './request'

function joinIn (groupId, callback) {
  postRequest(`group/join`, {id: groupId}).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }
    window.mui.toast(response.data.message)
    if (callback) {
      callback()
    }
  })
}

export {
  joinIn
}

