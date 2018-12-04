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
      <div class="currency-title question-titles">{{ item.feed.answer_id?item.feed.answer_content:item.feed.question_title }}</div>
      <div class="question-statistics">
        <span class="question-price active-yellow" v-if="item.feed.status_description && !item.feed.answer_id">{{item.feed.status_description}}</span>
        <span v-if="answerNumber >=0 ">{{answerNumber}}回答 <i></i> </span>
        <span v-if="followNumber >=0 ">{{followNumber}}关注</span>
        <span v-if="supportNumber >=0 ">{{supportNumber}}赞 <i></i> </span>
        <span v-if="commentNumber >=0 ">{{commentNumber}}回复</span>
        <span v-if="averageRate >=0 "> <i></i> {{averageRate}}分</span>
      </div>
      <div class="container-answer-box" v-if="item.feed.answer_id">
        <div class="question-answer-box">
          <span class="answerPriceBJ" v-if="item.feed.status_description">{{item.feed.status_description}}</span>
          <span class="tagsAndQuestionTitle"><i v-for="(tag, tagIndex) in item.feed.tags" :key="tagIndex" @tap.stop.prevent="toTagDetail(tag.name)">#{{tag.name}}#</i>{{item.feed.question_title}}</span>
        </div>
      </div>

      <div class="line-river-after line-river-after-top"></div>
    </div>

    <!-- 分享 -->
    <div @tap.capture="onTap($event)">
      <div class="container-feed-item feed-currency" v-if="isDiscover" @tap.stop.prevent="toDetail(item)">
        <FeedUserInfo
          :uuid="item.user.uuid"
          :avatar="item.user.avatar"
          :realname="item.title"
          :isShowPositionAndCompany="false"
          :isExpert="item.user.is_expert?1:0"
          :time="item.created_at"
          :address="item.feed.current_address_name"
          :showSetTop="item.top"
        ></FeedUserInfo>
        <div class="currency-title text-line-5 feed-title"><div>{{item.feed.title}}</div></div>
        <div class="feed-open-all font-family-medium" @tap.stop.prevent="extendAll">展开全部</div>
        <!--图片-->
        <div v-if="itemObj.feed.img.length && item.feed.submission_type !== 'link'"
             class="container-images container-images-discover" :class="'container-images-' + (itemObj.feed.img.length)">
          <div v-for="img in itemObj.feed.img" class="container-image"><ImageView :src="img" :isLazyload="true" width="108" height="108"></ImageView></div>
        </div>
        <!--链接-->
        <div class="container-feed-link-box" v-if="item.feed.submission_type === 'link'" @tap.stop.prevent="goArticle()">
          <div class="feed-link-box">
            <div class="linkImg"><ImageView :src="item.feed.img" :isLazyload="true" width="44" height="44"></ImageView></div>
            <div class="linkText">
              <span class="font-family-medium text-line-2">{{item.feed.article_title}}</span>
              <span>{{item.feed.domain}}</span>
            </div>
          </div>
        </div>
        <!--PDF-->
        <div class="container-pdf-box" v-if="itemObj.feed.files.length" >
          <div class="feed-pdf-box"v-for="(pdf, pdfIndex) in itemObj.feed.files" :key="pdfIndex">
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
        <div class="feed-group" :class="itemObj.feed.img.length ? 'moveUp':''" @tap.stop.prevent="toGroupDetail(item.feed.group)">
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
            <span @tap.stop.prevent="$router.pushPlus('/comment/' + item.feed.comment_url.replace('/c/', '') + '/' + item.feed.submission_id)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-pinglun"></use>
              </svg><i v-if="item.feed.comment_number">{{item.feed.comment_number}}</i>
            </span>
            <span @tap.stop.prevent="discoverDown()" :class="item.feed.is_downvoted ? 'activeSpan':''">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-cai"></use>
              </svg><i v-if="item.feed.downvote_number">{{item.feed.downvote_number}}</i>
            </span>
            <span @tap.stop.prevent="discoverUp()" :class="item.feed.is_upvoted ? 'activeSpan':''">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zan"></use>
              </svg><i v-if="item.feed.support_number">{{item.feed.support_number}}</i>
            </span>
          </div>
        </div>

        <div class="line-river-after line-river-after-top"></div>
      </div>
    </div>

    <!--点评-->
    <div class="commentList" v-if="isComment" @tap.stop.prevent="toDetail(item)">
      <div class="commentUser">
        <div class="userInfo">
          <div class="avatar">
            <ImageView :src="item.user.avatar" :isLazyload="true" width="34" height="34"></ImageView>
          </div>
          <div class="userName">
            <div class="userNameTop">
              <span class="font-family-medium">{{ item.title }}</span>
              <div class="border-football" v-if="item.feed.is_recommend">优质</div>
            </div>

            <div class="time">{{ item.created_at }}</div>
          </div>
        </div>
        <div class="mark font-family-medium">{{ item.feed.rate_star }}分</div>
      </div>
      <div class="commentFeedTitle text-line-5 currency-title">{{ item.feed.title }}</div>
      <div class="feed-open-all font-family-medium"  @tap.stop.prevent="extendAll">展开全部</div>

      <div v-if="itemObj.feed.img.length && item.feed.submission_type === 'review'"
           class="container-images container-images-discover" :class="'container-images-' + (itemObj.feed.img.length)">
        <div v-for="img in itemObj.feed.img" class="container-image"><ImageView :src="img" :isLazyload="true" width="108" height="108"></ImageView></div>
      </div>

      <div class="link" v-if="item.feed.tags && isShowLink">
        <div class="linkBox" @tap.stop.prevent="goProductDetail()">
          <span class="linkIimg" v-if="!item.feed.tags[0].logo">
            <svg class="icon" aria-hidden="true" >
              <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
            </svg>
          </span>
          <div class="productLogo border-football" v-else>
            <ImageView :src="item.feed.tags[0].logo" :isLazyload="true" width="45" height="45"></ImageView>
          </div>
          <div class="linkContent">
            <div v-if="item.feed.tags[0].name" class="text-line-1">{{item.feed.tags[0].name}}</div>
            <span v-else class="seat"></span>
            <div class="mark">
              <div class="stars">
                <StarView :rating="item.feed.tags[0].review_average_rate"></StarView>
              </div>
              <div class="text">{{ item.feed.tags[0].review_average_rate }}分</div><i></i>
              <div class="comment">{{item.feed.tags[0].reviews}}条评论</div>
            </div>
          </div>
        </div>
      </div>

      <div class="feed-moreOperation">
        <div class="feed-mord"  @tap.stop.prevent="showItemMore">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gengduo1"></use>
          </svg>
        </div>
        <div class="feed-operation">
            <span @tap.stop.prevent="$router.pushPlus('/comment/' + item.feed.comment_url.replace('/c/', '') + '/' + item.feed.submission_id)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-pinglun"></use>
              </svg><i v-if="item.feed.comment_number">{{item.feed.comment_number}}</i>
            </span>
          <span @tap.stop.prevent="discoverDown()" :class="item.feed.is_downvoted ? 'activeSpan':''">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-cai"></use>
              </svg><i v-if="item.feed.downvote_number">{{item.feed.downvote_number}}</i>
            </span>
          <span @tap.stop.prevent="discoverUp()" :class="item.feed.is_upvoted ? 'activeSpan':''">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zan"></use>
              </svg><i v-if="item.feed.support_number">{{item.feed.support_number}}</i>
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
  import { goThirdPartyArticle } from '../utils/webview'
  import { openAppUrlByUrl } from '../utils/plus'
  import { getDianpingCommentDetail, getTextDiscoverDetail, getAskCommunityInteractionDetail } from '../utils/shareTemplate'
  import { postRequest } from '../utils/request'
  import StarView from '../components/star-rating/starView.vue'

  export default {
    data () {
      return {
        shareOption: {},
        isUpvote: ''
      }
    },
    components: {
      FeedUserInfo,
      PageMore,
      StarView
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
      isComment () {
        switch (this.item.feed_type) {
          case 17:
            return true
          default:
            return false
        }
      },
      itemObj () {
        var item = JSON.parse(JSON.stringify(this.item))
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
      },
      isShowLink: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.renderShowOpenAll()
    },
    updated () {
      this.$nextTick(() => {
        this.renderShowOpenAll()
      })
    },
    methods: {
      goProductDetail () {
        this.$router.pushPlus('/dianping/product/' + encodeURIComponent(this.item.feed.tags[0].name))
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      renderShowOpenAll () {
        var titles = document.querySelectorAll('.currency-title')
        titles.forEach((item) => {
          if (item.scrollHeight > item.offsetHeight) {
            item.nextElementSibling.classList.add('showOpenAll')
          } else {
            item.nextElementSibling.classList.remove('showOpenAll')
          }
        })
      },
      async onTap (event) {
        if (this.item.feed.group && this.item.feed.group.id) {
          if (this.item.isPass) {
            this.item.isPass = false
            return
          }

          event.stopPropagation()
          event.preventDefault()

          var groupId = this.item.feed.group.id
          await postRequest(`group/detail`, {id: groupId}).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }
            var data = response.data.data

            if (data.is_joined !== 1 && data.is_joined !== 3) {
              userAbility.inviteJoinInGroup(this.$parent, groupId, () => {
                this.item.isPass = true
                window.mui.trigger(event.target, 'tap')
              })
            } else {
              this.item.isPass = true
              window.mui.trigger(event.target, 'tap')
            }
          })
        }
      },
      goArticle: function () {
        var item = this.item
        if (item.feed.submission_type !== 'link') {
          return
        }

        if (item.feed.link_url.indexOf(process.env.H5_ROOT) === 0) {
          openAppUrlByUrl(item.feed.link_url)
        } else {
          goThirdPartyArticle(
            item.feed.link_url,
            item.submission_id,
            item.feed.article_title,
            item.feed.comment_url,
            item.feed.img
          )
        }
      },
      showItemMore () {
        if (this.isDiscover) {
          this.shareOption = getTextDiscoverDetail(
            this.item.feed.comment_url,
            this.item.feed.title,
            this.item.user.avatar,
            this.item.user.name,
            this.item.feed.group.name
          )
        }

        if (this.isAsk) {
          this.shareOption = getAskCommunityInteractionDetail(
            this.id,
            this.item.title,
            this.item.user.name
          )
        }

        if (this.isComment) {
          this.shareOption = getDianpingCommentDetail(
            this.item.feed.slug,
            this.item.feed.title,
            this.item.user.avatar,
            this.item.user.name,
            this.item.feed.rate_star
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
          case 17:
            this.$router.pushPlus('/dianping/comment/' + this.item.feed.slug, 'list-detail-page')
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
      margin-top: 0.266rem;
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
    .currency-title {
      color: #444444;
      font-size: 0.373rem;
      line-height: 0.586rem;
      margin-top: 0.026rem;
      letter-spacing: 0.013rem;
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
      margin-top: 0.213rem;
      display: none;
      padding: 0 0.426rem;
      line-height: 0.48rem;
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
        padding: 0.266rem;
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
              letter-spacing: 0.013rem;
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
        padding: 0.266rem 0.266rem;
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
            letter-spacing: 0.013rem;
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
      margin-left: 0.426rem;
      &.moveUp {
        margin-top: 0.133rem;
      }
      img {
        width: 0.293rem;
        height: 0.293rem;
        margin-top: 0.133rem;
        margin-right: 0.08rem;
      }
    }
    .feed-moreOperation {
      margin-top: 0.266rem;
      color: #808080;
      display: flex;
      padding: 0 0.346rem;
      justify-content: space-between;
      .feed-mord {

        padding: 0.133rem;
        color: #808080;
      }
      .feed-operation {
        span {
          padding: 0.133rem 0.266rem;
          font-size: 0.293rem;
          color: #444444;
          /*margin-left: 0.533rem;*/
          .icon {
            margin-right: 0.133rem;
            color: #808080;
            font-size: 0.4rem;
          }
          i {
            font-style: normal;
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
    .line-river-after {
      margin-top: 0.4rem;
    }
    .question-titles {
      padding: 0 0.426rem;
    }
    .question-statistics {
      margin-top: 0.186rem;
      color: #B4B4B6;
      padding: 0 0.426rem;
      line-height: 0.4rem;
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
        .answerPriceBJ {
          color: #235280;
          font-size: 0.266rem;
          padding: 0.026rem 0.133rem;
          line-height: 0.373rem;
          border-radius: 0.106rem;
          background: #FCC816;
          display: inline-block;
        }
        .tagsAndQuestionTitle {
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

  /*点评样式*/

  .commentList {
    margin-top: 0.533rem;
    .line-river-after {
      margin-top: 0.266rem;
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
    .container-images {
      margin-top: 0.266rem;
    }
    .commentUser {
      display: flex;
      padding: 0 0.426rem;
      justify-content: space-between;
      .userInfo {
        display: flex;
        .avatar {
          width: 0.906rem;
          height: 0.906rem;
          margin-right: 0.213rem;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        .userName {
          /*margin-top: -0.053rem;*/
          .border-football {
            &:after {
              border-radius: 0.213rem;
              border-color: #FA4975;
            }
          }
          .userNameTop {
            display: flex;
            div {
              height: 0.4rem;
              color: #FA4975;
              font-size: 0.266rem;
              padding: 0 0.133rem;
              line-height: 0.4rem;
              margin-left: 0.08rem;
              /*display: inline-block;*/
            }
          }
          span {
            &:nth-of-type(1) {
              color: #444444;
              font-size: 0.346rem;
              line-height: 0.493rem;
            }
            &:nth-of-type(2) {

            }
          }
          .time {
            color: #B4B4B6;
            font-size: 0.293rem;
            line-height: 0.4rem;
            margin-top: 0.053rem;
          }
        }
      }
      .mark {
        color: #FCC816;
        font-size: 0.346rem;
        line-height: 0.493rem;
      }
    }
    .commentFeedTitle {
      padding: 0 0.426rem;
      color: #444444;
      font-size: 0.373rem;
      line-height: 0.586rem;
      margin-top: 0.16rem;
      letter-spacing: 0.013rem;
    }
    .feed-open-all {
      color: #03AEF9;
      font-size: 0.346rem;
      margin-top: 0.213rem;
      display: none;
      padding: 0 0.426rem;
      line-height: 0.48rem;
      &.showOpenAll {
        display: block;
      }
    }
    .feed-moreOperation {
      margin-top: 0.266rem;
      color: #808080;
      display: flex;
      padding: 0 0.346rem;
      margin-bottom: 0.266rem;
      justify-content: space-between;
      .feed-mord {

        padding: 0.133rem;
        color: #808080;
      }
      .feed-operation {
        padding-top: 0.133rem;
        span {
          padding: 0.133rem 0.266rem;
          font-size: 0.293rem;
          color: #444444;
          /*margin-left: 0.533rem;*/
          .icon {
            margin-right: 0.133rem;
            color: #808080;
            font-size: 0.4rem;
          }
          i {
            font-style: normal;
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
  .link {
    padding: 0.266rem 0.426rem 0;
    /*margin-bottom: 0.466rem;*/
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
          }
          .comment {
            color: #B4B4B6;
            font-size: 0.293rem;
          }
        }
      }
    }
    .mark {
      display: flex;
      padding: 0 0.426rem;
      margin-top: -0.213rem;
      margin-bottom: 0.186rem;
      .stars {
        color: #FCC816;
      }
      .text {
        color: #FCC816;
        font-size: 0.293rem;
        margin-top: 0.053rem;
        margin-left: 0.08rem;
      }
    }
  }
</style>
