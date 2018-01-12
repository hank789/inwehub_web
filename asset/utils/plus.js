import router from '../modules/index/routers/index'

function dowloadFile (uri, path, callback) {
  window.mui.plusReady(() => {
    console.log('download:' + uri)

    function download () {
      // 重新下载
      var downLoader = window.plus.downloader.createDownload(uri, {
        filename: path
      }, function (download, status) {
        var fileName = download.filename
        var newurl = window.plus.io.convertLocalFileSystemURL(fileName)
        window.plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
          var newurl = entry.toRemoteURL()
          console.log('已下载到:' + newurl)
          callback(newurl)
        })
      })
      downLoader.start()
    }

    // 目标文件已存在的进行删除
    window.plus.io.resolveLocalFileSystemURL(path, function (entry) {
      entry.remove(function (entry) {
        console.log('文件删除成功:' + path)
        download()
      }, function (e) {
        console.log('文件删除失败:' + path)
        download()
      })
    }, function (e) {
      console.log('图片不存在,联网下载:')
      download()
    })
  })
}

function getLocalUrl (path, callback) {
  window.mui.plusReady(() => {
    var newurl = window.plus.io.convertLocalFileSystemURL(path)
    if (window.mui.os.ios) {
      newurl = 'file://' + newurl
    }
    window.plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
      var newurl = entry.toRemoteURL()
      callback(newurl)
    })
  })
}

function saveImageByBase64 (base64, dest, callback) {
  window.mui.plusReady(() => {
    var b = new window.plus.nativeObj.Bitmap()
    b.loadBase64Data(base64, function () {
      console.log('创建成功')
    }, function () {
      console.log('创建失败')
    })
    b.save(dest, {
      overwrite: true,
      quality: 100
    }, () => {
      console.log('保存成功')
      if (callback) {
        getLocalUrl(dest, (url) => {
          callback(url)
        })
      }
    }, () => {
      console.log('保存失败')
    })
  })
}

function createImageThumb (path, dest, callback) {
  window.mui.plusReady(() => {
    window.plus.zip.compressImage({
      src: path,
      dst: dest,
      overwrite: true,
      width: '100px',
      quality: 20},
      function (event) {
        var newurl = window.plus.io.convertLocalFileSystemURL(event.target)
        if (window.mui.os.ios) {
          newurl = 'file://' + newurl
        }

        window.plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
          var localUrl = entry.toRemoteURL()
          callback(localUrl)
        }, function (error) {
          alert(error.message)
        })
      }, function (error) {
        alert('Compress error!' + error.message)
      })
  })
}

/**
 * 获取geo位置
 */
function getGeoPosition (callback, failCallback) {
  window.mui.plusReady(() => {
    console.log('准备获取位置信息')
    window.plus.geolocation.getCurrentPosition((position) => {
      var codns = position.coords
      var info = {
        coordsType: position.coordsType, // 坐标类型
        addresses: position.addresses, // 地址信息
        longt: codns.longitude, // 经度
        lat: codns.latitude // 纬度
      }
      console.log('获取到定位信息: ' + JSON.stringify(info))
      callback(info)
    }, (e) => {
      console.log('获取位置信息失败: ' + JSON.stringify(e))
      if (failCallback) {
        failCallback(e.message)
      }
    }, {geocode: true, provider: 'baidu', coordsType: 'bd09ll'})
  })
}

/**
 * 自动调整文本框位置
 */
function autoTextArea () {
  if (window.mui.os.ios) {
    window.mui.plusReady(() => {
      window.plus.webview.currentWebview().setStyle({
        softinputMode: 'adjustResize'
      })
    })
  } else {
    window.mui.plusReady(() => {
      window.plus.webview.currentWebview().setStyle({
        softinputMode: 'adjustResize'
      })
    })
  }
}

/**
 * 获取index.html路径
 */
function getIndexPath () {
  if (window.isLocalEnv && process.env.NODE_ENV === 'development') {
    return 'index.html'
  } else {
    return '/public/index.html'
  }
}

/**
 * 打开第三方网址
 */
function openVendorUrl (containerDiv) {
  if (!containerDiv.querySelectorAll) {
    return
  }
  var aList = containerDiv.querySelectorAll('.vendorUrl[href^="http"]')
  for (let i = 0; i < aList.length; i++) {
    if (!aList[i].hasAttribute('bindTap')) {
      aList[i].setAttribute('bindTap', 'true')
      aList[i].addEventListener('tap', function (e) {
        var href = this.getAttribute('href')
        console.log('openVendorUrl : ' + href)
        e.preventDefault()
        e.stopPropagation()
        if (window.plus) {
          console.log('plus 打开')
          router.pushPlus('/webview/vendor/' + encodeURIComponent(href))
        } else {
          console.log('window.open 打开')
          window.open(href)
        }
      }, false)
    }
  }
}

/**
 * 打开app内的网页
 */
function openAppUrl (containerDiv) {
  if (!containerDiv.querySelectorAll) {
    return
  }
  var aList = containerDiv.querySelectorAll('.appUrl')
  for (let i = 0; i < aList.length; i++) {
    if (!aList[i].hasAttribute('bindTap')) {
      aList[i].setAttribute('bindTap', 'true')
      aList[i].addEventListener('tap', function (e) {
        var href = this.getAttribute('href')
        console.log('openAppUrl : ' + href)
        if (href === 'about:blank') {
          return
        }

        href = href.replace('https://m.inwehub.com/#', '')

        e.preventDefault()
        e.stopPropagation()
        if (window.plus) {
          console.log('plus 打开')
          router.pushPlus(href)
        } else {
          console.log('router 打开')
          router.push(href)
        }
      }, false)
    }
  }
}

/**
 * 关闭启动画面
 */
function closeSplashscreen () {
  if (window.plus) {
    console.log('closeSplashscreen')
    window.plus.navigator.closeSplashscreen()
  }
}

/**
 * 开启全屏模式
 */
function openFullscreen () {
  window.mui.plusReady(function () {
    window.plus.navigator.setFullscreen(true)
  })
}

/**
 * 关闭全屏模式
 */
function closeFullscreen () {
  window.mui.plusReady(function () {
    window.plus.navigator.setFullscreen(false)
  })
}

/**
 * 软键盘自动弹出
 */
function softInput () {
  window.mui.plusReady(function () {
    if (window.mui.os.android) {
      // var main = window.plus.android.runtimeMainActivity()
      // var Context = window.plus.android.importClass('android.content.Context')
      // var InputMethodManager = window.plus.android.importClass('android.view.inputmethod.InputMethodManager')
      // var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE)
      // imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED)
    } else {
      var nativeWebview = window.plus.webview.currentWebview().nativeInstanceObject()
      nativeWebview.plusCallMethod({
        'setKeyboardDisplayRequiresUserAction': false
      })
    }
  })
}

/**
 * 获取剪切板内容
 * @returns {*|string}
 */
function getClipbordText () {
  if (!window.plus) return

  var value = ''

  if (window.mui.os.android) {
    var Context = window.plus.android.importClass('android.content.Context')
    var main = window.plus.android.runtimeMainActivity()
    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
    value = window.plus.android.invoke(clip, 'getText')
  } else {
    var UIPasteboard = window.plus.ios.importClass('UIPasteboard')
    var generalPasteboard = UIPasteboard.generalPasteboard()
    // 设置/获取文本内容:
    // generalPasteboard.setValueforPasteboardType("testValue", "public.utf8-plain-text");
    // TODO 应用在后台的时候获取剪切版数据被系统限制了，只有在app内才能访问接口
    value = generalPasteboard.plusCallMethod({valueForPasteboardType: 'public.utf8-plain-text'})
  }

  console.log('剪切板数据：' + value)
  return value || ''
}

/**
 * 检查定位权限
 */
function checkPermission (type, successCallback, failCallback) {
  if (!window.plus) return

  var permissionName = ''
  switch (type) {
    case 'LOCATION':
      permissionName = 'LOCATION'
      break
    case 'NOTIFITION':
      permissionName = 'NOTIFITION'
      break
    default:
      throw new Error('checkPermission type 不支持')
  }

  if (window.mui.os.ios) {
    var permission = window.plus.navigator.checkPermission(permissionName)
    console.log('permissionQueryResult type:' + type + ' , permission:' + permission)
    switch (permission) {
      case 'authorized':
        successCallback(permission)
        break
      default:
        failCallback(permission)
        break
    }
  }
}

/**
 * 跳转到系统位置设置信息页
 */
function toSettingSystem (type) {
  if (!window.plus) return

  if (window.mui.os.ios) {
    window.plus.runtime.openURL('app-settings:')
  } else if (window.mui.os.android) {
    var main = window.plus.android.runtimeMainActivity() // 获取activity
    var Intent = window.plus.android.importClass('android.content.Intent')
    var Settings = window.plus.android.importClass('android.provider.Settings')

    var intent = null
    switch (type) {
      case 'LOCATION':
        intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
        break
      case 'NOTIFITION':
        intent = new Intent(Settings.ACTION_APPLICATION_SETTINGS)
        break
      default:
        throw new Error('toSettingSystem type 不支持')
    }

    main.startActivity(intent)
  }
}

export {
  dowloadFile,
  getLocalUrl,
  createImageThumb,
  saveImageByBase64,
  getGeoPosition,
  autoTextArea,
  getIndexPath,
  openVendorUrl,
  closeSplashscreen,
  openFullscreen,
  closeFullscreen,
  softInput,
  openAppUrl,
  getClipbordText,
  toSettingSystem,
  checkPermission
}
