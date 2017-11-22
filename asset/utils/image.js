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

export {
  getImageSuffix
}
