function showWebview(){
  if (mui.os.plus) {
    if (mui.os.ios) {
      mui.plusReady(() => {
        var self = plus.webview.currentWebview();
        self.show();
        self.addEventListener('popGesture', (e)=>{
          if(e.type == "end" && e.result == true){
            var parent_webview = self.opener();
            if (parent_webview){
              console.log('popGesture：'+parent_webview.getURL());
              //触发父页面的自定义事件(refresh),从而进行刷新
              mui.fire(parent_webview, 'refreshData', {childId: self.id});
              //子页面也刷新数据
              mui.fire(self, 'refreshData', {parentId: parent_webview.id});
            }
          }
        }, false);
      });
    }
  }
}

function clearAllWebViewCache() {
  if (mui.os.plus) {
    if (mui.os.ios) {
      mui.plusReady(function () {
        var self = plus.webview.currentWebview();
        var wvs=plus.webview.all();
        for(var i=0;i<wvs.length;i++){
          if (wvs[i].id !== self.id){
            wvs[i].close();
          }
        }
      });
    }
  }
}

export {
  showWebview,
  clearAllWebViewCache
};

