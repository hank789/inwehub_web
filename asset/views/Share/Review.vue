<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">图片预览</h1>
    </header>
    <div class="mui-content absolute">
      <img :src="url"/>
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
      :showPreviewApiImage="true"
      :apiImageUrl="url"
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
  import { postRequest } from '../../utils/request'
  import { dowloadFile } from '../../utils/plus'

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
      type: '',
      url: '',
      loading: true
    }),
    mounted () {
      this.$refs.ShareBtn.share()
    },
    components: {
      Share,
      Images
    },
    computed: {},
    methods: {
      refreshPageData () {
        this.getData()
      },
      shareSuccess () {},
      getData () {
        this.id = this.$route.params.id
        this.type = this.$route.params.type

        postRequest('question/getShareImage', {
          id: this.id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.url = response.data.data.url
          // var localFileName = this.url.match(/[^\\/]+?$/)
          var localFileName = 'question_share'
          dowloadFile(this.url, '_www/' + localFileName + '_' + this.id + '.png', (url) => {
            this.url = url
          })
        })

        var user = getLocalUserInfo()
        this.rcCode = user.rc_code || 0
        this.shareOption = getInvitation(user.name, this.rcCode)
      },
      shareFail () {
      },
      getImage () {
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getData()
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

  .mui-content img{
    width:100%;
  }
</style>
