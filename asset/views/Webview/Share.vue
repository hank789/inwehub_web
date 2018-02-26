<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{ title }}</h1>

      <a class="mui-icon mui-pull-right" @tap.stop.prevent="share()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fenxiang"></use>
        </svg>
      </a>

    </header>

    <div class="mui-content">

    </div>

    <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
      <div class="title">分享到</div>
      <div class="more">
        <div class="single" id="wechatShareBtn" @tap.stop.prevent="shareToHaoyou()">
          <img src="../../statics/images/wechat_2x.png"/>
        </div>
        <div class="single" id="wechatShareBtn2" @tap.stop.prevent="shareToPengyouQuan()">
          <img src="../../statics/images/pengyouquan.png"/>
        </div>
      </div>
    </div>

    <div id="shareShowWrapper" class="mui-popover mui-popover-action mui-popover-top"
         @tap.stop.prevent="toggleShareNav()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-dianzheli"></use>
      </svg>
    </div>

  </div>
</template>


<script>
  import Share from '../../utils/share'
  import { postRequest } from '../../utils/request'
  import { getImmersedHeight } from '../../utils/statusBar'

  export default {
    data: () => ({
      title: '',
      link: ''
    }),
    created () {

    },
    methods: {
      initWebview (pageTile, shareTitle, shareLink, shareContent, shareImageUrl, shareThumbUrl) {
        this.title = pageTile
        this.link = shareLink
        var data = {}
        if (window.mui.os.plus) {
          data = {
            title: shareTitle,
            link: shareLink,
            content: shareContent,
            imageUrl: shareImageUrl,
            thumbUrl: shareThumbUrl
          }

          Share.bindShare(
            this,
            data,
            this.successCallback,
            this.failCallback
          )
        } else {
          data = {
            title: 'test',
            link: 'test',
            content: 'test',
            imageUrl: 'test',
            thumbUrl: 'test'
          }

          Share.bindShare(
            this,
            data,
            this.successCallback,
            this.failCallback
          )
        }
      },
      toggleShareNav () {
        window.mui('#shareShowWrapper').popover('toggle')
      },
      shareToHaoyou () {
        this.sendHaoyou()
        if (window.mui.os.plus) {
          window.mui('#shareWrapper').popover('toggle')
        } else {
          window.mui('#shareWrapper').popover('toggle')
          window.mui('#shareShowWrapper').popover('toggle')
        }
        this.hide()
      },
      shareToPengyouQuan () {
        this.sendPengYouQuan()
        if (window.mui.os.plus) {
          window.mui('#shareWrapper').popover('toggle')
        } else {
          window.mui('#shareWrapper').popover('toggle')
          window.mui('#shareShowWrapper').popover('toggle')
        }
        this.hide()
      },
      successCallback () {
        postRequest(`share/wechat/success`, {
          'target': this.link,
          'title': this.title
        }).then(response => {

        })
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:success',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.link,
              'page_name': 'share',
              'page_title': this.title,
              'referrer_page': ''
            }
          )
        }
      },
      failCallback (error) {
        console.log(JSON.stringify(error))
        window.mui.toast('分享失败')
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
          })
        }

        setTimeout(() => {
          window.mui('#shareWrapper').popover('toggle')
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
          })
        }
      }
    },
    computed: {},
    watch: {},
    mounted () {
      document.addEventListener('load_inwehub_article_share', (event) => {
        this.initWebview(event.detail.page_title, event.detail.title, event.detail.link, event.detail.content, event.detail.imageUrl, event.detail.thumbUrl)
      })
      window.mui.plusReady(() => {
        var ws = window.plus.webview.currentWebview()
        this.initWebview(ws.page_title, ws.title, ws.link, ws.content, ws.imageUrl, ws.thumbUrl)
      })
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>


  .mui-content {
    padding: 20rem;
    text-align: center;
  }

  .shareWrapper {
    .title {
      background: #ececee;
      text-align: center;
      font-size: 1.4rem;
      padding: 1.2rem 0;
    }
    .more {
      background: #fff;
      padding: 1rem;
      .single {
        width: 5.5rem;
        height: 5.5rem;
        margin: 0 1rem;
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
      right: 1.5rem;
      top: 1rem;
      font-size: 7rem;
    }
  }


</style>
