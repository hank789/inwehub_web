<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的提问</h1>
    </header>

    <div id="pullrefresh" class="mui-content mui-scroll-wrapper">
      <div class="mui-scroll">

        <div class="mui-content" v-if="nothing == 0">

          <div class="list-ask">

            <div class="mui-table-view list-ask-item" v-for="(ask, index) in asks">
              <div class="mui-table-view-cell mui-media" @tap.stop.prevent="$router.push('/ask/' + ask.id)">

                <div class="site-desc mui-ellipsis-2">
                  {{ ask.description | textLimit}}
                </div>

                <div class="person">
                  <div class="mui-media-body">
                    <div>
                      <span>{{ ask.status_description }}</span>
                      ·
                      <span class="time"><timeago :since="timeago(ask.created_at)"></timeago></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="mui-content list-empty" v-if="nothing == 1">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无提问</div>
            <div class="subTitle">提出正确的问题，往往等于解决了问题的大半。
            <br/><span>快去提出第一个问题吧！</span>
            </div>
            <div class="buttons">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                      @tap.stop.prevent="$router.push('/ask')">快速提问


              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE, ASKS_INFO, ASKS_LIST, ASKS_INFO_APPEND, ASKS_LIST_APPEND} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';


  const Asks = {
    data: () => ({
      asks: [],
      loading: true
    }),
    methods: {
      getStatusText(code){
          switch (code) {
            case 1:
                return '待分配';
                break;
            case 2:
              return '待确认';
              break;
            case 3:
              return '已关闭';
              break;
            case 4:
              return '待回答';
              break;
            case 5:
              return '已拒绝';
              break;
            case 6:
              return '已回答';
              break;
            case 7:
              return '已点评';
              break;
          }
          return '';
      },
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      getPrevList(){
        postRequest(`question/myList`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          if (response.data.data.length > 0) {
            this.asks = response.data.data;
          }
          this.loading = 0;
        });
      },
      getNextList() {
        postRequest(`question/myList`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            this.$router.go(-1);
          }

          if (response.data.data.length > 0) {
            this.asks = this.asks.concat(response.data.data);
          }
          this.loading = 0;
        });
      }
    },
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
        return this.asks.length ? 0 : 1;
      },
      topId () {
        if (this.asks.length) {
          return this.asks[0].id;
        }
        return 0;
      },
      bottomId () {
        var length = this.asks.length;
        if (length) {
          return this.asks[length - 1].id;
        }
        return 0;
      },
      lastY (){
        return this.$store.state.asks.info.lastY;
      }
    },
    updated(){
      this.$store.dispatch(ASKS_LIST_APPEND, this.asks);
    },
    created(){
      var list = []; //this.$store.state.asks.list;
      if (list.length) {
        this.asks = list;
        this.loading = false;
      }
    },
    mounted(){

      var t = this;
      mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function (event) {
        var lastY = event.detail.lastY;
        t.$store.dispatch(ASKS_INFO_APPEND, {lastY: lastY});
      });

      mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '',
            callback: pullupRefresh
          }
        }
      });

      var that = this;

      function pulldownRefresh() {
        that.getPrevList();
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
      }

      function pullupRefresh() {
        that.getNextList();
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
      }

      if (mui.os.plus) {
        mui.plusReady(function () {

          if (!that.asks.length) {
            mui('#pullrefresh').pullRefresh().pullupLoading();
          }
          mui('#pullrefresh').pullRefresh().scrollTo(0, t.lastY, 0)

        });
      } else {
        mui.ready(function () {
          if (!that.asks.length) {
            mui('#pullrefresh').pullRefresh().pullupLoading();
          }
          mui('#pullrefresh').pullRefresh().scrollTo(0, t.lastY, 0)
        });
      }
    },
    filters: {
      textLimit(text){
        var limit = 70;
        if (text.length > limit) {
          text = text.slice(0, limit) + '...';
        }
        return text;
      }
    }
  }
  export default Asks;
</script>


<style scoped>

  .list-ask .list-ask-item{
    margin-top:10px;
    position:relative;
    line-height: 40px;
  }

  .list-ask .list-ask-item .title{
    line-height:28px;
  }

  .list-ask .list-ask-item .mui-media-body {
    padding-left:10px;
    line-height: 24px;
    margin:5px 0 0;
    color:#9B9B9B;
    font-size:12px;
  }
  .list-ask .list-ask-item .time{
    color:#9B9B9B;
    font-size:12px;
  }

  .list-ask .username{
    color:#101010;
  }

  .list-ask .list-ask-item .amount{
    position: absolute;
    right: 10px;
    color:#ff9800;
    font-size:16px;
  }

  .list-ask .list-ask-item .amount b{

  }

  .list-ask .person{
    position: relative;
  }


  .list-ask .site-desc{
    margin-top:10px;
    padding-left:10px;
    line-height: 22px;
    color:#101010;
  }

  .list-ask .site-desc .mui-icon{
    font-size:16px;
  }

  .list-ask .avatar{
    z-index: 0;
    color: #ffffff;
    float:left;
    display: inline-block;
    margin-top:3px;
    height: 50px;
    width: 50px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
  }


  .list-ask .avatar .avatarInner{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .list-ask .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .list-ask .mui-table-view-cell{
    padding:11px 8px;
  }

  .list-ask .mui-table-view-cell > a:not(.mui-btn){
    margin: -11px -8px;
  }
  .list-ask p{
    margin-left:20px;
  }

  .buttons{
    margin-top:10px;
    padding:0 30px;
  }
</style>
