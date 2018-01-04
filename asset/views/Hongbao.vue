<template>
  <div>
    <div id="testWrapper">
      <div id="animationContainer" style="width:293px; height:336px">
        <canvas id="canvas" width="293" height="336"></canvas>
        <div id="domOverlayContainer" style="pointer-events:none; overflow:hidden; width:293px; height:336px; position: absolute; left: 0px; top: 0px; display: block;">
        </div>
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
      }, 'animationContainerWrapper')
      setTimeout(() => {
        var canvas = document.getElementById('animationContainerWrapper').querySelector('#canvas')
        var domOverlayContainer = document.getElementById('animationContainerWrapper').querySelector('#domOverlayContainer')
        var animContainer = document.getElementById('animationContainerWrapper').querySelector('#animationContainer')
        var stage = select(canvas, window.lib.红包)
        run(canvas, stage, domOverlayContainer, animContainer, window.lib)
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
</style>
