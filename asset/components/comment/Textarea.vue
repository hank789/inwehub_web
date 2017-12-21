<template>
  <div class="commentWrapper" id="commentWrapper" v-show="showTextarea" @tap.stop.prevent="">
    <div class="textareaWrapper">

        <Jeditor
          ref="myAddEditor"
          id="commentJeditor"
          v-model.trim="description"
          :rows="1"
          :content="description"
          :descMaxLength="descMaxLength"
          :placeholder="targetUsername?'回复' + targetUsername:'在此留言'"
          @ready="onEditorReady($event)"
          @onEditorBlur="onEditorBlur"
          @onEditorFocus="onEditorFocus"
          @onEditorChange="onEditorChange"
          v-on:keydown.enter="sendMessage"
          @keydown="autoTextArea"
        ></Jeditor>

        <!--<textarea v-on:keydown.enter="sendMessage" @blur.stop.prevent="textareaBlur" @focus.stop.prevent="textareaFocus" @keydown="autoTextArea"-->
                  <!--v-model="textarea" :placeholder="targetUsername?'回复' + targetUsername:'在此留言'" id="commentTextarea"-->
                  <!--autocomplete="off"></textarea>-->
      <svg class="icon" aria-hidden="true" @tap.stop.prevent="sendMessage">
        <use xlink:href="#icon-fasong"></use>
      </svg>
    </div>
  </div>
</template>

<script>
  import { autoHeight } from '../../utils/textarea'
  import { softInput } from '../../utils/plus'
  import Jeditor from '../../components/vue-quill/Jeditor.vue'

  const CommentTextarea = {
    data: () => ({
      showTextarea: false,
      description: {},
      textarea: '',
      descMaxLength: 1000,
      targetUsername: '',
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
      onEditorChange (editor) {
        this.textarea = editor.html
      },
      onEditorBlur (editor) {
      },
      onEditorFocus (editor) {
      },
      onEditorReady (editor) {
        this.editorObj = editor
      },
      autoTextArea (event) {
        autoHeight(event)
      },
      textareaFocus () {
        window.mui.waitingBlank()
        console.log('comment focus')
      },
      textareaBlur () {
        window.mui.closeWaitingBlank()
        console.log('comment blur')
        this.showTextarea = false
      },
      comment (targetUsername) {
        if (targetUsername === '') {
          this.showTextarea = !this.showTextarea
        } else {
          this.showTextarea = true
        }

        this.targetUsername = targetUsername

        if (this.showTextarea) {
          console.log('bind comment事件')
          window.document.addEventListener('tap', (e) => {
            console.log('document tap 事件被触发')
            // this.showTextarea = false
            var commentTextareaObj = document.getElementById('commentTextarea')
            if (commentTextareaObj) {
              commentTextareaObj.blur()
            }
          }, false)

          setTimeout(() => {
            var commentTextareaObj = document.getElementById('commentTextarea')
            if (commentTextareaObj) {
              commentTextareaObj.focus()
            }
          }, 500)
        } else {
          var commentTextareaObj = document.getElementById('commentTextarea')
          if (commentTextareaObj) {
            commentTextareaObj.blur()
          }
        }
      },
      finish () {
        this.textarea = ''
        this.showTextarea = false
        document.querySelector('#commentTextarea').style.height = '20px'
      },
      sendMessage (event) {
        event.preventDefault()
        event.stopPropagation()

        if (!this.textarea.trim()) {
          return false
        }

        this.$emit('sendMessage', this.textarea)

        document.getElementById('commentTextarea').blur()
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
</style>
