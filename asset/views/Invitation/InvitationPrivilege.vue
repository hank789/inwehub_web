<template>
  <div>
    <div class="mui-content">
      <div class="privilege_T">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logolanse"></use>
        </svg>
        <div class="privilege_avatar">
          <img src="../../statics/images/uicon.jpg"/>
        </div>
        <div class="privilege_share">
          <span>章顾问向你发送了特权～</span>
          <span>邀请好友注册立享5%现金分红</span>
        </div>
        <div class="privilege_verification">
          <p class="verification_t">（首次登陆可获1元提问特权）</p>
          <ul>
            <li>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoujihao"></use>
              </svg>
              <input type="text" placeholder="请输入手机号"/>
              <span>发送验证</span>
            </li>
            <li>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yanzhengma"></use>
              </svg>
              <input type="text" placeholder="请输入验证码"/>

            </li>
            <li>
              <button>领取特权</button>
              <img src="../../statics/images/money@3x.png"/>
            </li>
          </ul>
          <p class="verification_b">号码将作为您InweHub账号</p>
        </div>
      </div>
      <div class="privilege_m">

      </div>
      <div class="privilege_B">
        <P>最具品质的咨询顾问社区</P>
        <P>长见识 / 解疑惑／寻合作／树形象／得收益</P>
        <div class="margin-10-0-0">
          <img src="../../statics/images/privilege@3x.png"/>
        </div>
        <P>www.inwehub.com</P>
      </div>
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

  .mui-content {
    background: #ececee;
  }

  /*领取特权部分*/
  .privilege_T {
    width: 100%;
    height: 482px;
    padding: 0px 16px;
    background: #44474B;

  }

  .privilege_T svg {
    font-size: 77px;
  }

  /*用户头像部分*/
  .privilege_avatar {
    width: 100%;
    height: 93px;
    position: relative;
    top: -25px;
    /*border:1px solid #000000;*/
  }

  .privilege_avatar img {
    width: 73px;
    height: 73px;
    border: 2px solid #DBDCDB;
    border-radius: 50%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
  }

  /*分享现金红包cash*/
  .privilege_share {
    width: 100%;
    height: 60px;
    background: #fcc816;
    border-radius: 14px;
    text-align: center;
    padding-top: 10px;
    margin-top: -10px;
    position: relative;
    /*border:1px solid #000000;*/
  }

  .privilege_share:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fcc816;
    position: absolute;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    left: 0px;
    right: 0;
    top: -10px;
    margin: auto;

  }

  .privilege_share span:nth-of-type(1) {
    display: block;
    font-size: 18px;
    color: #444444;
  }

  .privilege_share span:nth-of-type(2) {
    display: block;
    font-size: 14px;
    color: #444444;
  }

  /*验证部分*/
  .privilege_verification {
    width: 100%;
    height: 237px;
    margin-top: 25px;
    position: relative;
    /*border:1px solid #000000;*/
  }

  .verification_t {
    font-size: 14px;
    color: #FFFFFF;
  }

  .verification_b {
    text-align: center;
    font-size: 12px;
    color: #b4b4b6;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .privilege_verification ul {
    width: 100%;
    overflow: hidden;
  }

  .privilege_verification ul li {
    height: 30px;
    position: relative;
  }

  .privilege_verification ul li svg {
    font-size: 25px;
    color: #FFFFFF;
    margin-left: 5px;
    float: left;
  }

  .privilege_verification ul li input {
    width: 60%;
    height: 100%;
    float: left;
    background: #44474B;
    border: none;
    font-size: 14px;
    color: #FFFFFF;
  }

  .privilege_verification ul li span {
    width: 25%;
    height: 30px;
    border: 0.5px solid #808080;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 30px;
    float: right;
  }

  .privilege_verification ul li:nth-of-type(1) {
    margin-top: 17px;
    /*border:1px solid #000000;*/
  }

  .privilege_verification ul li:nth-of-type(2) {
    margin-top: 28px;
    /*border:1px solid #000000;*/
  }

  .privilege_verification ul li:nth-of-type(1):after {
    position: absolute;
    right: 30%;
    bottom: 3px;
    left: 2%;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #808080;
  }

  .privilege_verification ul li:nth-of-type(2):after {
    position: absolute;
    right: 0px;
    bottom: 3px;
    left: 2%;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #808080;
  }

  .privilege_verification ul li:nth-of-type(3) {
    margin-top: 30px;
    height: 53px;

  }

  .privilege_verification ul li:nth-of-type(3) button {
    width: 150px;
    height: 53px;
    background: #03aef9;
    border-radius: 100px;
    border-color: #03aef9;
    font-size: 18px;
    color: #FFFFFF;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 99;
  }

  .privilege_verification ul li:nth-of-type(3) img {
    width: 41px;
    height: 29px;
    position: absolute;
    left: 66%;
    top: 37%;
  }

  /*信息部分*/
  .privilege_B {
    width: 100%;
    padding-bottom: 25px;
    position: relative;
  }

  .privilege_B p:nth-of-type(1) {
    font-size: 18px;
    color: #444444;
    text-align: center;

  }

  .privilege_B p:nth-of-type(2) {
    font-size: 14px;
    color: #444444;
    text-align: center;
    margin-top: 8px;
    margin-bottom: 22px;

  }

  .privilege_B p:nth-of-type(3) {
    font-size: 14px;
    color: #808080;
    text-align: center;
    margin-top: 16px;

  }

  .privilege_B div {
    width: 100%;
    height: 347px;
    position: relative;

  }

  .privilege_B div img {
    width: 253px;
    height: 347px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;

  }

  /*中间*/
  .privilege_m {
    width: 100%;
    height: 120px;
    border: 1px solid #000000;
  }

  .privilege_m svg {
    /*font-size:;*/
  }

  /*.privilege_m .icon{*/
  /*font-size:400px;*/
  /*}*/

</style>
