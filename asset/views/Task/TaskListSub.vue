<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
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
  import RefreshList from '../../components/refresh/MescrollList.vue'

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
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
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
          return Date.parse(deadline.replace(/-/g, '/')) / 1000
        }
        return null
      },
      // 跳转时判断类型。1为提问  2是回答  3新手任务-完善个人信息 4新手任务-参与阅读评论 5新手任务-发起提问
      goDetail (task) {
        var id = task.object_id
        switch (task.task_type) {
          case 1:
            this.$router.pushPlus('/ask/offer/answers/' + id)
            break
          case 2:
            this.$router.pushPlus('/ask/offer/' + id)
            break
          case 3:
            this.$router.pushPlus('/my/info')
            break
          case 4:
            this.$router.pushPlus('/discover')
            break
          case 5:
            this.$router.pushPlus('/ask/' + id)
            break
          case 6:
            this.$router.pushPlus('/ask/offer/' + id)
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
    /*height: 1.2rem;*/
    /*position: absolute;*/
    /*z-index: 10;*/
    /*background: #f3f4f6;*/
    /*top: 0;*/
  /*}*/

  /*导航栏的样式*/

  /*.menu {*/
    /*width: 100%;*/
    /*height: 1.2rem;*/
    /*position: absolute;*/
    /*z-index: 10;*/
    /*background: #f3f4f6;*/
  /*}*/

  /*.menu span {*/
    /*display: inline-block;*/
    /*width: 49%;*/
    /*height: 100%;*/
    /*font-size: 0.373rem;*/
    /*color: #444444;*/
    /*text-align: center;*/
    /*line-height: 1.2rem;*/
    /*font-weight: 600;*/
  /*}*/

  /*.menu span:nth-of-type(1) {*/
    /*color: #3c95f9;*/
  /*}*/

  /*.menu i {*/
    /*display: block;*/
    /*position: absolute;*/
    /*width: 0.8rem;*/
    /*height: 0.048rem;*/
    /*left: 20.55%;*/
    /*bottom: 0.013rem;*/
    /*background: #3c95f9;*/
  /*}*/

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

  .mui-content .menu ~ #pullrefresh {
    top:1.2rem;
    bottom: 1.093rem;
  }

  .mui-content {
    background: #FFFFFF;
  }

  /*主体部分样式*/

  ul li {
    position: relative;
    padding: 0.266rem 0.426rem 0rem 0.426rem;
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
    font-size: 1.12rem;
  }

  ul li p {
    margin-left: 3%;
    width: 86%;
    float: left;
  }

  ul li p span {
    display: block;
    margin-bottom: 0.16rem;
    width: 100%;
  }

  ul li p span:nth-of-type(1) {
    /*background: #CCCCCC;*/
    overflow: hidden;
  }

  ul li p span:nth-of-type(1) a {
    display: block;
    float: left;
    font-size: 0.426rem;
    color: #444444;
  }

  ul li p span:nth-of-type(1) a:nth-of-type(1) {

    padding-right: 0.133rem;
  }

  ul li p span:nth-of-type(1) a.level {
    font-size: 0.32rem;
    padding: 0.106rem 0.133rem;
    color: #FFFFFF;
    margin-left: 0.213rem;
  }

  ul li p span:nth-of-type(2) {
    font-size: 0.373rem;
    color: #808080;
  }

  ul li p span:nth-of-type(3) {
    font-size: 0.32rem;
    color: #b4b4b6;
  }

  ul li p span:nth-of-type(3) div {
    display: inline-block;
  }

  .message {
    width: 0.186rem;
    height: 0.186rem;
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
    font-size: 1.6rem;
    margin-left: 0.613rem;
    margin-bottom: 0.213rem;
  }

  .container p {
    font-size: 0.32rem;
    color: #c8c8c8;
  }

  .list-empty {
    top: 2.373rem !important;
  }

  .list-empty .list-ask-item {
    padding: 0.266rem 0;
  }

  .list-empty .list-ask-item:after{
    display: none;
  }

  .menu_message {
    position: absolute;
    left: 79%;
    top: 0.213rem;
    background: #f03c69;
    font-size: 0.293rem;
    text-align: center;
    color: #fff;
    padding: 0rem 0.08rem;
    min-width: 0.4rem;
    min-height: 0.4rem;
    border-radius: 0.4rem;
    line-height: 0.4rem;
  }
  .listWrapper{
  }
</style>
