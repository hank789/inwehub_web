<template>
  <div>
    <div class="mui-content absolute">
      <svg class="icon succcess" aria-hidden="true">
        <use xlink:href="#icon-check-circle"></use>
      </svg>
      <div class="succcess_text">
        <p>您的特权已领取～</p>
        <p>登录InweHub使用吧！</p>
      </div>
      <button @tap.stop.prevent="downloadApp()">下载APP</button>
      <div class="succcess_share" @tap.stop.prevent="share()">
        分享特权给好友

      </div>
    </div>

    <Share
      ref="ShareBtn"
      :hideShareBtn="true"
      :title="shareOption.title"
      :link="shareOption.link"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :shareName="shareOption.shareName"
      :DomConvertImage="false"
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
      downloadApp () {
        window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.inwehub.InwehubApp')
      },
      share () {
        this.$refs.ShareBtn.share()
      },
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

  /*清除样式*/
  div, ul, li, p, span, a, i {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .mui-content {
    background: #f3f4f6;
  }

  header {
    background: #f3f4f6;
  }

  .mui-icon-back:before, .mui-icon-left-nav:before {
    color: #808080;
  }

  /*svg*/

  .succcess {
    font-size: 9.5rem;
    color: #c8c8c8;
    position: absolute;
    top: 7.9rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  .succcess_text {
    position: absolute;
    top: 20.8rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  .succcess_text p:nth-of-type(1) {
    text-align: center;
    font-size: 2.5rem;
    color: #444444;
    font-weight: 500;
  }

  .succcess_text p:nth-of-type(2) {
    text-align: center;
    font-size: 1.4rem;
    color: #808080;
    margin-top: 0.5rem;
  }

  /*button*/
  button {
    width: 15rem;
    height: 5.3rem;
    background: #03aef9;
    border-radius: 5rem;
    text-align: center;
    font-size: 1.8rem;
    color: #ffffff;
    position: absolute;
    top: 29.15rem;
    left: 0;
    right: 0;
    margin: auto;
    border-color: #03aef9;
  }

  .succcess_share {
    width: 16.2rem;
    height: 3.1rem;
    border-radius: 5rem;
    border: 0.1rem solid #979797;
    text-align: center;
    line-height: 3.1rem;
    font-size: 1.4rem;
    color: #444444;
    position: absolute;
    bottom: 10.3rem;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>
