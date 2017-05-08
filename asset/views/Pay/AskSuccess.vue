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
        <div class="title">您已成功支付{{ info.money }}</div>
        <div class="loading"><img :src="loading_gif"/></div>
        <div class="time"><span>已等待{{ countup }}秒！</span></div>
        <div class="important">请耐心等待几秒，平台会立即反馈受理情况！<br/>如受理失败，支付金额将退回到您账户中！</div>

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
    padding:15px;
  }
  .pay-success .status{
    margin-top:40px;
    font-size:22px;
    color:#19ac18;
  }

  .pay-success .status .mui-icon{
    font-size:80px;
    margin-bottom: 20px;
  }
  .pay-success .title{
    font-size: 22px;
    margin:30px 0 40px;
  }

  .pay-success .important{
    margin-top:40px;
    line-height: 33px;
    color:#999;
  }

  .pay-success .time{
    margin:30px 0;
  }

  .pay-success .time span{
    font-size:22px;
    color:orange;
    margin:0 5px;
  }
</style>
