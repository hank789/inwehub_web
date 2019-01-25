import { postRequest } from './request'

/**
 * 获取url信息
 * @param context
 * @param answerId
 */
function fetchArticle (context, url, succeeCallback) {
  postRequest(`article/fetch-url-title`, {
    url: url
  }).then(response => {
    var code = response.data.code

    if (code !== 1000) {
      window.mui.alert(response.data.message)
      return
    }

    succeeCallback(response.data.data)
  })
}

function isUrl (url) {
  return /^https?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+/.test(url)
}

export {
  fetchArticle,
  isUrl
}

