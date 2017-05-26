<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">关于我们</h1>
    </header>
    <div class="mui-content">
      <div class="mui-content-padded" v-html="aboutus">

      </div>
    </div>
  </div>
</template>

<script>
  import {apiRequest} from '../utils/request';

  export default {
    data: () => ({
      aboutus: ''
    }),
    created () {
      apiRequest(`system/service_about`,{}).then(response_data => {
        this.aboutus = response_data.html;
      });
    },
    methods: {

    },
    watch: {

    }
  }

</script>


<style scoped>

</style>
