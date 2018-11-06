<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back :tapCallback="empty"></Back>
      <h1 class="mui-title">发布点评</h1>
      <a @tap.stop.prevent="submit()"
         class="mui-btn appPageSubmit mui-btn-link mui-pull-right">确认发布</a>
    </header>

    <div class="mui-content addDianPing">
      <div class="component-mark">
        <span>就您的感受而言，您会给他打多少分？</span>
        <div class="stars">
          <star-rating
            :increment="0.1"
            :round-start-rating="false"
            v-model="star"
            :padding="8"
            :activeColor="'#fcc816'"
            :star-size="20"
            :show-rating="true"
            :border-color="'#fcc816'"
            :border-width="3"
            :inactive-color="'#FFFFFF'"
            :starPoints="[938.5,323.6,704,289.8,599,76.3,595.3,69.9,586.6,58.2,576.3,48,564.5,39.2,558.1,35.3,552.8,32.6,541.9,28.4,530.6,25.6,519,24.2,513,24.1,506.3,24.3,493,26.1,480.4,29.6,468.4,34.7,457.3,41.4,447.1,49.7,438.1,59.3,430.4,70.3,427,76.3,319.5,289.8,85,323.6,77.9,325,64.3,329.6,51.4,336.2,39.7,344.7,34.3,349.7,30.8,353.3,24.5,360.8,19,368.8,14.5,377.2,10.8,385.9,8,394.9,6.1,404,5,413.3,4.9,422.6,5.6,431.9,7.3,441.1,9.8,450.1,13.2,458.9,17.5,467.4,22.8,475.5,28.9,483.2,32.3,486.9,202.2,652.8,161.8,887.3,161.1,894.6,161.3,909.3,163.6,923.8,168,937.8,171,944.6,174.3,950.6,182,961.8,191,971.6,201.3,980.1,212.6,987.1,224.8,992.5,237.7,996.2,251.2,998.2,258,998.4,263.6,998.3,274.7,997.1,285.5,994.5,296,990.7,301.1,988.2,511,877.6,721.4,988.2,726.7,990.8,737.5,995.1,748.8,997.9,760.2,999.3,766,999.4,767.5,999.4,774.1,999.1,780.8,998.4,785.6,997.5,794.8,995.1,803.8,991.9,812.3,987.8,820.3,982.9,827.7,977.2,834.6,970.7,840.9,963.4,843.8,959.5,846.5,955.6,851.4,947.4,855.4,938.8,858.6,929.9,860.8,920.7,862.1,911.3,862.4,901.7,861.8,892.1,861.2,887.3,820.7,652.8,990.7,486.9,995.7,481.4,1004.2,469.5,1010.9,456.6,1015.4,442.6,1016.8,435.2,1017.7,430.3,1018.5,420.6,1018.4,411,1017.3,401.6,1015.3,392.4,1012.4,383.5,1008.6,375,1004,366.9,998.7,359.3,992.7,352.3,985.9,345.8,978.6,340,970.6,334.9,962,330.6,953,327.1,943.4,324.5,938.5,323.6,938.5,323.6]"
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
          <span>{{ !identity ? '请告诉我们您的身份' : identity }}</span>
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-jinru"></use>
          </svg>
        </div>
        <div class="line-river-after line-river-after-top"></div>
        <div class="assessDomain">您的评价属于哪个领域</div>
        <div class="domainList">
          <span class="border-football" :class="{active: !!category.selected}" @tap.stop.prevent="selectCategory($event, category)" v-for="(category, index) in detail.categories">{{ category.name }}</span>
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
  import Vue from 'vue'

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
        ]
      }
    },
    computed: {
      isUploadImage () {
        if (this.images.length >= this.maxImageCount) {
          return false
        }
        return true
      },
      category_ids () {
        var ids = []
        for (var i in this.detail.categories) {
          var item = this.detail.categories[i]
          if (item.selected) {
            ids.push(item.id)
          }
        }
        return ids
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
      selectCategory (event, item) {
        Vue.set(item, 'selected', !item.selected)
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

        if (!this.identity) {
          window.mui.toast('请选择您的身份')
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
    margin: 0 0 0 0.426rem;
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
  .addDianPing .container-editor.container-editor-add .textarea-wrapper {
    border: none;
    margin: 0;
  }
  .addDianPing .ql-editor {
    padding-top: 0 !important;
  }
  .addDianPing .quill-editor {
    height: 2rem !important;
  }
 .addDianPing .container-upload-images .image {
    /*margin-top: 0 !important;*/
    display: inline-block;
  }
  .addDianPing .component-box .swiper-container {
    display: inline-block;
  }
 .addDianPing .ql-container {
    height: 2rem !important;
  }

  .addDianPing .star-rating {
    height: 0.746rem;
    padding-top: 0.266rem;
  }
  .addDianPing .star-rating .rating-text {
    margin-top: -0.453rem !important;
  }
</style>
