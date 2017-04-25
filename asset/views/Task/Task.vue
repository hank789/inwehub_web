<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">任务</h1>
    </header>

    <div id="pullrefresh" class="mui-content mui-scroll-wrapper task-list">
      <div class="mui-scroll">
        <ul class="mui-table-view mui-table-view-chevron" v-show="nothing == 0">
          <template v-for="(task, index) in tasks">
            <li class="mui-table-view-cell" @tap.stop.prevent="$router.push('/answer/' + task.object_id)"
                 v-if="task.task_type == 1">
              <div class="title">
                <span class="msg">您有新的任务</span>
                <span class="type">{{ task.task_type_description }}</span>
                <span class="time"><timeago :since="timeago(task.created_at)"></timeago></span>
              </div>
              <div class="subTitle">
                <span class="questions">{{ task.description }}</span>
                <span class="time"></span>
              </div>
              <div class="link">
                <a>{{ task.status_description }}<span class="mui-icon mui-icon-arrowright"></span> </a>
              </div>
            </li>

            <li class="mui-table-view-cell" @tap.stop.prevent="$router.push('/answer/' + task.object_id)"
                 v-else-if="task.task_type == 2">
              <div class="title">
                <span class="msg">您有新的任务</span>
                <span class="type">{{ task.task_type_description }}</span>
                <span class="time"><timeago :since="timeago(task.created_at)"></timeago></span>
              </div>
              <div class="subTitle">
                <span class="questions">{{ task.description }}</span>
                <span class="time"></span>
              </div>
              <div class="link">
                <a>{{ task.status_description }}<span class="mui-icon mui-icon-arrowright"></span> </a>
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
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';

  const Task = {
    data: () => ({
      topId: 0,
      bottomId: 0,
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
      }
    },
    mounted(){
        this.initPullRefresh();
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

        if (mui.os.plus) {
          mui.plusReady(function () {
            setTimeout(function () {
              mui('#pullrefresh').pullRefresh().pullupLoading();
            }, 10);

          });
        } else {
          mui.ready(function () {
            mui('#pullrefresh').pullRefresh().pullupLoading();
          });
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
        addAccessToken().post(createAPI(`task/myList`), {top_id: this.topId},
          {
            validateStatus: status => status === 200
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              this.$router.go(-1);
            }

            if (response.data.data.length > 0) {
              this.tasks = response.data.data.concat(this.tasks);
              var firstItem = response.data.data.shift();
              this.topId = firstItem.id;
            }
            this.loading = 0;
          })
          .catch(({response: {message = '网络状况堪忧'} = {}}) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          })
      },
      getNextList() {
        addAccessToken().post(createAPI(`task/myList`), {bottom_id: this.bottomId},
          {
            validateStatus: status => status === 200
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              this.$router.go(-1);
            }

            if (response.data.data.length > 0) {
              this.tasks = this.tasks.concat(response.data.data);
              var lastItem = response.data.data.pop();
              this.bottomId = lastItem.id;

              if (!this.topId) {
                if (response.data.data.length > 0) {
                  var firstItem = response.data.data.shift();
                  this.topId = firstItem.id;
                } else {
                  this.topId = this.bottomId;
                }
              }
            }
            this.loading = 0;
          })
          .catch(({response: {message = '网络状况堪忧'} = {}}) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          })
      }
    }
  }
  export default Task;
</script>


<style scoped>
  .task-list{
    line-height: 33px;
    margin-top:15px;
  }
  .task-list .mui-table-view-chevron .mui-table-view-cell{
    padding-right:5px;
  }
  .task-list .time{
    float: right;
    color:#999;
  }
  .task-list .link a{
    color: #8f8f94;
    font-size: 14px;
  }
  .task-list .type{
    font-weight:bold;
  }
</style>
