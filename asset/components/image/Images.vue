<template>
    <div class="container-images">
      <div class="container-image"  v-for="(image, index) in images"><img :src="image" data-preview-src="" :data-preview-group="group"/></div>
    </div>
</template>

<script type="text/javascript">

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
        type: String,
        default: '1'
      },
      isImagePreview: {
        type: Boolean,
        default: true
      }
    },
    created () {

    },
    methods: {},
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
    width: 108px;
    height: 108px;
    margin-right:5px;
  }

  .container-images .container-image:only-child {
    width: 226px !important;
    height: auto !important;
    max-width: 226px !important;
    max-height: 226px !important;
  }
</style>
