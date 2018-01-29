<template>
  <div>
    <div class="map" id="allmap"></div>
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
      // 百度地图API功能
      var map = new window.BMap.Map("allmap");
      var point = new BMap.Point(116.417854,39.921988);
      map.centerAndZoom(point, 15);
      var opts = {
        position : point,    // 指定文本标注所在的地理位置
        offset   : new BMap.Size(-15, -10)    //设置文本偏移量
      }
      var label = new BMap.Label("张三", opts);  // 创建文本标注对象
      label.setStyle({
        border:'none',
        background:'none',
        color : "#ffffff",
        fontSize : "15px",
        height : "20px",
        lineHeight : "20px",
        fontFamily:"微软雅黑"
      });


      var circle = new BMap.Circle(
        new BMap.Point(116.417854,39.921988),
        200,
        {strokeColor:"#fff", fillColor:'#03aef9', strokeWeight:2, strokeOpacity:0.5}); //创建圆

      map.addOverlay(circle);


      map.addOverlay(label);
    }
  }
</script>

<style scoped>
  body, html,#allmap {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
</style>
