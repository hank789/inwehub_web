<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答</h1>
    </header>

    <div class="mui-content">

      <div class="container-label padding-lr-15"  v-if="ask.question.tags.length">
        <span v-for="(tag, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(tag.name)">{{tag.name}}</span>
      </div>

      <Question
        :ask="ask.question"
        :isFollow="true"
        :answerId="id"
      ></Question>

      <div class="see" @tap.stop.prevent="$router.pushPlus('/ask/offer/answers/' + ask.question.id)"> 查看全部26个回答 &gt;</div>

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
        <!--查看全部回答-->
        <div class="see"  @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/' + answer.uuid)"> 查看Ta的全部回答 >
        </div>

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
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'

  import Question from '../../components/askOffer/Question.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import Answer from '../../components/askOffer/Answer.vue'
  import Share from '../../components/Share.vue'
  import { getAskCommunityInteractionDetail } from '../../utils/shareTemplate'
  import { autoTextArea, openVendorUrl } from '../../utils/plus'
  import commentTextarea from '../../components/comment/Textarea.vue'
  import userAbility from '../../utils/userAbility'
  import { pageRefresh } from '../../utils/allPlatform'
  import FooterMenu from '../../components/FooterMenu.vue'
  import { getLocalUserInfo } from '../../utils/user'
  import RecommentList from '../../components/AskCommunity/RecommendList.vue'
  var user = getLocalUserInfo()

  const AskDetail = {
    data: () => ({
      ask: {
        answers: {
          user_id: ''
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
      name: user.name
    }),
    mounted () {
      pageRefresh(this, () => {
        this.refreshPageData()
      })
      this.shareImg = 'https://cdn.inwehub.com/system/whiteLogo@2x.png'

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
      answer () {
        return this.ask.answer ? this.ask.answer : {}
      },
      footerMenus () {
        return [
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
            icon: '#icon-shoucang-xiao',
            text: '分享',
            number: 0,
            disable: false,
            rightLine: false,
            isLight: true
          }
        ]
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
        this.commentNumAdd()
        this.$refs.ctextarea.finish()
      },
      refreshPageData () {
        this.$refs.ctextarea.refreshPageData()
        console.log('refreshPageData-zz-detail')
        this.loading = 1
        this.getDetail()
      },
      toAsk () {
        this.$router.pushPlus('/ask/interaction')
      },
      toSeeHelp () {
        this.$router.pushPlus('/help/ask')
      },
      shareSuccess () {
        // alertAskCommunityDetailShareSuccess(this);
      },
      shareFail () {

      },
      commentNumAdd () {
        this.answer.comment_number++
      },
      paySuccess (content) {
        this.ask.answers[0].content = content
      },
      downRefresh (callback) {
        this.getDetail(() => {
          this.$refs.discuss.resetList()
        })
      },
      getDetail (successCallback = () => {}) {
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

        postRequest(`answer/info`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            this.$router.pushPlus('/task', '', true, 'pop-in', 'hide', true)
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
        switch (item.icon) {
          case this.footerMenus[0].icon:
            // 评论
            this.$refs.discuss.rootComment()
            break
          case this.footerMenus[1].icon:
            // 收藏
            this.collect()
            break
          case this.footerMenus[2].icon:
            // 点赞
            this.support()
            break
          case this.footerMenus[3].icon:
            // 分享
            this.$refs.ShareBtn.share()
            break
        }
      },
      collect () {
        var data = {
          id: this.ask.answer.id
        }

        postRequest(`collect/answer`, data).then(response => {
          var code = response.data.code

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (response.data.data.type === 'uncollect') {
            this.ask.answer.collect_num--
            this.ask.answer.is_collected = 0
          } else {
            this.ask.answer.collect_num++
            this.ask.answer.is_collected = 1
          }
          window.mui.toast(response.data.data.tip)
        })
      },
      support () {
        var data = {
          id: this.ask.answer.id
        }
        postRequest(`support/answer`, data).then(response => {
          var code = response.data.code

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (response.data.data.type === 'unsupport') {
            this.ask.answer.support_number--
            this.ask.answer.is_supported = 0
            for (var i in this.ask.answer.supporter_list) {
              if (this.ask.answer.supporter_list[i].uuid === this.uuid) {
                this.ask.answer.supporter_list.splice(i, 1)
              }
            }
          } else {
            this.ask.answer.support_number++
            this.ask.answer.is_supported = 1
            var support = {
              name: this.name,
              uuid: this.uuid
            }
            this.ask.answer.supporter_list = this.ask.answer.supporter_list.concat(support)
          }
          if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
            // mixpanel
            window.mixpanel.track(
              'inwehub:support:success',
              {
                'app': 'inwehub',
                'user_device': window.getUserAppDevice(),
                'page': this.answerId,
                'page_name': 'answer',
                'page_title': this.ask.answer.is_supported ? 'support' : 'cancel',
                'referrer_page': ''
              }
            )
          }
          window.mui.toast(response.data.data.tip)
        })
      },
      delCommentSuccess () {
        this.ask.answer.comments_number--
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {

    }
  }
  export default AskDetail
</script>


<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }
  .mui-table-view-cell:after {
    display: none;
  }
  .bot {
    position: absolute;
    right:0.4rem;
    top: 0rem;
    left:0.4rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-content {
    background: #fff;
    bottom:1.333rem;
  }

  /*查看回答*/
  .see{
    width:100%;
    height:1.066rem;
    padding: 0 0.4rem;
    font-size:0.373rem;
    color:#03aef9;
    text-align: center;
    line-height: 1.066rem;
    background: #FFFFFF;
    margin-bottom: 0.266rem;
  }
</style>
