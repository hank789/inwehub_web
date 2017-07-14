function hideHeaderHandler(obj, type){
  if (mui.os.wechat) {

    if (obj.$router.currentRoute.meta.keepAlive && type === 'mounted') {
      return;
    }

    var header = document.getElementsByTagName('header');
    var destHeader = null;
    if (header[0]) {
      destHeader = header[0];
    }
    if (header[1]) {
      destHeader = header[1];
    }

    if (obj.$router.currentRoute.meta.wechatHideHeader) {

      if (header && destHeader) {
        if (!/hidden/.test(destHeader.className)) {
          destHeader.className = destHeader.className.replace("mui-bar-nav", "");
          destHeader.className = destHeader.className.replace("mui-bar", "");
          destHeader.className += " mui-wechat-hidden";
        }
      }

    } else {

      if (header && destHeader) {
        if (/hidden/.test(destHeader.className)) {
          destHeader.className = destHeader.className.replace("mui-wechat-hidden", "");
          destHeader.className += " mui-bar mui-bar-nav";
        }
      }
    }
  }
}

export {
  hideHeaderHandler
};
