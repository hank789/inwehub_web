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
      @setFollowStatus="setFollowStatus"
    ></UserInfo>

    <div class="content">
      {{ ask.description }}
    </div>
    <!--添加图片-->
    <Images class="container-images-discover img-style margin-10-0-0" :images="ask.data.img" :group="ask.id" v-if="ask.data.img.length > 0">
    </Images>


    <div class="footer">
      <span class="amount">{{ ask.answer_num }}人回答</span>
      <span class="timeAgo">{{ ask.created_at.split(' ')[0].replace(/-/g, '/') }}</span>
    </div>
  </div>
</template>
<script type="text/javascript">

  import UserInfo from './UserInfo.vue'
  import Images from '../../components/image/Images.vue'


  export default {
    data () {
      return {
      }
    },
    components: {
      UserInfo,
      Images
    },
    props: {
      ask: {
        type: Object,
        default: {}
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
      setFollowStatus (status) {
        this.ask.is_followed = status
      },
      getHtml (id, options, callback) {
      }
    }
  }
</script>

<style scoped="scoped">

  .detail-ask {
    padding-bottom: 5px;
    margin-top:0 !important;
  }

  .detail-ask:before {
    display: none;
  }

  .detail-ask:after {
    left: 15px;
    right: 15px;
  }

  .detail-ask .mui-media-body .timeAgo {
    color: #999;
    font-size: 14px;
  }

  .detail-ask .mui-media-body .amount {
    position: absolute;
    bottom: 10px;
    right: 15px;
    color: #ff9800;
  }

  .detail-ask .mui-media-body .amount b {
    font-weight: normal;
  }

  .content{
    font-size:16px;
    color:#444444;
    padding-left:15px;
    padding-right:15px;
  }

  .footer{
    padding:10px 15px;
    font-size:12px;
  }

  .footer .amount{
    color:#b4b4b6;
  }

  .footer .timeAgo{
    float:right;
    color:#b4b4b6;
  }
</style>
