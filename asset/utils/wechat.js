import { postRequest } from './request'
import wx from 'weixin-js-sdk'

function hideHeaderHandler (obj, type) {
  if (window.mui.os.wechat) {
    if (obj.$router.currentRoute.meta.keepAlive && type === 'mounted') {
      return
    }

    var headers = document.getElementsByTagName('header')
    for (var i in headers) {
      var destHeader = headers[i]
      if (obj.$router.currentRoute.meta.wechatHideHeader) {
        if (destHeader && destHeader.className) {
          if (!/hidden/.test(destHeader.className) && !/mustshow/.test(destHeader.className)) {
            destHeader.className = destHeader.className.replace('mui-bar-nav', '')
            destHeader.className = destHeader.className.replace('mui-bar', '')
            destHeader.className += ' mui-wechat-hidden'
          }
        }
      } else {
        if (destHeader && destHeader.className) {
          if (/hidden/.test(destHeader.className)) {
            destHeader.className = destHeader.className.replace('mui-wechat-hidden', '')
            destHeader.className += ' mui-bar mui-bar-nav'
          }
        }
      }
    }
  }
}

function rebootAuth (hash) {
  if (window.mui.os.wechat) {
    if (!hash) {
      hash = window.location.hash.replace('#', '')
    }
    var url = process.env.API_ROOT + 'wechat/oauth?redirect=' + hash
    // -----
    window.location.href = url
  }
}

function callWechat (call) {
  var fullUrl = window.location.href
  var currentUrl = fullUrl.split('#')[0]

  postRequest(`share/wechat/jssdk`, {current_url: currentUrl}).then(response => {
    var code = response.data.code
    if (code !== 1000) {
      window.mui.toast(response.data.message)
      return
    }

    var wechatConfig = response.data.data.config
    wx.config(wechatConfig)

    wx.error(function (res) {
      console.error('wx:error:' + JSON.stringify(res))
    })

    wx.ready(() => {
      call(wx)
    })
  })
}

function getGeoPositionByWechat (callback, failCallback) {
  console.log('getGeoPositionByWechat')
  callWechat((wx) => {
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        console.log('wx.getLocation success res:' + JSON.stringify(res))
        callback(res)
      },
      fail: function (res) {
        console.log('wx.getLocation fail res:' + JSON.stringify(res))
        if (failCallback) {
          failCallback(res.errMsg)
        }
      }
    })
  })
}

export {
  hideHeaderHandler,
  rebootAuth,
  callWechat,
  getGeoPositionByWechat
}
