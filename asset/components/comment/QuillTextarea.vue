<template>
  <div class="commentWrapper" id="commentWrapper" v-show="showTextarea || alwaysshow" @tap.stop.prevent="">
    <div class="textareaWrapper">
        <Jeditor
          ref="myAddEditor"
          id="commentJeditor"
          v-model.trim="description"
          :content="description"
          :rows="1"
          :isMonitorAddressAppear="true"
          :isMonitorSmallSpan="false"
          :descMaxLength="descMaxLength"
          :placeholder="placeholder"
          :allowBr="false"
          :allowRichStyle="false"
          @ready="onEditorReady($event)"
          @smallSpanArrChange="smallSpanArrChange"
          @onEditorBlur="onEditorBlur"
          @onEditorFocus="onEditorFocus"
          @onEditorChange="onEditorChange"
          @addressAppearFound="addressAppearFound"
          @addressAppearDelete="addressAppearDelete"
          v-on:keydown.enter="_submit"
        ></Jeditor>
    </div>
    <div class="send font-family-medium" :class="value.length - 2 ? 'active' : ''" @tap.stop.prevent="_submit">发送</div>
  </div>
</template>

<script>
  import { softInput } from '../../utils/plus'
  import Jeditor from '../../components/vue-quill/Jeditor.vue'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  const CommentTextarea = {
    data: () => ({
      id: currentUser.user_id,
      showTextarea: false,
      descMaxLength: 5000,
      noticeUsers: [],
      description: {},
      editorObj: null,
      isCache: false,
      placeholder: '在此留言',
      value: '',
      cacheValue: '',
      editorReadyCallback: ''
    }),
    props: {
      alwaysshow: false
    },
    components: {
      Jeditor
    },
    activated () {
      this.init()
    },
    mounted () {
      var referer = localEvent.getLocalItem('referer')
      if (!(referer && referer.path === '/selectUser')) {
        localEvent.clearLocalItem('selected_comment_user' + this.id)
      }

      this.init()
      softInput()
    },
    methods: {
      refreshPageData () {
        this.init()
      },
      smallSpanArrChange (arr) {
        setTimeout(() => {
          this.syncSelectUser()
        }, 500)
      },
      isShow () {
        return this.showTextarea
      },
      hide () {
        this.showTextarea = false
      },
      resetData () {
        this.value = ''
        this.noticeUsers = []
        localEvent.clearLocalItem('selected_comment_user' + this.id)
        this.$refs.myAddEditor.resetContent()
        this.showTextarea = false
      },
      addressAppearDelete (text) {
        var users = localEvent.getLocalItem('selected_comment_user' + this.id)
        for (var i in users) {
          var name = '@' + users[i].name + ' '
          if (name === text) {
            this.delNoticeUser(users[i].id)
            users.splice(i, 1)
          }
        }
        localEvent.setLocalItem('selected_comment_user' + this.id, users)
      },
      getSelectUser () {
        var users = localEvent.getLocalItem('selected_comment_user' + this.id)
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
      syncSelectUser () {
        // 循环插入@人
        var users = this.getSelectUser()
        var spanUserNameAndIds = users.nameAndIds
        var smallSpanArr = this.$refs.myAddEditor.getSmallSpanArr()
        console.log('selected_comment_user:' + JSON.stringify(users) + ', 文本框里的人数:' + JSON.stringify(smallSpanArr))

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

        // 文本框里未选择的，都要删除
        var deleteUser = []
        var spanUserNames = users.names

        for (var n in smallSpanArr) {
          if (spanUserNames.indexOf(smallSpanArr[n]) === -1) {
            deleteUser.push(smallSpanArr[n])
          }
        }
        this.$refs.myAddEditor.delSmallSpan(deleteUser)
      },
      initEditorData () {
        console.log('initEditorData() fired')

        this.syncSelectUser()
      },
      //  监听@事件
      addressAppearFound () {
        setTimeout(() => {
          this.editorObj.blur()
        }, 200)
        this.$router.pushPlus('/selectUser?from=comment', 'backAndClose')
      },
      init () {
        console.log('init() fired')
      },
      onEditorChange (editor) {
        this.value = editor.html
      },
      onEditorBlur (editor) {
        window.mui.closeWaitingBlank()
        console.log('comment blur')
        this.showTextarea = false
      },
      onEditorFocus (editor) {
        alert('ok')
        window.mui.waitingBlank()
        console.log('comment focus')
      },
      setPlaceholder (placeholder) {
        this.placeholder = placeholder
        this.$refs.myAddEditor.setPlaceholder(this.placeholder)
      },
      onEditorReady (editor) {
        this.editorObj = editor
        if (this.editorReadyCallback) {
          this.editorReadyCallback()
        }
      },
      setValue (value) {},
      setDescription (description) {
        this.editorObj.setContents(description)
      },
      cacheShow (id, value, cancelCallback, submitCallback) {
        this.isCache = true
        this.setValue(value)
        this.setDescription({})
        this.cacheId = this.$route.name + '_' + id
        var cache = localEvent.getLocalItem(this.cacheId)
        if (cache.value) {
          this.cacheValue = cache.value
          this.setPlaceholder('')
          this.setDescription(cache.value)
          localEvent.clearLocalItem(this.cacheId)
        }
        this._show(cancelCallback, submitCallback)
      },
      _show (cancelCallback, submitCallback) {
        this.cancelCallback = cancelCallback
        this.submitCallback = submitCallback
        this.showTextarea = true
        setTimeout(() => {
          this.editorObj.focus()
        }, 500)
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
      close () {
        this.showTextarea = false
      },
      _submit (event) {
        event.preventDefault()
        event.stopPropagation()

        var textarea = this.value
        textarea = textarea.replace(/(<p><br><\/p>)*$/, '')

        if (!textarea.trim()) {
          return false
        }

        textarea = textarea.replace(/target="_blank" class="ql-size-small"/g, 'target="_self" class="ql-size-small appUrl"')

        if (this.submitCallback) {
          var rs = this.submitCallback(this.value)
          if (rs) {
            this.value = ''
            this.close()
          }
        } else {
          this.close()
        }
      }
    }
  }
  export default CommentTextarea
</script>

<style scoped="scoped">
  .commentWrapper {
    background: #F3F4F5;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    min-height: 1.2rem;
    overflow: hidden;
    padding: 0.133rem 0.4rem;
    z-index: 10001;
  }

  .commentWrapper .textareaWrapper {
    position: relative;
    background: #fff;
    border-radius: 0.133rem;
    min-height: 0.933rem;
    width: 88%;
  }
  .commentWrapper .send {
    position: absolute;
    right: 0.426rem;
    bottom: 0.32rem;
    color: #B4B4B6;
    font-size: 0.4rem;
  }
  .commentWrapper .send.active {
    color: #03AEF9;
  }

  .commentWrapper textarea {
    border: none;
    display: inline-block;
    width: 100%;
    height: 0.533rem;
    margin: 0.16rem 0 0;
    padding: 0 0.826rem 0 0.133rem;
    font-size: 0.373rem;

  }

  .commentWrapper textarea::placeholder {
    color: #c8c8c8;
  }

  .commentWrapper .icon {
    position: absolute;
    right: 0.133rem;
    color: #03aef9;
    font-size: 0.693rem;
    bottom: 0.133rem;
  }

  .commentShadowWrapper{
    display: none;
    position: absolute;
    left:0;
    width:100%;
    bottom:0;
  }
</style>

<style>
  #commentJeditor .textarea-wrapper{
    border:none;
    background: none;
    padding-bottom:0;
  }

  #commentJeditor .counter{
    bottom:-2.533rem;
  }
  #commentJeditor .ql-editor.ql-blank::before{
    font-style:normal;
    margin-top:0.053rem;
    font-size: 0.373rem;
    color: #9b9b9b;
  }
  #commentJeditor .textarea-wrapper .quill-editor {
    min-height:0.933rem;
    height:auto;
  }
  #commentJeditor .quill-editor .ql-container {
    min-height: 0.933rem;
    height:auto;
    font-size: 0.373rem;
    color: #9b9b9b;
  }
  #commentJeditor .counter {
    display: none;
  }
  #commentJeditor .ql-editor .ql-size-small{
    font-size: 0.426rem;
  }

  #commentJeditor .ql-snow .ql-editor a{
    text-decoration: none;
  }
  #commentJeditor .ql-editor {
    box-sizing: border-box;
    line-height: 1.42;
    height: 100%;
    outline: none;
    overflow-y: auto;
    padding: 0.186rem 0.666rem 0.186rem 0.24rem;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  #commentJeditor .ql-editor p {
    position: relative;
    color: #444444;
  }
</style>
