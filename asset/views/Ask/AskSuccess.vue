<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon myicon myicon-home2 mui-pull-left" @tap.stop.prevent="$router.push('/home')"></a>
      <h1 class="mui-title">提交成功</h1>
    </header>

    <div class="mui-content pay-success" v-show="!loading">

      <div class="status">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-check-circle"></use>
        </svg>
        <br/>
        <span>提交成功</span>
      </div>


      <div class="desc">
        您的提问平台已经受理成功，正在匹配最合适的<br/>专家回答，匹配成功后专家将为您及时回答！

      </div>


      <div class="buttons">
        <button type="button" class="mui-btn mui-btn-primary mui-btn-outlined"
                @tap.stop.prevent="$router.replace('/ask')">再问一条
        </button>
        <button type="button" class="mui-btn mui-btn-primary " @tap.stop.prevent="$router.replace('/ask/' + id)">查看问题
        </button>

      </div>
    </div>
    <div id="statusBarStyle" background="#eeeff3"></div>
  </div>
</template>

<script>
  import { NOTICE } from '../../stores/types'
  import localEvent from '../../stores/localStorage'

  const currentUser = localEvent.getLocalItem('UserInfo')

  const AskSuccess = {
    data: () => ({
      username: currentUser.name,
      ask: {
        answers: [],
        question: {created_at: ''},
        feedback: {
          rate_star: 0
        },
        timeline: []
      },
      id: 0,
      loading: true
    }),
    computed: {
      timelines () {
        return this.ask.timeline.reverse()
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    methods: {
      refreshPageData () {
        this.getDetail()
      },
      getDetail () {
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
      getTime (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      }
    },
    created () {
      this.getDetail()
    }
  }
  export default AskSuccess
</script>


<style scoped>
  .mui-bar .myicon {
    left: 0.266rem;
    top: 0.32rem;
  }

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
    margin-right: 0.186rem;
  }

  .pay-success .status svg {
    font-size: 2.666rem;
    margin-bottom: 0.533rem;
  }

  .desc {
    margin: 1.333rem 0;
    color: #4a4a4a;
    font-size: 0.373rem;
  }

  .buttons button {
    margin: 0 0.4rem;
    padding: 0.213rem 0.8rem;
  }


</style>
