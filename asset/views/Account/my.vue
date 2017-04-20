<template>

  <div class="page">
    <div class="page-container">

      <header class="mui-bar mui-bar-nav">
        <a class="mui-action-back mui-icon"></a>
        <h1 class="mui-title">我</h1>
      </header>

      <div class="mui-content">
        <ul class="mui-table-view mui-table-view-chevron">
          <li class="mui-table-view-cell mui-media">
            <a class="mui-navigate-right" href="#account">
              <img class="mui-media-object mui-pull-left head-img" id="head-img" src="images/uicon.jpg">
              <div class="mui-media-body">
                {{ name }}
                <p class="mui-ellipsis">{{ phone }}</p>
              </div>
            </a>
          </li>
        </ul>


        <ul class="mui-table-view mui-table-view-chevron">
          <li class="mui-table-view-cell">
            <a href="#privacy" class="mui-navigate-right"><span class="mui-icon-extra mui-icon-extra-addpeople"></span> 我的档案</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#privacy" class="mui-navigate-right"><span class="mui-icon-extra mui-icon-extra-university"></span> 专家管理</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#general" class="mui-navigate-right"><span class="mui-icon-extra mui-icon-extra-prech"></span> 我的钱包</a>
          </li>
        </ul>

        <ul class="mui-table-view mui-table-view-chevron">
          <li class="mui-table-view-cell">
            <a href="myAskList.html" class="mui-navigate-right"><span class="mui-icon mui-icon-help"></span> 我的提问</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="waitAnswerList.html" class="mui-navigate-right"><span class="mui-icon mui-icon-chat"></span> 我的问答</a>
          </li>
        </ul>

        <ul class="mui-table-view mui-table-view-chevron">
          <li class="mui-table-view-cell">
            <a href="#privacy" class="mui-navigate-right"><span class="mui-icon-extra mui-icon-extra-share"></span> 推荐给朋友</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#privacy" class="mui-navigate-right"><span class="mui-icon mui-icon-gear"></span>设置与帮助</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#general" class="mui-navigate-right"><span class="mui-icon-extra mui-icon-extra-lamp"></span> 意见与反馈</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="javascript:void(0)" class="mui-navigate-right" @click="logOut"><span class="mui-icon mui-icon-close"></span> 退出</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!--个人中心-->
  <!--div>
    <mu-paper class="demo-menu">

      <mu-card>
        <mu-card-header :title="name" :subTitle="phone">
          <mu-avatar :src="avatar" slot="avatar"/>
        </mu-card-header>

        <mu-card-text>
            总收入:0元
        </mu-card-text>

      </mu-card>

      <mu-menu desktop>

        <mu-divider />
        <mu-menu-item title="联系我们" leftIcon="phone" rightIcon="keyboard_arrow_right"/>
        <mu-menu-item title="设置" leftIcon="settings" rightIcon="keyboard_arrow_right"/>
        <mu-menu-item title="帮助" leftIcon="help" rightIcon="keyboard_arrow_right"/>

        <mu-divider />
        <mu-menu-item @click="logOut" title="退出" leftIcon="exit_to_app" rightIcon="keyboard_arrow_right"/>
      </mu-menu>
    </mu-paper>

  </div-->
</template>
<script>
  import localEvent from '../../stores/localStorage';
  import router from '../../routers/index';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        im_tokenMsg: '',
        name:currentUser.name,
        phone:currentUser.phone,
        avatar:currentUser.avatar
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
        router.push({ path: 'login' });
      }
    },
    mounted(){
      this.getToken()
    }
  }

</script>

<style scoped>

  .mui-table-view {
    margin-top: 20px;
  }

  .mui-table-view .mui-icon, .mui-table-view .mui-icon-extra {
    color: orange;
    margin-right: 5px;
  }
</style>
