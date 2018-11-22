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

      <div class="line-river-after line-river-after-top"></div>

      <div class="container-tabLabels">
        <swiper :options="swiperOption" class="container-upload-images">
            <swiper-slide v-for="(tag, index) in tags" :key="index" class="tagLabel" :tagId="tag.value">
              <span class="tab" :class="{active:selectTagValue === tag.value}" @tap.stop.prevent="selectTag(tag)">{{tag.text}}</span>
            </swiper-slide>
        </swiper>
      </div>

      <svg class="icon selectDomainIcon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/userGuide/interst?from=home')">
        <use xlink:href="#icon-xingqubiaoqian"></use>
      </svg>

      <RefreshList
        ref="refreshList"
        class="refreshListWrapper"
        v-model="list"
        :api="'recommendRead'"
        :prevOtherData="prevOtherData"
        :nextOtherData="prevOtherData"
        :isShowUpToRefreshDescription="true"
        :list="list"
        :pageMode="true"
        :autoShowEmpty="false"
      >

        <div id="home-content" class="container-list-article">
          <template  v-for="(item, index) in list">
            <div class="component-item-article" @tap.stop.prevent="toDetail(item)">
              <div class="itemArticleLeft">
                <div class="titleWrapper">
                  <div class="title text-line-2 text-content">{{item.data.title}}</div>
                </div>
                <div class="explain">
                  <label v-if="item.tips">{{item.tips}}</label><span v-if="item.type_description">{{item.type_description}}</span><timeago :since="timeago(item.created_at)" :auto-update="60">
                </timeago>
                </div>
              </div>
              <div class="itemArticleRight"><img class="lazyImg" v-lazy="item.data.img"></div>
            </div>
            <div class="line-river-after line-river-after-short" v-if="index !== list.length-1"></div>
          </template>
        </div>
      </RefreshList>

    </div>
  </div>
</template>
<script>

  import RefreshList from '../components/refresh/List.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { getRequest } from '../utils/request'

  const Domain = {
    data () {
      return {
        loading: 1,
        list: [],
        data: {
        },
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 0,
          freeMode: true
        },
        selectTagValue: null,
        tags: []
      }
    },
    created () {
      this.refreshPageData()
    },
    components: {
      RefreshList,
      swiper,
      swiperSlide
    },
    activated: function () {
      this.refreshPageData()
    },
    computed: {
      prevOtherData () {
        return {
          orderBy: 1,
          recommendType: 2,
          tagFilter: this.selectTagValue
        }
      }
    },
    methods: {
      selectTag (tag) {
        if (tag.value === this.selectTagValue) {
          this.selectTagValue = null
        } else {
          this.selectTagValue = tag.value
        }
      },
      toHome () {
        this.$router.replace('home')
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      refreshPageData () {
        getRequest('profile/info', {}).then(response => {
          var tags = response.data.data.info.region_tags
          this.tags = tags
          if (!this.tags.length) {
            this.$router.pushPlus('/userGuide/interst?from=home')
          }
        })
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
      // 左滑
      document.getElementById('home-content').addEventListener('swipeleft', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle >= 160) {
          this.$router.replace('/home')
        }
      })
      // 右滑
      document.getElementById('home-content').addEventListener('swiperight', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle <= 20) {
          this.$router.replace('/home')
        }
      })
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
    top: 2.4rem;
    bottom:1.333rem;
  }
  .container-tabLabels{
    width: 8.533rem;
    height:0.906rem;
    margin-left:0.426rem;
    margin-top: 0.24rem;
  }
  .swiper-container{
    height:0.933rem;
  }
  .tagLabel{
    width:auto !important;
  }
  .selectDomainIcon{
    font-size: 0.506rem;
    color: #808080;
    position: absolute;
    right: 0.4rem;
    top: 1.6rem;
  }
</style>
