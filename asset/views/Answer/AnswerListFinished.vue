<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的回答</h1>
    </header>

    <div class="mui-content list-empty" v-if="nothing == 1">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/answers');">
            未完成
        </a>
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            已完成
          </a>
        </div>
      </div>

      <div class="mui-table-view list-ask-item emptyListWrapper">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无回答</div>
            <div class="subTitle" v-if="isExpert">稍安勿躁，是金子总会发光！<br/>平台正准备给您一展风采的机会呢！</div>
            <div class="subTitle" v-if="!isExpert">只有认证专家才能进行回答。<br/>如果您还不是专家，请积极提升个人在平台的成长值。</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mui-content absolute">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/answers');">
            未完成
        </a>
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            已完成
          </a>
        </div>
      </div>

      <div id="pullrefresh" :class="{'mui-content':false, 'mui-scroll-wrapper':true, 'emptyList':nothing}">
        <div class="mui-scroll">

          <div class="" v-if="nothing == 0">
            <div class="list-answer">

              <div class="mui-table-view list-answer-item" v-for="(answer, index) in answers"
                   @tap.stop.prevent="toDetail(answer)">
                <div class="mui-table-view-cell mui-media">
                  <div class="site-desc mui-ellipsis-2">
                    {{ answer.description }}

                  </div>
                  <div class="person">
                    <div class="mui-media-body">
                      <div>
                        <span :class="'label label_' + answer.status">{{ answer.status_description }}</span>
                        <span class="time">{{ answer.created_at.split(' ')[0].replace(/-/g, '/') }}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import { ANSWERS_INFO_APPEND, ANSWERS_LIST_APPEND } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'

  const AnswerList = {
    data () {
      const currentUser = localEvent.getLocalItem('UserInfo')
      return {
        answers: [],
        loading: true,
        isExpert: currentUser.is_expert
      }
    },
    computed: {
      nothing () {
        if (this.loading) {
          return -1
        }
        return this.answers.length ? 0 : 1
      },
      topId () {
        if (this.answers.length) {
          return this.answers[0].id
        }
        return 0
      },
      bottomId () {
        var length = this.answers.length
        if (length) {
          return this.answers[length - 1].id
        }
        return 0
      },
      lastY () {
        if (this.isFromDetail()) {
          return this.$store.state.answers.info.lastY
        } else {
          return 0
        }
      }
    },
    updated () {
      this.$store.dispatch(ANSWERS_LIST_APPEND, this.answers)
    },
    created () {
      // showInwehubWebview();
      var list = []
      if (this.isFromDetail()) {
        list = this.$store.state.answers.list
      }

      if (list.length) {
        this.answers = list
        this.loading = false
      }
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-answerList')
        this.getPrevList()
      })

      var t = this
      window.mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function (event) {
        var lastY = event.detail.lastY
        t.$store.dispatch(ANSWERS_INFO_APPEND, {lastY: lastY})
      })

      window.mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: this.pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多了',
            callback: this.pullupRefresh
          }
        }
      })
      this.getPrevList()
    },
    filters: {
      textLimit (text) {
        var limit = 70
        if (text.length > limit) {
          text = text.slice(0, limit) + '...'
        }
        return text
      }
    },
    methods: {
      toDetail (item) {
        if (item.question_type === 2) {
          this.$router.pushPlus('/askCommunity/interaction/' + item.id)
        } else {
          this.$router.pushPlus('/answer/' + item.question_id)
        }
      },
      pulldownRefresh () {
        setTimeout(() => {
          this.getPrevList()
        }, 1000)
      },
      pullupRefresh () {
        setTimeout(() => {
          this.getNextList()
        }, 1000)
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      getPrevList () {
        postRequest(`answer/myList`, {type: 2}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            this.answers = response.data.data
          }
          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPulldownToRefresh() // refresh completed
        })
      },
      getNextList () {
        postRequest(`answer/myList`, {type: 2, bottom_id: this.bottomId}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            this.answers = this.answers.concat(response.data.data)
          }
          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
        })
      },
      isFromDetail () {
        return false
      }
    }
  }
  export default AnswerList
</script>


<style scoped>
  .list-answer {
    margin-top: 0.133rem;
  }

  .list-answer .list-answer-item {
    position: relative;
    line-height: 1.066rem;
  }

  .list-answer .list-answer-item .title {
    line-height: 0.746rem;
  }

  .list-answer .list-answer-item .mui-media-body {
    padding-left: 0.266rem;
    line-height: 0.56rem;
    font-size: 0.32rem;
    color: #9B9B9B;
  }

  .list-answer .list-answer-item .time {
    color: #9B9B9B;
    font-size: 0.32rem;
    float: right;
    margin-right: 0.266rem;
  }

  .list-answer .username {
    color: #101010;
  }

  .list-answer .list-answer-item .amount {
    position: absolute;
    right: 0.266rem;
    color: #ff9800;
    font-size: 0.426rem;
  }

  .list-answer .list-answer-item .amount b {

    font-weight: normal;
  }

  .list-answer .person {
    margin-top: 0.266rem;
  }

  .list-answer .site-desc {
    padding-left: 0.266rem;
    line-height: 0.586rem;
    color: #101010;
  }

  .list-answer .site-descSub {
    font-size: 0.373rem;
    color: #4A4A4A;
  }

  .list-answer .site-desc .mui-icon {
    font-size: 0.426rem;
  }

  .list-answer .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 1.333rem;
    width: 1.333rem;
    font-size: 0.533rem;
    text-align: center;
    border-radius: 50%;
  }

  .list-answer .avatar .avatarInner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .list-answer .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .list-answer .mui-table-view-cell {
    padding: 0.293rem 0.213rem;
  }

  .list-answer .mui-table-view-cell > a:not(.mui-btn) {
    margin: -0.293rem -0.213rem;
  }

  .list-answer p {
    margin-left: 0.533rem;
  }

  .list-answer .person {
    position: relative;
  }

  .menu {
    position: relative;
    z-index: 7;
  }

  .list-empty .menu {
    margin-bottom: 0rem;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 1.333rem;
    font-size: 0.373rem;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    position: relative;
    color: #03aef9;
    border: none;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active:after {
    position: absolute;
    width: 0.746rem;
    bottom: 0;
    left: 50%;
    margin-left: -0.373rem;
    height: 0.053rem;
    z-index: 999;
    content: '';
    background-color: #009FE8;
  }

  .mui-segmented-control {
    background: #f3f4f6;
  }

  #pullrefresh {
    background: #fff;
  }

  .mui-table-view:before {
    display: none;
  }

  .mui-table-view:after {
    border: none;
    left: 0.48rem;
    right: 0.48rem;
  }

  .label {
    display: inline-block;
    background: #fcc816;
    border-radius: 1.333rem;
    color: #fff;
    padding: 0 0.24rem;
  }

  .label.label_7 {
    background: #c8c8c8;
  }

  .label.label_6 {
    background: #c8c8c8;
  }

  .emptyListWrapper {
    padding-top: 0rem;
  }


</style>
