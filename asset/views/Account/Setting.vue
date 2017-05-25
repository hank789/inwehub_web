<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">设置与帮助</h1>
    </header>

    <div class="mui-content">

      <ul class="mui-table-view mui-table-view-chevron">

        <li class="mui-table-view-cell">
          消息与通知

          <div class="mui-switch mui-switch-mini mui-active">
            <div class="mui-switch-handle"></div>
          </div>
        </li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">

        <li class="mui-table-view-cell">
          <a href="javascript:void(0)" class="mui-navigate-right" @tap.stop.prevent="clearCache">清除缓存</a>
        </li>
      </ul>

      <ul class="mui-table-view mui-table-view-chevron">

        <li class="mui-table-view-cell">
          <router-link to="/feedback" class="mui-navigate-right">意见与反馈</router-link>
        </li>
        <li class="mui-table-view-cell">
          <router-link to="/about" class="mui-navigate-right">关于我们</router-link>
        </li>
        <li class="mui-table-view-cell">
          <a href="javascript:void(0)" class="mui-navigate-right" @tap.stop.prevent="starApp">前往评价</a>
        </li>
      </ul>

      <div class="mui-table-view">
        <div class="mui-table-view-cell footer">
          <button type="button" class="mui-btn-block mui-btn-primary" @tap.stop.prevent="logOut">
            退出应用

          </button>
          <div class="logo"></div>
          <div class="copyright">CopyRight By InweHub © V1.0.0</div>
        </div>

      </div>

    </div>

  </div>
</template>
<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND} from '../../stores/types';
  import router from '../../routers/index';
  import {apiRequest} from '../../utils/request';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        im_tokenMsg: '',
        name: currentUser.name,
        phone: currentUser.phone,
        avatar: currentUser.avatar_url,
        title: currentUser.title,
        company: currentUser.company
      }
    },
    methods: {
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

        router.push({path: 'login'});
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
        if (mui.os.ios) {
          location.href = 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=682211190&pageNumber=0&sortOrdering=2&type=&mt=8';
        } else if (mui.os.android) {
          plus.runtime.openURL("market://details?id=io.dcloud.HelloMUI", function(e) {
            plus.runtime.openURL("market://details?id=io.dcloud.HelloMUI", function(e) {
              mui.alert("360手机助手和应用宝，你一个都没装，暂时无法评分，感谢支持");
            }, "com.qihoo.appstore");
          }, "com.tencent.android.qqdownloader");
        }
      }
    },
    mounted(){
      mui('.mui-switch')['switch']();
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
    padding: 30px 40px;
    text-align: center;
  }

  .footer .copyright {
    font-size: 12px;
    color: #a6a6a6;
  }
</style>
