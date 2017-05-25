import {apiRequest} from '../utils/request';

function checkUpdate(){
  // 获取本地应用资源版本号
  plus.runtime.getProperty(plus.runtime.appid,function(inf){
    var wgtVer=inf.version;
    console.log("当前应用版本："+wgtVer);
    apiRequest(`system/version`, {}).then(response_data => {
      if (response_data !== false) {
        var app_version = response_data.app_version;
        var package_url = response_data.package_url;
        var is_force = response_data.is_force;
        if (app_version && wgtVer !== app_version){
          //如果是强更
          if (is_force === 1){
            mui.alert("有新的版本升级");
            if (mui.os.ios) {
              var ios_force_update_url = response_data.ios_force_update_url;
              //location.href = 'https://itunes.apple.com/cn/app/jie-zou-da-shi/id493901993?mt=8';
              location.href = ios_force_update_url;
            } else if (mui.os.android) {
              var android_force_update_url = response_data.android_force_update_url;
              //market://details?id=io.dcloud.HelloMUI
              plus.runtime.openURL(android_force_update_url, (e) => {
                plus.runtime.openURL(android_force_update_url, (e) => {
                  mui.alert("未安装360手机助手和应用宝，暂时无法更新");
                }, "com.qihoo.appstore");
              }, "com.tencent.android.qqdownloader");
            }
          }else {
            //下载升级包
            downWgt(package_url);
          }
        }
      }
    });
  });
}


function downWgt(wgtUrl){
  plus.nativeUI.showWaiting("下载更新文件...");
  plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
    if ( status == 200 ) {
      console.log("下载wgt成功："+d.filename);
      installWgt(d.filename); // 安装wgt包
    } else {
      console.log("下载wgt失败！");
      plus.nativeUI.alert("下载更新文件失败！");
    }
    plus.nativeUI.closeWaiting();
  }).start();
}

// 更新应用资源
function installWgt(path){
  plus.nativeUI.showWaiting("安装更新文件...");
  plus.runtime.install(path,{},function(){
    plus.nativeUI.closeWaiting();
    console.log("安装wgt文件成功！");
    removeFile(path);
    plus.runtime.restart();
  },function(e){
    plus.nativeUI.closeWaiting();
    removeFile(path);
    console.log("安装wgt文件失败["+e.code+"]："+e.message);
    plus.nativeUI.alert("安装更新文件失败["+e.code+"]："+e.message);
  });
}

function removeFile(path) {
  plus.io.resolveLocalFileSystemURL( path, function( entry ) {
    // 可通过entry对象操作文件
    entry.remove( function ( entry ) {
      console.log( "Remove succeeded" );
    }, function ( e ) {
      console.log( e.message );
    } );
  }, function ( e ) {
    console.log( "Resolve file URL failed: " + e.message );
  } );
}


export {
  checkUpdate
}
