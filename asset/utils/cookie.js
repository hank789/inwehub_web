var Cookie = {
  get: function (k) {
    return ((new RegExp(["(?:; )?", k, "=([^;]*);?"].join(""))).test(document.cookie) && RegExp["$1"]) || "";
  },
  set: function (k, v, e, d) {
    var date=new Date();
    var expiresDays=e;
    date.setTime(date.getTime()+expiresDays*24*3600*1000);
    //如果有设置时间，则在规定时间内使用cookie，否则就是永不过期
    document.cookie=k+"="+v+"; expires="+ (e != '' ? date.toGMTString(): "GMT_String")+";path=/;domain="+ (d||'');
  },
  del: function (k) {
    var date=new Date();
    //将date设置为过去的时间
    date.setTime(date.getTime()-10000);
    document.cookie=k+"=; expires="+date.toGMTString();
  }
};

export default Cookie;
