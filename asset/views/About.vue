<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">关于我们</h1>
    </header>
    <div class="mui-content" v-show="!loading">
      <div class="mui-content-padded" v-html="aboutus">

      </div>
    </div>
  </div>
</template>

<script>
  import { apiRequest } from '../utils/request'

  export default {
    data: () => ({
      aboutus: '',
      loading: 1
    }),
    created () {
      // showInwehubWebview();
      apiRequest(`system/service_about`, {}).then(responseData => {
        if (responseData === false) {
          return
        }
        this.aboutus = responseData.html
        this.loading = 0
      })
    },
    methods: {},
    watch: {}
  }

</script>


<style scoped>
  .mui-content {
    background: #fff;
    padding-bottom: 1.5rem;
  }
</style>
