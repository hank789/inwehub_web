<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">甲方需求方</h1>
    </header>
    <div class="mui-content">
      <div class="service">
        <div class="serviceTitle">需求委托发布，梳理精准送达</div>
        <div class="line-river-after"></div>
        <div class="serviceText">过程辅助评审梳理，帮企业将需求精准送达合适的服务商和从业者 </div>
      </div>
      <div class="service">
        <div class="serviceTitle">需求委托发布，梳理精准送达</div>
        <div class="line-river-after"></div>
        <div class="serviceText">过程辅助评审梳理，帮企业将需求精准送达合适的服务商和从业者 </div>
      </div>
      <div class="serviceFooter">
        <div class="realName">开始实名认证，开启合作之旅</div>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="less">
  .mui-content {
    background: #FFFFFF;
  }

  .service {
    width: 343px;
    margin: 15px auto 0;
    padding: 12px 15px 10px;
    background: #ffffff;
    box-shadow:0px 2px 26px 0px rgba(240,242,245,1);
    border-radius: 8px;
    .serviceTitle {
      color: #444444;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      margin-bottom: 12px;
    }
    .serviceText {
      color: #808080;
      font-size: 13px;
      line-height: 21px;
      margin-top: 11px;
    }
  }
  .serviceFooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1.333rem;
    overflow: hidden;
    background: #FFFFFF;
    &:before {
      position: absolute;
      top: 0;
      width: 100%;
      height: .02667rem;
      content: '';
      transform: scaleY(0.5);
      background-color: #dcdcdc;
    }
    .realName {
      width: 343px;
      height: 36px;
      margin: 0 auto;
      background: #03AEF9;
      text-align: center;
      line-height: 36px;
      color: #ffffff;
      font-size: 16px;
      border-radius: 8px;
      margin-top: 6.5px;
    }
  }
</style>
