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
        default: []
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
</style>
