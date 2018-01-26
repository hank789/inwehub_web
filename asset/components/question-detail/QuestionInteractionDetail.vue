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

    <div class="content text-content textToLink" v-html="getDesc()"></div>
    <!--添加图片-->
    <Images class="container-images-discover img-style margin-10-0-0" :images="ask.data ? ask.data.img : ''" :group="ask.id" v-if="ask.data ? ask.data.img.length > 0 : ''">
    </Images>
    <div class="footer">
      <span class="amount">{{ask.question_answer_num }}人回答</span>
      <span class="timeAgo" v-if="ask.is_followed" @tap.stop.prevent="collectAsk()">已关注{{ask.question_follow_num}}</span>
      <span class="timeAgo" @tap.stop.prevent="collectAsk()"  v-else>关注问题{{ask.question_follow_num}}</span>
    </div>


    <div class="mui-row">
      <div class="mui-col-sm-6 mui-col-xs-6 buttonWrapper buttonWrapper-1">
        <button type="button" class="mui-btn mui-btn-block mui-btn-warning"
                @tap.stop.prevent="$router.pushPlus('/askCommunity/interaction/answers/' + ask.id)">
          查看全部回答

        </button>
      </div>
      <div class="mui-col-sm-6 mui-col-xs-6 buttonWrapper buttonWrapper-2">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="$router.pushPlus('/askCommunity/interaction/answers/' + ask.id)">
          直接参与回答

        </button>
      </div>
    </div>

<!--@tap.stop.prevent="$router.pushPlus('/realAnswer/' + ask.id, 'backAndClose')">-->

  </div>
</template>
<script type="text/javascript">

  import UserInfo from './UserInfo.vue'
  import Images from '../../components/image/Images.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import { postRequest } from '../../utils/request'

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
      collectAsk: function () {
        if (!this.ask.id) {
          return
        }

        postRequest(`follow/question`, {
          id: this.ask.id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.ask.is_followed = response.data.data.type === 'follow' ? 1 : 0

          window.mui.toast(response.data.data.tip)
          if (this.ask.is_followed) {
            this.ask.question_follow_num++
          } else {
            this.ask.question_follow_num--
          }
        })
      },
      getDesc () {
        return textToLinkHtml(this.ask.description)
      },
      setFollowStatus (status) {
        this.ask.is_followed = status
      },
      getHtml (id, options, callback) {
      }
    }
  }
</script>

<style lang="less"  scoped="scoped">

  .detail-ask {
    padding-bottom: 20px;
    margin-top:0 !important;
    margin-bottom: 10px;
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
    padding: 9px 15px 17px;
    font-size:12px;
  }

  .footer .amount{
    color:#b4b4b6;
  }

  .footer .timeAgo{
    margin-left: 4px;
    color:#03aef9;
  }
  .mui-row{
    height:40px;
  }
  .buttonWrapper {

    &.buttonWrapper-1 {
       padding: 0 7px 0 15px;
     }

    &.buttonWrapper-2 {
       padding: 0 15px 0 7px;
     }

    .mui-btn-warning {
      background-color: #fcc816;
      border: 1px solid #fcc816;
    }
  }

  .mui-table-view:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

</style>
