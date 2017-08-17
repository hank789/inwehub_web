<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">提问帮助</h1>
    </header>

    <div class="mui-content" v-show="!loading">
      <div class="content" v-html="html">

      </div>
    </div>
  </div>
</template>

<script>
  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  var Protocol = {
    data: () => ({
      html: '',
      loading:1
    }),
    mounted(){

    },
    created () {
      //showInwehubWebview();
      postRequest(`system/service_qa_help`, {}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          mui.back();
        }

        this.html = response.data.data.html;
        this.loading = 0;
      });
    }
  }
  export default Protocol;
</script>


<style scoped>
  .mui-content{
    background: #fff;
  }
  .content{
    padding:10px 15px;
  }
</style>
