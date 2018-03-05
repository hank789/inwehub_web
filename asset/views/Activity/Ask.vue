<template>
  <div>
    <div class="mui-content">

      <div class="basic">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <div class="info">
          <div class="img"></div>
        </div>
      </div>

      <div class="content">
        <h5>什么是付费专业问答?</h5>
        <p>我们追求和致力营造一个高品质的专家帮助社区，通过问答解决您面临的企业管理咨询和SAP相关的问题。所有入驻的专家有着较高的准入门槛，付费是对专家耗费时间和精力的感谢。提问的定价<b>（88元/ 60元/ 28元）</b>及更多问题，您可以点击<a
          @tap.stop.prevent="$router.pushPlus('/help/question')">常见问题</a>寻找答案。</p>

        <h5>如何提出一个好问题？</h5>
        <p>好刀要用于钢刃上，既然是专业问答服务，我们就希望您问的更专业些。我们在主页上会随时更新优质的提问，供您提问时候进行参考。为了能够快速准确的解决问题，您还需要遵守一定的<a
          @tap.stop.prevent="$router.pushPlus('/help/ask')">问答规范</a>。</p>

        <h5>首问优惠为什么还要我支付1元？</h5>
        <p>众所周知，免费的其实是最贵的。1元的收取更具象征意义，表明您和我们对专家提供专业服务时候，所需要耗费的时间精力的鼓励和支持！您在提好问题并进行支付时，我们会提示您使用相应优惠的！</p>

        <h5>我觉得我比较害羞，我不好意思提问怎么办？</h5>
        <p>小哈不是老虎，放心大胆的问吧。如果还是害羞，你可以试试匿名提问。小哈始终致力于为你带来轻松的体验！</p>

        <div class="warning">在法律允许的范围内，本公司保留对本活动的最终解释权</div>
      </div>

      <div class="bottomNav"></div>

      <div class="fixedWrapper">
        <div class="freeAskWrapper">
          <div class="freeAsk">
            <div class="icon"></div>
            <div class="text">你的首问1元特惠还剩
              <div v-html="couponExpireAtText"></div>
            </div>
          </div>
        </div>

        <div class="buttonWrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.push('/ask')">
            立即前往提问
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { TimeEndText } from '../../utils/time'

  export default {
    data () {
      return {
        loading: 1,
        couponExpireAtTime: false,
        currentTime: parseInt((new Date()).getTime() / 1000)
      }
    },
    computed: {
      couponExpireAtText () {
        if (this.couponExpireAtTime) {
          return TimeEndText(this.currentTime, this.couponExpireAtTime)
        }
      }
    },
    methods: {
      timeAutoEnd: function () {
        if (this.timeAutoEndTimeOut) {
          clearTimeout(this.timeAutoEndTimeOut)
        }
        this.timeAutoEndTimeOut = setTimeout(() => {
          this.currentTime = parseInt((new Date()).getTime() / 1000)
          this.timeAutoEnd()
        }, 1000)
      }
    },
    mounted () {
    },
    created () {
      this.couponExpireAtTime = this.$route.query.couponExpireAtTime ? this.$route.query.couponExpireAtTime : 0
      if (this.couponExpireAtTime) {
        this.timeAutoEnd()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .basic {
    position: relative;
    background: #ececee;

    width: 100%;
    height: 3.44rem;
    text-align: center;
  }

  .basic .info {
    position: absolute;
    left: 50%;
    margin-left: -2.72rem;
    top: 0.88rem;
    color: #808080;
    font-size: 0.346rem;
  }

  .basic a {
    position: absolute;
    color: #444444;
    font-size: 0.8rem;
    top: 0.426rem;
    left: 0.186rem;
  }

  .basic .info .img {
    width: 5.44rem;
    height: 2.053rem;
    background-image: url(../../statics/images/askcoupon@2x.png);
    background-size: contain;
  }

  .freeAsk .text div {
    font-size: 0.32rem;
    color: #444;
  }

  .freeAsk .text div span {
    color: #03aef9;
    margin-left: 0.133rem;
    font-size: 0.373rem;
  }

  .freeAskWrapper {
    margin-top: 0.533rem;
    width: 100%;
    height: 1.28rem;
  }

  .freeAsk {
    position: absolute;
    left: 0.666rem;
    right: 0.4rem;
  }

  .freeAsk .icon {
    position: absolute;
    width: 0.933rem;
    left: -0.213rem;
    top: -0.133rem;
    height: 1.28rem;
    display: inline-block;
    background-image: url("../../statics/images/icon_xiaoha@2x.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  .freeAsk .text {
    background: #dcdcdc;
    border: 0.026rem #dcdcdc solid;
    border-radius: 1.333rem;
    font-size: 0.373rem;
    line-height: 0.373rem;
    color: #323232;
    padding: 0.346rem 0rem 0.346rem 0.933rem;

  }

  .freeAsk .text div {
    display: inline-block;
  }

  .mui-navigate-right:after {
    right: 0.266rem;
    font-size: 0.586rem;
  }

  .buttonWrapper {
    margin-top: 0.266rem;
    height: 1.333rem;
    padding: 0 0.4rem;
  }

  .buttonWrapper button {
    margin-top: 0.266rem;
    border-radius: 1.333rem;
    background: #03aef9;
    border: 0.026rem solid #03aef9;
  }

  .content {
    background: #fff;
    font-size: 0.346rem;
    color: #808080;
    padding: 0.666rem 0.266rem 0.533rem 0.853rem;
  }

  .content h5 {
    position: relative;
    margin-top: 0.8rem;
  }

  .content h5:first-child {
    margin-top: 0;
  }

  .content b {
    color: #03aef9;
    font-weight: normal;
  }

  .content a {
    color: #03aef9;
    text-decoration: underline;
  }

  .content p {
    margin-bottom: 0;
  }

  .content h5:before {
    position: absolute;
    left: -0.426rem;
    top: 0.133rem;
    content: "";
    display: inline-block;
    background: #03aef9;
    width: 0.133rem;
    height: 0.133rem;
    border: 0.026rem solid #03aef9;
    border-radius: 0.133rem;
  }

  .warning {
    font-size: 0.32rem;
    color: #808080;
    padding: 0.4rem 0 0.133rem 0;
  }

  .bottomNav {
    width: 100%;
    height: 3.92rem;
  }

  .fixedWrapper {
    position: fixed;
    width: 100%;
    height: 3.92rem;
    bottom: 0;
    background: #efeff4;

  }

  .cover {
    top: -0.08rem !important;
  }
</style>
