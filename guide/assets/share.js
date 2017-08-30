/**
 * Created by edwin on 2017/8/30.
 */
var $ = {};
$.post = (url, payload, callback) => {
  
    fetch(url,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify( payload )
    })
    .then(function(res){ return res.json(); })
    .then(function(response){ callback(response); })
};

window.bindShareByWechat = (title, desc, link, imgUrl)=>{
  var fullUrl = window.location.href;
  var currentUrl = fullUrl.split('#')[0];

  $.post('https://api.inwehub.com/api/share/wechat/jssdk', {current_url:currentUrl}, (response => {
    var code = response.code;
    if (code !== 1000) {
       alert(response.message);
    }

    var wechatConfig = response.data.config;
    wx.config(wechatConfig);

    wx.error(function(res){
      console.error('wx:error:'+ JSON.stringify(res));
    });

    wx.ready(() => {

      wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        success: () => {

        },
        cancel: () => {
        }
      });

      wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: () => {

        },
        cancel:  () => {

        }
      });
    });
  }));
};

