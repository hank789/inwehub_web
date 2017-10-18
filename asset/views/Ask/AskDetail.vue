<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">专业问答</h1>
    </header>

    <div class="mui-content absolute" v-show="!loading">

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

      <Comment v-show="ask.question.status===6"
               :answerId="ask.answers[0]?ask.answers[0].id:0"
               @finish="getDetail()"
      ></Comment>

      <Star-Rating v-if="ask.question.status===7"
                   :description="ask.feedback.description"
                   :rating="ask.feedback.rate_star"
                   :readOnly="true"
      ></Star-Rating>

      <Timeline
        :timelines="timelines"
      ></Timeline>

      <Discuss v-show="ask.question.status==6||ask.question.status==7"
         :answerId="ask.answers[0] ? ask.answers[0].id:0"
         ref="discuss"
      >
      </Discuss>

      <Share
        v-show="ask.question.status==6||ask.question.status==7"
        :title="shareOption.title"
        :link="shareOption.link"
        :content="shareOption.content"
        :imageUrl="shareOption.imageUrl"
        :thumbUrl="shareOption.thumbUrl"
        @success="shareSuccess"
        @fail="shareFail"
      ></Share>

    </div>
  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  import UserInfo from '../../components/question-detail/UserInfo.vue';
  import Question from '../../components/question-detail/Question.vue';
  import Discuss from '../../components/question-detail/Discuss.vue';
  import StarRating from '../../components/question-detail/StarRating.vue';
  import Statistics from '../../components/question-detail/Statistics.vue';
  import Timeline from '../../components/question-detail/Timeline.vue';
  import Answer from '../../components/question-detail/Answer.vue';
  import Comment from '../../components/question-detail/Comment.vue';
  import Share from '../../components/Share.vue';
  import {getAskCommunityMajorDetail} from '../../utils/shareTemplate';


  const AskDetail = {
    data: () => ({
      ask: {
        answers: [],
        question: {created_at: ''},
        feedback: {
          rate_star: 0
        },
        timeline: []
      },
      id: 0,
      shareOption:{
        title:'',
        link:'',
        content:'',
        imageUrl:'',
        thumbUrl:''
      },
      loading: true
    }),
    mounted(){
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
      Share
    },
    computed: {
      title(){
          switch(parseInt(this.ask.question.question_type)) {
            case 1:
                return '专业问答';
                break;
            case 2:
                return '悬赏问答';
                break;
          }
          return '提问';
      },
      timelines() {
        return this.ask.timeline.reverse();
      }
    },
    methods: {
      shareSuccess(){

      },
      shareFail(){

      },
      downRefresh(callback){
        this.getDetail(() => {
          this.$refs.discuss.resetList();
        });
      },
      refreshPageData(){
        this.loading = 1;
        this.getDetail();
      },
      getDetail(successCallback = () => {}){

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

        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
            this.$router.pushPlus('/task','' ,true, 'pop-in', 'hide', true);
            return;
          }

          this.ask = response.data.data;
          this.loading = 0;

          var answer = this.ask.answers[0] ? this.ask.answers[0] : {};
          var username = answer.user_name ? answer.user_name : '';

          this.shareOption = getAskCommunityMajorDetail(this.id, this.ask.question.description, username);

          successCallback();

        });
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      //showInwehubWebview();
      this.getDetail();
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
  .detail-answer-wait{
  	width: 100%;
  	background:#FFFFFF;
  	margin-bottom: 10px;
  	text-align: center;
  	padding: 20px 0;
  }
  .detail-answer-wait svg{
    font-size: 50px;

  }

  .detail-answer-wait  p{
  	 width: 100%;
  	 font-size: 12px;
  	 color:#c8c8c8;
  	 text-align: center;


  }

</style>
