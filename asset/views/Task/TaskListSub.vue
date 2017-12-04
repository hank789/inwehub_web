<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">通知</h1>
    </header>

    <div class="mui-content absolute">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">任务</span>
        <span @tap.stop.prevent="$router.replace('/inform')">消息</span>

        <div class="menu_message" v-show="total_count != 0">{{total_count}}</div>
        <i></i>
      </div>
      <div id="pullrefresh"
           :class="{'mui-scroll-wrapper'  :true, 'task-list':true, 'list-empty':nothing}">

        <div class="mui-table-view list-ask-item" v-show="nothing === 1">
          <div class="mui-table-view-cell">
            <div>
              <div class="title">暂无任务</div>
              <div class="subTitle">稍安勿躁，是金子总会发光！<br/>平台正准备给您一展风采的机会呢！</div>
            </div>
          </div>
        </div>

        <div class="mui-scroll" v-show="nothing == 0">
          <ul>
            <li v-for="(task, index) in tasks" @tap.stop.prevent="goDetail(task)">
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


        </div>
      </div>
    </div>

    <!-- <div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>-->
  </div>
</template>

<script>
  import { TASK_INFO_APPEND, TASK_LIST_APPEND } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import CountDown from 'vue2-countdown'

  const Task = {
    data: () => ({
      tasks: [],
      loading: true,
      currentTime: (new Date()).getTime(),
      total_count: 0,
      mobile: 0

    }),
    components: {
      CountDown
    },
    computed: {
      nothing () {
        if (this.loading) {
          return -1
        }
        return this.tasks.length ? 0 : 1
      },
      topId () {
        if (this.tasks.length) {
          return this.tasks[0].id
        }
        return 0
      },
      bottomId () {
        var length = this.tasks.length
        if (length) {
          return this.tasks[length - 1].id
        }
        return 0
      },
      lastY () {
        if (this.isFromDetail()) {
          return this.$store.state.task.info.lastY
        } else {
          return 0
        }
      }
    },
    created () {
      // showInwehubWebview();
      var list = []
      if (this.isFromDetail()) {
        list = this.$store.state.task.list
      }

      if (list.length) {
        this.tasks = list
        this.loading = false
      }
    },
    activated: function () {
      this.initPullRefresh()
    },
    mounted () {
      var t = this
      window.mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function (event) {
        var lastY = event.detail.lastY
        t.$store.dispatch(TASK_INFO_APPEND, {
          lastY: lastY
        })
      })
      this.initPullRefresh()
    },
    updated () {
      this.$store.dispatch(TASK_LIST_APPEND, this.tasks)
    },
    methods: {
      messagecountchange (obj) {
        this.total_count = obj
      },
      initData () {
        // 执行刷新
        console.log('refresh-taskList')
        this.initPullRefresh()
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
      // 数据列表的刷新 加载的操作；
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
        // 刷新页面时自动加载； 默认10条数据；
        this.getPrevList()
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
        }
      },
      // 下拉刷新时的延时操作；
      pulldownRefresh () {
        setTimeout(() => {
          this.getPrevList()
        }, 1000)
      },
      // 下拉加载时的延时操作；
      pullupRefresh () {
        setTimeout(() => {
          this.getNextList()
        }, 1000)
      },
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      // 下拉刷新具体执行的逻辑处理；
      getPrevList () {
        postRequest(`task/myList`, {}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          // 请求成功的操作

          if (response.data.data.list) {
            this.tasks = response.data.data.list
          }
          // 没有数据的显示框不显示；
          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPulldownToRefresh() // refresh completed
          // 向父组件传递参数；
          this.$emit('countChange', response.data.data.total)
        })
      },
      // 下拉刷新的具体实现；
      getNextList () {
        postRequest(`task/myList`, {
          bottom_id: this.bottomId
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.list.length > 0) {
            this.tasks = this.tasks.concat(response.data.data.list)
          }

          this.loading = 0
          window.mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
        })
      },
      isFromDetail () {
        return false

//        var referer = localEvent.getLocalItem('referer');
//        if (/\/ask\/[0-9]+/.test(referer.path)) {
//          return true;
//        }
//        return false;
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
  .mui-wechat .menu[data-v-4f45c199] {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    top: 0;
  }

  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
  }

  .menu span {
    display: inline-block;
    width: 49%;
    height: 100%;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }

  .menu span:nth-of-type(1) {
    color: #3c95f9;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 30px;
    height: 1.8px;
    left: 20.55%;
    bottom: 0.5px;
    background: #3c95f9;
  }

  .bot {
    position: absolute;
    right: 16px;
    bottom: 0;
    left: 16px;
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

  .mui-wechat #pullrefresh {
    margin-top: 0px;
  }

  .mui-content {
    background: #FFFFFF;
  }

  /*主体部分样式*/

  ul li {
    position: relative;
    padding: 10px 16px 0px 16px;
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
    font-size: 42px;
  }

  ul li p {
    margin-left: 3%;
    width: 86%;
    float: left;
  }

  ul li p span {
    display: block;
    margin-bottom: 6px;
    width: 100%;
  }

  ul li p span:nth-of-type(1) {
    /*background: #CCCCCC;*/
    overflow: hidden;
  }

  ul li p span:nth-of-type(1) a {
    display: block;
    float: left;
    font-size: 16px;
    color: #444444;
  }

  ul li p span:nth-of-type(1) a:nth-of-type(1) {

    padding-right: 5px;
  }

  ul li p span:nth-of-type(1) a.level {
    font-size: 12px;
    padding: 4px 5px;
    color: #FFFFFF;
    margin-left: 8px;
  }

  ul li p span:nth-of-type(2) {
    font-size: 14px;
    color: #808080;
  }

  ul li p span:nth-of-type(3) {
    font-size: 12px;
    color: #b4b4b6;
  }

  ul li p span:nth-of-type(3) div {
    display: inline-block;
  }

  .message {
    width: 7px;
    height: 7px;
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
    font-size: 60px;
    margin-left: 23px;
    margin-bottom: 8px;
  }

  .container p {
    font-size: 12px;
    color: #c8c8c8;
  }

  .list-empty {
    top: 89px !important;
  }

  .list-empty .list-ask-item {
    padding: 10px 0;
  }

  .list-empty .list-ask-item:after{
    display: none;
  }

  .menu_message {
    position: absolute;
    left: 79%;
    top: 8px;
    background: #f03c69;
    font-size: 11px;
    text-align: center;
    color: #fff;
    padding: 0px 3px;
    min-width: 15px;
    min-height: 15px;
    border-radius: 15px;
    line-height: 15px;
  }
</style>
