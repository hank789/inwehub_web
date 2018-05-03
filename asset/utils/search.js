/**
 * 通过接口搜索
 * @param text  要搜索的文本
 * @param callback  执行搜索的操作
 */

var searchTimer = null

function searchText (text, callback, timeout = 1000) {
  if (!text) {
    return
  }

  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    console.log('search:' + text)
    callback(text)
  }, timeout)
}

export {
  searchText
}
