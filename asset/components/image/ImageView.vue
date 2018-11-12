<template>
    <img class="lazyImg" v-lazy="getImage(src)" v-if="isLazyload"/>
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
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      }
    },
    created () {},
    methods: {
      getImage (src) {
        if (this.width) {
          this.width *= getDpi()
        }
        if (this.height) {
          this.height *= getDpi()
        }
        return getImageSuffix(src, this.width, this.height)
      }
    }
  }
</script>
