<template>
  <div class="mui-table-view detail-ask">
    <UserInfo
      :uuid="ask.uuid"
      :avatar="ask.user_avatar_url"
      :realname="ask.user_name"
      :position="ask.title"
      :company="ask.company"
      :isFollow="isFollow"
      :isFollowed="ask.is_followed?true:false"
      :isExpert="ask.is_expert?1:0"
      :isShowPositionAndCompany="isShowPositionAndCompany"
      :time="ask.created_at"
      @setFollowStatus="setFollowStatus"
    ></UserInfo>

    <div class="content text-content"  v-html="textToLink(ask.description)"></div>
    <!--添加图片-->
    <Images class="container-images-discover img-style margin-10-0-0" :images="ask.data.img" :group="ask.id" v-if="ask.data ? ask.data.img.length > 0 : ''">
    </Images>


    <div class="footer">
      <div class="component-card-money border-football">
        <div class="left">
          <div class="money">{{ask.price}}<span>元</span></div>
          <label>{{getStateDesc(ask.state)}}</label>
        </div>
        <div class="right">
          <div class="desc text-line-2">{{ask.status_description}}</div>
        </div>
        <div class="line-split"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">

  import UserInfo from './UserInfo.vue'
  import Images from '../../components/image/Images.vue'
  import { textToLinkHtml, secureHtml } from '../../utils/dom'

  export default {
    data () {
      return {}
    },
    components: {
      UserInfo,
      Images
    },
    props: {
      ask: {
        type: Object,
        default: {
          description: ''
        }
      },
      isFollow: {
        type: Boolean,
        default: false
      },
      isShowPositionAndCompany: {
        type: Boolean,
        default: false
      }
    },
    created () {

    },
    methods: {
      textToLink (text) {
        if (!text) {
          return ''
        }
        return secureHtml(textToLinkHtml(text))
      },
      setFollowStatus (status) {
        this.ask.is_followed = status
      },
      getHtml (id, options, callback) {
      },
      getStateDesc (state) {
        switch (state) {
          case 8:
            return '已采纳'
          case 9:
            return '已关闭'
          default:
            return '悬赏中'
        }
      }
    }
  }
</script>

<style scoped="scoped">

  .detail-ask {
    padding-bottom: 0.133rem;
    margin-top: 0 !important;
  }

  .detail-ask:before {
    display: none;
  }

  .detail-ask:after {
    left: 0.4rem;
    right: 0.4rem;
  }

  .detail-ask .mui-media-body .timeAgo {
    color: #999;
    font-size: 0.373rem;
  }

  .detail-ask .mui-media-body .amount {
    position: absolute;
    bottom: 0.266rem;
    right: 0.4rem;
    color: #ff9800;
  }

  .detail-ask .mui-media-body .amount b {
    font-weight: normal;
  }

  .content {
    font-size: 0.426rem;
    color: #444444;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }

  .footer {
    padding: 0.266rem 0.4rem;
    font-size: 0.32rem;
  }

  .footer .amount {
    color: #fa4975;
  }

  .footer .timeAgo {
    float: right;
    color: #b4b4b6;
  }
</style>
