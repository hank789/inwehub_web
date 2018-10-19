<template>
  <div>

    <!-- 问答 -->
    <div class="container-feed-questionAnswer feed-currency" @tap.stop.prevent="toDetail(item)" v-if="isAsk">
      <FeedUserInfo
        :uuid="item.user.uuid"
        :avatar="item.user.avatar"
        :realname="item.title"
        :isShowPositionAndCompany="false"
        :isExpert="item.user.is_expert?1:0"
        :time="item.created_at"
      ></FeedUserInfo>
      <div class="currency-title question-titles" v-if="item.feed.answer_content">{{item.feed.answer_content}}</div>
      <div class="question-statistics">
        <span class="question-price active-yellow" v-if="item.feed.status_description">{{item.feed.status_description}}</span>
        <span v-if="answerNumber >=0 ">{{answerNumber}}回答 <i></i> </span>
        <span v-if="followNumber >=0 ">{{followNumber}}关注</span>
        <span v-if="supportNumber >=0 ">{{supportNumber}}赞 <i></i> </span>
        <span v-if="commentNumber >=0 ">{{commentNumber}}回复</span>
        <span v-if="averageRate >=0 "> <i></i> {{averageRate}}分</span>
      </div>
      <div class="container-answer-box">
        <div class="question-answer-box">
          <span>{{item.feed.status_description}}</span>
          <span><i v-for="(tag, tagIndex) in item.feed.tags" :key="tagIndex" @tap.stop.prevent="toTagDetail(tag.name)">#{{tag.name}}#</i>{{item.feed.question_title}}</span>
        </div>
      </div>

      <div class="line-river-after line-river-after-top"></div>
    </div>

    <!-- 分享 -->
    <div class="container-feed-item feed-currency" v-if="isDiscover" @tap.stop.prevent="toDetail(item)">
      <FeedUserInfo
        :uuid="item.user.uuid"
        :avatar="item.user.avatar"
        :realname="item.title"
        :isShowPositionAndCompany="false"
        :isExpert="item.user.is_expert?1:0"
        :time="item.created_at"
        :showSetTop="item.top"
      ></FeedUserInfo>
      <div class="feed-address" v-if="item.feed.current_address_name">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dingwei1"></use>
        </svg>
        {{item.feed.current_address_name}}
      </div>
      <div class="currency-title text-line-5 feed-title"><div>{{item.feed.title}}</div></div>
      <div class="feed-open-all font-family-medium" @tap.stop.prevent="extendAll">展开全部</div>
      <!--图片-->
      <div v-if="itemObj.feed.img.length && item.feed.submission_type !== 'link'"
           class="container-images container-images-discover" :class="'container-images-' + (itemObj.feed.img.length)">
        <div v-for="img in itemObj.feed.img" class="container-image"><img :src="img"></div>
      </div>
      <!--链接-->
      <div class="container-feed-link-box">
        <div class="feed-link-box" v-if="item.feed.submission_type === 'link'">
          <div class="linkImg lazyImg"><img class="lazyImg" v-lazy="item.feed.img"></div>
          <div class="linkText">
            <span class="font-family-medium text-line-2">{{item.feed.article_title}}</span>
            <span>{{item.feed.domain}}</span>
          </div>
        </div>
      </div>
      <!--PDF-->
      <div class="container-pdf-box">
        <div class="feed-pdf-box" v-if="itemObj.feed.files.length" v-for="(pdf, pdfIndex) in itemObj.feed.files"
             :key="pdfIndex">
          <div class="pdfIcon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pdf"></use>
            </svg>
          </div>
          <div class="pdfText">
            <span class="font-family-medium text-line-2">{{pdf.name}}</span>
          </div>
        </div>
      </div>
      <!--圈子-->
      <div class="feed-group" v-if="item.feed.group && item.feed.group.name" @tap.stop.prevent="toGroupDetail(item.feed.group)">
        <img src="../statics/images/feed-group@3x.png" alt="">
        <span>{{item.feed.group.name}}</span>
      </div>
      <!--操作区-->
      <div class="feed-moreOperation">
        <div class="feed-mord" @tap.stop.prevent="showItemMore">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gengduo1"></use>
          </svg>
        </div>
        <div class="feed-operation">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pinglun"></use>
            </svg>{{item.feed.comment_number}}
          </span>
          <span @tap.stop.prevent="discoverDown()" :class="item.feed.is_downvoted ? 'activeSpan':''">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-cai"></use>
            </svg>{{item.feed.downvote_number}}
          </span>
          <span @tap.stop.prevent="discoverUp()" :class="item.feed.is_upvoted ? 'activeSpan':''">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zan"></use>
            </svg>{{item.feed.support_number}}
          </span>
        </div>
      </div>

      <div class="line-river-after line-river-after-top"></div>
    </div>
  </div>
</template>

<script>
  import FeedUserInfo from './feed/FeedUserInfo'
  import userAbility from '../utils/userAbility'
  import { upvote, downVote } from '../utils/discover'
  import PageMore from './PageMore.vue'
  import { getTextDiscoverDetail, getAskCommunityInteractionDetail } from '../utils/shareTemplate'

  export default {
    data () {
      return {
        shareOption: {},
        isUpvote: ''
      }
    },
    components: {
      FeedUserInfo,
      PageMore
    },
    computed: {
      isAsk () {
        switch (this.item.feed_type) {
          case 1:
          case 2:
          case 3:
          case 6:
          case 11:
          case 12:
          case 14:
            return true
          default:
            return false
        }
      },
      isDiscover () {
        switch (this.item.feed_type) {
          case 15:
          case 16:
          case 5:
            return true
          default:
            return false
        }
      },
      itemObj () {
        var item = this.item
        if (typeof item.feed.img === 'string') {
          if (item.feed.img) {
            item.feed.img = [item.feed.img]
          } else {
            item.feed.img = []
          }
        }

        if (typeof item.feed.files === 'string') {
          if (item.feed.files) {
            item.feed.files = [item.feed.files]
          } else {
            item.feed.files = []
          }
        }
        return item
      },
      commentNumber () {
        if (this.item.feed.answer_id) {
          return this.item.feed.comment_number
        }
        return -1
      },
      answerNumber () {
        if (!this.item.feed.answer_id) {
          return this.item.feed.answer_number
        }
        return -1
      },
      supportNumber () {
        if (this.item.feed.answer_id) {
          return this.item.feed.support_number
        }
        return -1
      },
      followNumber () {
        if (!this.item.feed.answer_id) {
          return this.item.feed.follow_number
        }
        return -1
      },
      averageRate () {
        if (this.item.feed.average_rate) {
          return this.item.feed.average_rate
        }
        return -1
      }
    },
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    mounted () {
      var titles = document.querySelectorAll('.currency-title')
      titles.forEach((item) => {
        if (item.scrollHeight > item.offsetHeight) {
          item.nextElementSibling.classList.add('showOpenAll')
        }
      })
    },
    methods: {
      showItemMore () {
        if (this.isDiscover) {
          this.shareOption = getTextDiscoverDetail(
            this.item.feed.comment_url,
            this.item.feed.title,
            this.item.user.avatar,
            this.item.user.name
          )
        }

        if (this.isAsk) {
          this.shareOption = getAskCommunityInteractionDetail(
            this.id,
            this.item.title,
            this.item.user.name
          )
        }

        this.$emit('showItemMore', this.shareOption, this.item)
      },
      discoverUp () {
        upvote(this, this.item.feed.submission_id, (response) => {
          this.item.feed.support_number++
          this.item.feed.is_upvoted = response.data.data.support_percent
        }, (response) => {
          this.item.feed.support_number--
          this.item.feed.is_upvoted = response.data.data.support_percent
        })
      },
      discoverDown () {
        downVote(this, this.item.feed.submission_id, (response) => {
          this.item.feed.downvote_number++
          this.item.feed.is_downvoted = response.data.data.support_percent
        }, (response) => {
          this.item.feed.downvote_number--
          this.item.feed.is_downvoted = response.data.data.support_percent
        })
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      extendAll (event) {
        event.target.previousElementSibling.classList.remove('text-line-5')
        event.target.style.display = 'none'
      },
      toGroupDetail (item) {
        this.$router.pushPlus('/group/detail/' + item.id)
      },
      toDetail (item) {
        switch (item.feed_type) {
          case 1:
          case 2:
          case 3:
          case 5:
          case 6:
          case 11:
          case 12:
          case 14:
          case 15:
          case 16:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
          case -1:
            // 已废弃
            var linkArticle = {
              view_url: item.url,
              id: item.feed.submission_id,
              title: item.feed.title,
              comment_url: item.feed.comment_url,
              img_url: item.feed.img
            }
            this.goArticle(linkArticle)
            break
          default:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
        }
      }
    }
  }
</script>

<style lang="less">
  .feed-currency {
    .line-river-after {
      margin-top: 10px;
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
    .currency-title {
      color: #444444;
      font-size: 0.373rem;
      line-height: 0.586rem;
      margin-top: -0.08rem;
    }
    .userInfoWrapper {
      padding: 0 0.426rem !important;
      .mui-media-body {
        margin-left: 1.013rem;
        color: #444444;
        font-size: 0.346rem;
        font-family: PingFangSC-Medium;
        .detail {
          color: #B4B4B6;
          font-size: 0.293rem;
          font-family: PingFangSC-Regular;
        }
      }
    }
  }

  .container-feed-item {
    position: relative;
    margin-top: 0.533rem;
    .feed-address {
      color: #B4B4B6;
      font-size: 0.293rem;
      position: absolute;
      top: 0.426rem;
      left: 2.986rem;
    }
    .feed-title {
      padding: 0 0.426rem;
    }
    .feed-open-all {
      color: #03AEF9;
      font-size: 0.346rem;
      margin-top: 0.106rem;
      display: none;
      padding: 0 0.426rem;
      &.showOpenAll {
        display: block;
      }
    }

    .container-images {
      padding: 0.266rem .4rem 0;

    }
    .container-feed-link-box {
      padding: 0 0.426rem;
      .feed-link-box {
        background: #F7F8FA;
        border-radius: 0.106rem;
        padding: 0.186rem 0.266rem;
        display: flex;
        margin-top: 0.32rem;
        margin-bottom: 0.266rem;
        .linkImg {
          width: 1.173rem;
          height: 1.173rem;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0.106rem;
          }
        }
        .linkText {
          width: 7.173rem;
          margin-left: 0.266rem;
          span {
            &:nth-of-type(1) {
              width: inherit;
              color: #444444;
              font-size: 0.346rem;
              line-height: 0.533rem;
            }
            &:nth-of-type(2) {
              color: #B4B4B6;
              font-size: 0.293rem;
            }
          }
        }
      }
    }
    .container-pdf-box {
      padding: 0 0.426rem;
      .feed-pdf-box {
        background: #F7F8FA;
        border-radius: 0.106rem;
        padding: 0.186rem 0.266rem;
        display: flex;
        margin-top: 0.266rem;
        .pdfIcon {
          width: 1.173rem;
          height: 1.173rem;
          text-align: center;
          border-radius: 0.106rem;
          background: #DF6F5A;
          .icon {
            color: #ffffff;
            font-size: 0.906rem;
            margin-top: 0.133rem;
          }
        }
        .pdfText {
          width: 7.173rem;
          margin-left: 0.266rem;
          span {
            width: inherit;
            color: #444444;
            font-size: 0.346rem;
            line-height: 0.533rem;
          }
        }
      }
    }
    .feed-group {
      width: fit-content;
      height: 0.56rem;
      color: #444444;
      padding: 0 0.266rem;
      font-size: 0.293rem;
      line-height: 0.56rem;
      background: #F7F8FA;
      border-radius: 2.666rem;
      display: flex;
      margin-top: 0.266rem;
      margin-left: 16px;
      img {
        width: 0.293rem;
        height: 0.293rem;
        margin-top: 0.133rem;
        margin-right: 0.08rem;
      }
    }
    .feed-moreOperation {
      margin-top: 0.4rem;
      color: #808080;
      display: flex;
      padding: 0 13px;
      justify-content: space-between;
      .feed-mord {
        padding: 5px;
      }
      .feed-operation {
        span {
          padding: 5px;
          /*margin-left: 0.533rem;*/
          .icon {
            margin-right: 0.133rem;
          }
        }
        .activeSpan {
          color: #B4B4B6;
          .icon {
            color: #B4B4B6;
          }
        }
      }
    }
  }

  .container-feed-questionAnswer {
    position: relative;
    margin-top: 0.533rem;
    .question-titles {
      padding: 0 0.426rem;
    }
    .question-statistics {
      margin-top: 0.346rem;
      color: #B4B4B6;
      padding: 0 0.426rem;
      .question-price {
        &.active-yellow {
          color: #235280;
          background: #FCC816;
        }
        color: #808080;
        font-size: 0.266rem;
        line-height: 0.373rem;
        padding: 0.026rem 0.133rem;
        background: #DCDCDC;
        display: inline-block;
        border-radius: 0.106rem;
      }
      span {
        font-size: 0.293rem;
        i {
          width: 0.053rem;
          height: 0.053rem;
          background: #B4B4B6;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    .container-answer-box {
      padding: 0 0.426rem;
      .question-answer-box {
        width: 9.146rem;
        padding: 0.186rem 0.266rem;
        border-radius: 0.106rem;
        background: #F7F8FA;
        margin-top: 0.346rem;
        span {
          &:nth-of-type(1) {
            color: #808080;
            font-size: 0.266rem;
            padding: 0.026rem 0.133rem;
            line-height: 0.373rem;
            border-radius: 0.106rem;
            background: #DCDCDC;
            display: inline-block;
          }
          &:nth-of-type(2) {
            color: #808080;
            font-size: 0.346rem;
            line-height: 0.533rem;
            margin-left: -0.106rem;
            i {
              color: #235280;
              font-style: normal;
            }
          }
        }
      }
    }
  }
</style>
