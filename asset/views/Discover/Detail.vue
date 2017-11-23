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
      <div class="contentWrapper">{{ detail.title }}</div>

      <Images v-if="detail.type === 'text'" :images="detail.data.img" class="newestList"></Images>

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

      <div class="river"></div>

      <Discuss
        :submissionSlug="detail.slug"
        :submissionId="detail.id"
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

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import UserInfo from './../../components/question-detail/UserInfo.vue'
  import Images from '../../components/image/Images.vue'
  import Statistics from './../../components/discover/Statistics.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import { autoTextArea } from '../../utils/plus'
  import Share from '../../components/Share.vue'
  import { getTextDiscoverDetail } from '../../utils/shareTemplate'

  export default {
    data () {
      return {
        slug: '',
        noback: false,
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
      Share
    },
    methods: {
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
      supportNumAdd () {
        this.detail.upvotes++
      },
      supportNumDesc () {
        this.detail.upvotes--
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
    background: #fff;
    white-space: pre;
    font-size:15px;
    color:#444;
  }

  .newestList{
    padding:10px 15px 0;
    background: #fff;
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
</style>
