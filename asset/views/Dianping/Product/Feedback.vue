<template>
  <div class="dianpingFeedBack">
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">产品问题反馈</h1>
    </header>
    <div class="mui-content">

      <div class="feedBackWrapper">
        <div class="title" v-for="(item, feedindex) in feedBackInfo" :class="item.showActive ? 'active' : ''" :key="feedindex" @tap.stop.prevent="feedBack(item)">
          <span>{{ item.text }}</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gou1"></use>
          </svg>
          <div class="bot" v-if="feedindex !== feedBackInfo.length-1"></div>
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
          <div class="container-image" v-for="(image, index) in images">
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
              <use xlink:href="#icon-times1"></use>
            </svg>
            <!--<img src="../../../statics/images/uicon.jpg"/>-->
            <img :id="'image_' + index" :src="image.base64"/>
          </div><div class="component-photograph" @tap.stop.prevent="uploadImage()"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>
        </div>
      </div>
      <div class="sureButton" @tap.stop.prevent="subimt">确认创建</div>

    </div>

    <uploadImage ref="uploadImage"
                 :isMultiple="true"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount - this.images.length"
    ></uploadImage>
  </div>
</template>

<script>
  import { feedBackProduct } from '../../../utils/dianping.js'
  import uploadImage from '../../../components/uploadImage'

  export default {
    data () {
      return {
        description: '',
        feedBackInfo: [
          {
            id: 1,
            text: '信息勘误'
          },
          {
            id: 2,
            text: '功能建议'
          },
          {
            id: 3,
            text: 'BUG反馈'
          },
          {
            id: 4,
            text: '不良举报'
          },
          {
            id: 5,
            text: '其他'
          }
        ],
        images: [],
        type: '',
        maxImageCount: 9,
        name: this.$route.params.name
      }
    },
    components: {
      uploadImage
    },
    computed: {
      isUploadImage () {
        if (this.images.length >= this.maxImageCount) {
          return false
        }
        return true
      }
    },
    methods: {
      uploadImageSuccess (images) {
        for (var i = 0; i < images.length; i++) {
          this.images.push(images[i])
        }
      },
      uploadImage: function () {
        if (!this.isUploadImage) {
          return false
        }
        this.$refs.uploadImage.uploadImage()
      },
      delImg (index) {
        this.images.splice(index, 1)
      },
      feedBack (item) {
        this.$set(item, 'showActive', item.showActive ? !item.showActive : true)
        if (item.showActive) {
          this.type = item.text
        } else {
          this.type = ''
        }
      },
      subimt () {
        if (!this.type.length) {
          window.mui.toast('请选择反馈信息')
          return
        }
        if (!this.description.length) {
          window.mui.toast('请输入具体描述')
          return
        }

        var data = {
          type: this.type,
          content: this.description,
          images: [],
          product: this.name
        }
        for (var i in this.images) {
          var compressBase64 = this.images[i].base64
          data['images'].push(compressBase64)  // this.images[i].base64;
        }
        feedBackProduct(this, data, () => {
          window.mui.toast('我们已收到您提交的产品，请耐心等候')
        })
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
    margin: 10px auto 15px;
    width: 9.146rem;
    height: 1.173rem;
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

<style>
  .dianpingFeedBack .container-images .container-image:nth-of-type(3n) {
    margin-right: 0.26667rem;
  }
</style>
