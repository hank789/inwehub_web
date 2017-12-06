<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" v-show="!noback"></a>
      <h1 class="mui-title">动态</h1>
    </header>

    <div class="mui-content" v-show="!loading">
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
      </div>
      <div class="contentWrapper" id="contentWrapper" @tap.stop.prevent="goArticle(detail)"><span class="tags" v-for="(tag, index) in detail.tags" v-if="detail.tags.length">#{{tag.name}}</span><span v-html="textToLink(detail.title)"></span><span class="color-b4b4b6 font-12" v-if="detail.data.domain"> - {{detail.data.domain}}</span></div>

      <Images v-if="detail.type === 'text'" :images="detail.data.img" class="newestList"></Images>

      <div class="linkWrapper container-image" v-if="detail.type === 'link'" @tap.stop.prevent="goArticle(detail)">
        <img :src="detail.data.img"/>
      </div>

      <div class="timeContainer">
        <span>
          <timeago :since="timeago(detail.created_at)" :auto-update="60">
          </timeago>
        </span>
        <svg class="icon" aria-hidden="true" v-show="detail.data.current_address_name">
          <use xlink:href="#icon-dingwei1"></use>
        </svg>
        <span>{{detail.data.current_address_name}}</span>
      </div>

      <div class="statisticsWrapper">
        <Statistics
          :id="detail.id"
          :commentNum="detail.comments_number"
          :isCommented="!!detail.is_commented"
          :supportNum="detail.upvotes"
          :isSupported="!!detail.is_upvoted"
          :collectNum="detail.bookmarks"
          :isCollected="!!detail.is_bookmark"
          @supportNumDesc="supportNumDesc"
          @supportNumAdd="supportNumAdd"
          @setSupportStatus="setSupportStatus"
          @collectNumDesc="collectNumDesc"
          @collectNumAdd="collectNumAdd"
          @setCollectStatus="setCollectStatus"
        ></Statistics>
      </div>
      <!--点赞-->
      <div class="component-dianzanList" v-if="detail.supporter_list ? detail.supporter_list.length:0">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg>
        <span v-for="(item, index) in detail.supporter_list" @tap.stop.prevent="toAvatar(item.uuid)">{{item.name}}</span>等{{detail.supporter_list.length}}人
      </div>
      <!--灰色部分-->
      <div class="river"></div>
      <!--评论部分-->
      <Discuss
        v-if="detail.slug"
        :listApi="'article/comments'"
        :listParams="{'submission_slug': detail.slug, sort: 'hot'}"
        :storeApi="'article/comment-store'"
        :storeParams="{'submission_id': detail.id}"
        @comment="comment"
        @commentFinish="commentFinish"
        ref="discuss"
      ></Discuss>

    </div>

    <Share
      ref="ShareBtn"
      :title="shareOption.title"
      :link="shareOption.link"
      :shareName="shareOption.shareName"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import UserInfo from './../../components/question-detail/UserInfo.vue'
  import Images from '../../components/image/Images.vue'
  import Statistics from './../../components/discover/Statistics.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import { autoTextArea, openVendorUrl } from '../../utils/plus'
  import Share from '../../components/Share.vue'
  import { getTextDiscoverDetail } from '../../utils/shareTemplate'
  import { goThirdPartyArticle } from '../../utils/webview'
  import { textToLinkHtml } from '../../utils/dom'
  import localEvent from '../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')
  import commentTextarea from '../../components/comment/Textarea.vue'

  export default {
    data () {
      return {
        name: currentUser.name,
        uuid: currentUser.uuid,
        slug: '',
        noback: false,
        detail: {
          owner: {
            uuid: '',
            avatar: '',
            username: ''
          },
          supporter_list: [],
          data: {
            img: ''
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
      commentTextarea
    },
    methods: {
      textToLink (text) {
        return textToLinkHtml(text)
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
          detail.title,
          '/c/' + detail.category_id + '/' + detail.slug,
          detail.data.img
        )
      },
      refreshPageData () {
        this.getDetail()
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
            return
          }

          this.detail = response.data.data

          this.shareOption = getTextDiscoverDetail('/c/' + this.detail.category_id + '/' + this.detail.slug, this.detail.title, this.detail.owner.avatar, this.detail.owner.name)

          this.loading = 0
        })
      },
      setFollowStatus (status) {
        this.detail.is_followed_author = status
      },
//      点赞
      supportNumAdd () {
        this.detail.upvotes++
        var support = {
          name: this.name,
          uuid: this.uuid
        }
        this.detail.supporter_list = this.detail.supporter_list.concat(support)
      },
//      取消点赞
      supportNumDesc () {
        this.detail.upvotes--
        for (var i in this.detail.supporter_list) {
          if (this.detail.supporter_list[i].uuid === this.uuid) {
            this.detail.supporter_list.splice(i, 1)
          }
        }
      },
      commentNumAdd () {
        this.detail.comments_number++
      },
      commentNumDesc () {
        this.detail.comments_number--
      },
      setSupportStatus (type) {
        this.detail.is_upvoted = type === 'upvote' ? 1 : 0
      },
      collectNumAdd () {
        this.detail.bookmarks++
      },
      collectNumDesc () {
        this.detail.bookmarks--
      },
      setCollectStatus (type) {
        this.detail.is_bookmark = type === 'bookmarked' ? 1 : 0
      }
    },
    updated () {
      this.$nextTick(function () {
        openVendorUrl(this.$el.querySelector('#contentWrapper'))
      })
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getDetail()
    },
    mounted () {
      autoTextArea()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .detail-discover {
    padding-bottom: 0;
    margin-top: 0 !important;
  }

  .detail-discover:before {
    display: none;
  }

  .detail-discover:after {
    display: none;
  }

  .contentWrapper{
    padding:0 15px;
    white-space: pre-wrap !important;
    font-size:15px;
    color:#444;
  }
  .contentWrapper .tags{
    color:rgb(33,77,120);
    margin-right: 6px;
  }
  .newestList{
    padding:10px 15px 0;
    background: #fff;
  }

  .linkWrapper {
    padding:10px 15px;
  }

  .timeContainer {
    width: 100%;
    font-size: 12px;
    padding:0 15px;
    background: #fff;
  }

  .timeContainer svg {
    font-size: 14px;
    color: #b4b4b6;
  }

  .timeContainer span:nth-of-type(1) {
    color: #b4b4b6;
  }

  .timeContainer span:nth-of-type(2) {
    color: #808080;
  }

  .statistics{
    background: #fff;
  }

  .mui-content{
    background: #fff;
  }

  .statisticsWrapper{
    padding:0 15px 15px;
  }
  /*点赞样式*/
  .component-dianzanList{
    width:100%;
    padding: 0 15px 30px 15px;
  }
  .component-dianzanList span{
    font-size:13px;
    color:#03aef9;
  }
</style>
