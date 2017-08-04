<template>
<div>
  <header v-show="iframeState" id="header" class="mui-bar mui-bar-transparent">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
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
            var topoffset='0px';

            var embed=plus.webview.create(url,'inwehub_embed',{popGesture: 'hide',
              top:topoffset,
              bottom:'0px',
              position:'dock',
              dock:'bottom',
              titleNView: {
                backgroundColor: '#f7f7f7', //导航栏背景色
                titleText: '阅读', //导航栏标题
                titleColor: '#000000', //文字颜色
                type: 'default', //透明渐变样式
                autoBackButton: true //自动绘制返回箭头
              },
              bounce:'vertical'});
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
