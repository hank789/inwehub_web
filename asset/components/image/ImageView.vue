<template>
    <img class="lazyImg" v-lazy="getImage(src)" v-if="isLazyload" :key="src" :rsrc="getImage(src)"/>
    <img :src="getImage(src)" v-else/>
</template>

<script type="text/javascript">

  import { getImageSuffix } from '../../utils/image'
  import { getDpi } from '../../utils/dom'

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
      isLazyload: {
        type: Boolean,
        default: true
      },
      width: {
        default: 0
      },
      height: {
        default: 0
      }
    },
    created () {},
    methods: {
      getImage (src) {
        var width = parseFloat(this.width)
        if (width) {
          width *= getDpi()
        }
        var height = parseFloat(this.height)
        if (height) {
          height *= getDpi()
        }
        return getImageSuffix(src, width, height)
      }
    }
  }
</script>
