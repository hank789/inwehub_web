var linkedmeKey = '9afc2456f79118838ab3c1cda99d9711'

function inject () {
  var head = document.getElementsByTagName('head')[0]
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.charset = 'utf-8'
  script.src = 'https://static.lkme.cc/linkedme.min.js'
  head.appendChild(script)

  init()
}

function init () {
  var data = {}
  data.type = 'live'  // 表示现在使用线上模式,如果填写"test", 表示测试模式.
  window.linkedme.init(linkedmeKey, data, function (err, response) {
    if (err) {
      console.log('linkedme 初始化失败:', err)
      // 初始化失败，返回错误对象err
    } else {
      console.log('linkedme 初始化成功')
      createLink()
      // 初始化成功，可以不做处理
    }
  })
}

function createLink () {
  var value1 = 'value1'
  var value2 = 'value2'
  var data = {
    params: '{"key1":"' + value1 + '","key2":"' + value2 + '"}'
  }
  window.linkedme.link(data, function (err, response) {
    if (err) {
      // 生成深度链接失败，返回错误对象err
      console.log('linkedme 生成深度链接失败:', err)
    } else {
      // 生成深度链接成功，深度链接可以通过data.url得到
      console.log('linkedme 生成深度链接成功:' + response.url)
    }
  }, false)
}

export {
  inject
}

