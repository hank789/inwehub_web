<template>
  <img :src="getImage(avatar)">
</template>

<script type="text/javascript">
  import { getImageSuffix } from '../../utils/image'

  export default {
    data () {
      return {}
    },
    components: {},
    props: {
      avatar: {
        type: String,
        default: ''
      }
    },
    created () {

    },
    methods: {
      getImage (src) {
        return getImageSuffix(src, 50, 50)
      }
    },
    mounted () {}
  }
</script>

<style scoped>
</style>
