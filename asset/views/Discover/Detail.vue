<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{ title }}</h1>
    </header>


    <div class="mui-content">
      <div class="discoverDetail">
        <span class="mui-icon fa fa-thumbs-o-up" @tap="discover"></span>
        <div>如果您对该功能感兴趣，就点赞给小哈加加油，我么会优先推出的！</div>
      </div>

    </div>
  </div>
</template>

<script>
  import localEvent from '../../stores/localStorage';
  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        title:'发现',
        account_info_complete_percent: currentUser.account_info_complete_percent
      }
    },
    methods: {
      discover() {
         mui.toast("点赞成功+1");
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
