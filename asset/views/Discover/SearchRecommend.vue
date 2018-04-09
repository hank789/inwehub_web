<template>
  <div>
    <div class="mui-content">
      <!--search-->
      <div class="search">
        <div class="search-l">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-kefu"></use>
          </svg>
          <p>客服</p>
          <span class="mui-badge">34</span>
        </div>
        <div class="search-r" @tap.stop.prevent="$router.pushPlus('/searchQuestion','list-detail-page-three')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <p>搜内容、问答、圈子</p>
        </div>
      </div>
      <!--菜单-->
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/searchFollow')">关注</span>
        <span @tap.stop.prevent="$router.replace('/searchGroup')">圈子</span>
        <span class="bold">推荐<i></i></span>
        <i class="bot"></i>
      </div>
      <!--列表-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="{search_type: 1}"
        :nextOtherData="{search_type: 1}"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        :list="list"
        :emptyDescription="emptyDescription"
        class="listWrapper"
      >
        <template v-for="(item, index) in list">
          <Swiper v-if="index===2"></Swiper>
          <ServiceRecommendation v-if="index===15" :isShow="true" :key="'feed-swiper'"  @alertClick="alertClick"></ServiceRecommendation>

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
      </RefreshList>
      <commentTextarea ref="ctextarea"
                       @sendMessage="sendMessage"
      ></commentTextarea>
      <!---->
    </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import AnswerMajor from '../../components/feed/AnswerMajor'
  import AnswerInteraction from '../../components/feed/AnswerInteraction'
  import CreateFreeQuestion from '../../components/feed/CreateFreeQuestion'
  import SubmitReadhubAriticle from '../../components/feed/SubmitReadhubAriticle'
  import FllowFreeQuestion from '../../components/feed/FllowFreeQuestion'
  import FllowUser from '../../components/feed/FllowUser'
  import CommentPayQustion from '../../components/feed/CommentPayQustion'
  import CommentFreeQuestion from '../../components/feed/CommentFreeQuestion'
  import CommentReadhubAriticle from '../../components/feed/CommentReadhubAriticle'
  import UpvotePayQuestion from '../../components/feed/UpvotePayQuestion'
  import UpvoteFreeQuestion from '../../components/feed/UpvoteFreeQuestion'
  import UpvoteReadhubAriticle from '../../components/feed/UpvoteReadhubAriticle'
  import DiscoverShare from '../../components/feed/DiscoverShare.vue'
  import { openVendorUrl, openAppUrl } from '../../utils/plus'

  import RefreshList from '../../components/refresh/List.vue'
  import Swiper from '../../components/home/Swiper.vue'
  import ServiceRecommendation from '../../components/feed/ServiceRecommendation'
  import { goThirdPartyArticle } from '../../utils/webview'
  import { alertCompanyUser, alertDiscoverCompany } from '../../utils/dialogList'
  import commentTextarea from '../../components/comment/Textarea.vue'

  export default {
    data () {
      return {
        list: [],
        emptyDescription: '暂无您关注的内容'

      }
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
      DiscoverShare,
      commentTextarea,
      Swiper,
      ServiceRecommendation
    },
    props: {},
    watch: {},
    activated: function () {
      if (this.$route.query.refresh) {
        this.$refs.RefreshList.refreshPageData(this.prevOtherData)
      }
    },
    methods: {
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
      refreshPageData () {
        if (this.$route.query.refresh) {
          this.$route.query.refresh = false
          this.$refs.RefreshList.refreshPageData(this.prevOtherData)
        }
        this.$refs.ctextarea.refreshPageData()
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
      }
    },
    mounted () {
    },
    updated () {
      this.$nextTick(() => {
        var eles = this.$el.querySelectorAll('.textToLink')
        for (var i in eles) {
          openVendorUrl(eles[i])
          openAppUrl(eles[i])
        }
      })
    }
  }
</script>

<style scoped="scoped">
  span,
  p,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
  }
  /*search*/
  .search{
    width:92%;
    height:34px;
    margin-left: 4%;
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .search-l{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .search-l svg{
    font-size:25px;
    color: rgba(200,200,200,1);
  }
  .search-l p{
    font-size:10px;
    color: rgba(128,128,128,1);
    line-height: 14px;
    margin-bottom: 5px;
  }
  .search-r{
    width: 57%;
    height:100%;
    background:rgba(243,244,246,1);
    opacity:0.9477;
    border-radius: 50px;
    font-size: 14px;
    color:rgba(128,128,128,1);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .search-r svg{
    font-size: 17px;
    color: rgba(68,68,68,1);
    margin-left: 16px;
    margin-right: 6px;
  }
  /*菜单*/
  /*菜单*/
  .menu{
    width:100%;
    height: 1.173rem;
    background: #FFFFFF;
    font-size:14px;
    color:rgba(68,68,68,1);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: absolute;
  }
  .menu span{
    position:relative;
    margin-bottom: -0.293rem;
  }
  .menu span.bold{
    font-weight: 500;
  }
  .menu span  i{
    position:absolute;
    width: 0.7rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.67rem;
    left: 0;
    right: 0;
    margin: auto;
  }
  .listWrapper{
    top:91px;
    bottom: 50px;
  }
</style>
