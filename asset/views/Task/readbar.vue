<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">动态通知</h1>
    </header>

    <div class="mui-content absolute">
      <div class="mui-scroll-wrapper" id="pullrefresh">
        <div class="container" v-if="nothing == 1">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <p>暂时还没有数据呀～</p>
        </div>

        <div class="mui-scroll" v-show="nothing == 0">
          <ul>
            <li v-for="item in list" @tap.stop.prevent="$router.pushReadHubPage(item.data.url)">
              <img class="lazyImg" v-lazy="item.data.avatar"/>
              <div class="message" v-if="item.read_at == null"></div>
              <p>
                <span>{{item.data.title}}</span>
                <span class="mui-ellipsis" v-html="textToLink(item.data.body)"></span>
                <span class="mui-ellipsis" v-if="item.data.extra_body"></span>
                <span class="fourth">{{timeago(item.created_at)}}</span>
              </p>
              <i class="bot"></i>
            </li>

          </ul>

        </div>
      </div>
    </div>
    <!--<div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>-->
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { textToLinkHtml, secureHtml } from '../../utils/dom'
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
      textToLink (text) {
        return secureHtml(textToLinkHtml(text))
      },
      // 下拉刷新;
      pulldownRefresh () {
        setTimeout(() => {
          this.getPrevList()
        }, 1000)
      },
      // 下拉刷新请求的数据；
      getPrevList () {
        postRequest(`notification/readhub_list`, {}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          // 请求成功的操作

          if (response.data.data.data.length > 0) {
            this.list = response.data.data.data
            this.data = response.data.data
            // console.log(response.data.data);
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
        postRequest('notification/readhub_list', {
          page: this.page
        }, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          // 请求成功的操作

          if (response.data.data.data.length > 0) {
            this.list = this.list.concat(response.data.data.data)
            this.data = response.data.data
            // console.log(response.data.data);
          }
          this.loading = 0

          window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
        })
      },
      // 请求标记
      sign () {
        postRequest(`notification/mark_as_read`, {
          notification_type: 4
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
  .mui-content {
    background-color: #FFFFFF;
    -webkit-overflow-scrolling: touch;
  }

  .bot {
    position: absolute;
    right: 0.426rem;
    bottom: 0;
    left: 0.426rem;
    height: 0.026rem;
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

  .mui-wechat #pullrefresh {
    margin-top: 0rem;
  }

  /*主体部分样式*/

  ul li {
    position: relative;
    padding: 0.266rem 0.426rem 0rem 0.426rem;
    overflow: hidden;
  }
  ul li:nth-last-of-type(1) i{
    display: none;
  }
  ul li img {
    width: 1.12rem;
    height: 1.12rem;
    border-radius: 50%;
    float: left;
  }

  ul li p {
    margin-left: 2%;
    width: 81%;
    float: left;
  }

  ul li p span {
    display: block;
    margin-bottom: 0.186rem;
    width: 100%;
  }

  ul li p span:nth-of-type(1) {
    font-size: 0.426rem;
    color: #444444;
  }

  ul li p span:nth-of-type(2) {
    font-size: 0.373rem;
    color: #444444;
  }

  ul li p span:nth-of-type(3) {
    font-size: 0.32rem;
    color: #808080;
  }

  .message {
    width: 0.186rem;
    height: 0.186rem;
    background: #f03c69;
    border-radius: 50%;
    position: absolute;
    left: 14%;
    top: 9%;
  }

  .reader_time {
    font-size: 0.32rem;
    color: #b4b4b6;
    position: absolute;
    top: 0.266rem;
    right: 0.426rem;
  }

  /*无数据的样式 */

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 1.6rem;
    margin-left: 0.613rem;
    margin-bottom: 0.213rem;
  }

  .container p {
    font-size: 0.32rem;
    color: #c8c8c8;
  }
</style>
