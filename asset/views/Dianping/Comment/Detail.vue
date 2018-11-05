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
          <div class="link">
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

      </vue-pull-refresh>
    </div>


    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

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
        }
      }
    },
    components: {
      UserInfo,
      ArticleDiscuss,
      commentTextarea,
      'vue-pull-refresh': VuePullRefresh
    },
    methods: {
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
      getDetail () {
        this.id = this.$route.params.id
        getCommentDetail(this, this.id, (detail) => {
          this.detail = detail
        })
      },
      refreshPageData () {
        this.getDetail()
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
    mounted () {},
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
  }
  .topImg {
    margin-bottom: 0.32rem;
    img {
      width: 10rem;
      height: 5.333rem;
    }
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
</style>
