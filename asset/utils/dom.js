/**
 * 查询父元素中class中有classname的元素
 * @param obj
 * @param classname
 */
function queryParent (el, classname) {
  if (!el) {
    return
  }

  if (el.nodeName === 'body') {
    return
  }

  if (el.nodeName !== 'svg' && el.nodeName !== 'use' && el.nodeName !== 'path' && el.className !== undefined) {
    if (el.className.match(classname)) {
      return el
    } else {
      return queryParent(el.parentElement, classname)
    }
  } else {
    return queryParent(el.parentElement, classname)
  }
}

/**
 * 文本转链接
 */
function textToLink (domEle) {
  var text = domEle.innerHTML
  console.log('textToLink html:' + text)

  if (/vendorUrl/gi.test(text)) {
    return text
  }
  var re = /[^"'](https?:\/\/[^\s<]+)/g
  text = text.replace(re, " <span target='_blank' class='vendorUrl text-content' href='$1'>$1</span>")

  re = /<p>(https?:\/\/[^\s<]+)/g
  text = text.replace(re, "<p><span target='_blank' class='vendorUrl text-content' href='$1'>$1</span>")

  re = /^(https?:\/\/[^\s<]+)/
  text = text.replace(re, "<p><span target='_blank' class='vendorUrl text-content' href='$1'>$1</span>")

  console.log('textToLink html2:' + text)
  domEle.innerHTML = text
}

function textToLinkHtml (text) {
  if (!text) {
    return text
  }

  if (/vendorUrl/gi.test(text)) {
    return text
  }

  var re = /\[(.*?)\]\((.*?)\)/g
  text = text.replace(re, '<span target="_blank" class="vendorUrl text-content visualLink" href="$2">链接：$1</span>')

  re = /([^"'])(https?:\/\/[^\s<]+)/g
  text = text.replace(re, "$1 <span target='_blank' class='vendorUrl text-content' href='$2'>$2</span>")

  re = /<p>(https?:\/\/[^\s<]+)/g
  text = text.replace(re, "<p><span target='_blank' class='vendorUrl text-content' href='$1'>$1</span>")

  re = /^(https?:\/\/[^\s<]+)/
  text = text.replace(re, "<p><span target='_blank' class='vendorUrl text-content' href='$1'>$1</span>")
  // 进行正则匹配 和 替换
  // console.error(text)
  // 'ldfjsldfj(dsfasjfj3124123)'.match(/\((.+)\)/g);
  // console.log(RegExp.$1); // dsfasjfj3124123
  return text
}

function secureHtml (html) {
  if (typeof (html) !== 'string') {
    return ''
  }
  html = html.replace(/<\/?p>/g, '')
  html = html.replace(/<br>/g, '')
  return html
}

function stripTags (text) {
  return text.replace(/<[^>]+>/g, '')
}

function addPreviewAttrForImg (html, group = '1') {
  if (/data-preview-src/gi.test(html)) {
    return html
  }

  var re = /<img(.*?)src="([^"]*?)"/g
  html = html.replace(re, "<img $1 data-preview-src='$2' data-preview-group='" + group + "' src='$2'")
  return html
}

function autoBlur () {
  if (document.activeElement) {
    document.activeElement.blur()
  }
}

function transferTagToLink (html) {
  var href = 'https://m.inwehub.com/#/tag/detail/#inwehub-tag#$2#inwehub-tag#/questions'
  html = html.replace(/<span class="ql-size-small" ([^>]+)>#([^<]+)\s<\/span>/g, '<span class="ql-size-small appUrl" href="' + href + '" $1>#$2 </span>')

  html = html.replace(/<span class="ql-size-small appUrl" ([^>]+)>#([^<]+)\s<\/span>/g, '<span class="ql-size-small appUrl" href="' + href + '" $1>#$2 </span>')

  var matches = html.match(/#inwehub-tag#(.*?)#inwehub-tag#/g)
  if (matches) {
    for (var i in matches) {
      var tag = matches[i].replace(/#inwehub-tag#/g, '')
      tag = encodeURIComponent(tag)
      html = html.replace(matches[i], tag)
    }
  }

  return html
}

function dragDownElement (elem, callback) {
  var startY
  var moveY
  var scrollTop

  // var div = document.createElement('div')
  // div.style.position = 'absolute'
  // div.style.width = '100%'

  var oldTop = elem.style.top

  elem.addEventListener('touchstart', (e) => {
    var touch = e.touches[0]
    startY = touch.pageY
    scrollTop = elem.scrollTop
    // div.style.top = 0
  })

  elem.addEventListener('touchmove', function (e) {
    e.stopPropagation()
    var touch = e.touches[0]
    moveY = touch.pageY - startY

    if (moveY > 0 && moveY < 100 && scrollTop === 0) {
      e.preventDefault()
      elem.style.top = moveY + 'px'
    }
  }, true)

  elem.addEventListener('touchend', (e) => {
    if (moveY > 100 && scrollTop === 0) {
      elem.style.top = oldTop
      callback(moveY + ':' + scrollTop)
      moveY = 0
    }
  })
}

function setRemUnit () {
  var docEl = document.documentElement
  var rem = docEl.clientWidth / 10
  if (rem > 41.4) {
    rem = 41.4
  }
  docEl.style.fontSize = rem + 'px'
  var dpr = window.devicePixelRatio || 1
  document.body.classList.add('w' + docEl.clientWidth + '-' + dpr)
}

/**
 * 设置rem
 */
function initDocRem () {
  setRemUnit()
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })
}

/**
 * 滑动页面
 *
 * toUp --- 手指上滑触发
 * toUpEnd --- 手指上滑到底部
 * toDown --- 手指下滑
 * toDownEnd --- 手指下滑到顶部
 */
function scrollPage (element, toUp, toUpEnd, toDown, toDownEnd) {
  var prevTop = 0
  var container = document.querySelector(element)

  container.addEventListener('scroll', function (e) {
    console.log('top:' + container.scrollTop + ', clientHeight:' + container.clientHeight + ', scrollHeight:' + container.scrollHeight)

    if (container.scrollTop > prevTop) {
      prevTop = container.scrollTop

      // 手指上滑
      if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
        // 页面已到底部
        if (toUpEnd) { toUpEnd(container) }
      } else {
        if (toUp) { toUp(container) }
      }
    } else if (container.scrollTop < prevTop) {
      prevTop = container.scrollTop

      // 手指下滑
      if (container.scrollTop === 0) {
        // 页面已到顶部
        if (toDownEnd) { toDownEnd(container) }
      } else {
        if (toDown) { toDown(container) }
      }
    }
  })
}

function scrollDetailPage () {
  var menuFooter = document.querySelector('.container-menuFooter').classList
  scrollPage('.mui-content', () => {
    menuFooter.remove('showFooter')
    menuFooter.add('hideFooter')
    document.querySelector('.mui-content').style.bottom = '0'
  }, (height) => {
    menuFooter.remove('hideFooter')
    menuFooter.add('showFooter')
    document.querySelector('.mui-content').style.bottom = '50px'
    document.querySelector('.mui-content').scrollTop = height
  }, () => {
    document.querySelector('.mui-content').style.bottom = '50px'
    menuFooter.remove('hideFooter')
    menuFooter.add('showFooter')
  })
}

/**
* 滚动到指定元素
*/
function scrollToElement (context, selector, parentSelector) {
  var destEle = context.$el.querySelector(selector)
  if (!destEle) return
  var scrollTop = context.$el.querySelector(selector).offsetTop
  console.log('scrollToElement-scrollTop:' + scrollTop)
  setTimeout(function () {
    context.$el.querySelector(parentSelector).scrollTop = scrollTop
  }, 20)
}

var doSomethingTimer = null
var doSometing = (callback, timeout = 1000) => {
  if (doSomethingTimer) {
    clearTimeout(doSomethingTimer)
  }

  doSomethingTimer = setTimeout(() => {
    callback()
  }, timeout)
}

var ainimationProgress = (callback, compareCallback) => {
  var result = compareCallback()
  if (!result) {
    setTimeout(ainimationProgress(callback, compareCallback), 100)
  }
}

export {
  queryParent,
  textToLink,
  textToLinkHtml,
  stripTags,
  addPreviewAttrForImg,
  secureHtml,
  autoBlur,
  transferTagToLink,
  dragDownElement,
  initDocRem,
  scrollPage,
  doSometing,
  ainimationProgress,
  scrollDetailPage,
  scrollToElement
}

