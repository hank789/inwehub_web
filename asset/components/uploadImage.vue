<template>
  <div class="info-choose mui-popover mui-popover-action mui-popover-bottom" id="mui-popover-action">
    <p @tap.stop.prevent="galleryImg()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xiangce"></use>
      </svg>
      <span>相册</span>
    </p>
    <p @tap.stop.prevent="getImage()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xiangji"></use>
      </svg>
      <span>相机</span>
    </p>
  </div>
</template>

<script type="text/javascript">
  import localEvent from '../stores/localStorage'
  import { selectFileH5 } from '../utils/uploadFile'

  export default {
    data () {
      return {
        images: []
      }
    },
    methods: {
      uploadImage: function () {
        this.show()

//        if (window.mui.os.plus) {
//          this.show()
//        } else {
//          this.changeAvatarH5()
//        }
      },
      changeAvatarH5: function () {
        selectFileH5('img', (file, base64) => {
          var imgInfo = {
            name: file.name,
            size: file.size,
            base64: base64,
            isNew: true
          }
          this.images.push(imgInfo)
          this.$emit('input', this.images)
        })
      },
      show () {
        window.mui('.info-choose').popover('toggle')
      },
      getImage: function () {
        var t = this
        var c = window.plus.camera.getCamera()
        c.captureImage(function (e) {
          t.toClip(e)
        }, function (s) {
          console.log('error' + s)
        }, {
          filename: '_doc/image.jpg'
        })
      },
      toClip (path) {
        window.mui('.info-choose').popover('toggle')

        var t = this
        window.plus.zip.compressImage({
          src: path,
          dst: '_doc/image_compressed.jpg',
          overwrite: true,
          quality: 50},
          function (event) {
            var newurl = window.plus.io.convertLocalFileSystemURL(event.target)
            if (window.mui.os.ios) {
              newurl = 'file://' + newurl
            }

            var bitmap = new window.plus.nativeObj.Bitmap('test')
            bitmap.load(newurl, function () {
              var base64 = bitmap.toBase64Data()
              var imgInfo = {
                name: 'demo',
                size: '1',
                base64: base64,
                isNew: true
              }
              t.images.push(imgInfo)
              t.$emit('input', t.images)
            }, function (e) {
              console.log('加载图片失败：' + JSON.stringify(e))
            })
          }, function (error) {
            console.error(error.message)
          })
      },
      galleryImg: function () {
        window.plus.gallery.pick((a) => {
          this.toClip(a)
        }, function (a) {
        }, {
          filter: 'image'
        })
      }
    }
  }
</script>

<style scoped="scoped">
  .info-choose {
    width: 100%;
    height: 95px;
    background: #fff !important;
    position: absolute;
    bottom: 0;
    padding-top: 13px;
    padding-left: 39px;
    z-index: 999;
    display: none;

  }

  .info-choose p {
    width: 45px;
    height: 71px;
    float: left;

  }

  .info-choose p:nth-of-type(2) {
    margin-left: 36px;
  }

  .info-choose p svg {
    font-size: 48px;
    color: rgb(220, 220, 220);
  }

  .info-choose p span {
    display: block;
    margin-left: 10px;
    margin-top: 2px;
    color: #808080;
    font-size: 13px;

  }
</style>
