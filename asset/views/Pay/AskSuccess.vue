<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">支付成功</h1>
    </header>

    <div class="mui-content pay-success absolute">
      <div class="status">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-check-circle"></use>
        </svg>

        <br/>
        <span>支付成功</span>
      </div>
      <div class="title">您已成功支付{{ info.money }}元</div>
      <div class="loading"><img :src="loading_gif"/></div>
      <div class="time"><span>已等待{{ countup }}秒！</span></div>
      <div class="important">请耐心等待几秒，平台会立即反馈受理情况！<br/>如受理失败，支付金额将退回到您账户中！</div>

    </div>
  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types'

  const AskSuccess = {
    data: () => ({
      id: 0,
      info: {
        money: 0
      },
      loading_gif: window.loading_gif,
      timeend: 8,
      timestart: 0
    }),
    computed: {
      countup () {
        var time = this.timestart
        if (time < 10) {
          time = '0' + time.toString()
        }
        return time
      }
    },
    created () {
      this.getParam()
    },
    mounted () {
      this.countUp()
    },
    watch: {
      '$route': 'refreshPageData'
    },
    methods: {
      getParam () {
        this.info.money = this.$route.query.money ? this.$route.query.money : 0
        this.timeend = this.$route.query.timeend ? this.$route.query.timeend : 15

        let id = parseInt(this.$route.params.id)

        if (!id) {
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
        this.id = id
      },
      refreshPageData () {
        this.getParam()
        this.timestart = 0
        this.countUp()
      },
      countUp () {
        this.timestart++
        if (this.timestart < this.timeend) {
          setTimeout(this.countUp, 1000)
        } else {
          this.$router.replace('/ask/offer/answers/' + this.id)
        }
      }
    }
  }
  export default AskSuccess
</script>


<style scoped>
  .pay-success {
    text-align: center;
    padding: 0.4rem;
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

  .pay-success .title {
    font-size: 0.586rem;
    margin: 0.8rem 0 1.066rem;
  }

  .pay-success .important {
    margin-top: 1.066rem;
    color: #4a4a4a;
    font-size: 0.373rem;
  }

  .pay-success .time {
    margin: 0.8rem 0;
  }

  .pay-success .time span {
    font-size: 0.586rem;
    color: orange;
    margin: 0 0.133rem;
  }


</style>
