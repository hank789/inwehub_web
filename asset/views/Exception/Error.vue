<template>
  <div>
    <div class="mui-content absolute">

      <header class="hidewechattitle">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg>
      </header>

      <div class="cont">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xitongbengkuimeiyouwangluo"></use>
        </svg>
        <!--<p>这可能是你手机的问题！不是bug！！</p>-->
        <p>你的网络异常！</p>

      </div>

      <div class="refresh">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shuaxin"></use>
        </svg>
        <p>点击刷新</p>
      </div>

    </div>
  </div>
</template>
<style lang="less" scoped>
  div,
  span,
  p,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /*头部样式*/

  header {
    width: 100%;
    height: 44px;
    background: #f3f4f6;
    text-align: center;
  }

  header svg {
    font-size: 80px;
    color: #3c3e44;
    margin-top: -13px;
  }

  .mui-content {
    background: #FFFFFF;
  }

  .cont {
    width: 100%;
    height: 100px;
    /*background: #CCCCCC;*/
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .cont svg {
    font-size: 60px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  .cont p {

    margin-top: 70px;
    font-size: 14px;
    color: #B4B4B6;
    text-align: center;

  }

  .refresh {
    width: 100%;
    height: 50px;
    /*border: 1px solid #CCCCCC;*/
    position: fixed;
    bottom: 30px;
  }

  .refresh svg {
    color: #03aef9;
    font-size: 26px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  .refresh p {

    margin-top: 30px;
    font-size: 14px;
    color: #B4B4B6;
    text-align: center;

  }
</style>
