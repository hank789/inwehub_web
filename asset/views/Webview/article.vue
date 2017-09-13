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
        load_article(id,url,pathUrl,title,img_url) {
          var ws = plus.webview.currentWebview();
          openWebviewByHome(ws,id,url,pathUrl,title,img_url);
        }
    },
    watch: {

    },
    mounted(){
      document.addEventListener('load_article', (event) => {
        this.load_article(event.detail.article_id,event.detail.article_url,event.detail.article_comment_url,event.detail.article_title,event.detail.article_img_url);
      });
      mui.plusReady(() => {
        var ws = plus.webview.currentWebview();
        openWebviewByHome(ws,ws.id,ws.article_url,ws.article_comment_url,ws.article_title,ws.article_img_url);
      });

    }
  }

</script>
