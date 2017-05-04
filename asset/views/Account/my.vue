<template>

  <div>

        <header class="mui-bar mui-bar-nav">
          <h1 class="mui-title">我的</h1>
          <a class="mui-icon mui-icon-email mui-pull-right" @tap.stop.prevent="$router.push('/message')"></a>
        </header>

        <div class="mui-content myinfo">
          <ul class="mui-table-view mui-table-view-chevron">
            <li class="mui-table-view-cell mui-media">
              <img class="mui-media-object mui-pull-left head-img" id="head-img" :src="avatar">
              <div class="mui-media-body">
                {{ name }}
                <p class="mui-ellipsis">{{ phone }}</p>
              </div>
            </li>
          </ul>

          <ul class="mui-table-view mui-table-view-chevron">
            <li class="mui-table-view-cell">
              <router-link to="/my/info" class="mui-navigate-right"><span class="mui-icon mui-icon-person"></span>我的档案</router-link>
            </li>
            <li class="mui-table-view-cell">
              <a href="#privacy" class="mui-navigate-right"><span class="mui-icon iconfont icon-vip"></span>专家管理</a>
            </li>
            <li class="mui-table-view-cell">
              <a href="#general" class="mui-navigate-right"><span class="mui-icon iconfont icon-wallet"></span>我的钱包</a>
            </li>
          </ul>

          <ul class="mui-table-view mui-table-view-chevron">
            <li class="mui-table-view-cell">
              <router-link to="/asks" class="mui-navigate-right"><span class="mui-icon mui-icon-help"></span>我的提问</router-link>
            </li>
            <li class="mui-table-view-cell">
              <router-link to="/answers" class="mui-navigate-right"><span class="mui-icon iconfont icon-answer"></span>我的问答</router-link>
            </li>
          </ul>

          <ul class="mui-table-view mui-table-view-chevron mb70">
            <li class="mui-table-view-cell">
              <a href="#privacy" class="mui-navigate-right"><span class="mui-icon iconfont icon-share"></span>推荐给朋友</a>
            </li>
            <li class="mui-table-view-cell">
              <a href="#privacy" class="mui-navigate-right"><span class="mui-icon mui-icon-gear"></span>设置与帮助</a>
            </li>
            <li class="mui-table-view-cell">
              <router-link to="/feedback" class="mui-navigate-right"><span class="mui-icon-extra mui-icon-extra-lamp"></span>意见与反馈</router-link>
            </li>
            <li class="mui-table-view-cell">
              <a href="javascript:void(0)" class="mui-navigate-right" @click="logOut"><span class="mui-icon mui-icon-close"></span>退出登录</a>
            </li>
          </ul>
        </div>

</div>
</template>
<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND} from '../../stores/types';
  import router from '../../routers/index';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        im_tokenMsg: '',
        name:currentUser.name,
        phone:currentUser.phone,
        avatar:currentUser.avatar_url
      }
    },
    methods: {
      getToken(){
        var im_token = JSON.parse(sessionStorage.getItem('im_token'))
        this.im_tokenMsg = im_token;
      },
      logOut(){
        localEvent.clearLocalItem('UserLoginInfo');
        localEvent.clearLocalItem('UserInfo');
        this.$store.dispatch(ASKS_LIST_APPEND, {});
        this.$store.dispatch(ANSWERS_LIST_APPEND, {});
        this.$store.dispatch(TASK_LIST_APPEND, {});

        router.push({ path: 'login' });
      }
    },
    mounted(){
      this.getToken()
    }
  }

</script>

<style scoped>
  .myinfo{
    margin-top:15px;
  }
  .mui-table-view {
    margin-top: 15px;
  }

  .mui-table-view .mui-icon, .mui-table-view .mui-icon-extra {
    color:#999;
    width:24px;
    height:24px;
    margin-right: 5px;
  }
  .myinfo li{
    padding-top:13px;
    padding-bottom:13px;
  }

  .myinfo > .mui-table-view:first-child{
    margin-top:0;
  }
</style>
