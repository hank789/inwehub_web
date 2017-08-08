/**
 * 打开webview
 */
function openWebviewByUrl(url, autoShow=true, aniShow='pop-in', popGesture='hide') {
    mui.plusReady(function(){

      console.log('calledMethod: openWebviewByUrl');

      var nextUrl = 'index.html#' + url;

      var current_webview = plus.webview.getWebviewById(nextUrl);
      if (current_webview) {
          mui.fire(current_webview, 'autoHeight', false);
      }

      var webview = mui.openWindow({
        url: nextUrl,
        id: nextUrl,
        preload: false,//一定要为false
        show: {
          autoShow: autoShow,
          aniShow: aniShow
        },
        styles: {
          popGesture: popGesture
        },
        extras:{preload: false},
        waiting: {
          autoShow: false
        }
      });

      return webview;
  });
}

/**
 * 显示webview并绑定侧滑关闭事件
 */
function showWebview(){
  if (mui.os.plus) {
    if (mui.os.ios) {
      mui.plusReady(() => {
        var self = plus.webview.currentWebview();

        if (self.preload === false || self.preload === undefined){
          self.show();
          self.addEventListener('popGesture', (e)=>{
            if(e.type == "end" && e.result == true){
              var parent_webview = self.opener();
              if (parent_webview){
                console.log('calledEvent: popGesture：'+parent_webview.getURL());

                //触发父页面的自定义事件(refresh),从而进行刷新
                mui.fire(parent_webview, 'refreshData', {childId: self.id});
                //刷新当前页数据
                mui.fire(self, 'refreshData', {parentId: parent_webview.id});

                //触发父页面的自定义事件(refresh),从而进行刷新
                mui.fire(parent_webview, 'refreshPageData', {childId: self.id});
                //刷新当前页数据
                mui.fire(self, 'refreshPageData', {parentId: parent_webview.id});

                mui.fire(parent_webview, 'autoHeight', {childId: self.id});
              }
            }
          }, false);
        }
      });
    }
  }
}

/**
 * webview 回退处理函数
 */
function goBack(){
  if (mui.os.ios) {
    var self = plus.webview.currentWebview();
    //获得父页面的webview
    var parent_webview = self.opener();
    if (parent_webview){

      //触发父页面的自定义事件(refresh),从而进行刷新
      mui.fire(parent_webview, 'refreshData');

      //子页面也刷新数据
      mui.fire(self, 'refreshData');
      mui.fire(parent_webview, 'autoHeight');
    }
  }

  return true;
}

/**
 * 清空webview缓存
 */
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
  openWebviewByUrl,
  goBack,
  showWebview,
  clearAllWebViewCache
};

