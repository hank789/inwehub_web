<template>
  <div>
    <div id="commentWapper" class="mui-popover mui-popover-action mui-popover-bottom">
      <div class="commentHeader">
        <button class="shutdown mui-btn mui-poppicker-btn-cancel" @tap.stop.prevent="cancelComment">关闭</button>
        评价


      </div>
      <div class="form form-realAnswer">

        <star-rating @rating-selected="setRating" @mouseleave.stop.prevent="" :rating="5" :padding="20"
                     :activeColor="'#fcc816'" :star-size="30" :show-rating="showRating"
                     v-show="!commentState"></star-rating>

        <div class="title" v-show="!commentState">{{ starDesc }}</div>


        <MTextarea v-model.trim="description" :content="description" :rows="6" :descMaxLength="500"
                   :placeholder="descriptionPlaceHolder" v-show="!commentState"></MTextarea>

        <div class="buttonWrapper" v-show="!commentState">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                  @click.prevent="submitComment">匿名提交


          </button>
        </div>

        <div class="commentDesc" v-show="!commentState">回答者将不会看到您的评价！</div>

        <div class="successWrapper" v-show="commentState">
          <svg class="icon mui-icon" aria-hidden="true">
            <use xlink:href="#icon-check-circle"></use>
          </svg>
          <div class="sTitle">感谢您的认真评价，我们非<br/>常珍惜您的反馈！</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script type="text/javascript">

  import { postRequest } from '../../utils/request'
  import MTextarea from '../../components/MTextarea.vue'

  export default {
    data () {
      return {
        commentState: false, // 是否已评价
        showRating: false,
        rateStar: 5,
        starDesc: '评价会让我们做的更好',
        description: '',
        descriptionPlaceHolder: '在这里留下你的反馈'
      }
    },
    components: {
      MTextarea
    },
    computed: {
      descLength () {
        return this.description.length
      }
    },
    props: {
      answerId: {
        type: Number,
        default: 0
      }

    },
    created () {
    },
    methods: {
      cancelComment () {
        this.comment()

        if (this.commentState) {
          this.$emit('finish')
        }
      },
      comment () {
        window.mui('#commentWapper').popover('toggle')
      },
      setRating: function (rating) {
        this.rateStar = rating
      },
      submitComment () {
        if (!this.rateStar) {
          window.mui.toast('别忘了打分')
          return
        }

        if (!this.description) {
          window.mui.toast('请填写反馈内容')
          return
        }

        var data = {
          answer_id: this.answerId,
          description: this.description,
          rate_star: this.rateStar
        }

        if (this.buttonCommentDisabled) {
          return
        }
        this.buttonCommentDisabled = true

        postRequest(`answer/feedback`, data).then(response => {
          this.buttonCommentDisabled = false
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          // this.commentState = true
          this.rateStar = 5
          this.description = ''

          window.mui('#commentWapper').popover('toggle')
          this.$emit('finish')
        })
      }
    },
    watch: {
      rateStar: function (newRateStar) {
        switch (newRateStar) {
          case 0:
            this.starDesc = '评价会让我们做的更好'
            break
          case 1:
            this.starDesc = '差评！！'
            this.descriptionPlaceHolder = '请耐心描述您的差评原因，我们会第一时间了解您的问题，核实后将全额退款。'
            break
          case 2:
            this.starDesc = '不太满意'
            this.descriptionPlaceHolder = '在这里留下你的反馈'
            break
          case 3:
            this.starDesc = '一般，还需要改善'
            this.descriptionPlaceHolder = '在这里留下你的反馈'
            break
          case 4:
            this.starDesc = '比较满意'
            this.descriptionPlaceHolder = '在这里留下你的反馈'
            break
          case 5:
            this.starDesc = '非常满意'
            this.descriptionPlaceHolder = '在这里留下你的反馈'
            break
        }
      },
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      },
      answerId: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.rateStar = 5
          this.description = ''
          window.mui('#commentWapper').popover('hide')
          var obj = document.querySelector('.mui-backdrop')
          if (obj) {
            obj.remove()
          }
        }
      }
    }
  }
</script>

<style scoped="scoped">
  .buttonWrapper {
    padding: 1.5rem;
    background: #fff;
  }

  .mui-btn-block {
    margin-bottom: 0;
  }

  .form-realAnswer {
    position: relative;
    background: #fff;
    padding: 2rem 0;
    text-align: center;
  }

  .commentHeader .shutdown {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    font-size: 1.2rem;
  }

  .form-realAnswer .star-rating {
    float: none;
    position: relative;
    left: 50%;
    margin-top: 1rem;
    margin-left: -11.5rem;
  }

  .starRating span {
    margin: 0 0.5rem;
  }

  .form-realAnswer .submit {
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
  }

  .form-realAnswer textarea {
    margin-top: 2rem;
    width: 100%;
    height: 13.8rem;
    border: none;
    padding: 1rem 1.5rem 0;
  }

  .form-realAnswer .title {
    margin-top: -1rem;
    font-size: 1.2rem;
    color: #ff9800;
    height: 3.2rem;
  }

  .form-realAnswer .button-wrapper {
    margin-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .successWrapper {
    text-align: center;
    padding: 2rem 0;
  }

  .successWrapper .mui-icon {
    font-size: 9rem;
    color: #19ac18;
  }

  .successWrapper .sTitle {
    margin-top: 2rem;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }

  .commentHeader {
    background-color: #eee;
    height: 4.1rem;
    line-height: 4.1rem;
    text-align: center;
    position: relative;
  }

  .commentHeader:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.1rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #ddd;
  }

  .commentDesc {
    font-size: 1.2rem;
    color: #999;
  }

  #commentWapper{
    position: absolute;
    width:100%;
    bottom:0;
    left:0;
  }

</style>
