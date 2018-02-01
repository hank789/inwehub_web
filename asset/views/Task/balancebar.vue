<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">余额变动</h1>
    </header>

    <div class="mui-content absolute">
      <div class="mui-scroll-wrapper" id="pullrefresh">

        <div class="container" v-if="nothing == 1">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <p>暂时还没有数据呀～</p>
        </div>

        <div class="mui-scroll">
          <div v-show="nothing == 0">
            <ul v-for="item in list" @tap.stop.prevent="$router.pushPlus(item.data.url)">
              <!--<p>{{item.read_at}}</p>-->
              <li>
                <p>
									<span class="check">
			  				<i>交易成功</i>
			  				<i>{{item.created_at}}</i>
   	  			             </span>
                  <span><i v-if="item.data.io == 1">+</i><i
                    v-if="item.data.io == -1">-</i><i>{{item.data.change_money}}</i></span>
                  <span>{{item.data.title}}</span>
                  <i class="bot"></i>
                </p>
                <p>
                  <span>用户名：<i>{{item.data.name}}</i></span>
                  <span>余&nbsp;&nbsp;&nbsp;额：<i>{{item.data.current_balance}}</i></span>
                  <span v-if="item.data.extra_body">{{item.data.extra_body}}</span>
                  <i class="bot"></i>
                </p>
                <p>
                  <span>查看详情</span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-chakangengduojiantou"></use>
                  </svg>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--<div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>-->
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  const Readbar = {
    data: () => ({
      list: '',
      data: '',
      loading: true

    }),
    created () {

    },
    computed: {
      // 动态计算当前的页数；
      page () {
        if (this.data) {
          return parseInt(this.data.current_page) + 1
        }
        return 1
      },
      // 有无数据；
      nothing () {
        if (this.loading) {
          return -1
        }
        return this.list.length ? 0 : 1
      }
    },
    methods: {
      // 下拉刷新;
      pulldownRefresh () {
        setTimeout(() => {
          this.getPrevList()
        }, 1000)
      },
      // 下拉刷新请求的数据；
      getPrevList () {
        postRequest(`notification/money_list`, {}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.data.length > 0) {
            this.list = response.data.data.data
            this.data = response.data.data
          }
          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPulldownToRefresh() // refresh completed
        })
      },
      // 上拉加载；
      pullupRefresh () {
        setTimeout(() => {
          this.getNextList()
        }, 1000)
      },
      // 上拉加载；
      getNextList () {
        postRequest('notification/money_list', {
          page: this.page
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          // 请求成功的操作

          if (response.data.data.data.length > 0) {
            // 给请求的数据重新赋值；刷新最新的数据；
            this.list = this.list.concat(response.data.data.data)
            this.data = response.data.data
          }

          this.loading = 0

          window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
        })
      },
      // 请求标记
      sign () {
        postRequest(`notification/mark_as_read`, {
          notification_type: 2
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
        })
      }
    },
    mounted () {
      // 请求数据；
      window.mui.init({
        pullRefresh: {
          container: '#pullrefresh',
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
      this.sign()
    }
  }
  export default Readbar
</script>

<style scoped>
  .bot {
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  /*滚动区域*/

  .mui-bar-nav ~ .mui-content {
    padding-top: 0px;
  }

  .mui-wechat #pullrefresh {
    margin-top: 0px;
  }

  .mui-content {
    background: #FFFFFF;
  }

  /*主体部分样式*/

  ul {
    width: 100%;
    padding: 0px 16px 0 16px;
    margin-top: 11px;
  }

  ul p {
    text-align: center;
    position: relative;
  }

  ul li {
    width: 100%;
    background: #f3f4f6;
    margin-top: 20px;
    border: 0.5px solid #dcdcdc;
    border-radius: 5px;
    padding: 12px 15px;
  }

  ul li p:nth-of-type(1) {
    width: 100%;
    height: 110px;
  }

  ul li p:nth-of-type(1) .check {
    display: inline-block;
    width: 100%;
    height: 20px;
  }

  .check i:nth-of-type(1) {
    float: left;
    font-size: 14px;
    color: #444444;
  }

  .check i:nth-of-type(2) {
    font-size: 12px;
    color: #808080;
    float: right;
  }

  ul li p:nth-of-type(1) span:nth-of-type(2) {
    display: block;
    margin-top: 23px;
    font-size: 23px;
    color: #444444;
  }

  ul li p:nth-of-type(1) span:nth-of-type(3) {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #808080;
  }

  ul li p:nth-of-type(2) {
    overflow: hidden;
  }

  ul li p:nth-of-type(2) span {
    width: 100%;
    float: left;
    text-align: left;
    display: block;
    color: rgb(128, 128, 128);
    height: 28px;
    line-height: 25px;
  }

  ul li p:nth-of-type(2) span:last-of-type {
    /*width: 100%;
        height: 35px;
        line-height: 20px;*/
  }

  ul li p:nth-of-type(2) span:nth-child {
    width: 100%;
    height: 22px;
  }

  ul li p:nth-of-type(3) {
    width: 100%;
    height: 25px;
    color: #808080;
    font-size: 14px;
  }

  ul li p:nth-of-type(3) span {
    float: left;
    line-height: 35px;
  }

  ul li p:nth-of-type(3) svg {
    float: right;
    margin-top: 10px;
  }

  /*无数据的样式 */

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 60px;
    margin-left: 23px;
    margin-bottom: 8px;
  }

  .container p {
    font-size: 12px;
    color: #c8c8c8;
  }
</style>
