<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">任务</h1>
    </header>

    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>

    <div id="pullrefresh" class="mui-content mui-scroll-wrapper task-list">
      <div class="mui-scroll">
        <ul class="mui-table-view mui-table-view-chevron" v-show="nothing == 0">
          <template v-for="(task, index) in tasks">

            <li class="mui-table-view-cell" @tap.stop.prevent="goDetail(task)">
              <div class="person">
                <div class="avatar">
                  <div class="avatarInner">
                    <img :src="task.user_avatar_url" class="avatar"/>
                  </div>
                </div>
                <div class="mui-media-body mui-navigate-right">
                  <span class="username">{{ task.task_type_description}}</span>
                  <div>
                    <span class="time"><timeago :since="timeago(task.created_at)"></timeago></span>
                    <span class="mui-badge mui-badge-danger">优先级 高</span>
                  </div>
                </div>
              </div>
              <div class="site-desc mui-ellipsis-2">
                {{ task.description | textLimit}}
              </div>
            </li>

          </template>
        </ul>
      </div>
    </div>


    <div class="mui-content list-empty" v-if="nothing==1">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无任务</div>
            <div class="subTitle">稍安勿躁，是金子总会发光！平台正准备给您一展风采的机会呢！</div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import {NOTICE, TASK_INFO, TASK_LIST, TASK_INFO_APPEND, TASK_LIST_APPEND} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';

  const Task = {
    data: () => ({
      tasks: [],
      loading: true,
      loading_gif: loading_gif
    }),
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
          return this.tasks[length-1].id;
        }
        return 0;
      },
      lastY (){
        return this.$store.state.task.info.lastY;
      }
    },
    created(){
      var list = []; //this.$store.state.task.list;
      if (list.length) {
          this.tasks = list;
          this.loading = false;
      }
    },
    mounted(){
        var t = this;
        mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function(event){
            var lastY = event.detail.lastY;
            t.$store.dispatch(TASK_INFO_APPEND, {lastY:lastY});
        });
        this.initPullRefresh();
    },
    updated(){
      this.$store.dispatch(TASK_LIST_APPEND, this.tasks);
    },
    methods: {
      initPullRefresh(){
        mui.init({
          pullRefresh: {
            container: '#pullrefresh',
            down: {
              callback: this.pulldownRefresh
            },
            up: {
              contentrefresh: '正在加载...',
              contentnomore:'',
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
              mui('#pullrefresh').pullRefresh().scrollTo(0,t.lastY,0)
            });
        } else {
            mui.ready(function () {
              if (!t.tasks.length) {
                mui('#pullrefresh').pullRefresh().pullupLoading();
              }
              mui('#pullrefresh').pullRefresh().scrollTo(0,t.lastY,0)
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
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
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
        });
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
  .task-list{
    line-height: 33px;
    margin-bottom:15px;
  }
  .task-list .mui-table-view-chevron .mui-table-view-cell{
    padding-right:5px;
  }
  .task-list .time{
    display: inline-block;
    width:130px;
    color:#101010;
  }
  .mui-badge{
    padding:5px 10px;
    position: relative;
    bottom: 3px;
  }
  .task-list .link a{
    color: #8f8f94;
    font-size: 14px;
  }
  .task-list .type{
    font-weight:bold;
  }

  .mui-media-body{
    padding-left:10px;
  }
  .task-list .username{
    color:#555555;
  }


  .mui-media-body{
    position:relative;
  }

  .mui-navigate-right:after{
    font-size:24px;
    font-weight:bolder;
  }

  .avatar{
    z-index: 0;
    margin-top: 5px;
    color: #ffffff;
    float:left;
    display: inline-block;
    height: 55px;
    width: 55px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner{
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
  .site-desc{
    color:#666;
    margin-top:10px;
    line-height: 23px;
  }
</style>
