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
    font-size: 2.533rem;
    color: #c8c8c8;
    position: absolute;
    top: 2.106rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  .succcess_text {
    position: absolute;
    top: 5.546rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  .succcess_text p:nth-of-type(1) {
    text-align: center;
    font-size: 0.666rem;
    color: #444444;
    font-weight: 500;
  }

  .succcess_text p:nth-of-type(2) {
    text-align: center;
    font-size: 0.373rem;
    color: #808080;
    margin-top: 0.133rem;
  }

  /*button*/
  button {
    width: 4rem;
    height: 1.413rem;
    background: #03aef9;
    border-radius: 1.333rem;
    text-align: center;
    font-size: 0.48rem;
    color: #ffffff;
    position: absolute;
    top: 7.773rem;
    left: 0;
    right: 0;
    margin: auto;
    border-color: #03aef9;
  }

  .succcess_share {
    width: 4.32rem;
    height: 0.826rem;
    border-radius: 1.333rem;
    border: 0.026rem solid #979797;
    text-align: center;
    line-height: 0.826rem;
    font-size: 0.373rem;
    color: #444444;
    position: absolute;
    bottom: 2.746rem;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>
