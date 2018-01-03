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
  import { init } from '../utils/createjs.js'
  import { alertHtml } from '../utils/dialog'
  export default {
    data () {
      return {
        stage: null,
        canvas: null
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
        this.canvas = document.getElementById('canvas')
        this.stage = new window.createjs.Stage(this.canvas)
        var domOverlayContainer = document.getElementById('domOverlayContainer')
        var animContainer = document.getElementById('animationContainer')
        var exportRoot = new window.lib.红包()
        this.stage.addChild(exportRoot)
        init(this.canvas, this.stage, domOverlayContainer, animContainer, window.lib)
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
