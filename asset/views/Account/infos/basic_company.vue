<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left mui-action-back" >取消</a>
      <h1 class="mui-title">当前公司</h1>
      <a @tap.stop.prevent="submitInfo()"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">当前公司</label>
            <input type="text"  v-model.trim="company" placeholder="请填写">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>

  import localEvent from '../../../stores/localStorage';
  import {apiRequest} from '../../../utils/request';

  export default {
    data: () => ({
      company:'',
    }),
    created () {
      var userInfo = localEvent.getLocalItem('UserInfo');
      this.company = userInfo.company;
    },

    methods:{
      submitInfo: function () {
        if (!this.company) {
          mui.toast('请填写公司名称');
          return false;
        }

        var data = {
            'company':this.company
        };

        apiRequest(`profile/update`, data).then(res => {
          if (res !== false) {
            mui.toast('保存成功');
            this.$router.go(-1);
          }
        });
      }
    }
  }
</script>


<style scoped>
  .mui-content > .mui-table-view:first-child{
    margin-top:0;
  }

  .mui-table-view-cell {
    padding: 0;
  }

  .mui-table-view-cell .mui-navigate-right,
  .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  input{
    text-align: right;
  }
</style>
