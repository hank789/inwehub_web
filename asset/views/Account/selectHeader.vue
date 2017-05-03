<template>
<div>
  <img :src="localUrl" width="200" height="200" id="image"/><br/>
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
        cropper:null
    }),
    created(){
       //this.localUrl =  '/images/uicon.jpg';this.$route.query.src;
    },
    mounted(){
      this.clip();
    },
    methods: {
      clip(){
        var image = document.getElementById('image');
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
          }
        });
      },
      cancel(){
        this.$router.go(-1);
      },
      submit(){
        var resImg =  this.cropper.getCroppedCanvas({
          width: 200,
          height: 200
        }).toDataURL();
        mui.alert(resImg);
      }
    }
  }
</script>
