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
        mui.closeWaiting();
      },
      createReadWebview() {
        this.iframeState = false;
        mui.waiting();
        mui.plusReady(() => {
          var ws = plus.webview.currentWebview();
          console.log('readhub:current:'+ws.id);
          var redirect_url = this.url;
          if (this.$route.query.redirect_url) {
            redirect_url = redirect_url + '&redirect_url=' + this.$route.query.redirect_url;
          }
          ws.addEventListener('show',createEmbed(ws,redirect_url),false);

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
            mui.closeWaiting();
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
          if (this.$route.query.redirect_url) {
            var redirect_url = this.url + '&redirect_url=' + this.$route.query.redirect_url;
            console.log('readhub:redirect_url:'+redirect_url);
            inwehub_embed_webview.loadURL(redirect_url);
          }
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
      this.url = process.env.READHUB_URL + '/h5?uuid=' + this.currentUser.uuid;

      if (mui.os.plus) {
          this.createReadWebview();
      } else {
        mui.waiting();
        var url = this.url;
        if (this.$route.query.redirect_url) {
          url = url + '&redirect_url=' + this.$route.query.redirect_url;
        }

        this.iframeState = true;
        const deviceWidth = document.documentElement.clientWidth;
        const deviceHeight = document.documentElement.clientHeight - 50;
        const oIframe = document.getElementById('show-iframe');
        this.iframe = oIframe;
        this.iframe.src = url;
        oIframe.style.width = deviceWidth + 'px';
        oIframe.style.height = deviceHeight + 'px';
      }
    }
  }

</script>
