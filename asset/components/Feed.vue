<template>
  <div>
    <!-- 问答 -->
    <div class="container-feed-questionAnswer feed-currency" v-if="list.feed_type <= 3 || list.feed_type === 6 || list.feed_type === 11 || list.feed_type === 12 || list.feed_type === 14">
      <UserInfo
      :uuid="list.user.uuid"
      :avatar="list.user.avatar"
      :realname="list.title"
      :isFollow="isFollow"
      :isShowPositionAndCompany="false"
      :isExpert="list.user.is_expert?1:0"
      :time="list.created_at"
      :setFollowStatus="setFollowStatus"
      ></UserInfo>
      <div class="currency-title">{{list.feed.answer_content}}</div>
      <div class="question-statistics">
        <span>{{list.feed.status_description}}</span>
        <span>{{list.feed.comment_number}}回答 · {{list.feed.follow_number}}关注</span>
        <span>{{list.feed.comment_number}}评论 · {{list.feed.support_number}}赞 · 4.7分</span>
      </div>
      <div class="question-answer-box">
        <span>{{list.feed.status_description}}</span>
        <span><i v-for="(item, index) in list.feed.tags" :key="index">#{{item.name}}#</i>{{list.feed.question_title}}</span>
      </div>

      <div class="line-river-after line-river-after-top"></div>
    </div>
    <!-- 分享 -->
    <div class="container-feed-list feed-currency" v-if="list.feed_type === 15 || list.feed_type === 16 || list.feed_type === 5">
      <UserInfo
        :uuid="list.user.uuid"
        :avatar="list.user.avatar"
        :realname="list.title"
        :isFollow="isFollow"
        :isShowPositionAndCompany="false"
        :isExpert="list.user.is_expert?1:0"
        :time="list.created_at"
        :setFollowStatus="setFollowStatus"
      ></UserInfo>
      <div class="feed-address" v-if="list.feed.current_address_name">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dingwei1"></use>
        </svg>{{list.feed.current_address_name}}
      </div>
      <div class="currency-title">{{list.feed.title}}</div>
      <div class="feed-open-all font-family-medium">展开全部</div>
      <!--图片-->
      <div v-if="typeof(list.feed.img) === 'object' && list.feed_type === 15" class="container-images container-images-discover">
        <div v-for="img in list.feed.img" class="container-image"><img :src="img"></div>
      </div>
      <div class="container-image lazyImg" v-if="list.feed_type === 15 && typeof(list.feed.img) === 'string'">
        <img class="lazyImg" v-lazy="list.feed.img">
      </div>
      <!--链接-->
      <div class="feed-link-box" v-if="list.feed_type === 16 && list.feed.submission_type === 'link'">
        <div class="linkImg lazyImg"><img class="lazyImg" v-lazy="list.feed.img"></div>
        <div class="linkText">
          <span class="font-family-medium text-line-2">{{list.feed.article_title}}</span>
          <span>{{list.feed.domain}}</span>
        </div>
      </div>
      <!--PDF-->
      <div class="feed-pdf-box" v-if="list.feed_type === 15 && list.feed.files" v-for="(item, index) in list.feed.files" :key="index">
        <div class="pdfIcon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-pdf"></use>
          </svg>
        </div>
        <div class="pdfText">
          <span class="font-family-medium text-line-2">{{item.name}}</span>
        </div>
      </div>

      <div class="feed-group" v-if="list.feed.group.name">
        <img src="../statics/images/feed-group@3x.png" alt="">
        <span>{{list.feed.group.name}}</span>
      </div>

      <div class="feed-moreOperation">
        <div class="feed-mord">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gengduo1"></use>
          </svg>
        </div>
        <div class="feed-operation">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pinglun"></use>
            </svg>{{list.feed.comment_number}}
          </span>
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-cai"></use>
            </svg>987
          </span>
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zan"></use>
            </svg>{{list.feed.support_number}}
          </span>
        </div>
      </div>

      <div class="line-river-after line-river-after-top"></div>
    </div>
  </div>
</template>

<script>
  import UserInfo from './question-detail/UserInfo'

  export default {
    data () {
      return {
        isFollow: false
      }
    },
    components: {
      UserInfo
    },
    props: {
      description: {
        type: String,
        default: '暂时还没有数据呀～'
      },
      list: {
        type: Object,
        default: {}
      }
    },
    mounted () {},
    methods: {
      setFollowStatus (status) {
        this.detail.is_followed_author = status
      }
    }
  }
</script>

<style lang="less">
  .feed-currency {
    .line-river-after {
      margin-top: 0.533rem;
    }
    .currency-title {
      color: #444444;
      font-size: 0.373rem;
      line-height: 0.586rem;
      margin-top: -0.08rem;
    }
    .userInfoWrapper {
      padding: 0 !important;
      .mui-media-body {
        margin-left: 1.013rem;
        color: #444444;
        font-size: 0.346rem;
        font-family:PingFangSC-Medium;
        .detail {
          color: #B4B4B6;
          font-size: 0.293rem;
          font-family:PingFangSC-Regular;
        }
      }
    }
  }
  .container-feed-list {
    position: relative;
    margin-top: 0.533rem;
    padding: 0 0.426rem;
    .feed-address {
      color: #B4B4B6;
      font-size: 0.293rem;
      position: absolute;
      top: 0.426rem;
      left: 2.986rem;
    }
    .feed-open-all {
      color: #03AEF9;
      font-size: 0.346rem;
      margin-top: 0.106rem;
    }
    .container-images {
      padding: 0.266rem 0 0;
      &.container-images-discover {
        .container-image {
          width: 2.96rem;
          height: 2.96rem;
          margin-right: 0.133rem;
          margin-bottom: 0.133rem;
          &:nth-of-type(3n) {
            margin-right: 0;
          }
        }
      }
    }
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
    .feed-pdf-box {
      background: #F7F8FA;
      border-radius: 0.106rem;
      padding: 0.186rem 0.266rem;
      display: flex;
      margin-bottom: 0.266rem;
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
      justify-content: space-between;
      .feed-mord {

      }
      .feed-operation {
        span {
          margin-left: 0.533rem;
          .icon {
            margin-right: 0.133rem;
          }
        }
      }
    }
  }

  .container-feed-questionAnswer {
    position: relative;
    margin-top: 0.533rem;
    padding: 0 0.426rem;
    .question-statistics {
      margin-top: 0.346rem;
      color: #B4B4B6;
      span {
        font-size: 0.293rem;
        &:nth-of-type(1) {
          color: #235280;
          font-size: 0.266rem;
          line-height: 0.373rem;
          padding: 0.026rem 0.133rem;
          background: #FCC816;
          display: inline-block;
          border-radius: 0.106rem;
        }
      }
    }
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
</style>
