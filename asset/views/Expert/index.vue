<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">专家管理</h1>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view mui-table-view-chevron">
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right" @tap.stop.prevent="expert_apply">申请成为专家<span
            class="mui-pull-right expert-setting-field" v-text="user_status_desc"></span></a>
        </li>
        <li class="mui-table-view-cell">
          <router-link to="/expert/recommend" class="mui-navigate-right">推荐专家<span
            class="mui-pull-right expert-setting-field">前往推荐专家加入</span></router-link>
        </li>
      </ul>
    </div>

  </div>
</template>
<script>
  import { apiRequest } from '../../utils/request'

  export default {
    data: () => ({
      user_status: 0,
      user_status_desc: ''
    }),
    created () {
      apiRequest(`expert/info`, {}).then(responseData => {
        if (responseData !== false) {
          this.user_status = responseData.status
          this.user_status_desc = responseData.tips
        } else {
          window.mui.back()
        }
      })
    },
    computed: {},
    methods: {
      expert_apply () {
        if (this.user_status === 0) {
          var btnArray = ['确定', '取消']
          window.mui.confirm('点击确定我们将审核您的专家身份，客服人员可能会与您取得联系，请注意', '注意', btnArray, e => {
            // 确定
            if (e.index === 0) {
              apiRequest(`expert/apply`, {}).then(responseData => {
                if (responseData !== false) {
                  window.mui.toast('申请成功')
                  this.user_status = responseData.status
                  this.user_status_desc = responseData.tips
                }
              })
            }
          })
        }
      }
    },
    mounted () {
      window.mui('.mui-switch')['switch']()
    }
  }

</script>

<style scoped>

  .mui-table-view {
    margin-top: 0.4rem;
  }

  .myinfo li {
    color: #101010;
    padding-top: 0.346rem;
    padding-bottom: 0.346rem;
  }

  .myinfo > .mui-table-view:first-child {
    margin-top: 0;
  }

  .my-header p {
    margin-top: 0.133rem;
    color: #fff;
    font-size: 0.426rem;
    font-weight: bold;
  }

  .expert-setting-field {
    position: absolute;
    text-align: right;
    font-size: 0.32rem;
    width: 5.333rem;
    right: 1.066rem;
    color: #3f51b5;
  }


</style>
