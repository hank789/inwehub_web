<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <h1 class="mui-title">发现</h1>
    </header>


    <div class="mui-content">

      <ul class="mui-table-view mui-table-view-chevron">
        <li class="mui-table-view-cell">
          <router-link to="/my/info" class="mui-navigate-right"><span class="mui-icon myicon myicon-xiangzi"></span>顾问圈</router-link>
        </li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">
        <li class="mui-table-view-cell">
          <router-link to="/asks" class="mui-navigate-right"><span class="mui-icon myicon myicon-project"></span>项目协作</router-link>
        </li>
        <li class="mui-table-view-cell">
          <router-link to="/answers" class="mui-navigate-right"><span class="mui-icon myicon myicon-fangdajing"></span>附近企业</router-link>
        </li>
        <li class="mui-table-view-cell">
          <router-link to="/answers" class="mui-navigate-right"><span class="mui-icon  myicon myicon-money"></span>新的机会</router-link>
        </li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">
        <li class="mui-table-view-cell">
          <router-link to="/setting" class="mui-navigate-right">
            <span class="mui-icon myicon myicon-xiaoha"></span>智能小哈</router-link>
        </li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron mb70">
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right">
            <span class="mui-icon myicon myicon-shop"></span>商城</a>
        </li>
      </ul>


    </div>
  </div>
</template>

<script>
  import localEvent from '../../stores/localStorage';
  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        account_info_complete_percent: currentUser.account_info_complete_percent
      }
    }
  };
</script>


<style scoped>

  .mui-table-view{
    margin-top:15px;
  }

  .mui-table-view-cell{
    color: #101010;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .mui-table-view-cell .mui-icon{
    margin-right:10px;
    width: 24px;
    vertical-align: text-top;
    height: 24px;
    position: relative;
  }
</style>
