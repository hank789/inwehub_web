<template>
  <div class="commentWrapper" id="commentWrapper" v-show="showTextarea" @tap.stop.prevent="">
    <div class="textareaWrapper">
        <Jeditor
          ref="myAddEditor"
          id="commentJeditor"
          v-model.trim="description"
          :rows="1"
          :content="description"
          :isMonitorAddressAppear="true"
          :isMonitorSmallSpan="true"
          :descMaxLength="descMaxLength"
          :placeholder="targetUsername?'回复' + targetUsername:'在此留言'"
          :allowBr="false"
          @ready="onEditorReady($event)"
          @smallSpanArrChange="smallSpanArrChange"
          @onEditorBlur="onEditorBlur"
          @onEditorFocus="onEditorFocus"
          @onEditorChange="onEditorChange"
          @addressAppearFound="addressAppearFound"
          @addressAppearDelete="addressAppearDelete"
          v-on:keydown.enter="sendMessage"
        ></Jeditor>

        <svg class="icon" aria-hidden="true" @tap.stop.prevent="sendMessage">
          <use xlink:href="#icon-fasong"></use>
        </svg>
    </div>
  </div>
</template>

<script>
  import { softInput } from '../../utils/plus'
  import Jeditor from '../../components/vue-quill/Jeditor.vue'
  import { onceGet, onceSave } from '../../utils/cache'
  import localEvent from '../../stores/localStorage'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  const CommentTextarea = {
    data: () => ({
      id: currentUser.user_id,
      user: [],
      userName: [],
      currentUser: [],
      showTextarea: false,
      description: {},
      cacheKey: '',
      textarea: '',
      descMaxLength: 5000,
      targetUsername: '',
      noticeUsers: [],
      editorObj: null,
      oldList: [],
      commentData: [], // 评论时需要的参数
      historyDescription: [], // 历史内容
      focusCallback: null  // 获取焦点时的回调
    }),
    props: {},
    components: {
      Jeditor
    },
    activated () {
      this.init()
    },
    mounted () {
      this.init()
      softInput()
    },
    created () {
      this.cacheKey = this.$route.name + '_comment_textarea'
    },
    methods: {
      refreshPageData () {
        this.init()
      },
      smallSpanArrChange (arr) {
        this.currentUser = []
        for (var i in arr) {
          var val = arr[i].replace('@', '').trim()
          if (this.currentUser.indexOf(val) === -1) {
            this.currentUser.push(val)
          }
        }
      },
     // 重置数据
      resetData () {
        this.noticeUsers = []
        this.user = []
        this.userName = []
        this.historyDescription = []
        localEvent.clearLocalItem('comment_selectUser' + this.id)
      },
    // 监听删除事件
      addressAppearDelete (text) {
        var name = text.substring(1, text.length - 1)
        for (var i in this.user) {
          if (this.user[i].name === name) {
            this.noticeUsers.splice(i, 1)
            this.user.splice(i, 1)
            this.userName.splice(i, 1)
          }
        }
        localEvent.setLocalItem('comment_selectUser' + this.id, this.user)
      },
      initEditorData () {
        // 循环插入@人
        this.user = localEvent.getLocalItem('comment_selectUser' + this.id)
        // 检测删除的人
        this.userName = []
        this.noticeUsers = []
        for (var num = 0; num < this.user.length; num++) {
          if (this.userName.indexOf(this.user[num].name) === -1) {
            this.userName.push(this.user[num].name)
            this.noticeUser(this.user[num].id)
            if (this.currentUser.indexOf(this.user[num].name) === -1) {
              this.$refs.myAddEditor.appendText('@' + this.user[num].name + ' ', {
                'color': '#42AEF9',
                'size': 'small',
                'link': '/share/resume/' + this.user[num].uuid + '?goback=1'
              })
            }
          }
        }
        var deleteUser = []
       // 删除多余的html
        for (var n in this.currentUser) {
          if (this.userName.indexOf(this.currentUser[n]) === -1) {
            deleteUser.push('@' + this.currentUser[n] + ' ')
          }
        }
        console.log(deleteUser)
        this.$refs.myAddEditor.delSmallSpan(deleteUser)
        deleteUser = []
      },
      //  监听@事件
      addressAppearFound () {
        console.debug(this.$data)
        onceSave(this, this.cacheKey, {
          showTextarea: this.showTextarea,
          description: this.description,
          cacheKey: this.cacheKey,
          targetUsername: this.targetUsername,
          noticeUsers: this.noticeUsers,
          commentData: this.commentData,
          currentUser: this.currentUser
        })
        window.mui.closeWaitingBlank()
        this.$router.pushPlus('/selectUser?from=comment')
      },
      init () {
        console.log('init() fired')
        this.oldList = this.commentData.commentList
        var result = onceGet(this, this.cacheKey)
        if (result) {
          setTimeout(() => {
            this.commentData.commentList = this.oldList
            this.focusCallback = () => {
              console.log('initEditorData() fired')
              this.focusCallback = null
              this.initEditorData()
            }
            this.editorObj.setContents(this.description)
            this.editorObj.focus()
          }, 300)
        }
      },
      onEditorChange (editor) {
        this.textarea = editor.html
      },
      onEditorBlur (editor) {
        window.mui.closeWaitingBlank()
        console.log('comment blur')
        this.showTextarea = false

        for (var i in this.historyDescription) {
          if (this.historyDescription[i].targetUsername === this.targetUsername) {
            this.historyDescription.splice(i, 1)
          }
        }

        this.historyDescription.push({
          targetUsername: this.targetUsername,
          description: this.description
        })
      },
      getHistoryDescription () {
        for (var i in this.historyDescription) {
          if (this.historyDescription[i].targetUsername === this.targetUsername) {
            this.editorObj.setContents(this.historyDescription[i].description)
            this.historyDescription.splice(i, 1)
            break
          }
        }
      },
      onEditorFocus (editor) {
        if (!this.textarea.replace('<p> </p>', '').trim()) {
          this.editorObj.setContents([{insert: ' '}])
          var targetUsername = this.targetUsername ? '回复' + this.targetUsername : '在此留言'
          this.$refs.myAddEditor.setPlaceholder(targetUsername)
        }

        if (this.focusCallback) {
          this.focusCallback()
        }

        window.mui.waitingBlank()
        console.log('comment focus')
      },
      onEditorReady (editor) {
        this.editorObj = editor
      },
      comment (data) {
        var targetUsername = data.targetUsername
        console.log('comment targetUsername:' + targetUsername)
        this.commentData = data.commentData
        if (targetUsername === '') {
          this.showTextarea = !this.showTextarea
        } else {
          this.showTextarea = true
        }

        this.targetUsername = targetUsername

        var textarea = this.textarea
        textarea = textarea.replace(/(<p><br><\/p>)*$/, '')

        this.editorObj.setContents([{insert: ' '}])

        this.getHistoryDescription()

        console.log('comment-textarea:' + textarea)
        if (!textarea.trim()) {
          targetUsername = targetUsername ? '回复' + targetUsername : '在此留言'
          this.$refs.myAddEditor.setPlaceholder(targetUsername)
        }

        if (this.showTextarea) {
          console.log('bind comment事件')
          window.document.addEventListener('tap', (e) => {
            console.log('document tap 事件被触发')
            this.editorObj.blur()
          }, false)

          setTimeout(() => {
            this.editorObj.focus()
          }, 500)
        } else {
          this.editorObj.blur()
        }
      },
      finish () {
        this.textarea = ''
        this.noticeUsers = []
        this.$refs.myAddEditor.resetContent()
        this.showTextarea = false
      },
      // 获取添加@用户的id
      noticeUser (id) {
        this.noticeUsers.push(id)
      },
      // 获取删除@用户的id
      delUser (uid) {
        for (var i in this.noticeUsers) {
          if (this.noticeUsers[i].uuid == uid) {
            this.noticeUsers.splice(i, 1)
          }
        }
      },
      sendMessage (event) {
        event.preventDefault()
        event.stopPropagation()

        var textarea = this.textarea
        textarea = textarea.replace(/(<p><br><\/p>)*$/, '')

        if (!textarea.trim()) {
          return false
        }

        var data = {
          content: textarea,
          noticeUsers: this.noticeUsers,
          commentData: this.commentData
        }
        this.$emit('sendMessage', data)
        this.resetData()
        this.editorObj.blur()
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
    min-height: 45px;
    overflow: hidden;
    padding: 5px 15px;
    z-index: 10001;
  }

  .commentWrapper .textareaWrapper {
    position: relative;
    background: #fff;
    border-radius: 5px;
    min-height: 35px;
  }

  .commentWrapper textarea {
    border: none;
    display: inline-block;
    width: 100%;
    height: 20px;
    margin: 6px 0 0;
    padding: 0 31px 0 5px;
    font-size: 14px;

  }

  .commentWrapper textarea::placeholder {
    color: #c8c8c8;
  }

  .commentWrapper .icon {
    position: absolute;
    right: 5px;
    color: #03aef9;
    font-size: 26px;
    bottom: 5px;
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
    bottom:-95px;
  }
  #commentJeditor .ql-editor.ql-blank::before{
    font-style:normal;
    margin-top:2px;
    font-size: 14px;
    color: #9b9b9b;
  }
  #commentJeditor .textarea-wrapper .quill-editor {
    min-height:35px;
    height:auto;
  }
  #commentJeditor .quill-editor .ql-container {
    min-height: 35px;
    height:auto;
    font-size: 14px;
    color: #9b9b9b;
  }
  #commentJeditor .counter {
    display: none;
  }
  #commentJeditor .ql-editor .ql-size-small{
    font-size: 16px;
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
    padding: 7px 25px 7px 9px;
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
