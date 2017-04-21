<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">应答</h1>
    </header>

    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>

    <div class="mui-content" v-show="!loading">
      <div class="mui-table-view detail-ask">
        <div class="mui-table-view-cell">
          <img class="mui-media-object mui-pull-left" :src="answer.question.user_avatar_url">
          <div class="mui-media-body">
            {{ answer.question.user_name }}
        </div>
        </div>
        <div class="mui-table-view-cell question">
          {{ answer.question.description }}
          <span class="timeAgo"><timeago :since="answer.question.created_at"></timeago></span>
          <span class="amount">悬赏金额<b>￥{{ answer.question.price }}</b>元</span>
        </div>
      </div>

      <div class="mui-row buttons">
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn  mui-btn-block" onclick="window.location='waitAnswer.html'"><span class="mui-icon mui-icon-compose"></span>确认应答</button>
        </div>
        <div class="mui-col-sm-6 mui-col-xs-6">
          <button type="button" class="mui-btn  mui-btn-block" @tap.stop.prevent="$router.push('/answerrefuse/' + answer.question.id)"><span class="mui-icon mui-icon-closeempty"></span> 拒绝应答</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';


  const AnswerDetail = {
    data: () => ({
      answer: [],
      loading:true,
      loading_gif:loading_gif
    }),
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
        return this.answers.length ? 0 : 1;
      }
    },
    mounted(){

    },
    created () {
      let id = parseInt(this.$route.params.id);

      if ( !id ) {
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


      addAccessToken().post(createAPI(`question/info`),{id:id},
        {
          validateStatus: status => status === 200
        }
      )
        .then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          this.answer = response.data.data;
          this.loading = 0;
        })
        .catch(({ response: { message = '网络状况堪忧' } = {} } ) => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: data.message,
              time: 2000,
              status: false
            });
          });
        })
    }
  }
  export default AnswerDetail;
</script>


<style scoped>
  .detail-ask .question {
    padding-bottom: 50px;
    position: relative;
  }

  .detail-ask .question .timeAgo {
    position: absolute;
    bottom: 10px;
    left: 15px;
    color:#999;
  }

  .detail-ask .question .amount {
    position: absolute;
    bottom: 10px;
    right: 15px;
    color:#999;
  }
  .detail-ask .question .amount b{
    color:#f85f48;
    font-weight:normal;
  }

  .buttons {
    margin-left:-1px;
  }
  .buttons button{
    margin:-1px;
    font-size:14px;
    padding:10px 0;
    border-right:0px;
    border-radius:0;
  }
  .buttons button .mui-icon{
    font-size:22px;
  }
</style>
