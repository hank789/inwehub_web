<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">图片预览</h1>
    </header>
    <div class="mui-content absolute">

    </div>

    <Share
      ref="ShareBtn"
      :title="shareOption.title"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :ImagePreview="true"
      :DomConvertImage="true"
      @success="shareSuccess"
      :DomConvertImageId="'shareContentWrapper'"
      @fail="shareFail"
    ></Share>

    <Images></Images>
  </div>
</template>

<script>
  import Share from '../../components/Share.vue'
  import Images from '../../components/invitation/image.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import { getInvitation } from '../../utils/shareTemplate'
  import { postRequest } from '../../utils/request'

  const Index = {
    data: () => ({
      shareOption: {
        title: '',
        link: '',
        content: '',
        imageUrl: '',
        thumbUrl: ''
      },
      invitedUsersCount: '--',
      rewardMoney: '--',
      rcCode: '',
      id: 0,
      loading: true
    }),
    mounted () {
    },
    components: {
      Share,
      Images
    },
    computed: {},
    methods: {
      // 警告框
      warn () {
        var title = '<p style="font-size:16px; color: ##444444; margin-bottom:15px">' + '获取收益说明' + '</p>'
        var font = '<p style="text-align: left; font-size:14px; color: rgb(68,68,68); margin: 0;">'+
          '支付（个人）：' + '</p>' +
          '<p style="text-align: left; font-size:14px; color:rgb(128,128,128); margin: 0; ">' +
          '咨询费用 内容围观 有偿服务 会员购买 ' + '</p>' +
          '<p style="text-align: left; font-size:14px; rgb(68,68,68); margin: 0;">' +
          '支付（企业）：' + '</p>' +
          '<p style="text-align: left; font-size:14px; color:rgb(128,128,128); margin: 0;">' +
          '服务购买 项目结款 实施费用 咨询费用 合作费用' + '</p>' +
          '<p style="text-align: left; font-size:14px; rgb(68,68,68); margin-top: 20px; margin-bottom: 0">' +
          '收益（个人）：' + '</p>' +
          '<p style="text-align: left; font-size:14px; color:rgb(128,128,128); margin: 0;">' +
          '解答收益 围观收益 服务收益 项目收益 实施收益 咨询收益 合作收益 任务收益' + '</p>' +
          '<p style="text-align: left; font-size:14px; color:rgb(128,128,128); margin-top: 20px; margin-bottom: 0">' +
          '*个人分成奖励累积超过5万元，平台可能会代征缴个税，5万元以下请自行主动申报' + '</p>' +
          '<p style="text-align: left; font-size:14px; color:rgb(128,128,128); margin-top: 20px; margin-bottom: 0">' +
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
            this.invitedUsersCount = response.data.data.invited_users
            this.rewardMoney = response.data.data.reward_money
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
    /*border: 1px solid #cccccc;*/
    background: #FFFFFF;
    margin-top: 5px;
    padding: 0px 25px;
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
  .invitation-information li span {
    font-size: 13px;
    color: #FFFFFF;
    position: absolute;
    right:0;
    right: 5%;
    top: 23%;

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
    .invitation-information li:nth-of-type(1) {
      width: 48%;
    }
    .invitation-information li:nth-of-type(2) {
      width:40%;
    }

  }

  @media (min-width: 375px) {
    .Invitation_img {
      height: 270px;
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
      height: 280px;
    }

    .Invitation_t {
      height: 350px;
    }
    .invitation-information li:nth-of-type(1) {
      width: 42%;
    }
    .invitation-information li:nth-of-type(2) {
      width: 36%;
    }
  }

</style>
