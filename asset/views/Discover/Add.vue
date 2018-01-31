<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left"  @tap.stop.prevent="empty()"></a>
      <h1 class="mui-title">分享</h1>
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
          :isMonitorAddressAppear="true"
          :isMonitorHashSymbol="true"
          :isMonitorSmallSpan="true"
          @ready="onEditorReady($event)"
          @onEditorBlur="onEditorBlur"
          @onEditorFocus="onEditorFocus"
          @onEditorChange="onEditorChange"
          @addressAppearFound="addressAppearFound"
          @hashSymbolFound="hashSymbolFound"
          @hashSymbolDelete="hashSymbolDelete"
          @addressAppearDelete="addressAppearDelete"
          @smallSpanArrChange="smallSpanArrChange"
        ></Jeditor>

        <div class="container-images" :class="'container-images-' + (images.length + 1)">
          <div class="container-image" v-for="(image, index) in images">
            <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
              <use xlink:href="#icon-times1"></use>
            </svg>
            <img :id="'image_' + index" :src="image.base64" :data-preview-src="image.base64" :data-preview-group="1"/>
          </div><div class="container-image component-photograph" @tap.stop.prevent="uploadImage()" v-if="images.length < maxImageCount"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangji1"></use></svg></div>
        </div>

        <div class="bottomWrapper">
          <span class="niming" @tap.stop.prevent="toggleHide"><label class="nimingCheckbox" :class="{'active':hide}" v-if="false"></label><!--匿名--></span>
        </div>
      </div>
      <div class="component-button-5-03aef9 button-wrapper padding-20-15" id="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()">确认分享</button>
      </div>
    </div>

    <div class="container-bottom-menus">
        <span @tap.stop.prevent="toUser">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-icon-test1"></use>
          </svg>
        </span>
      <span @tap.stop.prevent="totags">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-icon-test"></use>
          </svg>
        </span>
      <span @tap.stop.prevent="jumpToLinkMode()">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-lianjie"></use>
          </svg>
        </span>
      <div class="component-labelWithIcon float-right margin-13-15" v-if="address" @tap.stop.prevent="toAddress">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dingwei1"></use>
        </svg>
        {{selectedAddress}}
        </div>
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
  import { getGeoPosition, autoTextArea } from '../../utils/plus'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import Jeditor from '../../components/vue-quill/Jeditor.vue'

  export default {
    data () {
      return {
        id: currentUser.user_id,
        noticeUsers: [],
        tags: [],
        description: {},
        images: [],
        newTags: [],
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
    created () {
      getGeoPosition((position) => {
        if (position.addresses) {
          this.position = position
        }
      })
    },
    activated: function () {
      this.initData()
    },
    mounted () {
      var referer = localEvent.getLocalItem('referer')
      if (!(referer && referer.path === '/selectUser')) {
        localEvent.clearLocalItem('discover_selectUser' + this.id)
      }
      if (!(referer && referer.path === '/selecttags')) {
        localEvent.clearLocalItem('discover_skill_tags' + this.id)
      }
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
      getAddress () {
        // 获取地理位置
        var Address = localEvent.getLocalItem('discover_Address' + this.id, this.selectedAddress)
        if (Address.toString()) {
          this.selectedAddress = Address
          localEvent.setLocalItem('discover_Address' + this.id, this.selectedAddress)
        }
      },
      hashSymbolFound () {
        this.$refs.myAddEditor.blur()
        this.$router.pushPlus('/selecttags?from=discover')
      },
      addressAppearFound () {
        this.$refs.myAddEditor.blur()
        this.$router.pushPlus('/selectUser?from=discover', 'backAndClose')
      },
      smallSpanArrChange (arr) {
        setTimeout(() => {
          console.log('smallSpanArrChange() fired')
          this.syncSelectUser()
          this.syncSelectTags()
          this.syncDelete()
        }, 1000)
      },
      // 删除标签
      hashSymbolDelete (text) {
        var tags = localEvent.getLocalItem('discover_skill_tags' + this.id)
        for (var i in tags) {
          var name = '#' + tags[i].text + ' '
          if (name === text) {
            this.delTag(tags[i].value)
            this.delNewTag(tags[i].text)
            tags.splice(i, 1)
          }
        }
        localEvent.setLocalItem('discover_skill_tags' + this.id, tags)
      },
       //  删除用户
      addressAppearDelete (text) {
        var users = localEvent.getLocalItem('discover_selectUser' + this.id)
        for (var i in users) {
          var name = '@' + users[i].name + ' '
          if (name === text) {
            this.delNoticeUser(users[i].id)
            users.splice(i, 1)
          }
        }
        localEvent.setLocalItem('discover_selectUser' + this.id, users)
      },
      syncSelectUser () {
        // 循环插入@人
        var users = this.getSelectUser()
        var spanUserNameAndIds = users.nameAndIds
        var smallSpanArr = this.$refs.myAddEditor.getSmallSpanArr()
        console.log('discover_selectUser:' + JSON.stringify(users) + ', 文本框里的人数:' + JSON.stringify(smallSpanArr))

        // 已选的用户都要添加上
        var waitAddArr = []
        for (var num = 0; num < spanUserNameAndIds.length; num++) {
          var selectUserName = spanUserNameAndIds[num].name
          var selectUserid = spanUserNameAndIds[num].id
          if (smallSpanArr.indexOf(selectUserName) === -1) {
            waitAddArr.push({
              text: selectUserName,
              attribute: {
                'color': '#42AEF9',
                'size': 'small',
                'link': 'https://m.inwehub.com/#/share/resume/' + selectUserid + '?goback=1'
              }
            })
          }
        }
        if (waitAddArr.length) {
          this.$refs.myAddEditor.appendTexts(waitAddArr)
        }
      },
      syncDelete () {
        // 文本框里未选择的，都要删除
        var users = this.getSelectUser()
        var userNames = users.names
        var tags = this.getSelectTags().names
        var all = userNames.concat(tags)

        var deleteArr = []
        var smallSpanArr = this.$refs.myAddEditor.getSmallSpanArr()
        for (var n in smallSpanArr) {
          if (all.indexOf(smallSpanArr[n]) === -1) {
            deleteArr.push(smallSpanArr[n])
          }
        }
        this.$refs.myAddEditor.delSmallSpan(deleteArr)
      },
      syncSelectTags () {
        var tags = this.getSelectTags().names
        var smallSpanArr = this.$refs.myAddEditor.getSmallSpanArr()
        console.log('discover_selectttag:' + JSON.stringify(tags) + ', 文本框里的人数:' + JSON.stringify(smallSpanArr))

        // 已选的tag都要添加上
        var waitAddArr = []
        for (var num = 0; num < tags.length; num++) {
          var selectUserName = tags[num]
          if (smallSpanArr.indexOf(selectUserName) === -1) {
            waitAddArr.push({
              text: selectUserName,
              attribute: {
                'color': '#225180',
                'size': 'small'
              }
            })
          }
        }
        if (waitAddArr.length) {
          this.$refs.myAddEditor.appendTexts(waitAddArr)
        }
      },
      getSelectUser () {
        var users = localEvent.getLocalItem('discover_selectUser' + this.id)
        var spanUserNameAndIds = []
        var spanUserNames = []
        for (var i in users) {
          this.noticeUser(users[i].id)
          var data = {
            name: '@' + users[i].name + ' ',
            id: users[i].uuid
          }
          spanUserNameAndIds.push(data)
          spanUserNames.push(data.name)
        }
        return {
          nameAndIds: spanUserNameAndIds,
          names: spanUserNames
        }
      },
      getSelectTags () {
        var users = localEvent.getLocalItem('discover_skill_tags' + this.id)
        var spanUserNameAndIds = []

        var spanNames = []
        for (var i in users) {
          this.addTags(users[i].value)
          var data = {
            name: '#' + users[i].text + ' ',
            id: users[i].value
          }
          spanUserNameAndIds.push(data)
          spanNames.push(data.name)
        }
        return {
          nameAndIds: spanUserNameAndIds,
          names: spanNames
        }
      },
      addTags (tag) {
        // 判断是否是字符串
        if (typeof (tag) === 'string') {
          if (this.newTags.indexOf(tag) === -1) {
            this.newTags.push(tag)
          }
          return
        }
        this.delTag(tag)
        this.tags.push(tag)
      },
      delTag (tag) {
        var index = this.tags.indexOf(tag)
        if (index > -1) {
          this.tags.splice(index, 1)
        }
      },
      delNewTag (tag) {
        var index = this.newTags.indexOf(tag)
        if (index > -1) {
          this.newTags.splice(index, 1)
        }
      },
      noticeUser (id) {
        this.delNoticeUser(id)
        this.noticeUsers.push(id)
      },
      delNoticeUser (id) {
        var noticeIndex = this.noticeUsers.indexOf(id)
        if (noticeIndex > -1) {
          this.noticeUsers.splice(noticeIndex, 1)
        }
      },
      initData () {
        console.log('initData() fired')
        this.syncSelectUser()
        this.syncSelectTags()
        this.syncDelete()

        this.getAddress()
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
        this.$refs.myAddEditor.blur()
        this.$router.pushPlus('/selecttags?from=discover')
      },
      toUser () {
        this.$refs.myAddEditor.blur()
        this.$router.pushPlus('/selectUser?from=discover', 'backAndClose', true, 'pop-in', 'close', true)
      },
      toAddress () {
        this.$refs.myAddEditor.blur()
        this.$router.pushPlus('/nearby?from=discover')
      },
      jumpToLinkMode: function () {
        this.$refs.myAddEditor.blur()
        this.$router.pushPlus('/discover/publishArticles')
        this.resetData()
      },
      uploadImage: function () {
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
        this.tags = []
        this.newTags = []
        this.noticeUsers = []
        this.description = {}
        this.images = []
        this.percentCompleted = 0
        this.selectedAddress = '所在位置'
        this.$refs.myAddEditor.resetContent()
        this.hide = 0
        localEvent.clearLocalItem('discover_skill_tags' + this.id)
        localEvent.clearLocalItem('discover_selectUser' + this.id)
        localEvent.clearLocalItem('discover_Address' + this.id)
      },
      submit () {
        var html = this.html.replace(/(<p><br><\/p>)*$/, '')
        var text = this.text.replace(/\s/g, '').trim()
        if (!text) {
          window.mui.toast('请填写分享内容')
          return
        }

        html = html.replace(/target="_blank" class="ql-size-small"/g, 'target="_self" class="ql-size-small appUrl"')

        var data = {
          type: 'text',
          title: html,
          photos: [],
          category_id: '',
          tags: this.tags,
          new_tags: this.newTags,
          mentions: this.noticeUsers,
          current_address_name: this.selectedAddress && this.selectedAddress !== '不显示位置' && this.selectedAddress !== '所在位置' ? this.selectedAddress : '',
          current_address_longitude: this.selectedAddress && this.selectedAddress !== '不显示位置' && this.selectedAddress !== '所在位置' ? this.position.longt : '',
          current_address_latitude: this.selectedAddress && this.selectedAddress !== '不显示位置' && this.selectedAddress !== '所在位置' ? this.position.lat : ''
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
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mui-content{
    background: #fff;
  }

  .mui-ios .mui-content{
    overflow: hidden !important;
  }

  .container-bottom-menus{
    position: absolute;
    padding-left: 7.5px;
    left:0;
  }
  .container-bottom-menus span{
    display: block;
    float: left;
    padding: 0 7.5px;
    font-size: 19px;
    color: grey;
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

  #button-wrapper{
    padding-bottom:64px !important;
  }
</style>
