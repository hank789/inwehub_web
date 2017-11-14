<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">发现</h1>
    </header>

    <div class="mui-content">
      <div class="component-textareaWithImage">
        <textarea rows="10" v-model.trim="description" @focus="textareaFocus" @blur="textareaBlur"></textarea>

        <div class="container-images">
          <div class="container-image" v-for="(image, index) in images">
            <img :id="'image_' + index" :src="image.base64"/>
          </div><div class="component-photograph" @tap.stop.prevent="selectImgs()"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>
        </div>

        <div class="bottomWrapper">
          <span class="niming"><label class="nimingCheckbox active"></label>匿名</span>
          <span class="counter"><span>{{descLength}}</span><span>/</span><span>{{descMaxLength}}</span></span>
        </div>
      </div>
      <div class="component-button-5-03aef9 button-wrapper padding-20-15">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()">确认分享</button>
      </div>

      <div class="container-bottom-menus">
        <svg class="icon menu" aria-hidden="true">
          <use xlink:href="#icon-icon-test"></use>
        </svg>
        <svg class="icon menu" aria-hidden="true">
          <use xlink:href="#icon-lianjie"></use>
        </svg>
        <div class="component-labelWithIcon float-right margin-13-15">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dingwei1"></use>
          </svg>
          您的位置

      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { selectFileH5 } from '../../utils/uploadFile'

  export default {
    data () {
      return {
        description: '',
        images: [],
        descMaxLength: 2000,
        descPlaceholder: '分享顾问新鲜事' + '\n' + '让咨询界听到你的声音…'
      }
    },
    computed: {
      descLength () {
        if (this.description === this.descPlaceholder) {
          return 0
        }
        return this.description.length
      }
    },
    components: {
    },
    methods: {
      submit () {
        if (!this.descLength) {
          window.mui.toast('请填写分享内容')
          return
        }

        if (!this.images.length) {
          window.mui.toast('请添加图片')
          return
        }
      },
      selectImgs () {
        selectFileH5('img', (file, base64) => {
          var imgInfo = {
            name: file.name,
            size: file.size,
            base64: base64,
            isNew: true
          }

          this.images.push(imgInfo)
        })
      },
      textareaFocus () {
        if (this.description === this.descPlaceholder) {
          this.description = ''
        }
      },
      textareaBlur () {
        if (this.description === '') {
          this.description = this.descPlaceholder
        }
      }
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      }
    },
    mounted () {
      this.textareaBlur()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>

</style>
