<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">与我有关</h1>
    </header>

    <div class="mui-content">
      <ul class="notice">
        <li>
          赞了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          关注了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          提到了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          回复了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          邀请了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
          </div>
          <i class="bot"></i>
        </li>
        <li>
          私聊了我
          <div class="mui-switch mui-switch-blue  mui-switch-mini  mui-active">
            <div class="mui-switch-handle"></div>
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
  .notice{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .notice li{
    width:100%;
    height:44px;
    line-height: 44px;
    font-size: 14px;
    color: #444444;
    position: relative;
  }

  .notice li .mui-switch{
    float: right;
    margin-top:7px;
  }
  .mui-switch-blue.mui-active {
      border: 2px solid #03aef9;
      background-color: #03aef9;
    }
</style>
