<template>

  <div>

        <header class="mui-bar mui-bar-nav">
          <h1 class="mui-title">我的</h1>
          <a class="mui-icon fa fa-envelope-o mui-pull-right" @tap.stop.prevent="$router.push('/message')"></a>
        </header>

        <div class="mui-content myinfo">
          <div class="mui-table-view">

            <div class="mui-table-view-cell my-header">
              <div class="bg"></div>
              <div class="avatar">
                <div class="avatarInner">
                  <img :src="avatar">
                </div>
              </div>
              <div class="text">
                {{ name }}
                <p class="mui-ellipsis" v-if="company && title">{{ title }} | {{ company }}</p>
              </div>
              <div class="vip"><span class="mui-icon fa fa-vimeo"></span>认证专家</div>
            </div>

          </div>

          <ul class="mui-table-view mui-table-view-chevron firstItem">
            <li class="mui-table-view-cell">
              <router-link to="/my/info" class="mui-navigate-right"><span class="mui-icon fa fa-archive"></span>我的档案<span class="mui-pull-right account-setting-span">完整度：85%</span></router-link>
            </li>
            <li class="mui-table-view-cell">
              <a href="#general" class="mui-navigate-right"><span class="mui-icon fa fa-money"></span>我的钱包<span class="mui-pull-right account-setting-span">余额：188.00</span></a>
            </li>
            <li class="mui-table-view-cell">
              <a href="#privacy" class="mui-navigate-right"><span class="mui-icon fa fa-user-secret"></span>专家管理</a>
            </li>
          </ul>

          <ul class="mui-table-view mui-table-view-chevron">
            <li class="mui-table-view-cell">
              <router-link to="/asks" class="mui-navigate-right"><span class="mui-icon fa fa-question-circle"></span>我的提问</router-link>
            </li>
            <li class="mui-table-view-cell">
              <router-link to="/answers" class="mui-navigate-right"><span class="mui-icon fa fa-file-text"></span>我的问答</router-link>
            </li>
          </ul>

          <ul class="mui-table-view mui-table-view-chevron mb70">
            <li class="mui-table-view-cell">
              <a href="#privacy" class="mui-navigate-right"><span class="mui-icon fa fa-cog"></span>设置与帮助</a>
            </li>
            <li class="mui-table-view-cell">
              <router-link to="/feedback" class="mui-navigate-right"><span class="mui-icon-extra fa fa-pencil"></span>意见与反馈</router-link>
            </li>
            <li class="mui-table-view-cell">
              <a href="javascript:void(0)" class="mui-navigate-right" @click="clearCache"><span class="mui-icon mui-icon-reload"></span>清除缓存</a>
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
        avatar:currentUser.avatar_url,
        title: currentUser.title,
        company: currentUser.company
      }
    },
    methods: {
      getToken(){
         var im_token = JSON.parse(sessionStorage.getItem('im_token'))
         this.im_tokenMsg = im_token;
      },
      clearCache(){
        localEvent.setLocalItem('lauchFlag', {showGuide:false});
        mui.toast('清除成功');
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
  .mui-bar{
    background-color: #c2d5e4;
  }
  .myinfo{
  }
  .mui-table-view {
    margin-top: 15px;
  }

  .mui-table-view .mui-icon, .mui-table-view .mui-icon-extra {
    color:#999;
    font-size:24px;
    top:-2px;
    text-align: center;
    position: relative;
    width:24px;
    height:24px;
    margin-right: 15px;
  }
  .myinfo li{
    padding-top:13px;
    padding-bottom:13px;
  }

  .myinfo > .mui-table-view:first-child{
    margin-top:0;
  }
  .head-img {
    border-radius: 42px;
  }
  .account-setting-span {
    position: absolute;
    right: 40px;
    color: #5a7fd2;
    font-size: .8rem;
  }

  .my-header{
    padding:0;
    height:215px;
    position: relative;
    color:#fff;
    text-align: center;
  }

  .my-header .text{
    margin-top:10px;
    position: relative;
    font-weight:bold;
    font-size:16px;
  }

  .my-header p{
    margin-top:10px;
    color:#fff;
    font-size:16px;
    font-weight:bold;
  }

  .my-header .bg{
    background: url("../../statics/images/thumb_raw_1493885990.jpeg");
    background-size:100% 100%;
    opacity: 0.6;
    height:100%;
    position:absolute;
    z-index: 0;
    width:100%;
  }

  .my-header .vip{
    position: absolute;
    right:10px;
    top:15px;
  }

  .my-header .vip .mui-icon{
    color:#fef035;
    font-size:16px;
    margin-right: 0;
  }

  .avatar{
    z-index: 9;
    color: #ffffff;
    display: inline-block;
    margin-top:20px;
    height: 116px;
    width: 116px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
    position: relative;
  }

  .firstItem{
    margin-top:0;
  }

  .avatar .avatarInner{
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

  .avatar img {
    border:3px solid #d1d1d1;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .mui-table-view .mui-icon{
    vertical-align: middle;
    color:#acbfe8;
  }
</style>
