<template>
<div>
  <img :src="localUrl" width="100%" height="200" id="image"/><br/>
  <button type="button" class="mui-btn  mui-btn-block"
          @tap.stop.prevent="cancel">取消</button>
  <button type="button" class="mui-btn  mui-btn-block"
          @tap.stop.prevent="submit">确定</button>
</div>
</template>

<script>
  import '../../styles/cropper.min.css';
  import  '../../js/cropper.min';
  import localEvent from '../../stores/localStorage';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  export default {
    data:() => ({
        localUrl:'',
        cropper:null,
        img:{
          width:0,
          height:0,
          x:0,
          y:0
        }
    }),
    created(){


    },
    mounted(){
      if (!this.$router.currentRoute.params.file) {
          mui.back();
          return;
      }
      var localUrl =  this.$router.currentRoute.params.file;
      this.clip(localUrl);
    },
    methods: {
      clip(path){
        var image = document.getElementById('image');
        image.src=path;
        var t = this;
        this.cropper = new Cropper(image, {
          aspectRatio: 1/1,
          viewMode:1,
          dragMode:'move',
          rotatable:true,
          checkCrossOrigin:false,
          minCropBoxWidth:200,
          minCropBoxHeight:200,
          minCanvasWidth:200,
          minCanvasHeight:200,
          minContainerWidth:200,
          minContainerHeight:200,
          crop: function(data) {
              t.img.x = data.detail.x;
              t.img.y = data.detail.y;
              t.img.width = data.detail.width;
              t.img.height = data.detail.height;
          }
        });
      },
      cancel(){
        mui.back();
      },
      submit(){
        var options = {
            top: parseInt(this.img.y).toString() + 'px',
            left: parseInt(this.img.x).toString() + 'px',
            width: parseInt(this.img.width).toString() + 'px',
            height: parseInt(this.img.height).toString() + 'px'
        };

        var base64 = this.cropper.getCroppedCanvas().toDataURL('image/png', 0.3);

        var data = {
          user_avatar:base64,
        };

        postRequest(`profile/updateAvatar`, data).then(response => {


          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          mui.toast(response.data.message);

          mui.back();
        });

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
