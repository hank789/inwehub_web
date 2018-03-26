import router from '../modules/index/routers/index'
import { goBack, goThirdPartyArticle } from './webview'
import { setIncBadgeNumber } from './notice'
import userAbility from './userAbility'
import { saveLocationInfo, checkClipbord, noticeOpenNotifitionPermission } from './allPlatform'
import localEvent from '../stores/localStorage'
import EventObj from './event'
import { apiRequest } from './request'
import { checkUpdate } from './updateVersion'

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

function openVendorUrlByUrl (url) {
  var href = url
  if (window.plus) {
    console.log('plus 打开')
    router.pushPlus('/webview/vendor/' + encodeURIComponent(href))
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
    // TODO 应用在后台的时候获取剪切版数据被系统限制了，只有在app内才能访问接口
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
 * 检查定位权限
 */
function checkPermission (type, successCallback, failCallback) {
  if (!window.mui.os.plus) return

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
  if (!window.plus) return
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
  window.mui.plusReady(function () {
    window.mui.init({
      swipeBack: true, // 启用右滑关闭功能
      beforeback: goBack
    })

    lockOrientation('portrait-primary')

    if (window.mui.os.plus) {
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
            window.mui.fire(ws, 'refreshPageData', true)
          }
          setWebviewNewUrl()
        }, () => {
          window.mui.fire(ws, 'autoHeight', true)
          if (currentUrl === url) {
            window.mui.fire(ws, 'refreshPageData', true)
          }
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

      // 只在主页面监听一次
      if (ws.id === window.plus.runtime.appid) {
        EventObj.addEventListener('refreshData', (e) => {
          // 执行刷新
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
        // 应用从后台切换回前台事件
        EventObj.addIntervalOnceEventListener('resume', () => {
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
          userAbility.signIGift(context)
          // 剪贴板
          checkClipbord()

          if (window.mui.os.ios) {
            noticeOpenNotifitionPermission(context)
          }
        }, false)

        // 监听推送
        var noticeTo = function (payload) {
          if (window.mixpanel.track) {
            window.mixpanel.track(
              'inwehub:push:click',
              {'app': 'inwehub', 'user_device': window.getUserAppDevice(), 'page': payload.object_id, 'page_name': payload.object_type, 'page_title': '打开推送'}
            )
          }
          switch (payload.object_type) {
            case 'question':
            case 'pay_question_answered':
            case 'question_answer_confirmed':
              // mui.alert('/ask/' + payload.object_id + '?time=' + Date.parse(new Date()));
              // router.go(-1);
              router.pushPlus('/ask/' + payload.object_id + '?time=' + Date.parse(new Date()))
              break
            case 'pay_question_answered_askCommunity':
              router.pushPlus('/askCommunity/major/' + payload.object_id)
              break
            case 'free_question_answered':
              router.pushPlus('/askCommunity/interaction/' + payload.object_id)
              break
            case 'pay_answer':
            case 'answer':
              // router.go(-1);
              // mui.alert('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()))
              router.pushPlus('/answer/' + payload.object_id + '?time=' + Date.parse(new Date()))
              break
            case 'free_answer':
              router.pushPlus('/askCommunity/interaction/answers/' + payload.object_id)
              break
            case 'authentication_success':
              // 专家认证成功
              router.pushPlus('/my?needalert=1')
              break
            case 'authentication_fail':
              // 专家认证失败
              router.pushPlus('/my/pilot')
              break
            case 'company_auth_success':
              // 企业认证成功
              router.pushPlus('/company/my')
              break
            case 'company_auth_fail':
              // 企业认证失败
              router.pushPlus('/company/my')
              break
            case 'notification_money':
              // 资金变动通知
              router.pushPlus('/my/Finance')
              break
            case 'user_following':
              // 用户关注通知
              router.pushPlus('/share/resume/' + payload.object_id + '?goback=1')
              break
            case 'readhub_submission_upvoted':
            case 'readhub_new_submission':
            case 'readhub_comment_replied':
              // 阅读发现评论回复,payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
              router.pushReadHubPage(payload.object_id)
              break
            case 'readhub_submission_replied':
              // 阅读发现文章回复，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
              router.pushReadHubPage(payload.object_id)
              break
            case 'readhub_username_mentioned':
              // 阅读发现@某人，payload.object_id即为url，例如：/c/来吐槽/cszxnrfdf
              router.pushReadHubPage(payload.object_id)
              break
            case 'push_notice_readhub':
              // 推送阅读发现的文章
              if (payload.object) {
                goThirdPartyArticle(
                  payload.object.view_url,
                  payload.object.id,
                  payload.object.title,
                  payload.object.comment_url,
                  payload.object.img_url
                )
              }
              break
            case 'push_notice_app_self':
              // 推送app内页
              router.push(payload.object_id)
              break
            case 'push_notice_article':
              // 推送公告文章
              window.mui.openWindow({
                url: '/public/index.html#/webview/notice',
                id: payload.object_id,
                preload: false, // 一定要为false
                createNew: false,
                show: {
                  autoShow: true,
                  aniShow: 'pop-in'
                },
                styles: {
                  popGesture: 'close'
                },
                waiting: {
                  autoShow: false
                }
              })
              break
            case 'notification_level_up':
              // 用户积分等级提升;
              userAbility.upgradeLevel(context)
              break
            case 'activity_enroll_fail':
            case 'activity_enroll_success':
              // 活动报名事件
              router.pushPlus('/EnrollmentStatus/' + payload.object_id)
              break
            case 'pay_answer_new_comment':
              // 专业回答新的回复
              router.pushPlus('/askCommunity/major/' + payload.object_id)
              break
            case 'free_answer_new_comment':
              // 互动问答新的回复
              router.pushPlus('/askCommunity/interaction/' + payload.object_id)
              break
            case 'pay_answer_new_support':
              // 专业回答赞
              router.pushPlus('/askCommunity/major/' + payload.object_id)
              break
            case 'free_answer_new_support':
              // 专业回答赞
              router.pushPlus('/askCommunity/interaction/' + payload.object_id)
              break
            case 'im_message':
              // 聊天信息
              router.pushPlus('/chat/' + payload.object_id)
              break
            case 'invite_user_register':
              // 邀请用户注册成功
              router.pushPlus('/invitation/friends')
              break
          }
        }

        // 监听点击消息事件
        window.plus.push.addEventListener('click', (msg) => {
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

            noticeTo(payload)
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
            context.$parent.$refs.MessageComponent.show(payload.title, () => {
              noticeTo(payload)
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
  AppInit,
  AppPageInit,
  setClipboardText,
  lockOrientation
}
