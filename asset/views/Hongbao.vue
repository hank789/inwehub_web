<template>
  <div style="background: #000">
    <div id="animationContainer" style="width:550px; height:400px">
      <canvas id="canvas" width="300" height="200">
      </canvas>
      <div id="domOverlayContainer" style="pointer-events:none; overflow:hidden; width:550px; height:400px; position: absolute; left: 0px; top: 0px; display: block;">
      </div>
    </div>
  </div>
</template>
<script>
  import { init } from '../utils/createjs.js'
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
      this.canvas = document.getElementById('canvas')
      this.stage = new window.createjs.Stage(this.canvas)
      var domOverlayContainer = document.getElementById('domOverlayContainer')
      var animContainer = document.getElementById('animationContainer')

      var exportRoot = new window.lib.红包()
      this.stage.addChild(exportRoot)

      init(this.canvas, this.stage, domOverlayContainer, animContainer)
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
</style>
