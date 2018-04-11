<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left"  @tap.stop.prevent="empty()"></a>
      <h1 class="mui-title">创建圈子</h1>
    </header>
    <div class="mui-content">
    <div class="imagesContainer">

    </div>
        <div class="groupImageWrapper" v-if="images.length">
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
            <use xlink:href="#icon-times1"></use>
          </svg>
          <img :id="'image_' + index" :src="images[0].base64" :data-preview-src="images[0].base64" :data-preview-group="1"/>
        </div>
         <div class="container-image component-photograph" @tap.stop.prevent="uploadImage()" v-if="images.length < maxImageCount"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>

    </div>
    <uploadImage ref="uploadImage"
                 :isMultiple="true"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount - this.images.length"
    ></uploadImage>
  </div>
</template>
<script>
  import uploadImage from '../../components/uploadImage'
  export default {
    data () {
      return {
        images: [],
        maxImageCount: 1
      }
    },
    components: {
      uploadImage
    },
    created () {
    },
    mounted () {

    },
    methods: {
      uploadImage: function () {
        this.$refs.uploadImage.uploadImage()
      },
      uploadImageSuccess (images) {
        for (var i = 0; i < images.length; i++) {
          this.images.push(images[i])
        }
      },
      delImg (index) {
        this.images.splice(index, 1)
      }
    }
  }
</script>
<style scoped>
  .mui-content{
    background: #fff;
  }
  .groupImageWrapper img{
    width:1.626rem;
    height:1.626rem;
  }
  .component-photograph{
    width:1.626rem !important;
    height:1.626rem !important;
  }
  .imagesContainer{
    width:100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
