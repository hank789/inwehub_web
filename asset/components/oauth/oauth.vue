<template>
  <span @tap.stop.prevent="login('weixin')" v-show="isShowBtn">{{ content }}</span>
</template>

<script>
  import { postRequest } from '../../utils/request'

  export default{
    data () {
      return {
        oauth_services: {},
        oauth_waiting: null
      }
    },
    props: {
      content: {
        type: String,
        default: '绑定微信'
      },
      isShowBtn: {
        type: Boolean,
        default: true
      }
    },
    components: {},
    methods: {
      isInstalled (id) {
        if (id === 'qihoo' && window.mui.os.plus) {
          return true
        }
        if (window.mui.os.android) {
          var main = window.plus.android.runtimeMainActivity()
          var packageManager = main.getPackageManager()
          var PackageManager = window.plus.android.importClass(packageManager)
          var packageName = {
            'qq': 'com.tencent.mobileqq',
            'weixin': 'com.tencent.mm',
            'sinaweibo': 'com.sina.weibo'
          }
          try {
            return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES)
          } catch (e) {
          }
        } else {
          switch (id) {
            case 'qq':
              var TencentOAuth = window.plus.ios.import('TencentOAuth')
              return TencentOAuth.iphoneQQInstalled()
            case 'weixin':
              var WXApi = window.plus.ios.import('WXApi')
              return WXApi.isWXAppInstalled()
            case 'sinaweibo':
              var SinaAPI = window.plus.ios.import('WeiboSDK')
              return SinaAPI.isWeiboAppInstalled()
            default:
              break
          }
        }
      },
      login (id) {
        if (!window.mui.os.plus) {
          window.mui.alert('仅支持app')
          return
        }

        var self = this

        var auth = this.oauth_services[id]
        if (auth) {
          var w = null

          if (window.plus.os.name === 'Android') {
            w = window.plus.nativeUI.showWaiting()
          }

          document.addEventListener('pause', function () {
            setTimeout(function () {
              w && w.close()
              w = null
            }, 2000)
          }, false)
          auth.login(() => {
            w && w.close()
            w = null
            console.log(JSON.stringify(auth.authResult))
            auth.getUserInfo(function () {
              console.log('获取用户信息成功：')
              var nickname = auth.userInfo.nickname || auth.userInfo.name || auth.userInfo.miliaoNick
              postRequest(`oauth/weixinapp/callback`, {
                openid: auth.authResult.openid,
                nickname: nickname,
                avatar: auth.userInfo.headimgurl,
                access_token: auth.authResult.access_token,
                refresh_token: auth.authResult.refresh_token,
                expires_in: auth.authResult.expires_in,
                scope: auth.authResult.scope,
                full_info: auth.userInfo
              }).then(response => {
                var code = response.data.code

                if (code === 1113) {
                  window.mui.alert('该微信号已经绑定过其他InweHub账号，请更换其他微信账号绑定。如有疑惑请联系客服小哈 <a href="mailto:hi@inwehub.com" class="mailLink">hi@inwehub.com</a>', null, '知道了', null, 'div')
                  return
                }

                if (code !== 1000) {
                  window.mui.alert(response.data.message)
                  return
                }

                // 如果返回token有值，则登陆成功，如果为null，走注册流程
                var token = response.data.data.token
                console.log('获取微信信息成功: token:' + token + ', openid:' + auth.authResult.openid)
                self.$emit('success', token, auth.authResult.openid)
              })
            }, function (e) {
              self.$emit('fail', '获取用户信息失败： [' + e.code + ']：' + e.message)
            })
          }, function (e) {
            w && w.close()
            w = null
            console.log('[' + e.code + ']：' + e.message)
            self.$emit('fail', '获取用户信息失败： [' + e.code + ']：' + e.message)
          })
        } else {
          console.log('无效的登录认证通道！')
          self.$emit('fail', '无效的登录认证通道')
        }
      },
      logout (auth) {
        auth.logout(function () {
          console.log('注销"' + auth.description + '"成功')
        }, function (e) {
          console.log('注销"' + auth.description + '"失败：' + e.message)
        })
      }
    },
    mounted () {
      window.mui.plusReady(() => {
        if (window.mui.os.plus) {
          // 获取登录认证通道
          window.plus.oauth.getServices((services) => {
            for (var i in services) {
              var service = services[i]
              if (service.id === 'weixin') {
                this.oauth_services[service.id] = service
                var isInstalled = this.isInstalled(service.id)
                if (!isInstalled) {
                  // plus.nativeUI.toast('您尚未安装微信客户端');
                  return
                }
              }
            }
          }, function (e) {
            console.log('获取登录认证失败：' + e.message)
          })
        }
      })
    }
  }
</script>

