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

export {
  queryParent,
  textToLink,
  textToLinkHtml,
  stripTags,
  addPreviewAttrForImg,
  secureHtml
}

