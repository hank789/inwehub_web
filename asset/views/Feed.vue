<template>
  <div>
    <header class="hidewechattitle mui-bar mui-bar-nav component-homeHeader">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-logowenzi"></use>
      </svg>

      <div class="rightWrapper" @tap.stop.prevent="toAddArticle()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-plus--"></use>
        </svg>
      </div>

    </header>

    <div class="mui-content" v-show="!loading">

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :isShowUpToRefreshDescription="false"
        :list="list"
        class="listWrapper"
      >

        <Activity></Activity>

        <template v-for="(item, index) in list">

          <Swiper v-if="index===2"></Swiper>
          <ServiceRecommendation v-if="index===5" :isShow="true" :key="'feed-swiper'"  @alertClick="alertClick"></ServiceRecommendation>


          <div v-if="item.feed_type === 5 && item.feed.domain === ''">
            <!--x发布了发现-->
            <DiscoverShare :data="item"></DiscoverShare>
          </div>
          <div @tap.stop.prevent="toDetail(item)" v-else>

            <!--x回答了专业问答-->
            <AnswerMajor v-if="item.feed_type === 1" :data="item"></AnswerMajor>

            <!--x回答了互动问答-->
            <AnswerInteraction v-else-if="item.feed_type === 2" :data="item"></AnswerInteraction>

            <!--x发布了互动问答-->
            <CreateFreeQuestion v-else-if="item.feed_type === 3" :data="item"></CreateFreeQuestion>

            <!--x发布了文章-->
            <SubmitReadhubAriticle v-else-if="item.feed_type === 5 && item.feed.domain !== ''" :data="item"></SubmitReadhubAriticle>

            <!--x关注了互动问答-->
            <FllowFreeQuestion v-else-if="item.feed_type === 6" :data="item"></FllowFreeQuestion>

            <!--x关注了互动问答-->
            <FllowFreeQuestion v-else-if="item.feed_type === 6" :data="item"></FllowFreeQuestion>

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

  import RefreshList from '../components/refresh/List.vue'
  import Activity from '../components/home/Activity.vue'
  import Swiper from '../components/home/Swiper.vue'
  import userAbility from '../utils/userAbility'
  import { goThirdPartyArticle } from '../utils/webview'
  import { alertCompanyUser, alertDiscoverCompany } from '../utils/dialogList'
  import { getLocalUserInfo } from '../utils/user'
  const currentUser = getLocalUserInfo()

  const Feed = {
    data: () => ({
      loading: false,
      list: [],
      is_company: currentUser.is_company
    }),
    created () {
      this.getHomeData()
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
      ServiceRecommendation
    },
    activated: function () {

    },
    mounted () {
      // 新手任务
      userAbility.newbieTask(this)
    },
    computed: {},
    methods: {
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
        })
      },
      toDetail (item) {
        if (item.feed_type === 7) item.url += '?goback=1'

        switch (item.feed_type) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 6:
          case 7:
          case 8:
          case 9:
          case 11:
          case 12:
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
  .mui-content{
    background: #f3f4f6;
  }
  .listWrapper {
    top: 0;
    bottom: 50px;
  }

  .activityWrapper.unIsGetted ~ .listWrapper {
    top: 42px;
  }

  .rightWrapper {
    position: absolute;
    padding:12px;
    right: 3px;
    top: 0;
  }

  .rightWrapper .icon {
    font-size: 17px;
  }

  .mui-content {
    background: #fff
  }
</style>
