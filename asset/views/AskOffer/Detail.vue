<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答</h1>
    </header>

    <div class="mui-content" v-show="!loading">

      <div class="container-label padding-lr-15" v-if="ask.question.tags.length">
        <span v-for="(tag, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(tag.name)">{{tag.name}}</span>
      </div>

      <Question
        :ask="ask.question"
        :isFollow="true"
        :answerId="id"
      ></Question>

      <div class="see" v-if="ask.question.question_type === 2" @tap.stop.prevent="$router.pushPlus('/ask/offer/answers/' + ask.question.id)"> 查看全部回答 &gt;
      </div>

      <div class="line-river-big"></div>

      <Answer v-show="ask.question.status==6 || ask.question.status==7 || ask.question.status==8"
              :answer="answer"
              :questionId="ask.question.id"
              :needMoney="true"
              :isFollow="true"
              :showModifyBtn="true"
              :showShoucang="true"
              @paySuccess="paySuccess"
              @toPay="toPay"
      ></Answer>

      <div class="see" @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/' + answer.uuid)"> 查看Ta的全部回答 &gt;</div>

      <div class="line-river-big"></div>

      <RecommentList
        ref="recommentList"
        :did="ask.question.id"
        v-if="ask.question.id"
      ></RecommentList>

      <div class="line-river-big" v-if="ask.question.status===7 && ask.feedback && ask.feedback.description"></div>

      <Star-Rating v-if="ask.question.status===7 && ask.feedback && ask.feedback.description"
                   :description="ask.feedback.description"
                   :rating="ask.feedback.rate_star"
                   :readOnly="true"
      ></Star-Rating>

      <div class="line-river-big"></div>

      <Discuss
        :listApi="'answer/commentList'"
        :listParams="{'answer_id': ask.answer ? ask.answer.id:0}"
        :storeApi="'answer/comment'"
        :storeParams="{'answer_id': ask.answer ? ask.answer.id:0}"

        @comment="comment"
        @commentFinish="commentFinish"

        ref="discuss"
        v-if="ask.answer && ask.answer.content"
        @delCommentSuccess="delCommentSuccess"
      ></Discuss>

    </div>

    <Share
      :title="shareTitle"
      :link="shareUrl"
      :shareName="shareName"
      :content="shareContent"
      :imageUrl="shareImg"
      :thumbUrl="shareImg"
      :targetId="id"
      :targetType="'answer'"
      @success="shareSuccess"
      @fail="shareFail"
      ref="ShareBtn"
    ></Share>

    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>

    <FooterMenu
      :options="footerMenus"
      @clickedItem="footerMenuClickedItem"
    ></FooterMenu>

    <pay
      ref="pay"
      :payItems="[
          {
            default: true,
            text: '1元围观',
            value: 1
          }
        ]"
      :pay_object_type="'view_answer'"
      :pay_object_id="ask.answer.id"
      :pay_money="1"
      @pay_success="paySuccess"
    >
    </pay>

    <Comment v-show="isNeedComment"
             :answerId="ask.answer?ask.answer.id:0"
             @finish="getDetail()"
             ref="commentReal"
    ></Comment>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'

  import Question from '../../components/askOffer/Question.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import Answer from '../../components/askOffer/Answer.vue'
  import Share from '../../components/Share.vue'
  import { getAskCommunityInteractionDetail } from '../../utils/shareTemplate'
  import { autoTextArea, openVendorUrl } from '../../utils/plus'
  import commentTextarea from '../../components/comment/Textarea.vue'
  import userAbility from '../../utils/userAbility'
  import { pageRefresh, getAnswerCache } from '../../utils/allPlatform'
  import FooterMenu from '../../components/FooterMenu.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import RecommentList from '../../components/AskCommunity/RecommendList.vue'
  import { collectAnswer, supportAnswer, toAnswer, adoptAnswer, modifySelfAnswer } from '../../utils/ask'
  import pay from '../../components/pay/pay.vue'
  import Comment from '../../components/question-detail/CommentNew.vue'
  import StarRating from '../../components/question-detail/StarRating.vue'
  import Vue from 'vue'
  var user = getLocalUserInfo()

  const AskDetail = {
    data: () => ({
      ask: {
        answer: {
          user_id: '',
          adopted_time: null
        },
        question: {
          id: 0,
          created_at: '',
          description: '',
          tags: [],
          data: {
            img: []
          }
        },
        feedback: {
          rate_star: 0
        },
        timeline: []
      },
      shareUrl: '',
      shareImg: '',
      shareContent: '',
      shareTitle: '',
      shareName: '',
      id: 0,
      loading: true,
      uuid: user.uuid,
      name: user.name,
      cainaText: '采纳'
    }),
    mounted () {
      pageRefresh(this, () => {
        this.refreshPageData()
      })

      autoTextArea()

      this.getDetail()
    },
    components: {
      Question,
      Discuss,
      Answer,
      Share,
      commentTextarea,
      FooterMenu,
      RecommentList,
      pay,
      Comment,
      StarRating
    },
    computed: {
      isNeedComment () {
        if (this.ask && this.ask.answer && this.ask.answer.adopted_time) {
          if (this.ask.question.question_type === 1) {
            return true
          }
        }
        return false
      },
      isAsker () {
        if (this.uuid === this.ask.question.uuid) {
          return true
        }
        return false
      },
      isAnswer () {
        if (this.uuid === this.ask.answer.uuid) {
          return true
        }
      },
      answer () {
        return this.ask.answer || {}
      },
      footerMenus () {
        var huidaText = '回答'
        if (this.isAnswer && this.ask.question.status !== 8) {
          huidaText = '修改我的回答'
        }
        getAnswerCache('answer' + this.ask.id + '-' + this.ask.my_answer_id, (contents) => {
          console.log('answerCacheContents:' + contents)
          if (contents) {
            huidaText = '回答(草稿)'
          }
        }, this)

        switch (this.ask.question.status) {
          case 8: // 已采纳最佳回答
            this.cainaText = '已采纳'
            this.ask.answer.adopted_time = 1
            break
          case 7: // 已点评
            this.cainaText = '已点评'
            break
          case 6: // 待点评
            this.cainaText = '待点评'
            break
        }

        var options = []

        // 悬赏提问
        if (this.ask.question.question_type === 2) {
          if (this.isAsker) {
            // 提问者
            if (this.ask.question.status !== 8) {
              // 未采纳
              options = [
                {
                  icon: '#icon-pinglun',
                  text: '评论',
                  number: this.loading ? 0 : this.ask.answer.comments_number,
                  disable: false,
                  rightLine: true,
                  isLight: false
                },
                {
                  icon: '#icon-shoucangdilantongyi',
                  text: '收藏',
                  number: this.loading ? 0 : this.ask.answer.collect_num,
                  disable: this.loading ? 0 : this.ask.answer.is_collected,
                  rightLine: true,
                  isLight: false
                },
                {
                  icon: '#icon-zan',
                  text: '点赞',
                  number: this.loading ? 0 : this.ask.answer.support_number,
                  disable: this.loading ? 0 : this.ask.answer.is_supported,
                  rightLine: false,
                  isLight: false
                },
                {
                  icon: '#icon-weituoban',
                  text: this.cainaText,
                  number: 0,
                  disable: false,
                  rightLine: false,
                  isLight: true
                }
              ]
            } else {
              // 已采纳
              options = [
                {
                  icon: '#icon-pinglun',
                  text: '评论',
                  number: this.loading ? 0 : this.ask.answer.comments_number,
                  disable: false,
                  rightLine: true,
                  isLight: false
                },
                {
                  icon: '#icon-shoucangdilantongyi',
                  text: '收藏',
                  number: this.loading ? 0 : this.ask.answer.collect_num,
                  disable: this.loading ? 0 : this.ask.answer.is_collected,
                  rightLine: true,
                  isLight: false
                },
                {
                  icon: '#icon-zan',
                  text: '点赞',
                  number: this.loading ? 0 : this.ask.answer.support_number,
                  disable: this.loading ? 0 : this.ask.answer.is_supported,
                  rightLine: false,
                  isLight: false
                }
              ]
            }
          } else {
            // 回答者
            if (this.ask.question.status !== 8) {
              // 未采纳
              options = [
                {
                  icon: '#icon-pinglun',
                  text: '评论',
                  number: this.loading ? 0 : this.ask.answer.comments_number,
                  disable: false,
                  rightLine: true,
                  isLight: false
                },
                {
                  icon: '#icon-shoucangdilantongyi',
                  text: '收藏',
                  number: this.loading ? 0 : this.ask.answer.collect_num,
                  disable: this.loading ? 0 : this.ask.answer.is_collected,
                  rightLine: true,
                  isLight: false
                },
                {
                  icon: '#icon-zan',
                  text: '点赞',
                  number: this.loading ? 0 : this.ask.answer.support_number,
                  disable: this.loading ? 0 : this.ask.answer.is_supported,
                  rightLine: false,
                  isLight: false
                },
                {
                  icon: '#icon-xiugai',
                  text: huidaText,
                  number: 0,
                  disable: false,
                  rightLine: false,
                  isLight: true
                }
              ]
            } else {
              // 已采纳
              options = [
                {
                  icon: '#icon-pinglun',
                  text: '评论',
                  number: this.loading ? 0 : this.ask.answer.comments_number,
                  disable: false,
                  rightLine: true,
                  isLight: false
                },
                {
                  icon: '#icon-shoucangdilantongyi',
                  text: '收藏',
                  number: this.loading ? 0 : this.ask.answer.collect_num,
                  disable: this.loading ? 0 : this.ask.answer.is_collected,
                  rightLine: true,
                  isLight: false
                },
                {
                  icon: '#icon-zan',
                  text: '点赞',
                  number: this.loading ? 0 : this.ask.answer.support_number,
                  disable: this.loading ? 0 : this.ask.answer.is_supported,
                  rightLine: false,
                  isLight: false
                }
              ]
            }
          }
        }

        // 定向提问
        if (this.ask.question.question_type === 1) {
          // ...
        }

        return options
      }
    },
    updated () {
      this.$nextTick(() => {
        var eles = this.$el.querySelectorAll('.textToLink')
        for (var i in eles) {
          openVendorUrl(eles[i])
        }
      })
    },
    methods: {
      toPay () {
        this.$refs.pay.showSelectMoney()
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      sendMessage (message) {
        this.$refs.discuss.sendMessage(message)
      },
      comment (commentTargetName) {
        this.$refs.ctextarea.comment(commentTargetName)
      },
      commentFinish () {
        this.answer.comment_number++
        this.$refs.ctextarea.finish()
      },
      refreshPageData () {
        this.$refs.ctextarea.refreshPageData()
        console.log('refreshPageData-zz-detail')
        this.loading = 1
        this.getDetail()
      },
      shareSuccess () {},
      shareFail () {},
      paySuccess (orderId) {
        postRequest(`answer/payforview`, {
          order_id: orderId,
          answer_id: this.answer.id,
          device: 1
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var content = response.data.data.content
          if (content) {
            Vue.set(this.ask.answer, 'content', content)
          }
        })
      },
      downRefresh (callback) {
        this.getDetail(() => {
          this.$refs.discuss.resetList()
        })
      },
      getDetail (successCallback = () => {}) {
        let id = parseInt(this.$route.params.id)

        if (!id) {
          window.mui.toast('请求异常')
          window.mui.back()
          return
        }

        this.id = id

        postRequest(`answer/info`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            window.mui.back()
            return
          }

          this.ask = response.data.data

          this.loading = 0

          var username = this.answer.user_name ? this.answer.user_name : ''

          var shareOptions = getAskCommunityInteractionDetail(this.id, this.ask.question.description, username)
          this.shareImg = shareOptions.imageUrl
          this.shareContent = shareOptions.content
          this.shareUrl = shareOptions.link
          this.shareTitle = shareOptions.title
          this.shareName = shareOptions.shareName

          successCallback()
        })
      },
      footerMenuClickedItem (item) {
        switch (item.text) {
          case '评论':
            this.$refs.discuss.rootComment()
            break
          case '收藏':
            this.collect()
            break
          case '点赞':
            this.support()
            break
          case '回答':
            toAnswer(this, this.ask.question.id)
            break
          case '修改我的回答':
            modifySelfAnswer(this, this.ask.question.id, this.ask.answer.id)
            break
          case '采纳':
            window.mui.confirm('确认将该回答采纳为最佳回答？', null, ['取消', '确定'], (e) => {
              if (e.index === 1) {
                adoptAnswer(this, this.ask.answer.id, () => {
                  this.cainaText = '已采纳'
                })
              }
            }, 'div')
            break
          case '评价':
            this.$refs.commentReal.comment()
            break
        }
      },
      collect () {
        collectAnswer(this, this.ask.answer.id, () => {
          this.ask.answer.collect_num++
          this.ask.answer.is_collected = 1
        }, () => {
          this.ask.answer.collect_num--
          this.ask.answer.is_collected = 0
        })
      },
      support () {
        supportAnswer(this, this.ask.answer.id, () => {
          this.ask.answer.support_number++
          this.ask.answer.is_supported = 1
          var support = {
            name: this.name,
            uuid: this.uuid
          }
          this.ask.answer.supporter_list = this.ask.answer.supporter_list.concat(support)
        }, () => {
          this.ask.answer.support_number--
          this.ask.answer.is_supported = 0
          for (var i in this.ask.answer.supporter_list) {
            if (this.ask.answer.supporter_list[i].uuid === this.uuid) {
              this.ask.answer.supporter_list.splice(i, 1)
            }
          }
        })
      },
      delCommentSuccess () {
        this.ask.answer.comments_number--
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {}
  }
  export default AskDetail
</script>


<style scoped>
  .mui-content {
    background: #fff;
    bottom: 1.333rem;
  }

  /*查看回答*/
  .see {
    width: 100%;
    height: 1.066rem;
    padding: 0 0.4rem;
    font-size: 0.373rem;
    color: #03aef9;
    text-align: center;
    line-height: 1.066rem;
    background: #FFFFFF;
    margin-bottom: 0.266rem;
  }
</style>
