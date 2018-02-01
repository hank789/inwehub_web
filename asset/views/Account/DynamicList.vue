<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{user_uuid == uuid ? '我的动态' : 'Ta的动态'}}</h1>
    </header>

    <div class="mui-content">
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        :list="list"
        :emptyDescription="emptyDescription"
        class="listWrapper"
      >
        <template v-for="(item, index) in list">
          <div @tap.stop.prevent="toDetail(item)">

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
    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
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
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  export default {
    data () {
      return {
        list: [],
        emptyDescription: '暂无您关注的内容',
        dataList: {},
        uuid: currentUser.uuid,
        user_uuid: ''
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
      UpvoteReadhubAriticle
    },
    created () {
      if (this.$route.query.id) {
        this.dataList = {
          search_type: 5,
          uuid: this.$route.query.id
        }
        this.user_uuid = this.$route.query.id
      }
    },
    methods: {
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
    },
    mounted () {
      console.error(currentUser.uuid)
    },
    updated () {}
  }
</script>
<style scoped="scoped">
  .mui-content {
    background: #fff
  }
</style>
