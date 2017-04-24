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

    <div class="mui-content mb70" v-if="nothing == 0">
      <div class="list-answer">

        <div class="mui-table-view list-answer-item" v-for="(answer, index) in answers" @tap.stop.prevent="$router.push('/answer/' + answer.id)">
          <div class="mui-table-view-cell mui-media">
            <div class="title">
              <div class="mui-row">
                <div class="mui-col-xs-8">
                  <div class="text">{{ answer.description }}</div>
                </div>
                <div class="mui-col-xs-4">
                  <div class="timeago"><timeago :since="timeago(answer.created_at)"></timeago></div>
                </div>
              </div>
            </div>
            <div class="person">
              <div class="avatar">
                <div class="avatarInner">
                  <img :src="answer.user_avatar_url?answer.user_avatar_url:'images/uicon.jpg'" class="avatar"/>
                </div>
              </div>
              <span class="username">{{ answer.user_name }}</span>
              <span class="amount">悬赏金额<b>￥{{ answer.price }}</b>元</span>
            </div>
            <div class="site-desc">
              {{ answer.status_description }}
              <span class="mui-icon mui-icon-arrowright"></span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="mui-content" v-if="nothing == 1">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="list-empty">
            <div class="title">暂无任务</div>
            <div class="subTitle">稍安勿躁，是金子总会发光！平台正准备给您一展风采的机会呢！</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';


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
      }
    },
    mounted(){

    },
    methods: {
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      }
    },
    created () {
      addAccessToken().post(createAPI(`answer/myList`), {},
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

          this.answers = response.data.data;
          this.loading=0;
        })
        .catch(({response: {message = '网络状况堪忧'} = {}}) => {
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
  export default AnswerList;
</script>


<style scoped>
  .list-answer .list-answer-item{
    margin-top:10px;
    position:relative;
    line-height: 40px;
  }

  .list-answer .list-answer-item .title{
    line-height:30px;
  }

  .list-answer .list-answer-item .timeago{
    float:right;
    color:#999;
  }

  .list-answer .username{
    color:orange;
    margin-left:20px;
  }

  .list-answer .list-answer-item .amount{
    position: absolute;
    right: 10px;
    color:#999;
  }

  .list-answer .list-answer-item .amount b{
    color:#f85f48;
    margin:0 5px;
    font-weight:normal;
  }


  .list-answer .site-desc{
    margin-top:10px;
    line-height: 23px;
    color:#8f8f94;
    font-size:14px;
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
  .list-answer .answer{
    line-height: 30px;
  }
</style>
