<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">{{ title }}</h1>
    </header>

    <div class="mui-content">
    </div>


    <Share
      ref="shareComponent"
      :title="shareOption.title"
      :shareName="shareOption.shareName"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :targetId="shareOption.targetId"
      :targetType="shareOption.targetType"
      @success="shareSuccess"
      @fail="shareFail"
      @share="share"
      @hide="hide"
    ></Share>

  </div>
</template>


<script>
  import { getImmersedHeight } from '../../utils/statusBar'
  import Share from '../../components/Share.vue'

  export default {
    data: () => ({
      title: '',
      id: 0,
      shareOption: {
        title: '',
        link: '',
        content: '',
        imageUrl: '',
        thumbUrl: '',
        shareName: '',
        targetType: '',
        targetId: ''
      }
    }),
    created () {
      window.addEventListener('share', (e) => {
        this.$refs.shareComponent.share()
      })
    },
    methods: {
      initWebview (pageTile, shareTitle, shareLink, shareContent, shareImageUrl, shareThumbUrl, targetId, targetType) {
        this.title = pageTile
        this.shareOption.title = shareTitle
        this.shareOption.link = shareLink
        this.shareOption.content = shareContent
        this.shareOption.imageUrl = shareImageUrl
        this.shareOption.thumbUrl = shareThumbUrl
        this.shareOption.targetType = targetType
        this.shareOption.targetId = targetId
      },
      share () {
        if (window.mui.os.plus) {
          window.mui.plusReady(function () {
            var currentWebview = window.plus.webview.currentWebview()
            currentWebview.setStyle({
              height: '100%',
              zindex: 999,
              opacity: 0.97
            })

            var footerWebview = window.plus.webview.getWebviewById('inwehub_article_body')
            footerWebview.setVisible(false)
          })
        }

        setTimeout(() => {
          window.mui('body').on('tap', '.mui-backdrop', () => {
            this.hide()
          })
        }, 150)
      },
      hide () {
        if (window.mui.os.plus) {
          window.mui.plusReady(function () {
            var immersedHeight = getImmersedHeight()
            var currentWebview = window.plus.webview.currentWebview()
            currentWebview.setStyle({
              height: (immersedHeight + 44) + 'px',
              opacity: 1
            })

            var footerWebview = window.plus.webview.getWebviewById('inwehub_article_body')
            footerWebview.setVisible(true)
          })
        }
      },
      shareSuccess () {},
      shareFail () {}
    },
    computed: {},
    components: {
      Share
    },
    watch: {},
    mounted () {
      document.addEventListener('load_inwehub_article_share', (event) => {
        this.initWebview(event.detail.page_title, event.detail.title, event.detail.link, event.detail.content, event.detail.imageUrl, event.detail.thumbUrl, event.detail.targetId, event.detail.targetType)
      })
      window.mui.plusReady(() => {
        var ws = window.plus.webview.currentWebview()
        this.initWebview(ws.page_title, ws.title, ws.link, ws.content, ws.imageUrl, ws.thumbUrl, ws.targetId, ws.targetType)
      })
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>


  .mui-content {
    padding: 5.333rem;
    text-align: center;
  }

  .shareWrapper {
    .title {
      background: #ececee;
      text-align: center;
      font-size: 0.373rem;
      padding: 0.32rem 0;
    }
    .more {
      background: #fff;
      padding: 0.266rem;
      .single {
        width: 1.466rem;
        height: 1.466rem;
        margin: 0 0.266rem;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  #shareShowWrapper {
    position: absolute;
    right: 0;
    top: 0;
    .icon {
      color: #fff;
      position: absolute;
      right: 0.4rem;
      top: 0.266rem;
      font-size: 1.866rem;
    }
  }
</style>
