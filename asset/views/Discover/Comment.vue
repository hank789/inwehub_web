<template>
  <div class="container-footer">
    <div class="footerLeft">
      <div class="footerMenuOne">说点什么</div>
    </div>
    <div class="footerRight">

      <div class="collectionComment">
        <div :class="{active:!!detail.is_commented}">
          <svg class="icon" :class="{active:!!detail.is_commented}" aria-hidden="true">
            <use xlink:href="#icon-pinglun"></use>
          </svg>
        </div>
        <span>{{ detail.comments_number }}</span>
      </div>

      <div class="collectionComment" @tap.stop.prevent="support">
        <div :class="{active:!!detail.is_bookmark}">
          <svg class="icon" :class="{active:!!detail.is_bookmark}" aria-hidden="true">
            <use xlink:href="#icon-zan"></use>
          </svg>
        </div>
        <span>{{ detail.upvotes }}</span>
      </div>

      <div class="collectionComment shareIcon" @tap.stop.prevent="showShare">
        <div >
          <svg class="icon"  aria-hidden="true">
            <use xlink:href="#icon-shoucang-xiao"></use>
          </svg>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
  import { postRequest } from '../../utils/request'
  import { getImmersedHeight } from '../../utils/statusBar'

  export default {
    data () {
      return {
        slug: '',
        id: 0,
        detail: {
          owner: {
            uuid: '',
            avatar: '',
            username: ''
          },
          data: {
            img: ''
          },
          created_at: ''
        }
      }
    },
    methods: {
      refreshPageData () {
        this.getDetail()
      },
      collect () {
        var data = {
          id: this.id
        }

        postRequest(`article/bookmark-submission`, data, false).then(response => {
          var code = response.data.code

          if (code === 6108) {
            var bodyWebview = window.plus.webview.getWebviewById('inwehub_article_view')
            window.mui.fire(bodyWebview, 'alertDialog', {
              group_id: response.data.data.group_id
            })
            return
          }

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.detail.is_bookmark = response.data.data.type === 'bookmarked' ? 1 : 0
          if (this.detail.is_bookmark) {
            this.detail.bookmarks++
          } else {
            this.detail.bookmarks--
          }

          window.mui.toast(response.data.message)
        })
      },
      support () {
        var data = {
          submission_id: this.id
        }

        postRequest(`article/upvote-submission`, data, false).then(response => {
          var code = response.data.code

          if (code === 6108) {
            var bodyWebview = window.plus.webview.getWebviewById('inwehub_article_view')
            window.mui.fire(bodyWebview, 'alertDialog', {
              group_id: response.data.data.group_id
            })
            return
          }

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.detail.is_upvoted = response.data.data.type === 'upvote' ? 1 : 0
          if (this.detail.is_upvoted) {
            this.detail.upvotes++
          } else {
            this.detail.upvotes--
          }
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:support:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.id,
                'page_name': 'submission',
                'page_title': this.detail.is_upvoted ? 'support' : 'cancel',
                'referrer_page': ''
              }
            )
          }

          window.mui.toast(response.data.message)
        })
      },
      showShare () {
        if (window.mui.os.plus) {
          window.mui.plusReady(function () {
            var currentWebview = window.plus.webview.getWebviewById('inwehub_article_title')
            window.mui.fire(currentWebview, 'share', {childId: currentWebview.id})
          })
        }
      },
      getDetail () {
        console.log('comment refreshPageData refresh')
        console.log('slug:' + this.$route.params.slug)
        this.slug = this.$route.params.slug

        if (!this.slug) {
          this.$router.back()
          return
        }

        postRequest(`article/detail-by-slug`, {slug: this.slug}, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.detail = response.data.data
          this.id = this.detail.id

          this.loading = 0
        })
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getDetail()
    }
  }
</script>


<style scoped lang="less">


  .container-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1.173rem;
    overflow: hidden;
    /*padding: 0.36rem 0.426rem;*/
    background: #FFFFFF;
    &:before {
      position: absolute;
      top: 0;
      width: 100%;
      height: .02667rem;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #dcdcdc;
    }
    .footerLeft {
      display: flex;
      font-size: 0.373rem;
      float: left;
      padding: 0.133rem 0 0.133rem 0.426rem;
      .footerMenuTwo {
        display: flex;
        .containerBtn {
          display: flex;
          width: 2.96rem;
          height: 0.96rem;
          color: #ffffff;
          margin-right: 0.133rem;
          line-height: 0.96rem;
          text-align: center;
          border-radius: 0.213rem;
          justify-content: center;
        }
        .noBullish {
          background: #FA4975;
        }
        .bullish {
          background: #03AEF9;
        }
      }
      .footerMenuOne {
        width: 6.213rem;
        height: 0.906rem;
        color: #C8C8C8;
        line-height: 0.906rem;
        border-radius: 0.106rem;
        background: #F3F4F6;
        padding-left: 0.266rem;
        &.activeRed {
          color: #FA4975;
        }
        &.activeBlue {
          color: #03AEF9;
        }
      }
    }
    .footerRight {
      color: #B4B4B6;
      font-size: 0.266rem;
      text-align: center;
      display: -ms-flexbox;
      display: flex;
      .collectionComment {
        width: 0.9rem;
        height: 1.306rem;
        flex-grow:1;
        color: #808080;
        padding-top: 0.373rem;
        position: relative;
        &.shareIcon {
          .icon {
            font-size: 0.426rem;
          }
        }
        span {
          position: absolute;
          top: 0.293rem;
          left: 0.826rem;
          color: #FA4975;
          font-size: 0.266rem;
          margin-top: -0.106rem;
        }
      }
      .icon {
        font-size: 0.4rem;
        /*margin-top: -0.106rem;*/
      }
    }
  }


</style>
