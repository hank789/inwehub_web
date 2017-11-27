<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">附近企业</h1>
    </header>
    <div class="mui-content absolute">
      <!--搜索框-->
     <div class="searchContainer">
       <p>
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-sousuo"></use>
         </svg>
         <input type="text" placeholder="输入公司名称"/>
         <span>
           <svg class="icon" aria-hidden="true">
             <use xlink:href="#icon-guanbi"></use>
           </svg>
         </span>
       </p>
     </div>
      <!--申请添加-->
      <div class="apply">
        <p>搜不到？</p>
        <p>申请添加 </p>
        <i class="bot"></i>
      </div>
      <!--搜索列表-->
      <ul>
        <li>
          <div class="container-image">
             <img src="../../statics/images/guide_01.png"/>
          </div>
          <div class="container-info">
            <p>思爱普（中国）有限公司</p>
            <p>专业服务<i></i>其他</p>
            <p><span>上海市黄浦区</span> <span>< 200m</span></p>
          </div>
          <i class="bottom"></i>
        </li>
        <li>

        </li>
        <li>

        </li>
      </ul>

    </div>
  </div>
</template>

<script>
</script>

<style scoped="scoped">
  ul,
  li,
  p,
  span,
  a,
  i,
  input{
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bot {
    position: absolute;
    right: 4%;
    bottom: 0;
    left: 4%;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .bottom {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-content {
    background:#fefefe;
  }
  /*搜索框*/
  .searchContainer{
    width:100%;
    height:54px;
    background:#f3f4f6;
    padding-top: 10px;
  }
  .searchContainer p{
    width:92%;
    height:34px;
    background: #FFFFFF;
    border-radius: 50px;
    margin-left: 4%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-between;
    align-items:center;
    padding:0 12px;
  }
  .searchContainer input{
    width:85%;
    height:100%;
    margin: 0;
    border:none;
    padding-left: 0;
    font-size:14px;
    color:#444444;
  }
  .searchContainer p svg{
    color:#c8c8c8;
    font-size: 17px;
  }
  .searchContainer span{
    width:18px;
    height:18px;
    background: #c8c8c8;
    border-radius: 50%;
    position: relative;
  }
  .searchContainer span svg{
    color: #FFFFFF;
    position: absolute;
    right:0;
    left:0;
    top:0;
    bottom:0;
    margin:auto;
  }
  /*申请添加*/
.apply{
  width:100%;
  height:45px;
  padding: 0 4%;
  line-height: 45px;
  position: relative;
  }
  .apply p:nth-of-type(1){
    float: left;
    font-size:14px;
    color:#03aef9;
  }
  .apply p:nth-of-type(2){
    float: right;
    width:86px;
    height:27px;
    border-radius: 50px;
    border:1px solid #03aef9;
    font-size:14px;
    color:#03aef9;
    text-align: center;
    line-height: 25px;
    margin-top: 9px;
  }
  ul{
    width:100%;
    padding: 0 4%;
    overflow: hidden;
  }
  ul li{
    width:100%;
    height:89px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-between;
    align-items:center;
    position: relative;
  }
  ul li .container-image{
    width:42px;
    height:42px;
  }
  .container-info{
    width: 85%;
    height:100%;
    margin-left: 10px;
  }
  .container-info p:nth-of-type(1){
    font-size:16px;
    color:#444444;
    margin-top: 13px;
  }
  .container-info p:nth-of-type(2){
    font-size:14px;
    color: #808080;
    margin:1px 0;
    display: flex;
    flex-direction: row;
    align-items:center;
  }
  .container-info p:nth-of-type(2) i{
    display: inline-block;
    width:1px;
    height:13px;
    background:#dcdcdc;
    margin: 0 5px;
  }
  .container-info p:nth-of-type(3){
    font-size:14px;
    color: #808080;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
  }
</style>
