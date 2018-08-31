<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left mui-action-back"
         @tap.stop.prevent="$router.goBack()">取消</a>
      <h1 class="mui-title">真实姓名</h1>
      <a @tap.stop.prevent="submitInfo()"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">真实姓名</label>
            <input type="text" placeholder="请填写" v-model.trim="realname" maxlength="15">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>

  import localEvent from '../../../stores/localStorage'
  import { postRequest } from '../../../utils/request'

  export default {
    data: () => ({
      realname: ''
    }),
    created () {
      var userInfo = localEvent.getLocalItem('UserInfo')
      this.realname = userInfo.realname
    },
    mounted () {

    },
    methods: {
      submitInfo: function () {
        if (!this.realname) {
          window.mui.toast('请填写真实姓名')
          return false
        }

        var data = {
          'realname': this.realname
        }

        postRequest(`profile/update`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          window.mui.toast('保存成功')
          window.mui.muiOldBack()
        })
      }
    }
  }
</script>


<style scoped>
  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }

  .mui-table-view-cell {
    padding: 0;
  }

  .mui-table-view-cell .mui-navigate-right,
  .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  input {
    text-align: right;
  }
</style>
