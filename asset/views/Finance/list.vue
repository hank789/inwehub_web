<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"  @tap.stop.prevent="$router.replace('/my/finance')"></a>
      <h1 class="mui-title">交易记录</h1>
    </header>


    <div id="pullrefresh" class="mui-content mui-scroll-wrapper">
      <div class="mui-scroll">

        <div class="mui-content" v-if="!loading && list.length">
        <div class="list">
          <div class="item mui-table-view" v-for="(item, index) in list">
            <div class="mui-table-view-cell">
              <div class="first">
                <span class="title">{{ item.title }}</span>
                <span class="m add" v-if="item.change_money*item.io>0">+{{ item.change_money * item.io }}</span>
                <span class="m reduce" v-else>{{ item.change_money * item.io }}</span>
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
  </div>


  <div class="mui-content" v-show="!loading && !list.length">
    <div class="empty mui-table-view">
      <div class="mui-table-view-cell">暂无记录</div>
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
      list: [],
      totalMoney: localEvent.getLocalItem('wallet').totalMoney,
      loading: true
    }),
    computed: {
      topId () {
        if (this.list.length) {
          return this.list[0].id;
        }
        return 0;
      },
      bottomId () {
        var length = this.list.length;
        if (length) {
          return this.list[length-1].id;
        }
        return 0;
      }
    },
    mounted(){

      var that = this;
      mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多了',
            callback: pullupRefresh
          }
        }
      });

      function pulldownRefresh() {
        that.getPrevList();
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
      }

      function pullupRefresh() {
        that.getNextList();
      }


      if (mui.os.plus) {
        mui.plusReady(function () {

          if (!that.list.length) {
            mui('#pullrefresh').pullRefresh().pullupLoading();
          }
        });
      } else {
        mui.ready(function () {

          if (!that.list.length) {
            mui('#pullrefresh').pullRefresh().pullupLoading();
          }
        });
      }
    },
    created () {

    },
    methods: {
      getPrevList(){

        postRequest(`account/money_log`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          if (response.data.data.length > 0) {
            this.list = response.data.data;
          }
          this.loading = 0;
        });
      },
      getNextList() {
        postRequest(`account/money_log`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          if (response.data.data.length > 0) {
            this.list = this.list.concat(response.data.data);
          }
          this.loading = 0;

          if (response.data.data.length < 10) {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
          } else {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
          }
        });
      },
      getStates(item){
        switch (item.status) {
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
    watch: {}
  }
</script>


<style scoped>

  .list{
    margin-top:10px;
  }
  .item .first .title {
    color: #101010;
  }

  .item .first .m {
    color: #4A4A4A;
    font-weight: bold;
    float: right;
  }

  .item .first .m.add {
    color: #37A18E;
  }

  .item .second {
    margin-top:5px;
    font-size: 12px;
    color: #101010;
  }

  .item .second .time {
    float: right;
    color: #9B9B9B;
  }

  .type {
    color: #8c8c8c;
    height: 30px;
    padding-left: 10px;
    line-height: 30px;
  }

  .empty {
    background: #fff;
    text-align: center;
    margin-top: 10px !important;
  }

  .status {
    color: #9B9B9B;
  }
</style>
