<template>
  <div>
    <HomeSearch :unread_count="unread_count" :contact_id="contact_id"></HomeSearch>
    <div class="mui-content">
      <!--菜单-->
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/discover')">关注</span>
        <span @tap.stop.prevent="$router.replace('/discoverGroup')">圈子</span>
        <span class="font-family-medium">推荐<i></i></span>
        <i class="bot"></i>
      </div>
      <!--列表-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="{search_type: 6}"
        :nextOtherData="{search_type: 6}"
        :pageMode = "true"
        :isShowUpToRefreshDescription="true"
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
            <div  v-else-if="item.feed_type === 5 && item.feed.domain !== ''" >
              <SubmitReadhubAriticle :data="item"
                                     @comment="comment"
              ></SubmitReadhubAriticle>
            </div>


            <!--x关注了互动问答-->
            <FllowFreeQuestion v-else-if="item.feed_type === 6" :data="item" ></FllowFreeQuestion>

            <!--x关注了新的朋友-->
            <FllowUser v-else-if="item.feed_type === 7" :data="item"></FllowUser>

            <!--x评论了专业回答-->
            <CommentPayQustion v-else-if="item.feed_type === 8" :data="item"></CommentPayQustion>

            <!--x评论了互动回答-->
            <CommentFreeQuestion v-else-if="item.feed_type === 9" :data="item"></CommentFreeQuestion>

            <!--x评论了文章-->
            <div v-else-if="item.feed_type === 10">
              <CommentReadhubAriticle  :data="item"></CommentReadhubAriticle>
            </div>


            <!--x赞了专业回答-->
            <UpvotePayQuestion v-else-if="item.feed_type === 11" :data="item"></UpvotePayQuestion>

            <!--x赞了互动回答-->
            <UpvoteFreeQuestion v-else-if="item.feed_type === 12" :data="item"></UpvoteFreeQuestion>

            <!--x赞了文章-->
            <div v-else-if="item.feed_type === 13">
              <UpvoteReadhubAriticle  :data="item"></UpvoteReadhubAriticle>
            </div>
          </div>
          <!--圈子信息-->
          <div class="followGroups" v-if="item.feed.group">
            <div class="follow-content">
              <groups-list class="small groups"
                           :list="item.feed.group"
                           :type="'small'"
              ></groups-list>
            </div>
          </div>
        </template>
      </RefreshList>

      <!---->
    </div>
    <commentTextarea ref="ctextarea"
                     @sendMessage="sendMessage"
    ></commentTextarea>

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
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  import groupsList from '../../components/groups/GroupsList.vue'
  import userAbility from '../../utils/userAbility'
  import HomeSearch from '../../components/search/Home'

  export default {
    data () {
      return {
        list: [],
        emptyDescription: '暂无您关注的内容',
        is_company: currentUser.is_company,
        contact_id: '',
        unread_count: 0
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
      ServiceRecommendation,
      groupsList,
      HomeSearch
    },
    props: {},
    watch: {},
    activated: function () {
      if (this.$route.query.refresh) {
        this.$refs.RefreshList.refreshPageData(this.prevOtherData)
      }
    },
    methods: {
      messagecountchange (obj) {
        console.log(obj.contact_id)
        if (obj.contact_id) {
          this.contact_id = obj.contact_id
          this.unread_count = obj.unread_count
        }
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
      sendMessage (message) {
        var commentTarget = message.commentData

        postRequest(`article/comment-store`, {
          'submission_id': commentTarget.submissionId,
          body: message.content,
          parent_id: commentTarget.parentId,
          mentions: message.noticeUsers
        }).then(response => {
          var code = response.data.code

          if (code === 6108) {
            userAbility.inviteJoinInGroup(this, response.data.data.group_id)
            return
          }

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

  /*菜单*/
  /*菜单*/
  .menu{
    width:100%;
    height: 1.173rem;
    background: #FFFFFF;
    font-size:0.373rem;
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
    left: 0rem;
  }
  .listWrapper{
    top:1.173rem;
    bottom: 1.333rem;
  }
  .followGroups{
    width: 100%;
    background: #ffffff;
    margin-top: -0.266rem;
    position: relative;
    height: 1.973rem;
  }
  .followGroups:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: .267rem;
    background-color: #f3f4f6;
    width: 100%;
  }
  .followGroups .follow-content{
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }
</style>
