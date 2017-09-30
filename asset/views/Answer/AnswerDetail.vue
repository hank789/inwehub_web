<template>
  <div>

    <header class="mui-bar mui-bar-nav mui-bar-top">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{ title }}</h1>
    </header>

    <div class="mui-content" v-show="!loading">

      <Question
        :ask="answer.question"
        :isFollow="true"
      ></Question>


      <div class="mui-row buttons" v-show="answer.question.status===2">
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn mui-btn-block mui-btn-grey"
                  @tap.stop.prevent="$router.pushPlus('/answerrefuse/' + answer.question.id)">
            拒绝应答
          </button>
        </div>
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @tap.stop.prevent="selectTime">
            确认应答
          </button>
        </div>

      </div>


      <div class="form form-realAnswer" v-show="answer.question.status===4">

        <div class="button-wrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @tap.stop.prevent="$router.push('/realAnswer/'+id)">添加回答内容

          </button>
        </div>

        <span class="time" v-if="startCountdown(answer.question)">倒计时<count-down :start-time="currentTime"
                                                                                 :end-time="getEndTime(answer.question)"
                                                                                 :dayTxt="':'" :hourTxt="':'"
                                                                                 :minutesTxt="':'"></count-down></span>

        <span class="time" v-else-if="isTimeout(answer.question)"><b>已超时</b><timeago
          :since="timeago(answer.question.promise_answer_time)"
          :auto-update="60" locale="zh-Diff"></timeago></span>

        <span class="time" v-else><b v-show="isTimeout(answer.question)">已超时</b><timeago
          :since="timeago(answer.question.created_at)" :auto-update="60" locale="zh-Diff"></timeago></span>
      </div>


      <div class="mui-table-view timeEnd" v-show="answer.question.status===5">
        <div class="mui-table-view-cell">
          您已拒绝回答该问题
        </div>
      </div>


      <Answer v-show="answer.question.status==6||answer.question.status==7"
              :answer="answer.answers[0] ? answer.answers[0]:{}"
              :isFollow="false"
      ></Answer>

      <div class="mb70"></div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import Question from '../../components/question-detail/Question.vue';
  import Answer from '../../components/question-detail/Answer.vue';

  import CountDown from 'vue2-countdown';

  const AnswerDetail = {
    data: () => ({
      id: null,
      currentTime: (new Date()).getTime(),
      answer: {
        answers: [{
          promise_time: null
        }],
        question: {
          status: 0,
          created_at: ''
        },
        feedback: {}
      },
      title: '回答问题',
      description: {},
      descLength: 0,
      loading: true,
      buttonAnswerDisable: false,
      buttonSelectTimeDisable: false,
    }),
    components: {
      CountDown,
      Question,
      Answer
    },
    computed: {},
    mounted(){
      window.addEventListener('refreshData', (e) => {
        //执行刷新
        console.log('refresh-answerDetail');
        this.getData();
      });
    },
    methods: {
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      isTimeout(question){
        if (!question.promise_answer_time) {
          return false;
        }

        var endtime = this.getEndTime(question);
        var currentTime = (new Date()).getTime() / 1000;
        if (endtime < currentTime) {
          return true;
        }

        return false;
      },
      startCountdown(question){
        var endtime = this.getEndTime(question);
        var currentTime = (new Date()).getTime() / 1000;
        if (endtime < currentTime) {
          return false;
        }
        return true;
      },
      getEndTime(question){
        var deadline = question.promise_answer_time;
        if (deadline) {
          return Date.parse(deadline.replace(/-/g, "/")) / 1000;
        }
        return null;
      },
      check(){
        //信息是否完善
        const currentUser = localEvent.getLocalItem('UserInfo');
        if (currentUser.hasOwnProperty('account_info_complete_percent') && parseInt(currentUser.account_info_complete_percent) < 90) {
          mui.alert('您的个人信息还不完善，请先前往我的个人档案中补充完整才能应答。 ', null, null, () => {
            this.$router.replace('/my/info');
          });
        }
      },
      selectTime(){
        this.initDate();
      },
      submit(time)
      {
        var data = {
          question_id: this.id,
          promise_time: time
        };

        if (this.buttonSelectTimeDisable) {
          return;
        }

        this.buttonSelectTimeDisable = true;

        postRequest(`answer/store`, data).then(response => {
          this.buttonSelectTimeDisable = false;
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          if (time != '0000') {
            this.getData();
          } else {
            this.getData();
          }
        });
      },
      initDate: function () {

        //普通示例
        var Picker = new mui.PopPicker();

        Picker.setData([
//          {
//            value: '0',
//            text: '立刻回答'
//          },
          {
            value: '120',
            text: '2小时内回答'
          },
          {
            value: '360',
            text: '6小时内回答'
          },
          {
            value: '720',
            text: '12小时内回答'
          },
          {
            value: '1440',
            text: '24小时内回答'
          }
        ]);

        var selectTime = '';
        Picker.show((rs) => {
          Picker.dispose();
          var value = rs[0].value;
          switch (value) {
            case '0':
              selectTime = '0000';
              break;
            case '120':
              selectTime = '0200';
              break;
            case '360':
              selectTime = '0600';
              break;
            case '720':
              selectTime = '1200';
              break;
            case '1440':
              selectTime = '2400';
              break;
            default:
              selectTime = '';
              break;
          }

          mui.confirm("选择确定后您将不能拒绝回答该问题了，并请在承诺的反馈时间内回答。", null, ['取消', '确定'], e => {
            if (e.index == 1) {
              this.submit(selectTime);
            }
          }, 'div');

        });


      },
      getTitle()
      {
        var status = this.answer.question.status;
        var title = '';
        switch (status) {
          case 2:
            title = '确认应答';
            break;
          case 4:
            if (this.answer.answers.length && this.answer.answers[0].promise_time) {
              title = '回答问题';
            } else {
              title = '回答问题';  //确认时间
            }
            break;
          default:
            title = '我的回答';
        }

        this.$emit('changeWechatTitle', title);

        this.title = title;
      },
      timeago(time) {
        if (!time) {
          return '';
        }
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      getData(){
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

          this.answer = response.data.data;

          this.loading = 0;

          this.getTitle();

          this.check();
        });
      }
    },
    beforeRouteLeave(to, from, next) {
      var popDiv = document.querySelector('.mui-dtpicker');
      if (popDiv) {
        document.body.removeChild(popDiv);
      }


      popDiv = document.querySelector('.mui-poppicker');
      if (popDiv) {
        document.body.removeChild(popDiv);
      }

      next();
    },
    watch: {
      descLength: function (newDescLength) {

      },
      '$route': 'getData'
    },
    created () {
      //showInwehubWebview();
      this.getData();
    }
  }
  export default AnswerDetail;
</script>


<style scoped>
  .mui-content{
    background: #fff;
  }

  .buttons{
    margin-top:5px;
  }
  .buttons .mui-col-sm-6{
      padding:15px;
  }


  .timeEnd {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .timeEnd .countDown {
    text-align: center;
    color: orange;
  }

  .form-realAnswer {
    padding-top: 20px;
    padding-bottom: 20px;
    background: #fff;
    position: relative;
  }

  .form-realAnswer:after {
    display: none;
    position: absolute;
    content: '';
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .form-realAnswer textarea {
    background: none;
    width: 100%;
    height: 200px;
    border: none;
  }

  .form-realAnswer .title {
    margin-left: 10px;
    height: 32px;
  }

  .form-realAnswer .button-wrapper {
    padding: 0 15px 0;
  }

  .form-realAnswer .time {
    font-size: 12px;
    color: #fa4975;
    padding-left:15px;
  }

  .form-realAnswer .time b {
    font-weight: normal;
    margin-right: 5px;
  }

  .mui-table-view-cell:after {
    display: none;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }

  .time div {
    display: inline-block;
    margin-left: 5px;
  }


</style>
