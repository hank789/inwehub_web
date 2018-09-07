<template>
  <div>
    <div class="mui-content">
      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>
        <div class="logoAndTabsAndSearchTabs">
          <div class="tab active">热点</div>
          <div class="tab" @tap.stop.prevent="toDomain()">领域</div>
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

        <div id="slider" class="homeMuiSlider mui-slider" v-if="data.banners.length">
          <div class="mui-slider-group  mui-slider-loop">
            <div class="mui-slider-item mui-slider-item-duplicate" v-if="data.banners[data.banners.length-1]">
              <a @tap.stop.prevent="goLink(data.banners[data.banners.length-1].url)"><img class="lazyImg" v-lazy="data.banners[data.banners.length-1].img_url"></a>
            </div>
            <div class="mui-slider-item" v-for="(notice, index) in data.banners">
              <a  @tap.stop.prevent="goLink(notice.url)" target="_blank"><img class="lazyImg" v-lazy="notice.img_url"></a>
            </div>
            <div class="mui-slider-item mui-slider-item-duplicate" v-if="data.banners[0]">
              <a @tap.stop.prexvent="goLink(data.banners[0].url)">
                <img class="lazyImg" v-lazy="data.banners[0].img_url" />
              </a>
            </div>
          </div>
          <div class="home mui-slider-indicator">
            <div :class="{'mui-indicator':true, 'mui-active':index===0}" v-for="(notice, index) in data.banners"></div>
          </div>
        </div>

        <div class="component-title-iconAndText">
          <div class="iconAndTextLeft">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-huo"></use>
            </svg>实时热点TOP
          </div>
            <div class="iconAndTextRight" @tap.stop.prevent="toDiscoverAdd()">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tianjia"></use>
              </svg>爆料
          </div>
        </div>


        <div id="home-content" class="container-list-article">

          <template v-for="(item, index) in heatList">
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
            <div class="line-river-after line-river-after-short" v-if="index !== 4 && index !== heatList.length-1"></div>
          </template>
          <div class="line-river-big"></div>

          <template v-for="(item, index) in list">
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
            <div class="line-river-after line-river-after-short" v-if="index !== 4 && index !== list.length-1"></div>
          </template>
        </div>
      </RefreshList>

    </div>
  </div>
</template>
<script>

  import { getHomeData } from '../utils/home'
  import RefreshList from '../components/refresh/List.vue'
  import { saveLocationInfo } from '../utils/allPlatform'
  import { AppInit, autoTextArea, openUrlByUrl } from '../utils/plus'
  import userAbility from '../utils/userAbility'
  import { postRequest } from '../utils/request'

  const Home = {
    data () {
      return {
        loading: 1,
        list: [],
        heatList: {},
        data: {
          banners: []
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
          orderBy: 3,
          recommendType: 1
        }
      }
    },
    methods: {
      goLink: function (url) {
        openUrlByUrl(url)
      },
      toDomain () {
        this.$router.replace('/domain')
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      refreshPageData () {
        userAbility.newbieTask(this)
        autoTextArea()

        getHomeData((data) => {
          this.data = data

          setTimeout(() => {
            window.mui('.mui-slider').slider({
              interval: 5000
            })
          }, 100)
        })
        postRequest(`recommendRead`, {
          orderBy: 1,
          recommendType: 1,
          perPage: 4
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.heatList = response.data.data.data
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
      },
      toDiscoverAdd () {
        this.$router.pushPlus('/discover/add')
      }
    },
    updated () {},
    mounted () {
      saveLocationInfo()
      AppInit(this)
      // 左滑
      document.getElementById('home-content').addEventListener('swipeleft', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle >= 160) {
          this.$router.replace('/domain')
        }
      })
      // 右滑
      document.getElementById('home-content').addEventListener('swiperight', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle <= 20) {
          this.$router.replace('/domain')
        }
      })
    }
  }
  export default Home
</script>

<style lang="less" scoped>
  .mui-slider{
    width:9.145rem;
    height:3.626rem;
    border-radius: 0.133rem;
    margin-left:0.4rem;
    overflow: hidden;
  }
  .mui-content{
    background: #fff;
  }
  .component-title-iconAndText{
    margin-top:0.533rem;
  }

  .refreshListWrapper{
    top: 1.173rem;
    bottom:50px; /* px不转换 */
  }
  .component-title-iconAndText .iconAndTextLeft .icon{
    color:#FA4975 !important;
  }
</style>

<style>
  .home.mui-slider-indicator{
    text-align: right;
    padding-right: 4%;
  }
  .home.mui-slider-indicator .mui-indicator{
    width: 0.16rem;
    height: 0.16rem;
    margin: 0.026rem 0.133rem;
    background: rgba(216,216,216,1);
    -webkit-box-shadow: 0 0 0 0 rgba(1216,216,216, .7);
    box-shadow: 0 0 0 0 rgba(216,216,216, .7);
  }
  .home.mui-slider-indicator .mui-active.mui-indicator{
    width: 0.32rem;
    height:0.16rem;
    background:rgba(3,174,249,1);
    border-radius: 1.333rem;
    -webkit-box-shadow: 0 0 0.026rem 0.026rem rgba(3,174,249, .7);
    box-shadow: 0 0 0 0 rgba(3,174,249, .7);
  }
  .mui-scrollbar-vertical{
    display: none !important;
  }

  .homeMuiSlider.mui-slider .mui-slider-group .mui-slider-item img{
    height:3.626rem !important;
    object-fit: cover;
  }
</style>
