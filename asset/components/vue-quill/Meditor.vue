<template>
  <div>
    <div class="textarea-wrapper">

      <div id="toolbar">
        <button class="ql-image"></button>
      </div>

      <quill-editor ref="myTextEditor"
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

  import Quill from 'quill';
  import {ImageImport} from '../../js/modules/ImageImport.js';
  import Sortable from "sortablejs/Sortable";

  //Quill.register('modules/imageImport', ImageImport);

  import {quillEditor} from '../../components/vue-quill';

  import iconDrag from '../../statics/images/icon-drag.png';

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
          },
          imageImport: true
        }
      },
      editorObj: {},
      sortable: null
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
        default: 50000
      }
    },
    mounted() {
      this.description = this.content;
      mui.plusReady(function(){
        plus.webview.currentWebview().setStyle({
          softinputMode: "adjustResize"
        });
      });
    },
    components: {
      quillEditor
    },
    methods: {
      onEditorChange(editor){



        this.descLength = editor.editor.getLength() - 1;

        var el = document.getElementsByClassName('ql-editor')[0];



        var ps = el.childNodes;
        for (var i in ps) {
          var pNode = ps[i];
          if (pNode.nodeName !== 'P') continue;
          var imgObj = pNode.querySelector('img');
          var imgCount = pNode.querySelectorAll('img').length;
          var imgHandlerCount = pNode.querySelectorAll('.handlerImg').length;

          //console.log('imgHandlerCount:'+imgHandlerCount+','+'imgCount:'+imgCount);

          if (imgHandlerCount === 1 && imgCount === 1) {
              pNode.removeChild(imgObj);
              //pNode.className = pNode.className.replace(' hasImg', '');
              continue;
          }

          if (imgObj) {
            var imgHandlerCount = pNode.querySelectorAll('.handlerImg').length;
            if (!imgHandlerCount) {
              pNode.className += " hasImg";
              var handlerObj = document.createElement('img');
              handlerObj.className = 'handlerImg';
              handlerObj.src = iconDrag;
              pNode.insertBefore(handlerObj, pNode.childNodes[0]);
            }
          }
        }


        var self = this;

        this.sortable = Sortable.create(el, {
          ghostClass: "meditor-ghost",
          chosenClass: "meditor-chosen",
          forceFallback: true,
          handle: '.handlerImg',
          onChoose: function (e) {
            setTimeout(function () {
              self.editorObj.blur();
              self.$emit('onEditorBlur', self.editorObj);
            }, 200);
          },
          onMove: function () {
            self.editorObj.blur();
            self.$emit('onEditorBlur', self.editorObj);
          }
        });
      },
      onEditorBlur(editor) {
        //console.log('editor blur!', editor)
        this.$emit('onEditorBlur', editor)
      },
      onEditorFocus(editor) {
        //console.log('editor focus!', editor)
        this.$emit('onEditorFocus', editor)
      },
      onEditorReady(editor) {
        this.editorObj = editor;
        this.$emit('ready', editor)
      },
      onEditorReadyRead(editor) {
        this.editorReadObj = editor;
      },
    },
    watch: {
      'content'(newVal, oldVal) {
        this.description = newVal;
      },
      descLength: function (newDescLength) {
        if (newDescLength > this.descMaxLength) {
          this.editorObj.history.undo();
        }
      },
      description: function (newDescription) {
        if (!newDescription) {
          this.$emit('input', this.description);
          return;
        }

        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength);
        }

        this.$emit('input', this.description);
      },
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
</style>
