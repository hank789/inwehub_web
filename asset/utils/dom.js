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

  if (/<a/gi.test(text)) {
    return false
  }

  var re = /(https?:\/\/[^\s<]+)/g
  domEle.innerHTML = text.replace(re, "<a target='_blank' class='text-content' href='$1'>$1</a>")
}

function textToLinkHtml (text) {
  if (!text) {
    return text
  }

  if (/<a/gi.test(text)) {
    return text
  }
  var re = /(https?:\/\/[^\s<]+)/g
  return text.replace(re, "<a target='_blank' class='text-content' href='$1'>$1</a>")
}

export {
  queryParent,
  textToLink,
  textToLinkHtml
}

