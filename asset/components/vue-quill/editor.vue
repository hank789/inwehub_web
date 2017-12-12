<template>
  <div class="quill-editor">
    <div ref="editor"></div>
    <slot name="toolbar"></slot>
  </div>
</template>

<script>
  require('quill/dist/quill.snow.css')
  require('quill/dist/quill.bubble.css')
  require('quill/dist/quill.core.css')
  import Delta from 'quill-delta'

  if (!window.Quill) {
    window.Quill = require('quill/dist/quill.js')
  }
  export default {
    name: 'quill-editor',
    data () {
      return {
        _content: '',
        defaultModules: {
          toolbar: [
            ['bold', 'italic', {'color': []}, {'align': []}, 'image']
          ]
        }
      }
    },
    props: {
      content: String,
      value: Object,
      disabled: Boolean,
      isMonitorAddressAppear: {
        type: Boolean,
        default: false
      },
      isEnableAddressAppear: {
        type: Boolean,
        default: false
      },
      isMonitorHashSymbol: {
        type: Boolean,
        default: false
      },
      isEnableHashSymbol: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        required: false,
        default () {
          return {}
        }
      },
      isEnableImage: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      this.initialize()
    },
    beforeDestroy () {
      this.quill = null
    },
    methods: {
      resetContent (content) {
        this.quill.setContents(content)
      },
      appendContent (text, attribute) {
        setTimeout(() => {
          let range = this.quill.getSelection(true)

          this.quill.updateContents(new Delta()
              .retain(range.index)
              .insert(text, attribute)
              .insert(' ', {})
            , 'user')
          this.quill.setSelection(range.index + text.length + 1, 'user')
        }, 100)
      },
      changeAvatar: function () {
        if (window.mui.os.plus) {
          var a = [{
            title: '拍照'
          }, {
            title: '从手机相册选择'
          }]
          window.plus.nativeUI.actionSheet({
            title: '选择图片',
            cancel: '取消',
            buttons: a
          }, (b) => {
            switch (b.index) {
              case 0:
                break
              case 1:
                this.getImage()
                break
              case 2:
                this.galleryImg()
                break
              default:
                break
            }
          })
        }
      },
      getImage: function () {
        var t = this
        var c = window.plus.camera.getCamera()
        c.captureImage(function (e) {
          t.toClip(e)
        }, function (s) {
          console.log('error' + s)
        }, {
          filename: '_doc/bmp_editor.jpg'
        })
      },
      galleryImg: function () {
        window.plus.gallery.pick((a) => {
          this.toClip(a)
        }, function (a) {
        }, {
          filter: 'image'
        })
      },
      toClip (path) {
        var t = this
        window.plus.zip.compressImage({
          src: path,
          dst: '_doc/edit.jpg',
          overwrite: true,
          quality: 50
        },
          function (event) {
            window.plus.io.requestFileSystem(window.plus.io.PRIVATE_DOC,
              function (fs) {
                var rootEntry = fs.root
                var reader = null
                rootEntry.getFile('edit.jpg', {},
                  function (entry) {
                    entry.file(function (file) {
                      var size = file.size.toString()

                      if (!t.checkImg(size)) {
                        return
                      }

                      reader = new window.plus.io.FileReader()
                      reader.onloadend = function (e) {
                        let range = t.quill.getSelection(true)
                        t.quill.updateContents(new Delta()
                            .retain(range.index)
                            .delete(range.length)
                            .insert({image: e.target.result})
                            .insert('\n')
                          , 'user')
                        setTimeout(function () {
                          t.quill.setSelection(range.index + 2, 'user')
                          t.quill.focus()
                        }, 3000)
                      }
                      reader.readAsDataURL(file)
                    },
                      function (e) {
                        console.log(e.message)
                      })
                  })
              })
          }, function (error) {
            console.log(error.message)
          })
      },
      checkImg (size) {
        size = size / 1000  // kb
        if (size > 3072) {
          window.mui.alert('图片单张不允许超过3M！')
          return false
        }

        var imageNum = 0
        var delta = this.quill.getContents()
        var opt = {}
        for (var i in delta.ops) {
          opt = delta.ops[i]
          if (opt.insert.hasOwnProperty('image')) {
            if (!/drag/.test(opt.insert.image)) {
              imageNum++
            }
          }
        }

        if (imageNum >= 11) {
          window.mui.alert('最多可添加10张图片！')
          return false
        }

        return true
      },
      getLastObject (content) {
        var lastObject = content.pop()
        if (lastObject.insert === '\n' && content.length > 0) {
          return this.getLastObject(content)
        }
        return lastObject
      },
      initialize () {
        if (this.$el) {
          // 获取选项
          var self = this
          self.options.theme = self.options.theme || 'snow'
          self.options.boundary = self.options.boundary || document.body
          self.options.modules = self.options.modules || self.defaultModules
          self.options.modules.toolbar = self.options.modules.toolbar !== undefined
            ? self.options.modules.toolbar
            : self.defaultModules.toolbar
          self.options.placeholder = self.options.placeholder || '请填写内容 ...'
          self.options.readOnly = self.options.readOnly !== undefined ? self.options.readOnly : false
          self.quill = new window.Quill(self.$refs.editor, self.options)

          if (self.value || self.content) {
            self.quill.pasteHTML(self.value || self.content)
          }

          self.quill.on('selection-change', (range) => {
            if (!range) {
              self.$emit('blur', self.quill)
            } else {
              self.$emit('focus', self.quill)
            }
          })

          self.quill.on('update', () => {
            self.$emit('blur', self.quill)
          })

          // 文本变动通知更改model
          self.quill.on('text-change', (delta, oldDelta, source) => {
            self._content = self.quill.getContents()
            console.log('text-change被触发, delta:' + JSON.stringify(delta) + ', oldDelta:' + JSON.stringify(oldDelta) + ', content:' + JSON.stringify(self._content))

            var html = self.$refs.editor.children[0].innerHTML
            const text = self.quill.getText()
            if (html === '<p><br></p>') html = ''

            self.$emit('input', self._content)
            self.$emit('change', {
              editor: self.quill,
              html: html,
              text: text,
              obj: self._content,
              source: source
            })

            if (delta.ops[1] && delta.ops[1].delete) {
              // 删除操作
              // 判断删除的是否是@xxx内容，如果是, 整段删除
              var lastObject = self.getLastObject(self._content.ops)
              console.log('lastObject:' + JSON.stringify(lastObject))
              console.log('lastContent:' + JSON.stringify(self._content))

              if (self.isEnableAddressAppear) {
                if (/^@/.test(lastObject.insert)) {
                  console.log('匹配到@')
                  let range = self.quill.getSelection(true)
                  setTimeout(() => {
                    self.quill.setContents(self._content, 'user')
                    self.quill.setSelection(range.index, 'user')
                    self.$emit('addressAppearDelete', lastObject.insert)
                  }, 200)
                } else {
                  console.log('未匹配到@')
                }
              }

              if (self.isEnableHashSymbol) {
                if (/^#/.test(lastObject.insert)) {
                  console.log('匹配到#')
                  let range = self.quill.getSelection(true)
                  setTimeout(() => {
                    self.quill.setContents(self._content, 'user')
                    self.quill.setSelection(range.index, 'user')
                    self.$emit('hashSymbolDelete', lastObject.insert)
                  }, 200)
                } else {
                  console.log('未匹配到#')
                }
              }
            } else {
              var trimStr = text.trim()
              var lastChar = trimStr.charAt(trimStr.length - 1)

              if (self.isMonitorAddressAppear) {
                if (lastChar === '@') {
                  console.log('监测到@， 触发addressAppearFound')
                  self.$emit('addressAppearFound')
                  self.quill.history.undo()
                }
              }

              if (self.isMonitorHashSymbol) {
                if (lastChar === '#') {
                  console.log('监测到#， 触发hashSymbolFound')
                  self.$emit('hashSymbolFound')
                  self.quill.history.undo()
                }
              }
            }
          })

          // quill准备就绪
          self.$emit('ready', self.quill)

          // 对图片进行限制大小和限制张数
          var imgHandler = function () {
            let fileInput = this.container.querySelector('input.ql-image[type=file]')
            if (fileInput == null) {
              fileInput = document.createElement('input')
              fileInput.setAttribute('type', 'file')
              fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/jpg, image/bmp, image/x-icon')
              fileInput.classList.add('ql-image')
              fileInput.addEventListener('change', () => {
                if (fileInput.files != null && fileInput.files[0] != null) {
                  var file = fileInput.files[0]

                  if (!self.checkImg(file.size)) {
                    return
                  }

                  let reader = new FileReader()
                  reader.onload = (e) => {
                    let range = this.quill.getSelection(true)
                    this.quill.updateContents(new Delta()
                        .retain(range.index)
                        .delete(range.length)
                        .insert({image: e.target.result})
                        .insert('\n')
                      , 'user')
                    this.quill.setSelection(range.index + 2, 'user')
                    fileInput.value = ''
                  }
                  reader.readAsDataURL(file)
                }
              })
              this.container.appendChild(fileInput)
            }
            fileInput.click()
          }

          var imgHandlerMUI = function () {
            setTimeout(() => {
              self.changeAvatar()
            }, 500)
          }

          if (self.isEnableImage) {
            if (window.mui.os.plus) {
              self.quill.getModule('toolbar').addHandler('image', imgHandlerMUI)
            } else {
              self.quill.getModule('toolbar').addHandler('image', imgHandler)
            }
          }
        }
      }
    },
    watch: {
      'content' (newVal, oldVal) {
        if (this.quill) {
          if (!!newVal && newVal !== this._content) {
            this._content = newVal
            this.quill.pasteHTML(newVal)
          } else if (!newVal) {
            this.quill.setText('')
          }
        }
      },
      'value' (newVal, oldVal) {
        if (this.quill) {
          if (newVal !== this._content) {
            this._content = newVal
            this.quill.pasteHTML(newVal)
          } else if (!newVal) {
            this.quill.setText('')
          }
        }
      },
      'disabled' (newVal, oldVal) {
        if (this.quill) {
          this.quill.enable(!newVal)
        }
      }
    }
  }
</script>

<style>
  .quill-editor img {
    max-width: 100%;
  }
</style>
