<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的发布</h1>
    </header>

    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">热门<i></i></span>
        <span @tap.stop.prevent="">最新</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiugai"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shuaxin"></use>
        </svg>
      </div>
      <!--滚动区域-->
      <ul>
        <li>
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

  ul li {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding: 12px 16px 0 16px;
  }

  ul li p:nth-of-type(1) {
    font-size: 15px;
    color: #444444;
    line-height: 20px;
    margin-bottom: 13px;
  }

  ul li p:nth-of-type(1) i {
    font-size: 12px;
    color: rgb(180, 180, 182);
  }

  ul li .container-image {
    height: 124px;
  }

  ul li p:nth-of-type(3) {
    width: 100%;
    height: 44px;
    font-size: 12px;
    color: #b4b4b6;
    line-height: 44px;
    position: relative;
  }

  ul li p:nth-of-type(3) a {
    font-size: 12px;
    color: rgb(128, 128, 128);
  }

  .information {
    width: 100%;
    height: 40px;
    padding: 0 17px;
   line-height: 40px;

  }

  .information span {
    display: block;
    /*border: 1px solid #000000;*/
    width: 35%;
    height: 100%;
    float: left;
    text-align: center;
  }
  .information span:nth-of-type(1) {
    width: 15%;
    text-align:left;
  }
  .information span:nth-of-type(4) {
    width: 15%;
    text-align:right;

  }
  .information span svg{
    font-size:15px;
    color:#808080;
  }

</style>
