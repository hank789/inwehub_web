import axios from 'axios'
import localEvent from '../stores/localStorage'
import { logout } from '../utils/auth'
import { rebootAuth } from '../utils/wechat'

const baseURL = process.env.API_ROOT
const api = process.env.API_ROOT + `api`

// Export a method to create the requested address.
export const createRequestURI = PATH => `${baseURL}/${PATH}`

// Created the request address of API.
export const createAPI = PATH => `${api}/${PATH}`

// 注入access-token验证
export const addAccessToken = () => {
  const UserLoginInfo = localEvent.getLocalItem('UserLoginInfo')
  axios.defaults.headers.common = {
    'Authorization': 'bearer ' + UserLoginInfo.token
  }
  return axios
}

export default axios

export function apiRequest (url, data, showWaiting = true) {
  if (showWaiting) {
    window.mui.waiting()
  }
  var appVersion = localEvent.getLocalItem('app_version')
  if (appVersion) {
    data.current_version = appVersion.version
  }

  var proObj = addAccessToken().post(createAPI(url), data,
    {
      validateStatus: status => status === 200
    }
  )
    .then(response => {
      if (showWaiting) {
        window.mui.closeWaiting()
      }

      var code = response.data.code
      // 参数错误
      if (code === 1008) {
        var errMsg = ''
        for (var i in response.data.data) {
          errMsg = errMsg + response.data.data[i] + '\n'
        }
        var s = errMsg.substring(0, errMsg.lastIndexOf('\n'))
        return Promise.reject(s)
      }

      if (!window.mui.os.wechat) {
        if (code === 1001 || code === 1002 || code === 1004 || code === 1102) {
          window.mui.toast(response.data.message)
          logout()
          return Promise.reject(response.data.message)
        }
      } else {
        if (code === 1001 || code === 1002 || code === 1004 || code === 1102) {
          rebootAuth()
          return Promise.reject(response.data.message)
        }
      }

      if (code !== 1000) {
        return Promise.reject(response.data.message)
      }

      return response.data.data
    })
    .catch(e => {
      if (showWaiting) {
        window.mui.closeWaiting()
      }

      console.log('网络异常:' + e)

      return Promise.reject(e)
    })

  proObj.oldThen = proObj.then
  proObj.then = function (success, fail) {
    if (!fail) {
      fail = function (errorMsg) {
        errorMsg = errorMsg.toString()
        if (errorMsg === 'Error: Network Error') {
          errorMsg = '网络异常'
        }
        window.mui.toast(errorMsg)
      }
    }
    proObj.oldThen(success, fail)
    return proObj
  }
  return proObj
}

// 对后端数据进行请求；（showWaiting = true 加载gif）
export function postRequest (url, data, showWaiting = true, options = {}) {
  if (showWaiting) {
    window.mui.waiting()
  }

  var appVersion = localEvent.getLocalItem('app_version')
  if (appVersion) {
    data.current_version = appVersion.version
  }

  var config = {}
  config.validateStatus = status => status === 200

  if (options.onUploadProgress) {
    config.onUploadProgress = options.onUploadProgress
  }

  var proObj = addAccessToken().post(createAPI(url), data, config)
    .then(response => {
      if (options.onUploadProgress) {
        window.mui.closeUploadWaiting()
      }

      if (showWaiting) {
        window.mui.closeWaiting()
      }

      var code = response.data.code
      if (!window.mui.os.wechat) {
        if (code === 1001 || code === 1002 || code === 1004 || code === 1102) {
          window.mui.toast(response.data.message)
          logout()
          return Promise.reject(response.data.message)
        }
      } else {
        if (code === 1001 || code === 1002 || code === 1004 || code === 1102) {
          rebootAuth()
          return Promise.reject(response.data.message)
        }
      }

      return response
    })
    .catch(e => {
      if (showWaiting) {
        window.mui.closeWaiting()
      }

      if (options.onUploadProgress) {
        window.mui.closeUploadWaiting()
      }

      console.log('网络异常:' + e)

      return Promise.reject(e)
    })

  proObj.oldThen = proObj.then
  proObj.then = function (success, fail) {
    if (!fail) {
      fail = function (errorMsg) {
        errorMsg = errorMsg.toString()
        if (errorMsg === 'Error: Network Error') {
          errorMsg = '网络异常'
        }
        window.mui.toast(errorMsg)
      }
    }
    proObj.oldThen(success, fail)
    return proObj
  }
  return proObj
}
