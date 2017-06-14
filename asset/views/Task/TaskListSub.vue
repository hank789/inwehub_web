<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">任务</h1>
    </header>

    <div id="pullrefresh" class="mui-content mui-scroll-wrapper task-list">
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


                      <span class="time" v-if="startCountdown(task)">倒计时<count-down :start-time="currentTime"
                                                                                    :end-time="getEndTime(task)"
                                                                                    :dayTxt="':'" :hourTxt="':'"
                                                                                    :minutesTxt="':'"></count-down></span>

                      <span class="time" v-else-if="isTimeout(task)"><b>已超时</b><timeago :since="timeago(task.deadline)"
                                                                                        :auto-update="60"></timeago></span>

                      <span class="time" v-else><b v-show="isTimeout(task)">已超时</b><timeago
                        :since="timeago(task.created_at)" :auto-update="60"></timeago></span>

                      <span class="mui-badge mui-badge-danger" v-if="task.priority =='高'">优先级 高</span>
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


    <div class="mui-content list-empty" v-if="nothing==1">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无任务</div>
            <div class="subTitle">稍安勿躁，是金子总会发光！<br/>平台正准备给您一展风采的机会呢！</div>
          </div>
        </div>
      </div>
    </div>


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
      getEndTime(task){
        var deadline = task.deadline;
        if (deadline) {
          return Date.parse(deadline.replace(/-/g, "/")) / 1000;
        }
        return null;
      },
      getType(task){
        return task.task_type_description + '任务-' + task.status_description;
      },
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

        var t = this;

        if (mui.os.plus) {
          mui.plusReady(function () {
            if (!t.tasks.length) {
              mui('#pullrefresh').pullRefresh().pullupLoading();
            }
            mui('#pullrefresh').pullRefresh().scrollTo(0, t.lastY, 0)
          });
        } else {
          mui.ready(function () {
            if (!t.tasks.length) {
              mui('#pullrefresh').pullRefresh().pullupLoading();
            }
            mui('#pullrefresh').pullRefresh().scrollTo(0, t.lastY, 0)
          });
        }
      },
      goDetail(task)
      {
        var id = task.object_id;
        if (task.task_type == 1) {
          this.$router.push('/answer/' + id)
        } else {
          this.$router.push('/ask/' + id)
        }
      },
      pulldownRefresh() {
        this.getPrevList();
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
      },

      pullupRefresh() {
        this.getNextList();

      },
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      getPrevList(){
        postRequest(`task/myList`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          if (response.data.data.length > 0) {
            this.tasks = response.data.data;
          }
          this.loading = 0;
        });
      },
      getNextList() {
        postRequest(`task/myList`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          if (response.data.data.length > 0) {
            this.tasks = this.tasks.concat(response.data.data);
          }

          this.loading = 0;

          if (response.data.data.length < 10) {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
          } else {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
          }
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
  #pullrefresh {
    margin-top: 10px;
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


</style>
