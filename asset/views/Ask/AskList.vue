<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的提问</h1>
    </header>

    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>

    <div id="pullrefresh" class="mui-content mui-scroll-wrapper" >
    <div class="mui-scroll">

      <div class="mui-content" v-if="nothing == 0">

        <div class="list-ask">

          <div class="mui-table-view list-ask-item" v-for="(ask, index) in asks">

            <template v-if="!ask.answer_user_id">
              <div class="mui-table-view-cell mui-media" @tap.stop.prevent="$router.push('/ask/' + ask.id)">
                <div class="title">
                  <div class="mui-row">
                    <div class="mui-col-xs-8">
                      <div class="text">{{ ask.description | textLimit}}</div>
                    </div>
                    <div class="mui-col-xs-4">
                      <div class="timeago"><timeago :since="timeago(ask.created_at)"></timeago></div>
                    </div>
                  </div>
                </div>
                <div class="person">
                  <div class="avatar">
                    <div class="avatarInner">
                      <img :src="ask.user_avatar_url?ask.user_avatar_url:'images/uicon.jpg'" class="avatar"/>
                    </div>
                  </div>
                  <span class="username">{{ ask.user_name }}</span>
                  <span class="amount">悬赏金额<b>￥{{ ask.price }}</b>元</span>
                </div>
                <div class="site-desc">
                  {{ ask.status_description }}
                    <span class="mui-icon mui-icon-arrowright"></span>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="mui-table-view-cell mui-media" @tap.stop.prevent="$router.push('/ask/' + ask.id)">
                <div class="title">
                  <div class="mui-row">
                    <div class="mui-col-xs-8">
                      <div class="text">{{ ask.description | textLimit}}</div>
                    </div>
                    <div class="mui-col-xs-4">
                      <div class="timeago"><timeago :since="timeago(ask.created_at)"></timeago></div>
                    </div>
                  </div>
                </div>
                <div class="person">
                  <div class="avatar">
                    <div class="avatarInner">
                      <img :src="ask.user_avatar_url?ask.user_avatar_url:'images/uicon.jpg'" class="avatar"/>
                    </div>
                  </div>
                  <span class="username">{{ ask.user_name }}</span>
                  <span class="amount">悬赏金额<b>￥{{ ask.price }}</b>元</span>
                </div>
              </div>

              <div class="mui-table-view-cell mui-media" @tap.stop.prevent="$router.push('/ask/' + ask.id)">
                <a href="javascript:;">
                  <div class="avatar mui-media-object">
                    <div class="avatarInner">
                      <img :src="ask.answer_user_avatar_url?ask.answer_user_avatar_url:'images/uicon.jpg'"
                           class="avatar"/>
                    </div>
                  </div>
                  <div class="mui-media-body answer">
                    <span class="username">{{ ask.answer_username }}</span>
                    <span class="timeago"><timeago :since="timeago(ask.answer_time)"></timeago></span>
                    <p class='mui-ellipsis'> {{ ask.status_description }}<span
                      class="mui-icon mui-icon-arrowright"></span></p>
                  </div>
                </a>
              </div>
            </template>
          </div>
        </div>
      </div>

    </div></div>

    <div class="mui-content list-empty" v-if="nothing == 1">
      <div class="mui-table-view list-ask-item">
        <div class="mui-table-view-cell">
          <div class="">
            <div class="title">暂无提问</div>
            <div class="subTitle">速速前往提问，开始你的英淘之旅！</div>
            <div class="buttons">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.push('/ask')">快速提问</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE, ASKS_INFO, ASKS_LIST, ASKS_INFO_APPEND, ASKS_LIST_APPEND} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';


  const Asks = {
    data: () => ({
      asks: [],
      loading:true,
      loading_gif:loading_gif
    }),
    methods: {
      timeago(time) {
        let newDate = new Date();
        newDate.setTime(Date.parse(time.replace(/-/g, "/")));
        return newDate;
      },
      getPrevList(){
        addAccessToken().post(createAPI(`question/myList`), {},
          {
            validateStatus: status => status === 200
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              this.$router.go(-1);
            }

            if (response.data.data.length > 0) {
              this.asks = response.data.data;
            }
            this.loading = 0;
          })
          .catch(({response: {message = '网络状况堪忧'} = {}}) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          })
      },
      getNextList() {
        addAccessToken().post(createAPI(`question/myList`), {bottom_id: this.bottomId},
          {
            validateStatus: status => status === 200
          }
        )
          .then(response => {

            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              this.$router.go(-1);
            }

            if (response.data.data.length > 0) {
              this.asks = this.asks.concat(response.data.data);
            }
            this.loading = 0;
          })
          .catch(({response: {message = '网络状况堪忧'} = {}}) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              });
            });
          })
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
          return this.asks[length-1].id;
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
      var list = this.$store.state.asks.list;
      if (list.length) {
        this.asks = list;
        this.loading = false;
      }
    },
    mounted(){

      var t = this;
      mui('.mui-scroll-wrapper').on('scrollend', '.mui-scroll', function(event){
        var lastY = event.detail.lastY;
        t.$store.dispatch(ASKS_INFO_APPEND, {lastY:lastY});
      });

      mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore:'',
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
            mui('#pullrefresh').pullRefresh().scrollTo(0,t.lastY,0)

        });
      } else {
        mui.ready(function () {
          if (!that.asks.length) {
            mui('#pullrefresh').pullRefresh().pullupLoading();
          }
          mui('#pullrefresh').pullRefresh().scrollTo(0,t.lastY,0)
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

  .list-ask .list-ask-item .title{
    line-height:30px;
  }

  .list-ask .list-ask-item {
    margin-top: 10px;
    position: relative;
    line-height: 40px;
    padding: 0 7px;
  }

  .list-ask .list-ask-item .timeago {
    float: right;
    color: #999;
  }

  .list-ask .username {
    color: orange;
    margin-left: 20px;
  }

  .list-ask .list-ask-item .amount {
    position: absolute;
    right: 10px;
    color: #999;
  }

  .list-ask .list-ask-item .amount b {
    color: #f85f48;
    margin: 0 5px;
    font-weight: normal;
  }

  .list-ask .site-desc {
    margin-top: 10px;
    line-height: 23px;
    color: #8f8f94;
    font-size: 14px;
  }

  .list-ask .site-desc .mui-icon {
    font-size: 16px;
  }

  .list-ask .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 40px;
    width: 40px;
    font-size: 20px;
    color: #ffffff;
    background-color: #bdbdbd;
    text-align: center;
    border-radius: 50%;
  }

  .list-ask .avatar .avatarInner {
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

  .list-ask .mui-table-view-cell {
    padding: 11px 8px;
  }

  .list-ask .mui-table-view-cell > a:not(.mui-btn) {
    margin: -11px -8px;
  }

  .list-ask p {
    margin-left: 20px;
  }

  .list-ask .answer {
    line-height: 30px;
  }
</style>
