<template>
  <div>
    <div id="slider" class="mui-slider mui-fullscreen" style="background-color: black;">
      <div class="mui-slider-group">


        <!-- 第一张 -->
        <div class="mui-slider-item guide guide-0">

        </div>
        <!-- 第二张 -->
        <div class="mui-slider-item guide guide-1">

        </div>
        <!-- 第三张 -->
        <div class="mui-slider-item guide guide-2">
        </div>
        <!-- 第四张 -->
        <div class="mui-slider-item guide guide-3">

        </div>

        <!-- 第五张 -->
        <div class="mui-slider-item guide guide-4">
          <div class="logo">
            <div class="title">最具品质的咨询顾问社区</div>
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
        <div class="mui-indicator"></div>
      </div>
    </div>
  </div>
</template>

<script>

  import localEvent from '../stores/localStorage'
  import { openFullscreen, closeFullscreen } from '../utils/plus'
  export default {
    data: () => ({}),
    created () {
      openFullscreen()
    },
    mounted () {
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

  .guide-0 {
    background-image: url(../statics/images/guide_01.png);
  }

  .guide-1 {
    background-image: url(../statics/images/guide_02.png);
    background-color: #646668;
  }

  .guide-2 {
    background-image: url(../statics/images/guide_03.png);
    background-color: #f2fbfe;
  }

  .guide-3 {
    background-image: url(../statics/images/guide_04.png);
    background-color: #646668;
  }

  .guide-4 .logo {
    margin-left: -3.12rem;
    position: absolute;
    left: 50%;
    top: 20%;
    width: 6.24rem;
    height: 3.546rem;
    background-image: url(../statics/images/guide_05.png);
    background-color: #f2fbfe;
    background-size: 92%;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .guide-4 .logo .title {
    font-size: 0.4rem;
    color: #323436;
    text-align: center;
    position: absolute;
    bottom: 0.186rem;
    width: 100%;
  }
</style>
