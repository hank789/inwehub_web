<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的提问</h1>
    </header>

    <div class="mui-content list-empty" v-if="nothing == 1">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            未完成
        </a>
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/asks/finish')">
            已完成
          </a>
        </div>
      </div>

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

    <div id="item1" class="absolute" :class="{'mui-content':true, 'mui-active':true, 'emptyList':nothing}">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            未完成
        </a>
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/asks/finish')">
            已完成
          </a>
        </div>
      </div>

      <div id="pullrefresh" class="mui-scroll-wrapper">
        <div class="mui-scroll">

          <div class="" v-if="nothing == 0">

            <div class="list-ask">

              <div class="mui-table-view list-ask-item" v-for="(ask, index) in asks">
                <div class="mui-table-view-cell mui-media" @tap.stop.prevent="$router.pushPlus('/ask/' + ask.id)">

                  <div class="site-desc mui-ellipsis-2">
                    {{ ask.description | textLimit}}
                </div>

                  <div class="person">
                    <div class="mui-media-body">
                      <div>
                        <span :class="'label label_' + ask.status">{{ ask.status_description }}</span>
                        <span class="time">{{ ask.created_at.split(' ')[0].replace(/-/g, '/') }}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

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
  import localEvent from '../../stores/localStorage';


  const Asks = {
    data: () => ({
      asks: [],

      loading: true
    }),
    methods: {
      pulldownRefresh() {
        setTimeout(() => {
          this.getPrevList();
        },1000);
      },
      pullupRefresh() {
        setTimeout(() => {
          this.getNextList();
        },1000);
      },
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
        postRequest(`question/myList`, {type:'1'}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.asks = response.data.data;
          }
          this.loading = 0;
          mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed

        });
      },
      getNextList() {
        postRequest(`question/myList`, {bottom_id: this.bottomId, type:'1'}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.asks = this.asks.concat(response.data.data);
          }
          this.loading = 0;

          mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);

        });
      },
      isFromDetail(){
        return false;
        var referer = localEvent.getLocalItem('referer');
        if (/\/ask\/[0-9]+/.test(referer.path)) {
          return true;
        }
        return false;
      }
    },
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
       //判断有没有数据 0 代表隐藏   1代表显示数据；
        return this.asks.length ? 0 : 1;
      },
     //获取请求数据第一个数据的id；
      topId () {
        if (this.asks.length) {
          return this.asks[0].id;
        }
        return 0;
      },
     //获取请求数据最后一个数据的id；
      bottomId () {
        var length = this.asks.length;
        if (length) {
          return this.asks[length - 1].id;
        }
        return 0;
      },
      lastY (){
        if (this.isFromDetail()) {
          return this.$store.state.asks.info.lastY;
        } else {
          return 0;
        }
      }
    },
    updated(){
      this.$store.dispatch(ASKS_LIST_APPEND, this.asks);
    },
    created(){
      //showInwehubWebview();
      if (this.isFromDetail()) {
        var list = this.$store.state.asks.list;
      } else {
        var list = [];
      }

      if (list.length) {
        this.asks = list;
        this.loading = false;
      }
    },
    mounted(){
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-asklist');
        this.getPrevList();
      });
      var t = this;
      mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function (event) {
        var lastY = event.detail.lastY;
        t.$store.dispatch(ASKS_INFO_APPEND, {lastY: lastY});
      });

      mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: this.pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多了',
            callback: this.pullupRefresh
          }
        }
      });
      this.getPrevList();
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

  .list-ask{
    margin-top:5px;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 50px;
    font-size: 16px;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    position: relative;
    border: none;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active:after {
    position: absolute;
    width: 50px;
    right: 10px;
    bottom: 0;
    left: 50%;
    margin-left: -25px;
    height: 5px;
    z-index: 999;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #009FE8;
  }

  #pullrefresh {
  }
  .list-ask .list-ask-item{
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
    float:right;
    margin-right: 10px;
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


  .mui-control-content{
    position: absolute;
    width: 100%;
    bottom: 0px;
    right: 0px;
    top: 88px;
  }



  .menu{
    position: relative;
    z-index:7;
  }

  .list-empty .menu{
    margin-bottom:0;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 50px;
    font-size:14px;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    position: relative;
    color:#03aef9;
    border: none;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active:after {
    position: absolute;
    width: 28px;
    bottom: 0;
    left: 50%;
    margin-left: -14px;
    height: 2px;
    z-index: 999;
    content: '';
    background-color: #009FE8;
  }

  .mui-segmented-control{
    background: #f3f4f6;
  }

  #pullrefresh{
    background: #fff;
  }

  .mui-table-view:before{
    display: none;
  }

  .mui-table-view:after{
    display: none;
  }

  .label{
    display: inline-block;
    background:#fcc816;
    border-radius:50px;
    color:#fff;
    line-height:20px;
    padding:0 9px;
  }

  .mui-table-view-cell:after{
    height:1px !important;
    left:15px;
    right:15px;
  }
</style>
