<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答</h1>
    </header>

    <div class="mui-content">

      <div class="container-label padding-lr-15" v-if="ask.question.tags.length">
        <span v-for="(tag, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(tag.name)">{{tag.name}}</span>
      </div>

      <Question
        :ask="ask.question"
        :isFollow="true"
        :answerId="id"
      ></Question>

      <div class="see" @tap.stop.prevent="$router.pushPlus('/ask/offer/answers/' + ask.question.id)"> 查看全部回答 &gt;
      </div>

      <div class="line-river-big"></div>

      <Answer v-show="ask.question.status==6||ask.question.status==7"
              :answer="answer"
              :questionId="ask.question.id"
              :needMoney="true"
              :isFollow="true"
              :showModifyBtn="true"
              :showShoucang="true"
              @paySuccess="paySuccess"
      ></Answer>

      <div class="see" @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/' + answer.uuid)"> 查看Ta的全部回答 &gt;</div>

      <div class="line-river-big"></div>

      <RecommentList
        ref="recommentList"
        :did="ask.question.id"
        v-if="ask.question.id"
      ></RecommentList>

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
  import { collectAnswer, supportAnswer, toAnswer, toSeeSelfAnswer, adoptAnswer } from '../../utils/ask'
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
      RecommentList
    },
    computed: {
      isAsker () {
        if (this.uuid === this.ask.question.uuid) {
          return true
        }
        return false
      },
      answer () {
        return this.ask.answer || {}
      },
      footerMenus () {
        var huidaText = '回答'
        if (this.ask.my_answer_id) {
          huidaText = '查看我的回答'
        }
        getAnswerCache('answer' + this.ask.id + '-' + this.ask.my_answer_id, (contents) => {
          console.log('answerCacheContents:' + contents)
          if (contents) {
            huidaText = '回答(草稿)'
          }
        }, this)

        if (this.ask && this.ask.answer && this.ask.answer.adopted_time) {
          this.cainaText = '已采纳'
          this.ask.answer.adopted_time = 1
        }

        var options = [
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

        if (!this.isAsker) {
          options.push({
            icon: '#icon-xiugai',
            text: huidaText,
            number: 0,
            disable: false,
            rightLine: false,
            isLight: true
          })
        } else {
          options.push({
            icon: '#icon-weituoban',
            text: this.cainaText,
            number: 0,
            disable: false,
            rightLine: false,
            isLight: true
          })
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
      paySuccess (content) {
        this.ask.answer.content = content
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
          case '查看我的回答':
            toSeeSelfAnswer(this, this.ask.my_answer_id)
            break
          case '采纳':
            adoptAnswer(this, this.ask.answer.id, () => {
              this.cainaText = '已采纳'
            })
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
