<template>
  <div>
    <header class="hidewechattitle mui-bar mui-bar-nav component-homeHeader">
      <div class="headerWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg>

        <div class="rightWrapper" @tap.stop.prevent="toAddArticle()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-plus--"></use>
          </svg>
        </div>
      </div>
    </header>

    <div class="mui-content feedWrapper" v-show="!loading">
      <!--导航栏-->
      <div class="menu">
        <span :class="{bold: search_type === 1}" @tap.stop.prevent="chooseType(1)">关注<i v-if="search_type === 1"></i></span>
        <span :class="{bold: search_type === 2}" @tap.stop.prevent="chooseType(2)">全部<i v-if="search_type === 2"></i></span>
        <span :class="{bold: search_type === 3}" @tap.stop.prevent="chooseType(3)">问答<i v-if="search_type === 3"></i></span>
        <span :class="{bold: search_type === 4}" @tap.stop.prevent="chooseType(4)">分享<i v-if="search_type === 4"></i></span>
        <span  @tap.stop.prevent="judge()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhaoguwenyuanshi"></use>
          </svg>
        </span>
        <i class="bot"></i>
      </div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        :list="list"
        :emptyDescription="emptyDescription"
        class="listWrapper"
      >

        <Activity></Activity>

        <template v-for="(item, index) in list">

          <Swiper v-if="index===2 && search_type === 2"></Swiper>
          <ServiceRecommendation v-if="index===15 && search_type === 2" :isShow="true" :key="'feed-swiper'"  @alertClick="alertClick"></ServiceRecommendation>


          <div v-if="item.feed_type === 5 && item.feed.domain === ''">
            <!--x发布了发现-->
            <DiscoverShare
              :data="item"
              ref="discoverShare"
              @comment="comment"
            ></DiscoverShare>
          </div>
          <div @tap.stop.prevent="toDetail(item)" v-else>

            <!--x回答了专业问答-->
            <AnswerMajor v-if="item.feed_type === 1" :data="item"></AnswerMajor>

            <!--x回答了互动问答-->
            <AnswerInteraction v-else-if="item.feed_type === 2" :data="item"></AnswerInteraction>

            <!--x发布了互动问答-->
            <CreateFreeQuestion v-else-if="item.feed_type === 3" :data="item"></CreateFreeQuestion>

            <!--x发布了文章-->
            <SubmitReadhubAriticle v-else-if="item.feed_type === 5 && item.feed.domain !== ''" :data="item"
             @comment="comment"
            ></SubmitReadhubAriticle>

            <!--x关注了互动问答-->
            <FllowFreeQuestion v-else-if="item.feed_type === 6" :data="item" ></FllowFreeQuestion>

            <!--x关注了新的朋友-->
            <FllowUser v-else-if="item.feed_type === 7" :data="item"></FllowUser>

            <!--x评论了专业回答-->
            <CommentPayQustion v-else-if="item.feed_type === 8" :data="item"></CommentPayQustion>

            <!--x评论了互动回答-->
            <CommentFreeQuestion v-else-if="item.feed_type === 9" :data="item"></CommentFreeQuestion>

            <!--x评论了文章-->
            <CommentReadhubAriticle v-else-if="item.feed_type === 10" :data="item"></CommentReadhubAriticle>

            <!--x赞了专业回答-->
            <UpvotePayQuestion v-else-if="item.feed_type === 11" :data="item"></UpvotePayQuestion>

            <!--x赞了互动回答-->
            <UpvoteFreeQuestion v-else-if="item.feed_type === 12" :data="item"></UpvoteFreeQuestion>

            <!--x赞了文章-->
            <UpvoteReadhubAriticle v-else-if="item.feed_type === 13" :data="item"></UpvoteReadhubAriticle>

          </div>
        </template>

        <div class="flex center font-12 color-c8c8c8 padding-13-0-20-0">你已经到达我的底线</div>

      </RefreshList>

    </div>
    <div id="statusBarStyle" background="#f3f4f6" bgColor="#f3f4f6" mode="dark"></div>

    <commentTextarea ref="ctextarea"
                     @sendMessage="sendMessage"
    ></commentTextarea>

  </div>

</template>
<script>
  import { postRequest } from '../utils/request'
  import AnswerMajor from '../components/feed/AnswerMajor'
  import AnswerInteraction from '../components/feed/AnswerInteraction'
  import CreateFreeQuestion from '../components/feed/CreateFreeQuestion'
  import SubmitReadhubAriticle from '../components/feed/SubmitReadhubAriticle'
  import FllowFreeQuestion from '../components/feed/FllowFreeQuestion'
  import FllowUser from '../components/feed/FllowUser'
  import CommentPayQustion from '../components/feed/CommentPayQustion'
  import CommentFreeQuestion from '../components/feed/CommentFreeQuestion'
  import CommentReadhubAriticle from '../components/feed/CommentReadhubAriticle'
  import UpvotePayQuestion from '../components/feed/UpvotePayQuestion'
  import UpvoteFreeQuestion from '../components/feed/UpvoteFreeQuestion'
  import UpvoteReadhubAriticle from '../components/feed/UpvoteReadhubAriticle'
  import DiscoverShare from '../components/feed/DiscoverShare.vue'
  import ServiceRecommendation from '../components/feed/ServiceRecommendation'
  import { openVendorUrl, openAppUrl, autoTextArea } from '../utils/plus'

  import RefreshList from '../components/refresh/List.vue'
  import Activity from '../components/home/Activity.vue'
  import Swiper from '../components/home/Swiper.vue'
  import userAbility from '../utils/userAbility'
  import { goThirdPartyArticle } from '../utils/webview'
  import { alertCompanyUser, alertDiscoverCompany } from '../utils/dialogList'
  import { getLocalUserInfo } from '../utils/user'
  import { saveLocationInfo } from '../utils/allPlatform'

  import commentTextarea from '../components/comment/Textarea.vue'

  const currentUser = getLocalUserInfo()

  const Feed = {
    data: () => ({
      loading: false,
      list: [],
      commentTargetComponent: null,
      is_company: currentUser.is_company,
      emptyDescription: '暂无您关注的内容',
      search_type: 1
    }),
    created () {
      this.getHomeData()
    },
    updated () {
      this.$nextTick(() => {
        var eles = this.$el.querySelectorAll('.textToLink')
        for (var i in eles) {
          openVendorUrl(eles[i])
          openAppUrl(eles[i])
        }
      })
    },
    components: {
      RefreshList,
      AnswerMajor,
      AnswerInteraction,
      CreateFreeQuestion,
      SubmitReadhubAriticle,
      FllowFreeQuestion,
      FllowUser,
      CommentPayQustion,
      CommentFreeQuestion,
      CommentReadhubAriticle,
      UpvotePayQuestion,
      UpvoteFreeQuestion,
      UpvoteReadhubAriticle,
      Activity,
      Swiper,
      DiscoverShare,
      ServiceRecommendation,
      commentTextarea
    },
    activated: function () {
      if (this.$route.query.refresh) {
        this.$refs.RefreshList.refreshPageData(this.prevOtherData)
      }
    },
    mounted () {
      userAbility.InvitationCoupon(this)
      // 新手任务
      userAbility.newbieTask(this)
      // 每日签到
      userAbility.signIGift(this)
      autoTextArea()
      saveLocationInfo()
    },
    computed: {
      prevOtherData () {
        return {search_type: this.search_type}
      },
      nextOtherData () {
        return {search_type: this.search_type}
      }
    },
    methods: {
      judge () {
        postRequest(`auth/checkUserLevel`, {
          permission_type: 5
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            if (response.data.data.is_valid) {
              this.$router.pushPlus('/nearbyCompany')
            } else {
              userAbility.jumpJudgeGrade(this)
            }
          }
        })
      },
      chooseType (type) {
        this.list = []
        this.search_type = type
        this.search_type = type
      },
      refreshPageData () {
        this.$refs.ctextarea.refreshPageData()
      },
      sendMessage (message) {
        var commentTarget = message.commentData

        postRequest(`article/comment-store`, {
          'submission_id': commentTarget.submissionId,
          body: message.content,
          parent_id: commentTarget.parentId,
          mentions: message.noticeUsers
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var data = response.data.data

          window.mui.toast(response.data.message)

          this.commentTargetComponent.prependItem(
            data.id,
            message.content,
            data.created_at,
            commentTarget.parentId,
            commentTarget.commentList
          )

          this.$refs.ctextarea.finish()
        })
      },
      comment (submissionId, parentId, commentTargetUsername, list, component) {
        // console.log('comment data:' + window.JSON.stringify(data) + ', comment:' + window.JSON.stringify(comment))
        var commentTarget = {
          submissionId: submissionId,
          parentId: parentId || 0,
          commentList: list
        }
        var data = {
          targetUsername: commentTargetUsername || '',
          commentData: commentTarget
        }
        this.commentTargetComponent = component
        this.$refs.ctextarea.comment(data)
      },
      alertClick (title) {
        if (this.is_company) {
          alertCompanyUser(this, () => {
            postRequest(`company/applyService`, {
              service_title: title
            }).then(response => {
              var code = response.data.code
              // 如果请求不成功提示信息 并且返回上一页；
              if (code !== 1000) {
                window.mui.alert(response.data.message)
                window.mui.back()
                return
              }
              if (response.data.data) {
                window.mui.toast(response.data.data.tips)
              }
            })
          })
        } else {
          alertDiscoverCompany(this)
        }
      },
      toAddArticle () {
        userAbility.jumpToAddArticle(this)
      },
      goArticle: function (article) {
        goThirdPartyArticle(
          article.view_url,
          article.id,
          article.title,
          article.comment_url,
          article.img_url
        )
      },
      getHomeData () {
        postRequest(`home`, {}, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
        // 是否弹受邀红包
          if (response.data.data.invitation_coupon.show) {
            userAbility.InvitationCoupon(this)
          }
        })
      },
      toDetail (item) {
        if (item.feed_type === 7) item.url += '?goback=1'

        switch (item.feed_type) {
          case 2:
          case 9:
          case 12:
          case 1:
          case 3:
          case 4:
          case 6:
          case 7:
          case 8:
          case 11:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
          case 10:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
          case 5:
            if (item.feed_type === 5 && item.feed.domain === '') {
              // ...
            } else {
              var linkArticle = {
                view_url: item.url,
                id: item.feed.submission_id,
                title: item.feed.title,
                comment_url: item.feed.comment_url,
                img_url: item.feed.img
              }
              this.goArticle(linkArticle)
            }
            break
          case 13:
            var article = {
              view_url: item.url,
              id: item.feed.submission_id,
              title: item.feed.title,
              comment_url: item.feed.comment_url,
              img_url: item.feed.img
            }
            this.goArticle(article)
            break
          default:
            break
        }
      }
    }
  }
  export default Feed
</script>

<style lang="less" scoped>
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  /*菜单*/
  .menu{
    width:100%;
    height:39px;
    background: #FFFFFF;
    font-size:14px;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  .menu span{
    position:relative;
  }
  .menu span.bold{
    font-weight: 500;
  }
  .menu span  i{
    position:absolute;
    width:28px;
    height:1.5px;
    border-radius: 50px;
    background:#03aef9;
    top: 28.4px;
    left: 0;
    right: 0;
    margin: auto;
  }
  .menu span svg{
    font-size: 25px;
  }

  .mui-content{
    background: #f3f4f6;
  }
  .listWrapper {
    top: 39px;
    bottom: 50px;
  }

  .activityWrapper.unIsGetted ~ .listWrapper {
    top: 42px;
  }

  .rightWrapper {
    position: absolute;
    padding:12px;
    right: 3px;
    bottom: 0;
  }

  .rightWrapper .icon {
    font-size: 17px;
  }

  .mui-content {
    background: #fff
  }

  .headerWrapper{
    height:45px;
    overflow: hidden;
  }
</style>

<style>
  .feedWrapper .container-avatarAndText{
    margin-bottom:10px;
  }
  .component-iconNumber{
    margin-left: 7.5px;
  }

  .feedWrapper .iconPenglunWrapper {
    margin: 0 7.5px;
  }
  .labelWrapper{
    text-align: right;
  }
  /*回答者列表*/
  .answer-list{
    width:100%;
    height:43px;
    background:#f3f4f6;
    border-radius: 4px;
    line-height: 43px;
    padding: 0 15px;
    font-size:13px;
    color: rgb(128,128,128);
    margin-top: 5px;
  }
  .answer-list span{
    color:#03aef9;
  }
  .answer-list span i{
    color: rgb(146,146,146);
    margin-right: 5px;
  }
  .answer-list span:nth-last-of-type(1) i{
    display: none;
  }
  /*标签*/
  .tags{
    font-size:16px;
    color:rgb(35,82,128);
    margin-right: 5px;
  }
  /*关注数 点赞的间距*/
  .options{
    margin-top: 9px;
  }
  /*好评率*/
  .feedWrapper .component-followed-question{
    float: left;
    font-size:13px;
    color:#b4b4b6;
  }
  /*关注数*/
  .feedWrapper .blue{
    float: left;
    font-size:12px;
    color:#03aef9;
  }
  /*评论了互动问答内容超出两行的样式*/
  .ellipsis p {
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    /* word-wrap: break-word; */
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 16px;
  }


</style>
