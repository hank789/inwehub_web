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
            {{ answer.question?answer.question.user_name:'' }}
            <div>
             <span class="timeAgo"><timeago :since="answer.question.created_at?timeago(answer.question.created_at):''"></timeago></span>
            <span class="amount">悬赏金额<b>￥{{ answer.question?answer.question.price:'' }}</b>元</span>
            </div>
          </div>

        </div>
        <div class="mui-table-view-cell question content">
          {{ answer.question?answer.question.description:'' }}
        </div>
      </div>

      <div class="mui-row buttons" v-show="answer.question.status==2">
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn  mui-btn-block"
                  @tap.stop.prevent="$router.replace('/answerTime/' + answer.question.id)"><span
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

      <div class="mui-table-view timeEnd" v-show="answer.question.status==5">
        <div class="mui-table-view-cell">
            您已拒绝回答该问题
       </div>
      </div>

      <div class="mui-table-view timeEnd" v-show="answer.question.status==4">
        <div class="mui-table-view-cell">

          <div class="countDown">{{ answer.question.status_description }}</div>

          <div class="mui-content-padded">
            <button type="button" class="mui-btn mui-btn-primary mui-btn-block" @tap.stop.prevent="$router.push('/realAnswer/' + id)">立即回答</button>
          </div>
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
            {{ answer.answers[0]?answer.answers[0].user_name:'' }}
            <div>
            <span class="timeAgo"><timeago :since="answer.answers[0]?timeago(answer.answers[0].created_at):''"></timeago></span>
            </div>
          </div>

        </div>

        <div class="mui-table-view-cell question content">
          {{ answer.answers[0]?answer.answers[0].content:'' }}
        </div>
      </div>

      <div class="mui-table-view detail-comment" v-show="answer.question.status==6">
        <div class="mui-table-view-cell">
          暂无评价
        </div>
      </div>


      <div class="mui-table-view detail-comment-result" v-show="answer.question.status==7">
        <div class="mui-table-view-cell">
          评价：<span class="ratingNum">{{ rating }}.0分</span><star-rating :rating="rating" :star-size="20" :show-rating="showRating" :read-only="readOnly"></star-rating>
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
      showRating:false,
      readOnly:true,
      id:null,
      answer: {
        answers:[{
          promise_time:null
        }],
        question:{
            status:0,
        },
        feedback:{}
      },
      loading: true,
      loading_gif: loading_gif
    }),
    computed: {
      rating() {
        return this.answer.feedback.rate_star;
      }
    },
    mounted(){

    },
    methods: {
      getTitle()
      {
          var status = this.answer.question.status;
          var title = '';
          switch(status){
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

      postRequest(`question/info`, {id: id}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          this.$router.go(-1);
        }

        this.answer = response.data.data;
        this.loading = 0;
      });
    }
  }
  export default AnswerDetail;
</script>


<style scoped>
  .detail-ask .question {
    position: relative;
    font-size:13px;
    line-height:18px;
  }

  .mui-media-body{
    padding-left:10px;
  }

  .detail-ask .timeAgo {
    font-size:12px;
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
    margin-right:10px;
  }

  .detail-answer {
    margin-top: 15px;
  }

  .detail-answer .question {
    position: relative;
  }

  .detail-answer .timeAgo {
    font-size:12px;
    color: #8c8c8c;

  }

  .detail-comment {
    margin-top: 15px;
    text-align: center;
  }

  .timeEnd{
    margin-top:15px;
    margin-bottom:15px;
  }
  .timeEnd .countDown{
    text-align:center;
    color:orange;
  }
  .star-rating{
    float:right;
  }

  .detail-comment-result{
    margin-top:15px;
  }

  .detail-comment-result p{
    margin-top:5px;
  }

  .ratingNum{
    float:right;
    margin-left:10px;
    position:relative;
    bottom:-1px;
  }

  .content{
    font-size:12px;
    line-height: 18px;
  }

  .avatar{
    z-index: 0;
    color: #ffffff;
    float:left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 40px;
    width: 40px;
    font-size: 20px;
    color: #ffffff;
    text-align: center;
    border-radius: 50%;
  }


  .avatar .avatarInner{
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
</style>
