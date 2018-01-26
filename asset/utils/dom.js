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
  var re = /\s(https?:\/\/[^\s<]+)/g
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
  var re = /\s(https?:\/\/[^\s<]+)/g
  text = text.replace(re, " <span target='_blank' class='vendorUrl text-content' href='$1'>$1</span>")

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
  var startScreenY

  var oldTop = elem.style.top

  elem.addEventListener('touchstart', (e) => {
    console.dir(e)
    var touch = e.touches[0]
    startY = touch.pageY
    startScreenY = touch.screenY
  })

  elem.addEventListener('touchmove', (e) => {
    var touch = e.touches[0]
    moveY = touch.pageY - startY

    if (moveY > 0 && moveY < 100 && startScreenY < 300) {
      elem.style.top = moveY + 'px'
    }
  })

  elem.addEventListener('touchend', (e) => {
    elem.style.top = oldTop
    if (moveY > 100 && startScreenY < 300) {
      callback(moveY + ':' + startScreenY)
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
  dragDownElement
}

