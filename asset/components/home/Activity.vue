<template>
  <div class="activityWrapper" :class="{unIsGetted:!isGeted}">

    <div class="container-1-yuan mui-navigate-right" v-show="couponExpireAtText && couponExpireAtTime"
         @tap.stop.prevent="$router.pushPlus('/activity/ask?couponExpireAtTime='+couponExpireAtTime)">你的首问1元特惠还剩<span
      v-html="couponExpireAtText"></span></div>

    <div id="freeAskTemplate" style="display: none;">
      <div class="freeAskGet"></div>
      <div class="freeAskGetButton" @tap.stop.prevent="getFreeAsk()"></div>
    </div>

    <div id="freeAskSuccessTemplate" style="display: none;">
      <div class="xiaoha"></div>
      <div class="success"></div>
      <div class="close" @tap.stop.prevent="closeFreeAskSuccessTemplate()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-times1"></use>
        </svg>
      </div>
    </div>
  </div>
</template>


<script type="text/javascript">
  import { TimeEndText } from '../../utils/time'
  import { setStatusBarBackgroundAndStyle } from '../../utils/statusBar'
  import { postRequest } from '../../utils/request'

  export default {
    data () {
      return {
        isGeted: false,
        firstAsk: false,
        couponExpireAtTime: 0,
        currentTime: parseInt((new Date()).getTime() / 1000),
        timeAutoEndTimeOut: false
      }
    },
    computed: {
      // 首页倒计时；
      couponExpireAtText () {
        if (this.couponExpireAtTime) {
          return TimeEndText(this.currentTime, this.couponExpireAtTime)
        }
      }
    },
    props: {},
    created () {
    },
    watch: {
      'couponExpireAtTime' (newVal, oldVal) {
        if (newVal) {
          this.timeAutoEnd()
        }
      },
      'firstAsk' (newVal, oldVal) {
        if (newVal) {
          this.showFreeAskGet()
        }
      }
    },
    mounted () {
      this.getHomeData()
    },
    methods: {
      getHomeData () {
        postRequest(`home`, {}, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.firstAsk = false // response.data.data.first_ask_ac.show_first_ask_coupon;
          var couponExpireAtTime = response.data.data.first_ask_ac.coupon_expire_at
          if (couponExpireAtTime) {
            this.couponExpireAtTime = Date.parse(couponExpireAtTime.replace(/-/g, '/')) / 1000
          }
        })
      },
      closeFreeAskSuccessTemplate: function () {
        var FreeTemplate = document.getElementById('freeAskSuccessTemplate')
        FreeTemplate.style.display = 'none'

        if (window.mui('.mui-backdrop')[0]) {
          document.body.removeChild(window.mui('.mui-backdrop')[0])
        }
      },
      closeFreeAskTemplate: function () {
        var FreeTemplate = document.getElementById('freeAskTemplate')
        FreeTemplate.style.display = 'none'

        if (window.mui('.mui-backdrop')[0]) {
          document.body.removeChild(window.mui('.mui-backdrop')[0])
        }
      },
      getFreeAsk: function () {
        postRequest(`activity/getCoupon`, {
          'coupon_type': 1
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.isGeted = true
          this.showFreeAskGetSuccess()
          this.getHomeData()
        })
      },
      showFreeAskGet: function () {
        var FreeTemplate = document.getElementById('freeAskTemplate')
        FreeTemplate.style.display = 'block'
        var mask = window.mui.createMask(() => {
          FreeTemplate.style.display = 'none'
          setStatusBarBackgroundAndStyle('#f3f4f6', 'dark')
        })
        setStatusBarBackgroundAndStyle('#A8A9AB', 'light')
        mask.show() // 显示遮罩
      },
      showFreeAskGetSuccess: function () {
        this.closeFreeAskTemplate()

        var FreeTemplate = document.getElementById('freeAskSuccessTemplate')
        FreeTemplate.style.display = 'block'
        var mask = window.mui.createMask(() => {
          FreeTemplate.style.display = 'none'
          setStatusBarBackgroundAndStyle('#f3f4f6', 'dark')
        })
        mask.show() // 显示遮罩
      },
      // 对时间的处理；
      timeAutoEnd: function () {
        if (this.timeAutoEndTimeOut) {
          clearTimeout(this.timeAutoEndTimeOut)
        }
        this.timeAutoEndTimeOut = setTimeout(() => {
          this.currentTime = parseInt((new Date()).getTime() / 1000)
          this.timeAutoEnd()
        }, 1000)
      }
    }
  }
</script>
<style scoped="scoped">
  /*一元特惠*/
  #freeAskTemplate {
    position: absolute;
    top: 0;
    width: 100%;
    bottom: 0;
    left: 0;
  }

  .freeAskWrapper {
    position: relative;
    height: 4.8rem;
    margin-top: 1.2rem;
  }

  .freeAsk {
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
  }

  .freeAsk .icon {
    position: absolute;
    width: 3.5rem;
    left: -0.8rem;
    top: -0.5rem;
    height: 4.8rem;
    display: inline-block;
    background-image: url("../../statics/images/icon_xiaoha@2x.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  .freeAsk .text {
    background: #dcdcdc;
    border: 0.1rem #dcdcdc solid;
    border-radius: 5rem;
    font-size: 1.4rem;
    line-height: 1.4rem;
    color: #323232;
    padding: 1.3rem 0rem 1.3rem 3.5rem;
  }

  .freeAsk .text div {
    display: inline-block;
  }

  .freeAskGet {
    position: fixed;
    top: 50%;
    margin-top: -18.1rem;
    left: 1rem;
    right: 1rem;
    background: url("../../statics/images/freeAskGet@2x.png") no-repeat center;
    background-size: contain;
    height: 26.2rem;
    z-index: 999;
  }

  .freeAskGetButton {
    position: fixed;
    top: 50%;
    margin: -7rem 0 0 -10rem;
    left: 50%;
    width: 15rem;
    height: 7rem;
    z-index: 1000;
  }

  #freeAskSuccessTemplate .xiaoha {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -19.5rem 0 0 -5rem;
    background: url("../../statics/images/xiaoha-welcome@2x.png") no-repeat center;
    background-size: contain;
    width: 10rem;
    height: 15rem;
    z-index: 999;
  }

  #freeAskSuccessTemplate .success {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -4.5rem 0 0 -14.6rem;
    background: url("../../statics/images/getSuccess@2x.png") no-repeat center;
    background-size: contain;
    width: 29.2rem;
    height: 9.1rem;
    z-index: 999;
  }

  #freeAskSuccessTemplate .close {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: 9.4rem 0 0 -1.9rem;
    z-index: 999;
  }

  #freeAskSuccessTemplate .close .icon {
    font-size: 3.8rem;
    color: #b4b4b6;
  }
</style>
