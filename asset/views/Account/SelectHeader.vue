<template>
  <div>
    <div class="imageWrapper">
      <img :src="localUrl" width="100%" height="200" id="image"/>
    </div>
    <button type="button" class="mui-btn  mui-btn-block" @tap.stop.prevent="cancel">取消</button>
    <button type="button" class="mui-btn  mui-btn-block" @tap.stop.prevent="submit">确定</button>
  </div>
</template>

<script>
  /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "crop" }] */
  import '../../js/cropper.min'
  import localEvent from '../../stores/localStorage'
  import { createAPI } from '../../utils/request'

  export default {
    data: () => ({
      localUrl: '',
      localPath: '',
      cropper: null,
      img: {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      }
    }),
    created () {

    },
    mounted () {
      var path = localEvent.getLocalItem('avatar')
      this.localUrl = path.url
      this.localPath = path.path
      this.clip(path.url)
    },
    methods: {
      clip (path) {
        var image = document.getElementById('image')
        image.src = path
        var t = this
        var crop = new window.Cropper(image, {
          aspectRatio: 1 / 1,
          viewMode: 1,
          dragMode: 'move',
          rotatable: true,
          checkCrossOrigin: false,
          minCropBoxWidth: 200,
          minCropBoxHeight: 200,
          minCanvasWidth: 200,
          minCanvasHeight: 200,
          minContainerWidth: 200,
          minContainerHeight: 200,
          crop: function (data) {
            t.img.x = data.detail.x
            t.img.y = data.detail.y
            t.img.width = data.detail.width
            t.img.height = data.detail.height
          }
        })
      },
      cancel () {
        window.mui.back()
      },
      upload (file) {
        var task = window.plus.uploader.createUpload(createAPI('profile/updateAvatar'), {
          method: 'POST',
          blocksize: 204800,
          priority: 100
        },
          function (t, status) {
            // 上传完成
            if (status === 200) {
              var response = JSON.parse(t.responseText)
              if (response.code === 1000) {
                var url = JSON.parse(t.responseText).data.user_avatar_url
                const UserInfo = localEvent.getLocalItem('UserInfo')
                UserInfo.avatar_url = url
                localEvent.setLocalItem('UserInfo', UserInfo)
              } else {
                window.mui.alert(response.message)
              }
              window.mui.back()
            } else {
              window.mui.alert('Upload failed: ' + status)
            }
          }
        )
        task.addFile(file, {
          key: 'user_avatar'
        })
        const UserLoginInfo = localEvent.getLocalItem('UserLoginInfo')
        task.setRequestHeader('Authorization', 'bearer ' + UserLoginInfo.token)
        task.start()
      },
      submit () {
        var options = {
          top: parseInt(this.img.y).toString() + 'px',
          left: parseInt(this.img.x).toString() + 'px',
          width: parseInt(this.img.width).toString() + 'px',
          height: parseInt(this.img.height).toString() + 'px'
        }
        var src = this.localPath

        var t = this
        window.plus.zip.compressImage({
          src: src, // src在这里是第一步Url里的src。也就是本地路径
          dst: '_doc/user_avatar.jpg',
          overwrite: true,
          clip: options
        },
          function () {
            window.plus.zip.compressImage({
              src: '_doc/user_avatar.jpg', // src在这里是第一步Url里的src。也就是本地路径
              dst: '_doc/user_avatar.jpg',
              overwrite: true,
              width: '5.333rem',
              height: '5.333rem'
            },
            function (e) {
              t.upload(e.target)
            },
            function (error) {
              window.mui.alert(error.message)
            })
          },
          function (error) {
            window.mui.alert(error.message)
          }
        )
      }
    }
  }
</script>


<style scoped="scoped">
  .imageWrapper {
    height: 8rem;
    margin-bottom: 0.4rem;
  }
</style>
