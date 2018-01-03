function select (canvas, ClassName) {
  var exportRoot = new ClassName()
  var stage = new window.createjs.Stage(canvas)
  stage.addChild(exportRoot)
  return stage
}

function run (canvas, stage, domOverlayContainer, animContainer, lib) {
  var fnStartAnimation = () => {
    window.createjs.Ticker.setFPS(lib.properties.fps)
    window.createjs.Ticker.addEventListener('tick', stage)
  }
  // Code to support hidpi screens and responsive scaling.
  var makeResponsive = (isResp, respDim, isScale, scaleType) => {
    var lastW = 1
    var lastH = 1
    var lastS = 1

    var resizeCanvas = () => {
      var w = lib.properties.width
      var h = lib.properties.height
      var iw = window.innerWidth
      var ih = window.innerHeight
      var pRatio = window.devicePixelRatio || 1
      var xRatio = iw / w
      var yRatio = ih / h
      var sRatio = 1
      if (isResp) {
        if ((respDim === 'width' && lastW === iw) || (respDim === 'height' && lastH === ih)) {
          sRatio = lastS
        } else if (!isScale) {
          if (iw < w || ih < h) {
            sRatio = Math.min(xRatio, yRatio)
          }
        } else if (scaleType === 1) {
          sRatio = Math.min(xRatio, yRatio)
        } else if (scaleType === 2) {
          sRatio = Math.max(xRatio, yRatio)
        }
      }
      canvas.width = w * pRatio * sRatio
      canvas.height = h * pRatio * sRatio
      canvas.style.width = domOverlayContainer.style.width = animContainer.style.width = w * sRatio + 'px'
      canvas.style.height = animContainer.style.height = domOverlayContainer.style.height = h * sRatio + 'px'
      stage.scaleX = pRatio * sRatio
      stage.scaleY = pRatio * sRatio
      lastW = iw
      lastH = ih
      lastS = sRatio
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
  }

  makeResponsive(false, 'both', false, 1)
  fnStartAnimation()
}

export {
  select,
  run
}

