<template>
  <div>
    <div id="testWrapper">
      <div id="animationContainer" style="width:293px; height:336px">
        <canvas id="canvas" width="293" height="336"></canvas>
        <div id="domOverlayContainer" style="pointer-events:none; overflow:hidden; width:293px; height:336px; position: absolute; left: 0px; top: 0px; display: block;">
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
        var canvas = document.getElementById('canvas')
        var domOverlayContainer = document.getElementById('domOverlayContainer')
        var animContainer = document.getElementById('animationContainer')
        var stage = select(canvas, window.lib.红包)
        run(canvas, stage, domOverlayContainer, animContainer, window.lib)
        var apper = document.getElementById('my-cash')
        console.error(apper.currentStyle)
      }, 400)
    }
  }
</script>

<style>
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
    width:29px;
    height:29px;
    border-radius:50%;
    background: #808080;
    position: absolute;
    left:0;
    right:0;
    bottom:-50px;
    margin:auto;
    display: none;
  }
  .cash-button svg{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    color: #FFFFFF;
    font-size:20px;
    margin:auto;
  }
  /*跳转按钮*/
  .my-wallet{
    width:88%;
    height:34px;
    border:1px solid #fc98bb;
    border-radius: 50px;
    text-align: center;
    line-height: 34px;
    font-size:14px;
    color: #fdd6e3;
    position: absolute;
    left:0;
    right:0;
    bottom: 55px;
    margin:auto;
  }
  /*红包详情*/
  .my-cash{
    width:58%;
    height:105px;
    position: absolute;
    left:0;
    right:0;
    top: 60px;
    margin:auto;
  }
  .my-cash i{
    position: absolute;
    width: 100%;
    height:1.5px;
    background: #808080;
    left:0;
    right:0;
    top:0px;
    bottom: 0;
    margin:auto;
  }
  .my-cash p{
    width:100%;
    height:52px;
    text-align: center;
    line-height:52px;
    color: #444444;
  }
  .my-cash p:nth-of-type(1){
    font-size:64px;
    font-weight: 500;
  }
  .my-cash p:nth-of-type(1) span{
    font-size: 24px;
    font-weight: 500;
    position: relative;
    top: -30px;
  }
  .my-cash p:nth-of-type(2){
    font-size: 16px;
    font-weight: 500;
  }
  /**/
</style>
