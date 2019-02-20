<template>
  <div class="mui-content">
    <div id="bm"></div>
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
      var anim = window.bodymovin.loadAnimation({
        container: document.getElementById('bm'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: upvote
      })
      anim.play()
//      anim.stop()
//      anim.destroy()
    },
    methods: {
    }
  }
</script>
