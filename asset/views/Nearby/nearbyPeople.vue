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
          <p>附近的人</p>
          <p @tap.stop.prevent="$router.replace('/nearbyCompany')">附近的公司</p>
        </div>
        <svg class="icon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/nearbyPeople/MapDetail')">
          <use xlink:href="#icon-ditu"></use>
        </svg>
      </div>

      <ul class="cions-list">
        <li>
          <div class="cions-avatar">
            <img src="../../statics/images/guide_01.png"/>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="detail">
            <p>丁冉<i>（< 200m）</i></p>
            <p class="mui-ellipsis">显示个人签名显示个人签名显示个人签名显示个人签名显示个人签名显示个人签名显示个人签名显示个人签名显示个人签名</p>
          </div>
          <div class="fouce blue">关注Ta</div>
          <i class="bot"></i>
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
  .menu .switch p:nth-of-type(1){
    background:#808080;
    border-radius: 50px  0  0 50px;
  }
  .menu svg{
    position: absolute;
    right:3%;
    font-size: 25px;
    color: #fefefe;
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
  .cions-list li .cions-avatar{
    position: relative;
    width:44px;
    height:44px;
    border-radius:50%;
    background: #cccccc;
    margin-top: 10px;
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
    width:60%;
    overflow: hidden;
    margin-top: 14px;
    font-size:14px;
    color: #444444;
    margin-left: 8px;
  }
  .cions-list li .detail p:nth-of-type(1) i{
    font-size:12px;
    color: #808080;
  }
  .cions-list li .detail p:nth-of-type(2){
    font-size:12px;
    color: #b4b4b6;
    margin-top: -2px;
  }
  .cions-list li .fouce{
    width:61px;
    height:27px;
    background: #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 27px;
    font-size:14px;
    color: #ffffff;
    margin-top: 18.5px;
    float: right;

  }
  .cions-list li .blue{
    color: #03aef9;
    border: 1px solid #03aef9;
    background: #ffffff;
  }
</style>
