<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title" v-if="isSelf">我的发布</h1>
      <h1 class="mui-title" v-else>Ta的发布</h1>
    </header>

    <div class="mui-content">
      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/my/publishAnswers/' + uuid)">回答</span>
        <span @tap.stop.prevent="$router.replace('/my/publishQuestions/' + uuid)">提问</span>
        <span @tap.stop.prevent="$router.replace('/my/publishArticle/' + uuid)">分享</span>
        <span @tap.stop.prevent="$router.replace('/my/publishComment/' + uuid)">评论</span>
        <span class="font-family-medium">点评<i></i></span>
        <i class="bot"></i>
      </div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'readhub/mySubmission'"
        :prevOtherData="{type:2,uuid: this.uuid}"
        :nextOtherData="{type:2,uuid: this.uuid}"
        :pageMode="true"
        :list="list"
        class="listWrapper">

        <div class="container-publishComment">
          <div class="container-commentWrapper" v-for="(item, index) in list" :key="index" @tap.stop.prevent="goToCommentPage(item.type, item.comment_url)">
            <div class="container-commentList">
              <div class="title text-line-2" v-html="textToLink(item.title)"></div>
              <div class="content text-line-1" v-html="textToLink(item.category_name)"></div>
              <div class="time"><timeago :since="timeago(item.created_at)" :auto-update="60"></timeago></div>
              <i class="bot"></i>
            </div>
          </div>
        </div>

      </RefreshList>

    </div>

  </div>
</template>

<script>
  import { getLocalUuid } from '../../../utils/user'
  import RefreshList from '../../../components/refresh/MescrollList.vue'
  import { textToLinkHtml, secureHtml } from '../../../utils/dom'

  export default {
    data () {
      return {
        list: [],
        uuid: '',
        userUuid: getLocalUuid()
      }
    },
    components: {
      RefreshList
    },
    activated () {
      this.refreshPageData()
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    },
    computed: {
      isSelf () {
        if (getLocalUuid() === this.$route.params.uuid) {
          return true
        }
        return false
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
      refreshPageData () {
        if (this.$route.params.uuid) {
          this.uuid = this.$route.params.uuid
        }
      },
      textToLink (text) {
        return secureHtml(textToLinkHtml(text))
      },
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      goToCommentPage (type, url) {
        if (type === 2) {
          this.$router.pushReadHubPage(url)
        } else {
          this.$router.pushPlus(url)
        }
      }
    },
    mounted () {
      this.refreshPageData()
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #FFFFFF;
  }
  .listWrapper {
    top: 1.04rem !important;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }

  .container-searchMenu {
    margin-top: 0;
  }
  .container-publishComment {
    .container-commentWrapper {
      padding: 0 0.426rem;
      .container-commentList {
        position: relative;
        padding: 0.28rem 0 0.306rem;
        .text {
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.64rem;
        }
        .content {
          color: #808080;
          font-size: 0.346rem;
          line-height: 0.64rem;
          margin-top: 0.106rem;
        }
        .time {
          color: #B4B4B6;
          font-size: 0.32rem;
          line-height: 0.44rem;
          margin-top: 0.16rem;
        }
      }
    }
  }

</style>
