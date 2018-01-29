<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">设置</h1>
    </header>

    <div class="mui-content">
       <div class="notice_t">
         <div class="system">
           开启系统通知
           <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
             <div class="mui-switch-handle"></div>
           </div>
           <i class="bot"></i>
         </div>
         <p>你可能错过重要的活动机会推荐，点击前往“设置”开启通知</p>
       </div>
      <div class="grey"></div>

        <ul class="notice_m">
          <li>
            活动通知及系统公告
            <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
              <div class="mui-switch-handle"></div>
            </div>
            <i class="bot"></i>
          </li>
          <li @tap.stop.prevent="$router.pushPlus('/push/setting/aboutme')">
            与我有关
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chakangengduojiantou"></use>
            </svg>
            <i class="bot"></i>
          </li>
          <li @tap.stop.prevent="$router.pushPlus('/push/setting/follow')">
            我的关注
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chakangengduojiantou"></use>
            </svg>
            <i class="bot"></i>
          </li>
        </ul>
      <div class="grey"></div>
      <div class="notice_b">
        免打扰<span>（22:00-07:30自动关闭推送）</span>
        <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
          <div class="mui-switch-handle"></div>
        </div>
        <i class="bot"></i>
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
  .grey{
    width:100%;
    height:10px;
    background: #F3F4F5;
  }
  .notice_t{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .notice_t p{
    width:100%;
    height:44px;
    line-height: 44px;
    font-size:12px;
    color: #03aef9;
  }
  .system{
    width:100%;
    height:44px;
    line-height: 44px;
    font-size:14px;
    color: #444444;
    position: relative;
  }
  .system .mui-switch{
    float: right;
    margin-top:7px;
  }
  .notice_m{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .notice_m li{
    width:100%;
    height:44px;
    line-height: 44px;
    font-size: 14px;
    color: #444444;
    position: relative;
  }
  .notice_m li svg{
    /*font-size: 14px;*/
    float: right;
    margin-top: 15px;
    color: #808080;
  }
  .notice_m li .mui-switch{
    float: right;
    margin-top:7px;
  }
  .notice_b{
    width:100%;
    height:44px;
    line-height: 44px;
    font-size:14px;

    padding: 0 4%;
    position: relative;
  }
  .notice_b span:nth-of-type(1){
    color: rgb(128,128,128);
  }
  .notice_b span:nth-of-type(2){
    color: #808080;
  }
  .notice_b .mui-switch{
    float: right;
    margin-top:7px;
  }
  .mui-switch-blue.mui-active {
    border: 2px solid #03aef9;
    background-color: #03aef9;
  }
</style>
