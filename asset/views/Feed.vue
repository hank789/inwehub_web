<template>
  <div>
    <div id="home-content" class="mui-content">

      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>
        <div class="logoAndTabsAndSearchTabs">
          <div class="tab active">关注</div>
          <div class="tab" @tap.stop.prevent="$router.replace('/ask/offers')">问答</div>
          <div class="tab" @tap.stop.prevent="$router.replace('/groups')">圈子</div>
        </div>
        <svg class="icon searchIcon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/searchSubmission','list-detail-page-three')">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </div>

      <div class="line-river-after line-river-after-top"></div>

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
        :autoShowEmpty="false"
        class="listWrapper"
      >
        <template v-for="(item, index) in list">

          <div class="component-feed-item-guide" v-if="index === 3 && search_type === 2">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gongkai"></use>
            </svg>
            <div class="desc">关注你感兴趣的人和圈子，了解他们的最新动态</div>
            <div class="buttonWrapper" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone?from=feed')">
              <button>去看看</button>
            </div>
            <div class="line-river-after line-river-after-top"></div>
          </div>

          <FeedItem
            :item="item"
            @showItemMore="showItemMore"
          ></FeedItem>
        </template>

      </RefreshList>

    </div>

    <PageMore
      ref="share"
      :shareOption="shareOption"
      :hideShareBtn="true"
      :iconMenu="iconMenus"
      @success="shareSuccess"
      @fail="shareFail"
      @clickedItem="iconMenusClickedItem"
    ></PageMore>
  </div>
</template>
<script>
  import RefreshList from '../components/refresh/List.vue'
  import HomeSearch from '../components/search/Home'
  import FeedItem from '../components/Feed.vue'
  import PageMore from '../components/PageMore.vue'

  const Feed = {
    data: () => ({
      search_type: 2, // 1:关注,2:全部,3:问答,4:分享,5:他的动态,6:推荐,默认2
      emptyDescription: '暂无内容',
      unread_count: 0,
      contact_id: '',
      list: [],
      shareOption: {},
      iconMenus: []
    }),
    created () {

    },
    updated () {
    },
    components: {
      RefreshList,
      HomeSearch,
      FeedItem,
      PageMore
    },
    activated: function () {
      this.refreshPageData()
    },
    mounted () {
      // 左滑
      document.getElementById('home-content').addEventListener('swipeleft', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle >= 160) {
          this.$router.replace('/ask/offers')
        }
      })
      // 右滑
      document.getElementById('home-content').addEventListener('swiperight', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle <= 20) {
          this.$router.replace('/groups')
        }
      })
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
      showItemMore (shareOption) {
        this.shareOption = shareOption
        this.$refs.share.share()
      },
      shareFail () {

      },
      shareSuccess () {

      },
      iconMenusClickedItem () {
      },
      refreshPageData () {
        if (this.$route.query.refresh) {
          this.$refs.RefreshList.refreshPageData(this.prevOtherData)
        }
      },
      messagecountchange (obj) {
        if (obj.contact_id) {
          this.contact_id = obj.contact_id
          this.unread_count = obj.unread_count
        }
      },
      switchSearchType (filter) {
        this.search_type = filter
      }
    }
  }
  export default Feed
</script>

<style lang="less" scoped>
  .mui-content{
    background: #fff;
  }
  .listWrapper {
    top: 1.173rem;
    bottom: 50px; /* px不转换 */
  }
  .component-feed-item-guide {
    padding-top: 0.8rem;
    .line-river-after {
      margin-top: 0.8rem;
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
  }
  .newLink {
    margin-top: 0.24rem;
    // padding: 0 0.426rem;
    .newLinkBox {
      margin-top: 0.266rem;
      padding: 0.4rem 0.4rem 0.293rem;
      background: #F7F8FA;
      border-radius: 0.106rem;
      .container-image {
        margin-top: 0;
        margin-bottom: 0.213rem;
      }
      img {
        // width: 8.373rem;
        // height: 2.986rem;
        border-radius: 0.106rem;
      }
      .linkContent {
        font-size: 0.373rem;
        color: #808080;
        // line-height: 0.533rem;
      }
      .link {
        font-size: 0.32rem;
        color: #B4B4B6;
      }
    }
  }
  .feedResult {
    .noResult {
      padding-bottom: 0;
    }
    .noContent {
      /*padding-top: 3.2rem;*/
      .buttonWrapper {
        margin-bottom: 0.4rem;
      }
    }
  }
</style>
