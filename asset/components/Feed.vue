<template>
  <div>
    <div class="container-feed-list">
      <UserInfo
        :uuid="list.user.uuid"
        :avatar="list.user.avatar"
        :realname="list.user.name"
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
      <div class="feed-title">{{list.feed.title}}</div>
      <!--图片-->
      <div v-if="list.feed.img" class="container-images container-images-discover">
        <div v-for="img in list.feed.img" class="container-image"><img :src="img"></div>
      </div>
      <!--链接-->
      <div class="feed-link-box">
        <div class="linkImg"><img src="../statics/images/uicon.jpg" alt=""></div>
        <div class="linkText">
          <span class="font-family-medium text-line-2">未来企业如果没几只爬虫，出门都不好意思打招呼.</span>
          <span>www.weixin.com</span>
        </div>
      </div>
      <!--PDF-->
      <div class="feed-pdf-box">
        <div class="pdfIcon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-pdf"></use>
          </svg>
        </div>
        <div class="pdfText">
          <span class="font-family-medium text-line-2">传统大型企业的IT咨询项目加实施落地，实施方法论是否可以敏捷化？实施方法论是</span>
        </div>
      </div>
      <div class="feed-pdf-box">
        <div class="pdfIcon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-pdf"></use>
          </svg>
        </div>
        <div class="pdfText">
          <span class="font-family-medium text-line-2">传统大型企业的IT咨询项目加实施落地，实施方法论是否可以敏捷化？实施方法论是</span>
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
        isFollow: true
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
    methods: {
      setFollowStatus (status) {
        this.detail.is_followed_author = status
      }
    }
  }
</script>

<style lang="less">
  .container-feed-list {
    position: relative;
    margin-top: 20px;
    padding: 0 16px;
    .line-river-after {
      margin-top: 20px;
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
    .feed-address {
      color: #B4B4B6;
      font-size: 11px;
      position: absolute;
      top: 16px;
      left: 112px;
    }
    .feed-title {
      color: #444444;
      font-size: 14px;
      line-height: 22px;
      margin-top: -3px;
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
      margin-bottom: 10px;
      .linkImg {
        width: 44px;
        height: 44px;
        img {
          width: 100%;
          height: 100%;
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
</style>
