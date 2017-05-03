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

  export default {
    data:() => ({
        localUrl:'/images/uicon.jpg',
        cropper:null,
        img:{
          width:0,
          height:0,
          x:0,
          y:0
        }
    }),
    created(){
       this.localUrl = this.$route.query.src;
    },
    mounted(){
      var t = this;
      mui.plusReady(function () {
        t.clip();
      });
    },
    methods: {
      clip(){
        var image = document.getElementById('image');
        var t = this;
        this.cropper = new Cropper(image, {
          aspectRatio: 1/1,
          dragMode:'move',
          rotatable:true,
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
        this.$router.go(-1);
      },
      submit(){
        var t = this;
        plus.zip.compressImage(
          {
            src: this.localUrl, //src在这里是第一步Url里的src。也就是本地路径
            dst: '_doc/a.jpg',
            overwrite: true,
            clip: {
              top: this.img.y + 'px',
              left: this.img.x + 'px',
              width: this.img.width + 'px',
              height: this.img.height + 'px'
            }
          },
          function(e) {
            mui.alert(e.target); //压缩图片
          }
        );
      }
    }
  }
</script>
