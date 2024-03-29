<template>
  <div>
    <div class="textarea-wrapper">
      <div id="toolbar">
        <button class="ql-image"></button>
      </div>

      <quill-editor :id="id" ref="myTextEditor"
                    v-model="description"
                    :options="editorOption"

                    @change="onEditorChange($event)"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)">
      </quill-editor>
      <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
    </div>
  </div>
</template>

<script type="text/javascript">

  import Quill from 'quill'
  import { ImageImport } from '../../js/modules/ImageImport.js'
  import Sortable from 'sortablejs/Sortable'

  Quill.register('modules/imageImport', ImageImport)

  import { quillEditor } from '../../components/vue-quill'

  import iconDrag from '../../statics/images/icon-drag.png'
  import { autoTextArea } from '../../utils/plus'
  import { getAnswerCache, setAnswerCache } from '../../utils/allPlatform'

  export default {
    data: () => ({
      description: {},
      descLength: 0,
      editorOption: {
        debug: false,
        placeholder: '请填写内容',
        modules: {
          toolbar: '#toolbar',
          history: {
            delay: 100,
            maxStack: 1,
            userOnly: true
          },
          imageImport: false
        }
      },
      editorObj: {},
      sortable: null
    }),
    props: {
      id: {
        type: String
      },
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
        default: '请填写内容'
      },
      descMaxLength: {
        type: Number,
        default: 5000
      }
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
      nowSave () {
        var contents = this.description
        this.saveCacheContent(contents)
      },
      onEditorChange (editor) {
        this.saveCacheContent(editor.editor.getContents())

        this.descLength = editor.editor.getLength() - 1

        var el = document.getElementsByClassName('ql-editor')[0]

        var ps = el.childNodes
        for (var i in ps) {
          var pNode = ps[i]
          if (pNode.nodeName !== 'P') continue
          var imgObj = pNode.querySelector('img')
          var imgCount = pNode.querySelectorAll('img').length
          var imgHandlerCount = pNode.querySelectorAll('.handlerImg').length

          // console.log('imgHandlerCount:'+imgHandlerCount+','+'imgCount:'+imgCount);

          if (imgHandlerCount === 1 && imgCount === 1) {
            pNode.removeChild(imgObj)
            // pNode.className = pNode.className.replace(' hasImg', '');
            continue
          }

          if (imgObj) {
            imgHandlerCount = pNode.querySelectorAll('.handlerImg').length
            if (!imgHandlerCount) {
              pNode.className += ' hasImg'
              var handlerObj = document.createElement('img')
              handlerObj.className = 'handlerImg'
              handlerObj.src = iconDrag
              pNode.insertBefore(handlerObj, pNode.childNodes[0])
            }
          }
        }

        var self = this

        this.sortable = Sortable.create(el, {
          ghostClass: 'meditor-ghost',
          chosenClass: 'meditor-chosen',
          forceFallback: true,
          handle: '.handlerImg',
          onChoose: function (e) {
            setTimeout(function () {
              self.editorObj.blur()
              self.$emit('onEditorBlur', self.editorObj)
            }, 200)
          },
          onMove: function () {
            self.editorObj.blur()
            self.$emit('onEditorBlur', self.editorObj)
          }
        })
      },
      saveCacheContent (content) {
        for (var i in content.ops) {
          if (content.ops[i].insert.hasOwnProperty('image')) {
            if (/drag/.test(content.ops[i].insert.image)) {
              content.ops.splice(i, 1)
            }
          }
        }
        setAnswerCache(this.id, content, this)
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
        console.log('newid' + this.id)
        this.initDefaultValue()
      },
      setPlaceholder (placeholder) {
        this.$refs.myTextEditor.setPlaceholder(placeholder)
      },
      initDefaultValue () {
        getAnswerCache(this.id, (contents) => {
          if (!contents) {
            contents = []
          }
          this.editorObj.setContents(contents)
        }, this)
      },
      onEditorReady (editor) {
        this.editorObj = editor
        this.$emit('ready', editor)
        this.initDefaultValue()
      },
      onEditorReadyRead (editor) {
        this.editorReadObj = editor
      }
    },
    watch: {
      'id' (newVal, oldVal) {
        this.refreshPageData()
      },
      'content' (newVal, oldVal) {
        this.description = newVal
      },
      descLength: function (newDescLength) {
        if (newDescLength > this.descMaxLength) {
          this.editorObj.history.undo()
        }
      },
      placeholder: {
        handler: function (newValue) {
          this.editorOption.placeholder = newValue
        },
        immediate: true
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
</style>
