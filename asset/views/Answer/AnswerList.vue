<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的回答</h1>
    </header>

    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>

    <div id="pullrefresh" class="mui-content mui-scroll-wrapper">
    <div class="mui-scroll">

    <div class="mui-content" v-if="nothing == 0">
      <div class="list-answer">

        <div class="mui-table-view list-answer-item"  v-for="(answer, index) in answers" @tap.stop.prevent="$router.push('/answer/' + answer.question_id)">
          <div class="mui-table-view-cell mui-media">
            <div class="person">
              <div class="avatar">
                <div class="avatarInner">
                  <img :src="answer.user_avatar_url?answer.user_avatar_url:'images/uicon.jpg'" class="avatar"/>
                </div>
              </div>
              <div class="mui-media-body">
                <span class="username">{{ answer.user_name }}</span>
                <div>
                  <span class="time"><timeago :since="timeago(answer.created_at)"></timeago></span>
                  <span class="amount">悬赏金额<b>￥{{ answer.price }}</b>元</span>
                </div>
              </div>
            </div>
            <div class="site-desc mui-ellipsis-2">
              {{ answer.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
    </div>

    <div class="mui-content list-empty" v-if="nothing == 1">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无任务</div>
            <div class="subTitle">稍安勿躁，是金子总会发光！平台正准备给您一展风采的机会呢！</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE, ANSWERS_INFO, ANSWERS_LIST, ANSWERS_INFO_APPEND, ANSWERS_LIST_APPEND} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';


  const AnswerList = {
    data: () => ({
      answers: [],
      loading:true,
      loading_gif:loading_gif
    }),
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
        return this.answers.length ? 0 : 1;
      },
      topId () {
        if (this.answers.length) {
          return this.answers[0].id;
        }
        return 0;
      },
      bottomId () {
        var length = this.answers.length;
        if (length) {
          return this.answers[length-1].id;
        }
        return 0;
      },
      lastY (){
        return this.$store.state.answers.info.lastY;
      }
    },
    updated(){
      this.$store.dispatch(ANSWERS_LIST_APPEND, this.answers);
    },
    created(){
      var list = [];//this.$store.state.answers.list;
      if (list.length) {
        this.answers = list;
        this.loading = false;
      }
    },
    mounted(){

      var t = this;
      mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function(event){
        var lastY = event.detail.lastY;
        t.$store.dispatch(ANSWERS_INFO_APPEND, {lastY:lastY});
      });

      mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore:'',
            callback: pullupRefresh
          }
        }
      });

      var that = this;

      function pulldownRefresh() {
        that.getPrevList();
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
      }

      function pullupRefresh() {
        that.getNextList();
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
      }

      if (mui.os.plus) {
        mui.plusReady(function () {

            if (!that.answers.length) {
              mui('#pullrefresh').pullRefresh().pullupLoading();
            }
            mui('#pullrefresh').pullRefresh().scrollTo(0,t.lastY,0)


        });
      } else {
        mui.ready(function () {

          if (!that.answers.length) {
            mui('#pullrefresh').pullRefresh().pullupLoading();
          }
          mui('#pullrefresh').pullRefresh().scrollTo(0,t.lastY,0)
        });
      }
    },
    filters: {
       textLimit(text){
           var limit = 70;
           if (text.length > limit) {
               text = text.slice(0, limit) + '...';
           }
           return text;
       }
    },
    methods: {
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      getPrevList(){

        postRequest(`answer/myList`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          if (response.data.data.length > 0) {
            this.answers = response.data.data;
          }
          this.loading = 0;
        });
      },
      getNextList() {

        postRequest(`answer/myList`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          if (response.data.data.length > 0) {
            this.answers = this.answers.concat(response.data.data);
          }
          this.loading = 0;
        });
      }
    }
  }
  export default AnswerList;
</script>


<style scoped>
  .list-answer .list-answer-item{
    margin-top:10px;
    position:relative;
    line-height: 40px;
  }

  .list-answer .list-answer-item .title{
    line-height:28px;
  }

  .list-answer .list-answer-item .mui-media-body {
    padding-left:15px;
    line-height: 21px;
  }
  .list-answer .list-answer-item .time{
    color:#8c8c8c;
    font-size:12px;
  }

  .list-answer .username{
    color:#101010;
  }

  .list-answer .list-answer-item .amount{
    position: absolute;
    right: 10px;
    color:#ff9800;
    font-size:16px;
  }

  .list-answer .list-answer-item .amount b{

    font-weight:normal;
  }

  .list-answer .person{
    margin-top:10px;
  }


  .list-answer .site-desc{
    margin-top:10px;
    padding-left: 10px;
    line-height: 18px;
    color:#101010;
    font-size:13px;
  }

  .list-answer .site-desc .mui-icon{
    font-size:16px;
  }

  .list-answer .avatar{
    z-index: 0;
    color: #ffffff;
    float:left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 40px;
    width: 40px;
    font-size: 20px;
    color: #ffffff;
    background-color: #bdbdbd;
    text-align: center;
    border-radius: 50%;
  }


  .list-answer .avatar .avatarInner{
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

  .list-answer .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .list-answer .mui-table-view-cell{
    padding:11px 8px;
  }

  .list-answer .mui-table-view-cell > a:not(.mui-btn){
    margin: -11px -8px;
  }
  .list-answer p{
    margin-left:20px;
  }

  .list-answer .person{
    position: relative;
    padding-bottom:15px;
  }

  .list-answer .person:after{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 10px;
    height: 1px;
    content: '';
    background-color: #f2f2f2;
  }
</style>
