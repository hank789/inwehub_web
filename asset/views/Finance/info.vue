<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的钱包</h1>
      <a @tap.stop.prevent="$router.push('/my/finance/list')"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">账单明细</a>
    </header>


    <div class="mui-content">
      <div class="myMoney">

        <span class="mui-icon fa fa-diamond"></span>
        <div class="money">188.00</div>
        <div class="unit">余额 （元）</div>
        <div class="info">您有 88.00 元正在结算处理中</div>

        <div class="button-wrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @tap.stop.prevent="$router.push('/my/finance/withdraw')">提现
              </button>
        </div>
        <div class="help">每天可申请提现一次，每次最低10元，最高2000元</div>
      </div>
    </div>

  </div>
</template>

<script>
  import {apiRequest} from '../../utils/request';
  import oauth from '../../components/oauth/oauth.vue';

  export default {
    data: () => ({

    }),
    computed: {

    },
    components: {
      oauth
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
  .myMoney{
    padding:30px;
    position: relative;
    text-align: center;
  }
  .fa{
    position: relative;
    font-size:58px;
    left: -110px;
    top: 46px;
    color:#ff9800;
  }

  .info{
    font-size:13px;
    color:#101010;
    margin:70px 0 5px;
  }
  .money{
    font-size:38px;
    color:#101010;
  }

  .unit{
    margin-top:20px;
    color:#101010;
    font-size:16px;
  }
  .button-wrapper{
    padding:0 50px;
  }
  .help{
    color:#757575;
    font-size:12px;
  }
</style>
