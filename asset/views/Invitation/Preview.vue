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
    /*height:32.2rem;*/
    background: #FFFFFF url("../../statics/images/invitation-bg@2x.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
  }

  .Invitation_img {
    width: 95%;
    /*height:27rem;*/
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  /*　邀请成功的信息部分*/
  .invitation-information {
    width: 100%;
    height: 88.0.5rem;
    /*border: 0.1rem solid #cccccc;*/
    background: #FFFFFF;
    margin-top: 0.5rem;
    padding: 0rem 2.5rem;
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
    font-size: 1.5rem;
    color: #444444;
    margin-top: 2.2rem;
    text-align: center;
  }

  .invitation-information li p:nth-of-type(2) {
    font-size: 1.4rem;
    color: #808080;
    text-align: center;
  }

  .invitation-information li span {
    font-size: 1.3rem;
    color: #FFFFFF;
    position: absolute;
    right: 0;
    right: 5%;
    top: 23%;

  }

  /*呼朋唤友*/

  .contactFriends {
    width: 95%;
    height: 8.5rem;
    border: 0.1rem solid #b4b4b6;
    border-radius: 8.5rem;
    margin-left: 2.5%;
    margin-top: 4rem;
    position: relative;
  }

  .contactFriends span {
    display: block;
    text-align: center;
    font-size: 1.4rem;

  }

  .contactFriends span:nth-of-type(1) {
    color: #444444;
    margin-top: 2.9rem;

  }

  .contactFriends span:nth-of-type(2) {
    color: #03aef9;
    margin-top: 0.4rem;
  }

  .contactBtn {
    position: absolute;
    width: 15rem;
    height: 5.3rem;
    top: -3rem;
    left: 0;
    right: 0;
    margin: auto

  }

  .contactBtn p {
    width: 100%;
    height: 100%;
    background: #03aef9;
    border-radius: 5rem;
    text-align: center;
    line-height: 5.3rem;
    color: #FFFFFF;
    font-size: 1.8rem;
    font-weight: 500;
    z-index: 999;
    position: absolute;
  }

  .contactBtn img {
    width: 4.1rem;
    height: 2.9rem;
    position: absolute;
    left: -1.5rem;
    top: 2.3rem;
  }

  /*邀请说明*/
  .invitationNote {
    margin-top: 20.0.5rem;
    margin-bottom: 8rem;
    text-align: center;
    overflow: hidden;
  }

  .invitationNote p:nth-of-type(1) {
    font-size: 1.6rem;
    color: #444444;

  }

  .invitationNote p:nth-of-type(2) {
    font-size: 1.4rem;
    color: #808080;

  }

  .invitationNote p:nth-of-type(3) {
    font-size: 1.2rem;
    color: #808080;
    margin-top: 2.3rem;

  }

  .invitationNote p:nth-of-type(3) u {
    font-size: 1.2rem;
    color: rgb(68, 68, 68);
  }

  /* 适配*/
  @media (min-width: 32rem) {
    .Invitation_img {
      height: 23rem;
    }

    .Invitation_t {
      height: 28rem;
    }

    .invitation-information li:nth-of-type(1) {
      width: 48%;
    }

    .invitation-information li:nth-of-type(2) {
      width: 40%;
    }

  }

  @media (min-width: 37.5rem) {
    .Invitation_img {
      height: 27rem;
    }

    .invitation-information li:nth-of-type(1) {
      width: 42%;
    }

    .invitation-information li:nth-of-type(2) {
      width: 36%;
    }

  }

  @media (min-width: 41.4rem) {
    .Invitation_img {
      height: 28rem;
    }

    .Invitation_t {
      height: 35rem;
    }

    .invitation-information li:nth-of-type(1) {
      width: 42%;
    }

    .invitation-information li:nth-of-type(2) {
      width: 36%;
    }
  }

</style>
