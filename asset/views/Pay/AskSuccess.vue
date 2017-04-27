<template>
<div>
      <header class="mui-bar mui-bar-nav">
        <h1 class="mui-title">支付成功</h1>
      </header>

      <div class="mui-content pay-success">
        <div class="status">
          <i class="mui-icon iconfont icon-success"></i>
          <br/>
          支付成功
      </div>
        <div class="title">您已成功支付</div>
        <div class="money">¥{{ info.money }}</div>
        <div class="msg">请等待平台受理您的提问需求，请稍安勿躁！</div>
        <div class="loading"><img :src="loading_gif"/></div>
        <div class="time">已等待<span>{{ countup }}秒</span>！</div>
        <div class="important">如平台受理失败，<br/>支付金额将会退回到您的账户中。</div>
      </div>
</div>
</template>

<script>
  const AskSuccess = {
    data: () => ({
      id:0,
      info:{
        money:0
      },
      loading_gif: loading_gif,
      timeend: 8,
      timestart:0
    }),
    computed: {
      countup() {
          var time =  this.timestart;
          if (time < 10) {
             time = '0' + time.toString();
          }
          return time;
      }
    },
    created(){
      this.info.money = this.$route.query.money?this.$route.query.money:0;
      this.timeend = this.$route.query.timeend?this.$route.query.timeend:15;


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
      this.id  = id;
    },
    mounted(){
        this.countUp();
    },
    methods: {
      countUp() {
          this.timestart++;
          if (this.timestart < this.timeend) {
              setTimeout(this.countUp, 1000);
          } else {
            this.$router.replace('/askSuccess/'+this.id);
          }
      }
    }
  }
  export default AskSuccess;
</script>


<style scoped>
  .pay-success{
    text-align: center;
    background: #fff;
    padding:15px;
  }
  .pay-success .status{
    margin-top:30px;
    color:#19ac18;
  }

  .pay-success .status .mui-icon{
    font-size:50px;
    margin-bottom: 10px;
  }
  .pay-success .title{
    margin:20px 0;
  }

  .pay-success .money{
    color:#007aff;
  }

  .pay-success .msg{
    margin:20px 0;
  }

  .pay-success .time{
    margin:20px 0;
  }

  .pay-success .time span{
    font-size:20px;
    color:orange;
    margin:0 5px;
  }

  .pay-success .important{
    color:#999;
    line-height:30px;
  }
</style>
