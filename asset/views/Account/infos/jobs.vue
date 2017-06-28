<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">工作经历</h1>
      <a @tap.stop.prevent="$router.pushPlus('/my/info/job/0')"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">添加</a>
    </header>

    <div class="mui-content" v-show="!loading">
      <ul class="mui-table-view mui-table-view-chevron" v-show="jobs.length == 0">
        <li class="mui-table-view-cell no-empty">请维护工作经历</li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">
        <li v-for="job in jobs" class="mui-table-view-cell">
          <a  @tap.stop.prevent="$router.pushPlus('/my/info/job/' + job.id)" class="mui-navigate-right">
            {{ job.company }}
                  <p class='mui-ellipsis'>{{ job.title }} | {{ job.begin_time }} ~ {{ job.end_time }}</p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {NOTICE} from '../../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../../utils/request';
  import localEvent from '../../../stores/localStorage';
  import ACCOUNT_API from '../../../api/account';
  import dPickerComponent from '../../../components/picker/date-picker.vue';
  import popPickerComponent from '../../../components/picker/poppicker.vue';

  export default {
    data: () => ({
      jobs:[],
      loading: true
    }),
    methods: {
      initData() {
        postRequest(`account/job/list`, {}).then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          this.jobs = response.data.data;

          var newJobs = [];
          for(var i in this.jobs) {
            var info = this.jobs[i];
            var id = info.id;
            newJobs[id] = info;
          }
          localEvent.setLocalItem('jobs', newJobs);

          this.loading = false;
        });
      }
    },
    mounted () {
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-jobs');
        this.initData();
      });
    },

    computed:{

    },
    created () {
      showInwehubWebview();
      this.initData();
    }
  }
</script>

<style scoped>

</style>
