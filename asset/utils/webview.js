import {  setStatusBarBackgroundAndStyle, autoHeight } from './statusBar';

/**
 * 打开webview
 */
function openWebviewByUrl(id, url, autoShow=true, aniShow='pop-in', popGesture='hide', reload = false) {
    mui.plusReady(function(){

      console.log('calledMethod: openWebviewByUrl');

      var current_webview = plus.webview.getWebviewById(id);
      if (current_webview) {
        mui.fire(current_webview, 'autoHeight', false);
      }
      if (current_webview && current_webview.getURL()) {
        var current_webview_url = current_webview.getURL();
        console.log('openWebviewByUrl:current:'+current_webview_url);
        if (current_webview_url.indexOf(url) < 0) {
          console.log('openWebviewByUrl:load:'+url);
          current_webview.loadURL(url);
        }
        current_webview.show();
      } else {
        var webview = mui.openWindow({
          url: url,
          id: id,
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
        console.log("openWindow:"+webview.getURL());
        if (reload) {
          webview.loadURL(url);
        }
      }
    });
}

/**
 * 首页打开readhub的详情页
 * @param url
 * @param pathUrl
 * @param title
 */
function openWebviewByHome(ws)
{

    var id = ws.id;
    var url = ws.article_url;
    var pathUrl = ws.article_comment_url;
    var title = ws.article_title;
    var img_url = ws.article_img_url;

    var currentWebview = ws;

    setStatusBarBackgroundAndStyle('#3c3e44', 'light');

    var pathUrl = process.env.READHUB_URL + pathUrl;

    //绑定标题
    var shareTitle = '[InweHub发现]' + title;
    var content = '来自「 频道」，这里有特别的评论，点击去看看或者参与互动？';
    var shareUrl = 'index.html#' + '/webview/share?title=' + encodeURIComponent(title);
    // + '&link=' + encodeURIComponent(url)
    // + '&content=' + encodeURIComponent(content)
    // + '&imageUrl='
    // + '&thumbUrl=';
    var shareId = 'webview_readhub_share_' + id;
    var shareView = plus.webview.create(shareUrl, shareId, {
      cachemode:'noCache',
      popGesture: 'hide',
      top:'0px',
      right:'0px',
      width:'100%',
      height:'44px',
      dock:'top',
      position:'dock',
      backButtonAutoControl: 'hide',
      bounce:'none', //不允许滑动
      scrollIndicator:'none', //不显示滚动条
    }, {
      title: shareTitle,
      link: pathUrl,
      content: content,
      imageUrl:img_url,
      thumbUrl:img_url + '?x-oss-process=image/resize,h_100'
    });

    currentWebview.append(shareView);

    //body部分
    var bodyTop = '0px';
    var bodyBottom = '0px';
    if (mui.os.android) {
       bodyTop = '44px';
       bodyBottom = '44px';
    }
    var webview = plus.webview.create(url, id,{popGesture: 'hide',
      top:bodyTop,
      bottom:bodyBottom,
      position:'absolute',
      backButtonAutoControl: 'hide',
      statusbar:{background:'#3c3e44'},
      bounce:'vertical'});

    webview.addEventListener('popGesture', (e) => {
      if(e.type == "end" && e.result == true){
        var parent_webview = self.opener();
        if (parent_webview){
           autoHeight();
        }
      }
    }, false);
    currentWebview.append(webview);

    //创建底部菜单
    var toolUrl = pathUrl + '/webview';
    console.log('toolUrl:' + toolUrl);
    var toolUrlId = 'toolUrl_readhub_detail_' + id;
    var embed =plus.webview.create(toolUrl, toolUrlId, {
      popGesture: 'hide',
      bottom:'0px',
      height:'44px',
      dock:'bottom',
      position:'dock',
      backButtonAutoControl: 'hide',
      bounce:'none', //不允许滑动
      scrollIndicator:'none', //不显示滚动条
    });


    //创建评论链接
    var view = new plus.nativeObj.View('test', {bottom:'0px',left:'0',height:'44px',width:'60%'});

    view.draw([
      {tag:'rect',id:'rect',rectStyles:{color:'rgba(0,0,0,0)'},position:{bottom:'0px',left:'0px',width:'100%',height:'44px'}},
    ]);
    view.addEventListener('click', () => {
      console.log('准备跳转:'+pathUrl + '?from=webview');

      openWebviewByUrl('read_comment_link_' + id, pathUrl + '?from=webview');
    }, false);

    embed.append(view);

    currentWebview.append(embed);


    return currentWebview;
}

/**
 * 显示webview并绑定侧滑关闭事件
 */
function showWebview(){
  if (mui.os.plus) {
      mui.plusReady(() => {
        var self = plus.webview.currentWebview();

        if (self.preload === false || self.preload === undefined){
          self.show();
          if (mui.os.ios) {
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
        }
      });
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
      mui.plusReady(function () {
        var self = plus.webview.currentWebview();
        var wvs=plus.webview.all();
        for(var i=0;i<wvs.length;i++){
          if (wvs[i].id !== self.id && wvs[i].id !== 'inwehub_embed'){
            wvs[i].close();
          }
        }
      });
  }
}

export {
  openWebviewByUrl,
  goBack,
  showWebview,
  clearAllWebViewCache,
  openWebviewByHome
};

