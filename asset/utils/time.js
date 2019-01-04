function formatSeconds (value) {
  var theTime = parseInt(value)// 秒
  var theTime1 = 0// 分
  var theTime2 = 0// 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
    }
  }
  var result = '' + parseInt(theTime) + '<i class=\'font-10\'>秒</i>'
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '<i class=\'font-10\'>分</i>' + result
  }
  if (theTime2 > 0) {
    result = parseInt(theTime2) + '<i class=\'font-10\'>时</i>' + result
  }
  return result
}

/**
 *
 * @param endTime 2017-07-18 13:00:00
 * @constructor
 */
function TimeEndText (currentTime, endTime) {
  var futureTime = endTime
  if (futureTime <= currentTime) {
    return false
  }
  var result = formatSeconds(futureTime - currentTime)
  return result
}

function timeToHumanDay (time) {
  var showDate = ''
  var createDay = new Date(time * 1000).getDay()
  switch (createDay) {
    case 0:
      showDate = '星期日'
      break
    case 1:
      showDate = '星期一'
      break
    case 2:
      showDate = '星期二'
      break
    case 3:
      showDate = '星期三'
      break
    case 4:
      showDate = '星期四'
      break
    case 5:
      showDate = '星期五'
      break
    case 6:
      showDate = '星期六'
      break

  }
  return showDate
}

/**
 * 日期转人类可视化
 * @param time
 */
function timeToHumanText (time) {
  var dateObj = new Date()

  // 今天0点时间戳
  dateObj.setHours(0)
  dateObj.setMinutes(0)
  dateObj.setSeconds(0)
  var todayDate = dateObj.getTime() / 1000

  // 创建时间戳
  var createDateObj = new Date(time * 1000)
  var createDate = time * 1
  var createHumanDay = timeToHumanDay(time)
  var createFullDate = createDateObj.getFullYear() + '-' + (createDateObj.getMonth() + 1) + '-' + createDateObj.getDate()

  // 今年第一天时间戳
  dateObj.setDate(1)
  dateObj.setMonth(0)
  var yearDate = dateObj.getTime() / 1000

  // humen Date
  var showDate = ''

  if (createDate >= todayDate) {
    showDate = '今天' + createHumanDay

  } else if (createDate >= todayDate - 60 * 60 * 24) {
    showDate = '昨天' + createHumanDay
  } else if (createDate >= todayDate - 2 * 60 * 60 * 24) {
    showDate = '前天' + createHumanDay
  } else if (createDate >= todayDate - 3 * 60 * 60 * 24) {
    showDate = '3天前' + createHumanDay
  } else if (createDate >= todayDate - 4 * 60 * 60 * 24) {
    showDate = '4天前' + createHumanDay
  } else if (createDate >= todayDate - 5 * 60 * 60 * 24) {
    showDate = '5天前' + createHumanDay
  } else if (createDate >= todayDate - 6 * 60 * 60 * 24) {
    showDate = '6天前' + createHumanDay
  } else if (createDate >= todayDate - 2 * 7 * 60 * 60 * 24) {
    showDate = '1周前'
  } else if (createDate >= yearDate) {
    showDate = createDateObj.getMonth() + '月' + createDateObj.getDay() + '日'
  } else {
    showDate = createFullDate
  }
  return showDate
}

/**
 * 2019-01-04 14:52:00 => 1546584720
*/
function getTimestampByDateStr (str) {
  return new Date(str).getTime() / 1000
}

export {
  TimeEndText,
  timeToHumanText,
  getTimestampByDateStr
}
