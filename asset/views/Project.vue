<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-icon myicon myicon-project2 mui-pull-left" @tap.stop.prevent="$router.pushPlus('/home')"></a>
      <h1 class="mui-title">发布项目</h1>
    </header>

    <div class="mui-content" v-show="!loading">
      <div class="professor">
        <div class="title">我的项目</div>
        <div class="titleSub">{{ list.length}} 个项目</div>
      </div>

      <div class="empty" v-if="!list.length">
        <span class="mui-icon myicon myicon-project3"></span>
        <div class="title">尚未发布任何项目需求</div>
      </div>

      <div id="pullrefresh" class="list  mui-scroll-wrapper">
        <div class="mui-scroll" v-show="list.length">
          <div>
            <div class="item" v-for="(item, index) in list"
                 @tap.stop.prevent="$router.pushPlus('/project/submit/' + item.id)">
              <div class="time mui-navigate-right">{{ item.created_at.split(' ')[0]}} 发布</div>
              <div class="title">{{ item.project_name }}</div>
              <div class="desc mui-ellipsis-3">
                {{ item.description }}

              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="askDetail">
        <div class="titleSub" v-show="!list.length">点击“+”号可以发布新项目<br/>
          并选择您所需要的委托类型
        </div>

      </div>

      <div class="buttonWrapper">
        <div class="buttonAsk" @tap.stop.prevent="add"><span>+</span> 发布需求</div>
      </div>


    </div>
  </div>
</template>

<script>
  import { postRequest } from '../utils/request'
  import localEvent from '../stores/localStorage'

  export default {
    data () {
      const currentUser = localEvent.getLocalItem('UserInfo')
      return {
        isCompany: currentUser.is_company,
        list: [],
        loading: 1
      }
    },
    computed: {
      nothing () {
        if (this.loading) {
          return -1
        }
        return this.list.length ? 0 : 1
      },
      topId () {
        if (this.list.length) {
          return this.list[0].id
        }
        return 0
      },
      bottomId () {
        var length = this.list.length
        if (length) {
          return this.list[length - 1].id
        }
        return 0
      }
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-asklist')
        this.getPrevList()
      })

      window.mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function (event) {
        var lastY = event.detail.lastY

        localEvent.setLocalItem('projectPos', {lastY: lastY})
      })

      this.initPullRefresh()
    },
    methods: {
      getPrevList () {
        postRequest(`project/myList`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            this.list = response.data.data
          }
          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPulldownToRefresh() // refresh completed
          var newProjects = []
          for (var i in this.list) {
            var info = this.list[i]
            var id = info.id
            newProjects[id] = info
          }
          localEvent.setLocalItem('projects', newProjects)
        })
      },
      getNextList () {
        postRequest(`project/myList`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            this.list = this.list.concat(response.data.data)
          }

          this.loading = 0

          if (response.data.data.length < 10) {
            window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(true)
          } else {
            window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
          }

          var newProjects = []
          for (var i in this.list) {
            var info = this.list[i]
            var id = info.id
            newProjects[id] = info
          }

          localEvent.setLocalItem('projects', newProjects)
        })
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
      initPullRefresh () {
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
      add () {
        if (this.isCompany) {
          this.$router.pushPlus('/project/submit/0')
        } else {
          window.mui.alert('您的账户类型，暂无法使用此功能，如需申请企业账户请发送基本信息到 <a class="mailLink"  href="mailto:hi@inwehub.com">hi@inwehub.com</a>', null, '', null, 'div')
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      if (from.path === '/home' || from.path === '/my') {
        localEvent.clearLocalItem('projectPos')
      }
      next()
    },
    created () {
      // showInwehubWebview();
      var pos = localEvent.getLocalItem('projectPos')
      if (pos) {
        this.lastY = pos.lastY
      }
    }
  }
</script>

<style scoped="scoped">
  .professor {
    background-color: #3c3e44;
    text-align: center;
    position: relative;
    height: 13.6rem;

  }

  .professor .title {
    padding-top: 3rem;
    font-size: 2rem;
    color: #fff;
    font-weight: bolder;
  }

  .professor .titleSub {
    padding-top: 0.5rem;
    font-size: 1.4rem;
    color: #fff;
    font-weight: bolder;
  }

  .empty {
    text-align: center;
    padding-top: 3rem;
  }

  .empty .myicon {
    width: 12.5rem;
    height: 10.6rem;
  }

  .empty .title {
    color: #9B9B9B;
    font-size: 1.4rem;
    margin-top: 1rem;
  }

  .askDetail {
    position: absolute;
    bottom: 10rem;
    left: 50%;
    margin-left: -8.4rem;
  }

  .askDetail .titleSub {
    color: #9B9B9B;
    font-size: 1.4rem;
    margin-bottom: 2rem;
  }

  .askDetail {
    height: 6.7rem;
    text-align: center;
    margin-top: 0.5rem;
  }

  .askDetail .buttonAsk {
    position: relative;
    background: #4990E2;
    display: inline-block;
    width: 12.5rem;
    height: 3.7rem;
    font-size: 1.4rem;
    line-height: 3.7rem;
    text-align: center;
    border-radius: 5rem;
    padding-left: 2rem;

    color: #fff;
  }

  .askDetail .buttonAsk span {
    position: absolute;
    font-size: 3rem;
    left: 2rem;
    top: -0.4rem;
  }

  .mui-bar .myicon {
    width: 1.8rem;
    height: 1.8rem;
    left: 1rem;
    top: 1.2rem;
  }

  .list {
    position: absolute;
    top: 14rem;
  }

  .list .item {
    margin: 0 5rem 1rem;
    padding-bottom: 1.5rem;
    color: #4A4A4A;
    border-radius: 0.5rem;
    border: 0.1rem solid #9F9F9F;
    background: #fff;
  }

  .list .item:last-child {
    margin-bottom: 0;
  }

  .list .item .time {
    font-size: 1.2rem;

    padding: 1.5rem 1.5rem 0;
    position: relative;
  }

  .list .item .title {
    font-size: 2rem;
    padding: 1.5rem;
    position: relative;
  }

  .list .item .title:after {

    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.1rem;
    content: '';
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    background-color: #9F9F9F;

  }

  .list .item .desc {
    padding: 1.5rem 1.5rem 0;
    line-height: 2rem;
    font-size: 1.4rem;
  }

  .mui-navigate-right:after {
    font-weight: bolder;
    font-size: 2.2rem;
    right: 1.8rem;
    top: 2.4rem;
  }

  .buttonWrapper {
    position: fixed;
    bottom: 7rem;
    left: 50%;
    z-index: 997;
    margin-left: -6.2rem;
  }

  .buttonWrapper .buttonAsk {
    position: relative;
    background: #4990E2;
    display: inline-block;
    width: 12.5rem;
    height: 3.7rem;
    font-size: 1.4rem;
    line-height: 3.7rem;
    text-align: center;
    border-radius: 5rem;
    padding-left: 2rem;

    color: #fff;
  }

  .buttonWrapper .buttonAsk span {
    position: absolute;
    font-size: 3rem;
    left: 2rem;
    top: -0.4rem;
  }
</style>
