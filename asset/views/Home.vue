<template>
  <div>
    <div class="mui-content">
      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>

        <div class="topSearchWrapper" @tap.stop.prevent="$router.pushPlus('/searchSubmission','list-detail-page-three')">
          <div class="searchFrame">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
            <span>搜内容、问答、圈子</span>
          </div>
        </div>
      </div>

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
        <template slot="listHeader">
          <div id="home_banner_slider" class="homeMuiSlider mui-slider" v-if="data.banners.length">
            <div class="mui-slider-group  mui-slider-loop">
              <div class="mui-slider-item mui-slider-item-duplicate" v-if="data.banners[data.banners.length-1]">
                <div @tap.stop.prevent="goLink(data.banners[data.banners.length-1].url)"><ImageView :src="data.banners[data.banners.length-1].img_url" width="343" height="136" :isLazyload="false" :saveToLocal="true"></ImageView></div>
              </div>
              <div class="mui-slider-item" v-for="(notice, index) in data.banners">
                <div  @tap.stop.prevent="goLink(notice.url)" target="_blank"><ImageView :src="notice.img_url" width="343" height="136" :isLazyload="false" :saveToLocal="true"></ImageView></div>
              </div>
              <div class="mui-slider-item mui-slider-item-duplicate" v-if="data.banners[0]">
                <div @tap.stop.prexvent="goLink(data.banners[0].url)">
                  <ImageView :src="data.banners[0].img_url" width="343" height="136" :isLazyload="false" :saveToLocal="true"></ImageView>
                </div>
              </div>
            </div>
            <div class="home mui-slider-indicator">
              <div :class="{'mui-indicator':true, 'mui-active':index===0}" v-for="(notice, index) in data.banners"></div>
            </div>
          </div>

          <div class="container-tags-home container-tags-home-margin">
            <div class="container-allTags" :class="selectTagValue? '':'active'" @tap.stop.prevent="getAllRecommend()">全部</div>
            <div class="container-tabLabels">
              <swiper ref="inTags" :options="swiperOption" class="container-upload-images">
                <swiper-slide v-for="(tag, index) in tags" :key="index" class="tagLabel" :tagId="tag.value">
                  <span class="tab" :class="{active:selectTagValue === tag.value}" @tap.stop.prevent="selectTag(tag)">{{tag.text}}</span>
                </swiper-slide>
              </swiper>
            </div>
            <div class="container-moreIcon" @tap.stop.prevent="$router.pushPlus('/userGuide/interst?from=home')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-gengduoxuanze"></use>
              </svg>
            </div>
          </div>


        </template>
          <div class="component-title-iconAndText" v-if="!selectTagValue">
            <span class="hotSpotTop">热点TOP</span>
          </div>



        <div id="home-content" class="container-list-article">

          <div v-for="(item, index) in list" :key="item.id">
            <!--<div class="line-river-big" v-if="index === 5"></div>-->
            <div class="component-item-article" @tap.stop.prevent="toDetail(item)">
              <div class="itemArticleLeft">
                <div class="titleWrapper">
                  <div class="title text-line-2 text-content"><span class="number" v-if="index < 5 && !selectTagValue">{{index+1}}.</span>{{item.data.title}}</div>
                </div>
                <div class="explain">
                  <label v-if="item.tips">{{item.tips}}</label><span v-if="item.type_description">{{item.type_description}}</span><timeago :since="timeago(item.created_at)" :auto-update="60">
                </timeago>
                </div>
              </div>
              <div class="itemArticleRight"><ImageView :src="item.data.img" width="111" :isLazyload="true"></ImageView></div>
            </div>
            <div class="line-river-after line-river-after-short" v-if="index !== 4 && index !== list.length-1"></div>

            <div v-if="index === 4 && !selectTagValue">
              <div class="line-river-big"></div>
              <div class="component-title-iconAndText">
                <span class="hotSpotTop">推荐</span>
              </div>
            </div>
          </div>
          <div class="line-river-big" v-if="list.length-1"></div>
        </div>
      </RefreshList>


      <div class="container-tags-home container-tags-home-hide">
        <div class="line-river-after line-river-after-short"></div>
        <div class="container-allTags" :class="selectTagValue? '':'active'" @tap.stop.prevent="getAllRecommend()">全部</div>
        <div class="container-tabLabels">
          <swiper ref="outTags" :options="swiperOption" class="container-upload-images">
            <swiper-slide v-for="(tag, index) in tags" :key="index" class="tagLabel" :tagId="tag.value">
              <span class="tab" :class="{active:selectTagValue === tag.value}" @tap.stop.prevent="selectTag(tag)">{{tag.text}}</span>
            </swiper-slide>
          </swiper>
        </div>
        <div class="container-moreIcon" @tap.stop.prevent="$router.pushPlus('/userGuide/interst?from=home')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gengduoxuanze"></use>
          </svg>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

  import { getHomeData } from '../utils/home'
  import RefreshList from '../components/refresh/List.vue'
  import { saveLocationInfo } from '../utils/allPlatform'
  import { autoTextArea, openUrlByUrl } from '../utils/plus'
  import userAbility from '../utils/userAbility'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { scrollPage } from '../utils/dom'
  import { getImageSuffix } from '../utils/image'
  import localEvent from '../stores/localStorage'

  const Home = {
    data () {
      return {
        loading: 1,
        list: [],
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 0,
          freeMode: true,
          on: {
            setTranslate: (translate) => {
              if (this.outTags.translate !== translate) {
                this.outTags.setTranslate(translate)
              }

              if (this.inTags.translate !== translate) {
                this.inTags.setTranslate(translate)
              }
            }
          }
        },
        data: {
          banners: []
        },
        isRecommendType: 1,
        selectTagValue: null,
        tags: []
      }
    },
    created () {},
    components: {
      RefreshList,
      swiper,
      swiperSlide
    },
    activated: function () {
      this.refreshPageData()
    },
    computed: {
      outTags () {
        return this.$refs.outTags.swiper
      },
      inTags () {
        return this.$refs.inTags.swiper
      },
      prevOtherData () {
        return {
          orderBy: 1,
          recommendType: this.isRecommendType,
          tagFilter: this.selectTagValue
        }
      }
    },
    methods: {
      getImageSuffix (img, width, height) {
        return getImageSuffix(img, width, height)
      },
      getAllRecommend () {
        this.selectTagValue = null
        this.isRecommendType = 1
      },
      selectTag (tag) {
        if (tag.value === this.selectTagValue) {
          this.selectTagValue = null
          this.isRecommendType = 1
        } else {
          this.selectTagValue = tag.value
          this.isRecommendType = 2
        }
      },
      goLink: function (url) {
        openUrlByUrl(url)
      },
      toDiscover () {
        this.$router.replace('/discover')
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      refreshPageData () {
        var currentUser = localEvent.getLocalItem('UserInfo')
        this.tags = currentUser.region_tags
        userAbility.newbieTask(this)
        autoTextArea()

        getHomeData((data) => {
          this.data = data

          setTimeout(() => {
            window.mui('#home_banner_slider').slider({
              interval: 5000
            })
          }, 100)
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
      scrollPage('#refreshContainer > .mui-scroll', (container, y) => {
        var height = document.querySelector('#home_banner_slider').clientHeight + 10
        if (y > height) {
          document.querySelector('.container-tags-home-hide').classList.add('showTagsHome')
          // document.querySelector('.container-tags-home-hide').style.top = (y - 10) + 'px'
        }
      }, null, (container, y) => {
        var height = document.querySelector('#home_banner_slider').clientHeight + 10
        if (y < height) {
          document.querySelector('.container-tags-home-hide').classList.remove('showTagsHome')
        }
        // document.querySelector('.container-tags-home-hide').style.top = (y - 10) + 'px'
      })

      saveLocationInfo()

      // 左滑
      document.getElementById('home-content').addEventListener('swipeleft', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle >= 160) {
          this.$router.replace('/discover')
        }
      })
      // 右滑
      document.getElementById('home-content').addEventListener('swiperight', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle <= 20) {
          this.$router.replace('/discover')
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
    padding-bottom: 0.266rem;
  }
  .mui-content{
    background: #fff;
  }

  .tagLabel{
    width:auto !important;
  }
  .component-title-iconAndText{
    margin-top: 0.266rem;
    .hotSpotTop {
      /*width: 1.76rem;*/
      height: 0.426rem;
      color: #FFFFFF;
      font-size: 0.266rem;
      padding: 0 0.266rem 0 0.426rem;
      text-align: center;
      line-height: 0.426rem;
      border-top-right-radius: 2.666rem;
      border-bottom-right-radius: 2.666rem;
      background:linear-gradient(90deg,#03AEF9 0%,#10C6FF 100%);
    }
  }

  .mui-android .component-title-iconAndText .hotSpotTop {
    line-height: 0.493rem;
  }

  .refreshListWrapper{
    top: 1.173rem;
    bottom:50px; /* px不转换 */
  }
  .component-title-iconAndText .iconAndTextLeft .icon{
    color:#FA4975 !important;
  }
  .container-tags-home-margin {
    margin-top: 0.266rem;
  }
  .container-tags-home-hide{
    position: absolute;
    background: #fff;
    z-index: 7;
    left: -26.666rem;
    display: block;
  }
  .showTagsHome{
    position: absolute;
    background: #fff;
    z-index: 7;
    top: 1.173rem;
    left:0;
    display: block;
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
  .homeMuiSlider.mui-slider .mui-slider-group .mui-slider-item{
    margin:0 0.026rem;
  }
  .homeMuiSlider.mui-slider .mui-slider-group .mui-slider-item img{
    height:3.626rem !important;
    object-fit: cover;
  }
</style>
