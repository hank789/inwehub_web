<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{ title }}</h1>
    </header>


    <div class="mui-content">
      <div class="discoverDetail">


        <div>如果您对该功能感兴趣，就点赞给小哈加加油，我么会优先推出的！</div>


        <img :src="erweima" width="180" style="margin-top:50px;" v-if="title=='智能小哈'"/>
      </div>

    </div>
  </div>
</template>

<script>
  import localEvent from '../../stores/localStorage';
  import {postRequest} from '../../utils/request';
  import erweima from '../../statics/images/xiaoha-erweima.jpeg';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        title:'发现',
        erweima:erweima,
        account_info_complete_percent: currentUser.account_info_complete_percent
      }
    },
    methods: {
      discover() {
        postRequest(`system/func_zan`, {content:this.title}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }


          mui.toast("点赞成功+1");
        });



      }
    },
    created () {
      if (this.$route.query.title) {
         this.title = this.$route.query.title;
      }
    }
  };
</script>


<style scoped>

  .discoverDetail{
    padding:20px;
    margin-top:100px;
    text-align: center;
    line-height: 26px;
  }

  .discoverDetail .mui-icon{
    font-size:50px;
    margin-bottom:20px;

  }
</style>
