<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">互动问答</h1>
    </header>

    <div id="majorDetail" class="mui-content absolute" v-show="!loading">

      <RefreshList
        ref="refreshList"

        v-model="answers"
        :api="'question/answerList'"
        :prevOtherData="prevOtherData"
        :nextOtherData="prevOtherData"
        :prevSuccessCallback="prevSuccessCallback"
        :isShowUpToRefreshDescription="false"
        :list="answers"
        :pageMode="true"
        :autoShowEmpty="false"
      >
        <div class="question_tags"  v-if="ask.question.tags.length">
          <p v-for="(tag, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(tag.name)">{{tag.name}}</p>
        </div>

        <QustionInteraction
          :ask="ask.question"
          :myAnswerId="ask.my_answer_id"
          :isFollow="true"
          :isFollowAsked="ask.is_followed_question?true:false"
          @setFollowAskStatus="setFollowAskStatus"
        ></QustionInteraction>
         <!--邀请列表-->
        <InvitationList :ask="ask.question"></InvitationList>

        <div class="river"></div>

        <AnswersInteraction
          :list="answers"
          :questionId="ask.question.id"
        ></AnswersInteraction>

        <!--返回问答社区-->
        <div class="back" @tap.stop.prevent="$router.pushPlus('/askCommunity/majors')">
          <span>前往问答社区</span>
          <span>（更多精彩问答）</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
        </div>



        <div class="help">
          <div class="title">
            什么是互动问答？

          </div>
          <div class="body">
            InweHub致力于营造高品质的顾问专业交流社区，通过互动问答方式解决企业和顾问疑惑，促进行业交流。点击参与回答可直接回答问题，点击关注问题可收到后续更新通知，提问请遵守相关<a
            @tap.stop.prevent="toSeeHelp()">问答规范</a>。


          </div>
        </div>

        <div class="buttonWrapper iNeedAskWrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="toAsk()">
            我也要提问
          </button>
        </div>
      </RefreshList>


    </div>

    <Share
      ref="ShareBtn"
      :title="shareTitle"
      :shareName="'互动问答分享'"
      :link="shareUrl"
      :content="shareContent"
      :imageUrl="shareImg"
      :thumbUrl="shareImg"
      :targetId="id"
      :targetType="'question'"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

  </div>

</template>

<script>
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import QustionInteraction from '../../components/question-detail/QustionInteraction.vue'
  import AnswersInteraction from '../../components/question-detail/AnswersInteraction.vue'
  import InvitationList from '../../components/question-detail/InvitationList.vue'
  import Share from '../../components/Share.vue'
  import RefreshList from '../../components/refresh/List.vue'
  import { openVendorUrl } from '../../utils/plus'
  import userAbility from '../../utils/userAbility'
  import { getAskCommunityInteractionAnswers } from '../../utils/shareTemplate'

  const AskDetail = {
    data: () => ({
      ask: {
        answers: [],
        question: {
          created_at: '',
          description: '',
          tags: [],
          data: {
            img: []
          }
        },
        feedback: {
          rate_star: 0
        },
        timeline: []
      },
      answers: [],
      shareUrl: '',
      shareImg: '',
      shareContent: '',
      shareTitle: '',
      id: 0,
      loading: true
    }),
    mounted () {
    },
    components: {
      QustionInteraction,
      AnswersInteraction,
      RefreshList,
      Share,
      InvitationList
    },
    computed: {
      answer () {
        return this.ask.answers[0] ? this.ask.answers[0] : {}
      },
      prevOtherData () {
        return {question_id: this.id}
      }
    },
    methods: {
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      toAsk () {
        this.$router.pushPlus('/ask/interaction')
      },
      toSeeHelp () {
        this.$router.pushPlus('/help/ask')
      },
      share () {
        this.$refs.ShareBtn.share()
      },
      refreshPageData () {
        console.log('refreshPageData-zz-answers')
        this.getId()
        this.$refs.refreshList.setPageData(this.prevOtherData)
      },
      getId () {
        let id = parseInt(this.$route.params.id)

        if (!id) {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '发生一些错误',
              time: 1500,
              status: false
            })
          })
          this.$router.back()
          return
        }

        if (id !== this.id) {
          this.loading = 1
        }

        this.id = id
      },
      shareSuccess () {
        // alertAskCommunityDetailShareSuccess(this);
      },
      shareFail () {
      },
      prevSuccessCallback () {
        this.getDetail()
      },
      setFollowAskStatus (status) {
        this.ask.is_followed_question = status
      },
      getDetail (successCallback = () => {}) {
        this.getId()

        console.log('getDetail' + this.id)

        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            this.$router.pushPlus('/task', '', true, 'pop-in', 'hide', true)
            return
          }

          this.ask = response.data.data

          this.loading = 0

          var shareOptions = getAskCommunityInteractionAnswers(
            this.id,
            this.ask.question.description,
            this.ask.question.question_answer_num,
            this.ask.question.question_follow_num
          )

          this.shareTitle = shareOptions.title
          this.shareUrl = shareOptions.link
          this.shareContent = shareOptions.content
          this.shareImg = shareOptions.imageUrl
          successCallback()
        })
      }
    },
    updated () {
      this.$nextTick(() => {
        var eles = this.$el.querySelectorAll('.textToLink')
        for (var i in eles) {
          openVendorUrl(eles[i])
        }
      })
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getId()
    }
  }
  export default AskDetail
</script>


<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }
  .mui-table-view-cell:after {
    display: none;
  }

  .mui-content {
    background: #f3f4f6;
  }

  .help {

    font-size: 1.4rem;
    background: #fff;
  }

  .help .title {
    padding: 1.5rem 1.5rem 1rem;
    color: #444;
  }

  .help .body {
    padding: 0 1.5rem;
    color: #808080;
  }

  .help .body a {
    color: #03aef9;
  }

  .buttonWrapper {
    padding-top: 3.3rem;
    background: #fff;
  }

  .buttonWrapper button {
    border-radius: 0;
    margin-bottom: 0;
    padding: 1.3rem 0;
  }
  /*标签样式*/
  .question_tags{
    width:100%;
    overflow: hidden;
    padding: 0  1.6rem 0.8rem 0.7rem;
  }
  .question_tags p{
    float: left;
    background: #a8dff7;
    color:#FFFFFF;
    padding: 0rem 0.8rem;
    border-radius:5rem;
    margin-top: 0.9rem;
    margin-left: 0.9rem;
    font-size:1.2rem;
  }
  /*返回问答社区*/
  .back{
    width:100%;
    height:6.2rem;
    text-align: center;
    line-height: 6.2rem;
    background: url("../../statics/images/Community.png") no-repeat;
    background-size: cover;
    margin-top: 1rem;
  }
  .back span:nth-of-type(1){
    font-size:1.5rem;
    color:#444444;
    line-height: 6.2rem;
  }
  .back span:nth-of-type(2){
    font-size:1.2rem;
    color:#808080;
    line-height: 6.2rem;
  }
  .back svg:nth-of-type(1){
    font-size:1.2rem;
    color:#808080;
    line-height: 6.2rem;
  }
  .back svg:nth-of-type(2){
    font-size:1.2rem;
    color:#808080;
    line-height: 6.2rem;
    margin-left: -1rem;
  }

</style>
