<template>
<div>
  <header class="mui-bar mui-bar-dark mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title">InweHub企业版</h1>
  </header>

  <div class="mui-content">

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
      <div class="authentication"><svg class="icon" aria-hidden="true" v-show="user.info.company_apply_status !== 2">
        <use xlink:href="#icon-weirenzheng"></use>
      </svg>{{ getRenzhengText(user.info.company_status) }}</div>
      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.push('/company/submit')" v-show="user.info.company_status === 0">认证企业版</button>
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

    <div class="more">
      <a class="mui-navigate-right" href="javascript:void(0);"  @tap.stop.prevent="$router.push('/my')">查看个人页面</a>
    </div>
  </div>

</div>
</template>

<script>
  import {apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export default {
    data(){
      return {
        loading: 1,
        user:{},
      }
    },
    computed: {
      nothing () {
         return false;
      },
    },
    methods: {
      goSubmitRequirement(){
          if (user.info.company_status === 0) {
             this.$router.push('/company/help');
          } else {
             this.$router.push('/company/help');
          }
      },
      goRequirement(){
        if (user.info.company_status === 0) {
          this.$router.push('/company/help');
        } else {
          this.$router.push('/company/help');
        }
      },
      nothing(){

      },
      getRenzhengText(status){
         switch(status) {
           case 0:
               return '企业未认证';
               break;
           case 1:
               return '审核中';
               break;
           case 2:
               return '认证成功';
               break;
           case 3:
               return '认证失败';
               break;
         }
      },
      initData() {
        postRequest(`profile/info`, {}).then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          this.user = response.data.data;

          this.loading = false;
        });
      }
    },
    mounted(){

    },
    created(){
       this.initData();
    }
  };
</script>

<style scoped="scoped">
  .mui-content{
    background: #fff;
    position: absolute;
    width:100%;
    top:0;
    left:0;
    bottom:0;
  }

  .basic .header {
    height:80px;
    margin-top:20px;
  }

  .basic .separate {
    display: inline-block;
    position: relative;
    top:2px;
    height: 14px;
    width:1px;
    margin: 0 5px;
    border-left: 1px solid #c8c8c8;
  }

  .basic {
    text-align: center;
    font-size:14px;
    background: #fff;
    padding:0 15px;
  }

  .basic .realname{
    color:#808080;

  }

  .basic .company{
    font-size:16px;
    color:#444;
    font-weight:500;
    margin:8px 0 8px;
  }

  .basic .authentication{
    color:#444;
    margin-bottom:11px;
  }

  .basic .authentication .icon{
    color:#03aef9;
    margin-right:5px;
  }

  .basic .buttonWrapper{
    padding:0 35%;
    margin-bottom:15px;
  }

  .basic .buttonWrapper .mui-btn-primary{
    background:#03aef9;
    border:1px solid #03aef9;
    padding:6px 0;
    font-size:14px;
  }

  .basic .line{
    position:relative;
  }

  .basic .line:after{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .basic .infos{
    text-align: left;
    padding:15px 0;
  }

  .basic .infos span{
    color:#808080;
  }

  .basic .infos .info{
    padding:5px 0;
  }

  .river{
    height:10px;
    background: #ececee;
  }

  .nav{
    padding:20px 16px;

  }
  .nav .navWrapper{
    position: relative;
    background: #f3f4f6;
    font-size:14px;
    color:#808080;
  }
  .nav .navWrapper .line{
    position: absolute;
    left:50%;
    top:10px;
    bottom:10px;
    width:1px;
    background: #dcdcdc;
  }
  .nav .navWrapper .item{
    display: inline-block;
    text-align: center;
    width:50%;
    padding:20px 0 17px;
  }

  .nav .navWrapper .item .icon{
    font-size:30px;
    color:#03aef9;
    margin-bottom:3px;
  }

  .avatar {
    position: absolute;
    left: 50%;
    margin-left: -34.5px;

    z-index: 9;
    color: #ffffff;
    display: inline-block;
    height: 69px;
    width: 69px;
    font-size: 20px;
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

  .more{
    position: relative;
  }

  .more a{
    display: inline-block;
    padding:10px 15px 13px;
    font-size:14px;
    color:#808080;
    width:100%;
  }
  .more a:after{
    font-size:22px;
    right:8px;
  }
  .more:after{
    position: absolute;
    right: 15px;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }
</style>
