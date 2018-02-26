<template>
  <div>
    <div style="background:#3c3e44;display: none;"></div>
    <div class="mui-content">
      <iframe v-show="iframeState" id="show-iframe" @load="loaded" frameborder=0   name="showHere" scrolling=no
              marginheight="0" marginwidth="0"></iframe>

      <div id="statusBarStyle" background="transparent"></div>
    </div>
  </div>
</template>


<script>
  import localEvent from '../../stores/localStorage'
  import {getImmersedHeight} from '../../utils/statusBar'

  export default {
    data: () => ({
      loading: 1,
      url: '',
      iframeState: false,
      iframe: null,
      currentUser: {}
    }),
    created () {

    },
    methods: {
      hideWebview () {
        console.log('hideWebview')
        if (window.mui.os.plus) {
          var inwehubEmbedWebview = window.plus.webview.getWebviewById('inwehub_embed')
          if (inwehubEmbedWebview) {
            inwehubEmbedWebview.hide()
          }
        }
      },
      loaded () {
        console.log('loaded')
        window.mui.closeWaiting()
      },
      reloadUrl () {
        if (!/^\/discover/.test(this.$route.path)) {
          return
        }

        this.currentUser = localEvent.getLocalItem('UserInfo')
        var url = process.env.READHUB_URL + '/h5?uuid=' + this.currentUser.uuid

        if (this.$route.query.redirect_url) {
          url = url + '&redirect_url=' + encodeURIComponent(this.$route.query.redirect_url)
          this.$route.query.redirect_url = false
        }
        console.log('reloadUrl:' + url)

        if (window.mui.os.plus) {
          this.createReadWebview(url)
        } else {
          this.createIframe(url)
        }
      },
      createIframe (url) {
        window.mui.waiting()

        this.iframeState = true
        const deviceWidth = document.documentElement.clientWidth
        var deviceHeight = document.documentElement.clientHeight - 50
        const oIframe = document.getElementById('show-iframe')
        this.iframe = oIframe
        this.iframe.src = url
        oIframe.style.width = deviceWidth + 'px'

        if (document.body.classList && document.body.classList.contains('openAppWechat')) {
          deviceHeight -= 49
        }

        oIframe.style.height = deviceHeight + 'px'
      },
      createReadWebview (url) {
        this.iframeState = false
        window.mui.waiting()
        window.mui.plusReady(() => {
          var ws = window.plus.webview.currentWebview()
          console.log('wsid:' + ws.id)
          ws.addEventListener('show', createEmbed(ws, url), false)

          function createEmbed (ws, url) {
            var ImmersedHeight = getImmersedHeight()
            var inwehubEmbedWebview = window.plus.webview.getWebviewById('inwehub_embed')
            if (!inwehubEmbedWebview) {
              inwehubEmbedWebview = window.plus.webview.create(url, 'inwehub_embed', {
                popGesture: 'none',
                top: ImmersedHeight + 'px',
                dock: 'top',
                bottom: '5rem',
                bounce: 'none'
              })
              ws.append(inwehubEmbedWebview)
            } else {
              console.log('zzzedd' + inwehubEmbedWebview.getURL() + ' url:' + url)
              if (inwehubEmbedWebview.getURL() !== url) {
                inwehubEmbedWebview.loadURL(url)
              }
              inwehubEmbedWebview.show()
            }

            window.mui.closeWaiting()
          }
        })
      }
    },
    computed: {},
    watch: {
      '$route': 'reloadUrl'
    },
    activated: function () {
      this.reloadUrl()
    },
    deactivated: function () {
      this.hideWebview()
    },
    mounted () {
      this.reloadUrl()
    }
  }

</script>
