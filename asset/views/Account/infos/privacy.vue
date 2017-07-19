<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">隐私设置</h1>
      <!--<a class="mui-icon myicon myicon-share mui-pull-right"></a>-->
    </header>

    <div class="mui-content" v-show="!loading">
      <ul class="mui-table-view mui-table-view-chevron">
        <li class="mui-table-view-cell">
          工作经历

          <svg :class="{icon:true, active:jobSee}" aria-hidden="true" @tap.stop.prevent="toggle('job')">
            <use xlink:href="#icon-gongkai" v-if="jobSee"></use>
            <use xlink:href="#icon-bugongkai" v-else></use>
          </svg>

        </li>
        <li class="mui-table-view-cell">
          项目经历
          <svg :class="{icon:true, active:projectSee}" aria-hidden="true" @tap.stop.prevent="toggle('project')">
            <use xlink:href="#icon-gongkai" v-if="projectSee"></use>
            <use xlink:href="#icon-bugongkai" v-else></use>
          </svg>
        </li>
        <li class="mui-table-view-cell">
          教育经历
          <svg :class="{icon:true, active:eduSee}"  aria-hidden="true" @tap.stop.prevent="toggle('edu')">
            <use xlink:href="#icon-gongkai" v-if="eduSee"></use>
            <use xlink:href="#icon-bugongkai" v-else></use>
          </svg>
        </li>

      </ul>
    </div>
  </div>
</template>


<script>

  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND, USERS_APPEND} from '../../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../../utils/request';


  export  default {
    data(){
      return {
          jobSee:0,
          projectSee:0,
          eduSee:0,
          loading:true
      }
    },
    created () {
      postRequest(`profile/privacy/info`, {}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.toast(response.data.message);
        }

        this.jobSee = response.data.data.is_job_info_public;
        this.projectSee = response.data.data.is_project_info_public;
        this.eduSee = response.data.data.is_edu_info_public;
        this.loading = 0;
      });
    },
    methods:{
      submit(data) {
        postRequest(`profile/privacy/update`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
          }

          mui.toast(response.data.message);
        });
      },
      toggle(type){
          switch(type) {
            case 'job':
                this.jobSee = !this.jobSee;
//                if (!this.jobSee) {
//                    mui.toast('工作经历仅自己可见');
//                }
                var data = {
                  is_job_info_public:this.jobSee?1:0,
                };
                this.submit(data);

                break;
            case 'project':
              this.projectSee = !this.projectSee;

              var data = {
                is_project_info_public:this.projectSee?1:0,
              };
              this.submit(data);
//              if (!this.projectSee) {
//                mui.toast('项目经历仅自己可见');
//              }
                break;
            case 'edu':
              this.eduSee = !this.eduSee;
              var data = {
                is_edu_info_public:this.eduSee?1:0,
              };
              this.submit(data);
//              if (!this.eduSee) {
//                mui.toast('教育经历仅自己可见');
//              }
              break;
          }






      },

    }
  };

</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mui-content > .mui-table-view:first-child{
    margin-top:0;
  }

  .mui-table-view-cell{
    .icon{
      position: absolute;
      top:7px;
      right:15px;
      font-size:29px;

      &.active{
        color:#3c95f9;
      }
    }
  }
</style>
