<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">用户榜</h1>
    </header>
    <!--组件-->
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/cionsList')">贡献榜  <i></i></span>
        <span @tap.stop.prevent="$router.replace('/creditsList')">成长榜</span>
        <span @tap.stop.prevent="">邀请榜 <i></i></span>
      </div>

      <div class="ranking">
        <div class="See">邀请好友</div>
        <img src="../../statics/images/invitationlist@2x.png" class="ranking-title"/>
        <ul class="ranking-content">
          <li>
            <div class="avatar-container">
              <p class="avatar">
                <img src="../../statics/images/guide_01.png"/>
              </p>
              <p class="banner">
                <img src="../../statics/images/blue-3@2x.png">
                <span>No.3</span>
              </p>
            </div>
            <p>武浩</p>
            <p class="cions">贡献值<i>30400</i></p>
            <p>关注Ta</p>
          </li>
          <li>
            <div class="avatar-container">
              <p class="avatar big-avatar">
                <img src="../../statics/images/guide_01.png"/>
              </p>
              <p class="banner">
                <img src="../../statics/images/red-1@2x.png">
                <span>No.1</span>
              </p>
            </div>
            <p>武浩</p>
            <p class="cions">贡献值<i>30400</i></p>
            <p>关注Ta</p>
          </li>
          <li>
            <div class="avatar-container">
              <p class="avatar">
                <img src="../../statics/images/guide_01.png"/>
              </p>
              <p class="banner">
                <img src="../../statics/images/yellow-1@2x.png">
                <span>No.2</span>
              </p>
            </div>
            <p>武浩</p>
            <p class="cions">贡献值<i>30400</i></p>
            <p>关注Ta</p>
          </li>
        </ul>
      </div>

      <ul class="cions-list">
        <li>
          <div class="cions-num">
            <p>No.</p>
            <p>4</p>
          </div>
          <div class="cions-avatar">
            <img src="../../statics/images/guide_01.png"/>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="detail">
            <p>王程</p>
            <p>贡献值<i>20000</i></p>
          </div>
          <div class="fouce">关注</div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="cions-num">
            <p>No.</p>
            <p>4</p>
          </div>
          <div class="cions-avatar">
            <img src="../../statics/images/guide_01.png"/>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="detail">
            <p>王程</p>
            <p>贡献值<i>20000</i></p>
          </div>
          <div class="fouce">关注</div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="cions-num">
            <p>No.</p>
            <p>4</p>
          </div>
          <div class="cions-avatar">
            <img src="../../statics/images/guide_01.png"/>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="detail">
            <p>王程</p>
            <p>贡献值<i>20000</i></p>
          </div>
          <div class="fouce">关注</div>
          <i class="bot"></i>
        </li>
        <li>
          <div class="cions-num">
            <p>No.</p>
            <p>4</p>
          </div>
          <div class="cions-avatar">
            <img src="../../statics/images/guide_01.png"/>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="detail">
            <p>王程</p>
            <p>贡献值<i>20000</i></p>
          </div>
          <div class="fouce">关注</div>
          <i class="bot"></i>
        </li>
      </ul>


    </div>
  </div>
</template>

<style scoped>
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
  .mui-content{
    background: #FFFFFF;
  }
  .menu{
    width:100%;
    height:39px;
    background: #f3f4f6;
    font-size:14px;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .menu span:nth-of-type(3){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(3) i{
    position:absolute;
    width:42px;
    height:1.5px;
    border-radius: 50px;
    background:#03aef9;
    top: 28px;
  }
  /*排名的展示样式*/
  .ranking{
    width:100%;
    height:264px;
    background: #fcc816;
    position: relative;
  }
  .ranking-title{
    height:43px;
    position: absolute;
    top:14px;
    left:0;
    right: 0;
    margin: auto;
  }
  .See{
    position: absolute;
    right: 0;
    top:20.5px;
    display: inline-block;
    font-size: 14px;
    color: #ffffff;
    border-radius: 50px 0 0 50px;
    padding: 3.5px 7px 3.5px 8px;
    background: -webkit-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* Firefox 3.6 - 15 */
    background: linear-gradient( rgb(243, 130, 1), rgb(252, 153, 40)); /* 标准的语法（必须放在最后） */
  }
  .ranking-content{
    width:100%;
    height:175.5px;
    position: absolute;
    top:68.5px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0 4%;
  }
  .ranking-content li{
    height:156px;
    border:1px solid #ee8610;
    background: #ececee;
    margin-top: 5px;
    border-radius:4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 2px 4px #ececee;
  }
  .ranking-content li:nth-of-type(2){
    height:175.5px;
    margin: 0 2.5%;
    margin-top: 0;
  }
  .ranking-content li .avatar-container{
    margin:10.5px 0 6px 0;
    position: relative;
  }
  .ranking-content li:nth-of-type(2) .avatar-container{
    margin:15.5px 0 6px 0;
  }
  .ranking-content li .avatar-container .avatar{
    width:50px;
    height:50px;
    border-radius:50%;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .avatar{
    width:60px;
    height:60px;
    border-radius:50%;
  }
  .ranking-content li .avatar-container .avatar img{
    width:100%;
    height:100%;
    border-radius:50%;
  }
  .ranking-content li .avatar-container .banner{
    width: 66px;
    position: absolute;
    left: -8px;
    bottom: -10px;
    font-size: 11px;
    color: #444444;
    text-align: center;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .banner{
    width: 76px;

  }
  .ranking-content li .avatar-container .banner span{
    position: absolute;
    top: 2px;
    left: 0;
    right: 0;
    margin: auto;
    line-height: 25px;
  }
  .ranking-content li:nth-of-type(2) .avatar-container .banner span{
    line-height: 30px;
  }

  .ranking-content li p:nth-of-type(1){
    font-size: 14px;
    color: #444444;
    font-weight:600;
  }
  .ranking-content li .cions{
    font-size: 12px;
    color: rgb(68, 68, 68);
  }
  .ranking-content li .cions i{
    color: #235280;
  }
  .ranking-content li p:nth-of-type(3){
    width:82px;
    height:24px;
    border-radius:50px;
    border:1px solid #03aef9;
    text-align: center;
    line-height: 22px;
    font-size: 12px;
    color: #03aef9;
    margin-top: 7px;
  }
  .ranking-content li p:nth-of-type(3).grey{
    color: #b4b4b6;
    border: 1px solid #b4b4b6;
  }

  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:64px;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-num{
    font-size:12px;
    color: #c8c8c8;
    margin-top: 15px;
  }
  .cions-list li .cions-num p:nth-of-type(2){
    font-size:18px;
    font-weight:500;
    color: #235280;
    margin-top: -5px;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:44px;
    height:44px;
    border-radius:50%;
    background: #cccccc;
    margin-top: 10px;
    margin-left: 15px;
  }
  .cions-list li .cions-avatar img{
    width:44px;
    height:44px;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 20px;
    right: -5px;
    bottom: -2px;
  }
  .cions-list li .detail{
    margin-top: 14px;
    font-size:14px;
    color: #444444;
    margin-left: 8px;
  }
  .cions-list li .detail p:nth-of-type(2){
    font-size:12px;
    color: rgb(128, 128, 128);
    margin-top: -2px;
  }
  .cions-list li .detail p:nth-of-type(2) i{
    color: #235280;
  }
  .cions-list li .fouce{
    width:61px;
    height:27px;
    border: 1px solid #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 25px;
    font-size:14px;
    color: #03aef9;
    margin-top: 18.5px;
    float: right;

  }
  .cions-list li .grey{
    color: #b4b4b6;
    border: 1px solid #b4b4b6;
  }

  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .ranking-content li{
      width:102px;
    }
    .ranking-content li:nth-of-type(2){
      width:120px;
    }
  }

  @media screen and (min-width: 375px) {
    .ranking-content li{
      width:102px;
    }
    .ranking-content li:nth-of-type(2){
      width:120px;
    }
  }

  @media screen and (min-width: 414px) {
    .ranking-content li{
      width:112px;
    }
    .ranking-content li:nth-of-type(2){
      width:130px;
    }
  }
</style>
