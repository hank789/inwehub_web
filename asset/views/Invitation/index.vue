<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">邀请注册</h1>
    </header>
    <div class="mui-content absolute">
      <div class="Invitation_t ">
        <img src="../../statics/images/invitation-register.png" class="Invitation_img"/>
      </div>

      <div class="invitation-information">
        <li>
          <p>10位</p>
          <p>已成功邀请</p>
        </li>
        <li>
          <p>100元</p>
          <p>已获得奖励</p>
        </li>
      </div>
      <!--呼朋唤友-->
      <div class="contactFriends">
        <span>即可获得好友平台支付或收益5%分红</span>
        <span>了解平台上可获取的收益 ></span>
        <div class="contactBtn">
          <p>呼朋唤友</p>
          <img src="../../statics/images/money@3x.png"/>
        </div>
      </div>
      <!--邀请说明-->
      <div class="invitationNote">
        <p>被邀请好友可享注册大礼包</p>
        <p>（首次专业提问1元等特权）</p>
        <p>点击呼朋唤友并分享链接，既是同意 <u>邀请活动规则</u></p>
      </div>

    </div>

    <Share
      ref="ShareBtn"
      :title="shareOption.title"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :DomConvertImage="false"
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

  const Index = {
    data: () => ({
      shareOption: {
        title: '',
        link: '',
        content: '',
        imageUrl: '',
        thumbUrl: ''
      },
      rcCode: '',
      id: 0,
      loading: true
    }),
    mounted () {
      var user = getLocalUserInfo()
      this.rcCode = user.rc_code || 0
      this.shareOption = getInvitation(user.name, this.rcCode)
    },
    components: {
      Share
    },
    computed: {},
    methods: {
      shareSuccess () {

      },
      shareFail () {
      }
    },
    created () {}
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
    /*height:322px;*/
    background: #FFFFFF url("../../statics/images/invitation-bg@2x.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
  }

  .Invitation_img {
    width: 95%;
    /*height:270px;*/
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  /*　邀请成功的信息部分*/
  .invitation-information {
    width: 100%;
    height: 88.5px;
    border: 1px solid #cccccc;
    background: #FFFFFF;
    margin-top: 5px;
    padding: 0px 25px;
  }

  .invitation-information li:nth-of-type(1) {
    width: 42%;
    height: 100%;
    float: left;
    border: 1px solid #000000;
  }

  .invitation-information li:nth-of-type(2) {
    width: 36%;
    height: 100%;
    float: right;

    background: url("../../statics/images/rewardNumber@3x.png") no-repeat;
    background-size: 100% 100%;
  }

  .invitation-information li p:nth-of-type(1) {
    font-size: 15px;
    color: #444444;
    margin-top: 22px;
    text-align: center;
  }

  .invitation-information li p:nth-of-type(2) {
    font-size: 14px;
    color: #808080;
    text-align: center;
  }

  /*呼朋唤友*/

  .contactFriends {
    width: 95%;
    height: 85px;
    border: 1px solid #b4b4b6;
    border-radius: 85px;
    margin-left: 2.5%;
    margin-top: 40px;
    position: relative;
  }

  .contactFriends span {
    display: block;
    text-align: center;
    font-size: 14px;

  }

  .contactFriends span:nth-of-type(1) {
    color: #444444;
    margin-top: 29px;

  }

  .contactFriends span:nth-of-type(2) {
    color: #03aef9;
    margin-top: 4px;
  }

  .contactBtn {
    position: absolute;
    width: 150px;
    height: 53px;
    top: -30px;
    left: 0;
    right: 0;
    margin: auto

  }

  .contactBtn p {
    width: 100%;
    height: 100%;
    background: #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 53px;
    color: #FFFFFF;
    font-size: 18px;
    font-weight: 500;
    z-index: 999;
    position: absolute;
  }

  .contactBtn img {
    width: 41px;
    height: 29px;
    position: absolute;
    left: -15px;
    top: 23px;
  }

  /*邀请说明*/
  .invitationNote {
    margin-top: 20.5px;
    margin-bottom: 80px;
    text-align: center;
    overflow: hidden;
  }

  .invitationNote p:nth-of-type(1) {
    font-size: 16px;
    color: #444444;

  }

  .invitationNote p:nth-of-type(2) {
    font-size: 14px;
    color: #808080;

  }

  .invitationNote p:nth-of-type(3) {
    font-size: 12px;
    color: #808080;
    margin-top: 23px;

  }

  .invitationNote p:nth-of-type(3) u {
    font-size: 12px;
    color: rgb(68, 68, 68);
  }

  /* 适配*/
  @media (min-width: 320px) {
    .Invitation_img {
      height: 230px;
    }

    .Invitation_t {
      height: 280px;
    }

  }

  @media (min-width: 375px) {
    .Invitation_img {
      height: 270px;
    }

  }

  @media (min-width: 414px) {
    .Invitation_img {
      height: 280px;
    }

    .Invitation_t {
      height: 350px;
    }
  }

</style>
