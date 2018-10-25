<template>
  <div>

  </div>
</template>


<script>
  import { openWebviewByHome } from '../../utils/webview'
  import userAbility from '../../utils/userAbility'

  export default {
    data: () => ({
      loading: 1
    }),
    created () {
      // showInwehubWebview();
    },
    methods: {
      load_article (id, url, pathUrl, title, imgUrl) {
        var ws = window.plus.webview.currentWebview()
        openWebviewByHome(ws, id, url, pathUrl, title, imgUrl)
      }
    },
    watch: {},
    mounted () {
      document.addEventListener('alertDialog', (event) => {
        if (event.detail.group_id) {
          var bodyWebview = window.plus.webview.getWebviewById('inwehub_article_body')
          bodyWebview.setStyle({
            opacity: 0
          })
          userAbility.inviteJoinInGroup(this, event.detail.group_id, () => {
            bodyWebview.setStyle({
              opacity: 1
            })
          })
        }
      })
      document.addEventListener('load_article', (event) => {
        this.load_article(event.detail.article_id, event.detail.article_url, event.detail.article_comment_url, event.detail.article_title, event.detail.article_img_url)
      })
      window.mui.plusReady(() => {
        var ws = window.plus.webview.currentWebview()
        openWebviewByHome(ws, ws.id, ws.article_url, ws.article_comment_url, ws.article_title, ws.article_img_url)
      })
    }
  }

</script>
