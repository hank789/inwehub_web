<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">专业问答</h1>
    </header>

    <div id="majorDetail" class="mui-content absolute">
      <div>
        <div class="question_tags"  v-if="ask.question.tags.length">
          <p v-for="(tag, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(tag.name)">{{tag.name}}</p>
        </div>
        <Question
          :ask="ask.question"
          :isFollow="true"
        ></Question>

        <Answer v-show="ask.question.status==6||ask.question.status==7"
                :answer="ask.answers[0]"
                :questionId="ask.question.id"
                :needMoney="true"
                :isFollow="true"
                :showModifyBtn="false"
                @toPay="toPay"
        ></Answer>

        <div class="buttonWrapper" v-show="answer.content !== '' && !ask.feedback.description && answer.user_id !== userId">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="commentReal()"  v-if="ask.question.user_id == userId">
            点击评价，分享获取分红
          </button>
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="commentReal()" v-else>
            点击评价
          </button>
        </div>

        <Star-Rating v-if="ask.feedback.description"
                     :description="ask.feedback.description"
                     :rating="ask.feedback.rate_star"
                     :readOnly="true"
                     class="star"
        ></Star-Rating>

        <!--查看全部回答-->
        <div class="see"  @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/' + answer.uuid)"> 查看Ta的全部回答 >
          <i class="bot" v-show="ask.question.status===6"></i>
        </div>


        <div class="mui-table-view detail-answer" v-show="ask.question.status!=6&&ask.question.status!=7">
          <div class="mui-table-view-cell major_answer" >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xitongbengkuimeiyouwangluo"></use>
            </svg>
            <p>暂无回答</p>
          </div>
        </div>

        <RecommentList
          ref="recommentList"
          :did="id"
          v-if="id"
        ></RecommentList>

        <Discuss
          :listApi="'answer/commentList'"
          :listParams="{'answer_id': ask.answers[0] ? ask.answers[0].id:0}"
          :storeApi="'answer/comment'"
          :storeParams="{'answer_id': ask.answers[0] ? ask.answers[0].id:0}"

          @comment="comment"
          @commentFinish="commentFinish"

          ref="discuss"
          v-if="ask.answers[0] && ask.answers[0].content"
          delCommentSuccess="delCommentSuccess"
        ></Discuss>

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
      :targetType="'question'"
      @success="shareSuccess"
      @fail="shareFail"
      ref="ShareBtn"
    ></Share>

    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

    <Comment v-show="answer.content !== '' && !ask.feedback.description"
             :answerId="answer?answer.id:0"
             @finish="getDetail()"
             ref="commentReal"
             class="btn"
    ></Comment>

    <pay
      ref="pay"
      :payItems="[
          {
            default: true,
            text: '1元围观',
            value: 1
          }
        ]"
      :pay_object_type="'view_answer'"
      :pay_object_id="answer.id"
      :pay_money="1"
      @pay_success="paySuccess"
    >
    </pay>

    <FooterMenu
      :options="footerMenus"
      @clickedItem="footerMenuClickedItem"
    ></FooterMenu>

  </div>
</template>

<script>
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'

  import Question from '../../components/question-detail/Question.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import Answer from '../../components/question-detail/Answer.vue'
  import Comment from '../../components/question-detail/CommentNew.vue'
  import Share from '../../components/Share.vue'
  import { getAskCommunityMajorDetail } from '../../utils/shareTemplate'
  import userAbility from '../../utils/userAbility'
  import { autoTextArea } from '../../utils/plus'
  import commentTextarea from '../../components/comment/Textarea.vue'
  import StarRating from '../../components/question-detail/StarRating.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import pay from '../../components/pay/pay.vue'
  import { pageRefresh } from '../../utils/allPlatform'
  import Vue from 'vue'
  import FooterMenu from '../../components/FooterMenu.vue'
  import RecommentList from '../../components/AskCommunity/RecommendList.vue'

  const currentUser = getLocalUserInfo()

  const AskDetail = {
    data: () => ({
      userId: currentUser.user_id,
      ask: {
        answers: [],
        question: {
          created_at: '',
          description: '',
          tags: []
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
      loading: true,
      uuid: currentUser.uuid,
      name: currentUser.name
    }),
    mounted () {
      pageRefresh(this, () => {
        this.refreshPageData()
      })

      autoTextArea()
      this.getDetail()
    },
    components: {
      Question,
      Discuss,
      Answer,
      Comment,
      Share,
      commentTextarea,
      StarRating,
      pay,
      FooterMenu,
      RecommentList
    },
    computed: {
      answer () {
        return this.ask.answers[0] ? this.ask.answers[0] : {}
      },
      footerMenus () {
        return [
          {
            icon: '#icon-pinglun',
            text: '评论',
            number: this.loading ? 0 : this.ask.answers[0].comments_number,
            disable: false,
            rightLine: true,
            isLight: false
          },
          {
            icon: '#icon-zan',
            text: '点赞',
            number: this.loading ? 0 : this.ask.answers[0].support_number,
            disable: this.loading ? 0 : this.ask.answers[0].is_supported,
            rightLine: false,
            isLight: false
          },
          {
            icon: '#icon-shoucang-xiao',
            text: '分享',
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
      toPay () {
        this.$refs.pay.showSelectMoney()
      },
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
        this.answer.comment_number++
      },
      refreshPageData () {
        this.$refs.ctextarea.refreshPageData()
        console.log('refreshPageData')
        this.loading = 1
        this.getDetail()
      },
      shareSuccess () {
        // alertAskCommunityDetailShareSuccess(this);
      },
      shareFail () {
      },
      paySuccess (orderId) {
        postRequest(`answer/payforview`, {
          order_id: orderId,
          answer_id: this.answer.id,
          device: 1
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var content = response.data.data.content
          if (content) {
            Vue.set(this.ask.answers[0], 'content', content)
          }
        })
      },
      downRefresh (callback) {
        this.getDetail(() => {
          this.$refs.discuss.resetList()
        })
      },
      toSeeHelp () {
        this.$router.pushPlus('/help/ask')
      },
      toAsk () {
        userAbility.jumpToAddAsk()
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

          var username = this.answer.user_name ? this.answer.user_name : ''

          var shareOptions = getAskCommunityMajorDetail(this.id, this.ask.question.description, username)
          this.shareImg = shareOptions.imageUrl
          this.shareContent = shareOptions.content
          this.shareUrl = shareOptions.link
          this.shareTitle = shareOptions.title
          this.shareName = shareOptions.shareName

          successCallback()
        })
      },
      footerMenuClickedItem (item) {
        switch (item.icon) {
          case this.footerMenus[0].icon:
            // 评论
            if (this.$refs.discuss) {
              this.$refs.discuss.rootComment()
            } else {
              this.$refs.pay.showSelectMoney()
            }
            break
          case this.footerMenus[1].icon:
            // 点赞
            this.support()
            break
          case this.footerMenus[2].icon:
            // 分享
            this.$refs.ShareBtn.share()
            break
        }
      },
      support () {
        var data = {
          id: this.answer.id
        }
        postRequest(`support/answer`, data).then(response => {
          var code = response.data.code

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (response.data.data.type === 'unsupport') {
            this.ask.answers[0].support_number--
            this.ask.answers[0].is_supported = 0
            for (var i in this.ask.answers[0].supporter_list) {
              if (this.ask.answers[0].supporter_list[i].uuid === this.uuid) {
                this.ask.answers[0].supporter_list.splice(i, 1)
              }
            }
          } else {
            this.ask.answers[0].support_number++
            this.ask.answers[0].is_supported = 1
            var support = {
              name: this.name,
              uuid: this.uuid
            }
            this.ask.answers[0].supporter_list = this.ask.answers[0].supporter_list.concat(support)
          }
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:support:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.answerId,
                'page_name': 'answer',
                'page_title': this.ask.answers[0].is_supported ? 'support' : 'cancel',
                'referrer_page': ''
              }
            )
          }
          window.mui.toast(response.data.data.tip)
        })
      },
      delCommentSuccess () {
        this.ask.answer[0].comments_number--
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
  .mui-table-view-cell:after {
    display: none;
  }

  .mui-content {
    background: #f3f4f6;
    bottom:1.333rem;
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
    padding: 0.133rem 0.4rem 0.4rem 0.4rem;
    background: #fff;
  }

  .buttonWrapper button {
    border-radius: 1.333rem;
    margin-bottom: 0;
    padding: 0.346rem 0;
  }
  .iNeedAskWrapper{
    width:100%;
    padding:0.133rem 0;
  }
  .iNeedAskWrapper button{
    border-radius:0;
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
  margin-bottom: 0.266rem;
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
  /*暂无回答*/
  .detail-answer {
    margin-bottom: 0rem;
    width:100%;
    position: relative;
  }
  .major_answer{
    height:3.32rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.64rem;
    color: #c8c8c8;
  }
  .major_answer svg{
    font-size: 1.33rem
  }
  .mui-table-view:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
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
  .btn{
    margin-top: -0.4rem;
  }
  .star{
    margin-top: -0.4rem;
  }

</style>
