<template>

</template>

<script>
  import {apiRequest} from '../utils/request';
  import {browser} from '../utils/browser';

  export default {
    data: () => ({
      about_us_url: ''
    }),
    created () {
      apiRequest(`system/getH5Url`,{}).then(response_data => {
        this.about_us_url = response_data.about_us_url;
      });
    },
    methods: {
    },
    mounted(){
      new browser({// 支持字符串，函数
        url: function() {
          return this.about_us_url;
        },
        bounce: true, // 设置回弹
        style: { // 浏览器样式
          top: '44px',
          bottom: '0px'
        },
        title: false,
        loading: function () {
          plus.nativeUI.showWaiting();
        },
        loaded: function () {
          plus.nativeUI.closeWaiting();
        }
      })
    }
  }

</script>


<style scoped>
  .mui-content{
  }
  .title{
    color:#aba9ab;
    height:40px;
    line-height:40px;
    padding-left:10px;
  }
  .feedback{
  }
  .feedback textarea{
    height:200px;
  }

  .textarea-wrapper{
    position: relative;
    margin:0 5px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
    padding-bottom:20px;
  }
  .textarea-wrapper textarea{
    padding-bottom:0;
    margin-bottom:0;
    border:none;
  }
  .textarea-wrapper .counter{
    position: absolute;
    right: 10px;
    bottom: 2px;
    color:#999;
  }
  .button-wrapper{
    margin-top:40px;
    padding:0 50px;
  }
</style>
