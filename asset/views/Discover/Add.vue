<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left"  @tap.stop.prevent="empty()"></a>
      <h1 class="mui-title">发布</h1>
      <a @tap.stop.prevent="submit()"
         class="mui-plus-visible mui-btn appPageSubmit mui-btn-link mui-pull-right">确认分享</a>
    </header>

    <div class="mui-content">
      <div class="component-textareaWithImage container-editor container-editor-app">
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
          :isShowCounter="false"
          :allowRichStyle="false"
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

        <swiper :options="swiperOption" class="container-upload-images" v-show="images.length">
          <swiper-slide class="image" v-for="(image, index) in images" :key="'image_'+index" ><img :src="image.base64" :data-preview-src="image.base64" :data-preview-group="1"/><svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
            <use xlink:href="#icon-times1"></use>
          </svg></swiper-slide>
        </swiper>

        <swiper :options="swiperOption" class="container-pdfs" v-show="pdfs.length">
          <swiper-slide v-for="(pdf, index) in pdfs" :key="index" class="pdf">
            <span class="text-line-2">{{pdf.name}}</span><svg class="icon" aria-hidden="true" @tap.stop.prevent="delPdf(index)">
            <use xlink:href="#icon-times1"></use>
          </svg>
          </swiper-slide>
        </swiper>
        <!-- 新增链接样式 -->
        <div class="link" v-if="links.length" v-for="(link, index) in links" :key="index">
          <div class="linkBox">
            <!-- 没有图片的样式 -->
            <span class="linkIimg" v-if="!link.img_url">
              <svg class="icon" aria-hidden="true" >
                <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
              </svg>
            </span>
            <!-- 有图片的样式 -->
            <img v-else class="lazyImg" v-lazy="link.img_url" alt="">
            <div class="linkContent">
              <span v-if="link.title" class="text-line-2">{{link.title}}</span>
              <span v-else class="seat"></span>
              <div class="text-line-1">{{link.url}}</div>
            </div>
          </div>
          <div class="linkClose" @tap.stop.prevent="linkClose">
            <svg class="icon" aria-hidden="true" >
              <use xlink:href="#icon-times1"></use>
            </svg>
          </div>
        </div>

      </div>
      <div class="component-button-5-03aef9 button-wrapper padding-20-15" id="button-wrapper">
        <button type="button" class="mui-plus-hidden mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()">确认分享</button>
      </div>
    </div>

    <div class="container-bottom-menus">
        <span @tap.stop.prevent="toUser">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-icon-test2"></use>
          </svg>
        </span>
      <span @tap.stop.prevent="totags">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-biaoqian2"></use>
          </svg>
        </span>
        <span @tap.stop.prevent="uploadImage" :class="{'disable': !isUploadImage}">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-tupian"></use>
          </svg>
        </span>
        <span @tap.stop.prevent="uploadPdf" :class="{'disable': !isUploadPdf}">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-wenjian"></use>
          </svg>
        </span>
        <span @tap.stop.prevent="promptUrl" :class="{'disable': !isUploadLink}">
          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-lianjie2"></use>
          </svg>
        </span>
        <div class="component-labelWithIcon selectGroup float-right text-line-1" v-if="address" @tap.stop.prevent="selectGroup">
        <template v-if="selectedGroup.name"><svg class="icon" aria-hidden="true" >
          <use xlink:href="#icon-wodequanzi-shouye"></use>
        </svg> {{selectedGroup.name}}</template>
        <template v-else> <svg class="icon" aria-hidden="true" >
          <use xlink:href="#icon-wodequanzi-shouye"></use>
        </svg> 选择圈子</template>
        </div>
        <div class="component-labelWithIcon selectedAddress float-right text-line-1" v-if="address" @tap.stop.prevent="toAddress">
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

    <uploadFile ref="uploadFile" @success="uploadFileSuccess"></uploadFile>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import uploadImage from '../../components/uploadImage'
  import uploadFile from '../../components/uploadFile'
  import { getGeoPosition, autoTextArea } from '../../utils/plus'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import Jeditor from '../../components/vue-quill/Jeditor.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { fetchArticle } from '../../utils/url'

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
        tags: [],
        description: {},
        images: [],
        newTags: [],
        pdfs: [],
        maxImageCount: 9,
        maxPdfCount: 5,
        percentCompleted: 0,
        address: '所在位置',
        selectedAddress: '所在位置',
        hide: 0,
        descMaxLength: 5000,
        position: {
          longt: 0,
          lat: 0
        },
        editorObj: null,
        text: '',
        html: '',
        descPlaceholder: '分享顾问新鲜事' + '\n' + '让咨询界听到你的声音…',
        selectedGroup: null,
        links: [],
        showLink: true
      }
    },
    computed: {
      isUploadImage () {
        if (this.images.length >= this.maxImageCount) {
          return false
        }
        if (this.pdfs.length) {
          return false
        }
        if (this.links.length) {
          return false
        }
        return true
      },
      isUploadPdf () {
        if (this.pdfs.length >= this.maxPdfCount) {
          return false
        }
        if (this.images.length) {
          return false
        }
        if (this.links.length) {
          return false
        }
        return true
      },
      isUploadLink () {
        if (this.pdfs.length >= this.maxPdfCount) {
          return false
        }
        if (this.images.length) {
          return false
        }
        if (this.links.length) {
          return false
        }
        return true
      }
    },
    components: {
      uploadImage,
      uploadFile,
      Jeditor,
      swiper,
      swiperSlide
    },
    created () {
      getGeoPosition((position) => {
        if (position.addresses) {
          this.position = position
        }
      })
      this.readGroup()
    },
    activated: function () {
      this.initData()
    },
    mounted () {
      var referer = localEvent.getLocalItem('referer')
      if (!(referer && referer.path === '/selectUser')) {
        localEvent.clearLocalItem('selected_discover_user' + this.id)
      }

      if (referer) {
        if (referer.path === '/selecttags' || this.$route.query.from === 'selecttags') {
            // ...
        } else {
          localEvent.clearLocalItem('selected_discover_skill_tags' + this.id)
        }
      }
      autoTextArea()
      window.mui.previewImage()
    },
    methods: {
      quickUrl () {
        if (this.$route.query.url) {
          var url = this.$route.query.url
          if (!this.selectedGroup) {
            this.selectedGroup = {
              id: 39,
              name: '观点洞见'
            }
          }
          this.fetchUrlInfo(url)
        }
      },
      linkClose () {
        this.links = []
      },
      readGroup () {
        this.selectedGroup = localEvent.getLocalItem('selectedGroup' + this.id)
      },
      selectGroup () {
        this.$router.push('/group/my?from=discover_add')
      },
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
        var Address = localEvent.getLocalItem('selected_discover_address' + this.id, this.selectedAddress)
        if (Address.toString()) {
          this.selectedAddress = Address
          localEvent.setLocalItem('selected_discover_address' + this.id, this.selectedAddress)
        }
      },
      hashSymbolFound () {
        this.$refs.myAddEditor.blur()
        this.$router.push('/selecttags?from=discover')
      },
      addressAppearFound () {
        this.$refs.myAddEditor.blur()
        this.$router.push('/selectUser?from=discover', 'backAndClose')
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
        var tags = localEvent.getLocalItem('selected_discover_skill_tags' + this.id)
        for (var i in tags) {
          var name = '#' + tags[i].text + ' '
          if (name === text) {
            this.delTag(tags[i].value)
            this.delNewTag(tags[i].text)
            tags.splice(i, 1)
          }
        }
        localEvent.setLocalItem('selected_discover_skill_tags' + this.id, tags)
      },
       //  删除用户
      addressAppearDelete (text) {
        var users = localEvent.getLocalItem('selected_discover_user' + this.id)
        for (var i in users) {
          var name = '@' + users[i].name + ' '
          if (name === text) {
            this.delNoticeUser(users[i].id)
            users.splice(i, 1)
          }
        }
        localEvent.setLocalItem('selected_discover_user' + this.id, users)
      },
      syncSelectUser () {
        // 循环插入@人
        var users = this.getSelectUser()
        var spanUserNameAndIds = users.nameAndIds
        var smallSpanArr = this.$refs.myAddEditor.getSmallSpanArr()
        console.log('selected_discover_user:' + JSON.stringify(users) + ', 文本框里的人数:' + JSON.stringify(smallSpanArr))

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
        var users = localEvent.getLocalItem('selected_discover_user' + this.id)
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
        var users = localEvent.getLocalItem('selected_discover_skill_tags' + this.id)
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
      delPdf (index) {
        this.pdfs.splice(index, 1)
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
        this.readGroup()
        this.quickUrl()
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
      totags () {
        this.$refs.myAddEditor.blur()
        this.$router.push('/selecttags?from=discover')
      },
      toUser () {
        this.$refs.myAddEditor.blur()
        this.$router.push('/selectUser?from=discover', 'backAndClose', true, 'pop-in', 'close', true)
      },
      toAddress () {
        this.$refs.myAddEditor.blur()
        this.$router.push('/nearby?from=discover')
      },
      jumpToLinkMode: function () {
        this.$refs.myAddEditor.blur()
        this.$router.pushPlus('/discover/publishArticles')
        this.resetData()
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
      uploadPdf: function () {
        if (!this.isUploadPdf) {
          return false
        }
        setTimeout(() => {
          this.$refs.myAddEditor.blur()
        }, 200)
        this.$refs.uploadFile.uploadFile('pdf')
      },
      fetchUrlInfo (url) {
        fetchArticle(this, url, (data) => {
          this.links = [{
            url: url,
            title: data.title,
            img_url: data.img_url
          }]
        })
      },
      promptUrl () {
        if (!this.isUploadLink) {
          return
        }
        window.mui.prompt('插入链接卡片', '输入链接地址', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            if (e.value) {
              this.fetchUrlInfo(e.value)
            }
          }
        }, 'div')
      },
      uploadFileSuccess (pdfs) {
        this.pdfs = pdfs
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
        this.pdfs = []
        this.description = {}
        this.images = []
        this.links = []
        this.percentCompleted = 0
        this.selectedAddress = '所在位置'
        this.$refs.myAddEditor.resetContent()
        this.hide = 0
        localEvent.clearLocalItem('selected_discover_skill_tags' + this.id)
        localEvent.clearLocalItem('selected_discover_user' + this.id)
        localEvent.clearLocalItem('selected_discover_address' + this.id)
        localEvent.clearLocalItem('selectedGroup' + this.id)
      },
      submit () {
        if (!this.selectedGroup.id) {
          window.mui.toast('别忘了选择圈子后再发布！')
          return
        }

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
          files: this.pdfs,
          category_id: '',
          tags: this.tags,
          new_tags: this.newTags,
          mentions: this.noticeUsers,
          current_address_name: this.selectedAddress && this.selectedAddress !== '不显示位置' && this.selectedAddress !== '所在位置' ? this.selectedAddress : '',
          current_address_longitude: this.selectedAddress && this.selectedAddress !== '不显示位置' && this.selectedAddress !== '所在位置' ? this.position.longt : '',
          current_address_latitude: this.selectedAddress && this.selectedAddress !== '不显示位置' && this.selectedAddress !== '所在位置' ? this.position.lat : '',
          group_id: this.selectedGroup.id
        }

        if (this.links.length) {
          data.url = this.links[0].url
          data.type = 'link'
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
// 新增链接样式
  .link {
    margin-top: 0.266rem;
    padding: 0 0.506rem 0 0.346rem;
    position: relative;
    .linkBox {
      padding: 0.266rem;
      border-radius: 0.106rem;
      background: #fff;
      .linkIimg {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        text-align: center;
        line-height: 1.333rem;
        margin-right: 0.266rem;
        border-radius: 0.106rem;
        background: #ECECEE;
        .icon {
          color: #C8C8C8;
          font-size: 0.746rem;
        }
      }
      img {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        margin-right: 0.266rem;
        border-radius: 0.106rem;
      }
      .linkContent {
        font-size: 0.373rem;
        color: #808080;
        .seat {
          width: 0.266rem;
          height: 0.4rem;
          display: inline-block;
        }
        div {
          color: #B4B4B6;
          word-wrap: break-word;
        }
      }
    }
    .linkClose {
      position: absolute;
      top: -0.213rem;
      right: 0.32rem;
      .icon {
        width: 0.426rem;
        height: 0.426rem;
        color: #808080;
      }
    }
  }
  .container-pdfs{
    padding:0.266rem;
    height:2.24rem;

    .pdf{
      .icon{
        position: absolute;
        right:-0.133rem;
        top:-0.133rem;
      }

      color:#808080;
      font-size:0.373rem;
      position: relative;
      background:#fff;
      border-radius: 0.106rem;
      width:6.026rem;
      height:1.706rem;
      padding:0.266rem 0.266rem 0.266rem 1.706rem;

      &:before{
        content: 'PDF';
        color:#fff;
        position: absolute;
        left:0.266rem;
        top:0.266rem;
        background:#DF6F5A;
        border-radius: 0.106rem;
        width:1.173rem;
        height:1.173rem;
        line-height:1.173rem;
        text-align: center;
      }
    }
  }

  .category {
    background: #fff;
    /*padding: 0.4rem 0.453rem;*/
    height:1.173rem;
    position: relative;
    padding-left: 4%;

    p{
      display: inline-block;
      line-height: 1.2rem;
      font-size:0.426rem;
      color: #444444;
      text-align: left;

      &:nth-of-type(2){
        display: inline-block;
        margin-left: 0.8rem;
        color: #444444;
        font-weight: 500;
        position: relative;


        &:after {
          position: absolute;
          width: 0.853rem;

          bottom: 0;
          left: 0;
          height: 0.053rem;
          z-index: 999;
          content: '';
          background-color: #009FE8;
        }
      }
    }

    button {
      position: absolute;
      border: 0.026rem solid #03aef9;
      background-color: #03aef9;
      width: auto;
      font-size: 0.373rem;
      padding: 0rem 0.453rem;
      height: 0.906rem;
      right: 0.266rem;
      top: 0.09rem;
    }
  }

  .mui-content{
    background:#f3f4f6;
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
  .selectGroup{
    background:#03AEF9;
    width:2.32rem;
  }

  .selectedAddress{
    width:2.32rem;
  }

  .disable{
    .icon{
      color:#DCDCDC;
    }
  }
</style>

<style>
  #discoverAddJeditor .textarea-wrapper{
    border:none;
    background: #f3f4f6;
    padding:0 0.266rem;
  }

  #discoverAddJeditor .counter{
    bottom:-2.533rem;
  }

  #discoverAddJeditor .ql-editor.ql-blank::before{
    font-style:normal;
    font-size: 0.373rem;
    color: #9b9b9b;
  }
  #discoverAddJeditor .textarea-wrapper .quill-editor {
    height: 4.8rem;
  }
  #discoverAddJeditor .quill-editor .ql-container {
    height: 4.8rem;
    font-size: 0.373rem;
    color: #9b9b9b;
  }
  #discoverAddJeditor .counter {
    bottom: 0;
    font-size: 0.373rem;
    color: #c8c8c8;
  }
  #discoverAddJeditor .ql-editor .ql-size-small{
    font-size: 0.426rem;
  }

  #discoverAddJeditor .ql-snow .ql-editor a{
    text-decoration: none;
  }

  #button-wrapper{
    padding-bottom:1.706rem !important;
  }

  .component-labelWithIcon{
    margin: 0.346rem 0.133rem;
  }


</style>
