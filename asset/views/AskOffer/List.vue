<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">问答</h1>
    </header>

    <div id="majorDetail" class="mui-content" v-show="!loading">

      <RefreshList
        ref="refreshList"
        class="refreshListWrapper"
        v-model="answers"
        :api="'question/answerList'"
        :prevOtherData="prevOtherData"
        :nextOtherData="prevOtherData"
        @prevSuccessCallback="prevSuccessCallback"
        :isShowUpToRefreshDescription="true"
        :list="answers"
        :pageMode="true"
        :autoShowEmpty="false"
      >

        <div class="container-label" v-if="ask.question.tags.length">
          <span class="border-football" v-for="(item, index) in ask.question.tags" @tap.stop.prevent="toTagDetail(item.name)">{{item.name}}</span>
        </div>


        <Question
          :ask="ask.question"
          :myAnswerId="ask.my_answer_id"
          :isFollow="true"
          :isFollowAsked="ask.is_followed_question?true:false"
          @setFollowAskStatus="setFollowAskStatus"
        ></Question>

        <InvitationList :ask="ask.question"></InvitationList>

        <div class="river"></div>

        <Answers
          :list="answers"
          :questionId="ask.question.id"
          :isAsker="isAsker"
          :emptyDesc="ask.question.status_description"
          :emptyAnswerShow="answers.length === 0 && ask.question.status !== 9"
          :answerCloseShow="ask.question.status === 9"
          :defaultShow="false"
        ></Answers>
        <div class="robAnswer" v-if="answers.length === 0 && ask.question.status !== 9 && !isAsker" @tap.stop.prevent="goRobAnswer">抢个沙发</div>

        <div class="container-recommentProduct" v-if="ask.related_products && ask.related_products.length">
          <div class="line-river-big"></div>
          <div class="title">
            <div class="text font-family-medium">相关产品</div>
            <div class="line-river line-river-full"></div>
          </div>

          <div class="productList">
            <div class="comment-product" v-for="(item, index) in ask.related_products" :key="index">
              <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
                <div class="product-img border-football">
                  <ImageView :src="item.logo" width="44" height="44"></ImageView>
                  <!--<img src="../../../statics/images/uicon.jpg" alt="">-->
                </div>
                <div class="product-detail">
                  <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
                  <div class="productMark">
                    <div class="stars">
                      <StarView :rating="item.review_average_rate"></StarView>
                    </div>
                    <div class="starsText">
                      <span>{{ item.review_average_rate }}分</span>
                      <i></i><span>{{ item.review_count }}条评论</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="line-river-after line-river-after-top" v-if="index !== ask.related_products.length - 1"></div>
            </div>
          </div>

        </div>

        <div class="line-river-big"></div>
        <RecommentList
          ref="recommentList"
          class="recommentList"
          :did="id"
          v-if="id"
        ></RecommentList>

        <div class="openAppReadBox">
          <div class="river openAppReadRiver"></div>
          <div class="openAppRead" @tap.stop.prevent="openApp()">
            <span class="font-family-medium">打开APP</span>
            <span>阅读更多推荐</span>
          </div>
          <div class="river openAppReadRiver"></div>
          <div class="followCode">
            <div class="CodeImg">
              <img src="../../statics/images/xiaohaWeChat@3x.png" alt="">
            </div>
            <div class="codeText">
              <div>长按添加平台联络官“小哈”微信</div>
              <div>加行业群/互动交流/探索更多</div>
            </div>
          </div>
        </div>

        <div class="line-river-big"></div>
        <div class="component-goAskOffers" @tap.stop.prevent="goAskOffers">
          <span>前往问答社区</span>
          <span>（更多精彩问答）</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
        </div>
        <div class="line-river-big"></div>

      </RefreshList>
    </div>

    <Share
      ref="ShareBtn"
      :title="shareTitle"
      :shareName="'互动问答分享'"
      :link="shareUrl"
      :content="shareContent"
      :imageUrl="shareImg"
      :thumbUrl="shareImg"
      :targetId="id"
      :targetType="'question'"
      :showPreviewApiImage="true"
      :apiReviewUrl="'/share/review/question/' + this.id"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

    <FooterMenu
      class="offerAnswersFooterMenu"
      :options="footerMenus"
      @clickedItem="footerMenuClickedItem"
    ></FooterMenu>

  </div>

</template>

<script>
  import { NOTICE } from '../../stores/types'
  import { postRequest } from '../../utils/request'
  import Question from '../../components/askOffer/Question.vue'
  import Answers from '../../components/askOffer/Answers.vue'
  import InvitationList from '../../components/question-detail/InvitationList.vue'
  import Share from '../../components/Share.vue'
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { openVendorUrl } from '../../utils/plus'
  import userAbility from '../../utils/userAbility'
  import { getAskCommunityInteractionAnswers } from '../../utils/shareTemplate'
  import RecommentList from '../../components/AskCommunity/RecommendList.vue'
  import FooterMenu from '../../components/FooterMenu.vue'
  import { toContact, toAnswer, toSeeSelfAnswer, collectQuestion } from '../../utils/ask'
  import { getAnswerCache } from '../../utils/allPlatform'
  import { getLocalUuid } from '../../utils/user'
  import StarView from '../../components/star-rating/starView.vue'

  const AskDetail = {
    data: () => ({
      ask: {
        answers: [],
        question: {
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
      answers: [],
      shareUrl: '',
      shareImg: '',
      shareContent: '',
      shareTitle: '',
      id: 0,
      loading: true
    }),
    mounted () {
    },
    components: {
      Question,
      Answers,
      RefreshList,
      Share,
      InvitationList,
      RecommentList,
      FooterMenu,
      StarView
    },
    computed: {
      isAsker () {
        if (getLocalUuid() === this.ask.question.uuid) {
          return true
        }
        return false
      },
      answer () {
        return this.ask.answers[0] ? this.ask.answers[0] : {}
      },
      prevOtherData () {
        return {question_id: this.id}
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

        var options = []

        // 悬赏提问
        if (this.ask.question.question_type === 2) {
          if (this.isAsker) {
            // 提问者
            options = [
              {
                icon: '#icon-yaoqing',
                text: '邀请回答',
                number: 0,
                disable: false,
                rightLine: true,
                isLight: false
              },
              {
                icon: this.ask.is_followed_question ? '#icon-shoucanghover' : '#icon-shoucang',
                text: this.ask.is_followed_question ? '取消关注' : '关注问题',
                class: 'menuGuanzhu',
                number: 0,
                disable: false,
                rightLine: false,
                isLight: false
              }
            ]
          } else {
            // 回答者
            options = [
              {
                icon: '#icon-yaoqing',
                text: '邀请回答',
                number: 0,
                disable: false,
                rightLine: true,
                isLight: false
              },
              {
                icon: this.ask.is_followed_question ? '#icon-shoucanghover' : '#icon-shoucang',
                text: this.ask.is_followed_question ? '取消关注' : '关注问题',
                class: 'menuGuanzhu',
                number: 0,
                disable: false,
                rightLine: false,
                isLight: false
              }
            ]

            if (this.ask.question.status !== 8) {
              // 未采纳
              options.push({
                icon: '#icon-xiugai',
                text: huidaText,
                class: 'menuHuida',
                number: 0,
                disable: false,
                rightLine: false,
                isLight: true
              })
            }
          }
        }

        // 定向提问
        if (this.ask.question.question_type === 1) {
          if (this.isAsker) {
            options = [
              {
                icon: this.ask.is_followed_question ? '#icon-shoucanghover' : '#icon-shoucang',
                text: this.ask.is_followed_question ? '取消关注' : '关注问题',
                class: 'menuGuanzhu',
                number: 0,
                disable: false,
                rightLine: false,
                isLight: false
              }
            ]
          } else {
            options = [
              {
                icon: this.ask.is_followed_question ? '#icon-shoucanghover' : '#icon-shoucang',
                text: this.ask.is_followed_question ? '取消关注' : '关注问题',
                class: 'menuGuanzhu',
                number: 0,
                disable: false,
                rightLine: false,
                isLight: false
              },
              {
                icon: '#icon-xiugai',
                text: huidaText,
                class: 'menuHuida',
                number: 0,
                disable: false,
                rightLine: false,
                isLight: true
              }
            ]
          }
        }

        return options
      }
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.RefreshList && vm.$refs.RefreshList.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.RefreshList && this.$refs.RefreshList.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next()
    },
    methods: {
      goAskOffers () {
        if (!window.mui.os.plus) {
          this.openApp()
          return
        }
        this.$router.pushPlus('/ask/offers')
      },
      openApp () {
        window.mui.trigger(document.querySelector('.AppOne'), 'tap')
      },
      goRobAnswer () {
        toAnswer(this, this.ask.question.id)
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      toAsk () {
        this.$router.pushPlus('/ask/interaction')
      },
      toSeeHelp () {
        this.$router.pushPlus('/help/ask')
      },
      share () {
        this.$refs.ShareBtn.share()
      },
      refreshPageData () {
        console.log('refreshPageData-zz-answers')
        this.getId()
        this.$refs.refreshList.setPageData(this.prevOtherData)
      },
      getId () {
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

        if (id !== this.id) {
          this.loading = 1
        }

        this.id = id
      },
      shareSuccess () {
        // alertAskCommunityDetailShareSuccess(this);
      },
      shareFail () {
      },
      prevSuccessCallback () {
        this.getDetail()
      },
      setFollowAskStatus (status) {
        this.ask.is_followed_question = status
      },
      getDetail (successCallback = () => {}) {
        this.getId()

        console.log('getDetail' + this.id)

        postRequest(`question/info`, {id: this.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.ask = response.data.data

          this.loading = 0

          if (this.ask.question.question_type === 1 && this.ask.answers.length && this.ask.answers[0].id) {
            this.$router.replace('/ask/offer/' + this.ask.answers[0].id)
            return
          }

          var shareOptions = getAskCommunityInteractionAnswers(
            this.id,
            this.ask.question.description,
            this.ask.question.question_answer_num,
            this.ask.question.question_follow_num
          )

          this.shareTitle = shareOptions.title
          this.shareUrl = shareOptions.link
          this.shareContent = shareOptions.content
          this.shareImg = shareOptions.imageUrl
          successCallback()
        })
      },
      footerMenuClickedItem (item) {
        switch (item.text) {
          case '邀请回答':
            toContact(
              this,
              this.ask.question.id,
              this.ask.question.user_name,
              this.ask.question.description,
              this.ask.question.answer_num,
              this.ask.question.follow_num
            )
            break
          case '回答':
            toAnswer(this, this.ask.question.id)
            break
          case '查看我的回答':
            toSeeSelfAnswer(this, this.ask.my_answer_id)
            break
          case '关注问题':
          case '取消关注':
            collectQuestion(this, this.ask.question.id, () => {
              this.ask.question.question_follow_num++
              this.ask.is_followed_question = 1
            }, () => {
              this.ask.question.question_follow_num--
              this.ask.is_followed_question = 0
            })
            break
        }
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
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getId()
    }
  }
  export default AskDetail
</script>


<style scoped lang="less">
  .container-label{
    padding:0 0.4rem;
  }
  .refreshListWrapper{
    bottom:1.333rem;
  }
  .mui-content {
    background: #fff;
  }
  .border-football{
    border:none;
  }
  .mui-android .container-label .border-football {
    padding-top: 0.08rem;
  }

  .container-recommentProduct {
    .title {
      height: 1.173rem;
      line-height: 1.173rem;
      .text {
        color: #444444;
        font-size: 0.426rem;
        padding: 0 0.426rem;
      }
    }

    .comment-product {
      padding: 0.346rem 0.4rem 0;
      .product-info {
        overflow: hidden;
        border-radius: 0.106rem;
        padding: 0 0 0.4rem;
        background: none;
        .product-img {
          width: 1.173rem;
          height: 1.173rem;
          float: left;
          img {
            width: 100%;
            height: 100%;
            border-radius: 0.106rem;
            object-fit: cover;
          }
        }
        .product-detail {
          float: left;
          margin-left: 0.266rem;
          .productName {
            width: 7.573rem;
            color: #444444;
            font-size: 0.426rem;
            line-height: 0.6rem;
          }
          .productMark {
            display: flex;
            .icon {
              color: #FCC816;
              font-size: 0.32rem;
            }
            span {
              color: #B4B4B6;
              font-size: 0.293rem;
              line-height: 0.4rem;
              &:nth-of-type(1) {
                color: #FCC816;
                margin-left: 0.08rem;
              }
            }
            i {
              width: 0.053rem;
              height: 0.053rem;
              margin-right: 0.133rem;
              vertical-align: middle;
              border-radius: 50%;
              background: #B4B4B6;
              display: inline-block;
            }
            .stars {
              display: flex;
              div {
                margin-right: 0.08rem;
              }
            }
            .starsText {
            }
          }
        }
      }
    }
  }

  .robAnswer {
    width: 2.48rem;
    height: 0.96rem;
    position: relative;
    z-index: 22;
    margin: -0.533rem auto 0.8rem;
    text-align: center;
    line-height: 0.96rem;
    color: #03AEF9;
    border-radius: 2.666rem;
    border: 0.026rem solid #DCDCDC;
  }
</style>

<style>
  .offerAnswersFooterMenu .menuGuanzhu .icon{
    font-size:0.56rem !important;
  }

  .offerAnswersFooterMenu .menuHuida .icon{
    font-size:0.426rem !important;
  }
</style>
