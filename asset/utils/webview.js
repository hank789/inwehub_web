function showWebview(){
  mui.plusReady(function() {
    var duration = mui.os.ios ? 200 : 100;

    if (mui.os.ios) {
      plus.webview.currentWebview().show('pop-in', duration, function(){

      });
    }
  });
}

export {
  showWebview
};

