<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">专业问答</h1>
    </header>

    <div class="mui-content absolute" v-show="!loading">
      <!--标签-->
      <div class="tags" v-if="ask.question.tags.length">
        <p v-for="(item, index) in ask.question.tags">{{item.name}}</p>
      </div>

      <Question
        :ask="ask.question"
        :isFollow="false"
      ></Question>

      <Answer v-show="ask.question.status==6||ask.question.status==7"
              :answer="ask.answers[0] ? ask.answers[0]:{}"
              :isFollow="true"
      ></Answer>

      <div class="detail-answer-wait" v-show="ask.question.status!=6&&ask.question.status!=7">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zanwushuju"></use>
        </svg>
        <p>正在等待专家回答</p>
      </div>

      <div class="buttonWrapper" v-show="ask.question.status===6">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="commentReal()">点击评价，分享获取分红
        </button>
      </div>

      <Star-Rating v-if="ask.question.status===7 && ask.feedback.description"
                   :description="ask.feedback.description"
                   :rating="ask.feedback.rate_star"
                   :readOnly="true"
      ></Star-Rating>

      <Timeline
        :timelines="timelines"
      ></Timeline>

      <Discuss
        class="messageWrapper"
        :listApi="'answer/commentList'"
        :listParams="{'answer_id': ask.answers[0] ? ask.answers[0].id:0}"
        :storeApi="'answer/comment'"
        :storeParams="{'answer_id': ask.answers[0] ? ask.answers[0].id:0}"

        @comment="comment"
        @commentFinish="commentFinish"

        ref="discuss"
        v-if="ask.question.status==6||ask.question.status==7"
      ></Discuss>


    </div>

    <Share
      v-show="ask.question.status==6||ask.question.status==7"
      :title="shareOption.title"
      :shareName="shareOption.shareName"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :targetId="id"
      :targetType="'question'"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

    <Comment v-show="ask.question.status===6"
             :answerId="ask.answers[0]?ask.answers[0].id:0"
             @finish="getDetail()"
             ref="commentReal"
    ></Comment>
  </div>
</template>

<script>
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'

  import UserInfo from '../../components/question-detail/UserInfo.vue'
  import Question from '../../components/question-detail/Question.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import StarRating from '../../components/question-detail/StarRating.vue'
  import Statistics from '../../components/question-detail/Statistics.vue'
  import Timeline from '../../components/question-detail/Timeline.vue'
  import Answer from '../../components/question-detail/Answer.vue'
  import Comment from '../../components/question-detail/CommentNew.vue'
  import Share from '../../components/Share.vue'
  import { getAskCommunityMajorDetail } from '../../utils/shareTemplate'
  import commentTextarea from '../../components/comment/Textarea.vue'

  const AskDetail = {
    data: () => ({
      ask: {
        answers: [],
        question: {
          created_at: '',
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
      id: 0,
      shareOption: {
        title: '',
        link: '',
        content: '',
        imageUrl: '',
        thumbUrl: '',
        shareName: ''
      },
      loading: true
    }),
    mounted () {
    },
    components: {
      UserInfo,
      Question,
      Discuss,
      StarRating,
      Statistics,
      Timeline,
      Answer,
      Comment,
      Share,
      commentTextarea
    },
    computed: {
      title () {
        switch (parseInt(this.ask.question.question_type)) {
          case 1:
            return '专业问答'
          case 2:
            return '悬赏问答'
        }
        return '提问'
      },
      timelines () {
        return this.ask.timeline.reverse()
      }
    },
    methods: {
      commentReal () {
        this.$refs.commentReal.comment()
      },
      sendMessage (message) {
        this.$refs.discuss.sendMessage(message)
      },
      comment (commentTargetName) {
        this.$refs.ctextarea.comment(commentTargetName)
      },
      commentFinish () {
        this.commentNumAdd()
        this.$refs.ctextarea.finish()
      },
      commentNumAdd () {
        if (this.ask && this.ask.answers[0]) {
          this.ask.answers[0].comment_number++
        }
      },
      shareSuccess () {
      },
      shareFail () {
      },
      downRefresh (callback) {
        this.getDetail(() => {
          this.$refs.discuss.resetList()
        })
      },
      refreshPageData () {
        this.loading = 1
        this.getDetail()
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

        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            this.$router.pushPlus('/task', '', true, 'pop-in', 'hide', true)
            return
          }

          this.ask = response.data.data
          this.loading = 0

          var answer = this.ask.answers[0] ? this.ask.answers[0] : {}
          var username = answer.user_name ? answer.user_name : ''

          this.shareOption = getAskCommunityMajorDetail(this.id, this.ask.question.description, username)

          successCallback()
        })
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      // showInwehubWebview();
      this.getDetail()
    }
  }
  export default AskDetail
</script>


<style scoped>
  .mui-table-view-cell:after {
    display: none;
  }

  .mui-content {
    background: #f3f4f6;
  }

  .detail-answer-wait {
    width: 100%;
    background: #FFFFFF;
    margin-bottom: 10px;
    text-align: center;
    padding: 20px 0;
  }

  .detail-answer-wait svg {
    font-size: 50px;

  }

  .detail-answer-wait p {
    width: 100%;
    font-size: 12px;
    color: #c8c8c8;
    text-align: center;

  }
  /*标签*/
  .tags{
    width:100%;
    overflow: hidden;
    padding:0 16px 10px 9px;
  }
  .tags p{
    float: left;
    margin: 0;
    padding: 0;
    margin-left: 7px;
    margin-top: 10px;
    background:#a8dff7;
    color: #FFFFFF;
    border-radius: 50px;
    font-size: 12px;
    padding: 0 8px;
  }

  .messageWrapper{
    padding-top:10px;
  }
/*按钮*/
  .buttonWrapper {
    padding:19px 15px 0 15px;
    background: #fff;
  }

  .buttonWrapper button {
    border-radius: 50px;
    margin-bottom: 0;
    padding: 13px 0;
  }
  /*margin*/
  .detail-answer{
    margin-bottom: 0px;
  }
</style>
