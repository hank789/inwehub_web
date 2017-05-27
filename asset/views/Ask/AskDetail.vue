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
              </div>
          </div>
        </div>
        <div class="mui-table-view-cell question content">
          提问：{{ ask.question.description }}

        </div>
        <div class="collectWrapper">
           <div class="collect"><span class="mui-icon fa fa-heart"></span></div> <span class="amount">提问金额<b>￥{{ ask.question.price }}</b>元</span>
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
          回答：{{ ask.answers[0] ? ask.answers[0].content : '' }}

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

        <div class="mui-table-view-cell content">
          评价：{{ ask.feedback.description }}

        </div>
        <div class="mui-table-view-cell">
          <span class="ratingNum">{{ rating }}.0分</span>
          <star-rating :rating="rating" :padding="8" :star-size="25" :activeColor="'#F6A623'" :show-rating="showRating" :read-only="readOnly"></star-rating>
        </div>
      </div>

      <div class="mui-table-view detail-ask-timeline">
        <div class="mui-table-view-cell">

          <div class="timeline">
              <template v-for="(item, index) in timelines">
                <div class="nearsite-message">
                  <div class="timage">
                    <span class="mui-icon myicon myicon-askDetailHeart" v-if="!index"></span>
                    <span class="mui-icon myicon myicon-askDetailJia" v-else></span>
                  </div>
                  <div class="desc">
                    <div class="title">{{ item.title }} </div>
                    <span>{{ item.description }}</span>
                  </div>
                  <timeago class="timeago" :since="getTime(item.created_at)"></timeago>
                </div>
                <div class="vertbar" v-show="index != timelines.length-1"></div>
              </template>
          </div>
        </div>
      </div>

      <div id="commentWapper" class="mui-popover mui-popover-action mui-popover-bottom">
        <div class="form form-realAnswer">
          <div class="shutdown" @tap.stop.prevent="cancelComment"><span class="mui-icon fa fa-times"></span></div>

          <div class="submit mui-btn-link" @tap.stop.prevent="submitComment" v-show="!commentState">提交</div>

          <star-rating @rating-selected="setRating" :padding="20" :star-size="30" :show-rating="showRating" v-show="!commentState"></star-rating>

          <div class="title" v-show="!commentState">{{ starDesc }}</div>

          <div class="textarea-wrapper" v-show="!commentState">
            <textarea v-model.trim="description" placeholder="在这里留下你的反馈"></textarea>
            <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
          </div>

          <div class="successWrapper" v-show="commentState">
              <div class="mui-icon fa fa-check-circle"></div>
              <div class="sTitle">感谢您的认真评价，我们非常珍惜您的反馈！</div>
          </div>
          <!--<span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>-->

        </div>
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
      descMaxLength: 500,
      buttonCommentDisabled:false,
      commentState:false //是否已评价
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
      cancelComment(){
          if (this.commentState) {
              this.getDetail();
          }
          this.comment();
      },
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


        if (this.buttonCommentDisabled) {
            return;
        }
        this.buttonCommentDisabled = true;
        postRequest(`answer/feedback`, data).then(response => {
          this.buttonCommentDisabled = false;
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          this.commentState = true;
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
      },
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength);
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
  .detail-ask{
    padding-bottom:5px;
  }
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
    color: #777;
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
    margin-top: -1px;
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
    margin-top: -1px;
    padding:5px 0 8px;
  }

  .detail-comment {
    margin-top: 15px;
    text-align: center;
  }

  .detail-comment-result {
    margin-top: -1px;
    padding-top:15px;
    padding-bottom:0;
    text-align: left;
  }

  .star-rating {
    color: #f85f48;
    float: left;
  }

  .detail-comment-result p {
    margin-top: 5px;
  }



  .timeago {
    display: inline-block;
    color: #777;
    margin-top: 10px;
  }

  .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 45px;
    width: 45px;
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
    bottom: -3px;
  }

  .content {
    line-height: 18px;
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
    border:none;
    padding:10px 15px 0;
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
    padding-bottom:20px;
    position: relative;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
  }

  .textarea-wrapper textarea{
    margin:0;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 10px;
    font-size: 12px;
    bottom: 10px;
    color: #999;
  }

  .form-realAnswer .textarea-wrapper .counter {
    bottom: 2px;
  }

  .successWrapper{
    text-align: center;
    padding:40px 0;
  }
  .successWrapper .mui-icon{
    font-size:40px;
    color:#ff9800;
  }
  .successWrapper .sTitle{
    margin-top:20px;
  }

  .mui-content > .mui-table-view:first-child{
    margin-top:0;
  }

  /*timeline*/
  .nearsite-message{
    display: inline-block;
    clear:both;
    width:100%;
    position: relative;
    padding: 10px 10px 10px 15px;
  }
  .nearsite-message .timage{
    float: left;
    margin-top: 22px;
  }
  .nearsite-message .timage img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .nearsite-message .desc{
    float: left;
    background: #fff;
    margin: 0 10px 10px 10px;
    padding: 10px;
    border-radius:7px;
    max-width: 90%;
    position: relative;
    min-height: 20px;
    font-size:12px;
  }
  .nearsite-message .desc img{
    width: 100%;
  }

  .desc span{
    color:#777;
  }

  .nearsite-message .triangle{
    height:0px;
    width:0px;
    border-width:8px;
    border-style:solid;
    position: absolute;
    top:6px;
    border-color:transparent #fff transparent transparent;
    left:-16px;
  }
  .vertbar{
    width: 1px;
    height: 70px;
    background-color: #a2a2a2;
    margin: -47px 25px -38px;
  }

  .timeline .timage .mui-icon{
    width:22px;
    height:22px;
    color:#4990E2;
    font-size:12px;
  }

  .timeline time{
    position: absolute;
    right:15px;
  }

  .timeline{
    font-size:12px;
  }

  .collectWrapper{
    padding:10px 0;
  }

  .collectWrapper .amount{
    float:right;
    color:#F6A623;
    font-size:14px;
    margin-right:20px;
    margin-top:5px;
  }

  .collect{
    display: inline-block;
    border: 1px solid #4990E2;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size:12px;
    text-align: center;
    margin-left:20px;
  }
  .collect .mui-icon{
    color:#4990E2;
  }

  .mui-table-view-cell:after{
    display: none;
  }

</style>
