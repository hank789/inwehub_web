<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的回答</h1>
    </header>


    <div id="pullrefresh" :class="{'mui-content':true, 'mui-scroll-wrapper':true, 'emptyList':nothing}" >
    <div class="mui-scroll">

    <div class="mui-content" v-if="nothing == 0">
      <div class="list-answer">

        <div class="mui-table-view list-answer-item"  v-for="(answer, index) in answers" @tap.stop.prevent="$router.pushPlus('/answer/' + answer.question_id)">
          <div class="mui-table-view-cell mui-media">
            <div class="site-desc mui-ellipsis-2">
              {{ answer.description }}
            </div>
            <div class="site-desc site-descSub mui-ellipsis-3" v-show="answer.answer_content.length">
              {{ answer.answer_content }}
            </div>
            <div class="person">
              <div class="mui-media-body">
                <div>
                  <span>{{ answer.status_description }}</span>
                  ·
              <span class="time"><timeago :since="timeago(answer.created_at)"></timeago></span>
                </div>
              </div>
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
            <div class="title">暂无回答</div>
            <div class="subTitle" v-if="isExpert">稍安勿躁，是金子总会发光！<br/>平台正准备给您一展风采的机会呢！</div>
            <div class="subTitle" v-if="!isExpert">只有认证专家才能进行回答。<br/>如果您还不是专家，请积极提升个人在平台的成长值。</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE, ANSWERS_INFO, ANSWERS_LIST, ANSWERS_INFO_APPEND, ANSWERS_LIST_APPEND} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';


  const AnswerList = {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        answers: [],
        loading:true,
        isExpert:currentUser.is_expert
      }
    },
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
        if (this.isFromDetail()) {
          return this.$store.state.answers.info.lastY;
        } else {
            return 0;
        }

      }
    },
    updated(){
      this.$store.dispatch(ANSWERS_LIST_APPEND, this.answers);
    },
    created(){
      if (this.isFromDetail()) {
          var list = this.$store.state.answers.list;
      } else {
          var list = [];
      }

      if (list.length) {
        this.answers = list;
        this.loading = false;
      }
    },
    mounted(){
      showInwehubWebview();
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-answerList');
        this.getPrevList();
      });

      var t = this;
      mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function(event){
        var lastY = event.detail.lastY;
        t.$store.dispatch(ANSWERS_INFO_APPEND, {lastY:lastY});
      });

      mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: this.pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore:'没有更多了',
            callback: this.pullupRefresh
          }
        }
      });
      this.getPrevList();
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
      pulldownRefresh() {
        setTimeout(() => {
          this.getPrevList();
        },1500);
      },
     pullupRefresh() {
        setTimeout(() => {
          this.getNextList();
        },1500);
      },
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
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.answers = response.data.data;
          }
          this.loading = 0;
          mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed

        });
      },
      getNextList() {

        postRequest(`answer/myList`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.answers = this.answers.concat(response.data.data);
          }
          this.loading = 0;

          if (response.data.data.length < 10) {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
          } else {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
          }
        });
      },
      isFromDetail(){
        return false;
        var referer = localEvent.getLocalItem('referer');
        if (/\/answer\/[0-9]+/.test(referer.path)) {
          return true;
        }
        return false;
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
    padding-left:10px;
    line-height: 21px;
    font-size:12px;
    color:#9B9B9B;
  }
  .list-answer .list-answer-item .time{
    color:#9B9B9B;
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
    line-height: 22px;
    color:#101010;
  }
  .list-answer .site-descSub{
    font-size:14px;
    color:#4A4A4A;
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
    height: 50px;
    width: 50px;
    font-size: 20px;
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
  }


</style>
