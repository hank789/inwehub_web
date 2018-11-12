import router from '../modules/index/routers/index'
import { goBack, getPrevWebview } from './webview'
import { setIncBadgeNumber, noticeHandler } from './notice'
import { saveLocationInfo, checkClipbord } from './allPlatform'
import localEvent from '../stores/localStorage'
import EventObj from './event'
import { apiRequest } from './request'
import { checkUpdate } from './updateVersion'

function dowloadFile (uri, path, callback) {
  window.mui.plusReady(() => {
    console.log('dowloadFile uri:' + uri)

    function download (uri) {
      console.log('dowload uri:' + uri)

      // 重新下载
      var downLoader = window.plus.downloader.createDownload(uri, {
        filename: path
      }, function (download, status) {
        console.log('download finished status:' + status + ', filename:' + download.filename)
        var fileName = download.filename

        if (window.mui.os.android) {
          fileName = window.plus.io.convertLocalFileSystemURL(fileName)
        }

        console.log('download newurl:' + fileName)
        window.plus.io.resolveLocalFileSystemURL(fileName, function (entry) {
          var newurl = entry.toRemoteURL()
          console.log('已下载到:' + newurl)
          callback(newurl)
        }, function (e) {
          callback(fileName)
          console.log('已下载到:' + fileName)
          console.log('Resolve file URL failed:' + JSON.stringify(e))
        })
      })
      downLoader.start()
    }

    // 目标文件已存在的进行删除
    window.plus.io.resolveLocalFileSystemURL(path, function (entry) {
      entry.remove(function (entry) {
        console.log('文件删除成功:' + path)
        download(uri)
      }, function (e) {
        console.log('文件删除失败:' + path)
        download(uri)
      })
    }, function (e) {
      console.log('图片不存在,联网下载:')
      download(uri)
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

function saveImageByBase64 (base64, dest, successCallback, faillCallback) {
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
      if (successCallback) {
        getLocalUrl(dest, (url) => {
          successCallback(url)
        })
      }
    }, () => {
      faillCallback()
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
  if (process.env.NODE_ENV === 'development') {
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
        if (/https:\/\/m\.inwehub\.com/.test(href)) {
          openAppUrlByUrl(href)
        } else {
          openVendorUrlByUrl(href)
        }
      }, false)
    }
  }
}

function openVendorUrlByUrl (url, title = '') {
  var href = url
  if (window.plus) {
    console.log('plus 打开')
    if (title) {
      title = encodeURIComponent(title)
    }
    router.pushPlus('/webview/vendor/' + encodeURIComponent(href) + '/' + title, 'backAndClose')
  } else {
    console.log('window.open 打开')
    window.open(href)
  }
}

function openFileUrl (url, title = '') {
  var href = url
  if (window.plus) {
    console.log('plus 打开')
    if (title) {
      title = encodeURIComponent(title)
    }
    if (window.mui.os.ios) {
      router.pushPlus('/webview/vendor/' + encodeURIComponent(href) + '/' + title, 'backAndClose')
    } else {
      window.plus.runtime.openURL(url)
    }
  } else {
    console.log('window.open 打开')
    window.open(href)
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
        e.preventDefault()
        e.stopPropagation()
        openAppUrlByUrl(href)
      }, false)
    }
  }
}

function openAppUrlByUrl (url) {
  var href = url
  if (href === 'about:blank') {
    return
  }
  href = href.replace(process.env.H5_ROOT + '/#', '')
  href = href.replace('https://m.inwehub.com/#', '')
  if (window.plus) {
    console.log('plus 打开')
    router.pushPlus(href)
  } else {
    console.log('router 打开')
    router.push(href)
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
    value = generalPasteboard.plusCallMethod({valueForPasteboardType: 'public.utf8-plain-text'})
  }

  console.log('剪切板数据：' + value)
  return value || ''
}

/**
 * 设置剪切板内容
 */
function setClipboardText (text) {
  if (!window.plus) return

  if (window.mui.os.android) {
    var Context = window.plus.android.importClass('android.content.Context')
    var main = window.plus.android.runtimeMainActivity()
    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
    window.plus.android.invoke(clip, 'setText', text)
  } else if (window.mui.os.ios) {
    var UIPasteboard = window.plus.ios.importClass('UIPasteboard')
    var generalPasteboard = UIPasteboard.generalPasteboard()
    generalPasteboard.setValueforPasteboardType(text, 'public.utf8-plain-text')
  }
}

/**
 * 检查权限
 */
function checkPermission (type, successCallback, failCallback) {
  if (!window.mui.os.plus) {
    failCallback()
    return
  }

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
  } else if (window.mui.os.android) {
    successCallback(permissionName)
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
      case 'Contact':
        intent = new Intent(Settings.ACTION_SETTINGS)
        break
      default:
        throw new Error('toSettingSystem type 不支持')
    }

    main.startActivity(intent)
  }
}

/**
 * 设置当前webivew最新url到additionalHttpHeaders
 */
function setWebviewNewUrl () {
  if (!window.plus || window.mui.os.android) return
  window.mui.plusReady(function () {
    var currentWebview = window.plus.webview.currentWebview()
    var index = window.location.href.indexOf('#')
    if (index !== -1) {
      var url = window.location.href.slice(index + 1)
      console.log('bindCurrentUrl:' + url)
      currentWebview.setStyle({
        additionalHttpHeaders: {
          url: url
        }
      })
    }
  })
}

function getWebviewNewUrl () {
  var index = window.location.href.indexOf('#')
  if (index !== -1) {
    var url = window.location.href.slice(index + 1)
    return url
  }
  return false
}

/**
 * 打开webview下拉刷新功能
 */
function openWebviewRefresh (callback) {
  if (!window.plus) return
  console.log('openWebviewRefresh() fired')

  var ws = window.plus.webview.currentWebview()
  ws.setPullToRefresh({
    support: true,
    style: 'circle',
    height: '50px',
    range: '50px',
    contentdown: {
      caption: '下拉可以刷新'
    },
    contentover: {
      caption: '释放立即刷新'
    },
    contentrefresh: {
      caption: '正在刷新...'
    }
  }, () => {
    console.log('openWebviewRefresh() event fired')
    setTimeout(() => {
      ws.endPullToRefresh()
    }, 1000)
    callback()
  })
}

/**
 * app,webview新打开的页面都运行一次的代码
 * @param context
 * @constructor
 */
function AppPageInit (context) {
  console.log('AppPageInit(context) fired')
  AppInit(context)

  window.mui.plusReady(function () {
    window.mui.init({
      swipeBack: true, // 启用右滑关闭功能
      beforeback: goBack
    })

    lockOrientation('portrait-primary')

    if (window.mui.os.plus && window.mui.os.ios) {
      // 预加载页面
      var listPageWebview = window.mui.preload({
        url: process.env.NODE_ENV === 'development' ? 'index.html#/home' : '/public/index.html#/home',
        id: 'list-page',
        styles: {
          popGesture: 'hide'
        },
        extras: {preload: true, custom_preload: true}
      })
      listPageWebview.addEventListener('popGesture', (e) => {
        console.log('run in event popGesture')
        if (e.type === 'end' && e.result === true) {
          var parentWebview = getPrevWebview() // self.opener()
          if (parentWebview) {
            console.log('calledEvent: popGesture：' + parentWebview.id)

            // 触发父页面的自定义事件(refresh),从而进行刷新
            window.mui.fire(parentWebview, 'refreshData', {childId: 'list-page'})
            // 刷新当前页数据
            // window.mui.fire(self, 'refreshData', {parentId: parentWebview.id})

            // 触发父页面的自定义事件(refresh),从而进行刷新
            window.mui.fire(parentWebview, 'refreshPageData', {childId: 'list-page', type: 'back'})
            // 刷新当前页数据
            // window.mui.fire(self, 'refreshPageData', {parentId: parentWebview.id})

            window.mui.fire(parentWebview, 'autoHeight', {childId: 'list-page'})
          }
        }
      }, false)
      // 监听自定义事件，前往页面
      document.addEventListener('go_to_target_page', (event) => {
        var url = event.detail.url
        console.log('go_to_target_page:' + url)

        var ws = window.plus.webview.currentWebview()
        var currentUrl = getWebviewNewUrl()
        console.log('go_to_target_page currentUrl:' + currentUrl + ', url:' + url)

        router.replace(url, () => {
          window.mui.fire(ws, 'autoHeight', true)
          if (currentUrl === url || (currentUrl === '/home' && url === '/home?refresh=1')) {
            window.mui.fire(ws, 'refreshPageData', {type: 'forward'})
          }
          ws.setContentVisible(true)
          setWebviewNewUrl()
        }, () => {
          window.mui.fire(ws, 'autoHeight', true)
          if (currentUrl === url) {
            window.mui.fire(ws, 'refreshPageData', {type: 'forward'})
          }
          ws.setContentVisible(true)
          setWebviewNewUrl()
        })
      })
    }
  })
}

/**
 * 打开app运行一次的代码
 * @constructor
 */
function AppInit (context) {
  window.mui.plusReady(function () {
    console.log('AppInit(context) fired')

    if (window.mui.os.plus) {
      var ws = window.plus.webview.currentWebview()

      /* 只在主页面监听一次 */
      if (ws.id === window.plus.runtime.appid) {
        /* 应用从后台切换回前台事件 */
        EventObj.addIntervalOnceEventListener('resume', () => {
          // 剪贴板
          checkClipbord()

          // 存储用户位置信息
          var currentUser = localEvent.getLocalItem('UserInfo')
          if (currentUser.user_id) {
            saveLocationInfo()
          }
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:app:resume',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': 'resume',
                'page_name': 'resume',
                'page_title': 'app唤起',
                'referrer_page': ''
              }
            )
          }

          // 检查版本更新
          checkUpdate()

          var routerFullPath = context.$router.currentRoute.fullPath
          console.log('routerFullPath:' + routerFullPath)
          if (routerFullPath === '/ad') {
            return
          }

          // 每日签到
          // userAbility.signIGift(context)

          if (window.mui.os.ios) {
            // noticeOpenNotifitionPermission(context)
          }
        })

        // 监听执行刷新
        EventObj.addEventListener('refreshData', (e) => {
          if (context.$parent.$refs.Footer && context.$parent.$refs.Footer.showBottom) {
            if (context.$parent.$refs.routerView.hasOwnProperty('initData')) {
              console.log('refreshDataApp')
              context.$parent.$refs.routerView.initData()
            }
          }
        })

        // 存储设备信息
        let currentUserInfo = localEvent.getLocalItem('UserInfo')
        if (currentUserInfo.user_id) {
          var deviceInfo = window.plus.push.getClientInfo()
          apiRequest(`system/device`, {
            client_id: deviceInfo.clientid,
            device_token: deviceInfo.token,
            appid: deviceInfo.appid,
            appkey: deviceInfo.appkey,
            device_type: window.plus.os.name === 'iOS' ? 2 : 1
          }, false).then(res => {

          })
        }

        // 监听点击消息事件
        window.plus.push.addEventListener('click', (msg) => {
          console.log('监听点击消息事件:' + JSON.stringify(msg))

          if (msg.type !== 'click') {
            return
          }

          // 判断是从本地创建还是离线推送的消息
          switch (msg.payload) {
            case 'LocalMSG':
              console.log('点击本地创建消息启动：')
              break
            default:
              console.log(msg)
              break
          }

          // 提示点击的内容
          if (msg.payload) {
            // plus.nativeUI.alert( "click:payload(JSON): "+JSON.stringify(msg.payload) )
            var payload = ''
            if (window.mui.os.ios) {
              payload = msg.payload
            } else {
              payload = JSON.parse(msg.payload)
            }

            noticeHandler(context, payload)
          }
        }, false)

        // 监听在线消息事件
        window.plus.push.addEventListener('receive', (msg) => {
          if (msg.aps) {  // Apple APNS message
            console.log('接收到在线APNS消息：')
          } else {
            console.log('接收到在线透传消息：')
          }
          if (msg.payload) {
            // plus.nativeUI.alert( "receive:payload: "+JSON.stringify(msg.payload) );
            var payload = ''
            if (window.mui.os.ios) {
              payload = msg.payload.payload
            } else {
              payload = JSON.parse(msg.payload)
            }
            setIncBadgeNumber()

            console.log('接收到通知:' + payload.title)
            // 以下信息如果当前用户在页面上旧不通知了
            switch (payload.object_type) {
              case 'im_group_message':
                // 群聊信息
                return
            }
            context.$parent.$refs.MessageComponent.show(payload.title, () => {
              noticeHandler(context, payload)
            })
          }
        }, false)
      }
    }
  })
}

/**
 * 锁定屏幕方向
 * @param orientation
 */
function lockOrientation (orientation) {
  window.mui.plusReady(function () {
    window.plus.screen.lockOrientation(orientation)
  })
}

function openUrlByUrl (href) {
  if (href.indexOf(process.env.H5_ROOT) >= 0) {
    openAppUrlByUrl(href)
  } else {
    openVendorUrlByUrl(href)
  }
}

/**
 * 获取手机联系人
 */
function getContacts (successCallback, failCallback) {
  window.mui.plusReady(function () {
    window.plus.contacts.getAddressBook(window.plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
      addressbook.find(null, function (contacts) {
        if (window.mui.os.android && contacts.length === 0) {
          console.error('addressbook.find failed: 数据为空')
          failCallback()
        } else {
          console.log('getContacts Success:' + JSON.stringify({contacts: contacts}))
          successCallback(contacts)
        }
      }, function (e) {
        failCallback(e)
        console.error('addressbook.find failed:' + e.message)
      }, {multiple: true})
    }, function (e) {
      failCallback(e)
      console.error('Get address book failed:' + e.message)
    })
  })
}

/**
 * 下载图片
 * @param imgUrl
 * @param savePath
 * @param callback
 */
function downloadImg (imgUrl, savePath, callback) {
  window.mui.plusReady(function () {
    var downloadTask = window.plus.downloader.createDownload(imgUrl, {
      filename: savePath
    }, function (download, status) {
      if (status !== 200) {
        console.log('下载失败,status' + status)
        if (savePath !== null) {
          window.plus.io.resolveLocalFileSystemURL(savePath, function (entry) {
            entry.remove(function (entry) {
              console.log('临时文件删除成功' + savePath)
              // 重新下载图片
              downloadImg(imgUrl, savePath, callback)
            }, function (e) {
              console.log('临时文件删除失败' + savePath)
              downloadImg(imgUrl, savePath, callback)
            })
          })
        }
      } else {
        // 把下载成功的图片显示
        // 将本地URL路径转换成平台绝对路径
        console.log('下载成功:' + savePath)

        if (window.mui.os.android) {
          savePath = window.plus.io.convertLocalFileSystemURL(savePath)
        }

        window.plus.io.resolveLocalFileSystemURL(savePath, function (entry) {
          var newurl = entry.toRemoteURL()
          console.log('已下载到:' + newurl)
          callback(newurl)
        }, function (e) {
          console.log('解析已下载的图片失败:' + JSON.stringify(e))
        })
      }
    })
    downloadTask.start()
  })
}

/**
 * 获取缓存在本地的图片
 * . 仅手机app内有效
 * . 缓存存在 _download/cache/*
 * @param imgUrl
 * @param callback
 */
function getCacheImage (imgUrl, callback) {
  console.log('getCacheImage:url:' + imgUrl)
  if (!imgUrl) {
    return
  }

  if (!window.plus) {
    return imgUrl
  }
  window.mui.plusReady(function () {
    let imageCode = window.btoa(unescape(encodeURIComponent(imgUrl)))
    let localImageUrl = '_doc/cache/image/' + imageCode + '.jpg'

    if (window.mui.os.android) {
      localImageUrl = window.plus.io.convertLocalFileSystemURL(localImageUrl)
    }

    // 判断本地是否存在该文件，存在就就直接使用，否则就下载
    window.plus.io.resolveLocalFileSystemURL(localImageUrl, function (entry) {
      if (entry) {
        var image = entry.toRemoteURL()
        console.log('图片已存在:' + image)
        callback(image)
      } else {
        console.log('图片不存在, 去下载...')
        downloadImg(imgUrl, localImageUrl, callback)
      }
    }, function (e) {
      console.log('图片不存在, 去下载2...')
      downloadImg(imgUrl, localImageUrl, callback)
    })
  })
}

/**
 * 清空图片缓存
 */
function clearImageCache () {
  let localImageUrl = '_doc/cache/image/'
  window.plus.io.resolveLocalFileSystemURL(localImageUrl, function (entry) {
    entry.removeRecursively(function (entry) {
      window.plus.console.log('图片缓存删除成功:')
    }, function (e) {
      window.plus.console.log('图片缓存删除失败:error:' + e.message)
    })
  }, function (e) {
    console.log('目录打开失败:' + localImageUrl + ', error:' + e.message)
  })
}

function needRefresh () {
  localEvent.setLocalItem('needRefresh', {value: true})
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
  checkPermission,
  setWebviewNewUrl,
  getWebviewNewUrl,
  openWebviewRefresh,
  openAppUrlByUrl,
  openVendorUrlByUrl,
  openFileUrl,
  AppInit,
  AppPageInit,
  setClipboardText,
  lockOrientation,
  openUrlByUrl,
  getContacts,
  downloadImg,
  getCacheImage,
  clearImageCache,
  needRefresh
}
