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
  import oauth from '../../components/oauth/oauth.vue'
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'

  export default {
    data: () => ({
      loading: true,
      totalMoeny: '--',
      settlementMoney: '--',  // 结算中的资金
      withdrawMinMoney: '--', // 用户单次最低提现金额
      withdrawMaxMoney: '--' // 用户单次最高提现金额
    }),
    computed: {},
    components: {
      oauth
    },
    methods: {
      check_withdraw () {

      },
      initData () {
        postRequest(`account/wallet`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          this.totalMoeny = response.data.data.total_money
          this.settlementMoney = parseFloat(response.data.data.pay_settlement_money)
          this.withdrawMinMoney = response.data.data.withdraw_per_min_money
          this.withdrawMaxMoney = response.data.data.withdraw_per_max_money
          this.loading = 0

          localEvent.setLocalItem('wallet', {totalMoney: this.totalMoeny})
        })
      }
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-finance-info')
        this.initData()
      })
    },
    created () {
      // showInwehubWebview();
      this.initData()
    },
    watch: {}
  }
</script>


<style scoped>
  .myMoney {
    background: #3c3e44;
    height: 3.626rem;
    color: #fff;
    padding: 0.533rem 0.8rem;
  }

  .myMoney .title {
    font-size: 0.373rem;
  }

  .myMoney span {
    font-size: 0.64rem;
    margin-right: 0.266rem;
    font-weight: normal;
  }

  .myMoney .money {
    margin-top: 0.8rem;
    font-size: 1.173rem;
    font-weight: 200;
  }

  .menus {
    position: relative;
  }

  .menus .menu-item {
    text-align: center;
    height: 2.453rem;
    background: #fff;
    display: inline-block;
  }

  .menus .menu-item .myicon {
    margin-top: 0.533rem;
    display: inline-block;
    width: 0.8rem;
    height: 0.56rem;
  }

  .menus .menu-item .title {
    display: inline-block;
    font-size: 0.373rem;
    margin-top: 0.266rem;
  }

  .menus .menu-splite {
    position: absolute;
    width: 0.026rem;
    height: 1.76rem;
    background-color: #D9D9D9;
    top: 0.346rem;
    left: 50%;

    -webkit-transform: scaleX(.5);
    transform: scaleX(.5);
  }


</style>
