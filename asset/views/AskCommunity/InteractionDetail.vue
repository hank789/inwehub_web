<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">互动问答</h1>
    </header>

    <div id="majorDetail" class="mui-content absolute" v-show="!loading">
      <div class="question_tags"  v-if="ask.question.tags.length">
        <p v-for="(tag, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(tag.name)">{{tag.name}}</p>
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
        <!--查看全部回答-->
        <div class="see"  @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/' + answer.uuid)"> 查看Ta的全部回答 >
          <i class="bot"></i>
        </div>

        <Discuss
          :listApi="'answer/commentList'"
          :listParams="{'answer_id': ask.answer ? ask.answer.id:0}"
          :storeApi="'answer/comment'"
          :storeParams="{'answer_id': ask.answer ? ask.answer.id:0}"

          @comment="comment"
          @commentFinish="commentFinish"

          ref="discuss"
          v-if="ask.answer && ask.answer.content"
        ></Discuss>

        <div class="help">
          <div class="title">
            什么是互动问答？

          </div>
          <div class="body">
            InweHub致力于营造高品质的顾问专业交流社区，通过互动问答方式解决企业和顾问疑惑，促进行业交流。点击参与回答可直接回答问题，点击关注问题可收到后续更新通知，提问请遵守相关<a
            @tap.stop.prevent="toSeeHelp()">问答规范</a>。
          </div>
        </div>

      </div>



    </div>

    <Share
      :title="shareTitle"
      :link="shareUrl"
      :shareName="shareName"
      :content="shareContent"
      :imageUrl="shareImg"
      :thumbUrl="shareImg"
      :targetId="id"
      :targetType="'answer'"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

  </div>
</template>

<script>
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'

  import Question from '../../components/question-detail/QuestionInteractionDetail.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import Answer from '../../components/question-detail/Answer.vue'
  import Share from '../../components/Share.vue'
  import { getAskCommunityInteractionDetail } from '../../utils/shareTemplate'
  import { autoTextArea, openVendorUrl } from '../../utils/plus'
  import commentTextarea from '../../components/comment/Textarea.vue'
  import userAbility from '../../utils/userAbility'
  import { pageRefresh } from '../../utils/allPlatform'

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
      shareUrl: '',
      shareImg: '',
      shareContent: '',
      shareTitle: '',
      shareName: '',
      id: 0,
      loading: true
    }),
    mounted () {
      pageRefresh(this, () => {
        this.refreshPageData()
      })
      this.shareImg = 'https://cdn.inwehub.com/system/whiteLogo@2x.png'

      autoTextArea()

      this.getDetail()
    },
    components: {
      Question,
      Discuss,
      Answer,
      Share,
      commentTextarea
    },
    computed: {
      answer () {
        return this.ask.answer ? this.ask.answer : {}
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
    methods: {
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
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
      refreshPageData () {
        this.$refs.ctextarea.refreshPageData()
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
      commentNumAdd () {
        this.answer.comment_number++
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
  .bot {
    position: absolute;
    right:0.4rem;
    top: 0rem;
    left:0.4rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-content {
    background: #f3f4f6;
  }

  .help {
    margin-top: 0.266rem;
    font-size: 0.373rem;
    background: #fff;
    padding-bottom: 1.013rem;
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


  /*标签样式*/
  .question_tags{
    width:100%;
    overflow: hidden;
    padding: 0  0.426rem 0.213rem 0.186rem;
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
  /*查看回答*/
  .see{
    width:100%;
    height:1.066rem;
    padding: 0 0.4rem;
    font-size:0.373rem;
    color:#03aef9;
    text-align: center;
    line-height: 1.066rem;
    background: #FFFFFF;
    margin-bottom: 0.266rem;
    position: relative;
  }
  .detail-answer[data-v-852fb68e] {
    margin-bottom: 0rem;
  }

</style>
