<template>
    <img class="lazyImg" v-lazy="getImage(src)" v-if="isLazyload" :key="src" :rsrc="getImage(src)"/>
    <img :src="getImage(src)" :key="src" v-else/>
</template>

<script type="text/javascript">

  import { getImageSuffix } from '../../utils/image'
  import { getDpi } from '../../utils/dom'
  import { getCacheImage } from '../../utils/plus'

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
      saveToLocal: {
        type: Boolean,
        default: false
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
        var formatSrc = getImageSuffix(src, width, height)
        if (this.saveToLocal && window.mui.os.ios) {
          // 存储到本地
          formatSrc = getCacheImage(formatSrc, (imgUrl) => {})
        }
        return formatSrc
      }
    }
  }
</script>
