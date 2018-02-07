function renderMapList (list, map) {
  for (var j = 0; j < list.length; j++) {
    var labelPoint = new window.BMap.Point(list[j].longitude, list[j].latitude)
    var opts = {
      position: labelPoint    // 指定文本标注所在的地理位置
    }
    var labelName = list[j].name
    labelName = labelName.replace(/\s+/g, '')
    labelName = labelName.replace(/（/g, '')
    labelName = labelName.replace(/）/g, '')
    var label = new window.BMap.Label(labelName, opts)  // 创建文本标注对象
    label.setStyle({
      display: 'inline-block',
      border: '1px solid #fff',
      borderRadius: '50%',
      background: '#03aef9',
      color: '#ffffff',
      fontSize: '14px',
      padding: '0',
      opacity: '0.9',
      height: '54px',
      width: '54px',
      textAlign: 'center',
      overflow: 'hidden',
      lineHeight: '52px',
      fontFamily: '微软雅黑'
    })
    map.addOverlay(label)
  }
}
export {
  renderMapList
}
