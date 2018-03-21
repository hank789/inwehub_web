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
      showTextarea: false,
      description: {},
      cacheKey: '',
      textarea: '',
      text: '',
      descMaxLength: 5000,
      targetUsername: '',
      noticeUsers: [],
      editorObj: null,
      oldList: [],
      commentData: [], // 评论时需要的参数
      historyDescription: [], // 历史内容
      focusCallback: null,  // 获取焦点时的回调
      allowBr: false
    }),
    props: {},
    components: {
      Jeditor
    },
    activated () {
      this.init()
    },
    mounted () {
      var referer = localEvent.getLocalItem('referer')
      if (!(referer && referer.path === '/selectUser')) {
        localEvent.clearLocalItem('comment_selectUser' + this.id)
      }

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
        setTimeout(() => {
          this.syncSelectUser()
        }, 500)
      },
      resetData () {
        this.textarea = ''
        this.noticeUsers = []
        this.delCurrentHistoryDescription()
        localEvent.clearLocalItem('comment_selectUser' + this.id)
        this.$refs.myAddEditor.resetContent()
        this.showTextarea = false
      },
      addressAppearDelete (text) {
        var users = localEvent.getLocalItem('comment_selectUser' + this.id)
        for (var i in users) {
          var name = '@' + users[i].name + ' '
          if (name === text) {
            this.delNoticeUser(users[i].id)
            users.splice(i, 1)
          }
        }
        localEvent.setLocalItem('comment_selectUser' + this.id, users)
      },
      getSelectUser () {
        var users = localEvent.getLocalItem('comment_selectUser' + this.id)
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
        console.log('comment_selectUser:' + JSON.stringify(users) + ', 文本框里的人数:' + JSON.stringify(smallSpanArr))

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
        setTimeout(() => {
          this.editorObj.blur()
        }, 200)
        this.$router.pushPlus('/selectUser?from=comment', 'backAndClose')
      },
      init () {
        console.log('init() fired')
        this.oldList = this.commentData.commentList
        var result = onceGet(this, this.cacheKey)
        if (result) {
          setTimeout(() => {
            this.commentData.commentList = this.oldList
            this.commentData.list = null  // 临时解决方案，强制discuss刷新列表, 等待删除
            this.focusCallback = () => {
              this.focusCallback = null
              this.initEditorData()
            }
            this.editorObj.setContents(this.description)
            this.editorObj.focus()
          }, 100)
        }
      },
      onEditorChange (editor) {
        this.textarea = editor.html
        this.text = editor.text
      },
      onEditorBlur (editor) {
        window.mui.closeWaitingBlank()
        console.log('comment blur')
        this.showTextarea = false

        this.setHistoryDescription()
      },
      delCurrentHistoryDescription () {
        for (var i in this.historyDescription) {
          if (this.historyDescription[i].targetUsername === this.targetUsername) {
            this.historyDescription.splice(i, 1)
          }
        }
      },
      setHistoryDescription () {
        this.delCurrentHistoryDescription()

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
        this.resetData()
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
      sendMessage (event) {
        event.preventDefault()
        event.stopPropagation()

        var textarea = this.textarea
        textarea = textarea.replace(/(<p><br><\/p>)*$/, '')

        if (!textarea.trim()) {
          return false
        }

        var text = this.text.replace(/\s/g, '').trim()
        if (!text) {
          return
        }

        textarea = textarea.replace(/target="_blank" class="ql-size-small"/g, 'target="_self" class="ql-size-small appUrl"')

        var data = {
          content: textarea,
          noticeUsers: this.noticeUsers,
          commentData: this.commentData
        }
        this.$emit('sendMessage', data)
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:comment:success',
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
