<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title" v-text="title"></h1>
    </header>

    <div class="mui-content" v-if="!loading">
      <vue-pull-refresh :on-refresh="refreshPageData">

        <div class="mui-table-view detail-discover">
          <UserInfo
            :uuid="detail.owner.uuid"
            :avatar="detail.owner.avatar"
            :realname="detail.owner.name"
            :isFollow="isFollow"
            :isFollowed="detail.is_followed_author?true:false"
            :isShowPositionAndCompany="false"
            :isExpert="detail.owner.is_expert?1:0"
            :time="detail.created_at"
            @setFollowStatus="setFollowStatus"
          ></UserInfo>
          <!--<div class="line-river lineMargin"></div>-->

          <div class="mark">
            <div class="stars">
              <StarView :rating="detail.rate_star"></StarView>
            </div>
            <div class="text">{{ detail.rate_star }}分</div>
          </div>

          <div class="discoverContentWrapper">
            <div class="contentWrapper quillDetailWrapper container-editor container-editor-app" id="contentWrapper">
              <span v-if="detail.type !== 'article'" v-html="textToLink(detail.title)"></span>
            </div>

            <div class="linkWrapper Column" v-if="detail.type === 'review' && detail.data.img && detail.data.img.length">
              <template v-for="(image, index) in detail.data.img">
                <img class="discover_img lazyImg" :id="'image_' + index" v-lazy="image" :data-preview-src="image"
                     :data-preview-group="1"/>
              </template>
            </div>
          </div>
          <!-- 新增链接样式 -->
          <div class="link" v-if="detail.tags">
            <div class="linkBox" @tap.stop.prevent="goProductDetail()">
              <span class="linkIimg" v-if="!detail.tags[0].logo">
                <svg class="icon" aria-hidden="true" >
                  <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
                </svg>
              </span>
              <div class="productLogo border-football" v-else>
                <img class="lazyImg" v-lazy="detail.tags[0].logo">
              </div>
              <div class="linkContent">
                <div v-if="detail.tags[0].name" class="text-line-1">{{detail.tags[0].name}}</div>
                <span v-else class="seat"></span>
                <div class="mark">
                  <div class="stars">
                    <StarView :rating="detail.tags[0].review_average_rate"></StarView>
                  </div>
                  <div class="text">{{ detail.tags[0].review_average_rate }}分</div><i></i>
                  <div class="comment">{{detail.tags[0].reviews}}条评论</div>
                </div>
              </div>
            </div>
          </div>

          <div class="timeContainer">
            <div class="makingCopy">著作权归作者所有</div>
          </div>
        </div>
        <div class="river"></div>
        <ArticleDiscuss
          id="commentTitle"
          v-if="detail.slug"
          :listApi="'article/comments'"
          :listParams="discussListParams"
          :storeApi="'article/comment-store'"
          :storeParams="discussStoreParams"
          @comment="comment"
          @commentFinish="commentFinish"
          @goComment="goComment"
          @delCommentSuccess="delCommentSuccess"
          ref="discuss"
        ></ArticleDiscuss>
        <div class="seeAll" v-if="detail.comments_number > 3" @tap.stop.prevent="$router.pushPlus('/comment/' + detail.category_id + '/' + detail.slug + '/' + detail.id)">查看全部{{detail.comments_number}}条评论</div>
        <div class="river"></div>

        <div class="allDianPing font-family-medium">大家都在评</div>
        <div class="line-river-after line-river-after-top"></div>

        <div class="productList">

          <div class="comment-product" v-for="(item, index) in detail.related_tags" :key="index">
            <div class="product-info"  @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
              <div class="product-img border-football">
                <img class="lazyImg" v-lazy="item.logo" alt="">
              </div>
              <div class="product-detail">
                <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
                <div class="productMark">
                  <div class="stars">
                    <StarView :rating="item.review_average_rate"></StarView>
                  </div>
                  <div class="starsText">
                    <span>{{ item.review_average_rate }}分</span>
                    <i></i><span>{{ item.review_count }}条评论</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="line-river-after line-river-after-top" v-if="index !== 4 && index !== detail.related_tags.length-1"></div>
          </div>
        </div>
        <div class="river"></div>
        <div class="openAppReadBox">
          <div class="openAppRead" @tap.stop.prevent="openApp()">
            <span class="font-family-medium">打开APP</span>
            <span>阅读更多推荐</span>
          </div>
          <div class="river openAppReadRiver"></div>
          <div class="followCode">
            <div class="CodeImg">
              <img src="../../../statics/images/group_3@3x 2.png" alt="">
            </div>
            <div class="codeText">
              <div>长按识别二维码，关注InweHub服务号</div>
              <div>探索更多资讯/人脉/服务</div>
            </div>
          </div>
          <div class="river openAppReadRiver"></div>
        </div>

      </vue-pull-refresh>
    </div>
    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

    <Detail
      :detail="this.detail"
      :iconOptions="iconOptions"
      @detailMenuIcon="detailMenuIcon"
      @WriteComment="goComment"
    ></Detail>

    <PageMore
      ref="share"
      :shareOption="shareOption"
      :hideShareBtn="false"
      :iconMenu="iconMenus"
      @clickedItem="iconMenusClickedItem"
    ></PageMore>

  </div>
</template>
<script>
  import { getCommentDetail } from '../../../utils/dianping.js'
  import { textToLinkHtml, transferTagToLink, addPreviewAttrForImg, scrollToElement } from '../../../utils/dom'
  import {postRequest} from '../../../utils/request'
  import userAbility from '../../../utils/userAbility'
  import UserInfo from '../../../components/question-detail/UserInfo.vue'
  import { openVendorUrl, openAppUrl } from '../../../utils/plus'
  import VuePullRefresh from 'vue-awesome-pull-refresh'
  const currentUser = localEvent.getLocalItem('UserInfo')
  import localEvent from '../../../stores/localStorage'
  import ArticleDiscuss from '../../../components/discover/ArticleDiscuss.vue'
  import commentTextarea from '../../../components/comment/Textarea.vue'
  import { upvote, downVote } from '../../../utils/discover'
  import { quillEditor } from '../../../components/vue-quill'
  import hljs from 'highlight.js'
  import PageMore from '../../../components/PageMore.vue'
  import {getDianpingCommentDetail} from '../../../utils/shareTemplate'
  import StarView from '../../../components/star-rating/starView.vue'
  import Detail from '../../../components/menu/Detail.vue'

  export default {
    data () {
      return {
        id: '',
        uuid: currentUser.uuid,
        title: '点评',
        detail: {
          id: '',
          slug: '',
          owner: {
            id: '',
            uuid: '',
            avatar: '',
            username: ''
          }
        },
        shareOption: {
          title: '',
          link: '',
          content: '',
          imageUrl: '',
          thumbUrl: '',
          shareName: '',
          targetType: 'submission',
          targetId: ''
        },
        iconMenus: [],
        loading: 1,
        isFollow: true,
        editorOptionRead: {
          placeholder: ' ',
          modules: {
            toolbar: []
          },
          readOnly: true
        },
        tags: {}
      }
    },
    components: {
      UserInfo,
      ArticleDiscuss,
      commentTextarea,
      quillEditor,
      PageMore,
      'vue-pull-refresh': VuePullRefresh,
      StarView,
      Detail
    },
    computed: {
      discussStoreParams () {
        return {'submission_id': this.detail.id}
      },
      discussListParams () {
        return {'submission_slug': this.detail.slug, order_by: 2, perPage: 3}
      },
      iconOptions () {
        return [
          {
            icon: '#icon-pinglun',
            text: '评论',
            number: this.detail.comments_number
          },
          {
            icon: '#icon-cai',
            text: '踩',
            number: this.detail.downvotes,
            showClass: this.detail.is_downvoted
          },
          {
            icon: '#icon-zan',
            text: '赞',
            number: this.detail.upvotes,
            showClass: this.detail.is_upvoted
          },
          {
            icon: '#icon-shoucang-xiao',
            text: '分享',
            number: 0
          }
        ]
      }
    },
    methods: {
      detailMenuIcon (item) {
        switch (item.text) {
          case '评论':
            this.$router.pushPlus('/comment/' + this.detail.category_id + '/' + this.detail.slug + '/' + this.detail.id)
            break
          case '踩':
            this.detailDownVote()
            break
          case '赞':
            this.upVote()
            break
          case '分享':
            this.$refs.share.share()
            break
        }
      },
      goProductDetail () {
        this.$router.pushPlus('/dianping/product/' + encodeURIComponent(this.detail.tags[0].name))
      },
      showItemMore (shareOption, item) {
        this.iconMenus = []
        this.shareOption = shareOption
        this.$refs.share.share()
      },
      openApp () {
        window.mui.trigger(document.querySelector('.AppOne'), 'tap')
      },
      iconMenusClickedItem (item) {
        switch (item.text) {
          case '删除':
            this.deleterow()
            break
          case '收藏':
            this.collect()
            break
          case '已收藏':
            this.collect()
            break
        }
      },
      showItemOptions () {
        this.iconMenus = []

        if (this.uuid === this.detail.owner.uuid) {
          this.iconMenus.push({
            icon: '#icon-shanchu1',
            text: '删除'
          })
        }
        if (this.detail.is_bookmark) {
          this.iconMenus.push({
            icon: '#icon-shoucangdilantongyi',
            text: '已收藏',
            isBookMark: 1
          })
        } else {
          this.iconMenus.push({
            icon: '#icon-shoucangdilantongyi',
            text: '收藏',
            isBookMark: 0
          })
        }
      },
      collect () {
        var data = {
          id: this.detail.id
        }

        postRequest(`article/bookmark-submission`, data).then(response => {
          var code = response.data.code
          if (code === 6108) {
            userAbility.inviteJoinInGroup(this, response.data.data.group_id)
            return
          } else if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          if (response.data.data.type === 'unbookmarked') {
            this.detail.bookmarks--
            this.detail.is_bookmark = 0
            window.mui.toast('已取消收藏')
          } else {
            this.detail.bookmarks++
            this.detail.is_bookmark = 1
            window.mui.toast('收藏成功')
          }
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:bookmark:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.id,
                'page_name': 'submission',
                'page_title': this.isCollected ? 'cancel' : 'bookmark',
                'referrer_page': ''
              }
            )
          }
          window.mui('#shareWrapper').popover('toggle')
          this.showItemOptions()
        })
      },
      // 删除
      deleterow () {
        window.mui('#shareWrapper').popover('toggle')
        var btnArray = ['取消', '确定']
        window.mui.confirm('确定删除吗？', ' ', btnArray, (e) => {
          if (e.index === 1) {
            // 进行删除
            postRequest(`article/destroy-submission`, {
              id: this.detail.id
            }).then(response => {
              var code = response.data.code
              // 如果请求不成功提示信息 并且返回上一页；
              if (code !== 1000) {
                window.mui.alert(response.data.message)
                window.mui.back()
                return
              }
              if (response.data.data) {
                window.mui.back()
                window.mui.toast('删除成功')
              }
            })
          }
        })
      },
      detailDownVote () {
        downVote(this, this.detail.id, (response) => {
          this.detail.downvotes++
          this.detail.is_downvoted = 1
          this.detail.support_description = response.data.data.support_description
          this.detail.support_percent = response.data.data.support_percent
          this.isUpvote = response.data.data.type
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:downvote:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.id,
                'page_name': 'submission',
                'page_title': 'downvote',
                'referrer_page': ''
              }
            )
          }
        }, (response) => {
          this.detail.downvotes--
          this.detail.support_description = response.data.data.support_description
          this.detail.support_percent = response.data.data.support_percent
          this.detail.is_downvoted = 0
          this.isUpvote = response.data.data.type

          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:downvote:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.id,
                'page_name': 'submission',
                'page_title': 'cancelDownvote',
                'referrer_page': ''
              }
            )
          }
        })
      },
      upVote () {
        upvote(this, this.detail.id, (response) => {
          this.detail.upvotes++
          this.detail.is_upvoted = 1
          this.detail.support_description = response.data.data.support_description
          this.detail.support_percent = response.data.data.support_percent
          this.isUpvote = response.data.data.type
          var support = {
            name: this.name,
            uuid: this.uuid
          }
          this.detail.supporter_list = this.detail.supporter_list.concat(support)

          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:support:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.id,
                'page_name': 'submission',
                'page_title': 'support',
                'referrer_page': ''
              }
            )
          }
        }, (response) => {
          this.detail.upvotes--
          this.detail.is_upvoted = 0
          this.detail.support_description = response.data.data.support_description
          this.detail.support_percent = response.data.data.support_percent
          this.isUpvote = response.data.data.type
          for (var i in this.detail.supporter_list) {
            if (this.detail.supporter_list[i].uuid === this.uuid) {
              this.detail.supporter_list.splice(i, 1)
            }
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
                'page_title': 'cancelSupport',
                'referrer_page': ''
              }
            )
          }
        })
      },
      refreshPageData () {
        this.getDetail()
      },
      goComment () {
        this.$refs.discuss.rootComment()
        scrollToElement(this, '#commentTitle', '.pull-down-container')
      },
      commentFinish () {
        this.commentNumAdd()
        this.$refs.ctextarea.finish()
      },
      commentNumAdd () {
        this.detail.comments_number++
      },
      delCommentSuccess () {
        this.detail.comments_number--
      },
      sendMessage (message) {
        this.$refs.discuss.sendMessage(message)
      },
      comment (commentTargetName) {
        this.$refs.ctextarea.comment(commentTargetName)
      },
      getDetail () {
        this.loading = 1
        this.id = this.$route.params.id
        getCommentDetail(this, this.id, (detail) => {
          this.detail = detail
          this.showItemOptions()
          var shareOption = getDianpingCommentDetail(this.detail.slug, this.detail.title, this.detail.owner.avatar, this.detail.owner.name, this.detail.rate_star)
          this.shareOption = Object.assign(this.shareOption, shareOption)
          this.loading = 0
        })
      },
      setFollowStatus (status) {
        this.detail.is_followed_author = status
      },
      textToLink (text) {
        return transferTagToLink(textToLinkHtml(' ' + text))
      },
      onEditorReadyRead (editor) {
        this.editorReadObj = editor
        if (this.editorReadContentObj) {
          this.editorReadObj.setContents(this.editorReadContentObj)
        }
      },
      change (editor) {
        var html = editor.html
        html = textToLinkHtml(html)

        html = html.replace(/<a href="/g, "<span class='vendorUrl text-content' href=\"")
        html = html.replace(/<\/a>/g, '</span>')

        var answerContentWrapper = this.$el.querySelector('.discoverContent')
        html = addPreviewAttrForImg(html)
        html = html.replace(/(<p><br><\/p>)*$/, '')

        answerContentWrapper.innerHTML = html

        var syntaxCodes = answerContentWrapper.querySelectorAll('.discoverContent .ql-syntax')
        if (syntaxCodes.length) {
          for (var i = 0; i < syntaxCodes.length; i++) {
            syntaxCodes[i].innerHTML = hljs.highlightAuto(syntaxCodes[i].innerHTML).value
          }
        }

        window.mui.previewImage()

        var that = this

        setTimeout(() => {
          openVendorUrl(answerContentWrapper)
          var aList = this.$el.querySelectorAll('a[href^="http"]')
          for (let i = 0; i < aList.length; i++) {
            aList[i].addEventListener('click', function (e) {
              e.preventDefault()
              that.$router.pushPlus('/webview/vendor/' + encodeURIComponent(this.href))
            }, false)
          }
        }, 100)
      }
    },
    mounted () {
      console.log(this.detail.id + 'this.detail.slug')
    },
    created () {
      this.getDetail()
    },
    watch: {
      '$route': 'refreshPageData'
    },
    updated () {
      this.$nextTick(function () {
        if (this.isShow) {
          openVendorUrl(this.$el.querySelector('#contentWrapper'))
          openAppUrl(this.$el.querySelector('#contentWrapper'))
        }
      })
    }
  }
</script>
<style scoped lang="less">
  .mui-content {
    background: #ffffff;
    bottom: 44px; /* px不转换 */
  }
  .mark {
    display: flex;
    padding: 0 0.426rem;
    margin-top: -0.213rem;
    margin-bottom: 0.186rem;
    .stars {
      color: #FCC816;
      .icon {
        font-size: 0.306rem;
      }
    }
    .text {
      color: #FCC816;
      font-size: 0.293rem;
      margin-top: 0.053rem;
      margin-left: 0.08rem;
    }
  }
  .seeAll {
    padding: 0.32rem 0;
    font-size: 0.373rem;
    color: #808080;
    line-height: 0.533rem;
    text-align: center;
  }
  .allDianPing {
    padding: 0 0.426rem;
    color: #444444;
    font-size: 0.426rem;
    line-height: 1.173rem;
  }
  .detailTitle {
    font-size: 0.506rem;
    line-height: 0.8rem;
    margin-top: -0.293rem;
    padding: 0rem 0.426rem 0.586rem;
    font-family: PingFangSC-Medium;
  }
  .contentWrapper {
    padding: 0 0.4rem;
    white-space: pre-line !important;
    word-wrap: break-word;
    font-size: 0.426rem;
    color: #444;
    line-height: 0.693rem;
    margin-bottom: 0.693rem;
  }

  .linkWrapper {
    padding: 0 0.426rem;
  }
  .Column {
    width: 100%;
    height: max-content;
  }
  .Column .discover_img {
    width: 100%;
    border-radius: 0.106rem;
    margin-bottom: 0.693rem;
    vertical-align: top;
  }
  .link {
    padding: 0 0.426rem;
    margin-bottom: 0.466rem;
    .linkBox {
      padding: 0.266rem;
      border-radius: 0.106rem;
      background: #F7F8FA;
      .linkIimg {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        text-align: center;
        line-height: 1.333rem;
        margin-right: 0.266rem;
        border-radius: 0.106rem;
        background: #ECECEE;
        .icon {
          color: #C8C8C8;
          font-size: 0.746rem;
        }
      }
      .productLogo {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        margin-right: 0.266rem;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.106rem;
          object-fit: cover;
        }
        &.border-football {
          &:after {
            border-radius: 0.213rem;
            border-color: #DCDCDC;
          }
        }
      }
      .linkContent {
        font-size: 0.373rem;
        color: #808080;
        .seat {
          width: 0.266rem;
          height: 0.4rem;
          display: inline-block;
        }
        div {
          word-break: break-all;
        }
        .text-line-2 {
          color: #808080;
        }
        .mark {
          padding: 0;
          margin-top: 0;
          .text {
            color: #FCC816;
            margin-top: 0 !important;
          }
          i {
            width: 0.053rem;
            height: 0.053rem;
            background: #B4B4B6;
            border-radius: 50%;
            margin: 0.26rem 0.133rem 0;
            /*display: inline-block;*/
          }
          .comment {
            color: #B4B4B6;
            font-size: 0.293rem;
            /*margin-top: 0.026rem;*/
          }
        }
      }
    }
  }
  .timeContainer {
    display: flex;
    color: #B4B4B6;
    margin-bottom: 0.6rem;
    padding: 0 0.426rem;
    justify-content: space-between;
    .makingCopy {
      font-size: 0.32rem;
    }
    .fromGroup {
      /*width: 3.173rem;*/
      height: 0.56rem;
      padding: 0 0.213rem;
      font-size: 0.32rem;
      line-height: 0.56rem;
      text-align: center;
      background: #F7F8FA;
      border-radius: 2.666rem;
      span {
        color: #808080;
        font-family:PingFangSC-Medium;
      }
      i {
        color: #B4B4B6;
        font-style: normal;
        margin-right: 0.08rem;
      }
    }
  }
  .productList {
    .comment-product {
      padding: 0.346rem 0.4rem 0;
      .product-info {
        padding: 0 0 0.4rem;
        background: none;
      }
      .productName {
        width: 7.573rem;
      }
    }
  }
  .comment-product {
    padding: 0.293rem 0.4rem 0.4rem;
    .product-info {
      overflow: hidden;
      background: #F7F8FA;
      padding: 0.266rem;
      .product-img {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.106rem;
          object-fit: cover;
        }
      }
      .product-detail {
        float: left;
        margin-left: 0.266rem;
        .productName {
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
        }
        .productMark {
          display: flex;
          .icon {
            color: #FCC816;
            font-size: 0.32rem;
          }
          span {
            color: #B4B4B6;
            font-size: 0.293rem;
            line-height: 0.4rem;
            &:nth-of-type(1) {
              color: #FCC816;
              margin-left: 0.08rem;
            }
          }
          i {
            width: 0.053rem;
            height: 0.053rem;
            margin-right: 0.133rem;
            vertical-align: middle;
            border-radius: 50%;
            background: #B4B4B6;
            display: inline-block;
          }
        }
      }
    }
  }

  .mui-table-view-cell {
    padding-top: 0.133rem;
  }
  .detail-discover {
    padding-bottom: 0.133rem;
    margin-top: 0 !important;
  }
  .detail-discover:before {
    display: none;
  }
  .detail-discover:after {
    display: none;
  }
  .lineMargin {
    margin-top: -0.426rem;
    margin-bottom: 0.373rem;
  }
  .active {
    color: #d4d4d4;
  }
</style>

<style type="text/css">
  .detail-discover .followWrapper {
    margin-top: 0.213rem;
  }
  .detail-discover .followWrapper .followButton {
    min-width: 1.173rem;
    height: 0.56rem;
    line-height: 0.56rem;
    font-size: 0.32rem;
    width: auto;
    padding: 0 0.266rem;
  }
</style>
