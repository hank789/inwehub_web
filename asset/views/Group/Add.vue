<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">{{id ? '修改圈子' : '创建圈子'}}</h1>
    </header>

    <div class="mui-content">
      <div class="foundGroupWrapper">
        <div class="foundGroupImages" @tap.stop.prevent="uploadImage('big')">
          <img v-if="backgroundImg.length" :id="'image_0'" :src="backgroundImg[0].base64" :data-preview-src="backgroundImg[0].base64" :data-preview-group="1"/>
          <div class="foundGroupIcon" @tap.stop.prevent="uploadImage('big')" v-if="backgroundImg.length < maxImageCount || id">
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
            <div class="headPhotograph" @tap.stop.prevent="uploadImage('small')" v-if="images.length < maxImageCount || id">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiangji1"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="groupNAme">
        <input v-if="!id" type="text" placeholder="圈子名称" v-model.trim="name" maxlength="9">
        <div class="editName font-family-medium" v-if="id">{{name}}</div>
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
                                                                      :class="{'active':!type}"></label>秘密<i>{{id ? '（内容仅入圈成员可看）' : '（仅入圈成员可看，创建后不可改)'}}</i></span>
      </div>

      <div class="goFoundGroup font-family-medium" v-if="!id" @tap.stop.prevent="submit()">开始创建</div>
      <div class="goFoundGroup font-family-medium" v-else @tap.stop.prevent="reviseGroup()">保存修改</div>
    </div>

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
        id: null,
        images: [],
        backgroundImg: [],
        name: '',
        maxImageCount: 1,
        description: '',
        descMaxLength: 1000,
        uploadImageType: null,
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
      '$route': 'refreshPageData',
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      }
    },
    mounted () {
      this.refreshPageData()
    },
    methods: {
      refreshPageData () {
        this.id = this.$route.params.id
        if (this.id) {
          this.getData()
        }
      },
      getData () {
        postRequest(`group/detail`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            this.$router.replace('/groups')
            return
          }

          var detail = response.data.data
          this.images[0] = {
            base64: detail.logo
          }
          this.backgroundImg[0] = {
            base64: detail.background_img
          }
          this.name = detail.name
          this.type = detail.public
          this.description = detail.description
        })
      },
      reviseGroup () {
        var data = {
          id: this.id,
          name: this.name,
          logo: this.images[0].base64,
          public: this.type,
          description: this.description,
          background_img: this.backgroundImg[0].base64
        }
        postRequest(`group/update`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.$router.replace('/group/detail/' + response.data.data.id)
        })
      },
      submit () {
        if (!this.backgroundImg.length) {
          window.mui.toast('请选择背景图片')
          return
        }

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
          background_img: this.backgroundImg[0].base64,
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
        if (this.uploadImageType === 'big') {
          this.backgroundImg = images
        }
        if (this.uploadImageType === 'small') {
          this.images = images
        }
      },
      uploadImage: function (type) {
        this.uploadImageType = type
        this.$refs.uploadImage.uploadImage()
      },
      selectType (type) {
        if (!this.id) {
          this.type = type
        } else {
          window.mui.toast('公开／私密不可修改')
        }
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
      height: 3.973rem;
      position: relative;
      border-bottom-left-radius: 0.533rem;
      border-bottom-right-radius: 0.533rem;
      background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.1) 100%);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-bottom-left-radius: 0.533rem;
        border-bottom-right-radius: 0.533rem;
      }
      .foundGroupIcon {
        font-size: 0.8rem;
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
      bottom: -0.64rem;
      left: 0.453rem;
      z-index: 100;
      .headImages {
        width: 1.493rem;
        height: 1.493rem;
        text-align: center;
        background: #E3E3E3;
        border-radius: 0.106rem;
        border: 0.026rem solid #ffffff;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.08rem;
          object-fit: cover;
        }
        .logoImg {
          color: #8B8B8B;
          font-size: 0.8rem;
          margin-top: 0.293rem;
        }
        .headPhotograph {
          width: 1.44rem;
          height: 1.44rem;
          position: absolute;
          top: 0.026rem;
          left: 0.026rem;
          text-align: center;
          border-radius: 0.106rem;
          background:rgba(0,0,0,0.3);
          .icon {
            font-size: 0.48rem;
            color: #ffffff;
            margin-top: 0.506rem;
          }
        }
      }
    }
  }
  .groupNAme {
    margin-top: 1.066rem;
    /*background: #DCDCDC;*/
    .editName {
      padding: 0 0.426rem 0.293rem;
      color: #444444;
      font-size: 0.533rem;
    }
    input[type='text'] {
      margin-bottom: 0;
      border: none;
      color: #444444;
      font-size: 0.533rem;
      font-family: PingFangSC-Medium;
      &::-webkit-input-placeholder {
        color: #C8C8C8;
        font-size: 0.533rem;
        font-family: PingFangSC-Medium;
      }
      &:-ms-input-placeholder {
        color: #C8C8C8;
        font-size: 0.533rem;
        font-family: PingFangSC-Medium;
      }
      &::-ms-input-placeholder {
        color: #C8C8C8;
        font-size: 0.533rem;
        font-family: PingFangSC-Medium;
      }
      &::placeholder {
        color: #C8C8C8;
        font-size: 0.533rem;
        font-family: PingFangSC-Medium;
      }
    }
  }

  .groupDescribe {
    position: relative;
    padding: 0.293rem 0.426rem;
    .groupDescribeText {
      color: #808080;
      font-size: 0.373rem;
    }
    .form-ask {
      .textarea-wrapper {
        height: 4.373rem;
        background: #ffffff;
        margin-top: 0.346rem;
        border: 0.026rem solid #DCDCDC;
        border-radius: 0.133rem;
        textarea {
          background: #ffffff;
          font-size: 0.373rem;
          color: #444444;
          height: 3.493rem;
          border: none;
        }
      }
    }
    .counter {
      font-size: 0.373rem;
      color: #C8C8C8;
      line-height: 0.533rem;
      position: absolute;
      bottom: 0.453rem;
      right: 0.746rem;
    }
  }

  .fixedContainer {
    position: relative;
    background: #ffff;
    padding: 0.026rem 0.32rem;
    /*margin-top: 0.133rem;*/
    .edit {

    }
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
    width: 9.146rem;
    height: 1.173rem;
    border:none;
    color: #FFFFFF;
    font-size: 0.426rem;
    text-align: center;
    background: #03AEF9;
    line-height: 1.173rem;
    margin: 2.133rem auto 0;
    border-radius: 1.333rem;
  }
</style>
