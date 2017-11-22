import { apiRequest } from '../utils/request'
import localEvent from '../stores/localStorage'
import Raven from 'raven-js'

function checkUpdate () {
  if (window.mui.os.plus) {
    // 获取本地应用资源版本号
    window.plus.runtime.getProperty(window.plus.runtime.appid, function (inf) {
      var wgtVer = inf.version
      console.log('当前应用版本：' + wgtVer)
      localEvent.setLocalItem('app_version', {version: wgtVer})
      apiRequest(`system/version`, {app_uuid: window.plus.device.uuid}, false).then(responseData => {
        if (responseData !== false) {
          var appVersion = responseData.app_version
          if (appVersion && wgtVer < appVersion) {
            var packageUrl = responseData.package_url
            var isIosForce = responseData.is_ios_force
            var isAndroidForce = responseData.is_android_force
            // 如果是强更
            if (isIosForce === 1 && window.mui.os.ios) {
              window.mui.alert('有新的版本升级')
              window.plus.runtime.openURL(responseData.ios_force_update_url)
            } else if (isAndroidForce === 1 && window.mui.os.android) {
              window.mui.alert('有新的版本升级')
              // market://details?id=io.dcloud.HelloMUI
              window.plus.runtime.openURL(responseData.android_force_update_url, function (e) {
                window.plus.nativeUI.confirm('很抱歉，您未安装腾讯应用宝，请安装后再更新', function (i) {
                  if (i.index === 0) {
                    window.plus.runtime.openURL('market://details?id=com.tencent.android.qqdownloader')
                  } else if (i.index === 1) {
                    window.plus.runtime.quit()
                  } else {
                    window.plus.runtime.quit()
                  }
                }, inf.title, ['立即下载', '暂不下载', '取消'])
              }, 'com.tencent.android.qqdownloader')
            } else if ((isIosForce === 2 && window.mui.os.ios) || (isAndroidForce === 2 && window.mui.os.android)) {
              // 什么都不做
            } else {
              // 下载升级包
              downWgt(packageUrl)
            }
          }
        }
      })
    })
  }
}

function downWgt (wgtUrl) {
  window.plus.nativeUI.showWaiting('有新版本更新')
  window.plus.downloader.createDownload(wgtUrl, {filename: '_doc/update/'}, function (d, status) {
    if (status === 200) {
      installWgt(d.filename) // 安装wgt包
    } else {
      window.plus.nativeUI.alert('下载更新文件失败:' + status)
    }
    window.plus.nativeUI.closeWaiting()
  }).start()
}

// 更新应用资源
function installWgt (path) {
  window.plus.nativeUI.showWaiting()
  window.plus.runtime.install(path, {}, function () {
    window.plus.nativeUI.closeWaiting()
    console.log('安装wgt文件成功！')
    removeFile(path)
    var wvs = window.plus.webview.all()
    for (var i = 0; i < wvs.length; i++) {
      if (wvs[i].id !== window.plus.runtime.appid) wvs[i].close()
    }
    window.plus.runtime.restart()
  }, function (e) {
    window.plus.nativeUI.closeWaiting()
    removeFile(path)
    // console.log("安装wgt文件失败["+e.code+"]："+e.message);
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
