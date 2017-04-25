<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">个人信息</h1>
    </header>

    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>
    <!--my -->
    <div id="tabbar-with-map" class="mui-content" v-show="!loading">
      <ul class="mui-table-view mui-table-view-chevron">
        <router-link to="/my/info/edit" class="mui-listspan">编辑</router-link>
        <li class="mui-table-view-cell mui-media">
            <img class="mui-media-object mui-pull-left" :src="user.info.avatar_url">
            <div class="mui-media-body">
              {{ user.info.name }} <b v-show="user.info.title">| {{ user.info.title }}</b><b class="mui-badge3" v-show="user.info.title">V</b>
              <p class='mui-ellipsis'>行业：{{ user.info.industry_tags }}</p>
              <p class='mui-ellipsis'>手机：{{ user.info.mobile }}</p>
              <p class='mui-ellipsis'>邮箱：{{ user.info.email }}</p>
              <p class='mui-ellipsis'>地址：{{ user.info.address_detail }}</p>
            </div>

        </li>
      </ul>

    </div>
  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';
  export default {
    data: () => ({
      user: {
        info: {},
        jobs: [],
        edus: {},
        projects: {},
        trains: {}
      },
      loading: true,
      loading_gif: loading_gif
    }),
    methods: {

    },
    created () {
      addAccessToken().post(createAPI(`profile/info`), {},
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

          this.user = response.data.data;
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
  }
</script>


<style scoped>

  .mui-segmented-control .mui-control-item{
    border-left: none;
    color: #fff!important;
    border-color: none;
  }
  .mui-segmented-control .mui-control-item.mui-active{
    border-bottom: 1px solid #fff;
  }
  .mui-segmented-control .mui-icon.mui-active{
    border: none;
  }
  .mui-bar-nav~.mui-content {
    padding-top: 30px;
  }

  .mui-bar-nav.mui-bar .mui-icon{
    padding: 0;
  }
  b{
    font-size: 12px;
    font-weight: 100;
    color: #8f8f94;
  }
  .mui-ellipsis{
    font-size: 12px;
  }
  .mui-bar-nav~.mui-content {
    padding-top: 36px;
  }
  .mui-icon-listbr{
    float: right;
  }
  .mui-icon .mui-badge2{
    padding: 1px 3px;
  }
  .mui-badge3{
    color: #FF9933;
    font-size: 8px;
  }

  .mui-search .mui-placeholder{
    line-height: 40px;
  }

  .mui-grid-view.mui-grid-9 .mui-media{
    color: #007AFF;
  }

  .mui-icon-fs{
    font-size: 25px;
    color: #007AFF;
  }
  .mui-my-list{
    color: #000;
    padding-left: 10px;
    font-size: 15px;
  }

  .mui-list-wf a{
    color: #000000;
  }
  .mui-listspan{
    float: right;
    padding-right: 15px;
    font-size: 12px;
    color: #8f8f94;
  }
  .mui-table-view-cell>a:not(.mui-btn) {
    white-space: normal;
  }
  p{
    white-space: normal;
  }
</style>
