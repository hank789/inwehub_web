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
          <div class="money">{{ totalMoney }}</div>
          <div class="unit">余额 （元）</div>
        </div>
      </div>
      <div class="type">交易记录</div>
      <div class="list">
        <div class="item mui-table-view" v-for="(item, index) in list">
          <div class="mui-table-view-cell">
            <div class="first">
              <span class="title">{{ item.title }}</span>
              <span class="m">{{ item.change_money*item.io }}元</span>
            </div>
            <div class="second">
              <span class="status">{{ getStates(item) }}</span>
              <span class="time">{{ item.created_at }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import oauth from '../../components/oauth/oauth.vue';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export default {
    data: () => ({
      list:[],
      totalMoney:localEvent.getLocalItem('wallet').totalMoney,
      loading: true,
      loading_gif: loading_gif,
    }),
    computed: {

    },

    created () {
      postRequest(`account/money_log`, {}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          this.$router.go(-1);
        }

        this.list = response.data.data;
        this.loading = false;
      });
    },
    methods: {
      getStates(item){
          switch(item.status) {
            case 0:
                return '处理中';
                break;
            case 1:
                return '处理成功';
                break;
            case 2:
                return '处理失败';
                break;
          }
          return '未知';
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
