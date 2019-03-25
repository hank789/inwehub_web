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
        ]
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
        var anim = window.bodymovin.loadAnimation({
          container: document.getElementById('bm'),
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: upvote
        })
        anim.play()
      },
      click () {
        this.upvote()
      }
    }
  }
</script>
<style lang="less" scoped>
  .upvote {
    width: 100px;
    height: 100px;
    margin: 100px auto;
  }
</style>
