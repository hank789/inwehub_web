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
                    :isMonitorHashSymbol="isMonitorHashSymbol"
                    :isEnableHashSymbol="true"
                    :isMonitorSmallSpan="true"
                    :allowBr="allowBr"
                    :allowRichStyle="allowRichStyle"
                    @change="onEditorChange($event)"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    @addressAppearFound="addressAppearFound"
                    @hashSymbolFound="hashSymbolFound"
                    @addressAppearDelete="addressAppearDelete"
                    @hashSymbolDelete="hashSymbolDelete"
                    @smallSpanArrChange="smallSpanArrChange"
      >
      </quill-editor>


      <span class="counter" v-if="isShowCounter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
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
      isMonitorHashSymbol: {
        type: Boolean,
        default: false
      },
      isShowCounter: {
        type: Boolean,
        default: true
      },
      allowBr: {  // 是否允许换行
        type: Boolean,
        default: true
      },
      allowRichStyle: {  // 是否允许粘贴原样式
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
      getSmallSpanArr () {
        return this.$refs.myTextEditor.getSmallSpanArr()
      },
      smallSpanArrChange (data) {
        this.$emit('smallSpanArrChange', data)
      },
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
      appendTexts (arr, position = 'current') {
        this.$refs.myTextEditor.appendContents(arr, position)
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
        console.log('editor focus!', editor)
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
    padding: 0 0 0.533rem;
    position: relative;
    border-radius: 0.133rem;
    border: 0.026rem solid #bbbbbb;
    background: #fff;
    margin: 0 0.133rem;

  }

  .textarea-wrapper textarea {
    margin: 0;
    padding-top: 0.266rem;
    padding-bottom: 0;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 0.266rem;
    bottom: 0.053rem;
    font-size: 0.32rem;
    color: #999;
  }

  #toolbar{
    display: none;
  }
</style>
