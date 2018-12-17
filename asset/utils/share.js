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

import { postRequest } from './request'
import { stripTags } from './dom'

var wx = window.wx

var Share = () => {
  var currentUrl = null
  var context = null
  var data = {}
  var successCallback = () => {

  }
  var failCallback = () => {

  }
  var bindShareByPlus = () => {
    var self = this
    var shares = []
    window.mui.plusReady(() => {
      window.plus.share.getServices((shareService) => {
        for (var i in shareService) {
          var shareObj = shareService[i]
          shares[shareObj.id] = shareObj
        }

        var wechat = shares['weixin']
        if (wechat.nativeClient) {
          self.context.sendHaoyou = () => {
            var data = {
              type: self.data.link ? 'web' : 'image',
              content: self.data.content ? stripTags(self.data.content).substr(0, 150) : self.data.content,
              href: self.data.link,
              title: self.data.title ? stripTags(self.data.title).substr(0, 150) : self.data.title,
              pictures: [self.data.imageUrl],
              thumbs: self.data.thumbUrl ? [self.data.thumbUrl] : null,
              extra: {scene: 'WXSceneSession'}
            }
            console.log('sendHaoyou-data:' + JSON.stringify(data))
            wechat.send(data, () => {
              self.successCallback()
            }, (error) => {
              self.failCallback(error)
            })
          }

          var pengYouQuanTitle = self.data.pyqTitle ? self.data.pyqTitle : self.data.title
          var pengYouQuanContent = self.data.pyqContent ? self.data.pyqContent : self.data.content

          self.context.sendPengYouQuan = () => {
            wechat.send({
              type: self.data.link ? 'web' : 'image',
              content: stripTags(pengYouQuanContent).substr(0, 150),
              href: self.data.link,
              title: stripTags(pengYouQuanTitle).substr(0, 150),
              pictures: [self.data.imageUrl],
              thumbs: [self.data.thumbUrl],
              extra: {scene: 'WXSceneTimeline'}
            }, () => {
              self.successCallback()
            }, (error) => {
              self.failCallback(error)
            })
          }

          if (!wechat.authenticated) {
            wechat.authorize(() => {
            }, function (e) {
              console.log('认证失败')
            })
          }
        }
      })
    })
  }
  var bindShareByWechat = () => {
    var self = this

    // 微信分享
    postRequest(`share/wechat/jssdk`, {current_url: this.currentUrl}).then(response => {
      var code = response.data.code
      if (code !== 1000) {
        window.mui.toast(response.data.message)
        return
      }

      var wechatConfig = response.data.data.config
      wx.config(wechatConfig)

      wx.error(function (res) {
        console.error('wx:error:' + JSON.stringify(res))
      })

      wx.ready(() => {
        wx.onMenuShareAppMessage({
          title: stripTags(self.data.title).substr(0, 150), // 分享标题
          desc: stripTags(self.data.content).substr(0, 150), // 分享描述
          link: self.data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.data.imageUrl, // 分享图标
          type: self.data.type ? self.data.type : 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: self.data.dataUrl ? self.data.dataUrl : '', // 如果type是music或video，则要提供数据链接，默认为空
          success: () => {
            // 用户确认分享后执行的回调函数
            self.successCallback()
          },
          cancel: () => {
            // 用户取消分享后执行的回调函数
            self.failCallback()
          }
        })

        var pengYouQuanTitle = self.data.pyqTitle ? self.data.pyqTitle : self.data.title

        wx.onMenuShareTimeline({
          title: stripTags(pengYouQuanTitle).substr(0, 150), // 分享标题
          link: self.data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: self.data.imageUrl, // 分享图标
          success: () => {
            self.successCallback()
          },
          cancel: () => {
            self.failCallback()
          }
        })

        self.context.sendHaoyou = () => {}

        self.context.sendPengYouQuan = () => {}
      })
    })
  }

  var setData = (data) => {
    this.data = data
  }

  var bindShare = (context, data, successCallback, failCallback) => {
    console.log('init share')
    this.context = context
    var fullUrl = window.location.href
    this.currentUrl = fullUrl.split('#')[0]
    this.data = data
    if (successCallback) {
      this.successCallback = successCallback
    }

    if (failCallback) {
      this.failCallback = failCallback
    }

    if (window.mui.os.plus) {
      bindShareByPlus()
    } else if (window.mui.os.wechat) {
      bindShareByWechat()
    } else {
      context.sendHaoyou = () => {
        console.log(this.data)
      }
      context.sendPengYouQuan = () => {}
    }
  }
  return {
    bindShare: bindShare,
    setData: setData,
    currentUrl: currentUrl,
    context: context,
    data: data,
    successCallback: successCallback,
    failCallback: failCallback
  }
}

export default new Share()
