function formatSeconds(value) {
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  if(theTime > 60) {
    theTime1 = parseInt(theTime/60);
    theTime = parseInt(theTime%60);
    if(theTime1 > 60) {
      theTime2 = parseInt(theTime1/60);
      theTime1 = parseInt(theTime1%60);
    }
  }
  var result = "<span>"+parseInt(theTime)+"</span>秒";
  if(theTime1 > 0) {
    result = "<span>"+parseInt(theTime1)+"</span>分"+result;
  }
  if(theTime2 > 0) {
    result = "<span>"+parseInt(theTime2)+"</span>小时"+result;
  }
  return result;
}

/**
 *
 * @param endTime 2017-07-18 13:00:00
 * @constructor
 */
function TimeEndText(currentTime, endTime){
  var currentTime = currentTime;
  var futureTime = endTime;
  if (futureTime <= currentTime) {
     return false;
  }
  var result =  formatSeconds(futureTime-currentTime);
  return result;
}


export {
  TimeEndText
}
