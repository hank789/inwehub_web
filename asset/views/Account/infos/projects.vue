<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">项目经历</h1>
      <a @tap.stop.prevent="$router.push('/my/info/project/0')"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">添加</a>
    </header>

    <div class="mui-content" v-show="!loading">
      <ul class="mui-table-view mui-table-view-chevron" v-show="projects.length == 0">
        <li class="mui-table-view-cell no-empty">请维护项目经历</li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">
        <li v-for="project in projects" class="mui-table-view-cell">
          <a @tap.stop.prevent="$router.push('/my/info/project/'+project.id)" class="mui-navigate-right">
            {{ project.project_name }}
                  <p class='mui-ellipsis'>{{ project.begin_time }} ~ {{ project.end_time }} | {{ project.title }}</p>
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
      projects:[],
      loading: true
    }),
    methods: {

    },
    mounted () {

    },

    computed:{

    },

    created () {
      postRequest(`account/project/list`, {}).then(response => {

        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          return;
        }

        this.projects = response.data.data;
        this.loading = false;

        var newProjects = [];
        for(var i in this.projects) {
          var info = this.projects[i];
          var id = info.id;
          newProjects[id] = info;
        }
        localEvent.setLocalItem('projects', newProjects);
      });

    }
  }
</script>

<style scoped>

</style>
