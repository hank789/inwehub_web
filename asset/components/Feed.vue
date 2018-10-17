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
        <span>{{list.feed.comment_number}}评论 · {{item.feed.support_number}}赞 · 4.7分</span>
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
      margin-top: 20px;
    }
    .currency-title {
      color: #444444;
      font-size: 14px;
      line-height: 22px;
      margin-top: -3px;
    }
    .userInfoWrapper {
      padding: 0 !important;
      .mui-media-body {
        margin-left: 38px;
        color: #444444;
        font-size: 13px;
        font-family:PingFangSC-Medium;
        .detail {
          color: #B4B4B6;
          font-size: 11px;
          font-family:PingFangSC-Regular;
        }
      }
    }
  }
  .container-feed-list {
    position: relative;
    margin-top: 20px;
    padding: 0 16px;
    .feed-address {
      color: #B4B4B6;
      font-size: 11px;
      position: absolute;
      top: 16px;
      left: 112px;
    }
    .feed-open-all {
      color: #03AEF9;
      font-size: 13px;
      margin-top: 4px;
    }
    .container-images {
      padding: 10px 0 0;
      &.container-images-discover {
        .container-image {
          width: 111px;
          height: 111px;
          margin-right: 5px;
          margin-bottom: 5px;
          &:nth-of-type(3n) {
            margin-right: 0;
          }
        }
      }
    }
    .feed-link-box {
      background: #F7F8FA;
      border-radius: 4px;
      padding: 7px 10px;
      display: flex;
      margin-top: 12px;
      margin-bottom: 10px;
      .linkImg {
        width: 44px;
        height: 44px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }
      }
      .linkText {
        width: 269px;
        margin-left: 10px;
        span {
          &:nth-of-type(1) {
            width: inherit;
            color: #444444;
            font-size: 13px;
            line-height: 20px;
          }
          &:nth-of-type(2) {
            color: #B4B4B6;
            font-size: 11px;
          }
        }
      }
    }
    .feed-pdf-box {
      background: #F7F8FA;
      border-radius: 4px;
      padding: 7px 10px;
      display: flex;
      margin-bottom: 10px;
      .pdfIcon {
        width: 44px;
        height: 44px;
        text-align: center;
        border-radius: 4px;
        background: #DF6F5A;
        .icon {
          color: #ffffff;
          font-size: 34px;
          margin-top: 5px;
        }
      }
      .pdfText {
        width: 269px;
        margin-left: 10px;
        span {
          width: inherit;
          color: #444444;
          font-size: 13px;
          line-height: 20px;
        }
      }
    }
    .feed-group {
      width: fit-content;
      height: 21px;
      color: #444444;
      padding: 0 10px;
      font-size: 11px;
      line-height: 21px;
      background: #F7F8FA;
      border-radius: 100px;
      display: flex;
      margin-top: 10px;
      img {
        width: 11px;
        height: 11px;
        margin-top: 5px;
        margin-right: 3px;
      }
    }
    .feed-moreOperation {
      margin-top: 15px;
      color: #808080;
      display: flex;
      justify-content: space-between;
      .feed-mord {

      }
      .feed-operation {
        span {
          margin-left: 20px;
          .icon {
            margin-right: 5px;
          }
        }
      }
    }
  }

  .container-feed-questionAnswer {
    position: relative;
    margin-top: 20px;
    padding: 0 16px;
    .question-statistics {
      margin-top: 13px;
      color: #B4B4B6;
      span {
        font-size: 11px;
        &:nth-of-type(1) {
          color: #235280;
          font-size: 10px;
          line-height: 14px;
          padding: 1px 5px;
          background: #FCC816;
          display: inline-block;
          border-radius: 4px;
        }
      }
    }
    .question-answer-box {
      width: 343px;
      padding: 7px 10px;
      border-radius: 4px;
      background: #F7F8FA;
      margin-top: 13px;
      span {
        &:nth-of-type(1) {
          color: #808080;
          font-size: 10px;
          padding: 1px 5px;
          line-height: 14px;
          border-radius: 4px;
          background: #DCDCDC;
          display: inline-block;
        }
        &:nth-of-type(2) {
          color: #808080;
          font-size: 13px;
          line-height: 20px;
          margin-left: -4px;
          i {
            color: #235280;
            font-style: normal;
          }
        }
      }
    }
  }
</style>
