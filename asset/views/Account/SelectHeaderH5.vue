<template>
  <div class="mui-content">
    <div class="imageWrapper">
      <img :src="localUrl" width="100%" height="200" id="image"/>
    </div>

    <button type="button" class="mui-btn  mui-btn-block"
            @tap.stop.prevent="cancel">取消
    </button>
    <button type="button" class="mui-btn  mui-btn-block"
            @tap.stop.prevent="submit">确定
    </button>
  </div>
</template>

<script>
  import '../../js/cropper.min'
  import localEvent from '../../stores/localStorage'
  import { postRequest } from '../../utils/request'

  export default {
    data: () => ({
      localUrl: '',
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
      if (!this.$router.currentRoute.params.file) {
        window.mui.back()
        return
      }
      var localUrl = this.$router.currentRoute.params.file
      this.clip(localUrl)
    },
    methods: {
      clip (path) {
        var image = document.getElementById('image')
        image.src = path
        var t = this
        this.cropper = new window.Cropper(image, {
          aspectRatio: 1 / 1,
          viewMode: 1,
          dragMode: 'move',
          rotatable: true,
          checkCrossOrigin: false,
          minCropBoxWidth: 200,
          minCropBoxHeight: 200,
          minCanvasWidth: 200,
          minCanvasHeight: 200,
          maxCanvasHeight: 200,
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
      submit () {
//        var options = {
//          top: parseInt(this.img.y).toString() + 'px',
//          left: parseInt(this.img.x).toString() + 'px',
//          width: parseInt(this.img.width).toString() + 'px',
//          height: parseInt(this.img.height).toString() + 'px'
//        }

        // var base64Pre = this.cropper.getCroppedCanvas().toDataURL();
        var base64 = this.cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.1)

        // console.log('压缩前长度:'+(base64Pre.length*2/1000/1024));
        console.log('压缩后长度:' + (base64.length * 2 / 1000 / 1024))

        var data = {
          user_avatar: base64
        }

        postRequest(`profile/updateAvatar`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          window.mui.toast(response.data.message)

          var userAvatarUrl = response.data.data.user_avatar_url
          var userInfo = localEvent.getLocalItem('UserInfo')
          userInfo.avatar_url = userAvatarUrl
          localEvent.setLocalItem('UserInfo', userInfo)

          window.mui.back()
        })

//        this.cropper.getCroppedCanvas().toDataURL(function (blob) {
//          var formData = new FormData();
//          console.log(blob);
//          formData.append('user_avatar', blob);
//
//
//        });
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
