<template>
  <div>
    <a @tap.stop.prevent="openApp()">打开app</a>
  </div>
</template>

<script>

  import wx from 'weixin-js-sdk';
  import {createAPI, addAccessToken, postRequest} from '../utils/request';

  export default {
    data(){

      return {
        config:{}
      }
    },

    mounted(){
      var fullUrl = window.location.href;
      var currentUrl = fullUrl.split('#')[0];

      //微信分享
      postRequest(`share/wechat/jssdk`, {current_url:currentUrl}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.toast(response.data.message);
          return;
        }

        var wechatConfig = response.data.data.config;
        wx.config(wechatConfig);
        this.config = wechatConfig;
        wx.error(function(res){
            mui.alert('wx:error:'+ JSON.stringify(res));
        });

        wx.ready(function() {
            mui.alert('ready');
        });
      });
    },
    methods: {
      openApp(){
          var config = this.config;
        if (mui.os.wechat) {
          WeixinJSBridge.invoke('getInstallState',{
            'appid': 'wx060483a470f50b76', // 公众号appID
            'packageUrl': 'inwehubtest://abc', // IOS必填，xxxx:// 开头的一个scheme
            'packageName':'com.inwehub.InwehubTest' // android必填，包名
          },function(res){
            alert(JSON.stringify(res));

            WeixinJSBridge.invoke("launch3rdApp", {
              'appID': 'wx060483a470f50b76',
              'messageExt': 'from=weixin_webview',
              'extInfo': 'from=weixin_webview'},
              function (e) {
              alert(JSON.stringify(e));
            });
          });

        }
      }
    }
  };
</script>

<style scoped="scoped">
  a{
    display: inline-block;
    margin:50px 0 0 50px;
  }
</style>
