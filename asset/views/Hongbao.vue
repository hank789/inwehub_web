<template>
  <div>
    <div class="map" id="allmap"></div>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    computed: {},
    components: {},
    methods: {},
    mounted () {
      // 百度地图API功能
      var map = new window.BMap.Map('allmap')
      var point = new window.BMap.Point(121.4936901919479, 31.23576356859009)
      map.centerAndZoom(point, 15)

      // 标注
      var arr = [
        {x: 121.483964, y: 31.242127, name: '张1张1张1张1张1张1'},
        {x: 121.483015, y: 31.244067, name: '张2'},
        {x: 121.47969907478, y: 31.227760260672, name: '张3'}
      ]
      for (var j = 0; j < arr.length; j++) {
        var labelPoint = new window.BMap.Point(arr[j].x, arr[j].y)
        var opts = {
          position: labelPoint    // 指定文本标注所在的地理位置
        }
        var label = new window.BMap.Label(arr[j].name, opts)  // 创建文本标注对象
        label.setStyle({
          display: 'inline-block',
          border: '0.1rem solid #fff',
          borderRadius: '50%',
          background: '#03aef9',
          color: '#ffffff',
          fontSize: '1.4rem',
          padding: '0',
          opacity: '0.9',
          height: '5.4rem',
          width: '5.4rem',
          textAlign: 'center',
          overflow: 'hidden',
          lineHeight: '5.2rem',
          fontFamily: '微软雅黑'
        })
        map.addOverlay(label)

//        var circle = new window.BMap.Circle(
//          labelPoint,
//          200,
//          {strokeColor: '#fff', fillColor: '#03aef9', strokeWeight: 2, strokeOpacity: 0.5}) // 创建圆
//
//        map.addOverlay(circle)
      }
    }
  }
</script>

<style scoped>
  body, html, #allmap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    font-family: "微软雅黑";
  }
</style>
