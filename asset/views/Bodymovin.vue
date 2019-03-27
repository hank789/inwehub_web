<template>
  <div class="mui-content">
    <div @tap.stop.prevent="click">点击</div>
    <div class="upvote bm_1"></div>
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
        animObjects: []
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
        var animObject = this.getAnimObject(1)
        animObject.goToAndPlay(0)
      },
      getAnimObject (index) {
        if (!this.animObjects[index]) {
          var animObject = window.bodymovin.loadAnimation({
            container: document.querySelector('.bm_' + index),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: upvote
          })
          animObject.addEventListener('complete', () => {
            console.log('onComplete')
          })
          this.animObjects[index] = animObject
        }

        return this.animObjects[index]
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
