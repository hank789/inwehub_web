import { getRequest } from '../utils/request'
import localEvent from '../stores/localStorage'
import Raven from 'raven-js'

function checkUpdate () {
  if (window.mui.os.plus) {
    // 获取本地应用资源版本号
    window.plus.runtime.getProperty(window.plus.runtime.appid, function (inf) {
      var wgtVer = inf.version
      var appInstallVersion = localEvent.getLocalItem('app_install_version')
      if (!appInstallVersion.version) {
        appInstallVersion.version = wgtVer
      }
      console.log('当前应用版本：' + wgtVer)
      console.log('当前安装版本：' + appInstallVersion.version)
      localEvent.setLocalItem('app_version', {version: wgtVer})
      getRequest(`system/version`, {app_uuid: window.plus.device.uuid + wgtVer}, false, {}, 0, false).then(responseData => {
        if (responseData.data.data !== false) {
          var appVersion = responseData.data.data.app_version
          if (appVersion && appInstallVersion.version < appVersion) {
            var packageUrl = responseData.data.data.package_url
            var isIosForce = responseData.data.data.is_ios_force
            var isAndroidForce = responseData.data.data.is_android_force
            // 如果是强更
            if (isIosForce === 1 && window.mui.os.ios) {
              window.mui.alert('有新的版本升级')
              window.plus.runtime.openURL(responseData.data.data.ios_force_update_url)
            } else if (isAndroidForce === 1 && window.mui.os.android) {
              window.mui.alert('有新的版本升级')
              // market://details?id=io.dcloud.HelloMUI
              // 'com.tencent.android.qqdownloader'
              window.plus.runtime.openURL(responseData.data.data.android_force_update_url, function (e) {
                window.plus.nativeUI.confirm('很抱歉，您未安装腾讯应用宝，请安装后再更新', function (i) {
                  if (i.index === 0) {
                    window.plus.runtime.openURL('market://details?id=com.tencent.android.qqdownloader')
                  } else if (i.index === 1) {
                    window.plus.runtime.quit()
                  } else {
                    window.plus.runtime.quit()
                  }
                }, inf.name, ['立即下载', '暂不下载', '取消'])
              })
            } else if ((isIosForce === 2 && window.mui.os.ios) || (isAndroidForce === 2 && window.mui.os.android)) {
              // 什么都不做
            } else {
              localEvent.setLocalItem('app_update_msg', {msg: responseData.data.data.update_msg})
              // 下载升级包
              downWgt(packageUrl, appVersion)
            }
          }
        }
      })
    })
  }
}

function downWgt (wgtUrl, appVersion) {
  // window.plus.nativeUI.showWaiting('有新版本更新')
  window.plus.downloader.createDownload(wgtUrl, {filename: '_doc/update/'}, function (d, status) {
    if (status === 200) {
      console.log('下载wgt文件成功！' + appVersion)
      installWgt(d.filename, appVersion) // 安装wgt包
    } else {
      window.plus.nativeUI.alert('下载更新文件失败:' + status)
    }
    window.plus.nativeUI.closeWaiting()
  }).start()
}

// 更新应用资源
function installWgt (path, appVersion) {
  // window.plus.nativeUI.showWaiting()
  window.plus.runtime.install(path, {}, function () {
    window.plus.nativeUI.closeWaiting()
    console.log('安装wgt文件成功！' + appVersion)
    removeFile(path)
    localEvent.setLocalItem('app_install_version', {version: appVersion})
    var updateMsg = localEvent.getLocalItem('app_update_msg')
    window.mui.confirm(updateMsg.msg, '新版本更新', ['取消', '确定'], (e) => {
      if (e.index === 1) {
        // 再次过一遍引导页，避免直接到首页造成本地图片加载空白问题
        localEvent.setLocalItem('lauchFlag', {showGuide: false})
        localEvent.setLocalItem('useLocalImg', {local: false})
        window.plus.runtime.restart()
      }
    }, 'div')
  }, function (e) {
    window.plus.nativeUI.closeWaiting()
    console.log('安装wgt文件失败[' + e.code + ']:' + e.message)
    removeFile(path)
    Raven.captureException(JSON.stringify(e))
    // plus.nativeUI.alert("失败["+e.code+"]："+e.message);
  })
}

function removeFile (path) {
  window.plus.io.resolveLocalFileSystemURL(path, function (entry) {
    // 可通过entry对象操作文件
    entry.remove(function (entry) {
      console.log('Remove succeeded')
    }, function (e) {
      console.log(e.message)
    })
  }, function (e) {
    console.log('Resolve file URL failed: ' + e.message)
  })
}

export {
  checkUpdate
}
