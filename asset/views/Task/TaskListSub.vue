<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">动态</h1>
    </header>

    <!--导航栏-->
    <div class="menu">
      <span @tap.stop.prevent="">任务</span>
      <span @tap.stop.prevent="$router.pushPlus('/inform')">消息</span>
      <i></i>
    </div>
    
    
  

    <div class="mui-content list-empty" v-if="nothing==1">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div>
            <div class="title">暂无任务</div>
            <div class="subTitle">稍安勿躁，是金子总会发光！<br/>平台正准备给您一展风采的机会呢！</div>
          </div>
        </div>
      </div>
    </div>

    <div id="pullrefresh"  :class="{'mui-content':true, 'mui-scroll-wrapper':true, 'task-list':true, 'emptyList':nothing}">
      <div class="mui-scroll">
        <div v-show="nothing == 0">
          <template v-for="(task, index) in tasks">
            <div class="mui-table-view mui-table-view-chevron" v-show="nothing == 0">
              <div class="mui-table-view-cell" @tap.stop.prevent="goDetail(task)">
                <div class="person">
                  <div class="avatar">
                    <div class="avatarInner">
                      <img :src="task.user_avatar_url" class="avatar"/>
                    </div>
                  </div>
                  <div class="mui-media-body mui-navigate-right">
                    <span class="username">{{ getType(task)}}</span>
                    <div>

                      <!--对时间状态的判断-->
                      <span class="time" v-if="startCountdown(task)">倒计时<count-down :start-time="currentTime"
                                                                                    :end-time="getEndTime(task)"
                                                                                    :dayTxt="':'" :hourTxt="':'"
                                                                                    :minutesTxt="':'"></count-down></span>

                      <span class="time" v-else-if="isTimeout(task)"><b>已超时</b><timeago :since="timeago(task.deadline)"
                                                                                        :auto-update="60"></timeago></span>

                      <span class="time" v-else><b v-show="isTimeout(task)">已超时</b><timeago
                        :since="timeago(task.created_at)" :auto-update="60"></timeago></span>
                      <!-- 判断task.priority的值，改变span的样式；-->
                      <span class="mui-badge mui-badge-danger"  v-if="task.priority =='高'">优先级 高</span>
                      <span class="mui-badge mui-badge-warning" v-if="task.priority =='中'">优先级 中</span>
                      <span class="mui-badge mui-badge-warning" v-if="task.priority =='低'">优先级 低</span>
                    </div>
                  </div>
                </div>
                <div class="site-desc mui-ellipsis-2">
                  {{ task.description }}

                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>




    <div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>
  </div>
</template>

<script>
  import {NOTICE, TASK_INFO, TASK_LIST, TASK_INFO_APPEND, TASK_LIST_APPEND} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import CountDown from 'vue2-countdown';
  import localEvent from '../../stores/localStorage';

  const Task = {
    data: () => ({
      tasks: [],
      loading: true,
      currentTime: (new Date()).getTime(),
    }),
    components: {
      CountDown
    },
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
        return this.tasks.length ? 0 : 1;
      },
      topId () {
        if (this.tasks.length) {
          return this.tasks[0].id;
        }
        return 0;
      },
      bottomId () {
        var length = this.tasks.length;
        if (length) {
          return this.tasks[length - 1].id;
        }
        return 0;
      },
      lastY (){
        if (this.isFromDetail()) {
          return this.$store.state.task.info.lastY;
        } else {
          return 0;
        }
      }
    },
    created(){
      //showInwehubWebview();
      if (this.isFromDetail()) {
        var list = this.$store.state.task.list;
      } else {
        var list = [];
      }

      if (list.length) {
        this.tasks = list;
        this.loading = false;
      }
    },
    activated: function () {

    },
    mounted(){
      var t = this;
      mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function (event) {
        var lastY = event.detail.lastY;
        t.$store.dispatch(TASK_INFO_APPEND, {lastY: lastY});
      });
      this.initPullRefresh();
    },
    updated(){
      this.$store.dispatch(TASK_LIST_APPEND, this.tasks);
    },
    methods: {
      initData(){
        //执行刷新
        console.log('refresh-taskList');
        this.initPullRefresh();
      },
      //判断是否超时；
      isTimeout(task){
        if (!task.deadline) {
          return false;
        }

        var endtime = this.getEndTime(task);
        var currentTime = (new Date()).getTime() / 1000;
        if (endtime < currentTime) {
          return true;
        }

        return false;
      },
      startCountdown(task){
        var endtime = this.getEndTime(task);
        var currentTime = (new Date()).getTime() / 1000;
        if (endtime < currentTime) {
          return false;
        }
        return true;
      },
      //对获取的时间做的处理;
      getEndTime(task){
        var deadline = task.deadline;
        if (deadline) {
          return Date.parse(deadline.replace(/-/g, "/")) / 1000;
        }
        return null;
      },
      //对后台的数据进行拼接；
      getType(task){
        return task.task_type_description + '任务-' + task.status_description;
      },
      //数据列表的刷新 加载的操作；
      initPullRefresh(){
        mui.init({
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
        });
        //刷新页面时自动加载； 默认10条数据；
        this.getPrevList();

      },
      //跳转时判断类型。1为提问  2是回答
      goDetail(task)
      {
        var id = task.object_id;
        if (task.task_type == 1) {
          this.$router.pushPlus('/answer/' + id)
        } else {
          this.$router.pushPlus('/ask/' + id)
        }
      },
      //下拉刷新时的延时操作；
      pulldownRefresh() {
        setTimeout(() => {
          this.getPrevList();
        },1000);
      },
      //下拉加载时的延时操作；
      pullupRefresh() {
        setTimeout(() => {
          this.getNextList();
        },1000);
      },
      //时间处理；
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      //下拉刷新具体执行的逻辑处理；
      getPrevList(){
        postRequest(`task/myList`, {}).then(response => {
          var code = response.data.code;
          //如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }
          //请求成功的操作
          if (response.data.data.list) {
            this.tasks = response.data.data.list;
          }
          //没有数据的显示框不显示；
          this.loading = 0;
          mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
          //向父组件传递参数；
          this.$emit('countChange', response.data.data.total);
        });
      },
      //下拉刷新的具体实现；
      getNextList() {
        postRequest(`task/myList`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.list.length > 0) {
            this.tasks = this.tasks.concat(response.data.data.list);
          }

          this.loading = 0;
          mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);

        });
      },
      isFromDetail(){
        return false;
        var referer = localEvent.getLocalItem('referer');
        if (/\/ask\/[0-9]+/.test(referer.path)) {
          return true;
        }
        return false;
      }
    },
    filters: {
      textLimit(text){
        var limit = 50;
        if (text.length > limit) {
          text = text.slice(0, limit) + '...';
        }
        return text;
      }
    }
  }
  export default Task;
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

  .menu{
    width: 100%;
    height: 45px;
    position: absolute;
    top: 44px;
    z-index: 10;
    background:#f3f4f6;
  }
  .menu span{
    display: inline-block;
    width: 49%;
    height: 100%;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }
  .menu span:nth-of-type(1){
    color: #3c95f9;
  }
  .menu i {
    display: block;
    position: absolute;
    width: 30px;
    height: 1.8px;
    left: 20.6%;
    bottom: 0.5px;
    background:#3c95f9;
  }

  /*滚动区域*/
  #pullrefresh {
  	position: absolute;
  	top: 45px;
    background: #ffffff;
  }



  .task-list {
    line-height: 33px;
    margin-bottom: 15px;
  }

  .task-list .mui-table-view-chevron .mui-table-view-cell {
    padding-right: 5px;
  }

  .task-list .mui-table-view-cell {
    margin-bottom: 10px;
  }

  .task-list .time {
    display: inline-block;
    width: 130px;
    color: #101010;
  }

  .task-list .time b {
    margin-right: 5px;
  }

  .task-list .time div {
    color: #ff9800;
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  .mui-badge {
    padding: 5px 10px;
    position: relative;
    bottom: 3px;
  }

  .task-list .link a {
    color: #8f8f94;
    font-size: 14px;
  }

  .task-list .type {
    font-weight: bold;
  }

  .mui-media-body {
    padding-left: 10px;
  }

  .task-list .username {
    color: #555555;
  }

  .mui-media-body {
    position: relative;
  }

  .mui-navigate-right:after {
    font-size: 24px;
    font-weight: bolder;
  }

  .avatar {
    z-index: 0;
    margin-top: 5px;
    color: #ffffff;
    float: left;
    display: inline-block;
    height: 50px;
    width: 50px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner {
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

  .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .site-desc {
    color: #666;
    margin-top: 10px;
    line-height: 23px;
    font-size: 12px;
    padding-right: 10px;
  }

  .time {
    font-size: 12px;
  }

  .time div {
    display: inline-block;
  }

  .task-list .mui-table-view-cell {
    margin-bottom: 0px;
  }

  .mui-table-view:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 0px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }

  .mui-table-view:after {
    position: absolute;
    right: 15px;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
</style>
