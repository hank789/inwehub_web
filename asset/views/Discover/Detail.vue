<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back v-if="!noback"></Back>
      <h1 class="mui-title" v-text="title"></h1>
    </header>

    <div class="mui-content" v-show="!loading" @tap.capture="onTap($event)">
      <MescrollDetail
        ref="mescrollDetail"
        :isLoading="loading"
        @refreshPageData="refreshPageDataNoLoading"
      >
          <div v-if="isShow">

            <div class="topImg container-image" v-if="detail.type === 'article' && detail.data.img">
              <img v-lazy="detail.data.img" class="lazyImg">
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

              <!--<div class="line-river lineMargin"></div>-->

              <div class="discoverContentWrapper">
                <div class="contentWrapper quillDetailWrapper container-editor container-editor-app"
                     id="contentWrapper">
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

                <div class="container-pdf-list"
                     v-if="detail.type === 'text' && detail.data.files && detail.data.files.length">
                  <div class="pdf" v-for="(pdf, index) in detail.data.files" :key="index"
                       @tap.stop.prevent="seePdf(pdf)"><span class="text-line-2">{{pdf.name}}</span></div>
                </div>

                <div class="linkWrapper Column"
                     v-if="detail.type === 'text' && detail.data.img && detail.data.img.length">
                  <template v-for="(image, index) in detail.data.img">
                    <img class="discover_img lazyImg" :id="'image_' + index" :key="image" v-lazy="image" :data-preview-src="image"
                         :data-preview-group="1"/>
                  </template>
                </div>
              </div>

              <!--<div class="groups"  v-if="typeDesc(detail.group.is_joined)"-->
              <!--@tap.stop.prevent="$router.pushPlus('/group/detail/' + detail.group.id)">加入圈子阅读全部内容-->
              <!--</div>-->

              <!-- 新增链接样式 -->
              <div class="link" v-if="detail.type === 'link' && detail.data.url">
                <div class="linkBox" @tap.stop.prevent="goArticle(detail)">
              <span class="linkIimg" v-if="!detail.data.img">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
                </svg>
              </span>
                  <img class="lazyImg" :key="detail.data.img" v-lazy="detail.data.img" v-else>
                  <div class="linkContent">
                    <div v-if="detail.data.title" class="text-line-2">{{detail.data.title}}</div>
                    <span v-else class="seat"></span>
                    <div class="text-line-1">{{detail.data.domain}}</div>
                  </div>
                </div>
              </div>

              <div class="timeContainer">
                <div class="makingCopy">著作权归作者所有</div>
                <div class="fromGroup">
                  <span @tap="toDetail(detail.group)"><i>来自圈子</i>{{ detail.group.name }}</span>
                </div>
              </div>

              <!-- 关联问答 -->
              <div class="answer" v-if="detail.related_question"
                   @tap.stop.prevent="toAnswerDetail(detail.related_question)">
                <div class="answerBox">
                  <div class="answerContent">
                <span class="price">
                  <span></span>{{detail.related_question.status_description}}
                </span>
                    {{detail.related_question.title}}

                  </div>
                  <div class="followAnswer">
                    <span class="follow">{{detail.related_question.follow_number}}人关注 </span>
                    <span class="rightLine"></span>
                    <div class="replay">
                      <img v-for="(answerUser, index) in detail.related_question.answer_users" :src="answerUser.avatar">
                      <span>等{{detail.related_question.answer_number}}人回答</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="share">
                <div class="location" v-show="detail.data.current_address_name">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dingwei1"></use>
                  </svg>
                  <span>{{detail.data.current_address_name}}</span>
                </div>
              </div>
            </div>

            <!--<div class="river" v-if="detail.supporter_list.length"></div>-->
            <div class="river"></div>

            <ArticleDiscuss
              class="commentTitle"
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
            <div class="seeAll" v-if="detail.comments_number > 3"
                 @tap.stop.prevent="$router.pushPlus('/comment/' + detail.category_id + '/' + detail.slug + '/' + detail.id)">
              查看全部{{detail.comments_number}}条评论
            </div>
          </div>

          <!--私密的样式-->
          <!--圈子信息-->
          <div v-else>
            <div class="groupsCenter">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zanwushuju"></use>
              </svg>
              <p>私密圈子内容加入后可阅读</p>
              <p @tap.stop.prevent="$router.pushPlus('/group/detail/' + detail.group.id)">去加入</p>
            </div>
            <!--<div class="riverBot"></div>-->
            <!--<div class="groupsBot">-->
            <!--<groups-list class="small detail"-->
            <!--:list="detail.group"-->
            <!--:type="'small'"-->
            <!--&gt;</groups-list>-->
            <!--</div>-->
          </div>

          <div class="container-recommentProduct" v-if="isShow && detail.related_tags.length !== 0">
            <div class="river"></div>
            <div class="title">
              <div class="text font-family-medium">相关产品</div>
              <div class="line-river line-river-full"></div>
            </div>

            <div class="productList">
              <div class="comment-product" v-for="(item, index) in detail.related_tags" :key="index">
                <div class="product-info"
                     @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
                  <div class="product-img border-football">
                    <ImageView :src="item.logo" width="44" height="44"></ImageView>
                    <!--<img src="../../../statics/images/uicon.jpg" alt="">-->
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
                <div class="line-river-after line-river-after-top"
                     v-if="index !== detail.related_tags.length - 1"></div>
              </div>
            </div>

          </div>

          <div class="river" v-if="isShow"></div>
          <div class="guessLike" v-if="isShow">
            <div class="component-block-title">
              <div class="left">猜您喜欢</div>
            </div>
            <div class="line-river-after"></div>
            <template v-for="(item, index) in list">
              <div class="line-river-big" v-if="index === 5"></div>
              <div class="component-item-article" @tap.stop.prevent="goDetail(item)">
                <div class="itemArticleLeft">
                  <div class="titleWrapper">
                    <div class="title text-line-2 text-content">
                      <!--<span class="number" v-if="index < 5">{{index+1}}.</span>-->{{item.data.title}}
                    </div>
                  </div>
                  <div class="explain">
                    <label v-if="item.tips">{{item.tips}}</label><span
                    v-if="item.type_description">{{item.type_description}}</span>
                    <timeago :since="timeago(item.created_at)" :auto-update="60">
                    </timeago>
                  </div>
                </div>
                <div class="itemArticleRight"><img class="lazyImg" v-lazy="item.data.img"></div>
              </div>
              <div class="line-river-after line-river-after-short" v-if="index !== 4 && index !== list.length-1"></div>
            </template>
          </div>
          <div class="river" v-if="isShow"></div>

          <div class="openAppReadBox" v-if="isShow">
            <div class="openAppRead" @tap.stop.prevent="openApp()">
              <span class="font-family-medium">打开APP</span>
              <span>阅读更多推荐</span>
            </div>
            <div class="river openAppReadRiver"></div>
            <div class="followCode">
              <div class="CodeImg">
                <img src="../../statics/images/xiaohaWeChat@3x.png" alt="">
              </div>
              <div class="codeText">
                <div>长按添加平台联络官“小哈”微信</div>
                <div>加行业群/互动交流/探索更多</div>
              </div>
            </div>
            <div class="river openAppReadRiver"></div>
          </div>
      </MescrollDetail>
    </div>

    <PageMore
      ref="ShareBtn"
      :shareOption="shareOption"
      :iconMenu="iconMenus"
      @success="shareSuccess"
      @fail="shareFail"
      @clickedItem="iconMenusClickedItem"
    ></PageMore>

    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

    <div @tap.capture="onTap($event)">
      <DetailMenu
        :detail="this.detail"
        :iconOptions="iconOptions"
        @detailMenuIcon="detailMenuIcon"
        @WriteComment="goComment"
      ></DetailMenu>
    </div>

    <AlertTextarea ref="AlertTextarea"></AlertTextarea>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import UserInfo from './../../components/question-detail/UserInfo.vue'
  import Images from '../../components/image/Images.vue'
  import Statistics from './../../components/discover/Statistics.vue'
  import ArticleDiscuss from '../../components/discover/ArticleDiscuss.vue'
  import { autoTextArea, openVendorUrl, openAppUrl, openFileUrl, openAppUrlByUrl } from '../../utils/plus'
  import PageMore from '../../components/PageMore.vue'
  import { getTextDiscoverDetail } from '../../utils/shareTemplate'
  import { goThirdPartyArticle } from '../../utils/webview'
  import { textToLinkHtml, transferTagToLink, addPreviewAttrForImg } from '../../utils/dom'
  import localEvent from '../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')
  import commentTextarea from '../../components/comment/Textarea.vue'
  import AlertTextarea from '../../components/comment/AlertTextarea.vue'
  import groupsList from '../../components/groups/GroupsList.vue'
  import userAbility from '../../utils/userAbility'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/monokai-sublime.css'
  import { quillEditor } from '../../components/vue-quill'
  import {
    upvote,
    downVote,
    deleteItem,
    setTop,
    addGood,
    cancelGood,
    cancelTop,
    collect,
    report
  } from '../../utils/discover'
  import DetailMenu from '../../components/menu/Detail.vue'
  import StarView from '../../components/star-rating/starView.vue'
  import { showComment } from '../../utils/comment'
  import MescrollDetail from '../../components/refresh/MescrollDetail.vue'

  export default {
    data () {
      return {
        editorOptionRead: {
          placeholder: ' ',
          modules: {
            toolbar: []
          },
          readOnly: true
        },
        editorReadObj: null,
        editorReadContentObj: null,
        userId: currentUser.user_id,
        name: currentUser.name,
        uuid: currentUser.uuid,
        slug: '',
        noback: false,
        title: '分享',
        isUpvote: String,
        list: [],
        link: '分享',
        detail: {
          group: {
            is_joined: '',
            id: '',
            public: '',
            name: ''
          },
          owner: {
            id: '',
            uuid: '',
            avatar: '',
            username: ''
          },
          id: 0,
          supporter_list: [],
          title: '',
          data: {
            img: [],
            description: ''
          },
          created_at: ''
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
        isFollow: true,
        loading: true
      }
    },
    computed: {
      isShow () {
        var ispublic = this.detail.group.public
        var type = this.detail.group.is_joined
        //  公开的都展示
        if (ispublic) {
          return true
        } else {
          if (type === 1 || type === 3) {
            return true
          } else {
            return false
          }
        }
      },
      discussStoreParams () {
        return {'submission_id': this.detail.id}
      },
      discussListParams () {
        return {'submission_slug': this.detail.slug, order_by: 2, perPage: 3}
      },
      descLength () {
        if (this.description === this.descPlaceholder) {
          return 0
        }
        return this.description.length
      },
      iconMenus () {
        var iconMenus = []

        if (!this.detail.id) {
          return iconMenus
        }

        if (this.userId === this.detail.owner.id) {
          iconMenus.push({
            icon: '#icon-shanchu1',
            text: '删除'
          })
        }
        if (this.detail.is_bookmark) {
          iconMenus.push({
            icon: '#icon-shoucangdilantongyi',
            text: '已收藏',
            isBookMark: 1
          })
        } else {
          iconMenus.push({
            icon: '#icon-shoucangdilantongyi',
            text: '收藏',
            isBookMark: 0
          })
        }

        if (this.detail.group && this.detail.group.is_joined === 3) {
          if (this.detail.is_recommend) {
            iconMenus.push({
              icon: '#icon-sheweijingxuan',
              text: '取消加精'
            })
          } else {
            iconMenus.push({
              icon: '#icon-sheweijingxuan',
              text: '设为精选'
            })
          }

          if (this.detail.top) {
            iconMenus.push({
              icon: '#icon-zhiding',
              text: '取消置顶'
            })
          } else {
            iconMenus.push({
              icon: '#icon-zhiding',
              text: '置顶'
            })
          }
        }

        iconMenus.push({
          icon: '#icon-jubao',
          text: '举报'
        })
        return iconMenus
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
    components: {
      UserInfo,
      Images,
      Statistics,
      ArticleDiscuss,
      PageMore,
      commentTextarea,
      groupsList,
      quillEditor,
      DetailMenu,
      StarView,
      AlertTextarea,
      MescrollDetail
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
            this.$refs.ShareBtn.share()
            break
        }
      },
      openApp () {
        window.mui.trigger(document.querySelector('.AppOne'), 'tap')
      },
      onTap (event) {
        if (this.typeDesc(this.detail.group.is_joined)) {
          event.stopPropagation()
          event.preventDefault()

          userAbility.inviteJoinInGroup(this, this.detail.group.id, () => {
            this.refreshPageData(false)
          }, this.detail.group)
        }
      },
      iconMenusClickedItem (item, callback) {
        switch (item.text) {
          case '删除':
            this.$refs.ShareBtn.toggle()
            deleteItem(this.detail.id, () => {
              window.mui.back()
            })
            break
          case '举报':
            this.$refs.ShareBtn.toggle()
            report(this, this.link)
            break
          case '收藏':
            collect(this, this.detail.id, () => {
              this.detail.bookmarks++
              this.detail.is_bookmark = 1
            }, () => {
              this.detail.bookmarks--
              this.detail.is_bookmark = 0
            })
            break
          case '已收藏':
            collect(this, this.detail.id, () => {
              this.detail.bookmarks++
              this.detail.is_bookmark = 1
            }, () => {
              this.detail.bookmarks--
              this.detail.is_bookmark = 0
            })
            break
          case '设为精选':
            addGood(this.detail.id, () => {
              this.detail.is_recommend = true
            })
            break
          case '取消加精':
            cancelGood(this.detail.id, () => {
              this.detail.is_recommend = false
            })
            break
          case '置顶':
            setTop(this.detail.id, () => {
              this.detail.top = true
            })
            break
          case '取消置顶':
            cancelTop(this.detail.id, () => {
              this.detail.top = false
            })
            break
        }
      },
      reportOld () {
        this.$refs.ShareBtn.toggle()
        window.mui.prompt('举报', '输入举报原因', ' ', ['取消', '提交'], (e) => {
          if (e.index === 1) {
            if (e.value) {
              postRequest(`system/feedback`, {
                title: '举报内容',
                content: e.value
              }).then(response => {
                var code = response.data.code
                if (code !== 1000) {
                  window.mui.alert(response.data.message)
                  window.mui.back()
                  return
                }
                if (response.data.data) {
                  window.mui.back()
                  window.mui.toast('举报成功')
                }
              })
            } else {
              window.mui.toast('请填写举报内容')
            }
          }
        }, 'div')
      },
      goComment () {
        var y = this.$el.querySelector('#commentTitle').offsetTop
        console.log('y:' + y)
        this.$refs.mescrollDetail.scrollTo(0, y, 300)
        this.$refs.discuss.rootComment()
      },
      goDetail (item) {
        if (!window.mui.os.plus) {
          this.openApp()
          return
        }

        switch (item.read_type) {
          case 1:
            window.trackMixpanelEvent('redirect-to-recommend', '/c/' + item.data.category_id + '/' + item.data.slug, 'discover_detail', '分享', this.$router.fullPath)
            this.$router.pushPlus('/c/' + item.data.category_id + '/' + item.data.slug)
            break
          case 2:
            window.trackMixpanelEvent('redirect-to-recommend', '/askCommunity/major/' + item.source_id, 'askCommunity-major-detail', '问答社区', this.$router.fullPath)
            this.$router.pushPlus('/askCommunity/major/' + item.source_id)
            break
          case 3:
            window.trackMixpanelEvent('redirect-to-recommend', '/ask/offer/answers/' + item.source_id, 'ask-offer-answers', '问答社区-悬赏问答-回答列表页', this.$router.fullPath)
            this.$router.pushPlus('/ask/offer/answers/' + item.source_id)
            break
          case 4:
            this.$router.pushPlus('/EnrollmentStatus/' + item.source_id)
            break
          case 5:
            this.$router.pushPlus('/EnrollmentStatus/' + item.source_id)
            break
          case 6:
            window.trackMixpanelEvent('redirect-to-recommend', '/ask/offer/' + item.source_id, 'ask-offer-detail', '问答社区-悬赏问答-详情页', this.$router.fullPath)
            this.$router.pushPlus('/ask/offer/' + item.source_id)
            break
          default:
        }
      },
      recommendRead () {
        postRequest(`getRelatedRecommend`, {source_id: this.detail.id, perPage: 4, source_type: 1}).then(response => {
          this.list = response.data.data.data
        })
      },
      toAnswerDetail (item) {
        this.$router.pushPlus('/ask/offer/answers/' + item.id)
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
      },
      onEditorReadyRead (editor) {
        this.editorReadObj = editor
        if (this.editorReadContentObj) {
          this.editorReadObj.setContents(this.editorReadContentObj)
        }
      },
      toDetail (item) {
        this.$router.pushPlus('/group/detail/' + item.id)
      },
      seePdf (pdf) {
        openFileUrl(pdf.url, pdf.name)
      },
      typeDesc (type) {
        switch (type) {
          case -1:
            return true
          case 0:
            return true
          case 1:
            return false
          case 2:
            return true
          case 3:
            return false
        }
      },
      showAllContentWrapper () {
        var contentWrapper = document.querySelector('.discoverContentWrapper')
        if (contentWrapper) {
          contentWrapper.classList.remove('shortContentWrapper')
        }
      },
      goJoin (id) {
        this.$router.pushPlus('/group/detail/' + id)
      },
      // 删除
      deleterow () {

      },
      textToLink (text) {
        return transferTagToLink(textToLinkHtml(' ' + text))
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      sendMessage (message) {
        this.$refs.discuss.sendMessage(message)
      },
      comment (commentTargetName) {
        showComment(
          this,
          commentTargetName,
          this.$refs.ctextarea,
          this.$refs.AlertTextarea,
          this.$refs.discuss
        )
      },
      commentFinish () {
        this.commentNumAdd()
        this.$refs.ctextarea.finish()
      },
      goArticle: function (detail) {
        if (detail.type !== 'link') {
          return
        }

        if (detail.data.url.indexOf(process.env.H5_ROOT) === 0) {
          openAppUrlByUrl(detail.data.url)
        } else {
          goThirdPartyArticle(
            detail.data.url,
            detail.id,
            detail.data.title,
            '/c/' + detail.category_id + '/' + detail.slug,
            detail.data.img
          )
        }
      },
      refreshPageDataNoLoading () {
        this.refreshPageData(false)
      },
      refreshPageData (loading = true) {
        this.detail.data.img = []
        this.getDetail(loading)
        this.$refs.ctextarea.refreshPageData()
      },
      shareSuccess () {
      },
      shareFail () {
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      getDetail: function (loading = true) {
        this.loading = loading
        this.slug = this.$route.params.slug
        this.shareOption.targetId = this.slug
        this.noback = !!this.$route.query.noback
        this.link = this.$route.path

        if (!this.slug) {
          this.$router.back()
          return
        }

        postRequest(`article/detail-by-slug`, {slug: this.slug}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            window.mui.back()
            return
          }

          this.detail = response.data.data

          var shareOption = getTextDiscoverDetail('/c/' + this.detail.category_id + '/' + this.detail.slug, this.detail.title, this.detail.owner.avatar, this.detail.owner.name, this.detail.group.name)
          this.shareOption = Object.assign(this.shareOption, shareOption)
          if (this.detail.type === 'article') {
            this.title = this.detail.title
            var objs = JSON.parse(this.detail.data.description)
            this.editorReadContentObj = objs
            if (this.editorReadObj) {
              this.editorReadObj.setContents(objs)
            }
          } else {
            this.title = '分享'
          }

          this.loading = false
          this.recommendRead()

          this.$refs.mescrollDetail.finish()

          // 滚动到上面
          this.$refs.mescrollDetail.scrollToTop()
        })
      },
      setFollowStatus (status) {
        this.detail.is_followed_author = status
      },
      commentNumAdd () {
        this.detail.comments_number++
      },
      commentNumDesc () {
        this.detail.comments_number--
      },
      shotContentHeight () {
        if (this.detail.group.is_joined !== -1) {
          this.showAllContentWrapper()
          return
        }

        var contentWrapper = document.querySelector('.discoverContentWrapper')
        if (contentWrapper && contentWrapper.offsetHeight > 300) {
          contentWrapper.classList.add('shortContentWrapper')
        }
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
      delCommentSuccess () {
        this.detail.comments_number--
      }
    },
    updated () {
      this.$nextTick(function () {
        if (this.isShow) {
//          setTimeout(() => {
//            this.shotContentHeight()
//          }, 200)
          openVendorUrl(this.$el.querySelector('#contentWrapper'))
          openAppUrl(this.$el.querySelector('#contentWrapper'))
        }
      })
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getDetail()
    },
    mounted () {
      window.mui.previewImage()
      autoTextArea()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .active {
    color: #d4d4d4;
  }

  .seeAll {
    padding: 0.32rem 0;
    font-size: 0.373rem;
    color: #808080;
    line-height: 0.533rem;
    text-align: center;
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
        flex-grow: 1;
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

  .lineMargin {
    margin-top: -0.426rem;
    margin-bottom: 0.373rem;
  }

  .container-image {
    height: 5.333rem;
    border-radius: 0;
    img {
      border-radius: 0;
    }
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

  .detail-discover {
    padding-bottom: 0.133rem;
    margin-top: 0 !important;
  }

  .mui-table-view-cell {
    padding-top: 0.133rem;
    padding-bottom: 0.373rem;
  }

  .detail-discover:before {
    display: none;
  }

  .detail-discover:after {
    display: none;
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

  .contentWrapper .tags {
    color: rgb(33, 77, 120);
    margin-right: 0.16rem;
  }

  .newestList {
    padding: 0.266rem 0.4rem 0;
    background: #fff;
  }

  .linkWrapper {
    padding: 0 0.426rem;
  }

  .timeContainer {
    display: flex;
    color: #B4B4B6;
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
        font-family: PingFangSC-Medium;
      }
      i {
        color: #B4B4B6;
        font-style: normal;
        margin-right: 0.08rem;
      }
    }
  }

  .address {
    width: 100%;
    padding: 0.133rem 0.4rem 0;
    background: #fff;
    font-size: 0.32rem;
    color: #808080;
  }

  .statistics {
    background: #fff;
  }

  .mui-content {
    bottom: 1.333rem;
    background: #fff;
  }

  .statisticsWrapper {
    padding: 0 0.4rem 0.4rem;
  }

  /*点赞样式*/
  .component-dianzanList {
    width: 100%;
    padding: 0.346rem 0.4rem;
  }

  .component-dianzanList span {
    font-size: 0.346rem;
    color: #03aef9;
  }

  .contentWrapper span {
    font-size: 0.4rem;
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

  /*删除按钮*/
  .discover_datail_dalete {
    width: 1.52rem;
    height: 0.72rem;
    border: 0.026rem solid #444444;
    text-align: center;
    line-height: 0.72rem;
    font-size: 0.346rem;
    color: #444444;
    border-radius: 1.333rem;
    position: absolute;
    right: 0.426rem;
    top: 0.426rem;
  }

  .timeData {
    position: absolute;
    top: 0.72rem;
    left: 1.493rem;
    font-size: 0.32rem;
    color: #C8C8C8;
    margin-top: -0.106rem;
  }

  .share {
    padding: 0 0.453rem;
    margin: 0.133rem 0 0.72rem 0;
    .location {
      margin-left: -0.08rem;
      .icon {
        color: #C8C8C8;
        vertical-align: middle;
      }
    }
    span {
      margin-left: -0.106rem;
      font-size: 0.32rem;
      color: #B4B4B6;
    }
    .shareGo {
      margin: 0.693rem auto 0;
      text-align: center;
      p {
        font-size: 0.373rem;
        color: #808080;
      }
      .shareList {
        margin-top: -0.4rem;
        text-align: center;
        ul {
          width: 100%;
          padding: 0;
          display: inline-block;
          li {
            margin: 0 0.346rem;
            display: inline-block;
            &:nth-of-type(1) {
              img {
                width: 0.986rem;
                height: 0.8rem;
              }
            }
            &:nth-of-type(2) {
              img {
                width: 0.8rem;
                height: 0.8rem;
              }
            }
          }
          p {
            font-size: 0.32rem;
            color: #B4B4B6;
          }
        }
      }
    }
  }

  // 新增链接样式
  .link {
    padding: 0 0.426rem;
    margin-bottom: 0.693rem;
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
        object-fit: contain;
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

  // 关联问答
  .answer {
    padding: 0 0.426rem;
    margin-top: 0.586rem;
    .answerBox {
      padding: 0.4rem 0.4rem 0.426rem;
      border-radius: 0.106rem;
      border: 0.026rem solid #DCDCDC;
      .answerContent {
        font-size: 0.373rem;
        color: #444;
        .price {
          // width: 1.04rem;
          height: 0.453rem;
          padding: 0 0.106rem;
          font-size: 0.293rem;
          color: #235280;
          text-align: right;
          line-height: 0.453rem;
          border-radius: 0.106rem;
          background: #A8DFF7;
          display: inline-block;
          span {
            width: 0.08rem;
            height: 0.08rem;
            margin-top: -0.08rem;
            margin-right: 0.08rem;
            border-radius: 50%;
            background: #fff;
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
    }
    .followAnswer {
      margin-top: 0.186rem;
      .follow {
        font-size: 0.32rem;
        color: #808080;
        line-height: 0.533rem;
        vertical-align: top;
        display: inline-block;
      }
      .rightLine {
        width: 0.026rem;
        height: 0.293rem;
        margin: -0.266rem 0.426rem 0 0.106rem;
        vertical-align: middle;
        display: inline-block;
        background: #DCDCDC;
      }
      .replay {
        display: inline-block;
        img {
          width: 0.533rem;
          height: 0.533rem;
          margin-left: -0.32rem;
          border: 0.053rem solid #fff;
          border-radius: 50%;
        }
        span {
          font-size: 0.32rem;
          color: #808080;
          line-height: 0.533rem;
          vertical-align: top;
        }
      }
    }
  }

  .groups {
    width: 92%;
    margin-left: 4%;
    text-align: center;
    height: 0.906rem;
    line-height: 0.906rem;
    border-radius: 0.106rem;
    border: 0.026rem solid #DCDCDC;
    margin-bottom: 0.346rem;
    font-size: 0.373rem;
    color: #03AEF9;
  }

  .groupsList {
    width: 92%;
    margin-left: 4%;
    padding-bottom: 0.266rem;
  }

  .groupsBot {
    width: 92%;
    margin-left: 4%;
    padding-bottom: 0.266rem;
    position: absolute;
    bottom: 0;
  }

  .riverBot {
    width: 100%;
    height: 0.266rem;
    position: absolute;
    bottom: 1.78rem;
    background: #f3f4f6;
  }

  .groupsCenter {
    width: 5.333rem;
    height: 4.266rem;
    position: absolute;
    top: 0;
    bottom: 1.973rem;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }

  .groupsCenter svg {
    font-size: 1.866rem;
  }

  .groupsCenter p:nth-of-type(1) {
    font-size: 0.32rem;
    color: #C8C8C8;
    text-align: center;
    margin-top: 0.186rem;
    margin-bottom: 0.56rem;
  }

  .groupsCenter p:nth-of-type(2) {
    width: 3.066rem;
    height: 1.093rem;
    line-height: 1.093rem;
    background: #03AEF9;
    border-radius: 1.333rem;
    font-size: 0.426rem;
    color: #FFFFFF;
    text-align: center;
    margin: auto;
  }

  .shortContentWrapper {
    max-height: 8rem;
    overflow: hidden;
    position: relative;
    margin-bottom: 0.266rem;

    &:after {
      position: absolute;
      bottom: 0;
      content: '';
      height: 1.666rem;
      width: 100%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    }
  }

  .container-recommentProduct {
    .title {
      height: 1.173rem;
      line-height: 1.173rem;
      .text {
        color: #444444;
        font-size: 0.426rem;
        padding: 0 0.426rem;
      }
    }

    .comment-product {
      padding: 0.346rem 0.4rem 0;
      .product-info {
        overflow: hidden;
        border-radius: 0.106rem;
        padding: 0 0 0.4rem;
        background: none;
        .product-img {
          width: 1.173rem;
          height: 1.173rem;
          float: left;
          img {
            width: 100%;
            height: 100%;
            border-radius: 0.106rem;
            object-fit: contain;
          }
        }
        .product-detail {
          float: left;
          margin-left: 0.266rem;
          .productName {
            width: 7.573rem;
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
            .stars {
              display: flex;
              div {
                margin-right: 0.08rem;
              }
            }
            .starsText {
            }
          }
        }
      }
    }
  }

  .container-pdf-list {
    padding: 0rem 0.4rem;
    .pdf {
      margin-bottom: 0.693rem;
    }
  }

  .hiddenWrapper {
    display: none;
  }

  .discoverContent {
    padding: 0;
  }

  .component-upAndDown {
    margin-top: 0.48rem;
    margin-bottom: 0.48rem;
  }

  .commentTitle {
    padding-bottom: 0.266rem;
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

