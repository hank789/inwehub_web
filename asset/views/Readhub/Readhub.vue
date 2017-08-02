<template>
<div class="mui-content" v-if="is_h5">
  <html-panel :url="url"></html-panel>
</div>
</template>


<script>
  import HtmlPanel from '../../components/HtmlPanel.vue';
  import localEvent from '../../stores/localStorage';

  export default {
    data: () => ({
      loading:1,
      is_h5: false,
      url: '',
      currentUser: {}
    }),
    created () {
      showInwehubWebview();
    },
    methods: {

    },
    components: {
      HtmlPanel
    },
    watch: {

    },
    mounted(){
      this.currentUser = localEvent.getLocalItem('UserInfo');
      this.url = process.env.READHUB_URL + '?uuid=' + this.currentUser.uuid;
      if (mui.os.plus) {
        mui.plusReady(() => {
          var ws = plus.webview.currentWebview();
          ws.addEventListener('show',createEmbed(ws),false);

          function createEmbed(ws) {
            var embed=plus.webview.create(this.url,'embed',{bottom:'0px',position:'dock',dock:'bottom',bounce:'vertical'});
            ws.append(embed);
          }
        });
      } else {
        this.is_h5 = true;
      }

    }
  }

</script>
