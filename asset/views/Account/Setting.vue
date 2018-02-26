<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">设置</h1>
    </header>

    <div class="mui-content">
      <ul>
        <li class="mui-wechat-hidden">
          <p>绑定微信</p>
          <span class="name" v-if="isBindWeixin">
             {{bindWeixinNickname}}
             <oauth class="wechatBind" @success="bindSuccess" :content="''" ></oauth>
          </span>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>

          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/findpassword')">
          <p>修改密码</p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/push/setting')"  class="mui-wechat-hidden">
          <p>推送设置</p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li  @tap.stop.prevent="$router.pushPlus('/help/question', 'list-detail-page-two')">
          <p>常见问题</p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="$router.pushPlus('/about', 'list-detail-page-two')">
          <p>关于我们</p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="starApp">
          <p>前往评价</p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
        <li @tap.stop.prevent="clearCache">
          <p>清除缓存</p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </li>
      </ul>
      <button type="button" class="mui-btn-block mui-btn-primary" @tap.stop.prevent="logOut" v-show="!isWeiXin()">
        退出应用
      </button>


      <div class="foot">
        <div class="logo">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-inwehubzuoyou"></use>
          </svg>
          <p>{{ appVersion }}</p>
        </div>

        <div class="text">
          <p>Copyright 2017 InweTech.</p>
          <p>All Rights Reserved</p>
        </div>
      </div>


    </div>
  </div>
</template>
<script>
  import localEvent from '../../stores/localStorage'
  import { TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND } from '../../stores/types'
  import oauth from '../../components/oauth/oauth.vue'
  import { postRequest, apiRequest } from '../../utils/request'

  export default {
    data () {
      const currentUser = localEvent.getLocalItem('UserInfo')

      return {
        bindWeixinNickname: '', // 绑定微信名称
        isBindWeixin: 0, // 是否绑定微信
        appVersion: '',
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
    components: {
      oauth
    },
    created () {
      var obj = localEvent.getLocalItem('app_version')
      if (obj) {
        if (window.mui.os.ios && obj.version) {
          this.appVersion = 'for iPhone V' + obj.version
        } else if (window.mui.os.android && obj.version) {
          this.appVersion = 'for android V' + obj.version
        }
      }
      // showInwehubWebview();
    },
    methods: {
      bindSuccess () {
        this.getWallet()
      },
      getWallet () {
        postRequest(`account/wallet`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          var data = response.data.data
          this.isBindWeixin = data.is_bind_weixin
          this.bindWeixinNickname = data.bind_weixin_nickname
        })
      },
      isWeiXin () {
        var ua = window.navigator.userAgent.toLowerCase()

        if (ua.match(/MicroMessenger/i) === 'micromessenger') {
          return true
        } else {
          return false
        }
      },
      // 清除缓存；
      clearCache () {
        localEvent.setLocalItem('lauchFlag', {showGuide: false})
        // 调用系统toast;
        window.mui.toast('清除成功')
      },
      clearUserCache () {
        localEvent.clearLocalItem('UserLoginInfo')
        localEvent.clearLocalItem('UserInfo')
        this.$store.dispatch(ASKS_LIST_APPEND, {})
        this.$store.dispatch(ANSWERS_LIST_APPEND, {})
        this.$store.dispatch(TASK_LIST_APPEND, {})
        this.$router.pushPlus('/login', '', true, 'none', 'none')
      },
      logOut () {
        if (window.mui.os.plus) {
          window.mui.plusReady(() => {
            var deviceInfo = window.plus.push.getClientInfo()
            apiRequest(`auth/logout`, {
              client_id: deviceInfo.clientid,
              device_token: deviceInfo.token,
              appid: deviceInfo.appid,
              appkey: deviceInfo.appkey,
              device_type: window.plus.os.name === 'iOS' ? 2 : 1
            }).then(res => {
              this.clearUserCache()
            })
          })
        } else {
          this.clearUserCache()
        }
      },
      starApp () {
        if (!window.plus) {
          window.mui.toast('仅app内可用')
          return
        }
        apiRequest(`system/app_market_url`, {}).then(responseData => {
          if (responseData !== false) {
            this.ios_market_url = responseData.ios_url
            this.android_market_url = responseData.android_url
            if (window.mui.os.ios) {
              window.plus.runtime.openURL(this.ios_market_url)
            } else if (window.mui.os.android) {
              window.plus.runtime.openURL(this.android_market_url, function (e) {
                window.mui.alert('很抱歉，您未安装腾讯应用宝，暂时无法评分，感谢支持')
              }, 'com.tencent.android.qqdownloader')
            } else {
              window.location.href = this.ios_market_url
            }
          }
        })
      }
    },
    mounted () {
      this.bindSuccess()
      window.mui('.mui-switch')['switch']()
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-setting')
      })
    }
  }

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

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
  }
   ul {
     width: 100%;
     overflow: hidden;
     padding: 0 4%;
     background: #ffffff;
   }
  ul li{
    width:100%;
    height: 4.4rem;
    position: relative;
    line-height: 4.4rem;
    /*display: flex;*/
    /*flex-direction: row;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
  }
  ul li p{
    float: left;
  }
  ul li svg{
    float: right;
    margin-top: 1.4rem;
  }
  ul li .name{
    float: right;
    font-size:1.4rem;
    color: #444444;
  }
  button{
    margin-top: 2rem;
    width:92%;
    height:4.4rem;
    margin-left: 4%;
    border-radius: 0.5rem;
  }
  .foot{
    width:100%;
    overflow: hidden;
    position: absolute;
    bottom: 2.9rem;

  }
  .logo{
    width:100%;
    overflow: hidden;
    text-align: center;
  }
  .logo svg{
    font-size: 15rem;
    margin-top: -3rem;
  }
  .logo p{
    font-size:1.4rem;
    color: #444444;
    margin-top: -5rem;
  }
  .text{
    width:100%;
    overflow: hidden;
    text-align: center;

  }
  .text p{
    font-size: 1.4rem;
    color: #b4b4b6;
  }
  /*.mui-plus-hidden, .mui-wechat-hidden {*/
    /*display: flex !important;*/
  /*}*/
  /*适配*/
  @media (min-width:32rem) {
    .text{
      margin-top: 1rem;
    }
  }
  @media (min-width:37.5rem) {
    .text{
      margin-top: 6.8rem;
    }
  }
  @media (min-width:41.4rem) {
    .text{
      margin-top: 6.8rem;
    }
  }
</style>
