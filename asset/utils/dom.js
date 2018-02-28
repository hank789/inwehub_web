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
  // 进行正则匹配 和 替换
}

function textToLinkHtml (text) {
  if (!text) {
    return text
  }

  if (/vendorUrl/gi.test(text)) {
    return text
  }
  var re = /([^"'])(https?:\/\/[^\s<]+)/g
  text = text.replace(re, "$1 <span target='_blank' class='vendorUrl text-content' href='$2'>$2</span>")

  re = /<p>(https?:\/\/[^\s<]+)/g
  text = text.replace(re, "<p><span target='_blank' class='vendorUrl text-content' href='$1'>$1</span>")

  re = /^(https?:\/\/[^\s<]+)/
  text = text.replace(re, "<p><span target='_blank' class='vendorUrl text-content' href='$1'>$1</span>")

  return text
}

function secureHtml (html) {
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
  var href = 'https://m.inwehub.com/#/tag/detail/$2/questions'
  html = html.replace(/<span class="ql-size-small" ([^>]+)>#([^<]+)\s<\/span>/g, '<span class="ql-size-small appUrl" href="' + href + '" $1>#$2 </span>')

  html = html.replace(/<span class="ql-size-small appUrl" ([^>]+)>#([^<]+)\s<\/span>/g, '<span class="ql-size-small appUrl" href="' + href + '" $1>#$2 </span>')
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
  initDocRem
}

