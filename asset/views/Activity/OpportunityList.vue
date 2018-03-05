<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">活动与机遇</h1>
    </header>


    <div class="mui-content absolute">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/home/ActiveList')">活动</span>
        <span @tap.stop.prevent="">机遇</span>
        <i class="bot"></i>
      </div>
      <div id="pullrefresh"
           :class="{'mui-content':false, 'mui-scroll-wrapper':true, 'task-list':true, 'emptyList':nothing}">
        <div class="container" v-if="nothing == 1">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <p>暂时还没有数据呀～</p>
        </div>


        <div class="mui-scroll" v-show="nothing == 0">
          <!---->
          <ul>
            <li v-for="item in list" @tap.stop.prevent="skip(item.id)">
              <img :src="item.image_url"/>
              <p>{{item.title}}</p>
              <p>
                <span>{{item.created_at}} </span>
                <span class="blue" v-if="item.status =='1'">立即报名</span>
                <span class="gray" v-if="item.status =='2'">报名结束</span>
                <span class="yellow" v-if="item.status =='3'">申请中</span>
                <span class="yellow" v-if="item.status =='4'">报名成功</span>
                <span class="gray" v-if="item.status =='5'">报名失败</span>
                <span class="blue" v-if="item.status =='6'">重新申请</span>
              </p>
              <i class="bot"></i>
            </li>
          </ul>
          <!---->
        </div>
      </div>
      <div class="cooperation" @tap.stop.prevent="$router.pushPlus('/seekingCooperation')">
        <p>寻求合作</p>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xunhezuo"></use>
          </svg>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import userAbility from '../../utils/userAbility'
  const Chance = {
    data: () => ({
      list: [],
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
      // 跳转；
      skip (id) {
        userAbility.jumpToApplyOpportunity(this, id)
      },
      // 下拉刷新;
      pulldownRefresh () {
        setTimeout(() => {
          this.getPrevList()
        }, 1000)
      },
      goUrl (url) {
        if (/resume/.test(url)) {
          this.$router.pushPlus(url + '&goback=1')
        } else {
          this.$router.pushPlus(url)
        }
      },
      // 下拉刷新请求的数据；
      getPrevList () {
        postRequest(`activity/list`, {activity_type: 2, is_mine: 0}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          console.log(response.data.data.data)
          if (response.data.data.data.length > 0) {
            this.list = response.data.data.data
            this.data = response.data.data
          }

          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPulldownToRefresh() // refresh completed
        })
      },
      pullupRefresh () {
        setTimeout(() => {
          this.getNextList()
        }, 1000)
      },
      // 上拉加载；
      getNextList () {
        postRequest('activity/list', {
          activity_type: 2,
          is_mine: 0,
          page: this.page
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.data) {
            this.list = this.list.concat(response.data.data.data)
            this.data = response.data.data
          }

          this.loading = 0

          window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
        })
      }
    },
    mounted () {
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
    }
  }
  export default Chance

</script>

<style scoped>
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

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-wechat .menu[data-v-4f45c199] {
    width: 100%;
    height: 1.2rem;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    top: 0;
  }

  .mui-content.absolute .menu ~ #pullrefresh {
    top: 1.2rem;
  }

  .mui-content.absolute {
    background: #FEFFFE;
  }

  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 1.2rem;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
  }

  .menu span {
    display: inline-block;
    width: 49%;
    height: 100%;
    font-size: 0.373rem;
    color: #3c95f9;
    text-align: center;
    line-height: 1.2rem;
    font-weight: 600;
  }

  .menu span:nth-of-type(1) {
    color: #444444;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 0.8rem;
    height: 0.048rem;
    left: 71%;
    bottom: 0.013rem;
    background: #03aef9;
  }

  /*滚动区域*/
  ul {
    width: 100%;
    position: relative;
    padding-bottom: 0.533rem;
    overflow: hidden;

  }

  /*ul li{
        width: 92%;
        height: 6.053rem;
        position: relative;
        left: 0;
        right: 0;
        margin: auto;

    }
    ul li img{
        width: 100%;
        height: 3.813rem;
        margin-top: 0.4rem;
    }*/
  ul li p:nth-of-type(1) {
    font-size: 0.373rem;
    color: #444444;
    margin-top: 0.133rem;
  }

  ul li p:nth-of-type(2) {
    width: 100%;
    height: 0.506rem;
    margin-top: 0.106rem;
  }

  ul li p:nth-of-type(2) span:nth-child(1) {
    display: block;
    color: #b4b4b6;
    font-size: 0.32rem;
    line-height: 0.506rem;
    float: left;

  }

  ul li p:nth-of-type(2) span.blue {
    display: block;
    width: 2rem;
    height: 0.506rem;
    float: right;
    background: #03aef9;
    color: #FFFFFF;
    font-size: 0.373rem;
    text-align: center;
    line-height: 0.506rem;
    border-radius: 1.333rem;
    padding: 0 0.213rem;
  }

  ul li p:nth-of-type(2) span.yellow {
    display: block;
    width: 2rem;
    height: 0.506rem;
    float: right;
    background: #fcc816;
    color: #FFFFFF;
    font-size: 0.373rem;
    text-align: center;
    line-height: 0.506rem;
    border-radius: 1.333rem;
    padding: 0 0.213rem;
  }

  ul li p:nth-of-type(2) span.gray {
    display: block;
    width: 2rem;
    height: 0.506rem;
    float: right;
    background: #b4b4b6;
    color: #FFFFFF;
    font-size: 0.373rem;
    text-align: center;
    line-height: 0.506rem;
    border-radius: 1.333rem;
    padding: 0 0.213rem;
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

  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    ul li {
      width: 92%;
      height: 5.786rem;
      position: relative;
      left: 0;
      right: 0;
      margin: auto;
    }

    ul li img {
      width: 100%;
      height: 3.546rem;
      margin-top: 0.4rem;
      border-radius: 0.106rem;
    }
  }

  @media screen and (min-width: 375px) {
    ul li {
      width: 92%;
      height: 6.053rem;
      position: relative;
      left: 0;
      right: 0;
      margin: auto;
    }

    ul li img {
      width: 100%;
      height: 3.866rem;
      margin-top: 0.4rem;
      border-radius: 0.106rem;
    }
  }

  @media screen and (min-width: 414px) {
    ul li {
      width: 92%;
      height: 6.826rem;
      position: relative;
      left: 0;
      right: 0;
      margin: auto;
    }

    ul li img {
      width: 100%;
      height: 4.586rem;
      margin-top: 0.4rem;
      border-radius: 0.106rem;
    }
  }
  /*需求合作样式*/
  .cooperation{
    width:2.773rem;
    height:1.36rem;
    border:0.026rem solid #03aef9;
    background: #FFFFFF;
    border-radius: 1.333rem;
    position: fixed;
    bottom: 0.546rem;
    right:0.4rem;
    z-index: 999;
  }
  .cooperation p:nth-of-type(1){
    width:0.746rem;
    height:0.8rem;
    font-size:0.373rem;
    color: #444444;
    line-height:0.4rem;
    margin-top: 0.28rem;
    margin-left: 0.506rem;
  }
  .cooperation p:nth-of-type(2){
    width:1.573rem;
    height:1.573rem;
    background:#03aef9;
    border-radius: 50%;
    position: absolute;
    right:-0.16rem;
    top:-0.133rem;
  }
  .cooperation p:nth-of-type(2) svg{
    font-size:0.8rem;
    position: absolute;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    margin: auto;
  }
</style>
