import { getGeoPosition as getGeoPositionByPlus, getClipbordText, checkPermission, toSettingSystem } from './plus'
import { getGeoPositionByWechat } from './wechat'
import { apiRequest } from './request'
import localEvent from '../stores/localStorage'
import { alertNoticeOpenNotifitionPermission } from './dialogList'
import router from '../modules/index/routers/index'

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

/**
 * 剪切板数据处理
 */
function checkClipbord () {
  var text = getClipbordText()

  if (!text) {
    return
  }

  var urlReg = /[a-zA-z]+:\/\/[^\s"']*/g
  if (!urlReg.test(text)) {
    return
  }

  var clipbordTextDone = localEvent.getLocalItem('clipbordTextDone')
  if (clipbordTextDone === text) {
    return
  }

  localEvent.setLocalItem('clipbordTextDone', text)

  var matchs = text.match(urlReg)
  var firstMatch = matchs[0]
  window.mui.confirm('检测到您剪切板中有链接，是否分享？', '文章分享', ['取消', '确定'], e => {
    if (e.index === 1) {
      router.pushPlus(
        '/discover/publishArticles?url=' + encodeURIComponent(firstMatch),
        'publishArticles',
        true,
        'pop-in',
        'close'
      )
    }
  }, 'div')
}

/**
 * 提醒用户去开启通知权限
 */
function noticeOpenNotifitionPermission (context) {
  console.log('noticeOpenNotifitionPermission fired')
  var currentUser = localEvent.getLocalItem('UserInfo')
  checkPermission('NOTIFITION', () => {}, (result) => {
    console.log('noticeOpenNotifitionPermission fail:' + result)
    var date = new Date()
    var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    var prevDay = localEvent.getLocalItem('notification_day_' + currentUser.user_id)
    console.log('prevDay:' + JSON.stringify(prevDay))
    var isStop = 0
    var notice = () => {
      // var btnArray = ['下次再说', '前往设置']
      console.log('准备探矿')
      alertNoticeOpenNotifitionPermission(context, (index) => {
        switch (index) {
          case 0:
            toSettingSystem('NOTIFITION')
            break
          case 1:
            isStop = 1
            break
          case 2:
            break
          default:
        }
        localEvent.setLocalItem('notification_day_' + currentUser.user_id, {value: today, isStop: isStop})
        return true
      })
      localEvent.setLocalItem('notification_day_' + currentUser.user_id, {value: today, isStop: isStop})
    }

    if (prevDay.isStop === undefined) { // 第一次提醒
      console.log('第一次提醒')
      notice()
      return
    } else if (prevDay.isStop === 0 && prevDay.value !== today) {
      console.log('下次提醒')
      notice()  // 下次提醒
      return
    } else if (prevDay.isStop) {
      console.log('永不提醒')
      // 永不提醒
      return
    } else {
      console.log('今天已提醒')
      // 今天已提醒
    }
  })
}

/**
 * 页面整体刷新
 * @param context
 * @param refreshCallback
 */
function pageRefresh (context, refreshCallback) {
  var container = context.$el.querySelector('.mui-content')
  container.classList.add('hideUpToRefreshDescription')
  window.mui.init({
    pullRefresh: {
      container: container, // 下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        auto: false, // 可选,默认false.首次加载自动上拉刷新一次
        callback: () => {
          refreshCallback()
          window.mui(container).pullRefresh().endPulldownToRefresh()
        }
      }
    }
  })
}

export {
  getGeoPosition,
  saveLocationInfo,
  checkClipbord,
  noticeOpenNotifitionPermission,
  pageRefresh
}
