<template>
  <div>
    <div class="textarea-wrapper">

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
  import { ImageImport } from '../../js/modules/ImageImport.js';
  import Sortable from "sortablejs/Sortable";

  var renderer  = require('quilljs-renderer');
  var Document  = renderer.Document;
  renderer.loadFormat('html');

  Quill.register('modules/imageImport', ImageImport);
  import { quillEditor } from '../../components/vue-quill';

  export default {
    data: () => ({
      description:{},
      descLength:0,
      editorOption: {
        placeholder:'请填写回答',
        modules: {
          toolbar: [
            ['bold', { 'color': [] }, { 'align': [] }, 'image']
          ],
          history: {
            delay: 100,
            maxStack: 1,
            userOnly: true
          },
          imageImport: true
        }
      },
      editorObj:{},
      sortable:null
    }),
    props: {
      content:{
        type: Object,
        default: {}
      },
      rows: {
        type: Number,
        default: 5
      },
      placeholder:{
        type: String,
        default: ''
      },
      descMaxLength:{
        type: Number,
        default: 1000
      }
    },
    mounted() {
      this.description = this.content;
    },
    components: {
      quillEditor
    },
    methods:{
      onEditorChange(editor){
        this.descLength = editor.editor.getLength()-1;

        var el = document.getElementsByClassName('ql-editor')[0];

        this.sortable = Sortable.create(el, {
          ghostClass: "meditor-ghost",
          chosenClass: "meditor-chosen",
          forceFallback:true
        });
      },
      onEditorBlur(editor) {
        //console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        //console.log('editor focus!', editor)
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
  .textarea-wrapper{
    padding:0 0 20px;
    position: relative;
    border-radius: 5px;
    border:1px solid #bbbbbb;
    background: #fff;
    margin:0 5px;

  }
  .textarea-wrapper textarea{
    margin:0;
    padding-top:10px;
    padding-bottom:0;
  }
  .textarea-wrapper .counter{
    position: absolute;
    right: 10px;
    bottom: 2px;
    font-size:12px;
    color:#999;
  }
</style>
