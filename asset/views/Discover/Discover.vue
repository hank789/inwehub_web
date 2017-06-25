<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <h1 class="mui-title">发现</h1>
    </header>


    <div class="mui-content">

      <ul class="mui-table-view mui-table-view-chevron">
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/discover/project')"><span class="mui-icon myicon myicon-project"></span>项目协作</a>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/discover/company')"><span class="mui-icon myicon myicon-fangdajing"></span>附近企业</a>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/discover/activity')"><span class="mui-icon  myicon myicon-jiubei"></span>最新活动</a>
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
    },
    mounted(){
      showInwehubWebview();
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-discover');
      });
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
