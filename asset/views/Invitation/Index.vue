<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">邀请注册</h1>
    </header>
    <div class="mui-content">
      <div class="Invitation_t">
        <img src="../../statics/images/invitation-register.png" class="Invitation_img"/>
      </div>

      <div class="invitation-information">
        <li @tap.stop.prevent="$router.pushPlus('/invitation/friends')">
          <p>{{invited_users}}位</p>
          <p>已成功邀请</p>
          <span>查看</span>
        </li>
        <li>
          <p>{{rewardMoney}}元</p>
          <p>已获得奖励</p>
        </li>
      </div>
      <!--呼朋唤友-->
      <div class="contactFriends border-football">
        <div class="contactBtn">
          <p @tap.stop.prevent="share()">呼朋唤友</p>
          <img src="../../statics/images/money@3x.png"/>
        </div>
        <span>即可获得好友平台支付或收益5%分红</span>
        <span @tap.stop.prevent="warn()">了解平台上可获取的收益 ></span>
        <!--<span>2.2018.2.1-2018.2.28期间累计邀请8人及以上，</span>-->
        <!--<span>即可获得抽奖资格，月底抽取iphoneX。</span>-->
        <!--<span>已邀请<i>{{invitedUsersCount}}</i>人</span>-->
        <!--<p class="luckDraw" v-if="invitedUsersCount < 8"  >抽奖</p>-->
        <!--<p class="luckDraw red" @tap.stop.prevent="luckDraw()" v-else>抽奖</p>-->
      </div>
      <!--邀请说明-->
      <div class="invitationNote">
        <p>被邀请好友可享注册大礼包</p>
        <p>（现金奖励-可用于付费围观等）</p>
        <p>点击呼朋唤友并分享链接，既是同意 <u @tap.stop.prevent="$router.pushPlus('/protocol/invitation')">邀请活动规则</u></p>
      </div>
    </div>

    <Share
      ref="ShareBtn"
      :title="shareOption.title"
      :shareName="shareOption.shareName"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :DomConvertImage="true"
      :targetId="rcCode"
      :targetType="'invite_register'"
      @success="shareSuccess"
      :DomConvertImageId="'shareContentWrapper'"
      @fail="shareFail"
    ></Share>

  </div>
</template>

<script>
  import Share from '../../components/Share.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import { getInvitation } from '../../utils/shareTemplate'
  import { postRequest } from '../../utils/request'
  import userAbility from '../../utils/userAbility'

  const Index = {
    data: () => ({
      shareOption: {
        title: '',
        shareName: '邀请注册分享',
        link: '',
        content: '',
        imageUrl: '',
        thumbUrl: '',
        invitation: {}
      },
      invitedUsersCount: 0,
      rewardMoney: '--',
      rcCode: '',
      id: 0,
      invited_users: '--',
      loading: true
    }),
    mounted () {
    },
    components: {
      Share
    },
    computed: {},
    methods: {
      luckDraw () {
        document.querySelector('.mui-content').style.position = 'absolute'
        userAbility.luckDraw(this, this.invitation)
      },
      // 警告框
      warn () {
        var title = '<p style="font-size:0.426rem; color: ##444444; margin-bottom:0.4rem">' + '获取收益说明' + '</p>'
        var font = '<p style="text-align: left; font-size:0.373rem; color: rgb(68,68,68); margin: 0;">' +
          '支付（个人）：' + '</p>' +
          '<p style="text-align: left; font-size:0.373rem; color:rgb(128,128,128); margin: 0; ">' +
          '咨询费用 内容围观 有偿服务 会员购买 ' + '</p>' +
          '<p style="text-align: left; font-size:0.373rem; rgb(68,68,68); margin: 0;">' +
          '支付（企业）：' + '</p>' +
          '<p style="text-align: left; font-size:0.373rem; color:rgb(128,128,128); margin: 0;">' +
          '服务购买 项目结款 实施费用 咨询费用 合作费用' + '</p>' +
          '<p style="text-align: left; font-size:0.373rem; rgb(68,68,68); margin-top: 0.533rem; margin-bottom: 0">' +
          '收益（个人）：' + '</p>' +
          '<p style="text-align: left; font-size:0.373rem; color:rgb(128,128,128); margin: 0;">' +
          '解答收益 围观收益 服务收益 项目收益 实施收益 咨询收益 合作收益 任务收益' + '</p>' +
          '<p style="text-align: left; font-size:0.373rem; color:rgb(128,128,128); margin-top: 0.533rem; margin-bottom: 0">' +
          '*个人分成奖励累积超过5万元，平台可能会代征缴个税，5万元以下请自行主动申报' + '</p>' +
          '<p style="text-align: left; font-size:0.373rem; color:rgb(128,128,128); margin-top: 0.533rem; margin-bottom: 0">' +
          '*为相应配合国家税务总局，平台会根据相关部分要求，向其提供个人收益分红记录。' + '</p>'

        // var btnArray = ['取消', '确认'];
        window.mui.alert(font, title, function () {}, 'div')
      },
      getDetail () {
        postRequest('activity/inviteRegister/introduce', {rc_code: this.rcCode})
          .then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }
            this.invitation = response.data.data
            this.invitedUsersCount = response.data.data.current_month_invited_users
            this.rewardMoney = response.data.data.reward_money
            this.invited_users = response.data.data.invited_users
          })
      },
      share () {
        this.$refs.ShareBtn.share()
      },
      shareSuccess () {

      },
      shareFail () {
      }
    },
    created () {
      var user = getLocalUserInfo()
      this.rcCode = user.rc_code || 0
      this.shareOption = getInvitation(user.name, this.rcCode)
      this.getDetail()
    }
  }
  export default Index
</script>

<style scoped>
  /*清除样式*/
  div, ul, li, p, span, a, i {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .mui-content {
    background: #FFFFFF;
  }

  .Invitation_t {
    width: 100%;
    /*height:8.586rem;*/
    background: #FFFFFF url("../../statics/images/invitation-bg@2x.png") no-repeat;
    background-size: 100% 90%;
    position: relative;
  }

  .Invitation_img {
    width: 95%;
    /*height:7.2rem;*/
    position: absolute;
    bottom: 0rem;
    left: 0;
    right: 0;
    margin: auto;
    animation: mymove 1s infinite;
    -moz-animation: mymove 1s infinite; /* Firefox */
    -webkit-animation: mymove 1s infinite; /* Safari and Chrome */
    -o-animation: mymove 1s infinite; /* Opera */
    animation-direction: alternate;
    -webkit-animation-direction: alternate;
  }

  @keyframes mymove {
    0% {
      bottom: 0rem;
    }
    50% {
      bottom: 0.133rem;
    }
    100% {
      bottom: 0rem;
    }
  }

  @-moz-keyframes mymove /* Firefox */
  {
    0% {
      bottom: 0rem;
    }
    50% {
      bottom: 0.133rem;
    }
    100% {
      bottom: 0rem;
    }
  }

  @-webkit-keyframes mymove /* Safari and Chrome */
  {
    0% {
      bottom: 0rem;
    }
    50% {
      bottom: 0.133rem;
    }
    100% {
      bottom: 0rem;
    }
  }

  @-o-keyframes mymove /* Opera */
  {
    0% {
      bottom: 0rem;
    }
    50% {
      bottom: 0.133rem;
    }
    100% {
      bottom: 0rem;
    }
  }

  /*　邀请成功的信息部分*/
  .invitation-information {
    width: 100%;
    height: 2.36rem;
    /*border: 0.026rem solid #cccccc;*/
    background: #FFFFFF;
    margin:0.266rem 0;
    padding: 0rem 0.666rem;
  }

  .invitation-information li:nth-of-type(1) {
    /*width: 42%;*/
    height: 100%;
    float: left;
    background: url("../../statics/images/invitationNumber@3x.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
  }

  .invitation-information li:nth-of-type(2) {
    /*width: 36%;*/
    height: 100%;
    float: right;

    background: url("../../statics/images/rewardNumber@3x.png") no-repeat;
    background-size: 100% 100%;
  }

  .invitation-information li p:nth-of-type(1) {
    font-size: 0.4rem;
    color: #444444;
    margin-top: 0.586rem;
    text-align: center;
  }

  .invitation-information li p:nth-of-type(2) {
    font-size: 0.373rem;
    color: #808080;
    text-align: center;
  }

  .invitation-information li span {
    font-size: 0.346rem;
    color: #FFFFFF;
    position: absolute;
    right: 0;
    right: 5%;
    top: 23%;

  }

  /*呼朋唤友*/

  .contactFriends {
    width: 95%;
    height: 2.266rem;
    margin-left: 2.5%;
    margin-top: 1.066rem;
    position: relative;
  }
  .contactFriends:after{
    border-radius:2.266rem;
  }

  .contactFriends span {
    display: block;
    text-align: center;
    font-size: 0.373rem;

  }

  .contactFriends span:nth-of-type(1) {
    color: #444444;
    padding-top: 0.76rem;
  }

  .contactFriends span:nth-of-type(2) {
    color: #03aef9;
    margin-top: 0.106rem;
  }
  .contactFriends span:nth-of-type(3) {
    color: #444444;
    margin-top: 0.373rem;
  }
  .contactFriends span:nth-of-type(5) {
    color: #808080;
    margin-top: 0.106rem;
    margin-bottom: 0.32rem;
  }
  .contactFriends span:nth-of-type(5) i{
    font-style: normal;
    color: #03aef9;
  }
  .contactFriends .luckDraw{
    width:1.653rem;
    height:0.72rem;
    background: #dcdcdc;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.72rem;
    margin: 0 auto;
    font-size:0.373rem;
    color: #b4b4b6;
  }
  .luckDraw.red{
    background: #fa4975;
    color: #ffffff;
  }
  .contactBtn {
    position: absolute;
    width: 4rem;
    height: 1.413rem;
    top: -0.8rem;
    left: 0;
    right: 0;
    margin: auto

  }

  /*动画效果*/
  .contactBtn p {
    width: 100%;
    height: 100%;
    background: #03aef9;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 1.413rem;
    color: #FFFFFF;
    font-size: 0.48rem;
    font-weight: 500;
    z-index: 999;
    position: absolute;
    animation: myrotate  1s infinite;
    -moz-animation: myrotate 1s infinite; /* Firefox */
    -webkit-animation: myrotate  1s infinite; /* Safari and Chrome */
    -o-animation: myrotate  1s infinite; /* Opera */
    animation-direction: alternate;
    -webkit-animation-direction: alternate;

  }

  @keyframes myrotate
  {
  0% {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
    -o-transform: rotate(0deg);
  }
  50% {
    transform: rotate(3deg);
    -ms-transform: rotate(3deg); /* IE 9 */
    -moz-transform: rotate(3deg); /* Firefox */
    -webkit-transform: rotate(3deg); /* Safari 和 Chrome */
    -o-transform: rotate(3deg);
  }
  100% {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
    -o-transform: rotate(0deg);
  }
  }

  @-moz-keyframes myrotate /* Firefox */
  {
    0% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg); /* IE 9 */
      -moz-transform: rotate(0deg); /* Firefox */
      -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
      -o-transform: rotate(0deg);
    }
    50% {
      transform: rotate(3deg);
      -ms-transform: rotate(3deg); /* IE 9 */
      -moz-transform: rotate(3deg); /* Firefox */
      -webkit-transform: rotate(3deg); /* Safari 和 Chrome */
      -o-transform: rotate(3deg);
    }
    100% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg); /* IE 9 */
      -moz-transform: rotate(0deg); /* Firefox */
      -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
      -o-transform: rotate(0deg);
    }
  }

  @-webkit-keyframes myrotate /* Safari and Chrome */
  {
    0% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg); /* IE 9 */
      -moz-transform: rotate(0deg); /* Firefox */
      -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
      -o-transform: rotate(0deg);
    }
    50% {
      transform: rotate(3deg);
      -ms-transform: rotate(3deg); /* IE 9 */
      -moz-transform: rotate(3deg); /* Firefox */
      -webkit-transform: rotate(3deg); /* Safari 和 Chrome */
      -o-transform: rotate(3deg);
    }
    100% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg); /* IE 9 */
      -moz-transform: rotate(0deg); /* Firefox */
      -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
      -o-transform: rotate(0deg);
    }
  }


  @-o-keyframes myrotate /* Opera */
  {
    0% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg); /* IE 9 */
      -moz-transform: rotate(0deg); /* Firefox */
      -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
      -o-transform: rotate(0deg);
    }
    50% {
      transform: rotate(5deg);
      -ms-transform: rotate(5deg); /* IE 9 */
      -moz-transform: rotate(5deg); /* Firefox */
      -webkit-transform: rotate(5deg); /* Safari 和 Chrome */
      -o-transform: rotate(5deg);
    }
    100% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg); /* IE 9 */
      -moz-transform: rotate(0deg); /* Firefox */
      -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
      -o-transform: rotate(0deg);
    }
  }



  .contactBtn img {
    width: 1.093rem;
    height: 0.773rem;
    position: absolute;
    left: -0.4rem;
    top: 0.613rem;
  }

  /*邀请说明*/
  .invitationNote {
    margin-top: 0.546rem;
    margin-bottom: 0.773rem;
    text-align: center;
    overflow: hidden;
  }

  .invitationNote p:nth-of-type(1) {
    font-size: 0.426rem;
    color: #444444;

  }

  .invitationNote p:nth-of-type(2) {
    font-size: 0.373rem;
    color: #808080;

  }

  .invitationNote p:nth-of-type(3) {
    font-size: 0.32rem;
    color: #808080;
    margin-top: 0.613rem;

  }

  .invitationNote p:nth-of-type(3) u {
    font-size: 0.32rem;
    color: rgb(68, 68, 68);
  }

  /* 适配*/
  @media (min-width: 320px) {
    .Invitation_img {
      height: 6.4rem;
    }

    .Invitation_t {
      height: 7.466rem;
    }

    .invitation-information li:nth-of-type(1) {
      width: 48%;
    }

    .invitation-information li:nth-of-type(2) {
      width: 40%;
    }

  }

  @media (min-width: 375px) {
    .Invitation_img {
      height: 7.466rem;
    }

    .Invitation_t {
      height: 8.533rem;
    }

    .invitation-information li:nth-of-type(1) {
      width: 42%;
    }

    .invitation-information li:nth-of-type(2) {
      width: 36%;
    }

  }

  @media (min-width: 414px) {
    .Invitation_img {
      height: 8rem;
    }

    .Invitation_t {
      height: 9.333rem;
    }

    .invitation-information li:nth-of-type(1) {
      width: 42%;
    }

    .invitation-information li:nth-of-type(2) {
      width: 36%;
    }
  }

</style>
