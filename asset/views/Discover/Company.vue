<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">附近企业</h1>
    </header>


    <div class="mui-content list-empty">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无企业</div>
            <div class="subTitle">随着您的平台用户等级的逐步提升，<br/>
附近企业的可见距离将会逐渐扩大！<br/><br/>请积极提升个人的平台成长值和贡献值！</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  export  default {
    created () {
      showInwehubWebview();
    }
  };
</script>
