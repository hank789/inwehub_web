function formatSeconds(value) {
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  var result = "" + parseInt(theTime) + "<i class='font-10'>秒</i>";
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + "<i class='font-10'>分</i>" + result;
  }
  if (theTime2 > 0) {
    result = parseInt(theTime2) + "<i class='font-10'>时</i>" + result;
  }
  return result;
}

/**
 *
 * @param endTime 2017-07-18 13:00:00
 * @constructor
 */
function TimeEndText(currentTime, endTime) {
  var currentTime = currentTime;
  var futureTime = endTime;
  if (futureTime <= currentTime) {
    return false;
  }
  var result = formatSeconds(futureTime - currentTime);
  return result;
}

export {
  TimeEndText
}
