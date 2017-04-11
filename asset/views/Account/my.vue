<template>
  <!--个人中心-->
  <div>
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

  </div>
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
