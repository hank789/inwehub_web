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
          <div class="line-river lineMargin"></div>

          <div class="mark">
            <div class="stars">
              <star-rating
                :padding="3"
                :activeColor="'#fcc816'"
                :star-size="11"
                :show-rating="false"
                :border-color="'#fcc816'"
                :border-width="1"
                :inactive-color="'#FFFFFF'"
                :rating="detail.rate_star"
                :read-only="true"
                :starPoints="[48.3,190.9,46.5,190.8,43.2,189.7,41.6,188.7,40.4,187.7,38.4,185.2,37.2,182.3,36.9,179.1,37.1,177.5,46,125.9,8.5,89.4,7.4,88.2,5.9,85.4,5.1,82.4,5.2,79.3,5.6,77.7,6.2,76.2,8,73.6,10.4,71.6,13.2,70.3,14.8,69.9,66.6,62.4,89.8,15.4,90.6,14,92.7,11.7,95.4,10,98.4,9.1,100,9,101.6,9.1,104.7,10,107.3,11.6,109.4,14,110.2,15.4,133.4,62.4,185.2,69.9,186.8,70.2,189.7,71.5,192.1,73.5,193.8,76.2,194.4,77.7,194.8,79.3,194.9,82.4,194.1,85.4,192.6,88.2,191.5,89.4,154,125.9,162.9,177.5,163.1,179.1,162.7,182.2,161.5,185.1,159.6,187.6,158.4,188.7,157,189.6,154.1,190.7,151,190.9,147.9,190.2,146.4,189.6,100,165.2,53.7,189.6,51,190.6,48.3,190.9,48.3,190.9]"
              ></star-rating>
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
                <div v-if="detail.tags[0].name" class="text-line-2">{{detail.tags[0].name}}</div>
                <span v-else class="seat"></span>
                <div class="mark">
                  <div class="stars">
                    <star-rating
                      :padding="3"
                      :activeColor="'#fcc816'"
                      :star-size="11"
                      :show-rating="false"
                      :border-color="'#fcc816'"
                      :border-width="1"
                      :inactive-color="'#F7F8FA'"
                      :rating="detail.rate_star"
                      :read-only="true"
                      :starPoints="[48.3,190.9,46.5,190.8,43.2,189.7,41.6,188.7,40.4,187.7,38.4,185.2,37.2,182.3,36.9,179.1,37.1,177.5,46,125.9,8.5,89.4,7.4,88.2,5.9,85.4,5.1,82.4,5.2,79.3,5.6,77.7,6.2,76.2,8,73.6,10.4,71.6,13.2,70.3,14.8,69.9,66.6,62.4,89.8,15.4,90.6,14,92.7,11.7,95.4,10,98.4,9.1,100,9,101.6,9.1,104.7,10,107.3,11.6,109.4,14,110.2,15.4,133.4,62.4,185.2,69.9,186.8,70.2,189.7,71.5,192.1,73.5,193.8,76.2,194.4,77.7,194.8,79.3,194.9,82.4,194.1,85.4,192.6,88.2,191.5,89.4,154,125.9,162.9,177.5,163.1,179.1,162.7,182.2,161.5,185.1,159.6,187.6,158.4,188.7,157,189.6,154.1,190.7,151,190.9,147.9,190.2,146.4,189.6,100,165.2,53.7,189.6,51,190.6,48.3,190.9,48.3,190.9]"
                    ></star-rating>
                  </div>
                  <div class="text">{{ detail.rate_star }}分</div><i></i>
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
                    <star-rating
                      :increment="0.1"
                      :padding="3"
                      :activeColor="'#fcc816'"
                      :star-size="11"
                      :show-rating="false"
                      :border-color="'#fcc816'"
                      :border-width="1"
                      :inactive-color="'#FFFFFF'"
                      :rating="item.review_average_rate"
                      :read-only="true"
                      :starPoints="[48.3,190.9,46.5,190.8,43.2,189.7,41.6,188.7,40.4,187.7,38.4,185.2,37.2,182.3,36.9,179.1,37.1,177.5,46,125.9,8.5,89.4,7.4,88.2,5.9,85.4,5.1,82.4,5.2,79.3,5.6,77.7,6.2,76.2,8,73.6,10.4,71.6,13.2,70.3,14.8,69.9,66.6,62.4,89.8,15.4,90.6,14,92.7,11.7,95.4,10,98.4,9.1,100,9,101.6,9.1,104.7,10,107.3,11.6,109.4,14,110.2,15.4,133.4,62.4,185.2,69.9,186.8,70.2,189.7,71.5,192.1,73.5,193.8,76.2,194.4,77.7,194.8,79.3,194.9,82.4,194.1,85.4,192.6,88.2,191.5,89.4,154,125.9,162.9,177.5,163.1,179.1,162.7,182.2,161.5,185.1,159.6,187.6,158.4,188.7,157,189.6,154.1,190.7,151,190.9,147.9,190.2,146.4,189.6,100,165.2,53.7,189.6,51,190.6,48.3,190.9,48.3,190.9]"
                    ></star-rating>
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

    <div class="container-footer">
      <div class="footerLeft">
        <div class="footerMenuOne" :class="detail.is_upvoted ? 'activeBlue':'activeRed'" v-if="detail.is_downvoted || detail.is_upvoted">{{detail.support_description}}</div>
        <div class="footerMenuTwo" v-else>
          <div class="noBullish containerBtn" @tap.stop.prevent="detailDownVote()">{{detail.downvote_tip}}</div>
          <div class="bullish containerBtn" @tap.stop.prevent="upVote()">{{detail.support_tip}}</div>
        </div>
      </div>
      <div class="footerRight">
        <div class="collectionComment" @tap.stop.prevent="collect()">
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

    <PageMore
      ref="share"
      :shareOption="shareOption"
      :hideShareBtn="false"
      :iconMenu="iconMenus"
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
      'vue-pull-refresh': VuePullRefresh
    },
    computed: {
      discussStoreParams () {
        return {'submission_id': this.detail.id}
      },
      discussListParams () {
        return {'submission_slug': this.detail.slug, sort: 'hot'}
      }
    },
    methods: {
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
          } else {
            this.detail.bookmarks++
            this.detail.is_bookmark = 1
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
        })
      },
      detailDownVote () {
        downVote(this, this.detail.id, (response) => {
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
        this.id = this.$route.params.id
        getCommentDetail(this, this.id, (detail) => {
          this.detail = detail
          var shareOption = getDianpingCommentDetail(this.detail.slug, this.detail.title, this.detail.owner.avatar, this.detail.owner.name)
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
    bottom: 1.333rem;
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
  .active {
    color: #d4d4d4;
  }
</style>
