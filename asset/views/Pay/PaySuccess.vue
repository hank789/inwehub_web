<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">提现详情</h1>
    </header>

    <div class="mui-content pay-success">

      <div class="status">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-check-circle"></use>
        </svg>
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
        <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined"
                @tap.stop.prevent="$router.replace('/my/finance/list')">查看记录
        </button>
        <button type="button" class="mui-btn mui-btn-primary " @tap.stop.prevent="$router.replace('/my/finance/')">
          　完成　
        </button>

      </div>

    </div>
  </div>
</template>

<script>
  import { NOTICE } from '../../stores/types'

  const PaySuccess = {
    data: () => ({
      account: '',
      money: 0
    }),
    computed: {},
    methods: {},
    created () {
      let account = this.$route.query.account
      let money = this.$route.query.money

      if (!account || !money) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          })
        })
        this.$router.back()
        return
      }

      this.account = account
      this.money = money
    }
  }
  export default PaySuccess
</script>


<style lang="less" scoped>
  .mui-bar .myicon {
    left: 0.266rem;
    top: 0.32rem;
  }

  .pay-success {
    text-align: center;
    padding: 0.4rem 0;
  }

  .pay-success .status {
    margin-top: 2.666rem;
    font-size: 0.533rem;
    color: #19ac18;
  }

  .pay-success .status span {
    color: #417505;
  }

  .pay-success .status svg {
    font-size: 2.666rem;
    margin-bottom: 0.533rem;
  }

  .buttons button {
    margin: 0 0.4rem;
    padding: 0.213rem 0.8rem;
  }

  .info {
    margin: 1.333rem 0;
    background: #fff;
    padding: 0.4rem;
    text-align: left;
    position: relative;

    &:before {

      position: absolute;
      right: 0;
      top: 0;
      left: 0;
      height: 0.026rem;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;

    }

    &:after {

      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 0.026rem;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;

    }

    .item {

      height: 1.066rem;
      line-height: 1.066rem;

      label {
        color: #9B9B9B;
      }

      span {
        max-width: 4rem;
        float: right;
      }
    }

  }


</style>
