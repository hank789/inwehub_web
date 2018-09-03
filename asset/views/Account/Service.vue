<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-if="this.$route.params.type == 1">甲方需求方</h1>
      <h1 class="mui-title" v-if="this.$route.params.type == 2">乙方产品方</h1>
      <h1 class="mui-title" v-if="this.$route.params.type == 3">乙方服务方</h1>
      <h1 class="mui-title" v-if="this.$route.params.type == 4">行业从业者</h1>
    </header>
    <div class="mui-content">

      <div v-if="this.$route.params.type == 1">
        <div class="service" @tap.stop.prevent="serviceDetail">
          <div class="serviceTitle">需求委托发布，梳理精准送达</div>
          <div class="line-river-after"></div>
          <div class="serviceText">过程辅助评审梳理，帮企业将需求精准送达合适的服务商和从业者</div>
          <div class="beta">
            <div class="betaBack"></div>
            <span>Beta</span>
          </div>
        </div>
        <div class="service" @tap.stop.prevent="serviceDetail">
          <div class="serviceTitle">产品协助推广，招募信息发布</div>
          <div class="line-river-after"></div>
          <div class="serviceText">获取平台协助，助力职位机遇的扩散发布与产品服务的协助推广</div>
          <div class="beta">
            <div class="betaBack"></div>
            <span>Beta</span>
          </div>
        </div>
      </div>

      <div v-if="this.$route.params.type == 2 || this.$route.params.type == 3">
        <div class="service" @tap.stop.prevent="serviceDetail">
          <div class="serviceTitle">企业招标订阅，纵览全国商机</div>
          <div class="line-river-after"></div>
          <div class="serviceText">为您采集整理行业招投标信息，助您把握行业商机和市场变化</div>
          <div class="beta">
            <div class="betaBack"></div>
            <span>Beta</span>
          </div>
        </div>
        <div class="service" @tap.stop.prevent="serviceDetail">
          <div class="serviceTitle">需求委托发布，梳理精准送达</div>
          <div class="line-river-after"></div>
          <div class="serviceText">过程辅助评审梳理，帮企业将需求精准送达合适的服务商和从业者</div>
          <div class="beta">
            <div class="betaBack"></div>
            <span>Beta</span>
          </div>
        </div>
        <div class="service" @tap.stop.prevent="serviceDetail">
          <div class="serviceTitle">产品协助推广，招募信息发布</div>
          <div class="line-river-after"></div>
          <div class="serviceText">获取平台协助，助力职位机遇的扩散发布与产品服务的协助推广</div>
          <div class="beta">
            <div class="betaBack"></div>
            <span>Beta</span>
          </div>
        </div>
      </div>

      <div v-if="this.$route.params.type == 4">
        <div class="service" @tap.stop.prevent="serviceDetail">
          <div class="serviceTitle">全网机遇聚合，按需订阅推送</div>
          <div class="line-river-after"></div>
          <div class="serviceText">聚合全面新鲜的项目机遇与职位机会，为您精准匹配和推送</div>
          <div class="beta">
            <div class="betaBack"></div>
            <span>Beta</span>
          </div>
        </div>
      </div>

      <div class="serviceFooter">
        <div class="realName" @tap.stop.prevent="$router.pushPlus('/chat/31')">开始实名认证，开启合作之旅</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {
      serviceDetail () {
        window.mui.toast('通过实名认证，了解服务详情')
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #FFFFFF;
  }

  .service {
    width: 343px;
    position: relative;
    margin: 15px auto 0;
    padding: 12px 15px 10px;
    background: #ffffff;
    box-shadow:0px 2px 26px 0px rgba(240,242,245,1);
    border-radius: 8px;
    overflow: hidden;
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
    .beta {
      .betaBack {
        width: 56px;
        height: 57px;
        position: absolute;
        right: -32px;
        top: -24px;
        transform: rotate(141deg);
        background: #F3F4F6;
      }
      span {
        position: absolute;
        right: -2px;
        top: 5px;
        color: #B4B4B6;
        font-size: 11px;
        transform: rotate(53deg);
      }
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
