<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">余额提现</h1>
    </header>


    <div class="mui-content" v-show="!loading">
      <div class="withdraw">
        <div class="title">提现至微信账户 <span class="wechatName" v-if="isBindWeixin">{{ bindWeixinNickname }}</span>
          <oauth class="wechatBind mui-navigate-right" @success="bindSuccess" :content="'前往绑定'" v-else></oauth>
        </div>
        <div class="tip">提取金额</div>
        <div class="textArea">
          <span class="unit">￥</span>
          <span class="amount"><input type="text" autocorrect="off" autocomplete="off" v-model="withdrawMoney"/></span>
        </div>
        <div class="balance" v-if="!getWarning">可提现余额 ￥{{ totalMoeny }}<span @tap.stop.prevent="withdrawAll">全部提现</span>
        </div>

        <div class="balance balance-warning" v-else>{{warning}}</div>
      </div>

      <div class="unFinish" v-show="settlementMoney">尚有 ￥{{settlementMoney}} 结算处理中</div>

      <div class="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="submitWithdraw" :disabled="isDisabled">确认提现


        </button>
      </div>
      <div class="help">今日还可提现{{ withdraw_day_remain }}次<br/>每次提现最低{{ withdrawMinMoney }}元，最高{{ withdrawMaxMoney }}元

      </div>

    </div>

    <password
      ref="password"
      @submitPassword="submitPassword"
    ></password>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import oauth from '../../components/oauth/oauth.vue'
  import password from '../../components/withdraw/Password.vue'

  export default {
    data: () => ({
      loading: true,
      withdrawMoney: '',
      totalMoeny: '--',
      settlementMoney: '--',  // 结算中的资金
      withdrawMinMoney: '--', // 用户单次最低提现金额
      withdrawMaxMoney: '--', // 用户单次最高提现金额
      isBindWeixin: 0, // 是否绑定微信
      withdraw_day_limit: '--',
      bindWeixinNickname: '', // 绑定微信昵称,
      withdraw_day_remain: '--',
      isDisabled: true,
      warning: '',
      password: ''   // 提现密码
    }),
    created () {
      this.getWallet()
    },
    computed: {
      getWarning () {
        if (!this.isBindWeixin) {
          this.warning = '还未绑定微信账户'
          return true
        }

        if (this.withdrawMoney > parseFloat(this.totalMoeny)) {
          this.warning = '已超过可提现余额'
          return true
        }

        if (!this.withdraw_day_remain) {
          this.warning = '已超出今日提现次数'
          return true
        }

        if (this.withdrawMoney < 1 && this.withdrawMoney > 0) {
          this.warning = '提现金额不足一元'
          return true
        }

        return false
      }
    },
    components: {
      oauth,
      password
    },
    watch: {
      withdrawMoney: function (newMoney, oldMoney) {
        if (newMoney === '') {
          this.withdrawMoney = ''
        } else {
          var patrn = /^(([1-9]\d{0,8})|0)(\.\d{0,2})?$/
          if (!patrn.test(newMoney)) {
            if (isNaN(this.withdrawMoney)) {
              this.withdrawMoney = ''
            } else {
              this.withdrawMoney = this.withdrawMoney.slice(0, -1)
              this.withdrawMoney = parseFloat(this.withdrawMoney)
            }
          }
        }

        if (this.withdrawMoney <= parseFloat(this.totalMoeny) && this.withdrawMoney > 0) {
          this.isDisabled = false
        } else {
          this.isDisabled = true
        }
      }
    },
    methods: {
      submitPassword (password) {
        this.password = password
        this.submitWithdraw()
      },
      bindSuccess () {
        this.getWallet()
      },
      withdrawAll () {
        this.withdrawMoney = this.totalMoeny
      },
      submitWithdraw () {
        this.withdrawMoney = parseFloat(this.withdrawMoney)

        if (!this.isBindWeixin) {
          window.mui.toast('请先绑定微信')
          return
        }

        if (!this.withdrawMoney || this.withdrawMoney < 0) {
          window.mui.toast('请正确填写提现金额')
          return
        }

        if (this.withdrawMoney > this.totalMoeny) {
          window.mui.toast('提现金额不能大于账户余额')
          return
        }

        if (!this.password) {
          this.$refs.password.requirePassword()
          return
        }

        postRequest(`withdraw/request`, {
          amount: this.withdrawMoney,
          password: this.password
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            if (code === 4012 || code === 4013) {
              this.$refs.password.fail(response.data.message)
              return
            }
            window.mui.alert(response.data.message)
            return
          }

          this.$refs.password.success()

          this.$router.push('/paySuccess?account=' + this.bindWeixinNickname + '&money=' + this.withdrawMoney)
        })
      },
      getWallet () {
        postRequest(`account/wallet`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          var data = response.data.data
          this.totalMoeny = data.total_money
          this.settlementMoney = parseFloat(data.pay_settlement_money)
          this.withdrawMinMoney = data.withdraw_per_min_money
          this.withdrawMaxMoney = data.withdraw_per_max_money
          this.loading = 0
          this.isBindWeixin = data.is_bind_weixin
          this.bindWeixinNickname = data.bind_weixin_nickname
          this.withdraw_day_limit = data.withdraw_day_limit
          this.withdraw_day_remain = data.withdraw_day_remain
        })
      }
    }
  }
</script>


<style scoped>

  .withdraw {
    margin: 0.266rem 0;
    font-size: 0.373rem;
    background: #fff;
    position: relative;
  }

  .withdraw .wechatName {
    float: right;
  }

  .withdraw .wechatBind {
    float: right;
    margin-right: 0.48rem;
    color: #4990E2;
  }

  .withdraw:before {
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

  .withdraw:after {
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

  .title {
    padding: 0.4rem;
    position: relative;
  }

  .title:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0.8rem;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .title span {
    margin-left: 0.266rem;
  }

  .tip {
    margin-top: 0.4rem;
    padding-left: 0.4rem;
  }

  .textArea {
    margin: 0.8rem 0 0 0.4rem;
    padding-left: 0;
    padding-bottom: 0.266rem;
    position: relative;

  }

  .textArea:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0.4rem;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .unit {
    color: #37A18E;
    font-size: 0.64rem;
    margin-left: -0.053rem;
  }

  .amount {
    color: #37A18E;
    width: 70%;
    display: inline-block;
  }

  .amount input {
    border: none;
    font-size: 1.066rem;
    padding: 0;
    margin: 0;
    height: 1.333rem;
    text-align: left;
  }

  .balance {
    padding: 0.4rem 0 0.4rem 0.4rem;
    font-size: 0.373rem;
    color: #757575;
  }

  .balance span {
    color: #4990E2;
    float: right;
    margin-right: 0.8rem;
    font-size: 0.373rem;
  }

  .button-wrapper {
    padding: 0 1.333rem;
    margin-top: 0.533rem;
  }

  .help {
    margin-top: 0.533rem;
    color: #9B9B9B;
    line-height: 0.666rem;
    font-size: 0.373rem;
    text-align: center;
  }

  .balance-warning {
    color: #E3533E;
  }

  .unFinish {
    color: #9B9B9B;
    margin-left: 0.4rem;
    font-size: 0.373rem;
  }

</style>
