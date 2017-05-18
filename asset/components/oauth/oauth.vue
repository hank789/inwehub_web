<template>
  <div id="oauth_content">
    <div id="weixin" class="mui-btn mui-btn-block mui-btn-primary" style="display: none;" @tap.stop.prevent="login('weixin')">微信登陆</div>
  </div>
</template>

<script>
  import {apiRequest} from '../../utils/request';

  export default{
    data(){
      return{
        oauth_services:{},
        oauth_waiting: null
      }
    },
    props: [],
    components:{
    },
    methods: {
      login(id){
        console.log(id);
        var auth=this.oauth_services[id];
        if(auth){
          var w=null;
          if(plus.os.name=="Android"){
            w=plus.nativeUI.showWaiting();
          }
          document.addEventListener("pause",function(){
            setTimeout(function(){
              w&&w.close();
              w=null;
            },2000);
          }, false );
          auth.login(()=>{
            w&&w.close();
            w=null;
            console.log("登录认证成功：");
            console.log(JSON.stringify(auth.authResult));
            userinfo(auth);
          },function(e){
            w&&w.close();
            w=null;
            console.log("["+e.code+"]："+e.message);
            plus.nativeUI.alert("",null,"登录失败["+e.code+"]："+e.message);
          });
        }else{
          console.log("无效的登录认证通道！");
          plus.nativeUI.alert("无效的登录认证通道！",null,"登录");
        }
      },
      userinfo(a){
        console.log("----- 获取用户信息 -----");
        a.getUserInfo(function(){
          console.log("获取用户信息成功：");
          console.log(JSON.stringify(a.userInfo));
          var nickname=a.userInfo.nickname||a.userInfo.name||a.userInfo.miliaoNick;
          plus.nativeUI.alert("欢迎“"+nickname+"”登录！");
        },function(e){
          console.log("获取用户信息失败：");
          console.log("["+e.code+"]："+e.message);
          plus.nativeUI.alert("获取用户信息失败！",null,"登录");
        });
      },
      logoutAll(){
        console.log("----- 注销登录认证 -----");
        for(var i in auths){
          logout(auths[i]);
        }
      },
      logout(auth){
        auth.logout(function(){
          console.log("注销\""+auth.description+"\"成功");
        },function(e){
          console.log("注销\""+auth.description+"\"失败："+e.message);
        });
      }
    },
    mounted() {
      mui.plusReady( () => {
        if (mui.os.plus) {
          // 获取登录认证通道
          plus.oauth.getServices((services)=>{
            for(var i in services){
              var service=services[i];
              if(service.id === 'weixin'){
                this.oauth_services[service.id]=service;
                var is_installed = isInstalled(service.id);
                if (!is_installed){
                  plus.nativeUI.toast('您尚未安装微信客户端');
                  return;
                }
                document.getElementById(service.id).style.display="block";
              }
            }
          },function(e){
            console.log("获取登录认证失败："+e.message);
          });
        }
      });

      function isInstalled(id) {
        if (id === 'qihoo' && mui.os.plus) {
          return true;
        }
        if (mui.os.android) {
          var main = plus.android.runtimeMainActivity();
          var packageManager = main.getPackageManager();
          var PackageManager = plus.android.importClass(packageManager)
          var packageName = {
            "qq": "com.tencent.mobileqq",
            "weixin": "com.tencent.mm",
            "sinaweibo": "com.sina.weibo"
          }
          try {
            return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
          } catch (e) {}
        } else {
          switch (id) {
            case "qq":
              var TencentOAuth = plus.ios.import("TencentOAuth");
              return TencentOAuth.iphoneQQInstalled();
            case "weixin":
              var WXApi = plus.ios.import("WXApi");
              return WXApi.isWXAppInstalled()
            case "sinaweibo":
              var SinaAPI = plus.ios.import("WeiboSDK");
              return SinaAPI.isWeiboAppInstalled()
            default:
              break;
          }
        }
      }

    }
  }
</script>

