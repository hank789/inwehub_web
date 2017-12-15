<template>
  <div class="container-image">
    <img :src="getImage(src)" :data-preview-src="src" :data-preview-group="group"/>
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
      src: {
        type: String,
        default: ''
      },
      isImagePreview: {
        type: Boolean,
        default: true
      },
      isSmallImage: {
        type: Boolean,
        default: true
      }
    },
    created () {

    },
    methods: {
      getImage (src) {
        if (!this.isSmallImage) {
          return src
        }
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
