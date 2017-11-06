<template>
  <div>

    <div class="buttonWrapper">
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
              @tap.stop.prevent="comment()">点击评价，分享获取分红


      </button>
    </div>

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
        var obj = document.querySelector('.mui-backdrop')
        if (obj) {
          obj.remove()
        }
        setTimeout(() => {
          window.mui('#commentWapper').popover('toggle')
          setTimeout(() => {
            var obj = document.querySelector('.mui-backdrop')
            if (obj) {
              obj.addEventListener('tap', function (e) {
                obj.remove()
              })
              document.querySelector('.mui-content').appendChild(obj)
            }
          }, 150)
        }, 150)
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

          this.commentState = true
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
      }
    }
  }
</script>

<style scoped="scoped">
  .buttonWrapper {
    padding: 15px;
    background: #fff;
  }

  .mui-btn-block {
    margin-bottom: 0;
  }

  .form-realAnswer {
    position: relative;
    background: #fff;
    padding: 20px 0;
    text-align: center;
  }

  .commentHeader .shutdown {
    position: absolute;
    top: 5px;
    left: 5px;
    font-size: 12px;
  }

  .form-realAnswer .star-rating {
    float: none;
    position: relative;
    left: 50%;
    margin-top: 10px;
    margin-left: -115px;
  }

  .starRating span {
    margin: 0 5px;
  }

  .form-realAnswer .submit {
    font-size: 12px;
    padding: 5px 10px;
  }

  .form-realAnswer textarea {
    margin-top: 20px;
    width: 100%;
    height: 138px;
    border: none;
    padding: 10px 15px 0;
  }

  .form-realAnswer .title {
    margin-top: -10px;
    font-size: 12px;
    color: #ff9800;
    height: 32px;
  }

  .form-realAnswer .button-wrapper {
    margin-top: 15px;
    padding-bottom: 15px;
  }

  .successWrapper {
    text-align: center;
    padding: 20px 0;
  }

  .successWrapper .mui-icon {
    font-size: 90px;
    color: #19ac18;
  }

  .successWrapper .sTitle {
    margin-top: 20px;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 0;
  }

  .commentHeader {
    background-color: #eee;
    height: 41px;
    line-height: 41px;
    text-align: center;
    position: relative;
  }

  .commentHeader:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #ddd;
  }

  .commentDesc {
    font-size: 12px;
    color: #999;
  }

</style>
