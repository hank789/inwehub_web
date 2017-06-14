<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">提取现金</h1>
    </header>


    <div class="mui-content">
      <div class="withdraw">
        <div class="title">提现到微信账户 <span v-if="isBindWeixin">{{ bindWeixinNickname }}</span> <oauth v-else></oauth></div>
        <div class="tip">提取金额</div>
        <div class="textArea">
          <span class="unit">￥</span>
          <span class="amount"><input type="number" v-model="withdrawMoney" /></span>
        </div>
        <div class="balance">钱包余额￥{{ totalMoeny }}，<span>全部提现</span></div>
        <div class="button-wrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @tap.stop.prevent="submitWithdraw">提现
              </button>
        </div>
        <div class="help">预计5个工作日到账</div>
      </div>
    </div>

  </div>
</template>

<script>
  import {apiRequest, postRequest} from '../../utils/request';
  import oauth from '../../components/oauth/oauth.vue';

  export default {
    data: () => ({
      loading: true,
      withdrawMoney:'',
      totalMoeny:'--',
      settlementMoney:'--',  //结算中的资金
      withdrawMinMoney:'--', //用户单次最低提现金额
      withdrawMaxMoney:'--', //用户单次最高提现金额
      isBindWeixin: 0, //是否绑定微信
      bindWeixinNickname: '' //绑定微信昵称
    }),
    created () {
        this.getWallet();
    },
    computed: {

    },
    components: {
      oauth
    },

    methods: {
      submitWithdraw() {
        if (this.withdrawMoney < 0) {
          mui.toast('请正确填写提现金额');
          return;
        }
        if (this.withdrawMoney > this.totalMoeny) {
            mui.toast('提现金额不能大于账户余额');
            return;
        }
        postRequest(`withdraw/request`, {amount: this.withdrawMoney}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }
          mui.toast(response.data.data.tips);
          this.getWallet();
          this.totalMoeny -= this.withdrawMoney;
        });
      },
      getWallet() {
        postRequest(`account/wallet`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          this.totalMoeny = response.data.data.total_money;
          this.settlementMoney = parseFloat(response.data.data.pay_settlement_money);
          this.withdrawMinMoney = response.data.data.withdraw_per_min_money;
          this.withdrawMaxMoney = response.data.data.withdraw_per_max_money;
          this.loading = 0;
          this.isBindWeixin = response.data.data.is_bind_weixin;
          this.bindWeixinNickname = response.data.data.bind_weixin_nickname;
        });
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
    border:none;
    font-size:30px;
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
