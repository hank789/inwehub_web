<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left mui-action-back" @tap.stop.prevent="$router.goBack()">取消</a>
      <h1 class="mui-title">电子邮箱</h1>
      <a @tap.stop.prevent="submitInfo()"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">电子邮箱</label>
            <input type="text"  v-model.trim="email" placeholder="请填写">
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
      email:'',
    }),
    created () {
      var userInfo = localEvent.getLocalItem('UserInfo');
      this.email = userInfo.email;
    },

    methods:{
      submitInfo: function () {
        if (!this.email) {
          mui.toast('请填写电子邮箱');
          return false;
        }

        var data = {
            'email':this.email
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
