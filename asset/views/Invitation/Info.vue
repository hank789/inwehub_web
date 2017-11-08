<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-content absolute">
      <div class="share_t">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logoxin"></use>
        </svg>
        <div class="share_bg">

        </div>
      </div>
      <!--注册-->
      <ul>
        <li>
          <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-shoujihao"></use>-->
          <!--</svg>-->
          <!--<input type="text" placeholder="请输入真实姓名">-->
        </li>
        <li>
          <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-mima"></use>-->
          <!--</svg>-->
          <!--<input type="text" placeholder="请输入登录密码">-->
        </li>
        <button>离成功只差一步!</button>
        <p>点击即同意<i>《用户注册服务协议》</i></p>
      </ul>

    </div>
  </div>
</template>
<script>

</script>
<style scoped>
  /*清除样式*/
  div, ul, li, p, span, a, i {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  header {
    background: #44464B;
  }

  .mui-icon-back:before, .mui-icon-left-nav:before {
    color: #808080;
  }

  .mui-content {
    background: #EBECED;
  }

  .share_t {
    width: 100%;
    height: 193px;
    background: -webkit-gradient(linear, 0 0, 0 bottom, from(#44474B), to(rgba(113, 117, 120, 1)));
    position: relative;
  }

  .share_t svg {
    font-size: 110px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;

  }

  .share_bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 105px;
    background: url("../../statics/images/graywave@3x.png") no-repeat;
    background-size: 100% 100%;
  }

  ul {
    width: 80%;
    margin-left: 10%;
    height: 242px;
    padding-top: 42px;
    border: 1px solid #000000;
  }

  ul li {
    width: 100%;
    height: 28px;
    background: #cccccc;
    border-bottom: 1px solid #dcdcdc;
  }

  ul li:nth-of-type(2) {
    margin-top: 30px;
  }

  ul li svg {
    float: left;
  }

  ul li input {
    float: left;
  }

  ul button {
    width: 100%;
    height: 44px;
    background: #03aef9;
    font-size: 16px;
    color: #FFFFFF;
    border-radius: 0;
    margin-top: 35px;
  }
  ul p {
    font-size:12px;
    color:rgb(60,149,249);
  }
  ul p i{
    color:#3c95f9;
    font-style: normal;
  }

</style>
