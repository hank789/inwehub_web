<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">拒绝应答</h1>
    </header>

    <div class="mui-content" v-show="!loading">


      <div class="form form-ask-refuse">
        <form>

          <div class="title">您怎么就拒绝回答啦？</div>
          <div class="category">
              <span v-for="(item, index) in tags" :class="sTags.indexOf(item.value) >= 0 ?'active':''"
                    @tap.stop.prevent="selectTags(item)">{{ item.text }}</span>
          </div>

          <div class="textarea-wrapper">
            <textarea v-model.trim="description" placeholder="请详细说明下拒绝的原因"></textarea>
            <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
          </div>

          <!--<span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>-->

          <div class="button-wrapper">
            <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                    @tap.stop.prevent="submit" :disabled="buttonRefuseDisable">提交反馈


            </button>
          </div>

        </form>
      </div>

    </div>

  </div>
</template>

<script>
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'

  const Refuse = {
    data: () => ({
      tags: [],
      sTags: [],
      id: null,
      descMaxLength: 200,
      description: '',
      loading: true,
      buttonRefuseDisable: false,
      needDesc: true
    }),
    computed: {
      nothing () {
        if (this.loading) {
          return -1
        }
        return this.answers.length ? 0 : 1
      },
      descLength () {
        return this.description.length
      }
    },
    methods: {
      refreshPageData () {
        this.loading = true
        this.getDetail()
      },
      getDetail () {
        let id = parseInt(this.$route.params.id)

        if (!id) {
          this.$store.dispatch(NOTICE, cb => {
            cb({
              text: '发生一些错误',
              time: 1500,
              status: false
            })
          })
          this.$router.back()
          return
        }
        this.id = id

        postRequest(`tags/load`, {tag_type: 2}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          this.tags = response.data.data.tags
          this.loading = 0
        })
      },
      selectTags (tag) {
        var pos = this.sTags.indexOf(tag.value)
        if (pos >= 0) {
          this.sTags.splice(pos, 1)
        } else {
          this.sTags.push(tag.value)
        }

        pos = this.sTags.indexOf(67)

        if (pos >= 0) {
          this.needDesc = true
        } else {
          this.needDesc = false
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
      },
      submit () {
        if (!this.sTags.length) {
          window.mui.toast('请选择标签！')
          return
        }

        if (this.needDesc && !this.description) {
          window.mui.toast('请再详细说明下拒绝的原因，非常感谢！')
          return
        }

        var data = {
          tags: this.sTags.join(','),
          description: this.description,
          question_id: this.id
        }

        window.mui.confirm('选择确定后您将不能再回答该问题了，您确定拒绝回答么？', null, ['取消', '确定'], e => {
          if (e.index === 1) {
            if (this.buttonRefuseDisable) {
              return
            }

            this.buttonRefuseDisable = true
            postRequest(`question/rejectAnswer`, data).then(response => {
              this.buttonRefuseDisable = false
              var code = response.data.code
              if (code !== 1000) {
                window.mui.alert(response.data.message)
                return
              }

              this.$router.replace('/task')
            })
          }
        }, 'div')
      }
    },
    mounted () {
    },
    created () {
      // showInwehubWebview();
      this.getDetail()
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      },
      '$route': 'refreshPageData'
    }
  }
  export default Refuse
</script>


<style scoped>
  .form-ask-refuse {
    padding: 0 0.133rem;
  }

  .form-ask-refuse textarea {
    margin-top: 0.4rem;
    width: 100%;
    height: 3.68rem;
    border: none;
  }

  .form-ask-refuse .title {
    margin-top: 0.266rem;
    margin-left: 0.266rem;
    color: #8b8b8b;
    height: 0.853rem;
  }

  .form-ask-refuse .category {
    padding: 0.266rem 0.533rem;
  }

  .form-ask-refuse .category span.active {
    border: 0.026rem solid #4a90e2;
    color: #4a90e2;
  }

  .form-ask-refuse .category span {
    border: 0.026rem solid #b6b6b6;
    border-radius: 0.133rem;
    padding: 0 0.4rem;
    display: inline-block;
    height: 0.853rem;
    background: #fff;
    font-size: 0.373rem;
    margin: 0.133rem 0.16rem;
    text-align: center;
    color: #333;
    line-height: 0.853rem;
    position: relative;
  }

  .form-ask-refuse .category span input {
    display: inline-block;
    position: relative;
    border: none;
    height: 90%;
    margin-top: -0.106rem;
    width: 90%;
    text-align: center;
  }

  .form-ask-refuse .options {
    text-align: center;
  }

  .form-ask-refuse .button-wrapper {
    margin-top: 0.4rem;
    padding: 0 1.333rem;
  }

  .textarea-wrapper {
    position: relative;
    background: #fff;
    padding-bottom: 0.533rem;
    border-radius: 0.133rem;
    border: 0.026rem solid #bbbbbb;
  }

  .textarea-wrapper textarea {
    margin: 0;
    padding-bottom: 0;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 0.266rem;
    font-size: 0.32rem;
    bottom: 0.053rem;
    color: #999;
  }

  .mui-content {
    background: #fff;
  }
</style>
