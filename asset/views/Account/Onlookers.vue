<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的收藏</h1>
    </header>


    <div class="mui-content list-empty absolute" v-if="nothing == 1">
      <div class="container">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zanwushuju"></use>
        </svg>
        <p>暂时还没有数据呀～</p>
      </div>
    </div>

    <div class="mui-content absolute">
      <div class="mui-scroll-wrapper" id="pullrefresh">


        <div class="mui-scroll">
          <ul class="hotAnswer_b">
            <li v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.question_id)">
              <p class="mui-ellipsis-2">{{ item.description }}</p>
              <div class="hotAnswer_d">
                <p>
                  <img :src="item.answer_user_avatar_url"/>
                  <svg class="icon" aria-hidden="true" v-show="item.answer_user_is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </p>
                <p class="mui-ellipsis">回答者：{{ item.answer_username}}</p>
              </div>
              <i class="bot"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import userAbility from '../../utils/userAbility';


  const Onlookers = {
    data: () => ({
      list: [],
      loading: true
    }),
    methods: {
      toDetail(id) {
        this.$router.push('/askCommunity/major/' + id);
      },
      pulldownRefresh() {
        setTimeout(() => {
          this.getPrevList();
        }, 1000);
      },
      pullupRefresh() {
        setTimeout(() => {
          this.getNextList();
        }, 1000);
      },
      getPrevList(){
        postRequest(`answer/myOnlookList`, {type: '1'}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
            return;
          }

          if (response.data.data.length > 0) {
            this.list = response.data.data;
          }
          this.loading = 0;
          mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed

        });
      },
      getNextList() {
        postRequest(`answer/myOnlookList`, {bottom_id: this.bottomId, type: '1'}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
            return;
          }

          if (response.data.data.length > 0) {
            this.list = this.list.concat(response.data.data);
          }
          this.loading = 0;

          mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);

        });
      },
    },
    computed: {
      nothing () {
        if (this.loading) {
          return -1;
        }
        //判断有没有数据 0 代表隐藏   1代表显示数据；
        return this.list.length ? 0 : 1;
      },
      //获取请求数据第一个数据的id；
      topId () {
        if (this.list.length) {
          return this.list[0].id;
        }
        return 0;
      },
      //获取请求数据最后一个数据的id；
      bottomId () {
        var length = this.list.length;
        if (length) {
          return this.list[length - 1].id;
        }
        return 0;
      }
    },
    mounted(){
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-onlookerslist');
        this.getPrevList();
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
    }
  };
  export default Onlookers;

</script>

<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .mui-bar-nav ~ .mui-content.absolute {
    top: 44px;
    background: #fff;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .hotAnswer_b {
    width: 90%;
    margin-left: 5%;
    /*height: 200px;*/
    overflow: hidden;
  }

  .hotAnswer_b li {
    width: 100%;
    height: 74px;
    position: relative;
  }

  .hotAnswer_b li > p {
    margin-top: 12px;
    font-size: 16px;
    color: #444444;
  }

  .hotAnswer_d {
    width: 100%;
    height: 32px;
    margin-top: 8px;
  }

  .hotAnswer_d p {
    float: left;
  }

  .hotAnswer_d p:nth-child(1) {
    width: 9.5%;
    height: 32px;
    /*background: #CCCCCC;*/
    position: relative;
  }

  .hotAnswer_d p:nth-child(1) > svg {
    position: absolute;
    font-size: 14px;
    bottom: 0;
    right: -4px;
  }

  .hotAnswer_d p:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .hotAnswer_d p:nth-child(2) {
    width: 32%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    text-align: center;
    line-height: 15px;
  }

  .hotAnswer_d p:nth-child(3) {
    width: 21%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    border-right: 1px solid #c8c8c8;
    text-align: center;
    line-height: 15px;
  }

  .hotAnswer_d p:nth-child(4) {
    width: 37.5%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    text-align: center;
    line-height: 15px;
  }

  /*无数据的样式 */

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 60px;
    margin-left: 23px;
    margin-bottom: 8px;
  }

  .container p {
    font-size: 12px;
    color: #c8c8c8;
  }
</style>
