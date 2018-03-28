<template>
  <div>

    <header class="mui-bar mui-bar-nav mui-bar-top">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left mui-action-back dark" @tap.stop.prevent="cancelAnswer">取消</a>
      <h1 class="mui-title">回答</h1>
      <a @tap.stop.prevent="goAnswer"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right dark">发布</a>
    </header>

    <div class="mui-content answerRichText blur">
      <div class="form form-realAnswer" v-show="!loading">
        <Meditor ref="myTextEditor" v-model.trim="description" :content="description" :rows="5" :descMaxLength="50000"
                 :placeholder="'请填写回答'" :id="meditorId" @ready="onEditorReady($event)" @onEditorBlur="onEditorBlur"
                 @onEditorFocus="onEditorFocus"></Meditor>

      </div>
    </div>


  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import Meditor from '../../components/vue-quill/Meditor.vue'
  import { delAnswerCache } from '../../utils/allPlatform'

  const Answer = {
    data: () => ({
      id: null,  // 提问id
      answerId: null, // 回答id
      description: {},
      loading: 0,
      editorObj: {}
    }),
    components: {
      Meditor
    },
    mounted () {
    },
    watch: {
      '$route': 'refreshPageData'
    },
    computed: {
      meditorId () {
        return 'answer' + this.id + '-' + this.answerId
      }
    },
    methods: {
      refreshPageData () {
        console.log('refreshPageData')
        this.getId()
      },
      getId () {
        let id = parseInt(this.$route.params.id)
        this.id = id

        let answerId = parseInt(this.$route.params.answerId)

        if (answerId) {
          this.answerId = answerId
          this.getDetail()
        } else {
          this.answerId = 0
        }

        console.log('id:' + this.id)
        console.log('answerId:' + this.answerId)
      },
      cancelAnswer () {
        if (window.mui.os.plus && window.mui.os.ios) {
          this.$refs.myTextEditor.nowSave()
        }

        if (this.editorObj.getLength() <= 1) {
          window.mui.back()
          return
        }

        window.mui.confirm('退出此处编辑？', null, ['确定', '取消'], e => {
          console.log(e.index)
          if (e.index === 0) {
            setTimeout(() => {
              window.mui.back()
            }, 100)
          }
        }, 'div')
      },
      onEditorBlur (editor) {
//        document.getElementsByClassName('answerRichText')[0].className = document.getElementsByClassName('answerRichText')[0].className.replace('focus', '');
//        document.getElementsByClassName('answerRichText')[0].className = document.getElementsByClassName('answerRichText')[0].className.replace('blur', '')+' blur';
      },
      onEditorFocus (editor) {

//        document.getElementsByClassName('answerRichText')[0].className = document.getElementsByClassName('answerRichText')[0].className.replace('blur', '');
//        document.getElementsByClassName('answerRichText')[0].className = document.getElementsByClassName('answerRichText')[0].className.replace('focus', '')+' focus';
      },
      onEditorReady (editor) {
        this.editorObj = editor
      },
      getDetail () {
        this.loading = 1
        postRequest(`answer/info`, {id: this.answerId}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            this.$router.pushPlus('/task', '', true, 'pop-in', 'hide', true)
            return
          }

          var data = response.data.data
          var content = data.answer.content

          var objs = JSON.parse(content)
          var cache = JSON.stringify(this.description)

          if (cache === '{}' || cache === '{"ops":[{"insert":"\\n"}]}') {
            this.editorObj.setContents(objs)
          }

          this.loading = 0
        })
      },
      submit (data) {
        for (var i in data.description.ops) {
          if (data.description.ops[i].insert.hasOwnProperty('image')) {
            if (/drag/.test(data.description.ops[i].insert.image)) {
              data.description.ops.splice(i, 1)
            }
          }
        }

        data.description = JSON.stringify(data.description)

        var options = {
          onUploadProgress: function (progressEvent) {
            this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            window.mui.uploadWaitingValue(this.percentCompleted)
          }
        }

        window.mui.showUploadWaiting()
        var url = ''
        var mixPanelEvent = ''
        if (this.answerId) {
          url = 'answer/update'
          mixPanelEvent = 'inwehub:answer:update:success'
          data.answer_id = this.answerId
        } else {
          url = 'answer/store'
          mixPanelEvent = 'inwehub:answer:store:success'
        }
        postRequest(url, data, false, options).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          window.mui.toast(response.data.message)

          delAnswerCache(this.meditorId, this)

          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              mixPanelEvent,
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.$route.fullPath,
                'page_name': this.$route.name,
                'page_title': this.$route.meta.title,
                'referrer_page': ''
              }
            )
          }

          window.mui.back()
        })
      },
      goAnswer () {
        this.editorObj.blur()
        if (this.editorObj.getLength() <= 1) {
          window.mui.toast('请填写回答内容')
          return
        }

        if (this.editorObj.getText().length <= 1) {
          window.mui.toast('请填写一段文本信息')
          return
        }

        // 提问设备，1为IOS，2为安卓，3为网页，4为微信小程序
        var device = 1
        if (window.mui.os.plus) {
          if (window.mui.os.android) {
            device = 2
          }
        } else {
          device = 3
        }

        var data = {
          question_id: this.id,
          description: this.description,
          promise_time: '',
          device: device
        }

        if (this.answerId) {
          this.submit(data)
        } else {
          window.mui.confirm('回答提交后就不能再修改了，你确认提交么？', null, ['取消', '确定'], e => {
            if (e.index === 1) {
              this.submit(data)
            }
          }, 'div')
        }
      },
      speech () {
        var options = {}
        options.engine = 'iFly'
        var t = this
        window.plus.speech.startRecognize(options, function (s) {
          t.description += s
        }, function (e) {
          window.mui.alert('语音识别失败：' + e.message)
        })
      }
    },
    created () {
      this.getId()
    }
  }
  export default Answer
</script>


<style>
  .answerRichText.blur {
    position: absolute;
    bottom:0;
  }

  .answerRichText.blur .form-realAnswer {
    overflow: hidden;
    position: absolute;
    top:0.133rem;
    bottom:0.133rem;
    left:0.133rem;
    right:0.133rem;
  }

  .answerRichText.blur .form-realAnswer > div {
  }

  .answerRichText.blur .textarea-wrapper {
    position: absolute;
    width:100%;
    margin:0;
    top:0;
    bottom:0;
  }

  .answerRichText.blur .quill-editor {
    position: absolute;
    width:100%;
    top:1.093rem;
    bottom:0.56rem;
    height:auto;
  }

  .answerRichText.blur .ql-container {
    position: absolute;
    top:0;
    width:100%;
    height:auto;
    bottom:0;
  }

</style>
<style scoped>
  .mui-content{
    background: #ffffff;
  }
  .mui-bar .mui-btn.mui-pull-right,.mui-bar .mui-btn-nav.mui-pull-left{
    color: #3c3e44;
  }
</style>
