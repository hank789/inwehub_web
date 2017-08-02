<template>
<div>
  <iframe v-show="iframeState" id="show-iframe"  @load="loaded" frameborder=0 name="showHere" scrolling=auto :src="url"></iframe>

</div>

</template>
<style>

</style>
<script>
  export default{
    props: {
      url: {
        required: true
      }
    },
    data () {
      return {
        iframeState: false
      }
    },
    watch: {
      url (value) {

      }
    },
    mounted () {
      const oIframe = document.getElementById('show-iframe');
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      oIframe.style.width = deviceWidth + 'px';
      oIframe.style.height = deviceHeight + 'px';
      this.iframeState = true;
    },
    methods: {
      loaded() {
          console.log('loaded');
      }
    }
  }
</script>
