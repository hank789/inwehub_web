<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的提问</h1>
    </header>

    <div class="mui-content list-empty" v-if="nothing == 1">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            未完成
        </a>
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/asks/finish')">
            已完成
          </a>
        </div>
      </div>

      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无提问</div>
            <div class="subTitle">提出正确的问题，往往等于解决了问题的大半。
            <br/><span>快去提出第一个问题吧！</span>
            </div>
            <div class="buttons">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                      @tap.stop.prevent="$router.push('/ask')">快速提问



              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="item1" class="absolute" :class="{'mui-content':true, 'mui-active':true, 'emptyList':nothing}">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            未完成
        </a>
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/asks/finish')">
            已完成
          </a>
        </div>
      </div>

      <div id="pullrefresh" class="mui-scroll-wrapper">
        <div class="mui-scroll">

          <div class="" v-if="nothing == 0">

            <div class="list-ask">

              <div class="mui-table-view list-ask-item" v-for="(ask, index) in asks">
                <div class="mui-table-view-cell mui-media" @tap.stop.prevent="toDetail(ask)">

                  <div class="site-desc mui-ellipsis-2">
                    {{ ask.description | textLimit}}

                  </div>

                  <div class="person">
                    <div class="mui-media-body">
                      <div>
                        <span :class="'label label_' + ask.status">{{ ask.status_description }}</span>
                        <span class="time">{{ ask.created_at.split(' ')[0].replace(/-/g, '/') }}</span>
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
  import { ASKS_INFO_APPEND, ASKS_LIST_APPEND } from '../../stores/types'
  import { postRequest } from '../../utils/request'

  const Asks = {
    data: () => ({
      asks: [],

      loading: true
    }),
    methods: {
      toDetail (item) {
        if (item.question_type === 2) {
          this.$router.pushPlus('/askCommunity/interaction/answers/' + item.id)
        } else {
          this.$router.pushPlus('/ask/' + item.id)
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
      getStatusText (code) {
        switch (code) {
          case 1:
            return '待分配'
          case 2:
            return '待确认'
          case 3:
            return '已关闭'
          case 4:
            return '待回答'
          case 5:
            return '已拒绝'
          case 6:
            return '已回答'
          case 7:
            return '已点评'
        }
        return ''
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      getPrevList () {
        postRequest(`question/myList`, {type: '1'}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            this.asks = response.data.data
          }
          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPulldownToRefresh() // refresh completed
        })
      },
      getNextList () {
        postRequest(`question/myList`, {bottom_id: this.bottomId, type: '1'}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            this.asks = this.asks.concat(response.data.data)
          }
          this.loading = 0

          window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
        })
      },
      isFromDetail () {
        return false
      }
    },
    computed: {
      nothing () {
        if (this.loading) {
          return -1
        }
        // 判断有没有数据 0 代表隐藏   1代表显示数据；
        return this.asks.length ? 0 : 1
      },
      // 获取请求数据第一个数据的id；
      topId () {
        if (this.asks.length) {
          return this.asks[0].id
        }
        return 0
      },
      // 获取请求数据最后一个数据的id；
      bottomId () {
        var length = this.asks.length
        if (length) {
          return this.asks[length - 1].id
        }
        return 0
      },
      lastY () {
        if (this.isFromDetail()) {
          return this.$store.state.asks.info.lastY
        } else {
          return 0
        }
      }
    },
    updated () {
      this.$store.dispatch(ASKS_LIST_APPEND, this.asks)
    },
    created () {
      // showInwehubWebview();
      var list = []
      if (this.isFromDetail()) {
        list = this.$store.state.asks.list
      }

      if (list.length) {
        this.asks = list
        this.loading = false
      }
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-asklist')
        this.getPrevList()
      })
      var t = this
      window.mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function (event) {
        var lastY = event.detail.lastY
        t.$store.dispatch(ASKS_INFO_APPEND, {lastY: lastY})
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
    }
  }
  export default Asks
</script>


<style scoped>

  .list-ask {
    margin-top: 0.133rem;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 1.333rem;
    font-size: 0.426rem;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    position: relative;
    border: none;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active:after {
    position: absolute;
    width: 1.333rem;
    right: 0.266rem;
    bottom: 0;
    left: 50%;
    margin-left: -0.666rem;
    height: 0.133rem;
    z-index: 999;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #009FE8;
  }

  #pullrefresh {
  }

  .list-ask .list-ask-item {
    position: relative;
    line-height: 1.066rem;
  }

  .list-ask .list-ask-item .title {
    line-height: 0.746rem;
  }

  .list-ask .list-ask-item .mui-media-body {
    padding-left: 0.266rem;
    line-height: 0.64rem;
    margin: 0.133rem 0 0;
    color: #9B9B9B;
    font-size: 0.32rem;
  }

  .list-ask .list-ask-item .time {
    color: #9B9B9B;
    font-size: 0.32rem;
    float: right;
    margin-right: 0.266rem;
  }

  .list-ask .username {
    color: #101010;
  }

  .list-ask .list-ask-item .amount {
    position: absolute;
    right: 0.266rem;
    color: #ff9800;
    font-size: 0.426rem;
  }

  .list-ask .list-ask-item .amount b {

  }

  .list-ask .person {
    position: relative;
  }

  .list-ask .site-desc {
    padding-left: 0.266rem;
    line-height: 0.586rem;
    color: #101010;
  }

  .list-ask .site-desc .mui-icon {
    font-size: 0.426rem;
  }

  .list-ask .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    display: inline-block;
    margin-top: 0.08rem;
    height: 1.333rem;
    width: 1.333rem;
    font-size: 0.533rem;
    text-align: center;
    border-radius: 50%;
  }

  .list-ask .avatar .avatarInner {
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

  .list-ask .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .list-ask .mui-table-view-cell {
    padding: 0.293rem 0.213rem;
  }

  .list-ask .mui-table-view-cell > a:not(.mui-btn) {
    margin: -0.293rem -0.213rem;
  }

  .list-ask p {
    margin-left: 0.533rem;
  }

  .buttons {
    margin-top: 0.266rem;
    padding: 0 0.8rem;
  }

  .mui-control-content {
    position: absolute;
    width: 100%;
    bottom: 0rem;
    right: 0rem;
    top: 2.346rem;
  }

  .menu {
    position: relative;
    z-index: 7;
  }

  .list-empty .menu {
    margin-bottom: 0;
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
    display: none;
  }

  .label {
    display: inline-block;
    background: #fcc816;
    border-radius: 1.333rem;
    color: #fff;
    line-height: 0.533rem;
    padding: 0 0.24rem;
  }

  .mui-table-view-cell:after {
    height: 0.026rem !important;
    left: 0.4rem;
    right: 0.4rem;
  }
</style>
