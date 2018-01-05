<template>
  <div class="mui-table-view questionInteractionWrapper beforeHidden afterHidden">
    <UserInfo
      :uuid="ask.uuid"
      :avatar="ask.user_avatar_url"
      :realname="ask.user_name"
      :position="ask.title"
      :company="ask.company"
      :isFollow="isFollow"
      :isFollowed="ask.is_followed?true:false"
      :isExpert="ask.is_expert?1:0"
      @setFollowStatus="setFollowStatus"
    ></UserInfo>

    <div class="content text-content">{{ ask.description }}</div>
    <!--添加图片-->
    <Images class="container-images-discover img-style margin-10-0-0" :images="ask.data ? ask.data.img : ''" :group="ask.id" v-if="ask.data ? ask.data.img.length >0 :''">
    </Images>

    <div class="answerCount">
      {{ ask.answer_num }}人回答
      <span v-if="isFollowAsked" @tap.stop.prevent="collectAsk()">已关注{{ask.follow_num}}</span>
      <span @tap.stop.prevent="collectAsk()" v-else>关注问题{{ask.follow_num}}</span>
    </div>

    <div class="mui-row">
      <div class="mui-col-sm-6 mui-col-xs-6 buttonWrapper buttonWrapper-1">
        <button type="button" class="mui-btn mui-btn-block mui-btn-warning"
                @tap.stop.prevent="toContact()">
          邀请回答

        </button>
      </div>
      <div class="mui-col-sm-6 mui-col-xs-6 buttonWrapper buttonWrapper-2" v-if="!myAnswerId">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="$router.pushPlus('/realAnswer/' + ask.id, 'list-detail-page-realAnswer-once',true,'pop-in','close',true)">
          参与回答

        </button>
      </div>

      <div class="mui-col-sm-6 mui-col-xs-6 buttonWrapper buttonWrapper-2" v-else>
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="$router.pushPlus('/askCommunity/interaction/' + myAnswerId, 'list-detail-page-two')">
          查看我的回答

        </button>
      </div>
    </div>

  </div>
</template>
<script type="text/javascript">

  import UserInfo from './UserInfo.vue'
  import { postRequest } from '../../utils/request'
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
      isFollowAsked: {
        type: Boolean,
        default: false
      },
      myAnswerId: {
        type: Number,
        default: 0
      },
      isFollow: {
        type: Boolean,
        default: false
      }
    },
    created () {

    },
    methods: {
      toContact () {
        var description = encodeURIComponent(this.ask.description.replace(/\s/g, '').substr(0, 200))
        var username = encodeURIComponent(this.ask.user_name.replace(/\s/g, ''))
        var answerNum = this.ask.answer_num ? this.ask.answer_num : 0
        var followedNum = this.ask.follow_num ? this.ask.follow_num : 0
        var url = '/contact/' + this.ask.id + '?username=' + username + '&title=' + description + '&answernum=' + answerNum + '&followednum=' + followedNum
        this.$router.pushPlus(url, 'backAndClose', true, 'pop-in', 'close', true)
      },
      setFollowStatus (status) {
        this.ask.is_followed = status
      },
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

          var isFollowed = response.data.data.type === 'follow' ? 1 : 0

          window.mui.toast(response.data.data.tip)
          if (isFollowed) {
            this.ask.follow_num++
          } else {
            this.ask.follow_num--
          }
          this.$emit('setFollowAskStatus', isFollowed)
        })
      },
      getHtml (id, options, callback) {
      }
    }
  }
</script>

<style lang="less" scoped>
  .questionInteractionWrapper {
    margin-top: 0 !important;

    .content {
      padding: 0 15px;
    }

    .answerCount {
      color: #b4b4b6;
      font-size: 12px;
      padding: 5px 15px 15px;

      span {
        color: #03aef9;
        margin-left: 5px;
      }
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
  }

  .afterHidden:after {
    display: none;
  }
  /*图片样式*/
  .img-style{
    padding: 0 15px;
  }
</style>
