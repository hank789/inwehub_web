<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">互动问答</h1>
    </header>

    <div id="majorDetail" class="mui-content absolute" v-show="!loading">
      <div>
        <Question
          :ask="ask.question"
          :isFollow="true"
        ></Question>

        <Answer v-show="ask.question.status==6||ask.question.status==7"
                :answer="answer"
                :needMoney="true"
                :isFollow="true"
                :showShoucang="true"
                @paySuccess="paySuccess"
        ></Answer>


        <Discuss
          :answerId="ask.answer ? ask.answer.id:0"
          ref="discuss"
          v-show="ask.answer && ask.answer.content"
        ></Discuss>

        </div>
    </div>

    <Share
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

  import Question from '../../components/question-detail/QuestionInteractionDetail.vue';
  import Discuss from '../../components/question-detail/Discuss.vue';
  import Answer from '../../components/question-detail/Answer.vue';
  import Comment from '../../components/question-detail/Comment.vue';
  import {alertAskCommunityDetailShareSuccess} from '../../utils/dialogList';
  import Share from '../../components/Share.vue';

  import userAbility from '../../utils/userAbility';

  const AskDetail = {
    data: () => ({
      ask: {
        answers: [],
        question: {created_at: '', description:''},
        feedback: {
          rate_star: 0
        },
        timeline: []
      },
      shareUrl:'',
      shareImg:'',
      shareContent:'',
      shareTitle:'',
      id: 0,
      loading: true
    }),
    mounted(){
      this.shareImg = 'https://cdn.inwehub.com/system/whiteLogo@2x.png';

      mui.plusReady(() => {
        plus.webview.currentWebview().setStyle({
          softinputMode: "adjustResize"
        });
      });

      window.addEventListener('refreshData', (e) => {
        //执行刷新
        console.log('refresh-answerDetail');
        this.getDetail();
      });

      this.getDetail();
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
          return this.ask.answer ? this.ask.answer:{};
      }
    },
    methods: {
      shareSuccess(){
          //alertAskCommunityDetailShareSuccess(this);
      },
      shareFail(error){

      },
      paySuccess(content)
      {
          this.ask.answers[0].content = content;
      },
      downRefresh(callback){
        this.getDetail(() => {
          this.$refs.discuss.resetList();
        });
      },
      toSeeHelp(){
        this.$router.pushPlus('/help/ask');
      },
      toAsk(){
        userAbility.jumpToAddAsk();
      },
      getDetail(successCallback = () => {
                }){

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

        this.id = id;

        postRequest(`answer/info`, {id: this.id}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
            this.$router.pushPlus('/task','' ,true, 'pop-in', 'hide', true);
            return;
          }

          this.ask = response.data.data;

          this.loading = 0;

          var username = this.answer.user_name ? this.answer.user_name : '';
          this.shareTitle = '问答|' + this.ask.question.description + '-' + username + '的回答';

          var currentUrl = '/askCommunity/interaction/answers/' + this.id;
          this.shareUrl  = process.env.API_ROOT + 'wechat/oauth?redirect=' + currentUrl;
          this.shareContent = username + '的回答，点击前往围观互动';

          successCallback();

        });
      }
    },
    watch: {
      '$route': 'getDetail'
    },
    created () {

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
