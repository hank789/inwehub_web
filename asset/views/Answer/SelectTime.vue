<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">确认应答</h1>
    </header>

    <div class="mui-content wait-answer">
      <div class="mui-table-view">
        <div class="mui-table-view-cell">
          <div class="form form-ask-refuse">
            <div class="title">请选择承诺应答反馈周期，我将在以下时间内回答提问者的相应问题，我们会在任务中提醒：</div>
            <button type="button" data-id="picker" id="timeSelector" data-options='{"type":"time"}' class="mui-btn mui-btn-block mui-btn-primary">选择时间 ...</button>

            <br/>
            <div class="title">您也可以选择立即回答：</div>
            <button type="button" class="mui-btn mui-btn-block mui-btn-primary"  @tap.stop.prevent="$router.push('/realAnswer/' + id)">立即回答</button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';

  const SelectTime = {
    data: () => ({
      id:null
    }),
    mounted(){

    },
    created () {
      let id = parseInt(this.$route.params.id);

      if (!id) {
        this.$store.dispatch(NOTICE, cb => {
          cb({
            text: '发生一些错误',
            time: 1500,
            status: false
          });
        });
        this.$router.back();
        return;
      }
      this.id = id;
    }
  }
  export default SelectTime;
</script>


<style scoped>

  .wait-answer .title{
    margin-bottom: 15px;
  }
</style>
