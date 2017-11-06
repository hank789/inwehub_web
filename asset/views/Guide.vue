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
  export default {
    data: () => ({}),
    created () {
      window.mui.plusReady(function () {
        window.plus.navigator.setFullscreen(true)
      })
    },
    mounted () {
      window.mui('.mui-slider').slider()

      var t = this
      // 立即体验按钮点击事件
      document.getElementById('close').addEventListener('tap', function (event) {
        localEvent.setLocalItem('lauchFlag', {showGuide: true})
        window.plus.navigator.setFullscreen(false)
        t.$router.replace('/')
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
    width: 156px;
    left: 50%;
    margin-left: -80px;
    bottom: 15%;
    padding: 10px;
    color: #03aef9;
    border-color: #03aef9;
  }

  .item-logo {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .item-logo a {
    width: 200px;
    height: 200px;
    display: block;
    border: 1px solid #FFFFFF;
    border-color: rgba(255, 255, 255, 0.5);
    text-align: center;
    line-height: 200px;
    border-radius: 50%;
    font-size: 40px;
    color: #fff;
    position: absolute;
    top: 15%;
    left: 50%;
    margin-left: -100px;
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
    margin-bottom: 20px;
  }

  .animate li {
    width: 50%;
    height: 30px;
    line-height: 30px;
    list-style: none;
    font-size: 16px;
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
      -webkit-transform: translate3d(0, -3000px, 0);
      transform: translate3d(0, -3000px, 0);
    }
    60% {
      opacity: 1;
      -webkit-transform: translate3d(0, 25px, 0);
      transform: translate3d(0, 25px, 0);
    }
    75% {
      -webkit-transform: translate3d(0, -5px, 0);
      transform: translate3d(0, -5px, 0);
    }
    90% {
      -webkit-transform: translate3d(0, 3px, 0);
      transform: translate3d(0, 3px, 0);
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
      -webkit-transform: translate3d(-3000px, 0, 0);
      transform: translate3d(-3000px, 0, 0);
    }
    60% {
      opacity: 1;
      -webkit-transform: translate3d(25px, 0, 0);
      transform: translate3d(25px, 0, 0);
    }
    75% {
      -webkit-transform: translate3d(-10px, 0, 0);
      transform: translate3d(-10px, 0, 0);
    }
    90% {
      -webkit-transform: translate3d(5px, 0, 0);
      transform: translate3d(5px, 0, 0);
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
      -webkit-transform: translate3d(3000px, 0, 0);
      transform: translate3d(3000px, 0, 0);
    }
    60% {
      opacity: 1;
      -webkit-transform: translate3d(-25px, 0, 0);
      transform: translate3d(-25px, 0, 0);
    }
    75% {
      -webkit-transform: translate3d(10px, 0, 0);
      transform: translate3d(10px, 0, 0);
    }
    90% {
      -webkit-transform: translate3d(-5px, 0, 0);
      transform: translate3d(-5px, 0, 0);
    }
    100% {
      -webkit-transform: none;
      transform: none;
    }
  }

  .mui-slider-indicator .mui-indicator {
    background: #dcdcdc;
    box-shadow: none;
    width: 9px;
    height: 9px;
    margin: 1px 1px;
  }

  .mui-slider-indicator .mui-active.mui-indicator {
    background: #41cff9;
  }

  .mui-slider-indicator {
    bottom: 39px;
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
    margin-left: -117px;
    position: absolute;
    left: 50%;
    top: 20%;
    width: 234px;
    height: 133px;
    background-image: url(../statics/images/guide_05.png);
    background-color: #f2fbfe;
    background-size: 92%;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .guide-4 .logo .title {
    font-size: 15px;
    color: #323436;
    text-align: center;
    position: absolute;
    bottom: 7px;
    width: 100%;
  }
</style>
