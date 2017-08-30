<template>
<div>

</div>
</template>


<script>
  import localEvent from '../../stores/localStorage';
  import axios from 'axios';
  import { openWebviewByHome } from '../../utils/webview';

  export default {
    data: () => ({
      loading:1
    }),
    created () {
      //showInwehubWebview();
    },
    methods: {

    },
    watch: {

    },
    mounted(){
      mui.plusReady(() => {
        var ws = plus.webview.currentWebview();
        ws.addEventListener('show',createEmbed(ws),false);
        var currentUser = localEvent.getLocalItem('UserInfo');
        var url = process.env.READHUB_URL + '/api-request?uuid=' + currentUser.uuid;

        function createEmbed(ws) {
          openWebviewByHome(ws);
        }
      });

    }
  }

</script>
