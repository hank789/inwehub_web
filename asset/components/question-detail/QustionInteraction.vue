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

    <div class="content text-content textToLink" v-html="getDesc()"></div>
    <!--添加图片-->
    <Images class="container-images-discover img-style margin-10-0-0" :images="ask.data ? ask.data.img : ''" :group="ask.id" v-if="ask.data ? ask.data.img.length >0 :''">
    </Images>

    <div class="answerCount">
      {{ ask.question_answer_num }}人回答
      <span v-if="isFollowAsked" @tap.stop.prevent="collectAsk()">已关注{{ask.question_follow_num}}</span>
      <span @tap.stop.prevent="collectAsk()" v-else>关注问题{{ask.question_follow_num}}</span>
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
                @tap.stop.prevent="$router.pushPlus('/realAnswer/' + ask.id + '?interaction=1', 'backAndClose')">
          {{ toAnswerText }}

        </button>
      </div>

      <div class="mui-col-sm-6 mui-col-xs-6 buttonWrapper buttonWrapper-2" v-else>
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="$router.pushPlus('/ask/offer/' + myAnswerId, 'list-detail-page-two')">
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
  import { textToLinkHtml } from '../../utils/dom'
  import { getAnswerCache } from '../../utils/allPlatform'

  export default {
    data () {
      return {
        toAnswerText: '参与回答'
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
    updated () {
      getAnswerCache('answer' + this.ask.id + '-' + this.myAnswerId, (contents) => {
        console.log('answerCacheContents:' + contents)
        if (contents) {
          this.toAnswerText = '参与回答(草稿)'
        } else {
          this.toAnswerText = '参与回答'
        }
      }, this)
    },
    methods: {
      getDesc () {
        return textToLinkHtml(this.ask.description)
      },
      toContact () {
        var description = encodeURIComponent(this.ask.description.replace(/\s/g, '').substr(0, 200))
        var username = encodeURIComponent(this.ask.user_name.replace(/\s/g, ''))
        var answerNum = this.ask.answer_num ? this.ask.answer_num : 0
        var followedNum = this.ask.follow_num ? this.ask.follow_num : 0
        var url = '/RecommendInvitation/' + this.ask.id + '?username=' + username + '&title=' + description + '&answernum=' + answerNum + '&followednum=' + followedNum
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
            this.ask.question_follow_num++
          } else {
            this.ask.question_follow_num--
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
      padding: 0 0.4rem;
    }

    .answerCount {
      color: #b4b4b6;
      font-size: 0.32rem;
      padding: 0.133rem 0.4rem 0.4rem;

      span {
        color: #03aef9;
        margin-left: 0.133rem;
      }
    }

    .buttonWrapper {

      &.buttonWrapper-1 {
        padding: 0 0.186rem 0 0.4rem;
      }

      &.buttonWrapper-2 {
        padding: 0 0.4rem 0 0.186rem;
      }

      .mui-btn-warning {
        background-color: #fcc816;
        border: 0.026rem solid #fcc816;
      }
    }
  }

  .afterHidden:after {
    display: none;
  }
  /*图片样式*/
  .img-style{
    padding: 0 0.4rem;
  }
</style>
