<template>
<div class="mui-content">
  <iframe v-show="iframeState" id="show-iframe"  @load="loaded" frameborder=0 name="showHere" scrolling=auto></iframe>

  <div id="statusBarStyle" background="transparent"></div>
</div>

</template>


<script>
  import localEvent from '../../stores/localStorage';

  export default {
    data: () => ({
      loading:1,
      url: '',
      iframeState: false,
      iframe: null,
      currentUser: {}
    }),
    created () {

    },
    methods: {
      loaded() {
        console.log('loaded');
      },
      createReadWebview() {
        this.iframeState = false;
        mui.plusReady(() => {
          var ws = plus.webview.currentWebview();
          ws.addEventListener('show',createEmbed(ws,this.url),false);

          function createEmbed(ws,url) {
            var inwehub_embed_webview = plus.webview.getWebviewById('inwehub_embed');
            if (!inwehub_embed_webview){
              inwehub_embed_webview=plus.webview.create(url,'inwehub_embed',{
                popGesture: 'hide',
                top: '0px',
                dock: 'top',
                bottom: '75px',
                bounce:'none'
              });
            }
            ws.append(inwehub_embed_webview);
          }
        });
      }
    },
    computed: {

    },
    watch: {

    },
    activated: function () {
      if (mui.os.plus) {
        var inwehub_embed_webview = plus.webview.getWebviewById('inwehub_embed');
        if (inwehub_embed_webview) {
          inwehub_embed_webview.show();
        } else {
          this.createReadWebview();
        }
      }
    },
    deactivated: function () {
      if (mui.os.plus) {
        var inwehub_embed_webview = plus.webview.getWebviewById('inwehub_embed');
        if (inwehub_embed_webview) {
          inwehub_embed_webview.hide();
        }
      }
    },
    mounted(){
      this.currentUser = localEvent.getLocalItem('UserInfo');
      this.url = process.env.READHUB_URL + '/h5?uuid=' + this.currentUser.uuid + '&redirect_url=';

      if (this.$route.query.redirect_url) {
        this.url = this.url + this.$route.query.redirect_url;
      }

      if (mui.os.plus) {
          this.createReadWebview();
      } else {
        this.iframeState = true;
        const deviceWidth = document.documentElement.clientWidth;
        const deviceHeight = document.documentElement.clientHeight - 50;
        const oIframe = document.getElementById('show-iframe');
        this.iframe = oIframe;
        this.iframe.src = this.url;
        oIframe.style.width = deviceWidth + 'px';
        oIframe.style.height = deviceHeight + 'px';
      }
    }
  }

</script>
