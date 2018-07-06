<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" v-show="!noback"></a>
      <h1 class="mui-title" v-text="title"></h1>
    </header>

    <div class="mui-content" v-show="!loading">
      <div v-if="isShow(detail.group.public, detail.group.is_joined)">

        <div class="topImg" v-if="detail.type === 'article' && detail.data.img">
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
            @setFollowStatus="setFollowStatus"
          ></UserInfo>

          <div class="discover_datail_dalete" @tap.stop.prevent="deleterow(detail.id)" v-if="userId == detail.owner.id">
            删除
          </div>

          <div class="timeData">
            <span>
              <timeago :since="timeago(detail.created_at)" :auto-update="60"></timeago>
            </span>
          </div>

          <div class="detailTitle" v-if="detail.type === 'article' && detail.title">{{detail.title}}</div>

          <div class="line-river"></div>

          <!-- 来自 -->
          <div class="from">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wodequanzi-shouye"></use>
            </svg>
            <div class="text-line-1">来自<span @tap="toDetail(detail.group)">{{detail.group.name}}</span></div>
          </div>

          <div class="discoverContentWrapper">
            <div class="contentWrapper quillDetailWrapper" id="contentWrapper">
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

            <div class="container-pdf-list" v-if="detail.type === 'text' && detail.data.files && detail.data.files.length">
              <div class="pdf" v-for="(pdf, index) in detail.data.files" :key="index" @tap.stop.prevent="seePdf(pdf)"><span class="text-line-2">{{pdf.name}}</span></div>
            </div>


            <div class="linkWrapper Column" v-if="detail.type === 'text' && detail.data.img && detail.data.img.length">
              <template v-for="(image, index) in detail.data.img">
                <img class="discover_img lazyImg" :id="'image_' + index" v-lazy="image" :data-preview-src="image"
                     :data-preview-group="1"/>
              </template>
            </div>
          </div>

          <div class="groups"  v-if="typeDesc(detail.group.is_joined)"
               @tap.stop.prevent="$router.pushPlus('/group/detail/' + detail.group.id)">加入圈子阅读全部内容
          </div>

          <!-- 新增链接样式 -->
          <div class="link" v-if="detail.type === 'link' && detail.data.url">
            <div class="linkBox" @tap.stop.prevent="goArticle(detail)">
              <span class="linkIimg" v-if="!detail.data.img">
                <svg class="icon" aria-hidden="true" >
                  <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
                </svg>
              </span>
              <img class="lazyImg" v-lazy="detail.data.img" v-else>
              <div class="linkContent">
                {{detail.data.title}}
                <div>{{detail.data.url}}</div>
              </div>
            </div>
          </div>

          <div class="timeContainer">
            <span>{{detail.views}}浏览</span>
            <!-- <span>
              <timeago :since="timeago(detail.created_at)" :auto-update="60"></timeago>
            </span> -->
            <span>著作权归作者所有</span>
          </div>

          <!-- 关联问答 -->
          <div class="answer" v-if="detail.related_question">
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

          <!-- 分享 -->
          <div class="share">
            <div class="location" v-show="detail.data.current_address_name">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dingwei1"></use>
              </svg>
              <span>{{detail.data.current_address_name}}</span>
            </div>
            <div class="shareGo">
              <P>分享到</P>
              <div class="shareList">
                <ul>
                  <li @tap.stop.prevent="weChatFriend">
                    <img src="../../statics/images/wechat_@2x.png" />
                    <p>微信好友</p>
                  </li>
                  <li @tap.stop.prevent="weChatFriendGroup">
                    <img src="../../statics/images/page_1@2x.png" />
                    <p>朋友圈</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="address" v-show="detail.data.current_address_name">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dingwei1"></use>
            </svg>
            <span>{{detail.data.current_address_name}}</span>
          </div>
        </div>


        <div class="river" v-if="detail.supporter_list.length"></div>

        <!--点赞-->
        <div class="component-dianzanList" v-if="detail.upvotes">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dianzan1"></use>
          </svg>
          <span v-for="(item, index) in detail.supporter_list" :key="index"
                @tap.stop.prevent="toAvatar(item.uuid)">{{item.name}}</span>等{{detail.upvotes}}人
        </div>

        <div class="river"></div>

        <RecommendList :id="slug" v-if="noback && slug"></RecommendList>

        <div class="river" v-if="noback && slug"></div>

        <Discuss
          v-if="detail.slug"
          :listApi="'article/comments'"
          :listParams="{'submission_slug': detail.slug, sort: 'hot'}"
          :storeApi="'article/comment-store'"
          :storeParams="{'submission_id': detail.id}"
          @comment="comment"
          @commentFinish="commentFinish"
          @delCommentSuccess="delCommentSuccess"
          ref="discuss"
        ></Discuss>
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
        <div class="riverBot"></div>
        <div class="groupsBot">
          <groups-list class="small detail"
                       :list="detail.group"
                       :type="'small'"
          ></groups-list>
        </div>
      </div>
    </div>


    <Share
      ref="ShareBtn"
      :title="shareOption.title"
      :link="shareOption.link"
      :shareName="shareOption.shareName"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :targetId="slug"
      :targetType="'submission'"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

    <FooterMenu
      :options="footerMenus"
      @clickedItem="footerMenuClickedItem"
    ></FooterMenu>
  </div>
</template>

<script>
  import {postRequest} from '../../utils/request'
  import UserInfo from './../../components/question-detail/UserInfo.vue'
  import Images from '../../components/image/Images.vue'
  import Statistics from './../../components/discover/Statistics.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import {autoTextArea, openVendorUrl, openAppUrl, openFileUrl} from '../../utils/plus'
  import Share from '../../components/Share.vue'
  import {getTextDiscoverDetail} from '../../utils/shareTemplate'
  import {goThirdPartyArticle} from '../../utils/webview'
  import {textToLinkHtml, transferTagToLink, scrollPage, addPreviewAttrForImg} from '../../utils/dom'
  import localEvent from '../../stores/localStorage'
  import RecommendList from '../../components/discover/RecommendList.vue'

  const currentUser = localEvent.getLocalItem('UserInfo')
  import commentTextarea from '../../components/comment/Textarea.vue'
  import {pageRefresh} from '../../utils/allPlatform'
  import groupsList from '../../components/groups/GroupsList.vue'
  import FooterMenu from '../../components/FooterMenu.vue'
  import userAbility from '../../utils/userAbility'
  import { quillEditor } from '../../components/vue-quill'

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
        userId: currentUser.user_id,
        name: currentUser.name,
        uuid: currentUser.uuid,
        slug: '',
        noback: false,
        title: '分享',
        oldTitle: '分享',
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
          shareName: ''
        },
        isFollow: true,
        loading: 1
      }
    },
    computed: {
      footerMenus () {
        return [
          {
            icon: '#icon-pinglun',
            text: '评论',
            number: this.detail.comments_number,
            disable: false,
            rightLine: true,
            isLight: false
          },
          {
            icon: '#icon-shoucangdilantongyi',
            text: '收藏',
            number: this.detail.bookmarks,
            disable: this.detail.is_bookmark,
            rightLine: true,
            isLight: false
          },
          {
            icon: '#icon-zan',
            text: '点赞',
            number: this.detail.upvotes,
            disable: this.detail.is_upvoted,
            rightLine: false,
            isLight: false
          },
          {
            icon: '#icon-shoucang-xiao',
            text: '分享',
            number: 0,
            disable: false,
            rightLine: false,
            isLight: true
          }
        ]
      },
      descLength () {
        if (this.description === this.descPlaceholder) {
          return 0
        }
        return this.description.length
      }
    },
    components: {
      UserInfo,
      Images,
      Statistics,
      Discuss,
      Share,
      commentTextarea,
      groupsList,
      FooterMenu,
      RecommendList,
      quillEditor
    },
    methods: {
      change (editor) {
        var html = editor.html
        html = textToLinkHtml(html)

        html = html.replace(/<a href="/g, "<span class='vendorUrl text-content' href=\"")
        html = html.replace(/<\/a>/g, '</span>')

        var answerContentWrapper = this.$el.querySelector('.discoverContent')
        html = addPreviewAttrForImg(html)
        html = html.replace(/(<p><br><\/p>)*$/, '')
        answerContentWrapper.innerHTML = html

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
        this.getDetail()
      },
      toDetail (item) {
        this.$router.pushPlus('/group/detail/' + item.id)
      },
      weChatFriend () {
        this.$refs.ShareBtn.shareToHaoyou()
      },
      weChatFriendGroup () {
        this.$refs.ShareBtn.shareToPengyouQuan()
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
      isShow (ispublic, type) {
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
      deleterow (id) {
        var btnArray = ['取消', '确定']
        window.mui.confirm('确定删除吗？', ' ', btnArray, (e) => {
          if (e.index === 1) {
            // 进行删除
            postRequest(`article/destroy-submission`, {
              id: id
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
        this.$refs.ctextarea.comment(commentTargetName)
      },
      commentFinish () {
        this.commentNumAdd()
        this.$refs.ctextarea.finish()
      },
      goArticle: function (detail) {
        if (detail.type !== 'link') {
          return
        }

        goThirdPartyArticle(
          detail.data.url,
          detail.id,
          detail.data.title,
          '/c/' + detail.category_id + '/' + detail.slug,
          detail.data.img
        )
      },
      refreshPageData () {
        this.detail.data.img = []
        this.getDetail()
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
      getDetail: function () {
        this.slug = this.$route.params.slug
        this.noback = !!this.$route.query.noback

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

          this.shareOption = getTextDiscoverDetail('/c/' + this.detail.category_id + '/' + this.detail.slug, this.detail.title, this.detail.owner.avatar, this.detail.owner.name, this.detail.group.name)

          if (this.detail.type === 'article') {
            var objs = JSON.parse(this.detail.data.description)
            if (this.editorReadObj) {
              this.editorReadObj.setContents(objs)
            }
          }

          this.loading = 0
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
      footerMenuClickedItem (item) {
        switch (item.icon) {
          case this.footerMenus[0].icon:
            // 评论
            this.$refs.discuss.rootComment()
            break
          case this.footerMenus[1].icon:
            // 收藏
            this.collect()
            break
          case this.footerMenus[2].icon:
            // 点赞
            this.support()
            break
          case this.footerMenus[3].icon:
            // 分享
            this.$refs.ShareBtn.share()
            break
        }
      },
      collect () {
        var data = {
          id: this.detail.id
        }

        postRequest(`article/bookmark-submission`, data).then(response => {
          var code = response.data.code
          if (code === 6108) {
            userAbility.alertGroups(this, response.data.data.group_id)
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
          window.mui.toast(response.data.message)
        })
      },
      support () {
        var data = {
          submission_id: this.detail.id
        }
        postRequest(`article/upvote-submission`, data).then(response => {
          var code = response.data.code
          if (code === 6108) {
            userAbility.alertGroups(this, response.data.data.group_id)
            return
          } else if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          if (response.data.data.type === 'cancel_upvote') {
            this.detail.upvotes--
            this.detail.is_upvoted = 0
            for (var i in this.detail.supporter_list) {
              if (this.detail.supporter_list[i].uuid === this.uuid) {
                this.detail.supporter_list.splice(i, 1)
              }
            }
          } else {
            this.detail.upvotes++
            this.detail.is_upvoted = 1
            var support = {
              name: this.name,
              uuid: this.uuid
            }
            this.detail.supporter_list = this.detail.supporter_list.concat(support)
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
                'page_title': response.data.data.type !== 'upvote' ? 'cancel' : 'support',
                'referrer_page': ''
              }
            )
          }
          window.mui.toast(response.data.message)
        })
      },
      delCommentSuccess () {
        this.detail.comments_number--
      }
    },
    updated () {
      this.$nextTick(function () {
        if (this.isShow(this.detail.group.public, this.detail.group.is_joined)) {
          setTimeout(() => {
            this.shotContentHeight()
          }, 200)
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
      pageRefresh(this, () => {
        this.refreshPageData()
      })
      window.mui.previewImage()
      autoTextArea()
      scrollPage('.mui-content', () => {
        if (this.detail.type === 'article') {
          this.title = this.detail.title
        }}, () => {}, () => {}, () => {
        this.title = this.oldTitle
      })
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .topImg {
    margin-top: 0.266rem;
    img {
      width: 10rem;
      height: 5.333rem;
    }
  }
  .detailTitle {
    font-size: 0.506rem;
    line-height: 0.8rem;
    margin-top: -0.16rem;
    padding: 0rem 0.426rem 0.4rem;
    font-family:PingFangSC-Medium;
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

  .contentWrapper {
    padding: 0 0.4rem;
    white-space: pre-line !important;
    font-size: 0.426rem;
    color: #444;
    line-height: 0.693rem;
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
    padding: 0.266rem 0.4rem;
  }

  .timeContainer {
    width: 100%;
    font-size: 0.32rem;
    color: #B4B4B6;
    padding: 0 0.4rem;
    background: #fff;
    margin-top: 0.693rem;
  }

  .timeContainer span:nth-of-type(2) {
    float: right;
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
    bottom:1.333rem;
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
    margin-bottom: 0.133rem;
  }

  .Column img:nth-last-child(1) {
    margin-bottom: 0;
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
    top: 0.906rem;
    left: 1.6rem;
    font-size: 0.32rem;
    color: #C8C8C8;
    margin-top: -0.106rem;
  }
  // 来自
  .from {
    padding: 0 0.453rem;
    margin: 0.4rem 0;
    .icon {
      width: 0.533rem;
      height: 0.533rem;
      // vertical-align: middle;
    }
    div {
      width: 70%;
      font-size: 0.4rem;
      color: #B4B4B6;
      margin: 0rem;
      vertical-align: top;
      display: inline-block;
      font-family: "PingFangSC-Medium";
    }
    span {
      margin-left: 0.08rem;
      color: #235280;
    }
  }
  .share {
    padding: 0 0.453rem;
    .location {
      .icon {
        color: #C8C8C8;
        vertical-align: middle;
      }
    }
    span {
      margin-left: -0.106rem;
      font-size: 0.32rem;
      color: #808080;
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
          li{
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
    margin-top: 0.266rem;
    padding: 0 0.506rem 0 0.346rem;
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
      }
      .linkContent {
        font-size: 0.373rem;
        color: #808080;
        div {
          color: #B4B4B6;
          word-break: break-word;
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

    &:after{
      position: absolute;
      bottom:0;
      content:'';
      height:1.666rem;
      width:100%;
      background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,1));
    }
  }

  .container-pdf-list{
    padding:0.266rem 0.4rem;
  }

  .hiddenWrapper{
    display: none;
  }

  .discoverContent{
    padding:0;
  }
</style>

