/**
 分享公共库

 使用方法:
   //.step1 导入组件
   import Share from 'utils/share'

   //.step2 绑定share
   Share.bindShare(
      this,
      data,
      successCallback,
      failCallback
   );
   data:{title:'', link:'', content:'',  imageUrl:'', thumbUrl:''}

   //.step3 触发事件(微信不需要触发事件:指引用户选择右上角菜单即可，仅app需要)
   context.sendHaoyou();   //发送给好友
   context.sendPengYouQuan(); //发送给朋友圈
 **/

import {postRequest}  from './request';
import wx from 'weixin-js-sdk';

var Share = () => {
  var currentUrl = null;
  var context = null;
  var data = {};
  var successCallback= () => {

  };
  var failCallback = () => {

  };
  var bindShareByPlus = () => {
    var self = this;
    var shares = [];
    mui.plusReady(() => {
        plus.share.getServices((shareService) => {
          for (var i in shareService) {
            var shareObj = shareService[i];
            shares[shareObj.id] = shareObj;
          }

          var wechat = shares['weixin'];
          if (wechat.nativeClient) {



             self.context.sendHaoyou = () => {
               var data = {
                 content:self.data.content,
                 href:self.data.link,
                 title:self.data.title,
                 pictures:[self.data.imageUrl],
                 thumbs:[self.data.thumbUrl],
                 extra:{scene:"WXSceneSession"}
               };
              
               wechat.send(data, ()=>{
                 self.successCallback();
               }, (error)=>{
                 self.failCallback(error);
               });
             };

            self.context.sendPengYouQuan = () => {
              wechat.send({
                content:self.data.content,
                href:self.data.link,
                title:self.data.title,
                pictures:[self.data.imageUrl],
                thumbs:[self.data.thumbUrl],
                extra:{scene:"WXSceneTimeline"}
              }, ()=>{
                self.successCallback();
              }, (error)=>{
                self.failCallback(error);
              });
            }

            if ( !wechat.authenticated ) {
              wechat.authorize(() => {
              }, function(e){
                console.log("认证失败");
              });
            }
          }
        });
    });
  };
  var bindShareByWechat = ()=>{
    var self = this;

    //微信分享
    postRequest(`share/wechat/jssdk`, {current_url:this.currentUrl}).then(response => {
      var code = response.data.code;
      if (code !== 1000) {
        mui.toast(response.data.message);
      }

      var wechatConfig = response.data.data.config;
      wx.config(wechatConfig);

      wx.error(function(res){
         console.error('wx:error:'+ JSON.stringify(res));
      });

      wx.ready(() => {

        wx.onMenuShareAppMessage({
          title: self.data.title, // 分享标题
          desc: self.data.desc, // 分享描述
          link: self.data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.data.imgUrl, // 分享图标
          type: self.data.type?self.data.type:'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: self.data.dataUrl?self.data.dataUrl:'', // 如果type是music或video，则要提供数据链接，默认为空
          success: () => {
            // 用户确认分享后执行的回调函数
            self.successCallback();
          },
          cancel: () => {
            // 用户取消分享后执行的回调函数
            self.failCallback();
          }
        });

        wx.onMenuShareTimeline({
          title: self.data.title, // 分享标题
          link: self.data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.data.imgUrl, // 分享图标
          success: () => {
            self.successCallback();
          },
          cancel:  () => {
            self.failCallback();
          }
        });

        self.context.sendHaoyou = () => {};

        self.context.sendPengYouQuan = () => {};

      });
    });
  };
  var bindShare = (context, data, successCallback, failCallback)=>{

      this.context = context;
      var fullUrl = window.location.href;
      this.currentUrl = fullUrl.split('#')[0];
      this.data = data;
      if (successCallback) {
        this.successCallback = successCallback;
      }

      if (failCallback) {
        this.failCallback = failCallback;
      }

      if (mui.os.plus) {
         bindShareByPlus();
      } else if (mui.os.wechat) {
         bindShareByWechat();
      } else {
         mui.toast('暂不支持当前环境');
         context.sendHaoyou = () => {};
         context.sendPengYouQuan = () => {};
      }
  }
  return {
    bindShare:bindShare
  }
};



export default new Share();
