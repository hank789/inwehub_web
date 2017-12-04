import { getGeoPosition as getGeoPositionByPlus } from './plus'
import { getGeoPositionByWechat } from './wechat'

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

export {
  getGeoPosition
}
