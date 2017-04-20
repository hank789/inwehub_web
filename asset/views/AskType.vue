<template>
  <div class="page page-white">
    <div class="page-container">

      <header class="mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">选择问题分类</h1>
      </header>

      <div class="mui-content mui-row mui-fullscreen">
        <div class="mui-col-xs-3">
          <div id="segmentedControls" class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-vertical">
            <a class="mui-control-item mui-active" href="#item1">系统功能</a>
            <a class="mui-control-item" href="#item2">日常操作</a>
          </div>
        </div>
        <div id="segmentedControlContents" class="mui-col-xs-9" style="border-left: 1px solid #c8c7cc;">
          <div id="item1" class="mui-control-content mui-active">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">SD</li>
              <li class="mui-table-view-cell">PP</li>
            </ul>
          </div>
          <div id="item2" class="mui-control-content">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">FI</li>
              <li class="mui-table-view-cell">CO</li>
            </ul>
          </div>
          <div id="item3" class="mui-control-content">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { createAPI, addAccessToken } from '../utils/request';

  const Ask = {
    data: () => ({
      types: [],
      subTypes:[]
    }),
    methods: {
      selectType () {
        this.$router.push('ask/type');
      },
    },
    created () {
      addAccessToken().get(createAPI(`question/request`),{},
        {
          validateStatus: status => status === 200
        }
      )
        .then(response => {
          this.types = response.data.data;
        })
        .catch(({ response: { message = '网络状况堪忧' } = {} } ) => {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: data.message,
              time: 2000,
              status: false
            });
          });
        })
    }
  }
  export default Ask;
</script>


<style scoped>
  .mui-row.mui-fullscreen>[class*="mui-col-"] {
    height: 100%;
  }
  .mui-col-xs-3,
  .mui-control-content {
    overflow-y: auto;
    height: 100%;
  }
  .mui-segmented-control .mui-control-item {
    line-height: 50px;
    width: 100%;
  }
  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    background-color: #fff;
  }

</style>
