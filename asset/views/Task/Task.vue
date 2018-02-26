<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">任务</h1>
    </header>

    <div class="mui-content"></div>
  </div>
</template>

<script>

  const TaskMain = {
    mounted () {
      // 启用双击监听
      window.mui.init({
        gestureConfig: {
          doubletap: true
        },
        subpages: [{
          url: '#/task/list',
          id: '#/task/list',
          styles: {
            top: '4.5rem',
            bottom: '0rem'
          }
        }]
      })

      var contentWebview = null
      document.querySelector('header').addEventListener('doubletap', function () {
        if (contentWebview == null) {
          contentWebview = window.plus.webview.currentWebview().children()[0]
        }
        contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)")
      })
    }
  }
  export default TaskMain
</script>

<style scoped>
  .task-list {
    line-height: 3.3rem;
    margin-top: 1.5rem;
  }

  .task-list .mui-table-view-chevron .mui-table-view-cell {
    padding-right: 0.5rem;
  }

  .task-list .time {
    float: right;
    color: #999;
  }

  .task-list .link a {
    color: #8f8f94;
    font-size: 1.4rem;
  }

  .task-list .type {
    font-weight: bold;
  }
</style>
