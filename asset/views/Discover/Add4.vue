<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left"  @tap.stop.prevent="empty()"></a>
      <h1 class="mui-title">发布动态</h1>
    </header>

    <div class="mui-content">
      <div class="component-textareaWithImage">

        <Jeditor
          ref="myAddEditor"
          id="discoverAddJeditor"
          v-model.trim="description"
          :rows="10"
          :descMaxLength="descMaxLength"
          :placeholder="descPlaceholder"
          @ready="onEditorReady($event)"
          @onEditorBlur="onEditorBlur"
          @onEditorFocus="onEditorFocus"
          @onEditorChange="onEditorChange"
          @addressAppearFound="addressAppearFound"
        ></Jeditor>

        <div class="container-images">
          <div class="container-image" v-for="(image, index) in images">
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
              <use xlink:href="#icon-times1"></use>
            </svg>
            <img :id="'image_' + index" :src="image.base64"/>
          </div><div class="component-photograph" @tap.stop.prevent="uploadImage()" v-if="images.length < maxImageCount"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>
        </div>

        <div class="bottomWrapper">
          <span class="niming" @tap.stop.prevent="toggleHide"><label class="nimingCheckbox" :class="{'active':hide}" v-if="false"></label><!--匿名--></span>
          <span class="counter"><span>{{descLength}}</span><span>/</span><span>{{descMaxLength}}</span></span>
        </div>
      </div>
      <div class="component-button-5-03aef9 button-wrapper padding-20-15">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()">确认分享</button>
      </div>

      <div class="container-bottom-menus">
        <!--<svg class="icon menu" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/selectUser')">-->
          <!--<use xlink:href="#icon-icon-test1"></use>-->
        <!--</svg>-->
        <svg class="icon menu" aria-hidden="true" @tap.stop.prevent="totags">
          <use xlink:href="#icon-icon-test"></use>
        </svg>
        <svg class="icon menu" aria-hidden="true" @tap.stop.prevent="jumpToLinkMode()">
          <use xlink:href="#icon-lianjie"></use>
        </svg>
        <div class="component-labelWithIcon float-right margin-13-15" v-if="address" @tap.stop.prevent="selectAddress">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dingwei1"></use>
          </svg>
          {{selectedAddress}}
      </div>
      </div>
    </div>

    <uploadImage ref="uploadImage"
      v-model="images"
      :images="images"
      :isMultiple="true"
      :ImageMaximum="3"
    ></uploadImage>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import uploadImage from '../../components/uploadImage'
  import { getGeoPosition, autoTextArea } from '../../utils/plus'
  import localEvent from '../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        id: currentUser.user_id,
        tags: [],
        description: '',
        images: [],
        maxImageCount: 3,
        percentCompleted: 0,
        address: '',
        selectedAddress: '',
        hide: 0,
        descMaxLength: 2000,
        position: {
          longt: 0,
          lat: 0
        },
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
      uploadImage
    },
    methods: {
      addressAppearFound () {
        this.$refs.myAddEditor.appendText('@test', {
          bold: true,
          'color': '#ffff00',
          link: true
        })
      },
      onEditorChange (editor) {
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
        this.$router.pushPlus('/home')
      },
      totags () {
        localEvent.setLocalItem('discover_description' + this.id, this.description)
        this.$router.push('/selecttags?from=discover')
      },
      jumpToLinkMode: function () {
        this.$router.pushPlus('/discover/publishArticles')
      },
      uploadImage: function () {
        var textarea = window.document.getElementById('discoverTextarea')
        if (textarea) {
          textarea.blur()
        }
        this.$refs.uploadImage.uploadImage()
      },
      selectAddress () {
        var userPicker = new window.mui.PopPicker()

        userPicker.setData([
          {
            value: '1',
            text: this.address
          },
          {
            value: '2',
            text: '不显示位置'
          }
        ])
        if (this.selectedAddress === '不显示位置') {
          userPicker.pickers[0].setSelectedValue('2')
        } else {
          userPicker.pickers[0].setSelectedValue('1')
        }

        userPicker.show(items => {
          this.selectedAddress = items[0].text
          userPicker.dispose()
        })
      },
      toggleHide () {
        this.hide = !this.hide
      },
      delImg (index) {
        this.images.splice(index, 1)
      },
      resetData () {
        this.tags = []
        this.description = ''
        this.images = []
        this.percentCompleted = 0
        this.hide = 0
        localEvent.clearLocalItem('discover_description' + this.id)
        localEvent.clearLocalItem('selected_discover_skill_tags' + this.id)
      },
      submit () {
        if (!this.descLength) {
          window.mui.toast('请填写分享内容')
          return
        }

        var data = {
          type: 'text',
          title: this.description,
          photos: [],
          category_id: '',
          tags: this.tags,
          current_address_name: this.selectedAddress && this.selectedAddress !== '不显示位置' ? this.selectedAddress : '',
          current_address_longitude: this.selectedAddress && this.selectedAddress !== '不显示位置' ? this.position.longt : '',
          current_address_latitude: this.selectedAddress && this.selectedAddress !== '不显示位置' ? this.position.lat : ''
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
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.resetData()
          this.$router.push('/discover/add/success')
        })
      },
      textareaFocus () {
        console.log('textareaFocus')
        if (this.description === this.descPlaceholder) {
          this.description = ''
        }
      },
      textareaBlur () {
        console.log('textareaBlur')
        if (this.description === '') {
          this.description = this.descPlaceholder
        }
      },
      initData () {
        this.textareaBlur()
        var placeholder = localEvent.getLocalItem('discover_description' + this.id)
        if (placeholder.length) {
          this.description = placeholder
        } else {
          this.description = this.descPlaceholder
        }

        var tag = localEvent.getLocalItem('selected_discover_skill_tags' + this.id)
        for (var i in tag) {
          this.tags = this.tags.concat(tag[i].value)
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
    created () {
      getGeoPosition((position) => {
        if (position.addresses) {
          this.position = position
          this.address = position.addresses
          this.selectedAddress = this.address
        }
      })
    },
    activated: function () {
      this.initData()
    },
    mounted () {
      autoTextArea()
      this.initData()
      console.log('images:' + JSON.stringify(this.images))
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mui-content{
    background: #fff;
  }

  .container-bottom-menus{
    position: absolute;
    left:0;
  }
</style>
