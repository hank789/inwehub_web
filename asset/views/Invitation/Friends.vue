<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我邀请的好友</h1>
    </header>
    <div class="mui-content">
      <ul>
          <li>
            <p class="avatar">
              <img src="../../statics/images/balance2.png">
              
            </p>
            <div class="information">
              <p>张大红</p>
              <p>2017/10/25注册</p>
            </div>
            <div class="profit">
              <p>收益：￥5</p>
              <p>支付：￥100</p>
            </div>

            <i class="bot"></i>
          </li>
        <li>
          <p class="avatar">
            <img src="../../statics/images/balance2.png">
          </p>
          <div class="information">
            <p>张大红</p>
            <p>2017/10/25注册</p>
          </div>
          <div class="profit">
            <p>收益：￥5</p>
            <p>支付：￥100</p>
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
  .mui-content {
    background: #FFFFFF;
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
  ul{
    width:100%;
    overflow: hidden;
    padding:12px 16px 0 16px;
  }
  ul li{
    width:100%;
    height:64px;
    position: relative;
  }
 .avatar{
    width:44px;
    height:44px;
    margin-top: 10px;
    border-radius: 50%;
    float: left;
  }
  .avatar img{
    width:100%;
    height:100%;
    border-radius: 50%;
  }
  .information{
    float: left;
    margin-top: 11px;
    margin-left: 8px;
  }
  .information p:nth-of-type(1){
    font-size:14px;
    color:#565656;
  }
  .information p:nth-of-type(2){
    font-size:12px;
    color:#b4b4b6;
  }
  .profit{
    float: right;
    margin-top: 11px;
    margin-right: 10px;
  }
  .profit p{
    font-size:13px;
    color:#808080;
  }


</style>
