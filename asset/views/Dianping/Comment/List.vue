<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">点评{{ totalData ? '(' + totalData + ')': '' }}</h1>
    </header>
    <div class="mui-content">
      <RefreshList
        v-if="id"
        ref="RefreshList"
        :api="'tags/productReviewList'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="true"
        v-model="list"
        :autoShowEmpty="true"
        class="listWrapper"
        @prevSuccessCallback="prevSuccessCallback"
      >
        <template v-for="(comment, index) in list">
          <feedDianping :item="comment" @showItemMore="showItemMore"></feedDianping>
        </template>
      </RefreshList>

      <div class="container-addComment" @tap.stop.prevent="goAddComment">
        <div class="container-addComment-icon">
          <svg class="icon logoIcon" aria-hidden="true">
            <use xlink:href="#icon-fabu"></use>
          </svg>
        </div>
      </div>

    </div>

    <PageMore
      ref="share"
      :shareOption="shareOption"
      :hideShareBtn="true"
      :iconMenu="iconMenus"
    ></PageMore>

  </div>
</template>

<script>
  import feedDianping from '../../../components/Feed.vue'
  import RefreshList from '../../../components/refresh/MescrollList.vue'
  import PageMore from '../../../components/PageMore.vue'
  import userAbility from '../../../utils/userAbility'

  export default {
    data () {
      return {
        id: '',
        list: [],
        orderBy: 1,
        shareOption: {},
        iconMenus: [],
        totalData: ''
      }
    },
    components: {
      feedDianping,
      RefreshList,
      PageMore
    },
    computed: {
      prevOtherData () {
        return {tag_name: this.id, orderBy: this.orderBy}
      },
      nextOtherData () {
        return {tag_name: this.id, orderBy: this.orderBy}
      }
    },
    mounted () {
    },
    updated () {
      this.$nextTick(() => {
      })
    },
    created () {
      this.refreshPageData()
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
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
      prevSuccessCallback () {
        this.totalNumber = this.$refs.RefreshList.getResponse()
        this.totalData = this.totalNumber.data.total
      },
      goAddComment () {
        this.id = this.$route.params.id
        userAbility.jumpToDianpingAdd(this, this.id)
      },
      showItemMore (shareOption, item) {
        this.iconMenus = []
        this.shareOption = shareOption
        this.$refs.share.share()
      },
      refreshPageData () {
        let id = this.$route.params.id

        if (!id) {
          window.mui.toast('请求异常')
          window.mui.back()
          return
        }
        this.id = id
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }

  .mui-android .commentList .commentUser .userInfo .userName span:nth-of-type(2) {
    line-height: 0.48rem;
  }
</style>
