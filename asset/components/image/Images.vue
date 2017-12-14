<template>
    <div class="container-images" :class="'container-images-' + images.length">
      <div class="container-image"  v-for="(image, index) in images"><img :src="getImage(image)" :data-preview-src="image" :data-preview-group="group"/></div>
    </div>
</template>

<script type="text/javascript">

  import { getImageSuffix } from '../../utils/image'

  export default {
    data () {
      return {}
    },
    components: {},
    props: {
      images: {
        type: Array,
        default: () => {
          return []
        }
      },
      group: {
        default: '1'
      },
      isImagePreview: {
        type: Boolean,
        default: true
      }
    },
    created () {

    },
    methods: {
      getImage (src) {
        return getImageSuffix(src, 452, 452)
      }
    },
    mounted () {
      if (this.isImagePreview) {
        window.mui.previewImage()
      }
    }
  }
</script>

<style scoped>
  .newestList .container-images{
    padding:0;
  }

  .newestList .container-image{
    margin-right:5px;
  }

  .container-images .container-image:only-child {
    width: 226px !important;
    height: auto !important;
    max-width: 226px !important;
    max-height: 226px !important;
  }
</style>
