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
          :content="description"
          :descMaxLength="descMaxLength"
          :placeholder="descPlaceholder"
          @ready="onEditorReady($event)"
          @onEditorBlur="onEditorBlur"
          @onEditorFocus="onEditorFocus"
          @onEditorChange="onEditorChange"
          @addressAppearFound="addressAppearFound"
          @hashSymbolDelete="hashSymbolDelete"
          @addressAppearDelete="addressAppearDelete"
        ></Jeditor>

        <div class="container-images" :class="'container-images-' + (images.length + 1)">
          <div class="container-image" v-for="(image, index) in images">
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
              <use xlink:href="#icon-times1"></use>
            </svg>
            <img :id="'image_' + index" :src="image.base64"/>
          </div><div class="container-image component-photograph" @tap.stop.prevent="uploadImage()" v-if="images.length < maxImageCount"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>
        </div>

        <div class="bottomWrapper">
          <span class="niming" @tap.stop.prevent="toggleHide"><label class="nimingCheckbox" :class="{'active':hide}" v-if="false"></label><!--匿名--></span>
        </div>
      </div>
      <div class="component-button-5-03aef9 button-wrapper padding-20-15">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()">确认分享</button>
      </div>

      <div class="container-bottom-menus">
        <svg class="icon menu" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/selectUser')">
          <use xlink:href="#icon-icon-test1"></use>
        </svg>
        <svg class="icon menu" aria-hidden="true" @tap.stop.prevent="totags">
          <use xlink:href="#icon-icon-test"></use>
        </svg>
        <svg class="icon menu" aria-hidden="true" @tap.stop.prevent="jumpToLinkMode()">
          <use xlink:href="#icon-lianjie"></use>
        </svg>
        <div class="component-labelWithIcon float-right margin-13-15" v-if="address" @tap.stop.prevent="$router.pushPlus('/nearby?from=discover')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dingwei1"></use>
          </svg>
          {{selectedAddress}}
      </div>
      </div>
    </div>

    <uploadImage ref="uploadImage" v-model="images"
      :isMultiple="true"
      :images="images"
      :ImageMaximum="maxImageCount"
    ></uploadImage>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import uploadImage from '../../components/uploadImage'
  import { getGeoPosition, autoTextArea } from '../../utils/plus'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import Jeditor from '../../components/vue-quill/Jeditor.vue'

  export default {
    data () {
      return {
        id: currentUser.user_id,
        tag: [],
        tags: [],
        tagsName: [],
        user: [],
        userId: [],
        userName: [],
        description: {},
        images: [],
        maxImageCount: 9,
        percentCompleted: 0,
        address: '所在位置',
        selectedAddress: '所在位置',
        hide: 0,
        descMaxLength: 2000,
        position: {
          longt: 0,
          lat: 0
        },
        editorObj: null,
        text: '',
        html: '',
        descPlaceholder: '分享顾问新鲜事' + '\n' + '让咨询界听到你的声音…'
      }
    },
    computed: {},
    components: {
      uploadImage,
      Jeditor
    },
    methods: {
      refreshPageData () {
        this.initData()
      },
      addressAppearFound () {
        this.$refs.myAddEditor.appendText('@', {})
      },
//      删除标签
      hashSymbolDelete (text) {
        var name = text.substring(1, text.length - 1)
//        console.error(name)
        for (var i in this.tag) {
          if (this.tag[i].text === name) {
            this.tag.splice(i, 1)
            this.tags.splice(i, 1)
            this.tagsName.splice(i, 1)
          }
        }
        localEvent.setLocalItem('discover_skill_tags' + this.id, this.tag)
      },
      addressAppearDelete (text) {
        var name = text.substring(1, text.length - 1)
//        console.error(name)
        for (var i in this.user) {
          if (this.user[i].name === name) {
            this.user.splice(i, 1)
            this.userId.splice(i, 1)
            this.userName.splice(i, 1)
          }
        }
        localEvent.setLocalItem('select_users' + this.id, this.user)
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
        this.$refs.myAddEditor.blur()
        this.$refs.uploadImage.uploadImage()
      },
//      selectAddress () {
//        var userPicker = new window.mui.PopPicker()
//
//        userPicker.setData([
//          {
//            value: '1',
//            text: this.address
//          },
//          {
//            value: '2',
//            text: '不显示位置'
//          }
//        ])
//        if (this.selectedAddress === '不显示位置') {
//          userPicker.pickers[0].setSelectedValue('2')
//        } else {
//          userPicker.pickers[0].setSelectedValue('1')
//        }
//
//        userPicker.show(items => {
//          this.selectedAddress = items[0].text
//          userPicker.dispose()
//        })
//      },
      toggleHide () {
        this.hide = !this.hide
      },
      delImg (index) {
        this.images.splice(index, 1)
      },
      resetData () {
        this.tags = []
        this.tagsName = []
        this.userId = []
        this.userName = []
        this.description = {}
        this.images = []
        this.percentCompleted = 0
        this.$refs.myAddEditor.resetContent()
        this.hide = 0
        localEvent.clearLocalItem('discover_description' + this.id)
        localEvent.clearLocalItem('discover_skill_tags' + this.id)
        localEvent.clearLocalItem('select_users' + this.id)
        localEvent.clearLocalItem('discover_Address' + this.id)
      },
      submit () {
        var html = this.html.replace(/(<p><br><\/p>)*$/, '')
        if (!html) {
          window.mui.toast('请填写分享内容')
          return
        }

        var data = {
          type: 'text',
          title: html,
          photos: [],
          category_id: '',
          tags: this.tags,
          mentions: this.userId,
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
      initData () {
        // 循环插入标签
        this.tag = localEvent.getLocalItem('discover_skill_tags' + this.id)
        for (var i = 0; i < this.tag.length; i++) {
          if (this.tags.indexOf(this.tag[i].value) === -1) {
            this.tags.push(this.tag[i].value)
          }
          if (this.tagsName.indexOf(this.tag[i].text) === -1) {
            this.tagsName.push(this.tag[i].text)
            this.$refs.myAddEditor.appendText('#' + this.tag[i].text + ' ', {
              'color': '#225180',
              'size': 'small'
            })
          }
        }
        // 循环插入@人
        this.user = localEvent.getLocalItem('select_users' + this.id)
        for (var num = 0; num < this.user.length; num++) {
          if (this.userId.indexOf(this.user[num].id) === -1) {
            this.userId.push(this.user[num].id)
          }
          if (this.userName.indexOf(this.user[num].name) === -1) {
            this.userName.push(this.user[num].name)
            this.$refs.myAddEditor.appendText('@' + this.user[num].name + ' ', {
              'color': '#42AEF9',
              'size': 'small',
              'link': '/share/resume/' + this.user[num].uuid + '?goback=1'
            })
          }
        }
        // 获取地理位置
        var Address = localEvent.getLocalItem('discover_Address' + this.id, this.selectedAddress)
        if (Address.toString()) {
          this.selectedAddress = Address
          localEvent.setLocalItem('discover_Address' + this.id, this.selectedAddress)
        } else {
          // 存入定位
          if (this.selectedAddress) {
            localEvent.setLocalItem('discover_Address' + this.id, this.selectedAddress)
          }
        }
      }
    },
    created () {
      getGeoPosition((position) => {
        if (position.addresses) {
          this.position = position
//          this.address = position.addresses
          this.selectedAddress = this.address
          if (this.selectedAddress) {
            localEvent.setLocalItem('discover_Address' + this.id, this.selectedAddress)
          }
        }
      })
    },
    activated: function () {
      this.initData()
    },
    mounted () {
      autoTextArea()
      this.initData()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mui-content{
    background: #fff;
    overflow: hidden !important;
  }

  .container-bottom-menus{
    position: absolute;
    left:0;
  }

  .component-photograph{
    width:61px !important;
    height:61px !important;
  }
</style>

<style>
  #discoverAddJeditor .textarea-wrapper{
    border:none;
    background: #f3f4f6;
  }

  #discoverAddJeditor .counter{
    bottom:-95px;
  }

  #discoverAddJeditor .ql-editor.ql-blank::before{
    font-style:normal;
    font-size: 14px;
    color: #9b9b9b;
  }
  #discoverAddJeditor .textarea-wrapper .quill-editor {
    height: 230px;
  }
  #discoverAddJeditor .quill-editor .ql-container {
    height: 230px;
    font-size: 14px;
    color: #9b9b9b;
  }
  #discoverAddJeditor .counter {
    bottom: -95px;
    font-size: 14px;
    color: #c8c8c8;
  }
  #discoverAddJeditor .ql-editor .ql-size-small{
    font-size: 16px;
  }

  #discoverAddJeditor .ql-snow .ql-editor a{
    text-decoration: none;
  }
</style>
