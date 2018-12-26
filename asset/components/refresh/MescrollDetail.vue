<template>
  <div class='mescrollDetailWrapper'>
    <mescroll-vue ref='mescroll' :down='config.down' :up="config.up" @init='mescrollInit'>
      <div v-show="!isLoading">
        <slot></slot>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import 'mescroll.js/mescroll.min.css'

  export default {
    name: 'MescrollDetail',
    components: {
      MescrollVue
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        mescroll: null,
        config: {
          down: {
            auto: false,
            offset: 60,
            htmlContent: '<p class="downwarp-progress"><p>',
            callback: this.downCallback,
            mustToTop: true
          },
          up: {
            use: false
          }
        }
      }
    },
    methods: {
      scrollToTop () {
        this.mescroll.scrollTo(0)
      },
      scrollTo (x, y, time) {
        console.log('yy:' + y)
        this.mescroll.scrollTo(y, time)
      },
      downCallback (mescroll) {
        this.$emit('refreshPageData', mescroll)
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
        this.$emit('init', mescroll)
      },
      finish () {
        this.mescroll.endSuccess()
      }
    }
  }
</script>
<style scoped="scoped">
.mescrollDetailWrapper{
  position: absolute;
  width:100%;
  overflow: hidden;
  top: 0;
  left:0;
  bottom:0;
}
</style>
