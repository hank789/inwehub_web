<template>
  <div>
    <div class="container-images">
      <div class="container-image" v-for="(image, index) in images"><img :src="image"/></div>
    </div>
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
      }
    },
    created () {

    },
    methods: {}
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
