<template>
  <div>
    <a class="mui-icon shareBtn mui-pull-right" @tap.stop.prevent="share()" v-if="!hideShareBtn">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-fenxiang"></use>
      </svg>
    </a>

    <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
      <div class="title">分享到</div>
      <div class="more">
        <div class="single" @tap.stop.prevent="shareToHaoyou()">
          <img src="../statics/images/wechat_2x.png"/>
        </div>
        <div class="single" @tap.stop.prevent="shareToPengyouQuan()">
          <img src="../statics/images/pengyouquan.png"/>
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
  import { getLocalUrl } from '../utils/plus'

  export default {
    data () {
      return {
        createImaged: false,  // 是否已创建图片
        imagePath: '_www/share.jpeg',  // 图片文件路径名称
        shareImageUrl: ''
      }
    },
    components: {},
    props: {
      title: {
        type: String,
        default: ''
      },
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
      isShowSharePng () {
        return !!window.mui.os.android
      },
      bindShare () {
        var data = {
          title: this.title.substr(0, 50),
          link: this.link + '&isShare=1',
          content: this.content.substr(0, 150),
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
                  console.log('创建失败')
                })
                b.save(this.imagePath, {
                  overwrite: true,
                  quality: 100
                }, () => {
                  console.log('保存成功')
                  var data = {
                    title: '',
                    link: '',
                    content: '',
                    imageUrl: this.imagePath,
                    thumbUrl: this.imagePath
                  }
                  Share.setData(data)

                  this.createImaged = true
                  window.mui.closeWaiting()

                  if (callback) {
                    getLocalUrl(this.imagePath, (url) => {
                      this.shareImageUrl = url
                      callback(url)
                    })
                  }
                }, () => {
                  console.log('保存失败')
                })
              })
            })
          }
        }
      },
      toPreviewImage () {
        window.mui('#shareImageWrapper').popover('toggle')
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
          'title': this.title
        }).then(response => {

        })
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:success',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.link,
              'page_name': 'share',
              'page_title': this.title,
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

      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .shareBtn {
    position: fixed;
    right: 10px;
    top: 10px;
    z-index: 11;
    color: #fff;
  }

  .resumeWrapper .shareBtn {
    position: absolute;
    top: 24px !important;
    font-size: 22px;
    right: 31px;
    color: #808080;
  }

  .mui-content {
    padding: 200px;
    text-align: center;
  }

  .shareWrapper {
    text-align: left;

    .title {
      background: #ececee;
      text-align: center;
      font-size: 14px;
      padding: 12px 0;
    }
    .more {
      background: #fff;
      padding: 10px;
      .single {
        width: 55px;
        height: 55px;
        margin: 0 10px;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
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
      right: 15px;
      top: 10px;
      font-size: 70px;
    }
  }


</style>
