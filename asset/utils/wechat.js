function hideHeaderHandler(obj, type){
  if (mui.os.wechat) {

    if (obj.$router.currentRoute.meta.keepAlive && type === 'mounted') {
      return;
    }

    if (obj.$router.currentRoute.meta.wechatHideHeader) {
      var header = document.getElementsByTagName('header');

      if (header && header[0]) {
        if (!/hidden/.test(header[0].className)) {
          header[0].className = header[0].className.replace("mui-bar", "");
          header[0].className = header[0].className.replace("mui-bar-nav", "");
          header[0].className += " mui-wechat-hidden";
        }
      }
    } else {
      var header = document.getElementsByTagName('header');
      if (header && header[0]) {
        if (/hidden/.test(header[0].className)) {
          header[0].className = header[0].className.replace("mui-wechat-hidden", "");
          header[0].className += " mui-bar mui-bar-nav";
        }
      }
    }
  }
}

export {
  hideHeaderHandler
};
