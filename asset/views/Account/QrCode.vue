<template>
  <div>
    <header v-if="false" class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <!--<h1 class="mui-title">个人名片</h1>-->
    </header>

    <div class="mui-content" v-if="showQrCode">

      <!--<div class="logoUpDown">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-tiwen"></use>-->
        <!--</svg>-->
      <!--</div>-->
      <div>
        <div class="headPortraitInfo">
          <div class="headPortraitImg">
            <img src="../../statics/images/uicon.jpg" alt="">
          </div>
          扫码关注蓝色小白
        </div>

        <div class="myCode">
          <div class="myCodeWrapper">
            <qr-code :text="shareUrl" :size="155" error-level="M"></qr-code>
          </div>
        </div>

        <div class="preservation" @tap.stop.prevent="saveToGallery">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-baocuntupian"></use>
          </svg>
          <span>保存我的卡片</span>
        </div>
      </div>
      <div class="bottomText">长见识 · 解疑惑 · 寻合作 · 树形象 · 得收益</div>
    </div>

    <div id="myQrCode" style="text-align: center;display: none">

      <div style="font-size: 18px; color: #444444; line-height: 25px; margin-top: 64px; margin-bottom: 15px; ">
        <div style="width: 34px; height: 34px; margin: 0 auto 10px;">
          <img style="width: 100%; height: 100%; border-radius: 50%;" src="../../statics/images/uicon.jpg" alt="">
        </div>
        扫码关注蓝色小白
      </div>

      <div style="width: 238px; height: 250px; margin: 0 auto; background: url(../../statics/images/group.png) no-repeat 0 32px;">
        <div style="margin: 0 auto; width: 167px; height: 167px; background: rgba(255, 255, 255, 1); box-shadow: 0px 2px 26px 0px #F0F2F5; border-radius: 4px;">
          <qr-code style="margin: 6px; padding-top: 6px;" :text="shareUrl" :size="155" error-level="M"></qr-code>
        </div>
      </div>

      <div style="width: 100%; font-size: 12px; color: #808080; position: absolute; bottom: 33px;">长见识 · 解疑惑 · 寻合作 · 树形象 · 得收益</div>
    </div>

  </div>
</template>

<script>
  import { getResumeDetail } from '../../utils/shareTemplate'
  import { getLocalUuid } from '../../utils/user'
  import { postRequest } from '../../utils/request'
  import { saveHtmlImgToGallery } from '../../utils/image'

  export default {
    data: () => ({
      shareUrl: '',
      showQrCode: true
    }),
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getData()
    },
    methods: {
      saveToGallery () {
        var node = document.getElementById('myQrCode')
        console.log('notehtml:' + node.innerHTML)
        saveHtmlImgToGallery(node.innerHTML, '_documents/qrcode.jpeg', () => {
          window.mui.toast('保存成功')
        }, () => {
          window.mui.toast('保存失败')
        })
      },
      refreshPageData () {
        this.getData()
      },
      getData () {
        var uuid = getLocalUuid()
        postRequest(`profile/resumeInfo`, {
          uuid: uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          var resume = response.data.data

          var shareOptions = getResumeDetail(
            uuid,
            resume.info.name,
            resume.info.company,
            resume.info.avatar_url
          )
          this.shareUrl = shareOptions.link
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
      font-size: 120px;
    }
  }
  .headPortraitInfo {
    font-size: 18px;
    color: #444444;
    line-height: 25px;
    margin-top: 64px;
    margin-bottom: 15px;
    .headPortraitImg {
      width: 34px;
      height: 34px;
      margin: 0 auto 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .myCode {
    width: 238px;
    height: 250px;
    margin: 0 auto;
    background: url("../../statics/images/group.png") no-repeat 0 32px;
    background-size: contain;
    .myCodeWrapper {
      margin: 0 auto;
      width: 167px;
      height: 167px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 26px 0px #F0F2F5;
      border-radius: 4px;
      div {
        margin: 6px;
        padding-top: 6px;
      }
    }
  }

  .preservation {
    margin-top: 91px;
    .icon {
      color: #B4B4B6;
    }
    span {
      color: #444444;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .bottomText {
    width: 100%;
    font-size: 12px;
    color: #808080;
    position: absolute;
    bottom: 33px;
  }
</style>
