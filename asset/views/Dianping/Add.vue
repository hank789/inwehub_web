<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back :tapCallback="empty"></Back>
      <h1 class="mui-title">发布点评</h1>
      <a @tap.stop.prevent="submit()"
         class="mui-btn appPageSubmit mui-btn-link mui-pull-right">确认发布</a>
    </header>

    <div class="mui-content">

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
        @ready="onEditorReady($event)"
        @onEditorBlur="onEditorBlur"
        @onEditorFocus="onEditorFocus"
        @onEditorChange="onEditorChange"
      ></Jeditor>

      <div class="component-textareaWithImage container-editor container-editor-app">
        <swiper :options="swiperOption" class="container-upload-images" v-show="images.length">
          <swiper-slide class="image" v-for="(image, index) in images" :key="'image_'+index" ><img :src="image.base64" :data-preview-src="image.base64" :data-preview-group="1"/><svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
            <use xlink:href="#icon-times1"></use>
          </svg></swiper-slide>
        </swiper>
      </div>
    </div>

    <div class="container-bottom-menus">

      <span @tap.stop.prevent="uploadImage" :class="{'disable': !isUploadImage}">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-tupian"></use>
          </svg>
        </span>
    </div>

    <uploadImage ref="uploadImage"
                 :isMultiple="true"
                 @success="uploadImageSuccess"
                 :ImageMaximum="maxImageCount - this.images.length"
    ></uploadImage>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import uploadImage from '../../components/uploadImage'
  import { autoTextArea } from '../../utils/plus'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import Jeditor from '../../components/vue-quill/Jeditor.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    data () {
      return {
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 10,
          freeMode: true
        },
        id: currentUser.user_id,
        noticeUsers: [],
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
        descPlaceholder: '说说您您喜欢/不喜欢的点，他帮助您或公司解决了哪些业务上的问题？'
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
      swiperSlide
    },
    created () {},
    activated: function () {
      this.initData()
    },
    mounted () {
      autoTextArea()
      window.mui.previewImage()
    },
    methods: {
      uploadImageSuccess (images) {
        for (var i = 0; i < images.length; i++) {
          this.images.push(images[i])
        }
      },
      refreshPageData () {
        this.initData()
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
        if (this.$route.query.from) {
          window.mui.back()
        } else {
          this.$router.pushPlus('/home')
        }
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
          type: 'text',
          title: html,
          photos: []
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

        postRequest(`article/store`, data, false, options).then(response => {
          var code = response.data.code
          if (code === 6101) {
            // 已存在
            window.mui.toast(response.data.message)
            this.$router.replace(response.data.data.exist_url)
            return
          }
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          window.mui.toast('发布成功！')
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:discover:publishSuccessfully',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.$route.fullPath,
                'page_name': this.$route.name,
                'page_title': this.$route.meta.title,
                'referrer_page': ''
              }
            )
          }
          this.resetData()
          this.$router.replace('/c/' + response.data.data.category_id + '/' + response.data.data.slug)
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
    padding-left: 0.2rem;
    background: #fff;
    left:0;
  }
  .container-bottom-menus span{
    display: block;
    float: left;
    padding: 0 0.2rem;
    font-size: 0.506rem;
    color: grey;
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
</style>


