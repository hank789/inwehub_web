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
      if (mui.os.plus) {
        mui.plusReady(() => {
          var ws = plus.webview.currentWebview();
          ws.addEventListener('show',createEmbed(ws),false);

          function createEmbed(ws) {
            var embed=plus.webview.create(process.env.READHUB_URL,'embed',{bottom:'0px',position:'dock',dock:'bottom',bounce:'vertical'});
            ws.append(embed);
          }
        });
      } else {
        this.url = process.env.READHUB_URL + '?uuid=' + this.currentUser.uuid;
        this.is_h5 = true;
      }

    }
  }

</script>
