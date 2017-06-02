<template>

  <div>

    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <h1 class="mui-title">我的</h1>
      <a class="mui-icon myicon myicon-setup mui-pull-right" @tap.stop.prevent="$router.push('/setting')"></a>
    </header>

    <div class="mui-content">


      <div class="professor">
        <div class="avatar">
          <div class="avatarInner">
            <img :src="avatar" class="avatar"/>
          </div>
        </div>
        <div class="text">
          <div class="realname">{{ name }}</div>
          <div class="label" v-show="isExpert"><span class="mui-icon myicon myicon-gaojizhuanjia"></span>{{ expert_level }}</div>
          <div class="options">
            <div class="buttonAsk" @tap.stop.prevent="$router.push('/my/info')"><span>{{ account_info_complete_percent }}%</span> 编辑名片</div>
            <div class="collect" @tap.stop.prevent="shareOut"><span class="mui-icon myicon myicon-share"></span></div>
          </div>
        </div>
      </div>

      <div class="counter">
        <span class="level" @tap.stop.prevent="integralDemo">LV{{ user_level }}</span>
        <span class="grow" @tap.stop.prevent="integralDemo">成长值：{{ user_credits }}</span>
        <span class="integral" @tap.stop.prevent="integralDemo">哈币：{{ user_coins }}</span>
      </div>

      <div class="part2">
        <a class="item" @tap.stop.prevent="$router.push('/asks')">
          <span class="number">{{ questions }}</span><span>我的提问</span>
        </a>
        <a class="item" @tap.stop.prevent="$router.push('/answers')">
          <span class="number">{{ answers }}</span><span>我的回答</span>
        </a>
        <a class="item" @tap.stop.prevent="$router.push('/bid')">
          <span class="number">0</span><span>我的竞标</span>
        </a>
        <a  class="item"  @tap.stop.prevent="$router.push('/project')">
          <span class="number">{{ projects }}</span><span>我的项目</span>
        </a>
      </div>

      <ul class="mui-table-view mui-table-view-chevron firstItem">
        <li class="mui-table-view-cell">
          <a  class="mui-navigate-right" @tap.stop.prevent="$router.push('/my/finance')"><span class="mui-icon myicon myicon-wallet"></span>我的钱包
          </a>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right"><span class="mui-icon myicon myicon-coupon"></span>我的邀请码</a>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right" @tap.stop.prevent="integralDemo"><span class="mui-icon myicon myicon-huiyuan"></span>会员福利</a>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right"><span class="mui-icon myicon myicon-heart"></span>我的收藏</a>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right" @tap.stop.prevent="$router.push('/feedback')"><span class="mui-icon myicon myicon-help"></span>反馈建议
          </a>
        </li>
      </ul>

      <div class="mb70"></div>
    </div>

  </div>
</template>
<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND, USERS_APPEND} from '../../stores/types';
  import router from '../../routers/index';
  import {updateUserInfoCache, getUserInfo} from '../../utils/user';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        im_tokenMsg: '',
        name: currentUser.name,
        phone: currentUser.phone,
        avatar: currentUser.avatar_url,
        title: currentUser.title,
        company: currentUser.company,
        account_info_complete_percent: currentUser.account_info_complete_percent,
        isExpert: currentUser.is_expert,
        total_money: currentUser.total_money,
        user_level:currentUser.user_level,
        user_credits:currentUser.user_credits,
        user_coins:currentUser.user_coins,
        questions:currentUser.questions,
        answers:currentUser.answers,
        tasks:currentUser.tasks,
        projects:currentUser.projects,
        expert_level:currentUser.expert_level
      }
    },
    methods: {
      shareOut(){
          mui.alert('我们还暂时不建议您分享！');
      },
      integralDemo(){
          mui.alert('小哈正在帮大家争取福利，请再稍等一阵！');
      },
      getToken(){
        var im_token = JSON.parse(sessionStorage.getItem('im_token'))
        this.im_tokenMsg = im_token;
      }
    },
    created () {

      this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
        cb(user);
        this.account_info_complete_percent = user.info.account_info_complete_percent;
        this.isExpert = user.info.is_expert;
        this.user_level = user.info.user_level;
        this.user_credits = user.info.user_credits;
        this.user_coins = user.info.user_coins;
        this.questions = user.info.questions;
        this.answers = user.info.answers;
        this.tasks = user.info.tasks;
        this.projects = user.info.projects;
        this.expert_level = user.info.expert_level;
      }));
    },
    mounted(){
      this.getToken()
    }
  }

</script>

<style scoped>
  .mui-bar .myicon {
    width: 24px;
    height: 24px;
    right: 8px;
    top: 8px;
  }

  .professor {
    background-color: #161616;
    text-align: center;
    position: relative;
    height: 136px;
  }

  .professor .text {
    width: 65%;
    height: 100%;
    padding-top: 20px;
    padding-left: 0px;
    display: inline-block;
    color: #fff;
    text-align: left;

  }

  .professor .label {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 14px;
  }

  .professor .text .realname {
    font-size: 20px;
    font-weight: bolder;
    margin-left: 20px;
  }

  .professor .myicon-share{
    width:15px;
    height:16px;
  }

  .avatar {
    z-index: 9;
    color: #ffffff;
    display: inline-block;
    margin-top: 10px;
    height: 100px;
    width: 100px;
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

  .professor .options {
    position: relative;
    margin-top: 30px;
    margin-left: 10px;
  }

  .professor .buttonAsk {
    position: relative;
    display: inline-block;
    width: 60%;
    height: 37px;
    font-size: 14px;
    line-height: 37px;
    text-align: center;
    border: 1px solid #fff;
    border-radius: 50px;
    padding-left: 45px;
  }

  .professor .buttonAsk span {
    position: absolute;
    font-size: 20px;
    left: 10px;
    color: #F6A623;
  }

  .professor .label .myicon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 5px;

  }

  .professor .options .collect {
    display: inline-block;
    float: right;
    border: 1px solid #fff;
    border-radius: 50%;
    width: 37px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    margin-left: 15px;
  }

  .counter {
    height: 40px;
    line-height: 40px;
    position: relative;
    background: #fff;
    text-align: center;
    color: #4A4A4A;
  }

  .counter:after{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #D9D9D9;
  }

  .counter .level {
    line-height: 14px;
    display: inline-block;
    color: #fff;
    padding: 3px 10px;
    background: #000;
    border-radius: 5px;
  }

  .counter .grow {
    margin: 0 20px;
  }

  .part2 {
    height: 60px;
    text-align: center;
    background: #fff;
  }

  .part2 .item {
    display: inline-block;
    width: 23%;
    text-align: center;
    color: #777;
  }

  .part2 .item .number {
    padding-top: 10px;
    color: #161616;
    display: block;
    font-size: 20px;
  }

  .mui-table-view-cell .mui-icon {
    margin-right: 10px;
    width: 20px;
    vertical-align: bottom;
    height: 20px;
    position: relative;
    background-position: center;
  }

  .mui-navigate-right:after, .mui-push-right:after {
    color: #4a4a4a;
  }

  .mui-table-view-cell {
    color: #4A4A4A;
    padding-top: 13px;
    padding-bottom: 13px;

  }


</style>
