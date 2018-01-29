<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">附近发现</h1>
    </header>
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <div class="switch">
          <p @tap.stop.prevent="$router.replace('/nearbyPeople/MapDetail')">附近的人</p>
          <p >附近的公司</p>
        </div>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/nearbyCompany')">
          <use xlink:href="#icon-shaixuan"></use>
        </svg>
      </div>
      <div class="map">
        <img src="../../statics/images/guide_01.png" />
      </div>
      <ul>
        <div class="userArea">共有<a>8</a>名用户在当前区域 <i></i></div>
        <li>
          <div class="container-image">
            <img src="../../statics/images/guide_01.png"/>
          </div>
          <div class="container-info">
            <p>丁冉</p>
            <p class="mui-ellipsis">
              <span> 标签 <i></i></span>
            </p>
            <p><span>上海市闵行区</span> <span>< 400m</span></p>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="container-image">
            <img src="../../statics/images/guide_01.png"/>
          </div>
          <div class="container-info">
            <p>丁冉</p>
            <p class="mui-ellipsis">
              <span> 标签 <i></i></span>
            </p>
            <p><span>上海市闵行区</span> <span>< 400m</span></p>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="container-image">
            <img src="../../statics/images/guide_01.png"/>
          </div>
          <div class="container-info">
            <p>丁冉</p>
            <p class="mui-ellipsis">
              <span> 标签 <i></i></span>
            </p>
            <p><span>上海市闵行区</span> <span>< 400m</span></p>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="container-image">
            <img src="../../statics/images/guide_01.png"/>
          </div>
          <div class="container-info">
            <p>丁冉</p>
            <p class="mui-ellipsis">
              <span> 标签 <i></i></span>
            </p>
            <p><span>上海市闵行区</span> <span>< 400m</span></p>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="container-image">
            <img src="../../statics/images/guide_01.png"/>
          </div>
          <div class="container-info">
            <p>丁冉</p>
            <p class="mui-ellipsis">
              <span>标签<i></i></span>
            </p>
            <p><span>上海市闵行区</span> <span>< 400m</span></p>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="container-image">
            <img src="../../statics/images/guide_01.png"/>
          </div>
          <div class="container-info">
            <p>丁冉</p>
            <p class="mui-ellipsis">
              <span> 标签 <i></i></span>
            </p>
            <p><span>上海市闵行区</span> <span>< 400m</span></p>
          </div>
          <i class="bot"></i>
        </li>
      </ul>



    </div>
  </div>
</template>
<script>

</script>

<style scoped>
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
    font-style: normal;
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
  .mui-content{
    background: #ffffff;
  }
  /*导航栏*/
  .menu{
    width: 100%;
    height:50px;
    background:#3c3e44;
    position: relative;
  }
  .menu .switch{
    width:210px;
    height:34px;
    border:1px solid #808080;
    border-radius: 50px;
    position: absolute;
    left: 0;
    right:0;
    margin: auto;
  }
  .menu .switch p{
    width:50%;
    height:100%;
    font-size: 14px;
    color: #fefefe;
    float: left;
    text-align: center;
    line-height: 34px;
  }
  .menu .switch p:nth-of-type(2){
    background:#808080;
    border-radius: 0 50px 50px 0;
  }
  .menu svg{
    position: absolute;
    right:3%;
    font-size: 25px;
    color: #fefefe;
  }
  /*地图*/
  .map{
    width:100%;
    overflow: hidden;
  }
  .map img{
    width:100%;
    height:auto;
  }

  /*列表区域*/
  .userArea{
    width:100%;
    height:56px;
    font-size: 15px;
    color: #3c3e44;
    text-align: center;
    line-height: 56px;
    position: relative;
  }
  .userArea:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
  .userArea i{
    display: block;
    width:34px;
    height:2px;
    background: #808080;
    position: absolute;
    top:10px;
    left:0;
    right:0;
    margin: auto;
  }


  ul{
    width: 100%;
    overflow: hidden;
    z-index: 10;
    position: absolute;
    top: 240px;
    background: #ffff;
  }
  ul li{
    width:100%;
    height:89px;
    padding: 0 4%;
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
  .container-info p:nth-of-type(2) span{
    display: flex;
    flex-direction: row;
    align-items:center;
  }
  .container-info p:nth-of-type(2) span i{
    display: inline-block;
    width:1px;
    height:13px;
    background:#dcdcdc;
    margin: 0 5px;
  }
  .container-info p:nth-of-type(2) span:nth-last-child(1) i{
    display: none;
  }
  .container-info p:nth-of-type(3){
    font-size:14px;
    color: #808080;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
  }

  input::-webkit-input-placeholder { /*WebKit browsers*/
    color:#c8c8c8;
    font-size: 14px;
  }
</style>
