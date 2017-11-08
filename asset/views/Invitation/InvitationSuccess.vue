<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-content absolute">
      <svg class="icon succcess" aria-hidden="true">
        <use xlink:href="#icon-check-circle"></use>
      </svg>
      <div class="succcess_text">
        <p>您的特权已领取～</p>
        <p>登录InweHub使用吧！</p>
      </div>
      <button>下载APP</button>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
  /*清除样式*/
  div, ul, li, p, span, a, i {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .mui-content{
    background: #FFFFFF;
  }
  /*清除样式*/
  div, ul, li, p, span, a, i {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .mui-content{
    background:#f3f4f6;
  }
  header{
    background: #f3f4f6;
  }
  .mui-icon-back:before, .mui-icon-left-nav:before{
    color: #808080;
  }
  /*svg*/

  .succcess{
    font-size:95px;
    color:#c8c8c8;
    position: absolute;
    top:79px;
    left:0;
    right:0;
    margin:auto;
  }
  .succcess_text{
    position: absolute;
    top:208px;
    left:0;
    right:0;
    margin:auto;
  }
  .succcess_text p:nth-of-type(1){
    text-align: center;
    font-size:25px;
    color:#444444;
    font-weight: 500;
  }
  .succcess_text p:nth-of-type(2){
    text-align: center;
    font-size:14px;
    color:#808080;
  }
  /*button*/
  button{
    width:150px;
    height:53px;
    background:#03aef9;
    border-radius:50px;
    text-align: center;
    /*line-height:53px;*/
    font-size:18px;
    color:#ffffff;
  }
</style>
