<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答详情</h1>
    </header>

    <div id="refreshContainer" class="mui-content mui-scroll-wrapper" v-show="!loading">
      <div class="mui-scroll">
        <Question
          :ask="ask.question"
          :isFollow="true"
        ></Question>

        <Answer v-show="ask.question.status==6||ask.question.status==7"
                :answer="answer"
                :needMoney="true"
                :isFollow="true"
                @paySuccess="paySuccess"
        ></Answer>


        <div class="mui-table-view detail-answer" v-show="ask.question.status!=6&&ask.question.status!=7">
          <div class="mui-table-view-cell">
            暂无回答
          </div>
        </div>


        <Discuss
          :answerId="ask.answers[0] ? ask.answers[0].id:0"
          ref="discuss"
          v-show="ask.answers[0] && ask.answers[0].content"
        ></Discuss>

        <div class="help">
          <div class="title">
            什么是专业问题
          </div>
          <div class="body">
            InweHub致力于营造高品质专家帮助社区，通过平台入驻的专家，解决您面临的咨询或SAP的相关疑问。
            专家准入具有较高门槛，我们会根据您的提问自动匹配回答专家，提问请遵守相关<a @tap.stop.prevent="toSeeHelp()">问答规范</a>。

          </div>
        </div>

        <div class="buttonWrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="toAsk()">
            我也要提问

          </button>
        </div>

      </div>

    </div>


    <Share
      :title="'test'"
      :link="'test'"
      :content="'test'"
      :imageUrl="''"
      :thumbUrl="''"
    ></Share>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  import Question from '../../components/question-detail/Question.vue';
  import Discuss from '../../components/question-detail/Discuss.vue';
  import Answer from '../../components/question-detail/Answer.vue';
  import Comment from '../../components/question-detail/Comment.vue';
  import Share from '../../components/Share.vue';

  import userAbility from '../../utils/userAbility';
  import PageDown from '../../components/refresh/PageDown.vue';


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
      loading: true
    }),
    mounted(){
      mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            auto: false,//可选,默认false.首次加载自动下拉刷新一次
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback :this.downRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          },
          up: {
            contentrefresh: '',
            contentnomore: null, //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: this.$refs.discuss.getList
          }
        }
      });
      window.addEventListener('refreshData', (e) => {
        //执行刷新
        console.log('refresh-answerDetail');
        this.getDetail();
      });
    },
    components: {
      Question,
      Discuss,
      Answer,
      Comment,
      Share,
      PageDown
    },
    computed: {
        answer () {
          return this.ask.answers[0] ? this.ask.answers[0]:{};
      }
    },
    methods: {

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

        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
            this.$router.pushPlus('/task', true, 'pop-in', 'hide', true);
          }

          this.ask = response.data.data;

          this.loading = 0;

          successCallback();
          mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
          mui('#refreshContainer').pullRefresh().enablePullupToRefresh();//启用上拉刷新
        });
      }
    },
    watch: {
      '$route': 'getDetail'
    },
    created () {
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
