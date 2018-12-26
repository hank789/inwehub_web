<template>
  <div>
    <HomeSearch :unread_count="unread_count" :contact_id="contact_id"></HomeSearch>

    <div class="mui-content feedWrapper">
      <div class="menu">
        <span class="font-family-medium">关注<i></i></span>
        <span @tap.stop.prevent="$router.replace('/discoverGroup')">圈子</span>
        <span @tap.stop.prevent="$router.replace('/discoverRecommend')">推荐</span>
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
        :isShowUpToRefreshDescription="true"
        
        :emptyDescription="emptyDescription"
        class="listWrapper"
      >
        <template v-for="(item, index) in list">
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
            <div v-else-if="item.feed_type === 5 && item.feed.domain !== ''">
              <SubmitReadhubAriticle  :data="item"
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
          <!--并列-->
          <!--圈子信息-->
          <div class="followGroups" v-if="item.feed.group">
            <div class="follow-content">
              <groups-list class="small groups"
                           :list="item.feed.group"
                           :type="'small'"
              ></groups-list>
            </div>
          </div>
          <!---->
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
  import groupsList from '../../components/groups/GroupsList.vue'

  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { goThirdPartyArticle } from '../../utils/webview'
  import commentTextarea from '../../components/comment/Textarea.vue'
  import userAbility from '../../utils/userAbility'
  import HomeSearch from '../../components/search/Home'

  export default {
    data () {
      return {
        list: [],
        emptyDescription: '暂无您关注的用户的动态',
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
      messagecountchange (obj) {
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
    top:1.173rem !important;
    bottom: 1.333rem !important;
  }
  .w414-3 .listWrapper{
    top:1.173rem !important;
    bottom: 1.333rem !important;
  }

  .activityWrapper.unIsGetted ~ .listWrapper {
    top:1.173rem !important;
    bottom: 1.333rem !important;
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
<style>
  .feedWrapper .container-avatarAndText{
    margin-bottom:0.266rem;
  }
  .component-iconNumber{
    margin-left: 0.2rem;
  }

  .feedWrapper .iconPenglunWrapper {
    margin: 0 0.2rem;
  }
  .labelWrapper{
    text-align: right;
  }
  /*回答者列表*/
  .answer-list{
    width:100%;
    height:1.146rem;
    background:#f3f4f6;
    border-radius: 0.106rem;
    line-height: 1.146rem;
    padding: 0 0.4rem;
    font-size:0.346rem;
    color: rgb(128,128,128);
    margin-top: 0.133rem;
  }
  .answer-list span{
    color:#03aef9;
  }
  .answer-list span i{
    color: rgb(146,146,146);
    margin-right: 0.133rem;
  }
  .answer-list span:nth-last-of-type(1) i{
    display: none;
  }
  /*标签*/
  .tags{
    font-size:0.426rem;
    color:rgb(35,82,128);
    margin-right: 0.133rem;
  }
  /*关注数 点赞的间距*/
  .options{
    margin-top: 0.24rem;
  }
  /*好评率*/
  .feedWrapper .component-followed-question{
    float: left;
    font-size:0.346rem;
    color:#b4b4b6;
  }
  /*关注数*/
  .feedWrapper .blue{
    float: left;
    font-size:0.32rem;
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
    font-size: 0.426rem;
  }
</style>
