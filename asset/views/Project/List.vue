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
      width: 20.5rem;
      height: 12.2rem;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      svg {
        width: 9rem;
        height: 6.5rem;
        display: block;
        margin: 0 auto;

      }
      p {
        width: 20.5rem;
        height: 2.4rem;
        font-family: "PingFangSC";
        font-size: 1.4rem;
        line-height: 2.4rem;
        text-align: center;
        color: #808080;
        margin-top: 1.2rem;
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
    padding: 1.7rem 1.6rem 1.6rem 1.6rem;
    margin-bottom: 1rem;
    position: relative;
    li {
      &:nth-child(1) {
        width: 30.9rem;
        span {
          &:nth-child(1) {
            display: inline-block;
            max-width: 18rem;
            height: 22.0.5rem;
            font-family: "PingFangSC";
            font-size: 1.6rem;
            color: #444444;
            margin-bottom: -0.6rem;
          }
          &:nth-child(2) {
            height: 2rem;
            border-radius: 5rem;
            font-family: "PingFangSC";
            font-size: 1.1rem;
            text-align: center;
            color: #ffffff;
            padding: 0.2rem 1.1rem 0.3rem 1rem;
            margin-left: 0.8rem;
            margin-bottom: 0.2rem;
          }
        }
        svg {
          position: absolute;
          top: 2rem;
          right: 1.6rem;
          width: 1.6rem;
          height: 1.7rem;
          color: #03aef9;
        }
      }
      &:nth-child(2) {
        margin-top: 1rem;
        width: 100%;
        height: 1.4rem;
        span {
          &:nth-child(1) {
            display: inline-block;
            max-width: 13rem;
            height: 2rem;
            font-family: ".PingFangSC";
            color: #808080;
            font-size: 1.4rem;
          }
          &:nth-child(2) {
            display: inline-block;
            width: 0.1rem;
            height: 1.4rem;
            background: #c8c8c8;
            margin-left: 0.8rem;
            margin-right: 0.8rem;
            margin-bottom: 0.2rem;

          }
          &:nth-child(3) {
            display: inline-block;
            max-width: 13rem;
            height: 2rem;
            font-family: ".PingFangSC";
            color: #808080;
            color: #808080;
            font-size: 1.4rem;
          }

        }

      }
      &:nth-child(3) {
        margin-top: 15.0.5rem;
        width: 100%;
        height: 16.0.5rem;
        font-family: "PingFangSC";
        font-size: 1.2rem;
        color: #b4b4b6;
      }
    }
  }

</style>
