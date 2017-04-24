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

    <div class="mui-content task-list" v-if="nothing == 0">

      <div class="mui-table-view" v-for="(task, index) in tasks">

        <div class="mui-table-view-cell" v-if="task.task_type == 1" @tap.stop.prevent="$router.push('/answer/' + task.object_id)">
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
            <a >{{ task.status_description }}<span class="mui-icon mui-icon-arrowright"></span> </a>
          </div>
        </div>

        <div class="mui-table-view-cell" v-else-if="task.task_type == 2" @tap.stop.prevent="$router.push('/answer/' + task.object_id)">
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
            <a >{{ task.status_description }}<span class="mui-icon mui-icon-arrowright"></span> </a>
          </div>
        </div>

      </div>
    </div>

    <div class="mui-content" v-if="nothing==1">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="list-empty">
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
      tasks: [],
      loading:true,
      loading_gif:loading_gif
    }),
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
        return this.tasks.length ? 0 : 1;
      }
    },
    methods: {
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
    },
    created () {

      addAccessToken().post(createAPI(`task/myList`), {},
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

          this.tasks = response.data.data;
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
  export default Task;
</script>


<style scoped>
  .task-list {
    line-height: 33px;
  }

  .task-list .time {
    float: right;
    color: #999;
  }

  .task-list .link a {
    color: #8f8f94;
    font-size: 14px;
  }

  .task-list .type {
    font-weight: bold;
  }
</style>
