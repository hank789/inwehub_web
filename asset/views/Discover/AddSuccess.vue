<template>
  <div>
    <div class="mui-content">
       <div class="publishSuccessfully">
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-check-circle-o"></use>
         </svg>
         <p>发布成功！</p>
         <p>你可以通过我的-我的发布来管理发现</p>
         <button @tap.stop.prevent="$router.pushPlus('/home')">返回首页</button>
       </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
    },
    created () {
    }
  }
</script>

<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a,
  button{
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  header{
    background:#f3f4f6;
  }
  header .mui-icon {
    color:#b4b4b6;
  }
  .mui-content {
    background:#f3f4f6;
  }
  .publishSuccessfully{
    /*border:0.026rem solid #000000;*/
    width:6.346rem;
    height:8.533rem;
    overflow: hidden;
    position: absolute;
    top:2.666rem;
    left:0;
    right:0;
    margin: auto;
    text-align: center;
  }
  .publishSuccessfully svg{
    font-size:3.306rem;
    color:#dcdcdc;

  }
  .publishSuccessfully p:nth-of-type(1){
    font-size:0.533rem;
    color:#323232;
    margin-top: 1.226rem;
  }
  .publishSuccessfully p:nth-of-type(2){
    font-size:0.373rem;
    color:#808080;
    margin-top:0.32rem;
  }
  .publishSuccessfully button{
    width:3.066rem;
    height:1.173rem;
    background:#03aef9;
    font-size:0.426rem;
    color:#FFFFFF;
    margin-top:1.253rem;
    border: none;
  }
</style>
