<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">评价</h1>
    </header>


    <div class="mui-content">

      <div class="mui-content-padded">
        <div class="form form-realAnswer">
          <form>

            <div class="title">您对大师的回答反馈还满意么？留下您的建议吧：</div>
            <div class="textarea-wrapper">
              <textarea v-model.trim="description" placeholder="在这里留下你的反馈"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>
            <span class="mui-icon mui-icon-speech mui-plus-visible" @tap.stop.prevent="speech"></span>
            <star-rating @rating-selected="setRating" :star-size="30" :show-rating="showRating"></star-rating>
            <div class="button-wrapper">
              <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                      @tap.stop.prevent="submit">提交

              </button>
            </div>

          </form>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'

  const Refuse = {
    data: () => ({
      showRating: false,
      id: null,
      description: '',
      rateStar: 0,
      descMaxLength: 500
    }),
    computed: {
      descLength () {
        return this.description.length
      }
    },
    mounted () {
      window.addEventListener('refreshData', function (e) {
        // 执行刷新
        console.log('refresh-ask-comment')
      })
    },
    methods: {
      submit () {
        if (!this.description) {
          window.mui.toast('请填写反馈内容')
          return
        }

        var data = {
          answer_id: this.id,
          description: this.description,
          rate_star: this.rateStar
        }

        postRequest(`answer/feedback`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          window.mui.back()
        })
      },
      setRating: function (rating) {
        this.rateStar = rating
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
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      }
    },
    created () {
      // showInwehubWebview();
      let id = parseInt(this.$route.params.id)
      this.id = id
    }
  }
  export default Refuse
</script>


<style scoped>
  .form-realAnswer {
    padding: 0 2rem;
  }

  .form-realAnswer textarea {
    margin-top: 2rem;
    width: 100%;
    height: 20rem;
    border: 0.1rem solid #efefef;
  }

  .form-realAnswer .title {
    margin-top: 3rem;
    height: 3.2rem;
  }

  .form-realAnswer .button-wrapper {
    margin-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .mui-content {
    background-color: #fff;
  }

  .textarea-wrapper {
    position: relative;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 1rem;
    bottom: 3rem;
    color: #999;
  }
</style>
