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
  import localEvent from '../stores/localStorage';
  import {selectFileH5} from '../utils/uploadFile';

  export default {


    methods: {
      uploadAvatar:function(){
        if (mui.os.plus) {
          this.show();
        } else {
          this.changeAvatarH5();
        }
      },
      changeAvatarH5:function(){
        selectFileH5('img', (file, base64) => {
          this.$router.push({path:'/header-h5', params:{file:file}}, function(router){
            router.params.file = base64;
          });
        });
      },
      show(){
        mui(".info-choose").popover('toggle');
      },
      getImage:function(){
        var t = this;
        var c = plus.camera.getCamera();
        c.captureImage(function (e) {
          t.toClip(e);

        }, function (s) {
          console.log("error" + s);
        }, {
          filename: "_doc/head.jpg"
        })
      },
      toClip(path)
      {
        var t = this;
        plus.zip.compressImage({
            src: path,
            dst: "_doc/c.jpg",
            overwrite: true,
            quality: 20
          },
          function (event) {

            var newurl = plus.io.convertLocalFileSystemURL(event.target);
            if (mui.os.ios) {
              newurl = 'file://' + newurl;
            }

            plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
              t.localUrl = entry.toRemoteURL();
              localEvent.setLocalItem('avatar', {url: t.localUrl, path: entry.toLocalURL()});
              t.$router.push('/header');
            }, function (error) {
              alert(error.message);
            });
          }, function (error) {
            alert("Compress error!" + error.message);
          });
      },
      galleryImg:function(){
        plus.gallery.pick((a) => {
          this.toClip(a);
        }, function (a) {
        }, {
          filter: "image"
        })
      },
    }
  }
</script>

<style scoped="scoped">
  .info-choose{
    width: 100%;
    height:95px;
    background: #FFFFFF;
    position: absolute;
    bottom: 0;
    padding-top:13px;
    padding-left: 39px;
    z-index: 999;
    display: none;

  }
  .info-choose p{
    width: 45px;
    height: 71px;
    float: left;

  }
  .info-choose p:nth-of-type(2){
    margin-left: 36px;
  }
  .info-choose p svg{
    font-size: 48px;
    color: rgb(220,220,220);
  }

  .info-choose p span{
    display: block;
    margin-left: 10px;
    margin-top: 2px;
    color:#808080;
    font-size: 13px;

  }
</style>
