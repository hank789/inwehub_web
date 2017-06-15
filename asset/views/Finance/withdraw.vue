<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">余额提现</h1>
    </header>


    <div class="mui-content" v-show="!loading">
      <div class="withdraw">
        <div class="title">提现至微信账户 <span class="wechatName" v-if="isBindWeixin">{{ bindWeixinNickname }}</span><oauth class="wechatBind mui-navigate-right" @success="bindSuccess" :content="'前往绑定'" v-else></oauth></div>
        <div class="tip">提取金额</div>
        <div class="textArea">
          <span class="unit">￥</span>
          <span class="amount"><input type="number" v-model="withdrawMoney" /></span>
        </div>
        <div class="balance" v-if="isBindWeixin">可提现余额 ￥{{ totalMoeny }}<span @tap.stop.prevent="withdrawAll">全部提现</span></div>
        <div class="balance balance-warning" v-else>还未绑定微信账户</div>
      </div>

      <div class="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="submitWithdraw">确认提现
              </button>
      </div>
      <div class="help">今日还可提现{{ withdraw_day_limit }}次<br/>每次提现最低{{ withdrawMinMoney }}元，最高{{ withdrawMaxMoney }}元</div>

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
      withdraw_day_limit:'--',
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
    watch:{
      withdrawMoney: function (newMoney, oldMoney) {
        var patrn=/^(([1-9]\d{0,8})|0)(\.\d{0,2})?$/;
        if (!patrn.test(newMoney) && newMoney !== '') {
           this.withdrawMoney = oldMoney;
        }
      }
    },
    methods: {
      bindSuccess(){
          this.getWallet();
      },
      withdrawAll(){
           this.withdrawMoney =this.totalMoeny;
      },
      submitWithdraw() {

        if (!this.isBindWeixin) {
          mui.toast('请先绑定微信');
          return;
        }

        if (!this.withdrawMoney || this.withdrawMoney < 0) {
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

          var data = response.data.data;
          this.totalMoeny = data.total_money;
          this.settlementMoney = parseFloat(data.pay_settlement_money);
          this.withdrawMinMoney = data.withdraw_per_min_money;
          this.withdrawMaxMoney = data.withdraw_per_max_money;
          this.loading = 0;
          this.isBindWeixin = data.is_bind_weixin;
          this.bindWeixinNickname = data.bind_weixin_nickname;
          this.withdraw_day_limit = data.withdraw_day_limit;
        });
      }
    }
  }
</script>


<style scoped>

  .withdraw{
    margin:10px 0;
    font-size:14px;
    background: #fff;
    position: relative;
  }

  .withdraw .wechatName{
    float:right;
  }

  .withdraw .wechatBind{
    float:right;
    margin-right:18px;
    color:#4990E2;
  }

  .withdraw:before{
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


  .title{
    padding:15px;
    position: relative;
  }

  .title:after{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 30px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .title span{
    margin-left:10px;
  }
  .tip{
    margin-top:15px;
    padding-left:15px;
  }
  .textArea{
    margin:30px 0 0 15px;
    padding-left:0;
    padding-bottom:10px;
    position: relative;

  }
  .textArea:after{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
  .unit{
    color:#37A18E;
    font-size:24px;
    margin-left:-2px;
  }
  .amount{
    color:#37A18E;
    width:70%;
    display: inline-block;
  }
  .amount input{
    border:none;
    font-size:40px;
    padding:0;
    margin:0;
    height:50px;
    text-align: left;
  }
  .balance{
    padding:15px 0 15px 15px;
    font-size:14px;
    color:#757575;
  }
  .balance span{
    color:#4990E2;
    float: right;
    margin-right:30px;
    font-size:14px;
  }
  .button-wrapper{
    padding:0 50px;
    margin-top:20px;
  }
  .help{
    margin-top:20px;
    color:#9B9B9B;
    line-height: 25px;
    font-size:14px;
    text-align: center;
  }
  .balance-warning{
    color:#E3533E;
  }

</style>
