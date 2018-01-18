window.dialogQueue = []

/**
 * 是否已有弹窗
 */
function isHaveAlert (callback) {
  var alert = document.querySelector('.mui-popup-in')
  if (alert) {
    // 已有弹窗，推入队
    window.dialogQueue.push(callback)
    return true
  }
  return false
}

/**
 * 继续弹窗
 */
function continueAlert () {
  if (window.dialogQueue.length) {
    var callback = window.dialogQueue.shift()
    console.log(callback)
    if (callback) {
      callback()
    }
  }
}

/**
 * 包裹callback
 * @param param
 * @param callback
 * @returns {newcallback}
 */
function wrapperCallback(callback) {
  var newcallback = function (param) {
    callback(param)
    setTimeout(() => {
      continueAlert()
    }, 1000)
  }
  return newcallback
}

/**
 * 拿着放大镜的小蛤弹窗(如升级提示弹窗)
 * 确定class .alertConfirm   .alertConfirm  callback(index, value)
 */
function alertZoom (contentHtml = '<btn class="alertConfirm"></btn>', callback = null, close = true, className = '') {
  // queue start
  var newcallback = wrapperCallback(callback)
  var isHasAlert = isHaveAlert(() => {
    alertZoom(contentHtml, newcallback, close, className)
  })
  if (isHasAlert) {
    return
  }
  // queue end

  var alertObj = window.mui.alert(contentHtml, ' ', null, newcallback, 'div')
  window.mui('.mui-popup-in')[0].style.display = 'none'
  window.mui('.mui-popup-in')[0].classList.add('alertZoom')
  if (className) {
    window.mui('.mui-popup-in')[0].classList.add(className)
  }

  var titlePre = document.createElement('div')
  titlePre.className = 'titlePre'
  window.mui('.mui-popup-in')[0].insertBefore(titlePre, window.mui('.mui-popup-in')[0].firstChild)

  var titlePre2 = document.createElement('div')
  titlePre2.className = 'titlePre2'
  window.mui('.mui-popup-in')[0].insertBefore(titlePre2, window.mui('.mui-popup-in')[0].firstChild)

  setTimeout(() => {
    window.mui('.mui-popup-in')[0].style.display = ''
  }, 100)

  if (close) {
    var closeDiv = document.createElement('div')
    closeDiv.className = 'alertClose'
    closeDiv.innerHTML = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-guanbi"></use></svg>'
    window.mui('.mui-popup-in')[0].insertBefore(closeDiv, window.mui('.mui-popup-in')[0].firstChild)

    setTimeout(() => {
      closeDiv.onclick = () => {
        alertObj.close(-1, '')
      }
    }, 100)
  }

  var alertConfirms = alertObj.element.querySelectorAll('.alertConfirm')
  if (alertConfirms.length) {
    for (var i = 0; i < alertConfirms.length; i++) {
      (function (index) {
        alertConfirms[index].onclick = function () {
          alertObj.close(index, '')
        }
      })(i)
    }
  }
}

function getDialogObj (context) {
  if (typeof context !== 'undefined') {
    var parentObj = context.$parent

    if (typeof parentObj !== 'undefined') {
      if (parentObj.$refs.inwehubDialog) {
        return parentObj.$refs.inwehubDialog
      } else if (typeof parentObj.$parent !== 'undefined' && parentObj.$parent.$refs.inwehubDialog) {
        return parentObj.$parent.$refs.inwehubDialog
      } else if (typeof context.$refs.inwehubDialog !== 'undefined') {
        return context.$refs.inwehubDialog
      }
    } else {
      return context.$refs.inwehubDialog
    }
  }
  return false
}

/**
 * 带问号的
 * 确定class .alertConfirm
 */
function alertSky (titleHtml, contentHtml = '', iconType = '', callback = null, close = true, classname = 'alertSkyTwo') {
  // queue start
  var newcallback = wrapperCallback(callback)
  var isHasAlert = isHaveAlert(() => {
    alertSky(titleHtml, contentHtml, iconType, newcallback, close, classname)
  })
  if (isHasAlert) {
    return
  }
  // queue end

  var alertObj = window.mui.alert(contentHtml, ' ', null, newcallback, 'div')
  window.mui('.mui-popup-in')[0].style.display = 'none'
  for (var i in classname) {
    window.mui('.mui-popup-in')[0].classList.add(classname[i])
  }

  var titlePre = document.createElement('div')
  titlePre.className = 'titlePre'
  titlePre.innerHTML = titleHtml
  window.mui('.mui-popup-in')[0].insertBefore(titlePre, window.mui('.mui-popup-in')[0].firstChild)

  if (iconType) {
    var titlePreIcon = document.createElement('div')
    titlePreIcon.className = 'titlePreIcon ' + iconType
    titlePreIcon.innerHTML = '<svg class="icon" aria-hidden="true"><use xlink:href="#' + iconType + '"></use></svg>'
    window.mui('.mui-popup-in')[0].insertBefore(titlePreIcon, window.mui('.mui-popup-in')[0].firstChild)
  }

  setTimeout(() => {
    window.mui('.mui-popup-in')[0].style.display = ''
  }, 100)

  if (close) {
    var closeDiv = document.createElement('div')
    closeDiv.className = 'alertClose'
    closeDiv.innerHTML = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-guanbi"></use></svg>'
    window.mui('.mui-popup-in')[0].insertBefore(closeDiv, window.mui('.mui-popup-in')[0].firstChild)

    setTimeout(() => {
      closeDiv.onclick = () => {
        alertObj.close(-1, '')
      }
    }, 100)
  }

  var alertConfirms = alertObj.element.querySelectorAll('.alertConfirm')
  if (alertConfirms.length) {
    for (var ii = 0; ii < alertConfirms.length; ii++) {
      (function (index) {
        alertConfirms[index].onclick = function () {
          alertObj.close(index, '')
        }
      })(ii)
    }
  }
}

/**
 * 云层弹窗-云层内仅有一行文字的弹窗
 * @param titleHtml
 * @param contentHtml
 * @param iconType
 * @param callback
 * @param close
 */
function alertSkyOne (titleHtml = '', contentHtml = '', iconType = '', callback = null, close = true) {
  alertSky(titleHtml, contentHtml, iconType, callback, close, ['alertSkyTwo', 'alertSkyTwo-one'])
}

/**
 * 云层弹窗-云层内仅有两行文字的弹窗
 * @param titleHtml
 * @param contentHtml
 * @param iconType
 * @param callback
 * @param close
 */
function alertSkyTwo (titleHtml = '', contentHtml = '', iconType = '', callback = null, close = true) {
  alertSky(titleHtml, contentHtml, iconType, callback, close, ['alertSkyTwo'])
}

/**
 * 简单弹窗（如:等级不够弹窗）
 * @param contentHtml
 * @param btnString
 * @param callback
 * @param close
 */
function alertSimple (contentHtml = '', btnString = '确定', callback = null, close = true) {
  // queue start
  var newcallback = wrapperCallback(callback)
  var isHasAlert = isHaveAlert(() => {
    alertSimple(contentHtml, btnString, newcallback, close)
  })
  if (isHasAlert) {
    return
  }
  // queue end

  var alertObj = window.mui.alert(contentHtml, ' ', btnString, newcallback, 'div')
  window.mui('.mui-popup-in')[0].style.display = 'none'
  window.mui('.mui-popup-in')[0].classList.add('alertSimple')

  setTimeout(() => {
    window.mui('.mui-popup-in')[0].style.display = ''
  }, 100)

  if (close) {
    var closeDiv = document.createElement('div')
    closeDiv.className = 'alertClose'
    closeDiv.innerHTML = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-guanbi"></use></svg>'
    window.mui('.mui-popup-in')[0].insertBefore(closeDiv, window.mui('.mui-popup-in')[0].firstChild)

    setTimeout(() => {
      var closeCallback = (e) => {
        e.stopPropagation()
        alertObj.close(-1, '')
        closeDiv.removeEventListener('click', closeCallback, false)
      }

      closeDiv.addEventListener('click', closeCallback, false)
    }, 100)
  }
}

/**
 * 按钮class .alertConfirm
 * 关闭class .alertClose
 * callback(index)
 *    index 被按的.alertConfirm的顺序,0开始, -1 表示.alertClose被点击
 * @param html
 * @param callback
 */
function alertHtml (html, callback, wrapperClassName = 'mui-popup mui-popup-in alertHtml') {
  // queue start
  var newcallback = wrapperCallback(callback)
  var isHasAlert = isHaveAlert(() => {
    alertHtml(html, newcallback, wrapperClassName)
  })
  if (isHasAlert) {
    return
  }
  // queue end

  var popupElement = document.createElement('div')
  popupElement.className = wrapperClassName
  popupElement.id = wrapperClassName
  popupElement.innerHTML = html
  document.body.appendChild(popupElement)
  var element = document.createElement('div')
  element.className = 'mui-popup-backdrop mui-active'
  document.body.appendChild(element)
  var alertConfirms = popupElement.querySelectorAll('.alertConfirm')

  var closeAlertHtml = () => {
    popupElement.parentNode && popupElement.parentNode.removeChild(popupElement)
    element.parentNode && element.parentNode.removeChild(element)
  }

  if (alertConfirms.length) {
    for (var i = 0; i < alertConfirms.length; i++) {
      (function (index) {
        alertConfirms[index].onclick = function () {
          var result = newcallback(index)
          if (result) {
            closeAlertHtml()
          }
        }
      })(i)
    }
  }
  var alertCloses = popupElement.querySelectorAll('.alertClose')
  if (alertCloses.length) {
    for (var j = 0; j < alertCloses.length; j++) {
      (function (index) {
        alertCloses[index].onclick = function () {
          newcallback(-1)
          closeAlertHtml()
        }
      })(j)
    }
  }
}

export {
  alertZoom,
  alertSkyOne,
  alertSkyTwo,
  alertSimple,
  getDialogObj,
  alertHtml,
  isHaveAlert
}
