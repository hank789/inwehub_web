<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">安全设置</h1>
    </header>

    <div class="mui-content" v-show="!loading">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <a class="mui-navigate">绑定手机<span
              class="mui-pull-right account-setting-field mui-ellipsis">{{ phone }}</span></a>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <div class="mui-navigate-right"><label>绑定微信</label><label
              class="mui-pull-right account-setting-field" @tap.stop.prevent="binded"
              v-if="isBindWeixin">{{ bindWeixinNickname }}</label><label v-else>
              <oauth @success="bindSuccess" class="mui-pull-right account-setting-field bind-warning"
                     :content="'前往绑定'"></oauth>
            </label></div>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'

  import oauth from '../../components/oauth/oauth.vue'

  export default {
    data: () => ({
      loading: 1,
      isBindWeixin: 0,
      bindWeixinNickname: '',
      phone: ''
    }),
    methods: {
      binded () {
        window.mui.alert('绑定后不可修改，如有问题请联系客服小哈 <a href="mailto:hi@inwehub.com" class="mailLink">hi@inwehub.com</a>', null, '知道了', null, 'div')
      },
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

          this.isBindWeixin = response.data.data.is_bind_weixin
          this.bindWeixinNickname = response.data.data.bind_weixin_nickname
          this.phone = response.data.data.user_phone
          this.loading = 0
        })
      }
    },
    mounted () {

    },
    components: {
      oauth
    },

    created () {
      this.getWallet()
    }
  }
</script>

<style scoped>
  .mui-input-row label {
    padding-right: 0;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 0.266rem;
  }

  .mui-input-row textarea {
    border: none !important;
  }

  .mui-input-row input {
    text-align: right;
    padding-right: 1.066rem;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 0.293rem 0.4rem;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 0.293rem 0.4rem;
  }

  .mui-table-view-cell {
    padding: 0.133rem 0;
  }

  .mui-table-view-cell .mui-navigate-right, .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  .account-setting-field {
    position: absolute;
    text-align: right;
    width: 5.333rem;
    right: 1.066rem;
    height: 0.853rem;
    color: #3f3f3f;
    padding-right: 0;
  }

  .bind-warning {
    color: #4990E2;
  }
</style>
