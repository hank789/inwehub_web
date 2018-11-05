<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back :tapCallback="empty"></Back>
      <h1 class="mui-title">发布点评</h1>
      <a @tap.stop.prevent="submit()"
         class="mui-btn appPageSubmit mui-btn-link mui-pull-right">确认发布</a>
    </header>

    <div class="mui-content">
      <div class="component-mark">
        <span>就您的感受而言，您会给他打多少分？</span>
        <div class="stars">
          <star-rating
            :increment="0.1"
            :round-start-rating="false"
            v-model="star"
            :padding="20"
            :activeColor="'#fcc816'"
            :star-size="30"
            :show-rating="true"
            :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"
          ></star-rating>

        </div>
        <div class="line-river-after line-river-after-top"></div>
      </div>

      <Jeditor
        class="container-editor container-editor-app container-editor-add"
        ref="myAddEditor"
        id="dianpingAddJeditor"
        :class="{noBottomFile: images.length === 0}"
        v-model.trim="description"
        :rows="10"
        :content="description"
        :descMaxLength="descMaxLength"
        :placeholder="descPlaceholder"
        :allowRichStyle="false"
        :isShowCounter="false"
        @ready="onEditorReady($event)"
        @onEditorBlur="onEditorBlur"
        @onEditorFocus="onEditorFocus"
        @onEditorChange="onEditorChange"
      ></Jeditor>

      <div class="container-editor container-editor-app component-box">
        <swiper :options="swiperOption" class="container-upload-images" v-show="images.length">
          <swiper-slide class="image" v-for="(image, index) in images" :key="'image_'+index" ><img :src="image.base64" :data-preview-src="image.base64" :data-preview-group="1"/><svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
            <use xlink:href="#icon-times1"></use>
          </svg></swiper-slide>
        </swiper>

        <div class="container-camera"  @tap.stop.prevent="uploadImage">
          <div class="camera">
            <svg class="icon" aria-hidden="true" >
              <use xlink:href="#icon-xiangji1"></use>
            </svg>
          </div>
        </div>
      </div>

      <div class="line-river-big"></div>

      <div class="container-identity">
        <div class="identityTitle" @tap.stop.prevent="selectUserRole()">
          <span>请告诉我们您的身份</span>
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="line-river-after line-river-after-top"></div>
        <div class="assessDomain">您的评价属于哪个领域</div>
        <div class="domainList">
          <span class="border-football" @tap.stop.prevent="selectCategory($event, category.id)" v-for="(category, index) in detail.categories">{{ category.name }}</span>
        </div>
        <div class="fixedContainer">
          <span class="niming" @tap.stop.prevent="switchHide()"><label class="nimingCheckbox" :class="{'active': hide}"></label>匿名</span>
        </div>
      </div>
    </div>

    <div class="container-bottom-menus">
      <div class="line-river-after line-river-after-top"></div>

      <!--<span @tap.stop.prevent="uploadImage" :class="{'disable': !isUploadImage}">-->
        <!--<svg class="icon" aria-hidden="true" >-->
          <!--<use xlink:href="#icon-tupian"></use>-->
        <!--</svg>-->
      <!--</span>-->
      <div class="productName">{{ detail.name }}</div>
    </div>

    <uploadImage ref="uploadImage"
                 :isMultiple="true"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount - this.images.length"
    ></uploadImage>

    <Options
      ref="allOptions"
      :id="'allOptions'"
      :options="allOption"
      @selectedItem="selectedItem"
    ></Options>

  </div>
</template>

<script>
  import uploadImage from '../../components/uploadImage'
  import { autoTextArea } from '../../utils/plus'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import Jeditor from '../../components/vue-quill/Jeditor.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Options from '../../components/Options.vue'
  import { add, getProductDetail } from '../../utils/dianping'

  export default {
    data () {
      return {
        loading: 1,
        detail: {},
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 10,
          freeMode: true
        },
        id: currentUser.user_id,
        identity: '',
        description: {},
        images: [],
        maxImageCount: 9,
        percentCompleted: 0,
        hide: 0,
        descMaxLength: 5000,
        position: {
          longt: 0,
          lat: 0
        },
        editorObj: null,
        text: '',
        html: '',
        star: 0,
        descPlaceholder: '说说您您喜欢/不喜欢的点，他帮助您或公司解决了哪些业务上的问题？',
        type: 1,
        allOption: [
          '终端用户',
          '管理人员'
        ],
        category_ids: []
      }
    },
    computed: {
      isUploadImage () {
        if (this.images.length >= this.maxImageCount) {
          return false
        }
        return true
      }
    },
    components: {
      uploadImage,
      Jeditor,
      swiper,
      swiperSlide,
      Options
    },
    created () {
      this.refreshPageData()
    },
    activated: function () {
      this.refreshPageData()
    },
    mounted () {
      autoTextArea()
      window.mui.previewImage()
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    },
    methods: {
      selectCategory (event, id) {
        event.target.classList.add('active')
        this.category_ids.push(id)
      },
      refreshPageData () {
        this.initData()
        let id = this.$route.params.id

        if (!id) {
          window.mui.toast('请求异常')
          window.mui.back()
          return
        }
        this.id = id

        getProductDetail(this, id, (data) => {
          this.detail = data
          this.loading = 0
        })
      },
      switchHide () {
        this.hide = !this.hide
      },
      selectUserRole () {
        this.$refs.allOptions.toggle()
      },
      selectedItem (item) {
        this.identity = item
        this.$refs.allOptions.toggle()
      },
      uploadImageSuccess (images) {
        for (var i = 0; i < images.length; i++) {
          this.images.push(images[i])
        }
      },
      initData () {
        console.log('initData() fired')
      },
      onEditorChange (editor) {
        this.html = editor.html
        this.text = editor.text
      },
      onEditorBlur (editor) {
      },
      onEditorFocus (editor) {
      },
      onEditorReady (editor) {
        this.editorObj = editor
      },
      empty () {
        this.resetData()
        window.mui.back()
      },
      uploadImage: function () {
        if (!this.isUploadImage) {
          return false
        }
        setTimeout(() => {
          this.$refs.myAddEditor.blur()
        }, 200)
        this.$refs.uploadImage.uploadImage()
      },
      toggleHide () {
        this.hide = !this.hide
      },
      delImg (index) {
        this.images.splice(index, 1)
      },
      resetData () {
        this.description = {}
        this.images = []
        this.percentCompleted = 0
        this.$refs.myAddEditor.resetContent()
        this.hide = 0
      },
      submit () {
        var html = this.html.replace(/(<p><br><\/p>)*$/, '')
        var text = this.text.replace(/\s/g, '').trim()
        if (!text) {
          window.mui.toast('请填写内容')
          return
        }

        var data = {
          content: html,
          category_ids: this.category_ids,
          photos: [],
          product_id: this.detail.id,
          rate_star: this.star,
          isHide: this.hide,
          identity: this.identity
        }

        for (var i in this.images) {
          var compressBase64 = this.images[i].base64
          data['photos'].push(compressBase64)  // this.images[i].base64;
        }

        var options = {
          onUploadProgress: function (progressEvent) {
            this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            window.mui.uploadWaitingValue(this.percentCompleted)
          }
        }

        window.mui.showUploadWaiting()

        add(this, data, options, (res) => {
          window.mui.toast('发布成功！')
          this.resetData()
          this.$router.replace('/dianping/comment/' + res.id)
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mui-content{
    background:#fff;
  }

  .mui-ios .mui-content{
    overflow: hidden !important;
  }

  .container-bottom-menus{
    position: absolute;
    /*padding-left: 0.2rem;*/
    background: #fff;
    left:0;
  }
  .container-bottom-menus span{
    display: block;
    float: left;
    /*padding: 0 0.2rem;*/
    font-size: 0.506rem;
    color: grey;
  }
  .container-bottom-menus .productName {
    float: right;
    padding-right: 0.426rem;
    font-size: 0.346rem;
    color: #3C3E44;
    font-family:PingFangSC-Medium;
  }

  .component-photograph{
    width:1.626rem !important;
    height:1.626rem !important;
  }
  .disable{
    .icon{
      color:#DCDCDC;
    }
  }

  .component-textareaWithImage{
    position: absolute;
    left:0;
    right:0;
    bottom: 1.413rem !important;
    margin-bottom:0 !important;
  }
  .component-mark {
    padding: 0.213rem 0.426rem 0.266rem;
    span {
      color: #B4B4B6;
      font-size: 0.32rem;
      line-height: 0.44rem;
    }
    .stars {
      color: #FCC816;
      font-size: 0.613rem;
      margin-top: 0.213rem;
      margin-bottom: 0.4rem;
    }
  }
  .component-box {
    margin: 0.426rem 0 0 0.426rem;
  }

  .container-camera {
    padding-top: 0.133rem;
    display: inline-block;
  }
  .camera {
    width: 1.626rem;
    height: 1.626rem;
    position: relative;
    top: -0.133rem;
    background: #DCDCDC;
    border-radius: 0.106rem;
    margin-top: 0.266rem;
    .icon {
      font-size: 0.746rem;
      color: #FFFFFF;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
  .container-identity {
    .line-river-after {
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
    .identityTitle {
      padding: 0.32rem 0.426rem 0.293rem;
      line-height: 0.56rem;
      display: flex;
      justify-content: space-between;
      span {
        color: #444444;
        font-size: 0.4rem;
      }
      .icon {
        color: #808080;
        margin-top: 0.08rem;
      }
    }
    .assessDomain {
      color: #B4B4B6;
      font-size: 0.32rem;
      padding: 0.333rem 0.426rem 0.16rem;
      line-height: 0.44rem;
    }
    .domainList {
      padding: 0 0.426rem;
      .border-football {
        &:after {
          border-color: #DCDCDC;
        }
      }
      span {
        color: #B4B4B6;
        font-size: 0.32rem;
        line-height: 0.44rem;
        padding: 0.133rem 0.293rem;
        margin-right: 0.266rem;
        margin-top: 0.173rem;
        display: inline-block;
        border-radius: 2.666rem;
        &.active {
          color: #444444;
          background: #F3F4F6;
          &.border-football {
            &:after {
              border-color: #F3F4F6 !important;
            }
          }
        }
      }
    }
  }
  .fixedContainer {
    position: relative;
    background: #ffff;
    padding: 0.026rem 0.32rem;
    margin-top: 0.44rem;
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
</style>
<style>
  .container-editor.container-editor-add .textarea-wrapper {
    border: none;
    margin: 0;
  }
  .ql-editor {
    padding-top: 0 !important;
  }
  .quill-editor {
    height: 3rem !important;
  }
  .container-upload-images .image {
    /*margin-top: 0 !important;*/
    display: inline-block;
  }
  .component-box .swiper-container {
    display: inline-block;
  }
  .ql-container {
    height: 3rem !important;
  }

  .star-rating {
    height: 0.746rem;
    padding-top: 0.266rem;
  }
  .star-rating .rating-text {
    margin-top: -0.453rem !important;
  }
</style>
