<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{ getTitle() }}</h1>
    </header>

    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>

    <div class="mui-content" v-show="!loading">
      <div class="mui-table-view detail-ask">
        <div class="mui-table-view-cell">

          <div class="avatar">
            <div class="avatarInner">
              <img class="mui-media-object  avatar" :src="answer.question?answer.question.user_avatar_url:''">
            </div>
          </div>

          <div class="mui-media-body">
            {{ answer.question ? answer.question.user_name : '' }}

            <div>
              <span class="timeAgo"><timeago
                :since="answer.question.created_at?timeago(answer.question.created_at):''"></timeago></span>
              <span class="amount">悬赏金额<b>￥{{ answer.question ? answer.question.price : '' }}</b>元</span>
            </div>
          </div>

        </div>
        <div class="mui-table-view-cell question content">
          {{ answer.question ? answer.question.description : '' }}

        </div>
      </div>

      <div class="mui-row buttons" v-show="answer.question.status==2">
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn  mui-btn-block"
                  @tap.stop.prevent="selectTime"><span
            class="mui-icon fa fa-check-square-o"></span>确认应答

          </button>
        </div>
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn  mui-btn-block"
                  @tap.stop.prevent="$router.replace('/answerrefuse/' + answer.question.id)"><span
            class="mui-icon fa fa-times"></span>拒绝应答

          </button>
        </div>
      </div>



      <div class="form form-realAnswer" v-show="answer.question.status==4">
        <form>
          <div class="title">在这里留下您的回答：</div>
          <div class="textarea-wrapper">
            <textarea v-model.trim="description" placeholder="请填写回答"></textarea>
            <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
          </div>
          <span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>

          <div class="button-wrapper">
            <button type="button" class="mui-btn mui-btn-block mui-btn-primary"    @tap.stop.prevent="goAnswer">我回答好了</button>
          </div>
        </form>
      </div>



      <div class="mui-table-view timeEnd" v-show="answer.question.status==5">
        <div class="mui-table-view-cell">
          您已拒绝回答该问题
        </div>
      </div>

      <div class="mui-table-view detail-answer" v-show="answer.question.status==6 || answer.question.status==7">
        <div class="mui-table-view-cell">


          <div class="avatar">
            <div class="avatarInner">
              <img class="mui-media-object  avatar" :src="answer.answers[0]?answer.answers[0].user_avatar_url:''">
            </div>
          </div>

          <div class="mui-media-body">
            {{ answer.answers[0] ? answer.answers[0].user_name : '' }}

            <div>
              <span class="timeAgo"><timeago
                :since="answer.answers[0]?timeago(answer.answers[0].created_at):''"></timeago></span>
            </div>
          </div>

        </div>

        <div class="mui-table-view-cell question content">
          {{ answer.answers[0] ? answer.answers[0].content : '' }}

        </div>
      </div>

      <div class="mui-table-view detail-comment" v-show="answer.question.status==6">
        <div class="mui-table-view-cell">
          暂无评价

        </div>
      </div>


      <div class="mui-table-view detail-comment-result" v-show="answer.question.status==7">
        <div class="mui-table-view-cell">
          评价：<span class="ratingNum">{{ rating }}.0分</span>
          <star-rating :rating="rating" :star-size="20" :show-rating="showRating" :read-only="readOnly"></star-rating>
        </div>
        <div class="mui-table-view-cell content">
          {{ answer.feedback.description }}

        </div>
      </div>

      <div class="mb70"></div>

    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';


  const AnswerDetail = {
    data: () => ({
      showRating: false,
      readOnly: true,
      id: null,
      answer: {
        answers: [{
          promise_time: null
        }],
        question: {
          status: 0,
        },
        feedback: {}
      },
      description: '',
      descMaxLength: 1000,
      loading: true,
      loading_gif: loading_gif
    }),
    computed: {
      descLength() {
        return this.description.length;
      },
      rating() {
        return this.answer.feedback.rate_star;
      }
    },
    mounted(){

    },
    methods: {
      selectTime(){
        this.initDate();
      },
      goAnswer(){
        if (!this.description) {
          mui.toast('请填写回答内容');
          return;
        }

        var data = {
          question_id: this.id,
          description: this.description,
          promise_time: ''
        };

        postRequest(`answer/store`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          mui.toast(response.data.message);

          var id = response.data.data.id;
          this.getData();
        });
      },
      submit(time)
      {
        var data = {
          question_id: this.id,
          promise_time:time
        };

        postRequest(`answer/store`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          this.getData();
        });
      },
      initDate: function () {

        //普通示例
        var Picker = new mui.PopPicker();

        Picker.setData([
          {
            value: '0',
            text: '立刻回答'
          },
          {
            value: '15',
            text: '一刻钟后'
          },
          {
            value: '30',
            text: '半小时后'
          },
          {
            value: '60',
            text: '一小时后'
          },
          {
            value: '120',
            text: '两小时后'
          },
          {
            value: '180',
            text: '三小时后'
          },
          {
            value: '240',
            text: '四小时后'
          },
          {
            value: '360',
            text: '六小时后'
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
            case '15':
              selectTime = '0015';
              break;
            case '30':
              selectTime = '0030';
              break;
            case '60':
              selectTime = '0100';
              break;
            case '120':
              selectTime = '0200';
              break;
            case '240':
              selectTime = '0400';
              break;
            case '360':
              selectTime = '0600';
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
            if (this.answer.answers.length && this.answer.answers[0].promise_time != null) {
              title = '回答问题';
            } else {
              title = '确认时间';
            }
            break;
          default:
            title = '我的回答';
        }
        return title;
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
        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          this.answer = response.data.data;
          this.loading = 0;
        });
      }
    },
    created () {
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

      this.getData();
    }
  }
  export default AnswerDetail;
</script>


<style scoped>
  .detail-ask .question {
    position: relative;
    font-size: 13px;
    line-height: 18px;
  }

  .mui-media-body {
    padding-left: 10px;
  }

  .detail-ask .timeAgo {
    font-size: 12px;
    color: #8c8c8c;
  }

  .detail-ask .amount {
    position: absolute;
    bottom: 10px;
    right: 15px;
    color: #ff9800;
  }

  .detail-ask .question .amount b {
    font-weight: normal;
  }

  .buttons {
    margin-left: -1px;
  }

  .buttons button {
    margin: -1px;
    padding: 10px 0;
    border-right: 0px;
    border-radius: 0;
  }

  .buttons button .mui-icon {
    font-size: 24px;
    vertical-align: bottom;
    margin-right: 10px;
  }

  .detail-answer {
    margin-top: 15px;
  }

  .detail-answer .question {
    position: relative;
  }

  .detail-answer .timeAgo {
    font-size: 12px;
    color: #8c8c8c;

  }

  .detail-comment {
    margin-top: 15px;
    text-align: center;
  }

  .timeEnd {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .timeEnd .countDown {
    text-align: center;
    color: orange;
  }

  .star-rating {
    float: right;
  }

  .detail-comment-result {
    margin-top: 15px;
  }

  .detail-comment-result p {
    margin-top: 5px;
  }

  .ratingNum {
    float: right;
    margin-left: 10px;
    position: relative;
    bottom: -1px;
  }

  .content {
    font-size: 12px;
    line-height: 18px;
  }

  .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 40px;
    width: 40px;
    font-size: 20px;
    color: #ffffff;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .form-realAnswer{
    padding-top:10px;
  }
  .form-realAnswer textarea {
    width:100%;
    height:200px;
    border-radius: 5px;
    border:1px solid #bbbbbb;
  }
  .form-realAnswer .title{
    margin-left:10px;
    height:32px;
  }


  .form-realAnswer .button-wrapper{
    margin-top:15px;
    padding:0 50px 15px;
  }

  .textarea-wrapper{
    position: relative;
  }
  .textarea-wrapper .counter{
    position: absolute;
    right: 10px;
    bottom: 25px;
    font-size:12px;
    color:#999;
  }
  .desc{
    padding-top:15px;
    color:#999;
  }
</style>
