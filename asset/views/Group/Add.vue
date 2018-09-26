<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">创建圈子</h1>
    </header>

    <div class="mui-content">
      <div class="foundGroupWrapper">
        <div class="foundGroupImages" @tap.stop.prevent="uploadBackground()">
          <img v-if="background_img.length" :id="'image_0'" :src="background_img[0].base64" :data-preview-src="background_img[0].base64" :data-preview-group="1"/>
          <div class="foundGroupIcon" @tap.stop.prevent="uploadBackground()" v-if="background_img.length < maxImageCount">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangji1"></use>
            </svg>
          </div>
        </div>
        <div class="headPhotowrapper">
          <div class="headImages">
            <svg class="icon logoImg" aria-hidden="true" v-if="!images.length">
              <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
            </svg>
            <img v-if="images.length" :id="'image_0'" :src="images[0].base64" :data-preview-src="images[0].base64" :data-preview-group="1"/>
            <div class="headPhotograph" @tap.stop.prevent="uploadImage()" v-if="images.length < maxImageCount">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiangji1"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="groupNAme">
        <input type="text" placeholder="圈子名称" v-model.trim="name" maxlength="9">
      </div>
      <div class="line-river-big"></div>

      <div class="groupDescribe">
        <div class="groupDescribeText">圈子描述</div>
        <div class="form-ask">
          <div class="textarea-wrapper">
            <textarea id="description" v-model.trim="description" placeholder="圈子的具体描述"></textarea>
          </div>
        </div>
        <span class="counter"><span>{{descLength}}</span><span>/</span><span>{{descMaxLength}}</span></span>
      </div>

      <div class="fixedContainer">
          <span class="niming" @tap.stop.prevent="selectType(1)"><label class="nimingCheckbox"
                                                                        :class="{'active':type}"></label>公开</span>
        <span class="niming" @tap.stop.prevent="selectType(0)"><label class="nimingCheckbox"
                                                                      :class="{'active':!type}"></label>秘密<i>（仅入圈成员可看，创建后不可改)</i></span>
      </div>

      <div class="goFoundGroup font-family-medium" @tap.stop.prevent="submit()">开始创建</div>
    </div>

    <uploadImage ref="uploadBackground"
                 :isMultiple="false"
                 @success="uploadBackgroundSuccess"
                 :ImageMaximum="maxImageCount - this.background_img.length"
    ></uploadImage>

    <uploadImage ref="uploadImage"
                 :isMultiple="false"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount - this.images.length"
    ></uploadImage>
  </div>
</template>

<script>
  import uploadImage from '../../components/uploadImage'
  import { postRequest } from '../../utils/request'

  export default {
    data () {
      return {
        images: [],
        background_img: [],
        name: '',
        maxImageCount: 1,
        description: '',
        descMaxLength: 1000,
        type: 1  // 1 public  0 私密
      }
    },
    computed: {
      descLength () {
        return this.description.length
      }
    },
    components: {
      uploadImage
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      }
    },
    mounted () {
    },
    methods: {
      submit () {
        if (!this.images.length) {
          window.mui.toast('请选择图片')
          return
        }

        if (!this.name.length) {
          window.mui.toast('请输入圈子名称')
          return
        }

        if (this.name.length > 9) {
          window.mui.toast('圈子名称9个字以内')
          return
        }

        if (!this.description.length) {
          window.mui.toast('请输入圈子描述')
          return
        }

        var data = {
          name: this.name,
          description: this.description,
          logo: this.images[0].base64,
          background_img: this.background_img[0].base64,
          public: this.type === 1 ? 1 : 0
        }

        postRequest(`group/store`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.$router.replace('/group/detail/' + response.data.data.id)
        })
      },
      uploadImageSuccess (images) {
        this.images = images
      },
      uploadImage: function () {
        this.$refs.uploadImage.uploadImage()
      },
      uploadBackgroundSuccess (images) {
        this.background_img = images
      },
      uploadBackground: function () {
        this.$refs.uploadBackground.uploadImage()
      },
      selectType (type) {
        this.type = type
      }
    }
  }
</script>

<style lang="less" scoped>
  .mui-content {
    background: #ffffff;
  }
  .foundGroupWrapper {
    position: relative;
    .foundGroupImages {
      height: 149px;
      position: relative;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.1) 100%);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
      }
      .foundGroupIcon {
        font-size: 30px;
        color: #ffffff;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 100;
        .icon {
        }
      }
    }
    .headPhotowrapper {
      position: absolute;
      bottom: -24px;
      left: 17px;
      z-index: 100;
      .headImages {
        width: 56px;
        height: 56px;
        text-align: center;
        background: #E3E3E3;
        border-radius: 4px;
        border: 1px solid #ffffff;
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
          object-fit: cover;
        }
        .logoImg {
          color: #8B8B8B;
          font-size: 30px;
          margin-top: 11px;
        }
        .headPhotograph {
          width: 54px;
          height: 54px;
          position: absolute;
          top: 1px;
          left: 1px;
          text-align: center;
          border-radius: 4px;
          background:rgba(0,0,0,0.3);
          .icon {
            font-size: 18px;
            color: #ffffff;
            margin-top: 19px;
          }
        }
      }
    }
  }
  .groupNAme {
    margin-top: 40px;
    /*background: #DCDCDC;*/
    input[type='text'] {
      margin-bottom: 0;
      border: none;
      color: #444444;
      font-size: 20px;
      font-family: PingFangSC-Medium;
      &::-webkit-input-placeholder {
        color: #C8C8C8;
        font-size: 20px;
        font-family: PingFangSC-Medium;
      }
      &:-ms-input-placeholder {
        color: #C8C8C8;
        font-size: 20px;
        font-family: PingFangSC-Medium;
      }
      &::-ms-input-placeholder {
        color: #C8C8C8;
        font-size: 20px;
        font-family: PingFangSC-Medium;
      }
      &::placeholder {
        color: #C8C8C8;
        font-size: 20px;
        font-family: PingFangSC-Medium;
      }
    }
  }

  .groupDescribe {
    position: relative;
    padding: 11px 16px;
    .groupDescribeText {
      color: #808080;
      font-size: 14px;
    }
    .form-ask {
      .textarea-wrapper {
        height: 164px;
        background: #ffffff;
        margin-top: 13px;
        border: 0.026rem solid #DCDCDC;
        border-radius: 0.133rem;
        textarea {
          background: #ffffff;
          font-size: 0.373rem;
          color: #444444;
          height: 131px;
          border: none;
        }
      }
    }
    .counter {
      font-size: 14px;
      color: #C8C8C8;
      line-height: 20px;
      position: absolute;
      bottom: 17px;
      right: 28px;
    }
  }

  .fixedContainer {
    position: relative;
    background: #ffff;
    padding: 1px 12px;
    /*margin-top: 0.133rem;*/
    .niming {
      color: #444444;
      position: relative;
      font-size: 0.373rem;
      padding-left: 0.24rem;
      margin-right: 0.6rem;
      &:nth-of-type(2) {
        margin-right: 0;
      }
      i {
        color: #808080;
        font-size: 0.373rem;
        font-style: normal;
      }
      input {
        position: absolute;
        top: 0.106rem;
        left: 0;
        vertical-align: bottom;
      }
    }
    .nimingCheckbox {
      display: inline-block;
      width: 0.426rem;
      height: 0.426rem;
      position: relative;
      border: 0.026rem solid #c8c8c8;
      border-radius: 50%;
      top: 0.08rem;
      right: 0.133rem;
      &.active {
        &:after {
          content: ' ';
          display: inline-block;
          width: 0.106rem;
          height: 0.106rem;
          position: absolute;
          border: 0.026rem solid #03aef9;
          background-color: #03aef9;
          border-radius: 50%;
          left: 50%;
          margin-left: -0.07rem;
          top: 50%;
          margin-top: -0.08rem;
        }
      }
    }
  }

  .goFoundGroup {
    width: 343px;
    height: 44px;
    border:none;
    color: #FFFFFF;
    font-size: 16px;
    text-align: center;
    background: #03AEF9;
    line-height: 44px;
    margin: 80px auto 0;
    border-radius: 1.333rem;
  }
</style>
