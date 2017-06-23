<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="mui.back()"></a>
      <h1 class="mui-title">消息</h1>
    </header>

    <div id="pullrefresh" class="mui-content mui-scroll-wrapper message-list">
      <div class="mui-scroll">
        <ul class="mui-table-view mui-table-view-chevron" v-show="nothing == 0">
          <template v-for="(message, index) in messages">
            <li class="mui-table-view-cell">
              <div class="mui-slider-right mui-disabled">
                <a class="mui-btn mui-btn-red" @tap.stop.prevent="deleteItem(message.id)">删除</a>
              </div>
              <div class="mui-slider-handle">
                {{ message.description }}
            </div>
            </li>
          </template>
         </ul>
        </div>
      </div>
  </div>
</template>

<script>
  import {createAPI, addAccessToken, postRequest} from '../utils/request';
  export default {
    data: () => ({
      messages:[],
      loading: true
    }),
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
        return this.messages.length ? 0 : 1;
      },
      topId () {
        if (this.messages.length) {
          return this.messages[0].id;
        }
        return 0;
      },
      bottomId () {
        var length = this.messages.length;
        if (length) {
          return this.messages[length-1].id;
        }
        return 0;
      }
    },
    mounted(){
      this.initPullRefresh();
    },
    methods: {
      deleteItem(id){
          mui.alert('删除暂不支持!');
      },
      initPullRefresh(){
        mui.init({
          pullRefresh: {
            container: '#pullrefresh',
            down: {
              callback: this.pulldownRefresh
            },
            up: {
              contentrefresh: '正在加载...',
              contentnomore:'',
              callback: this.pullupRefresh
            }
          }
        });

        var t = this;

        if (mui.os.plus) {
          mui.plusReady(function () {
            if (!t.messages.length) {
              mui('#pullrefresh').pullRefresh().pullupLoading();
            }
          });
        } else {
          mui.ready(function () {
            if (!t.messages.length) {
              mui('#pullrefresh').pullRefresh().pullupLoading();
            }
          });
        }
      },
      pulldownRefresh() {
        this.getPrevList();
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
      },

      pullupRefresh() {
        this.getNextList();
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
      },
      getPrevList(){

        this.messages = [
          {
            "id": "1",//通知id
            "notification_type": "1",//通知类型,1为提问
            "description": "这是一条测试数据1",//通知内容
            "is_read": "1",//是否已读
            "created_at": "2017-04-20 12:24:25",//创建时间
          },
          {
            "id": "2",//任务id
            "notification_type": "1",//通知类型,1为提问
            "description": "这是一条测试数据2",//通知内容
            "is_read": "1",//是否已读
            "created_at": "2017-04-20 12:24:25",//创建时间
          }
        ];
        this.loading = 0;


          /*
        postRequest(`notifications/list`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.messages = response.data.data;
          }
          this.loading = 0;
        });
        */
      },
      getNextList() {
        this.messages = [
          {
            "id": "1",//通知id
            "notification_type": "1",//通知类型,1为提问
            "description": "这是一条测试数据1",//通知内容
            "is_read": "1",//是否已读
            "created_at": "2017-04-20 12:24:25",//创建时间
          },
          {
            "id": "2",//任务id
            "notification_type": "1",//通知类型,1为提问
            "description": "这是一条测试数据2",//通知内容
            "is_read": "1",//是否已读
            "created_at": "2017-04-20 12:24:25",//创建时间
          }
        ];
        this.loading = 0;

        /*
        postRequest(`notifications/list`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.messages = this.messages.concat(response.data.data);
          }

          this.loading = 0;
        });
        */
      }
    },
  }
</script>

<style scoped>
   .message-list{
     margin-top:15px;
   }
</style>
