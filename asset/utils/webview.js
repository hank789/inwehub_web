import {  setStatusBarBackgroundAndStyle, autoHeight } from './statusBar';

/**
 * 打开webview
 */
function openWebviewByUrl(url, autoShow=true, aniShow='pop-in', popGesture='hide') {
    mui.plusReady(function(){

      console.log('calledMethod: openWebviewByUrl');

      var current_webview = plus.webview.getWebviewById(url);
      if (current_webview) {
          mui.fire(current_webview, 'autoHeight', false);
      }

      var webview = mui.openWindow({
        url: url,
        id: url,
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
 * 首页打开readhub的详情页
 * @param url
 * @param pathUrl
 * @param title
 */
function openWebviewByHome(id, url, pathUrl, title)
{

    setStatusBarBackgroundAndStyle('#3c3e44', 'light');

    var pathUrl = process.env.READHUB_URL + pathUrl;

    var  webviewBackButton = () => {
      var ws = plus.webview.getWebviewById(id);
      if (ws) {
        console.log('webviewBackButton close');
        ws.close();
        autoHeight();
        plus.key.removeEventListener('backbutton',webviewBackButton);
      }
    }

    var webview = plus.webview.create(url, id,{popGesture: 'hide',
      top:'0px',
      bottom:'0px',
      position:'dock',
      dock:'bottom',
      backButtonAutoControl: 'hide',
      statusbar:{background:'#3c3e44'},
      titleNView: {
        backgroundColor: '#3c3e44', //导航栏背景色
        titleText: title, //导航栏标题
        titleColor: '#fff', //文字颜色
        type: 'transparent', //透明渐变样式
        titleSize:'18px',
        autoBackButton: true, //自动绘制返回箭头
        splitLine: { //底部分割线
          color: '#3c3e44'
        }
      },
      bounce:'vertical'});

    plus.key.addEventListener("backbutton",() =>{
      webviewBackButton();

    });

    webview.addEventListener('popGesture', (e) => {
      if(e.type == "end" && e.result == true){
        var parent_webview = self.opener();
        if (parent_webview){
           autoHeight();
        }
      }
    }, false);

    //创建底部菜单
    var toolUrl = pathUrl + '/webview';
    console.log('toolUrl:' + toolUrl);
    var embed =plus.webview.create(toolUrl, toolUrl, {
      cachemode:'noCache',
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
      openWebviewByUrl(pathUrl + '?from=webview');
    }, false);

    //兼容android
    if (mui.os.plus) {
      if (mui.os.android) {
        //创建返回链接
        var viewBack = new plus.nativeObj.View('test', {top: '0px', left: '0px', height: '44px', width: '100px'});

        viewBack.draw([
          {
            tag: 'rect',
            id: 'rect',
            rectStyles: {color: 'rgba(0,0,0,0)'},
            position: {top: '0px', left: '0px', width: '100%', height: '44px'}
          },
        ]);
        viewBack.addEventListener('click', () => {
          webviewBackButton();
        }, false);
        webview.append(viewBack);
      }
    }


    embed.append(view);

    webview.append(embed);

    return webview;
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

export {
  openWebviewByUrl,
  goBack,
  showWebview,
  clearAllWebViewCache,
  openWebviewByHome
};

