<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">提问</h1>
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
              <img class="mui-media-object  avatar" :src="ask.question.user_avatar_url">
            </div>
          </div>

          <div class="mui-media-body">
            {{ ask.question.user_name }}

            <div>
              <span class="timeAgo"><timeago :since="getTime(ask.question.created_at)"></timeago></span>
              <span class="amount">悬赏金额<b>￥{{ ask.question.price }}</b>元</span></div>
          </div>
        </div>
        <div class="mui-table-view-cell question content">
          {{ ask.question.description }}

        </div>
      </div>

      <div class="mui-table-view detail-answer" v-show="ask.question.status==6||ask.question.status==7">
        <div class="mui-table-view-cell">
          <div class="avatar">
            <div class="avatarInner">
              <img class="mui-media-object  avatar" :src="ask.answers[0]?ask.answers[0].user_avatar_url:''">
            </div>
          </div>
          <div class="mui-media-body">
            {{ ask.answers[0] ? ask.answers[0].user_name : '' }}

            <div><span class="timeAgo"><timeago :since="ask.answers[0]?getTime(ask.answers[0].created_at):''"></timeago></span>
            </div>
          </div>
        </div>
        <div class="mui-table-view-cell question content">
          {{ ask.answers[0] ? ask.answers[0].content : '' }}

        </div>
      </div>

      <div class="mui-table-view detail-answer" v-show="ask.question.status!=6&&ask.question.status!=7">
        <div class="mui-table-view-cell">
          暂无回答

        </div>
      </div>

      <div class="buttonWrapper" v-show="ask.question.status==6">

        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="comment">评价本次回答
        </button>

      </div>

      <div class="mui-table-view detail-comment-result" v-show="ask.question.status==7">
        <div class="mui-table-view-cell">
          评价：<span class="ratingNum">{{ rating }}.0分</span>
          <star-rating :rating="rating" :star-size="20" :show-rating="showRating" :read-only="readOnly"></star-rating>
        </div>
        <div class="mui-table-view-cell content">
          {{ ask.feedback.description }}


        </div>
      </div>

      <div class="mui-table-view detail-ask-timeline">
        <div class="mui-table-view-cell">
          <div class="timeline timeline-collapsing">

            <div class="timeline-block" v-for="(item, index) in timelines">
              <div class="timeline-icon"></div>
              <div class="timeline-content">
                {{ item.title }}<br/>
                <timeago class="timeago" :since="getTime(item.created_at)"></timeago>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="commentWapper" class="mui-popover mui-popover-action mui-popover-bottom">
        <div class="form form-realAnswer">
          <div class="shutdown" @tap.stop.prevent="comment"><span class="mui-icon fa fa-times"></span></div>
          <div class="submit mui-btn-link" @tap.stop.prevent="submitComment">提交</div>

          <star-rating @rating-selected="setRating" :padding="20" :star-size="30" :show-rating="showRating"></star-rating>

          <div class="title">{{ starDesc }}</div>

          <div class="textarea-wrapper">
            <textarea v-model.trim="description" placeholder="在这里留下你的反馈"></textarea>
            <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
          </div>
          <span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>

        </div>
      </div>

      <div class="mui-clearfix mb70">
      </div>
    </div>
  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';


  const AskDetail = {
    data: () => ({
      showRating: false,
      readOnly: true,
      ask: {
        answers: [],
        question: {created_at: ''},
        feedback: {
          rate_star: 0
        },
        timeline: []
      },
      id: 0,
      loading: true,
      loading_gif: loading_gif,
      description: '',
      rateStar: 0,
      starDesc: '评价会让我们做的更好',
      descMaxLength: 500
    }),
    mounted(){
      mui.init({swipeBack: true});
    },
    computed: {
      rating() {
        return this.ask.feedback.rate_star;
      },
      timelines() {
        return this.ask.timeline.reverse();
      },
      descLength() {
        return this.description.length;
      }
    },
    methods: {
      submitComment(){
        if (!this.rateStar) {
          mui.toast('别忘了打分');
          return;
        }

        if (!this.description) {
          mui.toast('请填写反馈内容');
          return;
        }

        var data = {
          answer_id: this.ask.answers[0].id,
          description: this.description,
          rate_star: this.rateStar
        };

        postRequest(`answer/feedback`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          this.comment();

          this.getDetail();
        });
      },
      setRating: function (rating) {
        this.rateStar = rating;
      },
      comment(){
        mui('#commentWapper').popover('toggle');
      },
      getDetail(){
        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          this.ask = response.data.data;
          this.loading = 0;
        });
      },
      getTime(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      }
    },
    watch: {
      rateStar: function (newRateStar) {
        switch (newRateStar) {
          case 0:
            this.starDesc = '评价会让我们做的更好';
            break;
          case 1:
            this.starDesc = '非常不满意';
            break;
          case 2:
            this.starDesc = '不太满意';
            break;
          case 3:
            this.starDesc = '一般，还需要改善';
            break;
          case 4:
            this.starDesc = '比较满意';
            break;
          case 5:
            this.starDesc = '非常满意';
            break;
        }
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
      this.getDetail();
    }
  }
  export default AskDetail;
</script>


<style scoped>
  .detail-ask .question {
    position: relative;
  }

  .detail-ask .mui-media-body {
    padding-left: 10px;
  }

  .detail-answer .mui-media-body {
    padding-left: 10px;
  }

  .detail-ask .mui-media-body .timeAgo {
    color: #999;
    font-size: 14px;
  }

  .detail-answer .question {
    position: relative;
  }

  .detail-answer .timeAgo {
    color: #999;
    font-size: 14px;
  }

  .detail-ask .mui-media-body .amount {
    position: absolute;
    bottom: 10px;
    right: 15px;
    color: #ff9800;
  }

  .detail-ask .mui-media-body .amount b {
    font-weight: normal;
  }

  .detail-ask-timeline {
    margin-top: 15px;
    padding-bottom: 10px;
  }

  .status {
    background-color: #fff;
    margin-top: 15px;
    padding: 20px;
  }

  .status .mui-icon {
    float: left;
    font-size: 30px;
    color: #007aff;
    margin-right: 20px;
  }

  .detail-answer {
    margin-top: 15px;
  }

  .detail-comment {
    margin-top: 15px;
    text-align: center;
  }

  .detail-comment-result {
    margin-top: 15px;
    text-align: left;
  }

  .star-rating {
    color: #f85f48;
    float: right;
  }

  .detail-comment-result p {
    margin-top: 5px;
  }

  .timeline {
    box-sizing: border-box;
    background: #fff;
  }

  .timeline::before {
    box-sizing: border-box;
  }

  .timeline * {
    box-sizing: border-box;
  }

  .timeline *::before {
    box-sizing: border-box;
  }

  /* Main logic */
  .timeline {
    position: relative;
    font-size: 1em;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow-y: hidden;
  }

  .timeline .timeline-icon {
    position: absolute;
    width: 10px;
    height: 10px;
    left: 50%;
    margin-left: -16px;
    margin-top: 18px;
    border: 2px solid #999;
    border-radius: 100%;
    background-color: white;
    text-align: center;
  }

  .timeline .timeline-icon.timeline-icon-hide-border {
    border: 0;
  }

  .timeline .timeline-icon.timeline-icon-hide-border i.fa, .timeline .timeline-icon.timeline-icon-hide-border img {
    margin-left: 0;
    margin-top: 0;
  }

  .timeline .timeline-icon i.fa, .timeline .timeline-icon img {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-left: -4px;
    margin-top: -4px;
    vertical-align: bottom;
    line-height: 32px;
    text-align: center;
    font-size: 30px;
  }

  .timeline .timeline-icon img {
    border-radius: 100%;
  }

  .timeline .timeline-content {
    position: relative;
    width: 45%;
    padding: 12px;
    color: #999;
    line-height: 20px;
    min-height: 64px;
  }

  .timeline .timeline-date {
    position: absolute;
    width: auto;
    top: 0;
    left: 118%;
    font-size: 80%;
  }

  .timeline::before {
    position: absolute;
    width: 2px;
    height: 100%;
    top: 26px;
    left: 50%;
    margin-left: -1px;
    /* Half of width */
    background-color: #CFCFC4;
    content: "";
  }

  .timeline.timeline-collapsing::before {
    left: auto;
    margin-left: 30px;
  }

  .timeline.timeline-collapsing .timeline-block {
    margin-left: 42px;
    margin-right: 10px;
  }

  .timeline.timeline-collapsing .timeline-icon {
    left: auto;
    margin-left: -16px;
  }

  .timeline.timeline-collapsing .timeline-content {
    width: auto;
  }

  .timeline.timeline-collapsing .timeline-date {
    width: auto;
    left: 0;
    margin-left: -130px;
    text-align: right;
  }

  .timeline .timeline-block:first-child .timeline-icon {
    border-color: #FF6961;
  }

  .timeline .timeline-block:first-child .timeline-content {
    color: #3f3f3f;
  }

  .timeago {
    display: inline-block;
    color: #007aff;
    margin-top: 10px;
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

  .detail-ask-timeline .mui-table-view-cell {
    padding-right: 0;
    padding-left: 0;
  }

  .ratingNum {
    float: right;
    margin-left: 10px;
    position: relative;
    bottom: -1px;
  }

  .content {
    line-height: 18px;
    font-size: 12px;
  }

  .buttonWrapper {
    padding: 10px 50px 0;
  }

  .form-realAnswer {
    position: relative;
    background: #fff;
    padding: 20px 5px;
    text-align: center;
  }

  .form-realAnswer .shutdown {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size:24px;
  }

  .form-realAnswer .star-rating {
    float: none;
    position: relative;
    left: 50%;
    margin-top: 10px;
    margin-left: -115px;
  }

  .starRating span{
    margin:0 5px;
  }

  .form-realAnswer .submit {
    position: absolute;
    right: 10px;
    top: 4px;
  }

  .form-realAnswer textarea {
    margin-top: 20px;
    width: 100%;
    height: 138px;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
  }

  .form-realAnswer .title {
    margin-top: 5px;
    font-size: 12px;
    color: #ff9800;
    height: 32px;
  }

  .form-realAnswer .button-wrapper {
    margin-top: 15px;
    padding-bottom: 15px;
  }

  .textarea-wrapper {
    position: relative;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 10px;
    font-size: 12px;
    bottom: 30px;
    color: #999;
  }

  .form-realAnswer .textarea-wrapper .counter {
    bottom: 22px;
  }
</style>
