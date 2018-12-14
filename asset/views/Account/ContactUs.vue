<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">联系我们</h1>
    </header>
    <div class="mui-content">

      <div class="contactusWrapper">
        <div class="title font-family-medium">联系我们</div>
        <div class="textWrapper">
          <div class="text textBottom">
            <span>客服微信：hiinwe</span>
            <span @tap.stop.prevent="showWeChat">添加</span>
          </div>
          <div class="text">
            <span>联系邮箱：hi@inwehub.com</span>
            <span v-clipboard="'hi@inwehub.com'" @success="shareEmail()" @error="clipboardError">复制</span>
          </div>
        </div>
        <div class="bot"></div>
      </div>

      <div class="contactusWrapper">
        <div class="title font-family-medium">广告合作</div>
        <div class="textWrapper">
          <div class="text">
            <span>联系邮箱：Ad@inwehub.com</span>
            <span v-clipboard="'Ad@inwehub.com'" @success="shareEmail()" @error="clipboardError">复制</span>
          </div>
        </div>
        <div class="bot"></div>
      </div>

      <div class="contactusWrapper">
        <div class="title font-family-medium">成为合作伙伴</div>
        <div class="textWrapper">
          <div class="text">
            <span>联系邮箱：BD@inwehub.com</span>
            <span v-clipboard="'BD@inwehub.com'" @success="shareEmail()" @error="clipboardError">复制</span>
          </div>
        </div>
        <div class="bot"></div>
      </div>

      <div class="contactusWrapper">
        <div class="title font-family-medium">投稿/寻求报道</div>
        <div class="textWrapper">
          <div class="text">
            <span>联系邮箱：Hi@inwehub.com</span>
            <span v-clipboard="'Hi@inwehub.com'" @success="shareEmail()" @error="clipboardError">复制</span>
          </div>
        </div>
        <div class="bot"></div>
      </div>

      <div class="contactusWrapper">
        <div class="title font-family-medium">加入我们</div>
        <div class="textWrapper">
          <div class="text">
            <span>联系邮箱：HR@inwehub.com</span>
            <span v-clipboard="'HR@inwehub.com'" @success="shareEmail()" @error="clipboardError">复制</span>
          </div>
        </div>
        <!--<div class="bot"></div>-->
      </div>

    </div>
  </div>
</template>

<script>
  import { alertAddWeHub } from '../../utils/dialogList'
  export default {
    data () {
      return {}
    },
    methods: {
      shareEmail () {
        window.mui.toast('复制成功')
      },
      clipboardError () {
        window.mui.toast('复制失败')
      },
      showWeChat () {
        alertAddWeHub(this)
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }


  .contactusWrapper {
    position: relative;
    padding: 0 16px;
    margin-top: 17px;
    .bot {
      right: 0.48rem;
      left: 0.426rem;
    }
    .title {
      color: #444444;
      font-size: 15px;
      line-height: 21px;
    }
    .textWrapper {
      padding-bottom: 16px;
      .textBottom {
        margin-bottom: 14px !important;
      }
      .text {
        display: flex;
        justify-content: space-between;
        color: #808080;
        font-size: 14px;
        line-height: 20px;
        &:nth-of-type(1) {
          margin: 9px 0 0px;
        }
        span {
          &:nth-of-type(2) {
            color: #03AEF9;
          }
        }
      }
    }

  }
</style>
