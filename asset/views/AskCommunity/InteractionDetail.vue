<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">互动问答</h1>
    </header>

    <div id="majorDetail" class="mui-content absolute" v-show="!loading">
      <div class="question_tags" v-for="(tag, index) in ask.question.tags" v-if="ask.question.tags.length">
        <p>{{tag.name}}</p>
      </div>
      <div>
        <Question
          :ask="ask.question"
          :isFollow="true"
        ></Question>

        <Answer v-show="ask.question.status==6||ask.question.status==7"
                :answer="answer"
                :questionId="ask.question.id"
                :needMoney="true"
                :isFollow="true"
                :showModifyBtn="true"
                :showShoucang="true"
                @paySuccess="paySuccess"
        ></Answer>


        <Discuss
          :answerId="ask.answer ? ask.answer.id:0"
          ref="discuss"
          v-show="ask.answer && ask.answer.content"
        ></Discuss>

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
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="$router.pushPlus('/askCommunity/interaction/answers/' + ask.question.id)">
          返回查看全部回答


        </button>
      </div>
    </div>

    <Share
      :title="shareTitle"
      :link="shareUrl"
      :shareName="shareName"
      :content="shareContent"
      :imageUrl="shareImg"
      :thumbUrl="shareImg"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

  </div>
</template>

<script>
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'

  import Question from '../../components/question-detail/QuestionInteractionDetail.vue'
  import Discuss from '../../components/question-detail/Discuss.vue'
  import Answer from '../../components/question-detail/Answer.vue'
  import Comment from '../../components/question-detail/Comment.vue'
  import Share from '../../components/Share.vue'
  import { getAskCommunityInteractionDetail } from '../../utils/shareTemplate'
  import { autoTextArea } from '../../utils/plus'

  const AskDetail = {
    data: () => ({
      ask: {
        answers: [],
        question: {created_at: '', description: ''},
        feedback: {
          rate_star: 0
        },
        timeline: []
      },
      shareUrl: '',
      shareImg: '',
      shareContent: '',
      shareTitle: '',
      shareName: '',
      id: 0,
      loading: true
    }),
    mounted () {
      this.shareImg = 'https://cdn.inwehub.com/system/whiteLogo@2x.png'

      autoTextArea()

      this.getDetail()
    },
    components: {
      Question,
      Discuss,
      Answer,
      Comment,
      Share
    },
    computed: {
      answer () {
        return this.ask.answer ? this.ask.answer : {}
      }
    },
    methods: {
      refreshPageData () {
        console.log('refreshPageData-zz-detail')
        this.loading = 1
        this.getDetail()
      },
      toAsk () {
        this.$router.pushPlus('/ask/interaction')
      },
      toSeeHelp () {
        this.$router.pushPlus('/help/ask')
      },
      shareSuccess () {
        // alertAskCommunityDetailShareSuccess(this);
      },
      shareFail () {

      },
      paySuccess (content) {
        this.ask.answers[0].content = content
      },
      downRefresh (callback) {
        this.getDetail(() => {
          this.$refs.discuss.resetList()
        })
      },
      getDetail (successCallback = () => {}) {
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

        this.id = id

        postRequest(`answer/info`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            this.$router.pushPlus('/task', '', true, 'pop-in', 'hide', true)
            return
          }

          this.ask = response.data.data

          this.loading = 0

          var username = this.answer.user_name ? this.answer.user_name : ''

          var shareOptions = getAskCommunityInteractionDetail(this.id, this.ask.question.description, username)
          this.shareImg = shareOptions.imageUrl
          this.shareContent = shareOptions.content
          this.shareUrl = shareOptions.link
          this.shareTitle = shareOptions.title
          this.shareName = shareOptions.shareName

          successCallback()
        })
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {

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
    margin-top: 10px;
    font-size: 14px;
    background: #fff;
  }

  .help .title {
    padding: 15px 15px 10px;
    color: #444;
  }

  .help .body {
    padding: 0 15px;
    color: #808080;
  }

  .help .body a {
    color: #03aef9;
  }

  .buttonWrapper {
    padding-top: 33px;
    background: #fff;
  }

  .buttonWrapper button {
    border-radius: 0;
    margin-bottom: 0;
    padding: 13px 0;
  }
  /*标签样式*/
  .question_tags{
    width:100%;
    overflow: hidden;
    padding: 0  16px 8px 7px;
  }
  .question_tags p{
    float: left;
    background: #a8dff7;
    color:#FFFFFF;
    padding: 0px 8px;
    border-radius:50px;
    margin-top: 9px;
    margin-left: 9px;
    font-size:12px;
  }

</style>
