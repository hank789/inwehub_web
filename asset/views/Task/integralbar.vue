<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">积分变动</h1>
    </header>

    <div class="mui-content">
      <div class="mui-scroll-wrapper" id="pullrefresh">
        <div class="mui-scroll">
          <ul>
            <p>16:44</p>
            <li>
              <p>
								<span class="check">
				   	  				<i>积分变动</i>
				   	  				<i>2017年6月27日 17:00</i>
				   	  			</span>
                <span><i>+</i>12</span>
                <span>成长值到账</span>
                <i class="bot"></i>
              </p>
              <p>
                <span>用户名：<i>张三丰</i></span>
                <span>剩余积分：<i>3393</i></span>
                <i class="bot"></i>
              </p>
              <p>
                <span>查看详情</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-chakangengduojiantou"></use>
                </svg>
              </p>
            </li>
          </ul>

          <ul>
            <p>16:44</p>
            <li>
              <p>
								<span class="check">
				   	  				<i>积分变动</i>
				   	  				<i>2017年6月27日 17:00</i>
				   	  			</span>
                <span><i>+</i>12</span>
                <span>成长值到账</span>
                <i class="bot"></i>
              </p>
              <p>
                <span>用户名：<i>张三丰</i></span>
                <span>剩余积分：<i>3393</i></span>
                <i class="bot"></i>
              </p>
              <p>
                <span>查看详情</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-chakangengduojiantou"></use>
                </svg>
              </p>
            </li>
          </ul>

        </div>
      </div>
    </div>

    <div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>
  </div>
</template>

<script>
</script>

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

  /*滚动区域*/

  .mui-wechat #pullrefresh {
    margin-top: 0px;
  }

  #pullrefresh {
    margin-top: 44px;
  }

  /*主体部分样式*/

  ul {
    width: 100%;
    height: 277px;
    padding: 0px 16px 0 16px;
    margin-top: 11px;
  }

  ul p {
    text-align: center;
  }

  ul li {
    width: 100%;
    height: 238px;
    background: #f3f4f6;
    margin-top: 11px;
    border: 0.5px solid #dcdcdc;
    border-radius: 5px;
    padding: 12px 15px;
  }

  ul li p {
    position: relative;
  }

  ul li p:nth-of-type(1) {
    width: 100%;
    height: 110px;
  }

  .check {
    width: 100%;
    height: 20px;
  }

  .check i:nth-of-type(1) {
    float: left;
    font-size: 14px;
    color: #444444;
  }

  .check i:nth-of-type(2) {
    font-size: 12px;
    color: #808080;
    float: right;
  }

  ul li p:nth-of-type(1) span {
    display: block;
  }

  ul li p:nth-of-type(1) span:nth-of-type(2) {
    margin-top: 23px;
    font-size: 23px;
    color: #444444;
  }

  ul li p:nth-of-type(1) span:nth-of-type(3) {
    margin-top: 5px;
    font-size: 14px;
    color: #808080;
  }

  /*ul li p:nth-of-type(1) span:nth-of-type(2) i{
  font-size: 28px;
  color: #444444;
  margin-bottom: 20px;
}*/

  ul li p:nth-of-type(2) {
    width: 100%;
    height: 76px;
  }

  ul li p:nth-of-type(2) span:nth-of-type(1) {
    margin-top: 14px;
  }

  ul li p:nth-of-type(2) span:nth-of-type(2) {
    margin-top: 6px;
  }

  ul li p:nth-of-type(2) span {
    width: 100%;
    float: left;
    text-align: left;
    display: block;
    color: rgb(128, 128, 128);
  }

  ul li p:nth-of-type(2) span i {
    color: rgb(68, 68, 68);
  }

  ul li p:nth-of-type(3) {
    width: 100%;
    height: 30px;
  }

  ul li p:nth-of-type(3) span {
    color: rgb(128, 128, 128);
  }

  ul li p:nth-of-type(3) span i {
    color: rgb(68, 68, 68);
  }

  ul li p:nth-of-type(3) span {
    float: left;
    font-size: 14px;
    color: #808080;
    margin-top: 9px;
  }

  ul li p:nth-of-type(3) svg {
    float: right;
    font-size: 13px;
    color: #808080;
    margin-top: 14px;
  }
</style>
