<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">我的收藏</h1>
    </header>
    <div class="mui-content">

      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/my/collectedAnswers')">问答</span>
        <span @tap.stop.prevent="$router.replace('/my/collectedArticle')">分享</span>
        <span class="font-family-medium">点评<i></i></span>
        <i class="bot"></i>
      </div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'collected/reviews'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :autoShowEmpty="false"
        class="listWrapper"
      >

        <template v-for="(comment, index) in list">
          <feedDianping :item="comment" @showItemMore="showItemMore"></feedDianping>
        </template>

        <div class="noResult increase dianping-search" v-if="!list.length">
          <div class="empty-Img">
            <img src="../../../statics/images/empty@3x.png">
          </div>
          <div class="noResultText">暂时还没有数据呀~</div>
        </div>

      </RefreshList>

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
  import RefreshList from '../../../components/refresh/MescrollList.vue'
  import feedDianping from '../../../components/Feed.vue'
  import PageMore from '../../../components/PageMore.vue'

  export default {
    data () {
      return {
        list: [],
        shareOption: {},
        iconMenus: []
      }
    },
    components: {
      RefreshList,
      feedDianping,
      PageMore
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
      showItemMore (shareOption, item) {
        this.iconMenus = []
        this.shareOption = shareOption
        this.$refs.share.share()
      }
    },
    mounted () {
    }
  }

</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
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
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .container-searchMenu {
    margin-top: 0;
  }
</style>
