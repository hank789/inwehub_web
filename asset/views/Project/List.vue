<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav goheader">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="goBack()"></a>
      <h1 class="mui-title">需求管理</h1>
    </header>


    <div class="mui-content absolute">
      <div class=" mui-scroll-wrapper" id="refurbish">

        <div class="nocontent" v-if="nothing == 1">
          <div class="Logo">
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/project/basic?id=' + item.id)">
              <use xlink:href="#icon-zanwushuju"></use>
            </svg>
            <p>暂时还没有数据呀～</p>
          </div>
        </div>


        <div class="mui-scroll">
          <div v-show="nothing == 0">
            <ul class="projectList1" v-for="item in list"
                @tap.stop.prevent="$router.pushPlus('/project/review?id=' + item.id)">
              <li>
                <span class="mui-ellipsis">{{item.project_name}}</span>

                <span class="waiting" v-if="item.status =='1'">等待审核</span>
                <span class="fail" v-if="item.status =='3'">审核未通过</span>
                <span class="pass" v-if="item.status =='2'">审核通过</span>
                <svg class="icon" aria-hidden="true"
                     @tap.stop.prevent="$router.pushPlus('/project/basic?id=' + item.id)" v-if="item.status !='2'">
                  <use xlink:href="#icon-shuru"></use>
                </svg>
              </li>
              <li>
                <span class="mui-ellipsis">{{item.company_represent_person_name}}</span>
                <span></span>
                <span class="mui-ellipsis">{{item.company_name}}</span>
              </li>
              <li>{{item.updated_at}}</li>
            </ul>
          </div>
           


        </div>
      </div>
    </div>


  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  export default {
    data () {
      return {
        list: [],
        loading: true
      }
    },
    created () {
      // 点击一次进行跳转
      // showInwehubWebview();
    },
    methods: {
      // 判断返回哪个页面；
      goBack () {
        if (this.$route.query.back) {
          this.$router.pushPlus(this.$route.query.back)
        } else {
          this.$router.pushPlus('/company/my')
        }
      },
      // 下拉刷新;
      pulldownRefresh () {
        setTimeout(() => {
          this.getPrevList()
        }, 1000)
      },
      // 下拉刷新请求的数据；
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
          window.mui('#refurbish').pullRefresh().endPulldownToRefresh() // refresh completed
        })
      },
      pullupRefresh () {
        setTimeout(() => {
          this.getNextList()
        }, 1000)
      },
      getNextList () {
        postRequest('project/myList', {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            // 给请求的数据重新赋值；刷新最新的数据；
            this.list = this.list.concat(response.data.data)
          }

          this.loading = 0

          window.mui('#refurbish').pullRefresh().endPullupToRefresh(false)
        })
      }
    },
    computed: {
      // 动态计算最后一个数据的id
      bottomId () {
        var length = this.list.length
        if (length) {
          return this.list[length - 1].id
        }
        return 0
      },
      // 有无数据；
      nothing () {
        if (this.loading) {
          return -1
        }
        return this.list.length ? 0 : 1
      }
    },
    mounted () {
      // 每次进入页面进行刷新；
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-answerList')
        this.getPrevList()
      })
      // 请求数据；
      window.mui.init({
        pullRefresh: {
          container: '#refurbish',
          down: {
            contentdown: '下拉可以刷新', // 可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: '释放立即刷新', // 可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: '正在刷新...', // 可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: this.pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了', // 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: this.getNextList
          }
        }
      })

      // 加载页面请求一次；
      this.getPrevList()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .nocontent {
    width: 100%;
    height: 100%;
    background: #ffffff;
    position: relative;
    .Logo {
      width: 5.466rem;
      height: 3.253rem;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      svg {
        width: 2.4rem;
        height: 1.733rem;
        display: block;
        margin: 0 auto;

      }
      p {
        width: 5.466rem;
        height: 0.64rem;
        font-family: "PingFangSC";
        font-size: 0.373rem;
        line-height: 0.64rem;
        text-align: center;
        color: #808080;
        margin-top: 0.32rem;
      }
    }
  }

  ul {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
    }
  }

  .waiting {
    background: #a8dff7;
  }

  .pass {
    background: #03aef9;
  }

  .fail {
    background: #f03c69;
  }

  .mui-content {
    height: 100%;
    width: 100%;
    background: #ececee;

  }

  .projectList1 {
    width: 100%;
    background: #ffffff;
    padding: 0.453rem 0.426rem 0.426rem 0.426rem;
    margin-bottom: 0.266rem;
    position: relative;
    li {
      &:nth-child(1) {
        width: 8.24rem;
        span {
          &:nth-child(1) {
            display: inline-block;
            max-width: 4.8rem;
            height: 0.6rem;
            font-family: "PingFangSC";
            font-size: 0.426rem;
            color: #444444;
            margin-bottom: -0.16rem;
          }
          &:nth-child(2) {
            height: 0.533rem;
            border-radius: 1.333rem;
            font-family: "PingFangSC";
            font-size: 0.293rem;
            text-align: center;
            color: #ffffff;
            padding: 0.053rem 0.293rem 0.08rem 0.266rem;
            margin-left: 0.213rem;
            margin-bottom: 0.053rem;
          }
        }
        svg {
          position: absolute;
          top: 0.533rem;
          right: 0.426rem;
          width: 0.426rem;
          height: 0.453rem;
          color: #03aef9;
        }
      }
      &:nth-child(2) {
        margin-top: 0.266rem;
        width: 100%;
        height: 0.373rem;
        span {
          &:nth-child(1) {
            display: inline-block;
            max-width: 3.466rem;
            height: 0.533rem;
            font-family: ".PingFangSC";
            color: #808080;
            font-size: 0.373rem;
          }
          &:nth-child(2) {
            display: inline-block;
            width: 0.026rem;
            height: 0.373rem;
            background: #c8c8c8;
            margin-left: 0.213rem;
            margin-right: 0.213rem;
            margin-bottom: 0.053rem;

          }
          &:nth-child(3) {
            display: inline-block;
            max-width: 3.466rem;
            height: 0.533rem;
            font-family: ".PingFangSC";
            color: #808080;
            color: #808080;
            font-size: 0.373rem;
          }

        }

      }
      &:nth-child(3) {
        margin-top: 0.413rem;
        width: 100%;
        height: 0.44rem;
        font-family: "PingFangSC";
        font-size: 0.32rem;
        color: #b4b4b6;
      }
    }
  }

</style>
