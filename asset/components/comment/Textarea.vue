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
          :descMaxLength="descMaxLength"
          :placeholder="targetUsername?'回复' + targetUsername:'在此留言'"
          @ready="onEditorReady($event)"
          @onEditorBlur="onEditorBlur"
          @onEditorFocus="onEditorFocus"
          @onEditorChange="onEditorChange"
          @addressAppearFound="addressAppearFound"
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

  const CommentTextarea = {
    data: () => ({
      showTextarea: false,
      description: {},
      textarea: '',
      descMaxLength: 5000,
      targetUsername: '',
      noticeUsers: [],
      editorObj: null
    }),
    props: {},
    components: {
      Jeditor
    },
    mounted () {
      softInput()
    },
    methods: {
      addressAppearFound () {
        console.log('found @')
      },
      onEditorChange (editor) {
        this.textarea = editor.html
      },
      onEditorBlur (editor) {
        window.mui.closeWaitingBlank()
        console.log('comment blur')
        this.showTextarea = false
      },
      onEditorFocus (editor) {
        window.mui.waitingBlank()
        console.log('comment focus')
      },
      onEditorReady (editor) {
        this.editorObj = editor
      },
      comment (targetUsername) {
        console.log('comment targetUsername:' + targetUsername)
        if (targetUsername === '') {
          this.showTextarea = !this.showTextarea
        } else {
          this.showTextarea = true
        }

        this.targetUsername = targetUsername
        targetUsername = targetUsername ? '回复' + targetUsername : '在此留言'
        this.editorObj.root.setAttribute('data-placeholder', targetUsername)

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
        this.showTextarea = false
      },
      noticeUser (uid) {
        this.noticeUsers.push(uid)
      },
      sendMessage (event) {
        event.preventDefault()
        event.stopPropagation()

        if (!this.textarea.trim()) {
          return false
        }

        var data = {
          content: this.textarea,
          noticeUsers: this.noticeUsers
        }
        this.$emit('sendMessage', data)

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
    padding: 7px 15px;
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
