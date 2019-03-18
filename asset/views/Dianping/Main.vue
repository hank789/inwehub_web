<template>
  <div class="mui-content">

    <div class="topTitle font-family-medium">热门专题</div>
    <div class="heatAlbum">
      <div class="albumList">
        <div class="componentCarAlbum">
          <div class="albumName font-family-medium">表单调查工具大全</div>
          <div class="tags"><span>必看</span></div>
          <div class="backgroundSmall">
            <img src="../../statics/images/remen_zhunti_small2@3x.png" style="width: 100%;">
          </div>
          <div class="backgroundBig">
            <img src="../../statics/images/remen_zhunti_big1@3x.png">
          </div>
        </div>
      </div>
    </div>

    <div class="topTitle font-family-medium">热门产品</div>
    <div class="heatProduct">
      <div class="productList">
        <div class="componentCarProduct">
          <div class="topInfo">
            <div class="left">
              <div class="logo">
                <img
                  src="../../statics/images/remen_zhunti_big1@3x.png">
              </div>
              <div class="nameMark">
                <div class="title font-family-medium">阿里云</div>
                <div class="stars">
                  <span class="span">4分</span>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="heatICon">
                <img src="../../statics/images/zhuanti_fill@3x.png">
              </div>
              <div class="textNumber">2862</div>
            </div>
          </div>
          <div class="bottom">
            <div class="describe">提供快速内存和最新的英特尔CPU，可帮助您为云应用程序提供动力。</div>
          </div>
        </div>
      </div>
    </div>

    <div class="topTitle font-family-medium">专题集</div>
    <div class="specialWrapper">
      <div class="display">
        <div>
          <div class="specialList">
            <div class="mask"></div>
            <div class="img"><img src="../../statics/images/remen_zhunti_big1@3x.png"></div>
            <div class="text font-family-medium">分析与商业智能</div>
          </div>
          <div class="expectWrapper specialList">
            <div class="content">
              <span class="iconfont icon-tianjia"></span>
              <span class="expectText">我期待</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<style>
  .mui-content{
    background:#fff !important;
  }

  .topTitle {
    color: #3C3E44;
    font-size: 20px;
    padding: 18px 16px 0;
  }

  .heatAlbum {
    padding: 0 16.000px;
    margin-top: 13.000px;
  }

  .heatAlbum .albumList {
    display: inline-block;
  }

  .albumList .componentCarAlbum {
    width: 113.000px;
    height: 152.500px;
    position: relative;
    border-radius: 4.000px;
    margin: 2.000px 2.000px 0 0;
    background: linear-gradient(39deg, rgba(60, 87, 119, 1) 0%, rgba(28, 44, 66, 1) 100%);
  }

  .albumList .componentCarAlbum:nth-of-type(2) {
    margin-right: 0;
  }

  .albumList .componentCarAlbum .albumName {
    position: relative;
    z-index: 1;
    color: #FFFFFF;
    font-size: 14.000px;
    padding: 20.000px 15.000px 0;
    line-height: 22.000px;
  }

  .albumList .componentCarAlbum .tags {
    position: absolute;
    z-index: 1;
    left: 15.000px;
    bottom: 20.000px;
    height: 15.000px;
    padding: 0 5.000px;
    line-height: 15.000px;
    border-radius: 0px 4.000px 0px 4.000px;
    background: linear-gradient(45deg, rgba(83, 223, 221, 1) 0%, rgba(41, 188, 184, 1) 100%);
  }

  .albumList .componentCarAlbum .tags span {
    color: #1C2C42;
    font-size: 10.000px;
    line-height: 14.000px;
  }

  .albumList .componentCarAlbum .backgroundSmall {
    position: absolute;
    top: 0;
    left: 0;
    width: 113.000px;
    height: 152.500px;
  }

  .albumList .componentCarAlbum .backgroundBig {
    position: absolute;
    top: 0;
    left: 0;
    width: 228.000px;
    height: 152.500px;
    display: none;
  }

  .albumList .componentCarAlbum .backgroundSmall image,
  .albumList .componentCarAlbum .backgroundBig img {
    width: 100%;
    height: 100%;
  }

  .heatProduct {
    margin-top: 15.000px;
  }

  .productList {
    margin-top: 10.000px;
    padding: 0 16.000px;
  }

  .componentCarProduct {
    padding: 15.000px;
    background: #FFFFFF;
    border-radius: 4.000px;
    box-shadow: 0px 0px 26px 0px rgba(232, 241, 241, 1);
  }

  .componentCarProduct .topInfo {
    display: flex;
    justify-content: space-between;
  }

  .componentCarProduct .topInfo .left {
    display: flex;
  }

  .componentCarProduct .topInfo .left .nameMark .title {
    color: #3C3E44;
    font-size: 16.000px;
    line-height: 22.500px;
    margin-bottom: 7.000px;
  }

  .componentCarProduct .topInfo .left .nameMark .stars {
    display: flex;
  }

  .componentCarProduct .topInfo .left .nameMark .stars .span {
    font-size: 11.000px;
    line-height: 15.000px;
    margin-left: 3.000px;
    margin-top: 1.500px;
  }

  .componentCarProduct .topInfo .left .logo {
    width: 44.000px;
    height: 44.000px;
    margin-right: 10.000px;
    overflow: hidden;
    border-radius: 4.000px;
    border: 0.500px solid #ECECEE;
  }

  .componentCarProduct .topInfo .left .logo img {
    width: 100%;
    height: 100%;
  }

  .componentCarProduct .topInfo .right {
    display: flex;
  }

  .componentCarProduct .topInfo .right .heatICon {
    width: 9.000px;
    height: 11.500px;
    margin-right: 4.000px;
  }

  .componentCarProduct .topInfo .right .heatICon img {
    width: 100%;
    height: 100%;
  }

  .componentCarProduct .topInfo .right .textNumber {
    color: #3C3E44;
    font-size: 12.000px;
    line-height: 14.500px;
    margin-top: 1.000px;
  }

  .componentCarProduct .bottom .describe {
    color: #808080;
    font-size: 14.000px;
    line-height: 22.500px;
    margin-top: 10.000px;
  }

  .specialWrapper {
    width: 100%;
    height: 446.500px;
    padding: 0.000px 0 0 0.000px;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 30.000px;
  }

  .specialWrapper .specialList {
    position: relative;
    margin: 10.000px 0.000px 0 0;
  }

  .display {
    display: inline-block;
    vertical-align: top;
    margin-left: 10.000px;
  }

  .display:last-child {
    margin-right: 10.000px;
  }

  .marginR {
    margin-right: 20.000px;
  }

  .specialWrapper .specialList .img {
    width: 166.500px;
    height: 79.500px;
    border-radius: 4.000px;
  }

  .specialWrapper .specialList img {
    height: 100%;
    width: 100%;
    border-radius: 4.000px;
  }

  .specialWrapper .specialList .text {
    font-size: 13.000px;
    color: #FFFFFF;
    position: absolute;
    bottom: 15.000px;
    left: 15.000px;
    white-space: normal;
    padding-right: 15.000px;
  }

  .specialWrapper .specialList .mask {
    width: 166.500px;
    height: 79.500px;
    background: linear-gradient(180deg, rgba(28, 44, 66, 0) 0%, rgba(28, 44, 66, 1) 100%);
    /* opacity:0.7; */
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4.000px;
  }

  .expectWrapper {
    width: 166.500px;
    height: 78.000px;
  }
  .expectWrapper .content {
    height: 100%;
    line-height: 78.000px;
    border-radius: 4.000px;
    border: 0.500px solid #DCDCDC;
  }
  .expectWrapper .content .iconfont {
    font-size: 13.000px;
    color: #3C3E44;
    margin-left: 15.000px;
    margin-right: 3.500px;
  }
  .expectWrapper .content .expectText {
    color: #808080;
    font-size: 13.000px;
  }
</style>
