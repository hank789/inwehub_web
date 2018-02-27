<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">图片预览</h1>
    </header>
    <div class="mui-content absolute">
      <Images ref="imagesCommponent" @imageMounted="imageMounted"></Images>
    </div>

    <Share
      ref="ShareBtn"
      :title="shareOption.title"
      :link="shareOption.link"
      :shareName="shareOption.shareName"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :ImagePreview="true"
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
  import Images from '../../components/invitation/image.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import { getInvitation } from '../../utils/shareTemplate'

  const Index = {
    data: () => ({
      shareOption: {
        title: '',
        link: '',
        content: '',
        imageUrl: '',
        thumbUrl: '',
        shareName: ''
      },
      invitedUsersCount: '--',
      rewardMoney: '--',
      rcCode: '',
      id: 0,
      loading: true
    }),
    mounted () {
      if (!window.mui.os.android) {
        setTimeout(() => {
          this.getImage()
        }, 1000)
      }
    },
    components: {
      Share,
      Images
    },
    computed: {},
    methods: {
      imageMounted () {
        this.$refs.ShareBtn.createImage((url) => {
          this.$refs.imagesCommponent.changeImage(url)
          this.$refs.ShareBtn.share()
        })
      },
      shareSuccess () {

      },
      shareFail () {
      },
      getImage () {
        this.$refs.ShareBtn.getImageByServer((url) => {
          this.$refs.imagesCommponent.changeImage(url)
          this.$refs.ShareBtn.share()
        })
      }
    },
    created () {
      var user = getLocalUserInfo()
      this.rcCode = user.rc_code || 0
      this.shareOption = getInvitation(user.name, this.rcCode)
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
    background: #C0C1C0;
  }

  .Invitation_t {
    width: 100%;
    /*height:8.586rem;*/
    background: #FFFFFF url("../../statics/images/invitation-bg@2x.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
  }

  .Invitation_img {
    width: 95%;
    /*height:7.2rem;*/
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  /*　邀请成功的信息部分*/
  .invitation-information {
    width: 100%;
    height: 2.36rem;
    /*border: 0.026rem solid #cccccc;*/
    background: #FFFFFF;
    margin-top: 0.133rem;
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
    border: 0.026rem solid #b4b4b6;
    border-radius: 2.266rem;
    margin-left: 2.5%;
    margin-top: 1.066rem;
    position: relative;
  }

  .contactFriends span {
    display: block;
    text-align: center;
    font-size: 0.373rem;

  }

  .contactFriends span:nth-of-type(1) {
    color: #444444;
    margin-top: 0.773rem;

  }

  .contactFriends span:nth-of-type(2) {
    color: #03aef9;
    margin-top: 0.106rem;
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
    margin-bottom: 2.133rem;
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
      height: 6.133rem;
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
      height: 7.2rem;
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
      height: 7.466rem;
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
