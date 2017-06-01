<template>
<div>
      <header class="mui-bar mui-bar-nav">
        <a class="mui-icon myicon myicon-home2 mui-pull-left" @tap.stop.prevent="$router.push('/home')"></a>
        <h1 class="mui-title">提交成功</h1>
      </header>

      <div class="mui-content pay-success" v-show="!loading">

        <div class="status">
            <i class="mui-icon iconfont icon-success"></i>
            <br/>
            <span>提交成功</span>
        </div>


        <div class="desc">
          您的提问平台已经受理成功，正在匹配最合适的<br/>专家回答，匹配成功后专家将为您及时回答！
        </div>




            <div class="buttons">
              <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" @tap.stop.prevent="$router.replace('/ask')">再问一条</button>
              <button type="button" class="mui-btn mui-btn-primary " @tap.stop.prevent="$router.replace('/ask/' + id)">查看问题</button>

            </div>

      </div>
</div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  const currentUser = localEvent.getLocalItem('UserInfo');

  const AskSuccess = {
    data: () => ({
      username:currentUser.name,
      ask: {
        answers: [],
        question: {created_at:''},
        feedback: {
          rate_star:0
        },
        timeline:[]
      },
      id: 0,
      loading: true
    }),
    computed: {
      timelines() {
        return this.ask.timeline.reverse();
      }
    },
    methods: {
      getTime(time) {
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

        this.ask = response.data.data;
        this.loading = 0;
      });
    }
  }
  export default AskSuccess;
</script>


<style scoped>
  .mui-bar .myicon{
    left:10px;
    top:12px;
  }
  .pay-success{
    text-align: center;
    padding:15px;
  }
  .pay-success .status{
    margin-top:100px;
    font-size:20px;
    color:#19ac18;
  }

  .pay-success .status span{
    color:#417505;
  }

  .pay-success .status .mui-icon{
    font-size:100px;
    margin-bottom: 20px;
  }

  .desc{
    margin:50px 0;
    color:#4a4a4a;
    font-size:14px;
  }

  .buttons button{
      margin:0 15px;
     padding:8px 30px;
  }


</style>
