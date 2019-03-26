<template>
  <div class="mui-content">
    <div @tap.stop.prevent="click">点击</div>
    <div class="upvote" id="bm"></div>
  </div>
</template>

<script>
  import upvote from '../bodymovin/upvote.json'
  export default {
    data () {
      return {
        loading: 1,
        lists: [],
        listDataConfig: [
          {
            api: 'recommendRead',
            data: {},
            autoShow: true
          },
          {
            api: 'recommendRead',
            data: {},
            autoShow: false
          }
        ],
        animObject: null
      }
    },
    components: {
    },
    mounted () {

//      anim.stop()
//      anim.destroy()
    },
    methods: {
      upvote () {
        if (!this.animObject) {
          this.animObject = window.bodymovin.loadAnimation({
            container: document.getElementById('bm'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: upvote
          })
          this.animObject.addEventListener('complete', () => {
            console.log('onComplete')
          })
        }
        console.log(this.animObject)
        this.animObject.goToAndPlay(0)
      },
      click () {
        this.upvote()
      }
    }
  }
</script>
<style lang="less" scoped>
  .upvote {
    width: 2.666rem;
    height: 2.666rem;
    margin: 2.666rem auto;
  }
</style>
