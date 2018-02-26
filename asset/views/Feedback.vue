<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{headercontent}}</h1>
    </header>

    <div class="mui-content absolute">
      <div class="feedback">
        <div class="title">{{titlecontent}}</div>

        <MTextarea v-model.trim="description" :content="description" :rows="9" :descMaxLength="500"
                   :placeholder='placeholdercontent'></MTextarea>

        <div class="button-wrapper">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit">提交</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { NOTICE } from '../stores/types'
  import { createAPI, addAccessToken } from '../utils/request'
  import MTextarea from '../components/MTextarea.vue'

  const Feedback = {
    data: () => ({
      description: '',
      headercontent: '',
      titlecontent: '',
      type: '',
      placeholdercontent: ''
    }),
    components: {
      MTextarea
    },
    created () {

    },
    watch: {
      '$route': 'refreshPageData'
    },
    methods: {
      refreshPageData () {
        this.getparams()
      },
      getparams () {
        if (!this.$route.params.type) {
          window.mui.back()
          return
        }

        this.type = this.$route.params.type
        switch (this.$route.params.type) {
          case 'consultant':
            // 顾问；
            this.headercontent = '寻找顾问'
            this.titlecontent = '合作是更好的开始、优势的互补'
            this.placeholdercontent = '请清晰描述对顾问的具体要求，如擅长、语言、年限、模块、BASE等，顾问寻找诉求的发布完全免费，通过审核后将会按照要求为您匹配对应顾问。'
            break
          case 'cooperate':
            // 合作；
            this.headercontent = '寻求合作'
            this.titlecontent = '合作是更好的开始、优势的互补'
            this.placeholdercontent = '请清晰描述您的需求，以及自身的优势，合作诉求的发布完全免费，通过审核后将会出现在“机遇”板块。'
            break
          case 'news':
            // 爆料；
            this.headercontent = '行业爆料'
            this.titlecontent = '爆料是为了让咨询行业变得更好'
            this.placeholdercontent = '您的爆料，我们会采用合适的方式展示，爆料包括项目动态、热点新闻、精彩会议、热辣事件等。'
            break
          case 'advise':
            // 建议
            this.headercontent = '反馈建议'
            this.titlecontent = '我们懂得聆听，您的建议和意见'
            this.placeholdercontent = '您的建议和意见，会使InweHub变得更好，提出采纳的建议，将会获得积分奖励。'
            break
          default:
            window.mui.back()
            return
        }
      },
      submit () {
        if (!this.description) {
          window.mui.toast('请填写反馈内容')
          return
        }

        var data = {
          name: this.type,
          title: this.headercontent,
          content: this.description
        }

        addAccessToken().post(createAPI(`system/feedback`), data, {
          validateStatus: status => status === 200
        })
          .then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              return
            }
            this.description = ''
            window.mui.toast('反馈成功')
          })
          .catch(({
                    response: {
                      message = '网络状况堪忧'
                    } = {}
                  }) => {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: data.message,
                time: 2000,
                status: false
              })
            })
          })
      }
    },
    mounted () {
      this.getparams()
    }
  }
  export default Feedback
</script>

<style scoped>
  .mui-content {
  }

  .title {
    color: #aba9ab;
    height: 4rem;
    line-height: 4rem;
    padding-left: 1rem;
  }

  .feedback {
  }

  .feedback textarea {
    height: 20rem;
  }

  .textarea-wrapper {
    position: relative;
    margin: 0 0.5rem;
    background: #fff;
    border-radius: 0.5rem;
    border: 0.1rem solid #bbbbbb;
    padding-bottom: 2rem;
  }

  .textarea-wrapper textarea {
    padding-bottom: 0;
    margin-bottom: 0;
    border: none;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 1rem;
    bottom: 0.2rem;
    color: #999;
  }

  .button-wrapper {
    margin-top: 4rem;
    padding: 0 5rem;
  }
</style>
