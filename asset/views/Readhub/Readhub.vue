<template>
<div>
  <header class="mui-bar mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title">阅读</h1>
  </header>
  <iframe v-show="iframeState" id="show-iframe"  @load="loaded" frameborder=0 name="showHere" scrolling=auto></iframe>
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
      showInwehubWebview();
    },
    methods: {
      loaded() {
        console.log('loaded');
      }
    },
    computed: {

    },
    watch: {

    },
    activated: function () {

    },
    mounted(){
      this.currentUser = localEvent.getLocalItem('UserInfo');
      this.url = process.env.READHUB_URL + '?uuid=' + this.currentUser.uuid;

      if (mui.os.plus) {
        this.iframeState = false;
        mui.plusReady(() => {
          var ws = plus.webview.currentWebview();
          ws.addEventListener('show',createEmbed(ws,this.url),false);

          function createEmbed(ws,url) {
            var topoffset='44px';
            if(plus.navigator.isImmersedStatusbar()){// 兼容immersed状态栏模式
              topoffset=(Math.round(plus.navigator.getStatusbarHeight())+44)+'px';
            }
            var embed=plus.webview.create(url,'embed',{popGesture: 'hide',top:topoffset,bottom:'0px',position:'dock',dock:'bottom',bounce:'vertical'});
            ws.append(embed);
          }
        });
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
