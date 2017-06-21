<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left mui-action-back" >取消</a>
      <h1 class="mui-title">详细地址</h1>
      <a @tap.stop.prevent="submitInfo()"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label>详细地址</label>
            <input type="text"  v-model.trim="address_detail" placeholder="请填写">
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
      address_detail:'',
    }),
    created () {
      var userInfo = localEvent.getLocalItem('UserInfo');
      this.address_detail = userInfo.address_detail;
    },

    methods:{
      submitInfo: function () {
        if (!this.address_detail) {
          mui.toast('请填写详细地址');
          return false;
        }

        var data = {
            'address_detail':this.address_detail
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
