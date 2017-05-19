<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">提取现金</h1>
    </header>


    <div class="mui-content">
      <div class="withdraw">
        <div class="title">提现到微信账户 <span>微信账户名</span></div>
        <div class="tip">提取金额</div>
        <div class="textArea">
          <span class="unit">￥</span>
          <span class="amount"><input type="text" value="--.--"/></span>
        </div>
        <div class="balance">钱包余额￥--.--，<span>全部提现</span></div>
        <div class="button-wrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @tap.stop.prevent="">提现
              </button>
        </div>
        <div class="help">预计5个工作日到账</div>
      </div>
    </div>

  </div>
</template>

<script>
  import {apiRequest} from '../../utils/request';

  export default {
    data: () => ({

    }),
    computed: {

    },
    components: {

    },

    methods: {
      check_withdraw() {

      }
    },
    watch: {

    }
  }
</script>


<style scoped>

  .withdraw{
    border:1px solid #bbb;
    margin:20px;
    background: #fff;
    height:320px;
  }

  .title{
    padding:20px;
    border-bottom:1px solid #bbb;
  }
  .title span{
    color:#ff9800;
    margin-left:10px;
  }
  .tip{
    margin-top:15px;
    padding-left:20px;
  }
  .textArea{
    margin:40px 30px 0 30px;
    text-align: center;
    padding-left:20px;
    padding-bottom:10px;
    border-bottom:1px solid #bbb;

  }
  .unit{
    font-size:38px;
  }
  .amount{
    font-size:48px;
    color:#888;
    width: 120px;
    display: inline-block;
  }
  .amount input{
    font-size:inherit;
    border:none;
    padding:0;
    margin:0;
    text-align: left;
  }
  .balance{
    margin-top:10px;
    font-size:12px;
    padding-left:20px;
    color:#757575;
  }
  .balance span{
    color:#5677fc;
    font-size:14px;
  }
  .button-wrapper{
    padding:0 50px;
    margin-top:20px;
  }
  .help{
    color:#757575;
    font-size:12px;
    text-align: center;
  }

</style>
