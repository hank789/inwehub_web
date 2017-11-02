<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
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
      // showInwehubWebview();
    },
    methods: {
      load_article (url) {
        var ws = window.plus.webview.currentWebview()
        var topoffset = '44px'
        if (window.plus.navigator.isImmersedStatusbar()) { // 兼容immersed状态栏模式
          topoffset = (Math.round(window.plus.navigator.getStatusbarHeight()) + 44) + 'px'
        }
        var embed = window.mui.openWindow({
          url: url,
          id: 'inwehub_notice_embed',
          preload: false,
          show: {
            autoShow: false,
            aniShow: 'pop-in'
          },
          styles: {
            cachemode: 'noCache',
            popGesture: 'hide',
            top: topoffset,
            bottom: '0px',
            position: 'dock',
            dock: 'bottom',
            bounce: 'vertical'
          },
          waiting: {
            autoShow: false
          }
        })
        if (url !== embed.getURL()) {
          embed.loadURL(url)
        }
        ws.append(embed)
      }
    },
    watch: {},
    mounted () {
      document.addEventListener('load_article', (event) => {
        this.load_article(event.detail.article_url)
      })

      window.mui.plusReady(() => {
        var ws = window.plus.webview.currentWebview()
        this.load_article(ws.article_url)
      })
    }
  }

</script>
