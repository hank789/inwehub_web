<template>
  <div>
    <div class="textarea-wrapper">
      <div id="toolbar">
        <button class="ql-image"></button>
      </div>

      <quill-editor :id="''" ref="myTextEditor"
                    v-model="description"
                    :options="editorOption"
                    :isEnableImage="false"
                    :isEnableAddressAppear="true"
                    :isMonitorAddressAppear="isMonitorAddressAppear"
                    :isEnableHashSymbol="true"
                    :isMonitorSmallSpan="true"
                    :allowBr="allowBr"
                    @change="onEditorChange($event)"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    @addressAppearFound="addressAppearFound"
                    @hashSymbolFound="hashSymbolFound"
                    @addressAppearDelete="addressAppearDelete"
                    @hashSymbolDelete="hashSymbolDelete"
      >
      </quill-editor>


      <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { quillEditor } from '../../components/vue-quill'

  import { autoTextArea } from '../../utils/plus'

  export default {
    data: () => ({
      description: {},
      descLength: 0,
      editorOption: {
        debug: false,
        placeholder: '请填写回答',
        modules: {
          toolbar: '#toolbar',
          history: {
            delay: 100,
            maxStack: 1,
            userOnly: true
          }
        }
      },
      editorObj: {}
    }),
    props: {
      content: {
        type: Object,
        default: {}
      },
      rows: {
        type: Number,
        default: 5
      },
      placeholder: {
        type: String,
        default: ''
      },
      descMaxLength: {
        type: Number,
        default: 5000
      },
      isMonitorAddressAppear: {
        type: Boolean,
        default: false
      },
      allowBr: {  // 是否允许换行
        type: Boolean,
        default: true
      }
    },
    created () {
      this.editorOption.placeholder = this.placeholder
    },
    mounted () {
      autoTextArea()

      window.onbeforeunload = (e) => {
        e = e || window.event

        // 兼容IE8和Firefox 4之前的版本
        if (e) {
          e.returnValue = '关闭后未保存的数据将丢失'
        }

        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return '关闭后未保存的数据将丢失'
      }
    },
    components: {
      quillEditor
    },
    methods: {
      delSmallSpan (nowValue) {
        this.$refs.myTextEditor.delSmallSpan(nowValue)
      },
      setPlaceholder (placeholder) {
        this.$refs.myTextEditor.setPlaceholder(placeholder)
      },
      focus () {
        this.$refs.myTextEditor.focus()
      },
      blur () {
        this.$refs.myTextEditor.blur()
      },
      resetHtml (html) {
        this.$refs.myTextEditor.resetHtml(html)
      },
      resetContent (content = []) {
        this.$refs.myTextEditor.resetContent(content)
      },
      addressAppearDelete (text) {
        this.$emit('addressAppearDelete', text)
      },
      hashSymbolDelete (text) {
        this.$emit('hashSymbolDelete', text)
      },
      appendText (text, attribute, position = 'current') {
        this.$refs.myTextEditor.appendContent(text, attribute, position)
      },
      addressAppearFound () {
        this.$emit('addressAppearFound')
      },
      hashSymbolFound () {
        this.$emit('hashSymbolFound')
      },
      onEditorChange (editor) {
        this.descLength = editor.editor.getLength() - 1
        this.$emit('onEditorChange', editor)
      },
      onEditorBlur (editor) {
        // console.log('editor blur!', editor)
        this.$emit('onEditorBlur', editor)
      },
      onEditorFocus (editor) {
        // console.log('editor focus!', editor)
        this.$emit('onEditorFocus', editor)
      },
      refreshPageData () {
        console.log('newid:' + this.id)
      },
      onEditorReady (editor) {
        this.editorObj = editor
        this.$emit('ready', editor)
      },
      onEditorReadyRead (editor) {
        this.editorReadObj = editor
      }
    },
    watch: {
      'content' (newVal, oldVal) {
        this.description = newVal
      },
      'id' (newVal, oldVal) {
        this.refreshPageData()
      },
      descLength: function (newDescLength) {
        if (newDescLength > this.descMaxLength) {
          this.editorObj.history.undo()
        }
      },
      description: function (newDescription) {
        if (!newDescription) {
          this.$emit('input', this.description)
          return
        }

        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }

        this.$emit('input', this.description)
      }
    }
  }
</script>

<style scoped>
  .textarea-wrapper {
    padding: 0 0 20px;
    position: relative;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
    background: #fff;
    margin: 0 5px;

  }

  .textarea-wrapper textarea {
    margin: 0;
    padding-top: 10px;
    padding-bottom: 0;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 10px;
    bottom: 2px;
    font-size: 12px;
    color: #999;
  }

  #toolbar{
    display: none;
  }
</style>
