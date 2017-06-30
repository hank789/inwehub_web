<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">设置</h1>
    </header>

    <div class="mui-content">

      <ul class="mui-table-view mui-table-view-chevron">
        <li class="mui-table-view-cell">
          <a href="javascript:void(0)" class="mui-navigate-right" @tap.stop.prevent="clearCache">清除缓存</a>
        </li>
        <li class="mui-table-view-cell">
          <a href="javascript:void(0)" @tap.stop.prevent="$router.pushPlus('/help/question')" class="mui-navigate-right">常见问题</a>
        </li>
        <li class="mui-table-view-cell">
          <a href="javascript:void(0)" @tap.stop.prevent="$router.pushPlus('/about')" class="mui-navigate-right">关于我们</a>
        </li>
        <li class="mui-table-view-cell">
          <a href="javascript:void(0)" class="mui-navigate-right" @tap.stop.prevent="starApp">前往评价</a>
        </li>
      </ul>



      <div class="mui-table-view">
        <div class="mui-table-view-cell footer">
          <div class="logo"><span class="mui-icon myicon myicon-setting-logo"></span></div>
          <div class="version">{{ appVersion }}</div>

          <button type="button" class="mui-btn-block mui-btn-primary" @tap.stop.prevent="logOut" v-show="!isWeiXin()">
            退出应用
          </button>
          <div class="copyright">Copyright © 2017 InweTech.<br/>
All Rights Reserved</div>
        </div>

      </div>

    </div>

  </div>
</template>
<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND} from '../../stores/types';
  import router from '../../modules/index/routers/index';
  import {apiRequest} from '../../utils/request';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        appVersion:'',
        im_tokenMsg: '',
        name: currentUser.name,
        phone: currentUser.phone,
        avatar: currentUser.avatar_url,
        title: currentUser.title,
        company: currentUser.company,
        ios_market_url: '',
        android_market_url: ''
      }
    },
    created () {
      var obj = localEvent.getLocalItem('app_version');
      if (obj) {
        if (mui.os.ios) {
          this.version = 'for iPhone V' + obj.version;
        } else if (mui.os.android) {
          this.version = 'for android V' + obj.version;
        }
      }
      showInwehubWebview();
    },
    methods: {
      isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();

        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
           return true;
        }else{
           return false;
        }
      },
      clearCache(){
        localEvent.setLocalItem('lauchFlag', {showGuide: false});
        mui.toast('清除成功');
      },
      clearUserCache(){
        localEvent.clearLocalItem('UserLoginInfo');
        localEvent.clearLocalItem('UserInfo');
        this.$store.dispatch(ASKS_LIST_APPEND, {});
        this.$store.dispatch(ANSWERS_LIST_APPEND, {});
        this.$store.dispatch(TASK_LIST_APPEND, {});
        router.pushPlus('/login',true,'none','none');
      },
      logOut(){
        if (mui.os.plus) {
          mui.plusReady(() => {
            var device_info = plus.push.getClientInfo();
            apiRequest(`auth/logout`, {
              client_id: device_info.clientid,
              device_token: device_info.token,
              appid: device_info.appid,
              appkey: device_info.appkey,
              device_type: plus.os.name === 'iOS' ? 2 : 1
            }).then(res => {
              this.clearUserCache();
            });
          });
        } else {
          this.clearUserCache();
        }
      },
      starApp() {
          if (!this.ios_market_url){
            apiRequest(`system/app_market_url`, {}).then(response_data => {
              if (response_data !== false) {
                this.ios_market_url = response_data.ios_url;
                this.android_market_url = response_data.android_url;
                if (mui.os.android) {
                  location.href = this.android_market_url;
                } else {
                  location.href = this.ios_market_url;
                }
              }
            });
          } else {
            if (mui.os.android) {
              location.href = this.android_market_url;
            } else {
              location.href = this.ios_market_url;
            }
          }
      }
    },
    mounted(){
      mui('.mui-switch')['switch']();
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-setting');
      });
    }
  }

</script>

<style scoped>

  .mui-table-view {
    margin-top: 15px;
  }

  .mui-table-view .mui-icon, .mui-table-view .mui-icon-extra {
    color: #999;
    font-size: 24px;
    top: -2px;
    text-align: center;
    position: relative;
    width: 24px;
    height: 24px;
    margin-right: 15px;
  }

  .myinfo li {
    color: #101010;
    padding-top: 13px;
    padding-bottom: 13px;
  }

  .myinfo > .mui-table-view:first-child {
    margin-top: 0;
  }

  .head-img {
    border-radius: 42px;
  }

  .account-setting-span {
    position: absolute;
    right: 40px;
    color: #587dd5;
    font-size: .8rem;
  }

  .my-header {
    padding: 0;
    height: 215px;
    position: relative;
    color: #fff;
    text-align: center;
  }

  .my-header .text {
    margin-top: 5px;
    position: relative;
    font-weight: bold;
    font-size: 16px;
  }

  .my-header p {
    margin-top: 5px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }

  .my-header .bg {
    background: url("../../statics/images/thumb_raw_1493885990.jpeg");
    background-size: 100% 100%;
    opacity: 0.6;
    height: 100%;
    position: absolute;
    z-index: 0;
    width: 100%;
  }

  .my-header .vip {
    position: absolute;
    right: 10px;
    top: 15px;
  }

  .my-header .vip .mui-icon {
    color: #fef035;
    font-size: 16px;
    margin-right: 0;
  }

  .firstItem {
    margin-top: 0;
  }

  .avatar {
    z-index: 9;
    color: #ffffff;
    display: inline-block;
    margin-top: 24px;
    height: 116px;
    width: 116px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
    position: relative;
  }

  .avatar .avatarInner {
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
    border: 3px solid #d1d1d1;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .mui-table-view .mui-icon {
    vertical-align: middle;
    color: #587dd5;
    opacity: 0.5;
  }

  .footer {
    padding: 20px 40px 10px;
    text-align: center;
  }
  .logo{
    padding:20px;
  }
  .logo .myicon{
    width:185px;
    height:106px;
    opacity: 1;

  }

  .footer .copyright {
    font-size: 12px;

    color: #a6a6a6;
  }

  .version{
      position: relative;
      top:-40px;
    font-weight: bolder;
  }
</style>
