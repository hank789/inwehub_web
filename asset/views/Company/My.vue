<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="goBack()"></a>
      <h1 class="mui-title">InweHub企业版</h1>
    </header>

    <div class="mui-content" v-show="!loading">

      <div class="basic">
        <div class="header">
          <div class="avatar">
            <div class="avatarInner">
              <img :src="user.info.avatar_url"/>
            </div>
          </div>
        </div>

        <div class="realname">
          {{ user.info.name }}
        <i class="separate"></i>
          {{ user.info.title }}

        </div>
        <div class="company">
          {{ user.info.company }}

        </div>
        <div class="authentication">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-weirenzheng" v-if="user.info.company_status === 0"></use>
            <use xlink:href="#icon-zhengzaishenhe" v-else-if="user.info.company_status === 1"></use>
            <use xlink:href="#icon-check-circle" v-else-if="user.info.company_status === 2"></use>
            <use xlink:href="#icon-times" v-else-if="user.info.company_status === 3"></use>
          </svg>
          {{ getRenzhengText(user.info.company_status) }}
        </div>
        <div class="buttonWrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @tap.stop.prevent="$router.push('/company/help')" v-show="user.info.company_status === 0">认证企业版
          </button>
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @tap.stop.prevent="$router.push('/company/help')" v-show="user.info.company_status === 3">重新认证
          </button>
        </div>
        <div class="line"></div>
        <div class="infos">
          <div class="info"><span>手机：</span>{{ user.info.mobile }}</div>
          <div class="info"><span>邮箱：</span>{{ user.info.email }}</div>
          <div class="info"><span>地址：</span>{{ user.info.address_detail }}</div>
        </div>
      </div>

      <div class="river"></div>

      <div class="nav">
        <div class="navWrapper mui-row">

          <div class="item mui-col-sm-6 mui-col-xs-6" @tap.stop.prevent="goSubmitRequirement()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg>
            <div>发布需求</div>
          </div>
          <div class="line"></div>
          <div class="item mui-col-sm-6 mui-col-xs-6" @tap.stop.prevent="goRequirement()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xuqiuguanli"></use>
            </svg>
            <div>需求管理</div>
          </div>
        </div>
      </div>

      <div class="river"></div>

      <div class="moreWrapper">
        <div class="more">
          <a class="mui-navigate-right" href="javascript:void(0);"
             @tap.stop.prevent="$router.pushPlus('/my')">切换至个人页面</a>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'

  export default {
    data () {
      return {
        loading: 1,
        user: {
          info: {}
        }
      }
    },
    computed: {},

    methods: {
      goBack () {
        if (this.$route.query.back) {
          this.$router.pushPlus(this.$route.query.back)
        } else {
          this.$router.pushPlus('/home')
        }
      },
      goSubmitRequirement () {
        if (this.user.info.company_status === 0 || this.user.info.company_status === 3) {
          this.$router.push('/company/help')
        } else if (this.user.info.company_status === 1) {
          this.$router.push('/company/success?type=waiting')
        } else {
          this.$router.pushPlus('/project/basic')
        }
      },
      goRequirement () {
        if (this.user.info.company_status === 0 || this.user.info.company_status === 3) {
          this.$router.push('/company/help')
        } else if (this.user.info.company_status === 1) {
          this.$router.push('/company/success?type=waiting')
        } else {
          this.$router.push('/project/list')
        }
      },
      getRenzhengText (status) {
        switch (status) {
          case 0:
            return '企业未认证'
          case 1:
            return '审核中'
          case 2:
            return '认证成功'
          case 3:
            return '认证失败'
        }
      },
      initData () {
        postRequest(`profile/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.user = response.data.data

          if (this.user.info) {
            localEvent.setLocalItem('companyStatus', {status: this.user.info.company_status})
          }
          this.loading = false
        })
      }
    },
    mounted () {

    },
    created () {
      // showInwehubWebview();
      this.initData()
    }
  }
</script>

<style scoped="scoped">
  .mui-content {
    background: #fff;
  }

  .basic .header {
    height: 8rem;
    margin-top: 2rem;
  }

  .basic .separate {
    display: inline-block;
    position: relative;
    top: 0.2rem;
    height: 1.4rem;
    width: 0.1rem;
    margin: 0 0.5rem;
    border-left: 0.1rem solid #c8c8c8;
  }

  .basic {
    text-align: center;
    font-size: 1.4rem;
    background: #fff;
    padding: 0 1.5rem;
  }

  .basic .realname {
    color: #808080;

  }

  .basic .company {
    font-size: 1.6rem;
    color: #444;
    font-weight: 500;
    margin: 0.8rem 0 0.8rem;
  }

  .basic .authentication {
    color: #444;
    margin-bottom: 1.1rem;
  }

  .basic .authentication .icon {
    color: #03aef9;
    margin-right: 0.5rem;
  }

  .basic .buttonWrapper {
    padding: 0 35%;
    margin-bottom: 1.5rem;
  }

  .basic .buttonWrapper .mui-btn-primary {
    background: #03aef9;
    border: 0.1rem solid #03aef9;
    padding: 0.6rem 0;
    font-size: 1.4rem;
  }

  .basic .line {
    position: relative;
  }

  .basic .line:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.1rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .basic .infos {
    text-align: left;
    padding: 1.5rem 0;
  }

  .basic .infos span {
    color: #808080;
  }

  .basic .infos .info {
    padding: 0.5rem 0;
  }

  .river {
    height: 1rem;
    background: #ececee;
  }

  .nav {
    padding: 2rem 1.6rem;

  }

  .nav .navWrapper {
    position: relative;
    background: #f3f4f6;
    font-size: 1.4rem;
    color: #808080;
  }

  .nav .navWrapper .line {
    position: absolute;
    left: 50%;
    top: 1rem;
    bottom: 1rem;
    width: 0.1rem;
    background: #dcdcdc;
  }

  .nav .navWrapper .item {
    display: inline-block;
    text-align: center;
    width: 50%;
    padding: 2rem 0 1.7rem;
  }

  .nav .navWrapper .item .icon {
    font-size: 3rem;
    color: #03aef9;
    margin-bottom: 0.3rem;
  }

  .avatar {
    position: absolute;
    left: 50%;
    margin-left: -34.0.5rem;

    z-index: 9;
    color: #ffffff;
    display: inline-block;
    height: 6.9rem;
    width: 6.9rem;
    font-size: 2rem;
    text-align: center;
    border-radius: 50%;
    vertical-align: top;
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
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .more {
    position: relative;
    background: #fff;
  }

  .more a {
    display: inline-block;
    padding: 1rem 1.5rem 1.3rem;
    font-size: 1.4rem;
    color: #808080;
    width: 100%;
  }

  .more a:after {
    font-size: 2.2rem;
    right: 0.8rem;
  }

  .more:after {
    position: absolute;
    right: 1.5rem;
    bottom: 0;
    left: 1.5rem;
    height: 0.1rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .moreWrapper {
    padding-bottom: 1rem;
    background: #fff;
  }
</style>
