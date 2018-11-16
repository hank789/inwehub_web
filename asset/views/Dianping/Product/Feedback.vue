<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">产品问题反馈</h1>
    </header>
    <div class="mui-content">

      <div class="feedBackWrapper">
        <div class="title active">
          <span>信息勘误</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gou1"></use>
          </svg>
          <div class="bot"></div>
        </div>
        <div class="title">
          <span>功能建议</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gou1"></use>
          </svg>
          <div class="bot"></div>
        </div>
        <div class="title">
          <span>BUG反馈</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gou1"></use>
          </svg>
          <div class="bot"></div>
        </div>
        <div class="title">
          <span>不良举报</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gou1"></use>
          </svg>
          <div class="bot"></div>
        </div>
        <div class="title">
          <span>其他</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gou1"></use>
          </svg>
        </div>
      </div>
      <div class="line-river-big"></div>

      <div class="productSummary">
        <div class="titleText">具体描述</div>
        <div class="textareaWrapper">
          <textarea v-model.trim="description" placeholder="产品问题具体描述"></textarea>
        </div>
      </div>

      <div class="pictureCaption">
        <div class="titleText">图片说明</div>

        <div class="container-images">
          <div class="container-image">
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
              <use xlink:href="#icon-times1"></use>
            </svg>
            <img src="../../../statics/images/uicon.jpg"/>
          </div><div class="component-photograph" @tap.stop.prevent="uploadImage()"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>
        </div>
      </div>
      <div class="sureButton">确认创建</div>

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        description: ''
      }
    },
    methods: {
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
    left: 0;
    height: 0.026rem;
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }
  .titleText {
    color: #808080;
    font-size: 0.373rem;
    padding: 0 0.426rem;
    line-height: 0.533rem;
  }
  .feedBackWrapper {
    padding: 0 0.426rem;
    .title {
      padding: 0.32rem 0;
      position: relative;
      overflow: hidden;
      &.active {
        span {
          color: #C8C8C8;
        }
        .icon {
          display: block;
        }
      }
      span {
        color: #444444;
        font-size: 0.373rem;
        line-height: 0.533rem;
        float: left;
      }
      .icon {
        float: right;
        font-size: 0.453rem;
        color: #03AEF9;
        display: none;
      }
    }
  }
  .productSummary {
    padding-top: 0.293rem;
    .textareaWrapper {
      padding: 0.346rem 0.426rem 0;
      textarea {
        padding: 0.32rem 0.4rem;
        height: 4.373rem;
        color: #444444;
        font-size: 0.373rem;
        line-height: 0.533rem;
      }
    }
  }
  .pictureCaption {
    .container-images {
      margin-top: 0.32rem;
    }
  }
  .sureButton {
    width: 9.146rem;
    height: 1.173rem;
    margin: 0.266rem auto 0;
    color: #FFFFFF;
    font-size: 0.426rem;
    line-height: 1.173rem;
    text-align: center;
    background: #03AEF9;
    border-radius: 2.666rem;
    font-family:PingFangSC-Medium;
  }

  .component-photograph {
    width:1.626rem !important;
    height:1.626rem !important;
  }
</style>
