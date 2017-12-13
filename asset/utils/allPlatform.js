import { getGeoPosition as getGeoPositionByPlus } from './plus'
import { getGeoPositionByWechat } from './wechat'
import { apiRequest } from './request'

/**
 * 获取地理位置
 * @param callback
 * @param failCallback
 */
function getGeoPosition (callback, failCallback) {
  if (window.mui.os.plus) {
    console.log('交由plus获取位置信息')
    getGeoPositionByPlus(callback, failCallback)
  } else if (window.mui.os.wechat) {
    console.log('交由wechat获取位置信息')
    getGeoPositionByWechat((res) => {
      var info = {
        coordsType: 'wgs84', // 坐标类型
        addresses: '', // 地址信息
        longt: res.longitude, // 经度
        lat: res.latitude // 纬度
      }
      callback(info)
    }, failCallback)
  }
}

/**
 * 保存用户当前位置信息
 */
function saveLocationInfo () {
  getGeoPosition((position) => {
    let deviceSystem = window.getUserAppDevice()
    let deviceName = window.getUserAppDevice()
    let deviceModel = ''
    let deviceCode = ''
    if (window.mui.os.plus) {
      deviceName = window.plus.os.name
      deviceModel = window.plus.os.version
      deviceCode = window.plus.device.uuid
    }
    apiRequest(`system/location`, {
      device_name: deviceName,
      device_system: deviceSystem,
      device_model: deviceModel,
      device_code: deviceCode,
      current_address_name: position.addresses,
      current_address_longitude: position.longt,
      current_address_latitude: position.lat
    }, false).then(res => {

    })
  })
}

export {
  getGeoPosition,
  saveLocationInfo
}
