<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">注册协议</h1>
    </header>

    <div class="mui-content" v-show="!loading">
      <div class="content" v-html="html">

      </div>
    </div>
  </div>
</template>

<script>

  import { postRequest } from '../../utils/request'

  var Protocol = {
    data: () => ({
      html: '',
      loading: 1
    }),
    mounted () {

    },
    created () {
      // showInwehubWebview();
      postRequest(`system/service_register`, {}).then(response => {
        var code = response.data.code
        if (code !== 1000) {
          window.mui.alert(response.data.message)
          window.mui.back()
          return
        }

        this.html = response.data.data.html
        this.loading = 0
      })
    }
  }
  export default Protocol
</script>


<style scoped>
  .mui-content {
    background: #fff;
  }

  .content {
    padding: 0.266rem 0.4rem;
  }
</style>
