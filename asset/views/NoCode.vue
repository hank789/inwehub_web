<template>
  <div>

    <div class="mui-content">
      <div class="basic">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      </div>

      <div class="contentWrapper">
          <div class="title">如何获取邀请码?</div>
          <div class="imgWrapper"><img src="../statics/images/nocode.png"/></div>
          <div class="demo">截图并扫描二维码<br/>
或微信内搜索关注InweHub公众号后<br/>
点击“我要邀请码”</div>
      </div>

    </div>

  </div>
</template>

<script>
  import {apiRequest, postRequest} from '../utils/request';
  import localEvent from '../stores/localStorage';

  export default {
    data(){
      return {
        loading: 1,
        type:null,
      }
    },
    computed: {

    },
    methods: {

    },
    mounted(){

    },
    created(){

      this.type = this.$route.query.type;
    }
  };
</script>

<style scoped="scoped">
  .mui-content{
    position: absolute;
    width:100%;
    top:0;
    left:0;
    bottom:0;
    background: #f3f4f6;
    text-align: center;
  }

  .basic{
    position: relative;
    width:100%;
    height:129px;
    text-align: center;
  }

  .basic a{
    position: absolute;
    color:#b4b4b6;
    font-size:30px;
    top:17px;
    left:6px;
  }

  .contentWrapper{
    text-align: center;
  }

  .title{
    color:#323232;
    font-size:20px;
    margin-bottom:22px;
  }

  .imgWrapper img{
    width:185px;
    position: relative;
    left:-20px;
  }

  .demo{
    margin-top:22px;
    font-size:14px;
    color:#808080;
  }
</style>
