<template>
  <div>
    <div id="testWrapper">
      <div id="animationContainer" style="width:7.813rem; height:8.96rem">
        <canvas id="canvas" width="293" height="336"></canvas>
        <div id="domOverlayContainer" style="pointer-events:none; overflow:hidden; width:7.813rem; height:8.96rem; position: absolute; left: 0rem; top: 0rem; display: block;">
        </div>
        <!--红包详情-->
        <div class="my-cash" id="my-cash">
          <p><span>¥</span>5</p>
          <i></i>
          <p>现金红包</p>
        </div>
        <!--跳转按钮-->
        <p class="my-wallet alertConfirm">查看我的钱包</p>
        <!--关闭按钮-->
        <div class="cash-button alertClose">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-guanbi"></use>
          </svg>
        </div>
        <!---->

      </div>
    </div>
  </div>
</template>
<script>
  import { run, select } from '../utils/createjs.js'
  import { alertHtml } from '../utils/dialog'
  export default {
    data () {
      return {
      }
    },
    computed: {},
    components: {},
    methods: {},
    mounted () {
      var html = document.getElementById('testWrapper').innerHTML
      document.getElementById('testWrapper').innerHTML = ''
      alertHtml(html, (index) => {
        if (index === 0) {
          this.$router.pushPlus('/my/Finance')
          return true
        }
      }, 'animationContainerWrapper')

      setTimeout(() => {
        var canvas = document.getElementById('animationContainerWrapper').querySelector('#canvas')
        var domOverlayContainer = document.getElementById('animationContainerWrapper').querySelector('#domOverlayContainer')
        var animContainer = document.getElementById('animationContainerWrapper').querySelector('#animationContainer')
        var stage = select(canvas, window.lib.红包)
        run(canvas, stage, domOverlayContainer, animContainer, window.lib)
        var apper = document.getElementById('my-cash')
        console.error(apper.currentStyle)
      }, 400)
    }
  }
</script>

<style scoped>
  #animationContainer {
    position:absolute;
    margin:auto;
    left:0;right:0;
    top:0;bottom:0;
  }

  .animationContainerWrapper{
    position:absolute;
    left:0;right:0;
    top:0;bottom:0;
    z-index: 10000;
  }
  /*关闭按钮*/
  .cash-button{
    width:0.773rem;
    height:0.773rem;
    border-radius:50%;
    background: #808080;
    position: absolute;
    left:0;
    right:0;
    top:50%;
    margin:auto;
  }
  .cash-button svg{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    color: #FFFFFF;
    font-size:0.533rem;
    margin:auto;
  }
  /*跳转按钮*/
  .my-wallet{
    width:88%;
    height:0.906rem;
    border:0.026rem solid #fc98bb;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.906rem;
    font-size:0.373rem;
    color: #fdd6e3;
    position: absolute;
    left:0;
    right:0;
    bottom: 1.466rem;
    margin:auto;
  }
  /*红包详情*/
  .my-cash{
    width:58%;
    height:2.8rem;
    position: absolute;
    left:0;
    right:0;
    top: 1.6rem;
    margin:auto;
  }
  .my-cash i{
    position: absolute;
    width: 100%;
    height:0.04rem;
    background: #808080;
    left:0;
    right:0;
    top:0rem;
    bottom: 0;
    margin:auto;
  }
  .my-cash p{
    width:100%;
    height:1.386rem;
    text-align: center;
    line-height:1.386rem;
    color: #444444;
  }
  .my-cash p:nth-of-type(1){
    font-size:1.706rem;
    font-weight: 500;
  }
  .my-cash p:nth-of-type(1) span{
    font-size: 0.64rem;
    font-weight: 500;
    position: relative;
    top: -0.8rem;
  }
  .my-cash p:nth-of-type(2){
    font-size: 0.426rem;
    font-weight: 500;
  }
  /**/
</style>
