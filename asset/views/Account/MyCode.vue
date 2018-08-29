<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <!--<h1 class="mui-title">个人名片</h1>-->
    </header>

    <div class="mui-content">

      <!--<div class="logoUpDown">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-tiwen"></use>-->
        <!--</svg>-->
      <!--</div>-->

      <div class="headPortraitInfo">
        <div class="headPortraitImg">
          <img src="../../statics/images/uicon.jpg" alt="">
        </div>
        扫码关注蓝色小白
      </div>

      <div class="myCode">
        <div class="myCodeWrapper"></div>
      </div>

      <div class="preservation">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-baocuntupian"></use>
        </svg>
        <span>保存我的卡片</span>
      </div>

      <div class="bottomText">长见识 · 解疑惑 · 寻合作 · 树形象 · 得收益</div>

    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="less">
  .mui-content {
    background: #FFFFFF;
    text-align: center;
  }
  .logoUpDown {
    text-align: left;
    .icon {
      font-size: 120px;
    }
  }
  .headPortraitInfo {
    font-size: 18px;
    color: #444444;
    line-height: 25px;
    margin-top: 64px;
    margin-bottom: 15px;
    .headPortraitImg {
      width: 34px;
      height: 34px;
      margin: 0 auto 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .myCode {
    width: 238px;
    height: 250px;
    margin: 0 auto;
    background: url("../../statics/images/group.png") no-repeat 0 32px;
    background-size: contain;
    .myCodeWrapper {
      margin: 0 auto;
      width: 167px;
      height: 167px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 26px 0px #F0F2F5;
      border-radius: 4px;
    }
  }

  .preservation {
    margin-top: 91px;
    .icon {
      color: #B4B4B6;
    }
    span {
      color: #444444;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .bottomText {
    width: 100%;
    font-size: 12px;
    color: #808080;
    position: absolute;
    bottom: 33px;
  }
</style>
