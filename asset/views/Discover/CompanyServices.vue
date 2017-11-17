<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">企业列表</h1>
    </header>
    <div class="mui-content">
      <ul class="services_container">
        <li class="container-image">
           <img src="../../statics/images/guide_01.png" />
           <i class="bot"></i>
        </li>
        <li class="container-image">
          <img src="../../statics/images/guide_01.png" />
          <i class="bot"></i>
        </li>
        <li class="container-image">
          <img src="../../statics/images/guide_01.png" />
          <i class="bot"></i>
        </li>
        <li class="container-image">
          <img src="../../statics/images/guide_01.png" />
          <i class="bot"></i>
        </li>
      </ul>
      <div class="apply">
         <p>我也可以提供服务</p>
         <p>如您或您的公司希望在InweHub展示业务开展合作</p>
         <p>点此申请</p>
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
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }
  .mui-content{
    background:#FFFFFF;
  }
  .bot {
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .services_container{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .services_container li:nth-last-child(1) .bot{
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #FFFFFF;
  }
  .container-image{
    padding: 15px 0;
    height:128px;
    border-radius:4px;
    position: relative;
  }


  /*申请企业服务*/
  .apply{
    width:100%;
    height:126px;
    background: url("../../statics/images/company_services_list.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
    margin-top: 15px;
    position: relative;
  }
  .apply p{
    position: absolute;
    left:0;
    right:0;
    margin: auto;
  }
  .apply p:nth-of-type(1){
    width:160px;
    height:35px;
    font-size:16px;
    color:#ffffff;
    text-align: center;
    line-height:30px;
    font-weight: 500;
    border:1.5px solid #c2cddc;
    top:20px;
  }
  .apply p:nth-of-type(2) {
    top:68px;
    line-height: 18px;
    font-size:13px;
    color:#FFFFFF;

  }
  .apply p:nth-of-type(3){
    top:89px;
    line-height: 18px;
    font-size:13px;
    color:#FFFFFF;
  }

</style>
