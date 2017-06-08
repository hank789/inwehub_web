/**
 * Vue-Quill
 * @author edwincoder@163.com
 */

window.Quill = require('quill/dist/quill.js')
var quillEditor = require('./editor.vue')
var VueQuillEditor = {
  Quill: Quill,
  quillEditor: quillEditor,
  install: function(Vue) {
    Vue.component('quill-editor', quillEditor)
  }
}

module.exports = VueQuillEditor
