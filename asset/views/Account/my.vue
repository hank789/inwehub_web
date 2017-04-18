<template>

  <div class="page">
    <div class="page-container">

      <div class="card-my">
        <div class="hairline-top"></div>
        <div class="hairline-bottom"></div>
        <div class="avatar">
          <div class="avatarInner">
            <img src="images/uicon.jpg"/>
          </div>
        </div>
        <div class="info">
          <div class="title">{{ name }}</div>
          <div class="subTitle">{{ phone }}</div>
        </div>
      </div>

      <div class="list list-classify">
        <div class="list-item">
          <div class="hairline-top"></div>
          <div class="hairline-bottom"></div>
          <span class="icon-wrapper"><i class="icon ion-person"></i></span>
          <span class="title">我的档案</span>

          <span class="nav"><i class="icon ion-ios-arrow-right"></i></span>
        </div>

        <div class="list-item">
          <div class="hairline-top"></div>
          <div class="hairline-bottom"></div>
          <span class="icon-wrapper"><i class="icon ion-university"></i></span>
          <span class="title">专家管理</span>

          <span class="nav"><i class="icon ion-ios-arrow-right"></i></span>
        </div>

        <div class="list-item">
          <div class="hairline-top"></div>
          <div class="hairline-bottom"></div>
          <span class="icon-wrapper"><i class="icon ion-bag"></i></span>
          <span class="title">我的钱包</span>
          <span class="subTitle">2.14元</span>
          <span class="nav"><i class="icon ion-ios-arrow-right"></i></span>
        </div>

      </div>

      <div class="list list-classify">
        <div class="list-item">
          <div class="hairline-top"></div>
          <div class="hairline-bottom"></div>
          <span class="icon-wrapper"><i class="icon ion-share"></i></span>
          <span class="title">推荐给朋友</span>
          <span class="nav"><i class="icon ion-ios-arrow-right"></i></span>
        </div>

        <div class="list-item">
          <div class="hairline-top"></div>
          <div class="hairline-bottom"></div>
          <span class="icon-wrapper"><i class="icon ion-ios-gear-outline"></i></span>
          <span class="title">设置与帮助</span>
          <span class="nav"><i class="icon ion-ios-arrow-right"></i></span>
        </div>

        <div class="list-item">
          <div class="hairline-top"></div>
          <div class="hairline-bottom"></div>
          <span class="icon-wrapper"><i class="icon ion-ios-lightbulb-outline"></i></span>
          <span class="title">意见与反馈</span>
          <span class="nav"><i class="icon ion-ios-arrow-right"></i></span>
        </div>

        <div class="list-item">
          <div class="hairline-top"></div>
          <div class="hairline-bottom"></div>
          <span class="icon-wrapper"><i class="icon ion-android-exit"></i></span>
          <span class="title" @click="logOut">退出</span>
        </div>
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
<style lang="less" rel="stylesheet/less" scoped>


</style>
