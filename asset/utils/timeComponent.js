function changeFormat (t) {
  t -= 0
  if (t < 10) {
    return ('0' + t)
  } else {
    return (t + '')
  }
}

export default{
  install (Vue, options) {
    Vue.prototype.timeago = function (createtime) {
      console.log('createtime:' + createtime)
      if (!createtime) {
        return createtime
      }

      // 转化为毫秒数
      var timer = new Date(createtime).getTime()
      // 当前的毫秒数
      var dataNow = new Date().getTime()
      // 当天的零点时间戳
      var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
      timer += ''
      if (timer.length === 10) {
        timer -= 0
        timer *= 1000
      } else {
        timer -= 0
      }
      // 转化为标准格式
      var date = new Date(createtime)
      // 年
      var Year = date.getFullYear()
      // 月
      var Month = date.getMonth() + 1
      // 日
      var Data = date.getDate()
      // 时
      var Hours = changeFormat(date.getHours())
      // 分
      var Minutes = changeFormat(date.getMinutes())
      // 秒
      var Seconds = changeFormat(date.getSeconds())

      if (timer >= timeStamp && timer < dataNow) {
        return Hours + ':' + Minutes + ':' + Seconds
      } else if (timer < timeStamp && timer >= timeStamp - 86400000) {
        return '昨天' + Hours + ':' + Minutes + ':' + Seconds
      } else if (timer < timeStamp - 86400 && timer >= timeStamp - 86400000 * 2) {
        return '前天' + Hours + ':' + Minutes + ':' + Seconds
      } else if (timer < timeStamp - 86400000 * 2) {
        return Year + '-' + Month + '-' + Data + ' ' + Hours + ':' + Minutes + ':' + Seconds
      }
    }
  }
}
