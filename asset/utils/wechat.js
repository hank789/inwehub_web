function hideHeaderHandler(obj, type){
  if (mui.os.wechat) {

    if (obj.$router.currentRoute.meta.keepAlive && type === 'mounted') {
      return;
    }

    var headers = document.getElementsByTagName('header');
    for (var i in headers) {
      var destHeader = headers[i];
      if (obj.$router.currentRoute.meta.wechatHideHeader) {
        if (destHeader) {
          if (!/hidden/.test(destHeader.className) && !/mustshow/.test(destHeader.className)) {
            destHeader.className = destHeader.className.replace("mui-bar-nav", "");
            destHeader.className = destHeader.className.replace("mui-bar", "");
            destHeader.className += " mui-wechat-hidden";
          }
        }

      } else {
        if (destHeader) {
          if (/hidden/.test(destHeader.className)) {
            destHeader.className = destHeader.className.replace("mui-wechat-hidden", "");
            destHeader.className += " mui-bar mui-bar-nav";
          }
        }
      }

    }



  }
}

export {
  hideHeaderHandler
};
