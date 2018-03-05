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
  import { selectFileH5 } from '../utils/uploadFile'

  export default {
    data () {
      return {
        images: [],
        selectImgCount: 0,
        finishImgCount: 0
      }
    },
    props: {
      isMultiple: {
        type: Boolean,
        default: false
      },
      ImageMaximum: {
        type: Number,
        default: 1
      }
    },
    mounted () {
    },
    methods: {
      uploadImage: function () {
        this.images = []
        this.selectImgCount = 0
        this.finishImgCount = 0
        if (window.mui.os.plus) {
          this.show()
        } else {
          this.changeAvatarH5()
        }
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
          this.$emit('success', this.images)
        })
      },
      show () {
        window.mui('.info-choose').popover('toggle')
      },
      getImage: function () {
        var t = this
        var c = window.plus.camera.getCamera()
        c.captureImage(function (e) {
          window.mui('.info-choose').popover('toggle')
          t.selectImgCount = 1
          t.toClip(e)
        }, function (s) {
          console.log('error' + s)
        }, {
          filename: '_doc/image.jpg'
        })
      },
      toClip (path, index = 0) {
        var imgInfo = {
          name: 'demo',
          size: '1',
          index: index,
          base64: '',
          isNew: true
        }

        this.images.push(imgInfo)

        var t = this
        window.plus.zip.compressImage({
          src: path,
          dst: '_doc/image_compressed_' + index + '.jpg',
          overwrite: true,
          // width: '27.306rem',
          quality: 100},
          function (event) {
            var newurl = window.plus.io.convertLocalFileSystemURL(event.target)
            if (window.mui.os.ios) {
              newurl = 'file://' + newurl
            }

            console.log('上传的图片地址:' + newurl)

            var bitmap = new window.plus.nativeObj.Bitmap('test')
            bitmap.load(newurl, function () {
              var base64 = bitmap.toBase64Data()
              for (var imgI = 0; imgI < t.images.length; imgI++) {
                if (t.images[imgI].index === index) {
                  t.images[imgI].base64 = base64
                  t.finishImgCount++
                  break
                }
              }
              if (t.finishImgCount === t.selectImgCount) {
                t.$emit('success', t.images)
              }
            }, function (e) {
              t.finishImgCount++
              console.log('加载图片失败：' + JSON.stringify(e))
            })
          }, function (error) {
            t.finishImgCount++
            console.error(error.message)
          })
      },
      galleryImg: function () {
        window.plus.gallery.pick((a) => {
          window.mui('.info-choose').popover('toggle')
          if (this.isMultiple) {
            this.selectImgCount = a.files.length
            for (var i = 0; i < a.files.length; i++) {
              this.toClip(a.files[i], i)
            }
          } else {
            this.selectImgCount = 1
            this.toClip(a)
          }
        }, function (a) {
        }, {
          filter: 'image',
          multiple: this.isMultiple,
          maximum: this.ImageMaximum,
          system: false
        })
      }
    }
  }
</script>

<style scoped="scoped">
  .info-choose {
    width: 100%;
    height: 2.533rem;
    background: #fff !important;
    position: absolute;
    bottom: 0;
    padding-top: 0.346rem;
    padding-left: 1.04rem;
    z-index: 999;
    display: none;

  }

  .info-choose p {
    width: 1.2rem;
    height: 1.893rem;
    float: left;

  }

  .info-choose p:nth-of-type(2) {
    margin-left: 0.96rem;
  }

  .info-choose p svg {
    font-size: 1.28rem;
    color: rgb(220, 220, 220);
  }

  .info-choose p span {
    display: block;
    margin-left: 0.266rem;
    margin-top: 0.053rem;
    color: #808080;
    font-size: 0.346rem;

  }
</style>
