<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title" v-text="title"></h1>
    </header>

    <div class="mui-content" v-if="loading">
      <vue-pull-refresh :on-refresh="refreshPageData">
        <div>
          <div class="topImg container-image" v-if="detail.type === 'article' && detail.data.img">
            <img v-lazy="detail.data.img" class="lazyImg">
          </div>
        </div>

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

          <div class="detailTitle" v-if="detail.type === 'article' && detail.title">{{detail.title}}</div>

          <div class="line-river lineMargin"></div>

          <div class="discoverContentWrapper">
            <div class="contentWrapper quillDetailWrapper container-editor container-editor-app" id="contentWrapper">
              <span v-if="detail.type !== 'article'" v-html="textToLink(detail.title)"></span>

              <div class="richText container-editor container-editor-app" v-show="detail.type === 'article'">
                <div class="quill-editor">
                  <div class="ql-container ql-snow">
                    <div class="ql-editor discoverContent">
                    </div>
                  </div>
                </div>
              </div>

              <quill-editor
                class="hiddenWrapper"
                ref="myTextEditorRead"
                :options="editorOptionRead"
                @ready="onEditorReadyRead($event)"
                @change="change"
              >
              </quill-editor>
            </div>

            <div class="linkWrapper Column" v-if="detail.type === 'text' && detail.data.img && detail.data.img.length">
              <template v-for="(image, index) in detail.data.img">
                <img class="discover_img lazyImg" :id="'image_' + index" v-lazy="image" :data-preview-src="image"
                     :data-preview-group="1"/>
              </template>
            </div>
          </div>
          <!-- 新增链接样式 -->
          <div class="link" v-if="detail.tags">
            <div class="linkBox" @tap.stop.prevent="goArticle(detail)">
              <span class="linkIimg" v-if="!detail.tags[0].logo">
                <svg class="icon" aria-hidden="true" >
                  <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
                </svg>
              </span>
              <img class="lazyImg" v-lazy="detail.tags[0].logo" v-else>
              <div class="linkContent">
                <div v-if="detail.tags[0].name" class="text-line-2">{{detail.tags[0].name}}</div>
                <span v-else class="seat"></span>
                <div class="text-line-1">{{detail.tags[0].reviews}}条评论</div>
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
        <div class="river"></div>

        <div class="allDianPing font-family-medium">大家都在评</div>
        <div class="productList">

          <div class="comment-product" v-for="(item, index) in detail.related_tags" :key="index">
            <div class="product-info"  @tap.stop.prevent="$router.pushPlus('/dianping/product/' + item.name)">
              <div class="product-img">
                <img class="lazyImg" v-lazy="item.logo" alt="">
              </div>
              <div class="product-detail">
                <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
                <div class="productMark">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shoucangdilantongyi"></use>
                  </svg><span>{{ item.review_average_rate }}分</span>
                  <i></i><span>{{ item.review_count }}条评论</span>
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

    <div class="container-footer" @tap.capture="onTap($event)">
      <div class="footerLeft">
        <div class="footerMenuOne" :class="detail.is_upvoted ? 'activeBlue':'activeRed'" v-if="detail.is_downvoted || detail.is_upvoted">{{detail.support_description}}</div>
        <div class="footerMenuTwo" v-else>
          <div class="noBullish containerBtn" @tap.stop.prevent="detailDownVote()">{{detail.downvote_tip}}</div>
          <div class="bullish containerBtn" @tap.stop.prevent="upVote()">{{detail.support_tip}}</div>
        </div>
      </div>
      <div class="footerRight">
        <div class="collectionComment" @tap.stop.prevent="collection()">
          <div>
            <svg class="icon" aria-hidden="true" :class="{active: detail.is_bookmark}">
              <use xlink:href="#icon-shoucangdilantongyi"></use>
            </svg>
          </div>
          <span>收藏<i v-if="detail.bookmarks">{{detail.bookmarks}}</i></span>
        </div>
        <div class="collectionComment" @tap.stop.prevent="goComment()">
          <div>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pinglun"></use>
            </svg>
          </div>
          <span>评论<i v-if="detail.comments_number">{{detail.comments_number}}</i></span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import { getCommentDetail } from '../../../utils/dianping.js'
  import { textToLinkHtml, transferTagToLink } from '../../../utils/dom'
  import UserInfo from '../../../components/question-detail/UserInfo.vue'
  import { openVendorUrl, openAppUrl } from '../../../utils/plus'
  import VuePullRefresh from 'vue-awesome-pull-refresh'
  const currentUser = localEvent.getLocalItem('UserInfo')
  import localEvent from '../../../stores/localStorage'
  import ArticleDiscuss from '../../../components/discover/ArticleDiscuss.vue'
  import commentTextarea from '../../../components/comment/Textarea.vue'

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
      'vue-pull-refresh': VuePullRefresh
    },
    methods: {
      refreshPageData () {
        this.getDetail()
      },
      goComment () {
        this.$refs.discuss.rootComment()
        // scrollToElement(this, '#commentTitle', '.pull-down-container')
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
        this.id = this.$route.params.id
        getCommentDetail(this, this.id, (detail) => {
          this.detail = detail
        })
      },
      discussStoreParams () {
        return {'submission_id': this.detail.id}
      },
      discussListParams () {
        return {'submission_slug': this.detail.slug, sort: 'hot'}
      },
      setFollowStatus (status) {
        this.detail.is_followed_author = status
      },
      textToLink (text) {
        return transferTagToLink(textToLinkHtml(' ' + text))
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
    bottom: 1.333rem;
  }
  .topImg {
    margin-bottom: 0.32rem;
    img {
      width: 10rem;
      height: 5.333rem;
    }
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
      img {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        margin-right: 0.266rem;
        border-radius: 0.106rem;
        object-fit: cover;
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
        .text-line-1 {
          color: #B4B4B6;
          font-size: 0.32rem;
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

  .container-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1.333rem;
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
      padding: 0.186rem 0 0.186rem 0.426rem;
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
        width: 5.933rem;
        height: 0.96rem;
        display: flex;
        color: #03AEF9;
        line-height: 0.96rem;
        border-radius: 0.213rem;
        background: #F3F4F6;
        text-align: center;
        justify-content: center;
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
      display: flex;
      float: right;
      margin-top: 0.186rem;
      margin-right: 0.426rem;
      .collectionComment {
        width: 1.333rem;
        height: 1.306rem;
        flex-grow:1;
        color: #808080;
        span {
          color: #B4B4B6;
          display: block;
          margin-top: -0.106rem;
          i {
            font-style: normal;
          }
        }
      }
      .icon {
        font-size: 0.586rem;
        /*margin-top: -0.106rem;*/
      }
    }
  }
</style>
