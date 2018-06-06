<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答</h1>
    </header>

    <div id="majorDetail" class="mui-content" v-show="!loading">

      <RefreshList
        ref="refreshList"
        class="refreshListWrapper"
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

        <div class="container-label" v-if="ask.question.tags.length">
          <span v-for="(item, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(item.name)">{{item.name}}</span>
        </div>


        <Question
          :ask="ask.question"
          :myAnswerId="ask.my_answer_id"
          :isFollow="true"
          :isFollowAsked="ask.is_followed_question?true:false"
          @setFollowAskStatus="setFollowAskStatus"
        ></Question>

        <InvitationList :ask="ask.question"></InvitationList>

        <div class="river"></div>

        <Answers
          :list="answers"
          :questionId="ask.question.id"
        ></Answers>

        <div class="line-river-big"></div>
        <RecommentList
          ref="recommentList"
          class="recommentList"
          :did="id"
          v-if="id"
        ></RecommentList>

        <div class="line-river-big"></div>
        <div class="component-goAskOffers" @tap.stop.prevent="$router.pushPlus('/askCommunity/majors')">
          <span>前往问答社区</span>
          <span>（更多精彩问答）</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
        </div>
        <div class="line-river-big"></div>

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

    <FooterMenu
      class="offerAnswersFooterMenu"
      :options="footerMenus"
      @clickedItem="footerMenuClickedItem"
    ></FooterMenu>

  </div>

</template>

<script>
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import Question from '../../components/askOffer/Question.vue'
  import Answers from '../../components/askOffer/Answers.vue'
  import InvitationList from '../../components/question-detail/InvitationList.vue'
  import Share from '../../components/Share.vue'
  import RefreshList from '../../components/refresh/List.vue'
  import { openVendorUrl } from '../../utils/plus'
  import userAbility from '../../utils/userAbility'
  import { getAskCommunityInteractionAnswers } from '../../utils/shareTemplate'
  import RecommentList from '../../components/AskCommunity/RecommendList.vue'
  import FooterMenu from '../../components/FooterMenu.vue'
  import { toContact, toAnswer, toSeeSelfAnswer, collectQuestion } from '../../utils/ask'
  import { getAnswerCache } from '../../utils/allPlatform'

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
      Question,
      Answers,
      RefreshList,
      Share,
      InvitationList,
      RecommentList,
      FooterMenu
    },
    computed: {
      answer () {
        return this.ask.answers[0] ? this.ask.answers[0] : {}
      },
      prevOtherData () {
        return {question_id: this.id}
      },
      footerMenus () {
        var guanzhuIcon = '#icon-shoucang'
        if (this.ask.is_followed_question) {
          guanzhuIcon = '#icon-shoucanghover'
        }

        var huidaText = '回答'
        if (this.ask.my_answer_id) {
          huidaText = '查看我的回答'
        }

        var guanzhuText = '关注问题'
        if (this.ask.is_followed_question) {
          guanzhuText = '取消关注'
        }

        getAnswerCache('answer' + this.ask.id + '-' + this.ask.my_answer_id, (contents) => {
          console.log('answerCacheContents:' + contents)
          if (contents) {
            huidaText = '参与回答(草稿)'
          }
        }, this)

        return [
          {
            icon: '#icon-yaoqing',
            text: '邀人回答',
            number: 0,
            disable: false,
            rightLine: true,
            isLight: false
          },
          {
            icon: guanzhuIcon,
            text: guanzhuText,
            number: 0,
            disable: false,
            rightLine: true,
            isLight: false
          },
          {
            icon: '#icon-xiugai',
            text: huidaText,
            number: 0,
            disable: false,
            rightLine: false,
            isLight: true
          }
        ]
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
      },
      footerMenuClickedItem (item) {
        switch (item.text) {
          case '邀人回答':
            toContact(
              this,
              this.ask.question.id,
              this.ask.question.user_name,
              this.ask.question.description,
              this.ask.question.answer_num,
              this.ask.question.follow_num
            )
            break
          case '回答':
            toAnswer(this, this.ask.question.id)
            break
          case '查看我的回答':
            toSeeSelfAnswer(this, this.ask.my_answer_id)
            break
          case '关注问题':
          case '取消关注':
            collectQuestion(this, this.ask.question.id, () => {
              this.ask.question.question_follow_num++
              this.ask.is_followed_question = 1
            }, () => {
              this.ask.question.question_follow_num--
              this.ask.is_followed_question = 0
            })
            break
        }
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
  .container-label{
    padding:0 0.4rem;
  }

  .refreshListWrapper{
    bottom:1.333rem;
  }

  .mui-content {
    background: #fff;
  }
</style>

<style>
  .offerAnswersFooterMenu .menu_1 .icon{
    font-size:0.613rem !important;
  }
  .offerAnswersFooterMenu .menu_2 .icon{
    font-size:0.426rem !important;
  }
</style>
