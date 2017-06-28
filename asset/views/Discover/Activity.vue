<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">最新活动</h1>
    </header>


    <div class="mui-content list-empty">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无活动</div>
            <div class="subTitle">我们会按照用户级别分批推送最新活动，<br/>
等级较高的用户可优先获取最新的信息！<br/><br/>请积极提升个人的平台成长值和贡献值！</div>
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
