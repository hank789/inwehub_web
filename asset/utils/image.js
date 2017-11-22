function getImageSuffix (src, width, height) {
  return src + '?x-oss-process=image/resize,h_' + height + ',w_' + width
}

export {
  getImageSuffix
}
