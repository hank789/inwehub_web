<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
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
        :isShowUpToRefreshDescription="true"
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

        <RecommentList
          ref="recommentList"
          class="recommentList"
          :did="id"
          v-if="id"
        ></RecommentList>

        <!--返回问答社区-->
        <div class="back" @tap.stop.prevent="$router.pushPlus('/ask/offers')">
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
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { openVendorUrl } from '../../utils/plus'
  import userAbility from '../../utils/userAbility'
  import { getAskCommunityInteractionAnswers } from '../../utils/shareTemplate'
  import RecommentList from '../../components/AskCommunity/RecommendList.vue'

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
      InvitationList,
      RecommentList
    },
    computed: {
      answer () {
        return this.ask.answers[0] ? this.ask.answers[0] : {}
      },
      prevOtherData () {
        return {question_id: this.id}
      }
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
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
    padding-bottom:0.4rem;
    font-size: 0.373rem;
    background: #fff;
  }

  .help .title {
    padding: 0.4rem 0.4rem 0.266rem;
    color: #444;
  }

  .help .body {
    padding: 0 0.4rem;
    color: #808080;
  }

  .help .body a {
    color: #03aef9;
  }

  .buttonWrapper {
    padding-top: 0.88rem;
    background: #fff;
  }

  .buttonWrapper button {
    border-radius: 0;
    margin-bottom: 0;
    padding: 0.346rem 0;
  }
  /*标签样式*/
  .question_tags{
    width:100%;
    overflow: hidden;
    padding: 0  0.426rem 0.213rem 0.186rem;
    background: #ffffff;
  }
  .question_tags p{
    float: left;
    background: #a8dff7;
    color:#FFFFFF;
    padding: 0rem 0.213rem;
    border-radius:1.333rem;
    margin-top: 0.24rem;
    margin-left: 0.24rem;
    font-size:0.32rem;
  }
  /*返回问答社区*/
  .back{
    width:100%;
    height:1.653rem;
    text-align: center;
    line-height: 1.653rem;
    background: url("../../statics/images/Community.png") no-repeat;
    background-size: cover;
    margin-top: 0.266rem;
  }
  .back span:nth-of-type(1){
    font-size:0.4rem;
    color:#444444;
    line-height: 1.653rem;
  }
  .back span:nth-of-type(2){
    font-size:0.32rem;
    color:#808080;
    line-height: 1.653rem;
  }
  .back svg:nth-of-type(1){
    font-size:0.32rem;
    color:#808080;
    line-height: 1.653rem;
  }
  .back svg:nth-of-type(2){
    font-size:0.32rem;
    color:#808080;
    line-height: 1.653rem;
    margin-left: -0.266rem;
  }
  .recommentList{
    margin-top:0.266rem;
  }
</style>
