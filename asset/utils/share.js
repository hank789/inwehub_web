/**
 分享公共库

 使用方法:
   //.step1 导入组件
   import Share from 'untils/share'

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

import {postRequest}  from 'request'

var Share = {
  currentUrl:null,
  context:null,
  data:{},
  successCallback:() => {

  },
  failCallback:() => {

  },
  bindShareByPlus:() => {
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
               wechat.send({
                 content:self.data.content,
                 href:self.data.href,
                 title:self.data.title,
                 pictures:[self.data.imageUrl],
                 thumbs:[self.data.thumbUrl],
                 extra:{scene:"WXSceneSession"}
               }, ()=>{
                 self.successCallback();
               }, (error)=>{
                 self.failCallback();
               });
             };

            self.context.sendPengYouQuan = () => {
              wechat.send({
                content:self.data.content,
                href:self.data.href,
                title:self.data.title,
                pictures:[self.data.imageUrl],
                thumbs:[self.data.thumbUrl],
                extra:{scene:"WXSceneTimeline"}
              }, ()=>{
                self.successCallback();
              }, (error)=>{
                self.failCallback();
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
  },
  bindShareByWechat:()=>{
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
        //mui.alert('wx:error:'+ JSON.stringify(res));
      });

      wx.ready(function() {
        wx.onMenuShareAppMessage({
          title: this.data.title, // 分享标题
          desc: this.data.desc, // 分享描述
          link: this.data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: this.data.imgUrl, // 分享图标
          type: this.data.type?this.data.type:'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: this.data.dataUrl?this.data.dataUrl:'', // 如果type是music或video，则要提供数据链接，默认为空
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
          title: this.data.title, // 分享标题
          link: this.data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: this.data.imgUrl, // 分享图标
          success: () => {
            self.successCallback();
          },
          cancel:  () => {
            self.failCallback();
          }
        });
      });
    });
  },
  bindShare:(context, data, successCallback, failCallback)=>{
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

      if (mui.os.wechat) {
         this.bindShareByWechat();
      }

      if (mui.os.plus) {
         this.bindShareByPlus();
      }
  }
}



export default Share;
