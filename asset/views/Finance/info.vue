<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的钱包</h1>
      <a @tap.stop.prevent="$router.push('/my/finance/setting')"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">安全设置</a>
    </header>

    <div class="mui-content" v-show="!loading">
      <div class="myMoney">

        <div class="title">钱包余额</div>
        <div class="money"><span>¥</span>{{ totalMoeny }}</div>

      </div>


      <div class="menus">
          <div class="mui-row ">
            <div class="mui-col-sm-6 mui-col-xs-6 menu-item" @tap.stop.prevent="$router.push('/my/finance/list')">
              <span class="myicon myicon-money-record"></span>
              <br/>
              <span class="title">交易记录</span>
            </div>
            <div class="mui-col-sm-6 mui-col-xs-6 menu-item" @tap.stop.prevent="$router.push('/my/finance/withdraw')">
              <span class="myicon myicon-withdraw"></span>
              <br/>
              <span class="title">余额提现</span>
            </div>
          </div>
          <div class="menu-splite"></div>
      </div>

    </div>

  </div>
</template>

<script>
  import {apiRequest} from '../../utils/request';
  import oauth from '../../components/oauth/oauth.vue';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export default {
    data: () => ({
      loading: true,
      totalMoeny:'--',
      settlementMoney:'--',  //结算中的资金
      withdrawMinMoney:'--', //用户单次最低提现金额
      withdrawMaxMoney:'--', //用户单次最高提现金额
    }),
    computed: {

    },
    components: {
      oauth
    },
    methods: {
      check_withdraw() {

      },
      initData() {
        postRequest(`account/wallet`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          this.totalMoeny = response.data.data.total_money;
          this.settlementMoney = parseFloat(response.data.data.pay_settlement_money);
          this.withdrawMinMoney = response.data.data.withdraw_per_min_money;
          this.withdrawMaxMoney = response.data.data.withdraw_per_max_money;
          this.loading = 0;

          localEvent.setLocalItem('wallet', {totalMoney:this.totalMoeny})
        });
      }
    },
    mounted(){
      showInwehubWebview();
      window.addEventListener('refreshData', (e) => {
        //执行刷新
        console.log('refresh-finance-info');
        this.initData();
      });
    },
    created () {
      this.initData();
    },
    watch: {

    }
  }
</script>


<style scoped>
  .myMoney{
     background: #161616;
     height:136px;
     color:#fff;
     padding:20px 30px;
  }

  .myMoney .title{
    font-size:14px;
  }

  .myMoney span{
    font-size:24px;
    margin-right:10px;
    font-weight:normal;
  }

  .myMoney .money{
    margin-top:30px;
    font-size:44px;
    font-weight: 200;
  }

  .menus{
      position: relative;
  }
  .menus .menu-item{
    text-align: center;
    height:92px;
    background: #fff;
    display: inline-block;
  }

  .menus .menu-item .myicon{
    margin-top:20px;
    display: inline-block;
    width:30px;
    height:21px;
  }

  .menus .menu-item .title{
    display: inline-block;
    font-size:14px;
    margin-top:10px;
  }

  .menus .menu-splite{
    position: absolute;
    width: 1px;
    height: 66px;
    background-color: #D9D9D9;
    top:13px;
    left:50%;

    -webkit-transform: scaleX(.5);
    transform: scaleX(.5);
  }


</style>
