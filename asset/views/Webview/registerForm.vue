<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">InweHub</h1>
    </header>

  </div>
</template>


<script>

  export default {
    data: () => ({
      loading: 1
    }),
    created () {

    },
    methods: {},
    watch: {},
    mounted () {
      window.mui.plusReady(() => {
        var ws = window.plus.webview.currentWebview()
        ws.addEventListener('show', createEmbed(ws), false)

        function createEmbed (ws) {
          var url = 'https://jinshuju.net/f/bWXY8y'

          var id = 'jinshuju_son'
          var title = '申请邀请码'

          var webviewBackButton = () => {
            var currentWs = window.plus.webview.getWebviewById(ws.id)
            if (currentWs) {
              console.log('webviewBackButton close')
              currentWs.hide()

              window.plus.key.removeEventListener('backbutton', webviewBackButton)
            }
          }

          var webview = window.plus.webview.create(url, id, {
            popGesture: 'hide',
            top: '0rem',
            bottom: '0rem',
            position: 'dock',
            dock: 'bottom',
            backButtonAutoControl: 'hide',
            statusbar: {background: '#3c3e44'},
            titleNView: {
              backgroundColor: '#3c3e44', // 导航栏背景色
              titleText: title, // 导航栏标题
              titleColor: '#fff', // 文字颜色
              type: 'transparent', // 透明渐变样式
              titleSize: '0.48rem',
              autoBackButton: true, // 自动绘制返回箭头
              splitLine: { // 底部分割线
                color: '#3c3e44'
              }
            },
            bounce: 'vertical'
          })

          window.plus.key.addEventListener('backbutton', () => {
            webviewBackButton()
          })

          // 兼容android
          if (window.mui.os.plus) {
            if (window.mui.os.android) {
              // 创建返回链接
              var viewBack = new window.plus.nativeObj.View('test', {top: '0rem', left: '0rem', height: '1.173rem', width: '2.666rem'})

              viewBack.draw([
                {
                  tag: 'rect',
                  id: 'rect',
                  rectStyles: {color: 'rgba(0,0,0,0)'},
                  position: {top: '0rem', left: '0rem', width: '100%', height: '1.173rem'}
                }
              ])
              viewBack.addEventListener('click', () => {
                webviewBackButton()
              }, false)
              webview.append(viewBack)
            }
          }

          ws.append(webview)
        }
      })
    }
  }

</script>
