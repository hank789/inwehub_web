<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">专家管理</h1>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view mui-table-view-chevron">
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right"  @tap.stop.prevent="expert_apply">申请成为专家<span class="mui-pull-right expert-setting-field" v-text="user_status_desc"></span></a>
        </li>
        <li class="mui-table-view-cell">
          <router-link to="/expert/recommend" class="mui-navigate-right">推荐专家<span class="mui-pull-right expert-setting-field">前往推荐专家加入</span></router-link>
        </li>
      </ul>
    </div>

  </div>
</template>
<script>
  import {createAPI, apiRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export  default {
    data: () => ({
      user_status: 0,
      user_status_desc: ''
    }),
    created () {
      apiRequest(`expert/info`,{}).then(response_data => {
        if (response_data !== false){
          this.user_status = response_data.status;
          this.user_status_desc = response_data.tips;
        } else {
          this.$router.go(-1);
        }
      });
    },
    computed: {

    },
    methods: {
      expert_apply() {
          if (this.user_status===0){
            var btnArray = ['确定', '取消'];
            mui.confirm('点击确定我们将审核您的专家身份，客服人员可能会与您取得联系，请注意', '注意', btnArray, e => {
              //确定
              if (e.index == 0) {
                apiRequest(`expert/apply`,{}).then(response_data => {
                  if (response_data !== false){
                    mui.toast('申请成功');
                    this.user_status = response_data.status;
                    this.user_status_desc = response_data.tips;
                  }
                });
              }
            });
          }
      }
    },
    mounted(){
      mui('.mui-switch')['switch']();
    }
  }

</script>

<style scoped>

  .mui-table-view {
    margin-top: 15px;
  }

  .myinfo li{
    color:#101010;
    padding-top:13px;
    padding-bottom:13px;
  }

  .myinfo > .mui-table-view:first-child{
    margin-top:0;
  }

  .my-header p{
    margin-top:5px;
    color:#fff;
    font-size:16px;
    font-weight:bold;
  }

  .expert-setting-field {
    position: absolute;
    text-align: right;
    font-size: 12px;
    width: 200px;
    right: 40px;
    color: #3f51b5;
  }



</style>
