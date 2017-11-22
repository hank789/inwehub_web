<template>
  <div class="mui-content absolute">
    <header>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <ul class="expertExplanation">
        <p  class="expertSign">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhuanjiabiaoji"></use>
          </svg>
          <span>认证专家</span>
        </p>
        <li>
          <p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gou"></use>
            </svg>
          </p>
          <p>全面开启平台功能，发挥个人价值</p>
        </li>
        <li>
          <p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gou"></use>
            </svg>
          </p>
          <p>参与对接企业资源，直接服务企业</p>
        </li>
        <li>
          <p>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gou"></use>
            </svg>
          </p>
          <p>展示打造个人品牌，建立商业模式</p>
        </li>
      </ul>
    </header>
    <ul class="guideExplain">
      <p class="platformExplain">如何才能成为平台认证专家？</p>
      <li>
        <p><i></i>您在企业咨询领域有10年以上专业经验，或在特定领域有所擅长</p>
        <p>请保证个人名片真实性及96%以上完整度，并维护“我的擅长”标签</p>
      </li>
      <li>
        <p><i></i>您在平台参与互动、展示实力并得到广泛关注和认可（问答、分享、活动话题参与等）</p>
        <p>平台活跃度等级长久保持L3及以上可申请，等级越高申请通过率越高</p>
      </li>
    </ul>


    <div class="home-apply" @tap.stop.prevent="ApplicationJudge()">立刻申请</div>
    <div class="contact">
      <p>如有疑问请联系</p>
      <p>邮箱：hi@inwehub.com/微信：hiinwe</p>
    </div>
  </div>
</template>

<script>
  // @tap.stop.prevent="$router.replace('/expert/apply')"
  import { getLocalUserInfo, getUserInfo } from '../../utils/user'
  import { USERS_APPEND } from '../../stores/types'
  import userAbilityCheck from '../../utils/userAbilityCheck'
  // userAbility.applyProfessor(this);

  var userInfo = getLocalUserInfo()
  export default {
    data () {
      return {
        loading: 1,
        percent: userInfo.account_info_complete_percent,
        expert_apply_status: 0
      }
    },
    methods: {
      // 判断资料的完善程度；
      ApplicationJudge () {
        if (userAbilityCheck.applyProfessor(this)) {
          this.$router.replace('/expert/apply')
        }
      },
      initData () {
        // 执行刷新
        console.log('refresh-my')
        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user)
          this.percent = user.info.account_info_complete_percent
          this.expert_apply_status = user.info.expert_apply_status

          switch (parseInt(this.expert_apply_status)) {
            case 0:
            case 3:
              this.loading = 0
              break
            case 2:
              window.mui.toast('您已经是专家')
              window.mui.back()
              break
            case 1:
              window.mui.toast('认证审核中')
              window.mui.back()
              break
          }
        }))
      }
    },
    mounted () {
      console.log(userInfo.account_info_complete_percent)
    },
    activated: function () {
      console.log('activated')
      this.initData()
    }
  }
</script>

<style scoped="scoped">
  div,
  span,
  ul,
  li,
  a,
  img,
  i,
  p {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .mui-content{
    background: #FFFFFF;
  }

  header {
    width: 100%;
    height: 185px;
    background: #ececee;
  }

  header a {
    color: #808080;
    position: absolute;
    top: 23px;
    left: 16px;
  }
  .expertExplanation {
    width: 100%;
    height: 185px;
    padding-top: 43px;
  }
  .expertSign{
    text-align: center;
  }
   .expertSign span{
    width: 100%;
    font-size: 20px;
    color:#444444;
    font-weight: 500;
    margin-top: 43px;
  }
   .expertSign svg{
    font-size: 28px;
    color: #fcc816;
    margin-bottom: -3px;
  }
  .expertExplanation li{
     text-align: center;
     margin-top: 7px;
     overflow: hidden;
  }
  .expertExplanation li:nth-of-type(1){
    margin-top: 18px;
  }
  .expertExplanation li p:nth-of-type(1){
    width:18px;
    height:18px;
    background: #FFFFFF;
    border:1px solid #dcdcdc;
    display: inline-block;
    margin-bottom: -4px;
    position: relative;
    right:10px;
  }
  .expertExplanation li p:nth-of-type(1) svg{
      color:#03aef9;
      font-size: 15px;
      position: absolute;
      left:0;
      right:0;
      top:0;
      bottom:0;
      margin: auto;
  }
  .expertExplanation li p:nth-of-type(2){
    display: inline-block;
    font-size:14px;
    color:#323232;
  }

  /*内容区域*/
  .guideExplain{
    margin-top: 30px;
    padding: 0 8.8%;
  }
  .platformExplain{
    font-size:16px;
    color:#444444;
    text-align: center;
    margin-bottom: 26px;
  }
  .guideExplain li p:nth-of-type(1){
    font-size:14px;
    color:#444444;
    line-height: 20px;
  }
  .guideExplain li p:nth-of-type(1) i{
    display: inline-block;
    width:6px;
    height:6px;
    background:#808080;
    border-radius: 50%;
    margin-bottom: 3px;
    margin-right: 8px;;
  }
  .guideExplain li:nth-of-type(2){
    margin-top: 23px;
  }
  .guideExplain li p:nth-of-type(2){
    font-size:12px;
    color:#808080;
    line-height: 18px;
    margin-top: 5px;
  }

  /*联系我们*/
  .contact {
    width: 100%;
    text-align: center;
    margin-top:12px;
  }

  .contact p {
    font-size: 12px;
    color: #808080;
    line-height: 17px;
  }

  .home-apply {
    width: 91%;
    height: 41px;
    margin-left: 4.5%;
    border-radius: 5px;
    background: #03aef9;
    text-align: center;
    line-height: 41px;
    color: #f2f2f2;
    font-size: 16px;
    margin-top:37px;

  }
</style>
