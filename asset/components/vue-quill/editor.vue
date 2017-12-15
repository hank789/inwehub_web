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
      isMonitorSmallSpan: {
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
      focus () {
        this.quill.focus()
      },
      blur () {
        this.quill.blur()
      },
      resetContent (content) {
        this.quill.setContents(content)
      },
      appendContent (text, attribute, position = 'current') {
        console.log('run appendContent: text:' + text + ', attribute:' + attribute + ', position:' + position)
        // position 可选值是current, first

        var appendChar = /^(@|#)/.test(text) ? ' ' : ''

        setTimeout(() => {
          let range = this.quill.getSelection(true)
          var positionNum = 0
          if (position === 'current') {
            positionNum = range.index
          }
          this.quill.updateContents(new Delta()
              .retain(positionNum)
              .insert(text, attribute)
              .insert(appendChar, {})
            , 'user')
          this.quill.setSelection(range.index + text.length + 1, 'user')
        }, 100)
      },
      toLast (msg = ' ', attribute = {}) {
        var content = this.quill.getContents()
        var lastObject = this.getLastObject(content.ops)
        console.log('lastObject:' + JSON.stringify(lastObject))
        console.log('lastContent:' + JSON.stringify(content))

        if (lastObject && lastObject.insert && /^(@|#)/.test(lastObject.insert)) {
          this.appendContent(' ', {})
          this.appendContent(msg, {})
        }

        let range = this.quill.getSelection(true)
        this.quill.setSelection(range.index, 'user')
      },
      resetHtml (html) {
        let range = this.quill.getSelection(true)
        setTimeout(() => {
          this.$refs.editor.children[0].innerHTML = html
          setTimeout(() => {
            this.quill.setSelection(range.index, 'user')
          }, 100)
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
        if (lastObject && lastObject.insert === '\n' && content.length > 0) {
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

          self.quill.on('selection-change', (range, oldRange, source) => {
            console.log('selection-change fired range:' + JSON.stringify(range) + ', oldRange:' + JSON.stringify(oldRange) + ', source:' + source)
          })

          self.quill.on('editor-change', (eventname, ...args) => {
            console.log('editor-change fired eventname:' + eventname + ', args:' + JSON.stringify(args))
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

            // 监听 .ql-size-small
            if (self.isMonitorSmallSpan) {
              var linkNodes = document.querySelectorAll('.ql-size-small')
              var isStop = false
              window.mui.each(linkNodes, (index, item) => {
                if (isStop) return
                var nowValue = item.innerText
                if (item.hasAttribute('ql-value')) {
                  var oldValue = item.getAttribute('ql-value')
                  if (oldValue !== nowValue) {
                    if (oldValue.length > nowValue.length) {
                      // 删除操作
                      console.log(oldValue + 'change')
                      var reg = new RegExp('<span\\s([^<]*?)' + nowValue + '</span>')
                      var newHtml = html.replace(reg, '')
                      console.log('reg:' + reg.toString())
                      console.log('旧的html:' + html)
                      console.log('新的html:' + newHtml)
                      if (/^@/.test(oldValue)) {
                        console.log('fire addressAppearDelete, params:' + oldValue)
                        self.$emit('addressAppearDelete', oldValue)
                      }

                      if (/^#/.test(oldValue)) {
                        console.log('fire hashSymbolDelete, params:' + oldValue)
                        self.$emit('hashSymbolDelete', oldValue)
                      }

                      self.resetHtml(newHtml)
                      isStop = true
                    } else {
                      // 添加
                      self.quill.history.undo()

                      setTimeout(() => {
                        var content = this.quill.getContents()
                        var lastObject = this.getLastObject(content.ops)
                        console.log('zzlastObject:' + JSON.stringify(lastObject))
                        console.log('zzoldValue:' + oldValue)
                        if (lastObject && lastObject.insert === oldValue) {
                          console.log('add: insert:' + delta.ops[1].insert + ', attributes' + JSON.stringify(delta.ops[1].attributes))
                          self.toLast(delta.ops[1].insert, delta.ops[1].attributes)
                        }
                      }, 200)

                      isStop = true
                    }
                  }
                } else {
                  item.setAttribute('ql-value', item.innerText)
                }
              })
              if (isStop) return
            }

            if (delta.ops[1] && delta.ops[1].delete) {
              // 删除操作
            } else {
              // 添加操作
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
