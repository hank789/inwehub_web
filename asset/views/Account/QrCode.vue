<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <Back></Back>
    </header>

    <div class="mui-content" v-if="!loading">
      <div>
        <div class="headPortraitInfo">
          <div class="headPortraitImg">
            <img :src="resume.info.avatar_url" alt="">
          </div>
          扫码关注{{resume.info.name}}
        </div>

        <div class="myCode">
          <div class="myCodeWrapper">
            <qr-code class="myCodeWrapperImg" :text="shareUrl" :size="155" error-level="M"></qr-code>
          </div>
        </div>

        <div class="preservation" @tap.stop.prevent="saveToGallery">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-baocuntupian"></use>
          </svg>
          <span>保存我的卡片</span>
        </div>
      </div>
    </div>

    <div id="myQrCode" style="display: none" v-if="!loading">
      <div style="text-align: center; position: relative; width: 1125px;">

        <div style="position: absolute; top: 67.5px; left: 67.5px; width: 374px; height: 114px; ">
          <img style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;" src="../../statics/images/group_3@3x.png" alt="" id="myQrCode-logoGroup">
        </div>

        <div style="font-size: 54px; color: #444444; line-height: 75px; padding-top: 414px; margin-bottom: 45px; font-family:PingFangSC-Regular;">
          <div style="width: 102px; height: 102px; margin: 0 auto 30px;">
            <img :src="resume.info.avatar_url" style="width: 100%; height: 100%; border-radius: 50%;" >
          </div>
          扫码关注{{resume.info.name}}
        </div>

        <div style="width: 714px; height: 750px; margin: 0 auto; position: relative">
          <div style="width: 714px; height: 657px; position: absolute; z-index: -1; top: 100.5px;">
            <img style="width: 100%; height: 100%" src="../../statics/images/group.png" alt="" id="myQrCode-group">
          </div>
          <div style="margin: 0 auto; width: 502.5px; height: 502.5px; background: #FFFFFF; box-shadow: 0px 3px 39px 0px #F0F2F5; border-radius: 12px;">
            <qr-code style="margin: 18px; padding-top: 18px;" :text="shareUrl" :size="465" error-level="M"></qr-code>
          </div>
        </div>

        <div style="width: 100%; font-size: 36px; color: #808080; margin-top: 450px; padding-bottom: 99px; font-family:PingFangSC-Regular;">长见识 · 解疑惑 · 寻合作 · 树形象 · 得收益</div>
      </div>
    </div>

  </div>
</template>

<script>
  import { getResumeDetail } from '../../utils/shareTemplate'
  import { getLocalUuid } from '../../utils/user'
  import { postRequest } from '../../utils/request'
  import { saveHtmlImgToGallery, getBase64ByImgUrl } from '../../utils/image'

  export default {
    data: () => ({
      shareUrl: '',
      loading: 1,
      generateImgIng: 0,
      resume: {},
      uuid: ''
    }),
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getData()
    },
    methods: {
      saveToGallery () {
        if (this.generateImgIng) return

        this.generateImgIng = 1

        getBase64ByImgUrl(document.getElementById('myQrCode-logoGroup').src, (base64) => {
          document.getElementById('myQrCode-logoGroup').src = base64

          getBase64ByImgUrl(document.getElementById('myQrCode-group').src, (base64) => {
            document.getElementById('myQrCode-group').src = base64

            setTimeout(() => {
              var node = document.getElementById('myQrCode')
              saveHtmlImgToGallery(node.innerHTML, '_documents/qrcode.jpeg', () => {
                window.mui.toast('已保存至相册')
                this.generateImgIng = 0
              }, () => {
                window.mui.toast('保存失败')
                this.generateImgIng = 0
              })
            }, 200)
          })
        })
      },
      refreshPageData () {
        this.getData()
      },
      getData () {
        this.uuid = getLocalUuid()

        if (this.$route.query.id) {
          this.uuid = this.$route.query.id
        }

        if (!this.uuid) return

        postRequest(`profile/resumeInfo`, {
          uuid: this.uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          var resume = response.data.data

          var shareOptions = getResumeDetail(
            this.uuid,
            resume.info.name,
            resume.info.company,
            resume.info.avatar_url
          )
          this.shareUrl = shareOptions.link
          this.resume = response.data.data
          this.loading = 0
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #FFFFFF;
    text-align: center;
  }
  .logoUpDown {
    text-align: left;
    .icon {
      font-size: 3.2rem;
    }
  }
  .headPortraitInfo {
    font-size: 0.48rem;
    color: #444444;
    line-height: 0.666rem;
    margin-top: 1.706rem;
    margin-bottom: 0.4rem;
    .headPortraitImg {
      width: 0.906rem;
      height: 0.906rem;
      margin: 0 auto 0.266rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .myCode {
    width: 6.346rem;
    height: 6.666rem;
    margin: 0 auto;
    background: url("../../statics/images/group.png") no-repeat 0 0.853rem;
    background-size: contain;
    .myCodeWrapper {
      position: relative;
      text-align: center;
      height: 4.466rem;
      div {
        position: absolute;
        left: 50%;
        margin-left: -2.233rem;
        width: 4.466rem;
        height: 4.466rem;
        border-radius: 0.106rem;
        background: #ffffff;
        padding: 0.173rem;
        box-shadow:0rem 0.053rem 0.693rem 0rem #F0F2F5;
      }
    }
  }

  .preservation {
    margin-top: 2.426rem;
    .icon {
      color: #B4B4B6;
    }
    span {
      color: #444444;
      font-size: 0.373rem;
      font-weight: 500;
    }
  }

  .bottomText {
    width: 100%;
    font-size: 0.32rem;
    color: #808080;
    position: absolute;
    bottom: 0.88rem;
  }

  /*适配*/
  @media (min-width: 414px) {
    .myCode {
      background-position: 0 0.533rem;
    }
  }
</style>

<style>
  .myCodeWrapperImg img{
    position: absolute;
    top: 50%;
    margin-top: -77px; /* px不转换 */
    left: 50%;
    margin-left: -77px; /* px不转换 */
  }
</style>
