<template>
  <div>
    <a class="mui-icon shareBtn mui-pull-right" @tap.stop.prevent="share()" v-if="!hideShareBtn">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-fenxiang"></use>
      </svg>
    </a>

    <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
      <div class="title">
        <span  @tap.stop.prevent="cancelShare()">取消</span>
        分享到
      </div>
      <div class="more">
        <div class="single" @tap.stop.prevent="shareToHaoyou()">
          <img src="../statics/images/wechat_2x.png"/>
          <p>微信好友</p>
        </div>
        <div class="single" @tap.stop.prevent="shareToPengyouQuan()">
          <img src="../statics/images/pengyouquan.png"/>
          <p>朋友圈</p>
        </div>
        <div class="single" @tap.stop.prevent="shareToChat()">
          <img src="../statics/images/sendFriend@2x.png"/>
          <p>私信好友</p>
        </div>
        <div class="single" @tap.stop.prevent="shareToCopyLink()">
          <img src="../statics/images/copyLink@3x.png"/>
          <p>复制链接</p>
        </div>
        <div class="single" @tap.stop.prevent="toPreviewImage()"
             v-if="this.DomConvertImage && isShowSharePng()">
          <img src="../statics/images/sharePng@2x.png"/>
        </div>
      </div>
    </div>


    <div id="shareImageWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
      <div class="title">分享到</div>
      <div class="more">
        <div class="single" @tap.stop.prevent="shareImageToHaoyou()">
          <img src="../statics/images/wechat_2x.png"/>
        </div>
        <div class="single" @tap.stop.prevent="shareImageToPengyouQuan()">
          <img src="../statics/images/pengyouquan.png"/>
        </div>
        <div class="single" @tap.stop.prevent="saveImage()">
          <img src="../statics/images/save-image@2x.png"/>
        </div>
      </div>
    </div>

    <div id="shareShowWrapper" class="mui-popover mui-popover-action mui-popover-top"
         @tap.stop.prevent="toggleShareNav()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-dianzheli"></use>
      </svg>
    </div>

  </div>
</template>

<script type="text/javascript">

  import Share from '../utils/share'
  import domtoimage from 'dom-to-image'
  import { postRequest } from '../utils/request'
  import { getLocalUrl, saveImageByBase64, createImageThumb, setClipboardText } from '../utils/plus'
  import localEvent from '../stores/localStorage'

  export default {
    data () {
      return {
        createImaged: false,  // 是否已创建图片
        imagePath: '_documents/share.jpeg',  // 图片文件路径名称
        shareImageUrl: ''
      }
    },
    components: {},
    props: {
      title: {
        type: String,
        default: ''
      },
      shareName: {
        type: String,
        default: 'share'
      },
      targetType: {
        type: String,
        default: ''
      },
      targetId: 0,
      link: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      imageUrl: {
        type: String,
        default: ''
      },
      thumbUrl: {
        type: String,
        default: ''
      },
      hideShareBtn: {
        type: Boolean,
        default: false
      },
      DomConvertImage: {
        type: Boolean,
        default: false
      },
      DomConvertImageId: {
        type: String,
        default: 'router-view'
      },
      ImagePreview: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      'link' (newVal, oldVal) {
        this.bindShare()
      }
    },
    mounted () {
      if (this.link) {
        this.bindShare()
      }
    },

    methods: {
      cancelShare () {
        window.mui('#shareWrapper').popover('toggle')
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:cancel',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      shareToCopyLink () {
        setClipboardText(this.link)
        window.mui.toast('已复制')
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:copyLink',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      shareToChat () {
        window.mui('#shareWrapper').popover('toggle')
        this.hide()
        this.$router.pushPlus('/collectUser?from=all')
        // 保存链接
        localEvent.setLocalItem('share', this.link)
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:shareToChat',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      isShowSharePng () {
        if (window.mui.os.wechat) {
          return false
        }
        return !!window.mui.os.android // !!window.mui.os.android   window.mui.os.plus
      },
      bindShare () {
        if (this.$router.currentRoute.meta.wechatHideHeader && window.mui.os.wechat) {
          this.hideShareBtn = true
        }

        var data = {
          title: this.title,
          link: this.link + '&isShare=1',
          content: this.content,
          imageUrl: this.imageUrl,
          thumbUrl: this.thumbUrl
        }

        Share.bindShare(
          this,
          data,
          this.successCallback,
          this.failCallback
        )
      },
      toggleShareNav () {
        window.mui('#shareShowWrapper').popover('toggle')
      },
      shareToHaoyou () {
        if (this.sendHaoyou) {
          this.sendHaoyou()
        }

        if (window.mui.os.plus) {
          window.mui('#shareWrapper').popover('toggle')
        } else {
          window.mui('#shareWrapper').popover('toggle')
          window.mui('#shareShowWrapper').popover('toggle')
        }
        this.hide()
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:shareToHaoyou',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      shareToPengyouQuan () {
        if (this.sendPengYouQuan) {
          this.sendPengYouQuan()
        }
        if (window.mui.os.plus) {
          window.mui('#shareWrapper').popover('toggle')
        } else {
          window.mui('#shareWrapper').popover('toggle')
          window.mui('#shareShowWrapper').popover('toggle')
        }
        this.hide()
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:shareToPengyouQuan',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      createImage (callback) {
        if (!window.mui.os.plus) {
          return false
        }
        if (this.createImaged) {
          var data = {
            title: '',
            link: '',
            content: '',
            imageUrl: this.imagePath,
            thumbUrl: this.imagePath
          }
          Share.setData(data)
          if (callback) {
            callback(this.shareImageUrl)
          }
        } else {
          var node = document.getElementById(this.DomConvertImageId)
          console.log('id:' + this.DomConvertImageId)
          console.log(node)
          if (node) {
            window.mui.waiting()
            domtoimage.toPng(node, {quality: 1}).then((dataUrl) => {
              window.mui.plusReady(() => {
                var b = new window.plus.nativeObj.Bitmap()
                b.loadBase64Data(dataUrl, function () {
                  console.log('创建成功')
                }, function () {
                  console.error('创建失败')
                  window.mui.toast('创建失败')
                })
                b.save(this.imagePath, {
                  overwrite: true,
                  quality: 100
                }, () => {
                  console.log('保存成功')
                  window.mui.closeWaiting()

                  var data = {
                    title: '',
                    link: '',
                    content: '',
                    imageUrl: this.imagePath,
                    thumbUrl: this.imagePath
                  }
                  Share.setData(data)

                  this.createImaged = true

                  if (callback) {
                    getLocalUrl(this.imagePath, (url) => {
                      this.shareImageUrl = url
                      callback(url)
                    })
                  }
                }, () => {
                  console.error('保存失败')
                  window.mui.toast('保存失败')
                })
              })
            }).catch(function (error) {
              console.error('oops, something went wrong!', error)
              window.mui.toast(JSON.stringify(error))
            })
          }
        }
      },
      toPreviewImage () {
        window.mui('#shareWrapper').popover('toggle')
        this.$router.pushPlus('/invitation/preview')
      },
      shareImageToHaoyou () {
        this.createImage(() => {
          if (this.sendHaoyou) {
            this.sendHaoyou()
          }
        })
      },
      shareImageToPengyouQuan () {
        this.createImage(() => {
          if (this.sendPengYouQuan) {
            this.sendPengYouQuan()
          }
        })
      },
      successCallback () {
        this.$emit('success')

        postRequest(`share/wechat/success`, {
          'target': this.link,
          'title': this.title,
          'target_type': this.targetType,
          'target_id': this.targetId
        }).then(response => {

        })
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:success',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      failCallback (error) {
        this.$emit('fail', error)
        console.log(JSON.stringify(error))
        window.mui.toast('分享失败')
      },
      share () {
        if (this.ImagePreview) {
          this.shareImage()
          return
        }

        if (this.link) {
          this.bindShare()
        }

        setTimeout(() => {
          window.mui('#shareWrapper').popover('toggle')
          window.mui('body').on('tap', '.mui-backdrop', () => {
            this.hide()
          })
        }, 150)

        this.$emit('share')
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:show',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      shareImage () {
        if (this.link) {
          this.bindShare()
        }

        setTimeout(() => {
          window.mui('#shareImageWrapper').popover('toggle')
          window.mui('body').on('tap', '.mui-backdrop', () => {
            this.hide()
          })
        }, 150)
      },
      saveImage () {
        this.createImage(() => {
          window.mui.plusReady(() => {
            window.plus.gallery.save(this.imagePath, function () {
              console.log('保存图片到相册成功')
              window.mui.toast('保存成功')
            }, function () {
              console.log('保存图片到相册失败')
              window.mui.toast('保存失败')
            })
          })
        })
      },
      hide () {
        this.$emit('hide')
      },
      getImageByServer (callback) {
        var node = document.getElementById(this.DomConvertImageId)
        // var url = process.env.H5_ROOT + '/?#/invitation/image'
        postRequest('system/htmlToImage', {html: node.innerHTML})
          .then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }
            saveImageByBase64(response.data.data.image, this.imagePath, (url) => {
              createImageThumb(this.imagePath, '_documents/share_thumb.jpeg', (thumbUrl) => {
                var data = {
                  title: '',
                  link: '',
                  content: '',
                  imageUrl: this.imagePath,
                  thumbUrl: thumbUrl
                }
                Share.setData(data)
                this.createImaged = true
                this.shareImageUrl = url
                callback(url)
              })
            })
          })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .shareBtn {
    position: fixed;
    right: 0.266rem;
    top: 0.266rem;
    z-index: 11;
    color: #3c3e44;
  }

  .resumeWrapper .shareBtn {
    position: absolute;
    top: 0.64rem !important;
    font-size: 0.586rem;
    right: 0.826rem;
    color: #808080;
  }

  .mui-content {
    padding: 5.333rem;
    text-align: center;
  }

  .shareWrapper {
    text-align: left;
    .title {
      background: #ececee;
      text-align: center;
      font-size: 0.373rem;
      padding: 0.32rem 0;
      position: relative;
      color: #808080;
      span{
        position: absolute;
        left:0.586rem;
        font-size: 0.4rem;
      }
    }
    .more {
      background: #fff;
      padding: 0.266rem;
      .single {
        height: 1.866rem;
        display: inline-block;
        img {
          width: 1.25rem;
          height: 1.25rem;
          margin: 0 0.266rem;
        }
        p{
          font-size: 0.32rem;
          color: #b4b4b6;
          text-align: center;
        }
      }
    }
  }

  #shareShowWrapper {
    position: absolute;
    right: 0;
    top: 0;
    .icon {
      color: #fff;
      position: absolute;
      right: 0.4rem;
      top: 0.266rem;
      font-size: 1.866rem;
    }
  }


</style>
