<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{title}}</h1>
    </header>
  </div>
</template>


<script>
  import { goVendorUrl } from '../../utils/webview'

  export default {
    data: () => ({
      loading: 1,
      title: '加载中...'
    }),
    created () {
      var url = decodeURIComponent(this.$route.params.url)
      var customTitle = this.$route.params.title ? decodeURIComponent(this.$route.params.title) : null

      goVendorUrl(url, (title) => {
        if (!customTitle) {
          this.title = title
        } else {
          this.title = customTitle
        }
      })
    },
    methods: {
    },
    watch: {},
    mounted () {
    }
  }

</script>
