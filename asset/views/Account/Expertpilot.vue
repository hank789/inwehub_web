<template>
  <div>
    <div class="bmpreplace"></div>
  <div class="mui-content absolute">
    <div class="header">
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
    </div>
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
    <div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>
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
  .bmpreplace{
    background: #ececee;
  }

  .header {
    width: 100%;
    height: 18.5rem;
    background: #ececee;
  }

  .header a {
    color: #808080;
    position: absolute;
    top: 2.3rem;
    left: 1.6rem;
  }
  .expertExplanation {
    width: 100%;
    height: 18.5rem;
    padding-top: 4.3rem;
  }
  .expertSign{
    text-align: center;
  }
   .expertSign span{
    width: 100%;
    font-size: 2rem;
    color:#444444;
    font-weight: 500;
    margin-top: 4.3rem;
  }
   .expertSign svg{
    font-size: 2.8rem;
    color: #fcc816;
    margin-bottom: -0.3rem;
  }
  .expertExplanation li{
     text-align: center;
     margin-top: 0.7rem;
     overflow: hidden;
  }
  .expertExplanation li:nth-of-type(1){
    margin-top: 1.8rem;
  }
  .expertExplanation li p:nth-of-type(1){
    width:1.8rem;
    height:1.8rem;
    background: #FFFFFF;
    border:0.1rem solid #dcdcdc;
    display: inline-block;
    margin-bottom: -0.4rem;
    position: relative;
    right:1rem;
  }
  .expertExplanation li p:nth-of-type(1) svg{
      color:#03aef9;
      font-size: 1.5rem;
      position: absolute;
      left:0;
      right:0;
      top:0;
      bottom:0;
      margin: auto;
  }
  .expertExplanation li p:nth-of-type(2){
    display: inline-block;
    font-size:1.4rem;
    color:#323232;
  }

  /*内容区域*/
  .guideExplain{
    margin-top: 3rem;
    padding: 0 8.8%;
  }
  .platformExplain{
    font-size:1.6rem;
    color:#444444;
    text-align: center;
    margin-bottom: 2.6rem;
  }
  .guideExplain li p:nth-of-type(1){
    font-size:1.4rem;
    color:#444444;
    line-height: 2rem;
  }
  .guideExplain li p:nth-of-type(1) i{
    display: inline-block;
    width:0.6rem;
    height:0.6rem;
    background:#808080;
    border-radius: 50%;
    margin-bottom: 0.3rem;
    margin-right: 0.8rem;;
  }
  .guideExplain li:nth-of-type(2){
    margin-top: 2.3rem;
  }
  .guideExplain li p:nth-of-type(2){
    font-size:1.2rem;
    color:#808080;
    line-height: 1.8rem;
    margin-top: 0.5rem;
  }

  /*联系我们*/
  .contact {
    width: 100%;
    text-align: center;
    margin-top:1.2rem;
  }

  .contact p {
    font-size: 1.2rem;
    color: #808080;
    line-height: 1.7rem;
  }

  .home-apply {
    width: 91%;
    height: 4.1rem;
    margin-left: 4.5%;
    border-radius: 0.5rem;
    background: #03aef9;
    text-align: center;
    line-height: 4.1rem;
    color: #f2f2f2;
    font-size: 1.6rem;
    margin-top:3.7rem;

  }
</style>
