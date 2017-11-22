<template>
  <div style="background: #000">
    <div id="shareContentWrapper" style="display: none;">
      <div style="width:750px;height:1000px;background:#fff;color:red;font-size:24px;line-height:48px;">
        互动问答
        <qr-code :text="'test'" :size="170" error-level="M"></qr-code>
      </div>

    </div>

    <Share
      ref="ShareBtn"
      :title="shareTitle"
      :link="shareUrl"
      :content="shareContent"
      :imageUrl="shareImg"
      :thumbUrl="shareImg"
      :DomConvertImage="true"
      @success="shareSuccess"
      :DomConvertImageId="'shareContentWrapper'"
      @fail="shareFail"
    ></Share>

  </div>

</template>

<script>

  import Share from '../components/Share.vue'

  const AskDetail = {
    data: () => ({
      shareUrl: 'http://www.baidu.com',
      shareImg: '',
      shareContent: '',
      shareTitle: '',
      id: 0,
      loading: true
    }),
    mounted () {
      this.shareImg = 'https://cdn.inwehub.com/system/whiteLogo@2x.png'
    },
    components: {
      Share
    },
    computed: {
      answer () {
        return this.ask.answers[0] ? this.ask.answers[0] : {}
      },
      prevOtherData () {
        return {question_id: this.id}
      }
    },
    methods: {
      shareSuccess () {
        // alertAskCommunityDetailShareSuccess(this);
      },
      shareFail () {
      }
    },
    created () {}
  }
  export default AskDetail
</script>


<style scoped>
  .mui-table-view-cell:after {
    display: none;
  }

  .mui-content {
    background: #f3f4f6;
  }

  .help {
    margin-top: 10px;
    font-size: 14px;
    background: #fff;
  }

  .help .title {
    padding: 15px 15px 10px;
    color: #444;
  }

  .help .body {
    padding: 0 15px;
    color: #808080;
  }

  .help .body a {
    color: #03aef9;
  }

  .buttonWrapper {
    padding-top: 33px;
    background: #fff;
  }

  .buttonWrapper button {
    border-radius: 0;
    margin-bottom: 0;
    padding: 13px 0;
  }


</style>
