<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">账单明细</h1>
    </header>


    <div class="mui-content">
      <div class="myMoney mui-table-view">
        <div class="mui-table-view-cell">
          <span class="mui-icon fa fa-diamond"></span>
          <div class="money">188.00</div>
          <div class="unit">余额 （元）</div>
        </div>
      </div>
      <div class="type">交易记录</div>
      <div class="list">
        <div class="item mui-table-view">
          <div class="mui-table-view-cell">
            <div class="first">
              <span class="title">交易记录</span>
              <span class="m">-3.80元</span>
            </div>
            <div class="second">
              <span class="status">处理中</span>
              <span class="time">2017-01-01 00:00:21</span>
            </div>
          </div>
        </div>

        <div class="item mui-table-view">
          <div class="mui-table-view-cell">
            <div class="first">
              <span class="title">交易记录</span>
              <span class="m">-3.80元</span>
            </div>
            <div class="second">
              <span class="status">处理中</span>
              <span class="time">2017-01-01 00:00:21</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {apiRequest} from '../../utils/request';
  import oauth from '../../components/oauth/oauth.vue';

  export default {
    data: () => ({

    }),
    computed: {

    },
    components: {
      oauth
    },
    methods: {
      check_withdraw() {

      }
    },
    watch: {

    }
  }
</script>


<style scoped>
  .mui-content > .mui-table-view:first-child{
    margin-top:0;
  }
  .myMoney{

    padding-bottom:40px;
    position: relative;
    text-align: center;
    background: #fff;
  }
  .fa{
    position: relative;
    font-size:58px;
    left: -110px;
    top: 46px;
    color:#ff9800;
  }

  .money{
    font-size:38px;
    color:#101010;
  }
  .unit{
    margin-top:20px;
    color:#101010;
    font-size:16px;
  }
  .item .first .title{
        color:#101010;
  }
  .item .first .m{
    color:#ff9800;
    font-weight:bold;
    float:right;
  }
  .item .second{
    font-size:12px;
    color:#101010;
  }
  .item .second .time{
    float:right;
  }
  .type{
    color:#8c8c8c;
    height:30px;
    padding-left:10px;
    line-height:30px;
  }
  .list{
    background: #fff;
  }
</style>
