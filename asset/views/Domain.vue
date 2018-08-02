<template>
  <div>
    <div class="mui-content">
      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>
        <div class="logoAndTabsAndSearchTabs">
          <div class="tab" @tap.stop.prevent="toHome()">热点</div>
          <div class="tab active">领域</div>
        </div>
        <svg class="icon searchIcon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/searchQuestion','list-detail-page-three')">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </div>

      <RefreshList
        ref="refreshList"
        class="refreshListWrapper"
        v-model="list"
        :api="'recommendRead'"
        :prevOtherData="prevOtherData"
        :nextOtherData="prevOtherData"
        :isShowUpToRefreshDescription="false"
        :list="list"
        :pageMode="true"
        :autoShowEmpty="false"
      >

        <div class="container-list-article">
          <template  v-for="(item, index) in list">
            <div class="line-river-big" v-if="index === 5"></div>
            <div class="component-item-article" @tap.stop.prevent="toDetail(item)">
              <div class="itemArticleLeft">
                <div class="titleWrapper">
                  <div class="title text-line-2 text-content"><span class="number" v-if="index < 5">{{index+1}}.</span>{{item.data.title}}</div>
                </div>
                <div class="explain">
                  <label v-if="item.tips">{{item.tips}}</label><span v-if="item.type_description">{{item.type_description}}</span><timeago :since="timeago(item.created_at)" :auto-update="60">
                </timeago>
                </div>
              </div>
              <div class="itemArticleRight"><img class="lazyImg" v-lazy="item.data.img"></div>
            </div>
            <div class="line-river-after line-river-after-short" v-if="index !== 4 && index !== list.length-1"></div>
          </template>
        </div>
      </RefreshList>

    </div>
  </div>
</template>
<script>

  import RefreshList from '../components/refresh/List.vue'

  const Domain = {
    data () {
      return {
        loading: 1,
        list: [],
        data: {
        }
      }
    },
    created () {},
    components: {
      RefreshList
    },
    activated: function () {
      this.refreshPageData()
    },
    computed: {
      prevOtherData () {
        return {
          orderBy: 1,
          recommendType: 1
        }
      }
    },
    methods: {
      toHome () {
        this.$router.pushPlus('home')
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      refreshPageData () {
      },
      toDetail (item) {
        switch (item.read_type) {
          case 1:
            this.$router.pushPlus('/c/' + item.data.category_id + '/' + item.data.slug)
            break
          case 2:
            this.$router.pushPlus('/askCommunity/major/' + item.source_id)
            break
          case 3:
            this.$router.pushPlus('/ask/offer/answers/' + item.source_id)
            break
          case 4:
            this.$router.pushPlus('/EnrollmentStatus/' + item.source_id)
            break
          case 5:
            this.$router.pushPlus('/EnrollmentStatus/' + item.source_id)
            break
          case 6:
            this.$router.pushPlus('/ask/offer/' + item.source_id)
            break
          default:
        }
      }
    },
    updated () {},
    mounted () {
    }
  }
  export default Domain
</script>

<style lang="less" scoped>
  .mui-content{
    background: #fff;
  }
  .component-title-iconAndText{
    margin-top:0.533rem;
  }
  .refreshListWrapper{
    top: 1.173rem;
    bottom:1.333rem;
  }
</style>
