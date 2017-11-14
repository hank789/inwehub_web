<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">发现</h1>
    </header>

    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">热门<i></i></span>
        <span @tap.stop.prevent="$router.replace('/discover/newest')">最新</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiugai"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shuaxin"></use>
        </svg>
      </div>
      <!--滚动区域-->
      <ul>
        <li class="Container">
          <p>[物料规格与单位] 噩梦，那些刺痛PP顾问们的物料单位与规格的问题<i>-baidu.com</i></p>
          <p class="container-image">
            <img src="../../statics/images/guide_01.png">
          </p>
          <p>1小时前发布于<a>#小哈公社</a>
            <i class="bot"></i>
          </p>
          <p class="information">
            <span>
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-gengduo"></use>
               </svg>
            </span>
            <span>
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoucangxingxing"></use>
               </svg>
            </span>
            <span>
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-pinglun1"></use>
               </svg>
              2
            </span>
            <span>
               <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dianzan1"></use>
            </svg>
              12
            </span>
          </p>
        </li>
        <!--带图片的样式-->
        <li class="imgContainer">
          <div class="avatar">
            <p>
              <img src="../../statics/images/service1.png" />
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
              </svg>
            </p>
            <p>郭伟发布了分享</p>
          </div>
          <div class="textContainer mui-ellipsis-2">
            1. 必须使用生产版本管理2. 因为MRP视图中的选择方法字段就没有用处，SAP将之去除了3. MRP3视图的消耗模式增加一个选项:按期间消耗。
          </div>

          <div class="PublishContainer">
            <p class="container-image">
              <img src="../../statics/images/guide_01.png" />
            </p>
            <p class="container-image">
              <img src="../../statics/images/guide_02.png" />
            </p>
            <p class="container-image">
              <img src="../../statics/images/guide_03.png" />
            </p>
          </div>
          <div class="timeContainer">
            <span>19小时前发布于</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dingwei1"></use>
            </svg>
            <span>曼哈顿 (金陵）商务酒店</span>
          </div>
          <div class="information">
            <span>
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-gengduo"></use>
               </svg>
            </span>
            <span>
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoucangxingxing"></use>
               </svg>
            </span>
            <span>
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-pinglun1"></use>
               </svg>
              2
            </span>
            <span>
               <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dianzan1"></use>
            </svg>
              12
            </span>

          </div>




        </li>
      </ul>
    </div>
  </div>
</template>
<script>

</script>
<style scoped>
  .mui-wechat .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    top: 0;
  }

  .mui-content {
    background: #F3F4F5;
  }

  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    padding: 0 17px;
    border-bottom: 1px solid #dcdcdc;
  }

  .menu span {
    display: block;
    height: 100%;
    float: left;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }

  .menu span:nth-of-type(1) {
    position: relative;
  }

  .menu span:nth-of-type(2) {
    margin-left: 34px;
  }

  .menu svg {
    float: right;
  }

  .menu svg:nth-of-type(1) {
    font-size: 18px;
    color: #03aef9;
    margin-top: 13px;
    margin-left: 20px;
  }

  .menu svg:nth-of-type(2) {
    font-size: 22px;
    color: #b4b4b6;
    margin-top: 12px;

  }

  .menu i {
    display: block;
    position: absolute;
    width: 27px;
    height: 1.5px;
    left: 0%;
    bottom: 0.5px;
    background: #03aef9;
  }

  .bot {
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

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

  /*滚动区域*/
  ul {
    width: 100%;
    overflow: hidden;
    background: #F3F4F5;
    margin-top: 45px;
  }

  ul .Container {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding: 12px 16px 0 16px;
    margin-bottom: 10px;

  }



  ul .Container p:nth-of-type(1) {
    font-size: 15px;
    color: #444444;
    line-height: 20px;
    margin-bottom: 13px;
  }

  ul .Container p:nth-of-type(1) i {
    font-size: 12px;
    color: rgb(180, 180, 182);
  }

  ul .Container .container-image {
    height: 124px;
  }

  ul .Container p:nth-of-type(3) {
    width: 100%;
    height: 44px;
    font-size: 12px;
    color: #b4b4b6;
    line-height: 44px;
    position: relative;
  }

  ul .Container p:nth-of-type(3) a {
    font-size: 12px;
    color: rgb(128, 128, 128);
  }

  .information {
    width: 100%;
    height: 40px;
    padding: 0 17px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:center;


  }

  .information span{
    color: #808080;

  }
  .information span svg{
    font-size:17px;
  }

  .information span:nth-of-type(2) svg{
    font-size:18px;
  }
  .information span:nth-of-type(3) svg{
    font-size:17px;
    margin-right: 3px;

  }
  .information span:nth-of-type(4) svg{
    font-size:17px;
    margin-right: 3px;
  }
/*带定位和图片的样式*/
.imgContainer{
  width: 100%;
  overflow: hidden;
  background: #FFFFFF;
  padding: 12px 16px 0 16px;
  margin-bottom: 10px;
}
.imgContainer:after{
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 10px;
    background-color: #f3f4f6;
    width: 100%;
  }
  .imgContainer .avatar{
    width:100%;
    height: 34px;
  }
  .avatar p:nth-of-type(1){
    width:34px;
    height:34px;
    border-radius: 50%;
    float: left;
    position: relative;
  }
  .avatar p:nth-of-type(1) svg{
    position: absolute;
    font-size:17px;
    bottom: 0;
    right:-6px;
  }
  .avatar p:nth-of-type(1) img{
    width:100%;
    height:100%;
    border-radius: 50%;
  }
  .avatar p:nth-of-type(2){
    font-size:13px;
    color: #808080;
    line-height: 34px;
    margin-left:8px;
    float: left;
  }
  .textContainer{
    width:100%;
    font-size:15px;
    color:#444444;
    line-height: 20px;
    margin-bottom:13px;
  }
  .timeContainer{
    width:100%;
    height:42px;
    font-size:12px;
    line-height: 42px;

  }
  .timeContainer svg{
    font-size: 14px;
    color: #b4b4b6;
  }
  .timeContainer span:nth-of-type(1){
    color: #b4b4b6;
  }
  .timeContainer span:nth-of-type(2){
    color: #808080;
  }
  /*图片*/
  .PublishContainer{
    width:100%;
    overflow: hidden;
    /*border:1px solid #000000;*/
  }
  .PublishContainer .container-image{
    width:32%;
    height:108px;
    float: left;
    /*border:1px solid #000000;*/

  }
  .PublishContainer .container-image img{
    width:100%;
    height:100%;
  }
  .PublishContainer p:nth-of-type(2),.PublishContainer p:nth-of-type(3){
    margin-left: 2%;
  }
</style>
