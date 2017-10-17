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

        <QustionInteraction
          :ask="ask.question"
          :myAnswerId="ask.my_answer_id"
          :isFollow="true"
          :isFollowAsked="ask.is_followed_question?true:false"
          @setFollowAskStatus="setFollowAskStatus"
        ></QustionInteraction>

        <div class="river"></div>

        <AnswersInteraction
          :list="answers"
          :questionId="ask.question.id"
        ></AnswersInteraction>

        <div class="help">
          <div class="title">
            什么是互动问答？
          </div>
          <div class="body">
            InweHub致力于营造高品质的顾问专业交流社区，通过互动问答方式解决顾问疑惑，促进行业交流。点击参与回答可直接回答问题，点击关注问题可收到后续更新通知，提问请遵守相关<a @tap.stop.prevent="toSeeHelp()">问答规范</a>。

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
      :link="shareUrl"
      :content="shareContent"
      :imageUrl="shareImg"
      :thumbUrl="shareImg"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

  </div>

</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import QustionInteraction from '../../components/question-detail/QustionInteraction.vue';
  import Discuss from '../../components/question-detail/Discuss.vue';
  import AnswersInteraction from '../../components/question-detail/AnswersInteraction.vue';
  import Comment from '../../components/question-detail/Comment.vue';
  import {alertAskCommunityDetailShareSuccess,alertAskCommunityInteractiveAnswer,alertAskCommunityQuestioningSuccess} from '../../utils/dialogList';
  import Share from '../../components/Share.vue';
  import RefreshList from '../../components/refresh/List.vue';
  import userAbility from '../../utils/userAbility';
  import localEvent from '../../stores/localStorage';
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
      answers:[],
      shareUrl: '',
      shareImg: '',
      shareContent: '',
      shareTitle: '',
      id: 0,
      loading: true
    }),
    mounted(){

      this.shareImg = 'https://cdn.inwehub.com/system/whiteLogo@2x.png';

    },
    components: {
      QustionInteraction,
      Discuss,
      AnswersInteraction,
      Comment,
      RefreshList,
      Share
    },
    computed: {
      answer () {
        return this.ask.answers[0] ? this.ask.answers[0] : {};
      },
      prevOtherData() {
         return {question_id: this.id}
      }
    },
    methods: {
      toAsk(){
          this.$router.pushPlus('/ask/interaction');
      },
      toSeeHelp(){
          this.$router.pushPlus('/help/ask');
      },
      share(){
         this.$refs.ShareBtn.share();
      },
      refreshPageData(){
          console.log('refreshPageData');
          this.getId();
          this.Popup();
      },
      getId(){
        let id = parseInt(this.$route.params.id);

        if (!id) {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '发生一些错误',
              time: 1500,
              status: false
            });
          });
          this.$router.back();
          return;
        }

        if (id !== this.id) {
            this.loading = 1;
        }

        this.id = id;
      },
      shareSuccess(){
        //alertAskCommunityDetailShareSuccess(this);
      },
      shareFail(error){

      },
      prevSuccessCallback(){
         this.getDetail();
      },
      setFollowAskStatus(status){
        this.ask.is_followed_question = status;
      },
      getDetail(successCallback = () => {
                }){

        this.getId();

        console.log('getDetail' + this.id);

        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
            this.$router.pushPlus('/task', '', true, 'pop-in', 'hide', true);
            return;
          }

          this.ask = response.data.data;

          this.loading = 0;

          var username = this.answer.user_name ? this.answer.user_name : '';
          this.shareTitle = '问答|' + this.ask.question.description;

          var currentUrl = '/askCommunity/interaction/answers/' + this.id;
          this.shareUrl = process.env.API_ROOT + 'wechat/oauth?redirect=' + currentUrl;

          var answerNum = this.ask.question.answer_num;

          var followNum = this.ask.question.follow_num;

          this.shareContent = '已有' + answerNum  + '个回答、' + followNum + '个关注，点击前往查看详情或参与回答互动';

          successCallback();

        });
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getId();
    }
  }
  export default AskDetail;
</script>


<style scoped>
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


</style>
