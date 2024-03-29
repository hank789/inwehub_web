<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">问答</h1>
    </header>

    <div class="mui-content absolute" v-show="!loading">
      <!--标签-->
      <div class="container-label" v-if="ask.question.tags.length">
        <span v-for="(item, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(item.name)">{{item.name}}</span>
      </div>

      <Question
        :ask="ask.question"
        :isFollow="false"
      ></Question>

      <Answer v-show="ask.question.status==6||ask.question.status==7"
              :answer="ask.answers[0] ? ask.answers[0]:{}"
              :isFollow="true"
      ></Answer>

      <div class="detail-answer-wait" v-show="ask.question.status != 6 && ask.question.status != 7">
        <div class="component-title-home"><div class="left">回答</div></div>
        <div class="line-river line-river-full"></div>
        <svg class="icon margin-top-26" aria-hidden="true">
          <use xlink:href="#icon-zanwushuju"></use>
        </svg>
        <p>正在等待回答者</p>
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

    <AlertTextarea ref="AlertTextarea"></AlertTextarea>
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
  import userAbility from '../../utils/userAbility'
  import AlertTextarea from '../../components/comment/AlertTextarea.vue'
  import { showComment } from '../../utils/comment'

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
      commentTextarea,
      AlertTextarea
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
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      commentReal () {
        this.$refs.commentReal.comment()
      },
      sendMessage (message) {
        this.$refs.discuss.sendMessage(message)
      },
      comment (commentTargetName) {
        showComment(
          this,
          commentTargetName,
          this.$refs.ctextarea,
          this.$refs.AlertTextarea,
          this.$refs.discuss
        )
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
        this.$refs.ctextarea.refreshPageData()
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
  .mui-table-view:after {
    display: none;
  }

  .mui-content {
    background: #f3f4f6;
  }

  .detail-answer-wait {
    margin-top:0.266rem;
    width: 100%;
    background: #FFFFFF;
    margin-bottom: 0.266rem;
    text-align: center;
    padding: 0 0 0.533rem 0;
  }

  .detail-answer-wait svg {
    font-size: 1.333rem;

  }

  .detail-answer-wait p {
    width: 100%;
    font-size: 0.32rem;
    color: #c8c8c8;
    text-align: center;

  }
  /*标签*/
  .tags{
    width:100%;
    overflow: hidden;
    padding:0 0.426rem 0.266rem 0.24rem;
  }
  .tags p{
    float: left;
    margin: 0;
    padding: 0;
    margin-left: 0.186rem;
    margin-top: 0.266rem;
    background:#a8dff7;
    color: #FFFFFF;
    border-radius: 1.333rem;
    font-size: 0.32rem;
    padding: 0 0.213rem;
  }

  .messageWrapper{
    padding-top:0.266rem;
  }
/*按钮*/
  .buttonWrapper {
    padding:0.506rem 0.4rem 0 0.4rem;
    background: #fff;
  }

  .buttonWrapper button {
    border-radius: 1.333rem;
    margin-bottom: 0;
    padding: 0.346rem 0;
  }
  /*margin*/
  .detail-answer{
    margin-bottom: 0rem;
  }

  .container-label{
    background:#fff;
    padding:0.266rem 0.426rem 0.053rem;
  }
</style>
