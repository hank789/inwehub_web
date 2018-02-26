<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">任务通知</h1>
    </header>

    <div class="mui-content">
      <!--导航栏-->
      <!--<div class="menu">-->
        <!--<span @tap.stop.prevent="">任务</span>-->
        <!--<span @tap.stop.prevent="$router.replace('/inform')">消息</span>-->

        <!--<div class="menu_message" v-show="total_count != 0">{{total_count}}</div>-->
        <!--<i></i>-->
      <!--</div>-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'task/myList'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :pageMode = "true"
        :list="list"
        class="listWrapper"
      >
        <ul>
          <li v-for="(task, index) in list" @tap.stop.prevent="goDetail(task)">
          <svg class="icon" aria-hidden="true" v-if="task.task_type =='3'">
          <use xlink:href="#icon-mingpianrenwu"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-else-if="task.task_type =='4'">
          <use xlink:href="#icon-chengchangye-hudongpinglun"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-else-if="task.task_type =='5'">
          <use xlink:href="#icon-chengchangye-wendarenwu"></use>
          </svg>
          <img :src="task.user_avatar_url" v-else/>
          <p>
          <span>
          <a v-if="task.task_type_description">{{task.task_type_description}}  |</a>
          <a>{{task.status_description}}</a>
          <!--级别判断-->
          <a class="mui-badge mui-badge-danger level" v-if="task.priority =='高'">优先级 高</a>
          <a class="mui-badge mui-badge-warning level" v-if="task.priority =='中'">优先级 中</a>
          <a class="mui-badge mui-badge-warning level" v-if="task.priority =='低'">优先级 低</a>
          </span>
          <!---->
          <span class="mui-ellipsis">{{ task.description }}</span>
          <!--时间判断-->
          <span class="time" v-if="startCountdown(task)">倒计时
          <count-down :start-time="currentTime"
          :end-time="getEndTime(task)"
          :dayTxt="':'" :hourTxt="':'"
          :minutesTxt="':'">
          </count-down>
          </span>

          <span class="time" v-else-if="isTimeout(task)">
          <b>已超时</b><timeago :since="timeago(task.deadline)"
          :auto-update="60"></timeago>
          </span>

          <span class="time" v-else><b v-show="isTimeout(task)">已超时</b>
          <timeago :since="timeago(task.created_at)" :auto-update="60">
          </timeago>
          </span>

          </p>
          <i class="bot"></i>
          </li>
        </ul>

      </RefreshList>
    </div>
  </div>
</template>

<script>
  import CountDown from 'vue2-countdown'
  import RefreshList from '../../components/refresh/List.vue'

  const Task = {
    data: () => ({
      list: [],
      loading: true,
      currentTime: (new Date()).getTime(),
      total_count: 0,
      mobile: 0

    }),
    components: {
      CountDown,
      RefreshList
    },
    created () {
    },
    methods: {
      empty () {
        window.mui.back()
      },
      messagecountchange (obj) {
        this.total_count = obj
      },
      initData () {
        // 执行刷新
        console.log('refresh-taskList')
//        this.initPullRefresh()
      },
      // 判断是否超时；
      isTimeout (task) {
        if (!task.deadline) {
          return false
        }

        var endtime = this.getEndTime(task)
        var currentTime = (new Date()).getTime() / 1000
        if (endtime < currentTime) {
          return true
        }

        return false
      },
      startCountdown (task) {
        var endtime = this.getEndTime(task)
        var currentTime = (new Date()).getTime() / 1000
        if (endtime < currentTime) {
          return false
        }
        return true
      },
      // 对获取的时间做的处理;
      getEndTime (task) {
        var deadline = task.deadline
        if (deadline) {
          return Date.parse(deadline.replace(/-/g, '／')) / 1000
        }
        return null
      },
      // 跳转时判断类型。1为提问  2是回答  3新手任务-完善个人信息 4新手任务-参与阅读评论 5新手任务-发起提问
      goDetail (task) {
        var id = task.object_id
        switch (task.task_type) {
          case 1:
            this.$router.pushPlus('/answer/' + id, 'list-detail-page')
            break
          case 2:
            this.$router.pushPlus('/ask/' + id, 'list-detail-page')
            break
          case 3:
            this.$router.pushPlus('/my/info')
            break
          case 4:
            this.$router.pushPlus('/discover')
            break
          case 5:
            this.$router.pushPlus('/ask/' + id, 'list-detail-page')
            break
          case 6:
            this.$router.pushPlus('/askCommunity/major/' + id, 'list-detail-page')
            break
        }
      },
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      }
    },
    filters: {
      textLimit (text) {
        var limit = 50
        if (text.length > limit) {
          text = text.slice(0, limit) + '...'
        }
        return text
      }
    }
  }
  export default Task
</script>

<style scoped>
  /*.mui-wechat .menu[data-v-4f45c199] {*/
    /*width: 100%;*/
    /*height: 4.5rem;*/
    /*position: absolute;*/
    /*z-index: 10;*/
    /*background: #f3f4f6;*/
    /*top: 0;*/
  /*}*/

  /*导航栏的样式*/

  /*.menu {*/
    /*width: 100%;*/
    /*height: 4.5rem;*/
    /*position: absolute;*/
    /*z-index: 10;*/
    /*background: #f3f4f6;*/
  /*}*/

  /*.menu span {*/
    /*display: inline-block;*/
    /*width: 49%;*/
    /*height: 100%;*/
    /*font-size: 1.4rem;*/
    /*color: #444444;*/
    /*text-align: center;*/
    /*line-height: 4.5rem;*/
    /*font-weight: 600;*/
  /*}*/

  /*.menu span:nth-of-type(1) {*/
    /*color: #3c95f9;*/
  /*}*/

  /*.menu i {*/
    /*display: block;*/
    /*position: absolute;*/
    /*width: 3rem;*/
    /*height: 0.18rem;*/
    /*left: 20.55%;*/
    /*bottom: 0.05rem;*/
    /*background: #3c95f9;*/
  /*}*/

  .bot {
    position: absolute;
    right: 1.6rem;
    bottom: 0;
    left: 1.6rem;
    height: 0.1rem;
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

  .mui-content .menu ~ #pullrefresh {
    top:4.5rem;
    bottom: 4.1rem;
  }

  .mui-content {
    background: #FFFFFF;
  }

  /*主体部分样式*/

  ul li {
    position: relative;
    padding: 1rem 1.6rem 0rem 1.6rem;
    overflow: hidden;
  }

  ul li img {
    width: 11%;
    height: 11%;
    border-radius: 25%;
    float: left;
  }

  ul li svg {
    width: 11%;
    /*height: 11%;*/
    /*border-radius: 25%;*/
    /*background: #CCCCCC;*/
    float: left;
    color: #03aef9;
    font-size: 4.2rem;
  }

  ul li p {
    margin-left: 3%;
    width: 86%;
    float: left;
  }

  ul li p span {
    display: block;
    margin-bottom: 0.6rem;
    width: 100%;
  }

  ul li p span:nth-of-type(1) {
    /*background: #CCCCCC;*/
    overflow: hidden;
  }

  ul li p span:nth-of-type(1) a {
    display: block;
    float: left;
    font-size: 1.6rem;
    color: #444444;
  }

  ul li p span:nth-of-type(1) a:nth-of-type(1) {

    padding-right: 0.5rem;
  }

  ul li p span:nth-of-type(1) a.level {
    font-size: 1.2rem;
    padding: 0.4rem 0.5rem;
    color: #FFFFFF;
    margin-left: 0.8rem;
  }

  ul li p span:nth-of-type(2) {
    font-size: 1.4rem;
    color: #808080;
  }

  ul li p span:nth-of-type(3) {
    font-size: 1.2rem;
    color: #b4b4b6;
  }

  ul li p span:nth-of-type(3) div {
    display: inline-block;
  }

  .message {
    width: 0.7rem;
    height: 0.7rem;
    background: #f03c69;
    border-radius: 50%;
    position: absolute;
    left: 14.5%;
    top: 8%;
  }

  /*无数据的样式 */

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 6rem;
    margin-left: 2.3rem;
    margin-bottom: 0.8rem;
  }

  .container p {
    font-size: 1.2rem;
    color: #c8c8c8;
  }

  .list-empty {
    top: 8.9rem !important;
  }

  .list-empty .list-ask-item {
    padding: 1rem 0;
  }

  .list-empty .list-ask-item:after{
    display: none;
  }

  .menu_message {
    position: absolute;
    left: 79%;
    top: 0.8rem;
    background: #f03c69;
    font-size: 1.1rem;
    text-align: center;
    color: #fff;
    padding: 0rem 0.3rem;
    min-width: 1.5rem;
    min-height: 1.5rem;
    border-radius: 1.5rem;
    line-height: 1.5rem;
  }
  .listWrapper{
    bottom: 5rem;
  }
</style>
