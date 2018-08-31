import { postRequest } from './request'
import { saveImageByBase64 } from '../utils/plus'

function getImageSuffix (src, width, height) {
  var suffix = '?x-oss-process=image/resize'
  if (width) {
    suffix += ',w_' + width
  }

  if (height) {
    suffix += ',h_' + height
  }
  return src + suffix
}

function saveHtmlImgToGallery (html, path, successCallback, failCallback) {
  if (!window.plus) {
    window.mui.toast('仅支持APP内使用')
    // return
  }
  postRequest('system/htmlToImage', {html: html})
    .then(response => {
      var code = response.data.code
      if (code !== 1000) {
        window.mui.toast(response.data.message)
        return
      }
      saveImageByBase64(response.data.data.image, path, (url) => {
        window.mui.plusReady(() => {
          window.plus.gallery.save(url, function () {
            console.log('保存图片到相册成功')
            successCallback(url)
          }, function () {
            console.log('保存图片到相册失败')
            failCallback()
          })
        })
      }, () => {
        failCallback()
      })
    })
}

export {
  getImageSuffix,
  saveHtmlImgToGallery
}
