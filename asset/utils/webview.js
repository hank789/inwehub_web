function showWebview(){
  if (mui.os.plus) {
    if (mui.os.ios) {
      mui.plusReady(function () {
        var self = plus.webview.currentWebview();
        self.show();
        self.addEventListener('popGesture', function(e){
          if(e.type == "end" && e.result == true){
            var parent_webview = self.opener();
            if (parent_webview){
              console.log('popGesture：'+parent_webview.getURL());
              //触发父页面的自定义事件(refresh),从而进行刷新
              mui.fire(parent_webview, 'refreshData');
              //子页面也刷新数据
              mui.fire(self, 'refreshData');
            }
          }
        }, false);
      });
    }
  }
}

export {
  showWebview
};

