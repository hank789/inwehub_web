<template>
  <div>
    <div id="slider" class="mui-slider mui-fullscreen" style="background-color: black;">
      <div class="mui-slider-group">


        <!-- 第一张 -->
        <div class="mui-slider-item guide guide-0">
          <div class="guide-text">
            <div>行业情报信息一站式提供</div>
            <div>精选行业资讯<i></i>追踪领域热点</div>
          </div>
        </div>
        <!-- 第二张 -->
        <div class="mui-slider-item guide guide-1">
          <div class="guide-text">
            <div>打造有影响力的行业人脉</div>
            <div>圈子动态分享<i></i>互助解疑答惑</div>
          </div>
        </div>
        <!-- 第三张 -->
        <div class="mui-slider-item guide guide-2">
          <div class="guide-text">
            <div>助力企业明智决策与购买</div>
            <div>企业服务推荐<i></i>真实互动评价</div>
          </div>
        </div>
        <!-- 第四张 -->
        <!--<div class="mui-slider-item guide guide-3">-->

        <!--</div>-->

        <!-- 第五张 -->
        <div class="mui-slider-item guide guide-4">
          <div class="logo">
            <div class="title">企业级应用&amp;服务广场</div>
          </div>
          <div class="animate">
            <div id='close' class="mui-btn mui-btn-warning mui-btn-outlined">开启</div>
          </div>
        </div>

      </div>
      <div class="mui-slider-indicator">
        <div class="mui-indicator mui-active"></div>
        <div class="mui-indicator"></div>
        <div class="mui-indicator"></div>
        <div class="mui-indicator"></div>
        <!--<div class="mui-indicator"></div>-->
      </div>
    </div>
  </div>
</template>

<script>

  import localEvent from '../stores/localStorage'
  import { openFullscreen, closeFullscreen, closeSplashscreen } from '../utils/plus'
  export default {
    data: () => ({}),
    created () {
      openFullscreen()
    },
    mounted () {
      closeSplashscreen()
      window.mui('.mui-slider').slider()

      var t = this
      // 立即体验按钮点击事件
      document.getElementById('close').addEventListener('tap', function (event) {
        localEvent.setLocalItem('lauchFlag', {showGuide: true})
        closeFullscreen()
        t.$router.replace('/home')
      }, false)

      // 图片切换时，触发动画
//      document.querySelector('.mui-slider').addEventListener('slide', function (event) {
//        var index = event.detail.slideNumber + 1;
//        if (index == 2 || index == 3) {
//          var item = document.getElementById("tips-" + index);
//          if (item.classList.contains("mui-hidden")) {
//            item.classList.remove("mui-hidden");
//            item.classList.add("guide-show");
//          }
//        }
//      });
    }
  }
</script>

<style scoped="scoped">
  #close {
    position: absolute;
    width: 4.16rem;
    left: 50%;
    margin-left: -2.133rem;
    bottom: 15%;
    padding: 0.266rem;
    color: #03aef9;
    border-color: #03aef9;
  }

  .item-logo {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .item-logo a {
    width: 5.333rem;
    height: 5.333rem;
    display: block;
    border: 0.026rem solid #FFFFFF;
    border-color: rgba(255, 255, 255, 0.5);
    text-align: center;
    line-height: 5.333rem;
    border-radius: 50%;
    font-size: 1.066rem;
    color: #fff;
    position: absolute;
    top: 15%;
    left: 50%;
    margin-left: -2.666rem;
  }

  .animate {
    position: absolute;
    left: 0;
    top: 60%;
    width: 100%;
    color: #fff;
    display: -moz-box;
  }

  .animate h2 {
    text-align: center;
    margin-bottom: 0.533rem;
  }

  .animate li {
    width: 50%;
    height: 0.8rem;
    line-height: 0.8rem;
    list-style: none;
    font-size: 0.426rem;
    text-align: right;
  }

  .animate li:nth-child(3) {
    text-align: left;
    float: right;
  }

  .animated {
    -webkit-animation-duration: 1s;
    -webkit-animation-play-state: paused;
    -webkit-animation-fill-mode: both;
  }

  .guide-show .bounceInDown {
    -webkit-animation-name: bounceInDown;
    -webkit-animation-play-state: running;
    -webkit-animation-delay: 1s;
    display: block;
  }

  .guide-show .bounceInLeft {
    -webkit-animation-name: bounceInLeft;
    display: block;
    -webkit-animation-play-state: running;
  }

  .guide-show .bounceInRight {
    -webkit-animation-name: bounceInRight;
    display: block;
    -webkit-animation-play-state: running;
    -webkit-animation-delay: 0.5s;
  }

  @-webkit-keyframes bounceInDown {
    0%, 60%, 75%, 90%, 100% {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -80rem, 0);
      transform: translate3d(0, -80rem, 0);
    }
    60% {
      opacity: 1;
      -webkit-transform: translate3d(0, 0.666rem, 0);
      transform: translate3d(0, 0.666rem, 0);
    }
    75% {
      -webkit-transform: translate3d(0, -0.133rem, 0);
      transform: translate3d(0, -0.133rem, 0);
    }
    90% {
      -webkit-transform: translate3d(0, 0.08rem, 0);
      transform: translate3d(0, 0.08rem, 0);
    }
    100% {
      -webkit-transform: none;
      transform: none;
    }
  }

  @-webkit-keyframes bounceInLeft {
    0%, 60%, 75%, 90%, 100% {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }
    0% {
      opacity: 0;
      -webkit-transform: translate3d(-80rem, 0, 0);
      transform: translate3d(-80rem, 0, 0);
    }
    60% {
      opacity: 1;
      -webkit-transform: translate3d(0.666rem, 0, 0);
      transform: translate3d(0.666rem, 0, 0);
    }
    75% {
      -webkit-transform: translate3d(-0.266rem, 0, 0);
      transform: translate3d(-0.266rem, 0, 0);
    }
    90% {
      -webkit-transform: translate3d(0.133rem, 0, 0);
      transform: translate3d(0.133rem, 0, 0);
    }
    100% {
      -webkit-transform: none;
      transform: none;
    }
  }

  @-webkit-keyframes bounceInRight {
    0%, 60%, 75%, 90%, 100% {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }
    0% {
      opacity: 0;
      -webkit-transform: translate3d(80rem, 0, 0);
      transform: translate3d(80rem, 0, 0);
    }
    60% {
      opacity: 1;
      -webkit-transform: translate3d(-0.666rem, 0, 0);
      transform: translate3d(-0.666rem, 0, 0);
    }
    75% {
      -webkit-transform: translate3d(0.266rem, 0, 0);
      transform: translate3d(0.266rem, 0, 0);
    }
    90% {
      -webkit-transform: translate3d(-0.133rem, 0, 0);
      transform: translate3d(-0.133rem, 0, 0);
    }
    100% {
      -webkit-transform: none;
      transform: none;
    }
  }

  .mui-slider-indicator .mui-indicator {
    background: #dcdcdc;
    box-shadow: none;
    width: 0.24rem;
    height: 0.24rem;
    margin: 0.026rem 0.026rem;
  }

  .mui-slider-indicator .mui-active.mui-indicator {
    background: #41cff9;
  }

  .mui-slider-indicator {
    bottom: 1.04rem;
  }

  .guide {
    background-repeat: no-repeat;
    background-position: center 24%;
    background-size: contain;
    background-color: #f2fbfe;
  }
  .guide .guide-text {
    margin-left: -3.12rem;
    position: absolute;
    left: 50%;
    top: 66%;
    width: 6.24rem;
    text-align: center;
    margin-top: 1.306rem;
  }
  .guide .guide-text div:nth-of-type(1) {
    color: #03AEF9;
    font-size: 0.56rem;
  }
  .guide .guide-text div:nth-of-type(2) {
    color: #A0A0A0;
    font-size: 0.4rem;
    margin-top: 0.346rem;
  }
  .guide .guide-text div:nth-of-type(2) i {
    display: inline-block;
    width: 0.053rem;
    height: 0.053rem;
    background: #A0A0A0;
    border-radius: 50%;
    /*margin-bottom: 0.08rem;*/
    margin: 0 0.08rem 0.106rem;
  }


  .guide-0 {
    background-image: url(../statics/images/guide2_02.jpg);
    background-color: #ffffff;
  }

  .guide-1 {
    background-image: url(../statics/images/guide2_03.png);
    background-color: #ffffff;
  }

  .guide-2 {
    background-image: url(../statics/images/guide2_04.jpg);
    background-color: #ffffff;
  }

  .guide-3 {
    background-image: url(../statics/images/guide_04.png);
    background-color: #ffffff;
  }
  .guide-4 {
    background-color: #ffffff;
  }
  .guide-4 .logo {
    margin-left: -3.12rem;
    position: absolute;
    left: 50%;
    top: 20%;
    width: 6.24rem;
    height: 3.546rem;
    background-image: url(../statics/images/guide_05.png);
    background-color: #ffffff;
    background-size: 92%;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .guide-4 .logo .title {
    font-size: 0.4rem;
    color: #747576;
    text-align: center;
    position: absolute;
    bottom: 0.186rem;
    width: 100%;
  }
</style>
