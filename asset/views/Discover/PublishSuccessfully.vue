<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-content">
       <div class="publishSuccessfully">
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-check-circle-o"></use>
         </svg>
         <p>发布成功！</p>
         <p>你可以通过我的-我的发布来管理发现</p>
         <button>查看发布</button>
       </div>
    </div>
  </div>
</template>

<script>

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
    /*border:1px solid #000000;*/
    width:238px;
    height:320px;
    overflow: hidden;
    position: absolute;
    top:100px;
    left:0;
    right:0;
    margin: auto;
    text-align: center;
  }
  .publishSuccessfully svg{
    font-size:124px;
    color:#dcdcdc;

  }
  .publishSuccessfully p:nth-of-type(1){
    font-size:20px;
    color:#323232;
    margin-top: 46px;
  }
  .publishSuccessfully p:nth-of-type(2){
    font-size:14px;
    color:#808080;
    margin-top:12px;
  }
  .publishSuccessfully button{
    width:115px;
    height:44px;
    background:#03aef9;
    font-size:16px;
    color:#FFFFFF;
    margin-top:47px;
  }
</style>
