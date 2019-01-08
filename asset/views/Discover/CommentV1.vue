<template>
  <div class="hideImmersedWrapper">
     <div class="component-comment">
       <div class="item btn-1">
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-xiugai"></use>
         </svg><span>评论</span>
       </div>
       <div class="item" :class="{active:!!detail.is_commented}">
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-pinglun1"></use>
         </svg><span>{{detail.comments_number}}</span>
       </div>
       <div class="item" :class="{active:!!detail.is_bookmark}" @tap.stop.prevent="collect">
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-shoucangxingxing"></use>
         </svg><span>{{detail.bookmarks}}</span>
       </div>
       <div class="item" :class="{active:!!detail.is_upvoted}" @tap.stop.prevent="support">
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-dianzan1"></use>
         </svg><span>{{detail.upvotes}}</span>
       </div>
     </div>
   </div>


</template>

<script>
  import { postRequest } from '../../utils/request'

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

  .component-comment {
  height: 1.173rem;
  line-height: 1.173rem;
  overflow: hidden;
  background: #f3f4f6;
  padding: 0 0.533rem 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  }
  .component-comment .item {
  display: inline-block;
  text-align: center;
  color: gray;
  }
  .component-comment .item span {
  font-size: 0.32rem;
  }
  .component-comment .item .icon {
  color: gray;
  margin-right: 0.133rem;
  }
  .component-comment .item.active {
  color: #03aef9;
  }
  .component-comment .item.active .icon {
  color: #03aef9;
  }
  .component-comment .item.btn-1 {
  background: #03aef9;
  color: #fff;
  width: 3.893rem;
  height: 1.173rem;
  font-size: 0.4rem;
  }
  .component-comment .item.btn-1 span {
  font-size: 0.4rem;
  }
  .component-comment .item.btn-1 .icon {
  font-size: 0.453rem;
  color: #fff;
  margin-right: 0.133rem;
  }

</style>
