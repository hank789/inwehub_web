<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left mui-action-back"
         @tap.stop.prevent="$router.goBack()">取消</a>
      <h1 class="mui-title">个人签名</h1>
      <a @tap.stop.prevent="submitInfo()"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
    </header>

    <div class="mui-content">


      <div class="descriptionWrapper">
        <MTextarea v-model.trim="description" :content="description" :rows="5" :descMaxLength="1000"
                   :placeholder="'请填写个人签名'"></MTextarea>
      </div>
    </div>
  </div>
</template>


<script>

  import localEvent from '../../../stores/localStorage'
  import { apiRequest } from '../../../utils/request'
  import MTextarea from '../../../components/MTextarea.vue'

  export default {
    data: () => ({
      description: ''
    }),
    created () {
      var userInfo = localEvent.getLocalItem('UserInfo')
      this.description = userInfo.description
    },
    components: {
      MTextarea
    },
    mounted () {

    },
    methods: {
      submitInfo: function () {
        if (!this.description) {
          window.mui.toast('请填写个人签名')
          return false
        }

        var data = {
          'description': this.description
        }

        apiRequest(`profile/update`, data).then(res => {
          if (res !== false) {
            window.mui.toast('保存成功')
            window.mui.muiOldBack()
          }
        })
      }
    }
  }
</script>


<style scoped>
  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }

  .mui-table-view-cell .mui-navigate-right,
  .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  input {
    text-align: right;
  }

  .descriptionWrapper {
    margin-top: 0.133rem;
  }
</style>
