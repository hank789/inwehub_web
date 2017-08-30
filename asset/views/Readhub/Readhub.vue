<template>
  <div class="mui-content">
    <iframe v-show="iframeState" id="show-iframe" @load="loaded" frameborder=0  name="showHere" scrolling=auto></iframe>

    <div id="statusBarStyle" background="transparent"></div>
  </div>

</template>


<script>
  import localEvent from '../../stores/localStorage';

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
      hideWebview(){
        console.log('hideWebview');
        if (mui.os.plus) {
          var inwehub_embed_webview = plus.webview.getWebviewById('inwehub_embed');
          if (inwehub_embed_webview) {
            inwehub_embed_webview.hide();
          }
        }
      },
      loaded() {
        console.log('loaded');
        mui.closeWaiting();
      },
      reloadUrl(){

        if (!/^\/discover/.test(this.$route.path)) {
            return;
        }

        this.currentUser = localEvent.getLocalItem('UserInfo');
        var url = process.env.READHUB_URL + '/h5?uuid=' + this.currentUser.uuid;

        if (this.$route.query.redirect_url) {
          url = url + '&redirect_url=' + encodeURIComponent(this.$route.query.redirect_url);
        }
        console.log('reloadUrl:' + url);

        if (mui.os.plus) {
          this.createReadWebview(url);
        } else {
          this.createIframe(url);
        }
      },
      createIframe(url){
        mui.waiting();


        this.iframeState = true;
        const deviceWidth = document.documentElement.clientWidth;
        const deviceHeight = document.documentElement.clientHeight - 50;
        const oIframe = document.getElementById('show-iframe');
        this.iframe = oIframe;
        this.iframe.src = url;
        oIframe.style.width = deviceWidth + 'px';
        oIframe.style.height = deviceHeight + 'px';
      },
      createReadWebview(url) {
        this.iframeState = false;
        mui.waiting();
        mui.plusReady(() => {
          var ws = plus.webview.currentWebview();
          console.log('wsid:'+ws.id);
          ws.addEventListener('show', createEmbed(ws, url), false);

          function createEmbed(ws, url) {
            var inwehub_embed_webview = plus.webview.getWebviewById('inwehub_embed');
            if (!inwehub_embed_webview) {
              inwehub_embed_webview = plus.webview.create(url, 'inwehub_embed', {
                popGesture: 'hide',
                top: '0px',
                dock: 'top',
                bottom: '75px',
                bounce: 'none'
              });
              ws.append(inwehub_embed_webview);
            } else {
              console.log('zzzedd'+inwehub_embed_webview.getURL() + ' url:'+ url);
              if (inwehub_embed_webview.getURL() !== url) {
                inwehub_embed_webview.loadURL(url);
              }
              inwehub_embed_webview.show();
            }


            mui.closeWaiting();
          }
        });
      }
    },
    computed: {},
    watch: {
      '$route': 'reloadUrl'
    },
    activated: function () {
      this.reloadUrl();
    },
    deactivated: function () {
      this.hideWebview();
    },
    mounted(){
      this.reloadUrl();
    }
  }

</script>
