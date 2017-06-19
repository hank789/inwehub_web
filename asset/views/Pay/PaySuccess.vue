<template>
<div>
      <header class="mui-bar mui-bar-nav">
        <h1 class="mui-title">提现详情</h1>
      </header>

      <div class="mui-content pay-success">

        <div class="status">
            <i class="mui-icon iconfont icon-success"></i>
            <br/>
            <span>提现申请提交成功</span>
        </div>

        <div class="info ">
            <div class="item">
              <label>到账账户</label>
              <span class="mui-ellipsis">微信账户 {{ account }}</span>
            </div>
            <div class="item">
              <label>提现金额</label>
              <span>￥ {{ money }}</span>
            </div>
        </div>

            <div class="buttons">
              <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined" @tap.stop.prevent="$router.replace('/my/finance/list')">查看记录</button>
              <button type="button" class="mui-btn mui-btn-primary " @tap.stop.prevent="$router.replace('/my/finance/')">　完成　</button>

            </div>

      </div>
</div>
</template>

<script>
  import {NOTICE} from '../../stores/types';

  const PaySuccess = {
    data: () => ({
      account:'',
      money:0,
    }),
    computed: {
    },
    methods: {
    },
    created () {
      let account = this.$route.query.account;
      let money = this.$route.query.money;

      if (!account || !money) {
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

      this.account = account;
      this.money = money;
    }
  }
  export default PaySuccess;
</script>


<style lang="less" scoped>
  .mui-bar .myicon{
    left:10px;
    top:12px;
  }
  .pay-success{
    text-align: center;
    padding:15px 0;
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

  .buttons button{
      margin:0 15px;
     padding:8px 30px;
  }

  .info{
    margin:50px 0;
    background: #fff;
    padding:15px;
    text-align:left;
    position: relative;

    &:before{

      position: absolute;
      right: 0;
      top: 0;
      left: 0;
      height: 1px;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;

    }

    &:after{

        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 1px;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;

    }

    .item{

      height:40px;
      line-height: 40px;

      label{
        color:#9B9B9B;
      }

      span{
        max-width:150px;
        float:right;
      }
    }


  }


</style>
