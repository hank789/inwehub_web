<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">待您回答</h1>
    </header>
    <div class="mui-content absolute">
      <div class="title">
        <p>根据您的擅长推荐以下问答</p>
        <p>换一批</p>
      </div>
     <ul>
       <li>
         <p>1.</p>
         <p class="mui-ellipsis-3">
           <span>#供应链#</span>咨询顾问迎接新年的到来有什么独特的方式？对于2018年应该有怎样的期待和愿望？
           为了愿景的达成，许愿、努力、烧香...佛，怎样才是正确的姿势？如果选择拜佛，哪里的佛更靠谱一点？怎样才是正确的姿势？如果...
           佛更靠谱一点
         </p>
         <p>3人回答  |  34关注</p>
         <i class="bot"></i>
       </li>
     </ul>
    </div>
  </div>
</template>

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

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  .title{
    width:100%;
    height:39px;
    padding-left:4% ;
    background: #f3f4f6;
  }
  .title p{
    float: left;
    line-height: 39px;
  }
  .title p:nth-of-type(2){
    float: right;
    color: #FFFFFF;
    padding: 0px 19px 0px 21px;
    background: #03aef9;
  }


  ul{
    width:100%;
    padding:12px 0 0 0;
    overflow: hidden;
  }
  ul li{
    width:87%;
    margin-left: 9%;
    position: relative;
    padding-bottom: 12px;
  }
  ul li p:nth-of-type(1){
  position: absolute;
    left:-18px;
    font-size:16px;
    color: #03aef9;
    font-weight: 500;
  }
  ul li p:nth-of-type(2){
    font-size: 16px;
    color: #444444;
    line-height: 21px;
  }
  ul li p:nth-of-type(2) span{
    color: rgb(35,82,128);
    margin-right: 6px;
  }
  ul li p:nth-of-type(3){
    font-size: 12px;
    color:#808080;
    margin-top: 3px;
  }
</style>
