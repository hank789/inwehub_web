<template>
  <div>

    <div class="container-control-logoAndTabsAndSearch">
      <svg class="icon logoIcon" aria-hidden="true">
        <use xlink:href="#icon-logowenzi"></use>
      </svg>
      <span class="splitCircle"></span>
      <div class="logoAndTabsAndSearchTabs">
        <div class="tab active" @tap.stop.prevent="$router.replace('/dianping')">点评</div>
        <div class="tab" @tap.stop.prevent="$router.replace('/groups')">圈子</div>
        <div class="tab" @tap.stop.prevent="$router.replace('/ask/offers')">问答</div>
      </div>
      <svg class="icon searchIcon" aria-hidden="true"
           @tap.stop.prevent="$router.pushPlus('/searchAll','list-detail-page-three')">
        <use xlink:href="#icon-sousuo"></use>
      </svg>
    </div>

    <div class="line-river-after line-river-after-top marginTop"></div>
    <div id="home-content" class="mui-content">



        <div class="main-content">
          <div class="topTitle font-family-medium">热门专题</div>
          <div class="heatAlbum">

            <div class="albumList" v-for="(item, indexAlbum) in hotAlbum" :key="indexAlbum" @tap.stop.prevent="$router.pushPlus('/dianping/products/' + item.id + '/' + encodeURIComponent(item.name))">
              <div class="componentCarAlbum">
                <div class="albumName font-family-medium">{{ item.name }}</div>
                <div class="tags"><span>{{ item.tips }}</span></div>
                <div class="backgroundBig" v-if="indexAlbum === 0">
                  <img src="../../statics/images/remen_zhunti_big1@3x.png">
                </div>
                <div class="backgroundSmall" v-else>
                  <img src="../../statics/images/remen_zhunti_small2@3x.png" style="width: 100%;">
                </div>
              </div>
            </div>

          </div>

          <div class="topTitle font-family-medium">热门产品</div>
          <div class="heatProduct">

            <div class="productList" v-for="(item, index) in hotProductList" :key="index" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
              <div class="componentCarProduct">
                <div class="topInfo">
                  <div class="left">
                    <div class="logo">
                      <img :src="item.logo">
                    </div>
                    <div class="nameMark">
                      <div class="title font-family-medium text-line-1">{{ item.name }}</div>
                      <div class="stars">
                        <StarView :rating="item.review_average_rate"></StarView>
                        <span class="span">{{ item.review_average_rate }}分</span>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="heatICon">
                      <img src="../../statics/images/zhuanti_fill@3x.png">
                    </div>
                    <div class="textNumber">{{ item.support_rate }}</div>
                  </div>
                </div>
                <div class="bottom">
                  <div class="describe text-line-2">{{ item.summary }}</div>
                </div>
              </div>
            </div>

          </div>

          <div class="topTitle font-family-medium">更多专题</div>
          <div class="specialWrapper">

          <swiper :options="swiperOption" class="moreAlbum">
            <swiper-slide v-for="(item, index) in albumList" :key="index">
              <div class="display">
                <div v-for="(list, itemIndex) in item" :key="itemIndex">
                  <div class="specialList" v-if="list.type === 'product_album'" @tap.stop.prevent="$router.pushPlus('/dianping/products/' + list.id + '/' + encodeURIComponent(list.name))">
                    <div class="mask"></div>
                    <div class="img"><img :src="list.icon"></div>
                    <div class="text font-family-medium">{{ list.name }}</div>
                  </div>
                  <div class="expectWrapper specialList" v-if="list.type === 'lastElement'"  @tap.stop.prevent="showExpect">
                    <div class="content">
                      <svg class="icon iconfont" aria-hidden="true">
                        <use xlink:href="#icon-tianjia"></use>
                      </svg>
                      <span class="expectText">我期待</span>
                    </div>
                  </div>
                </div>
              </div>

              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
        </div>

    </div>

    <DropDownMenu
      ref="dropdownMenu"
      :tree="categories"
      v-model="category"
    >
      <template slot="dropDownMenuHeader">
        <div class="container-control-logoAndTabsAndSearch">
          <svg class="icon logoIcon" aria-hidden="true">
            <use xlink:href="#icon-logowenzi"></use>
          </svg>
          <span class="splitCircle"></span>
          <div class="logoAndTabsAndSearchTabs">
            <div class="tab" @tap.stop.prevent="goGroups">圈子</div>
            <div class="tab" @tap.stop.prevent="goAskOffers">问答</div>
            <div class="tab active" @tap.stop.prevent="$router.replace('/dianping')">点评</div>
          </div>
          <svg class="icon searchIcon" aria-hidden="true"
               @tap.stop.prevent="$router.pushPlus('/searchSubmission','list-detail-page-three')">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
        </div>
        <div class="line-river-after line-river-after-top"></div>
      </template>
    </DropDownMenu>

    <Options
      ref="itemOptions"
      :id="'itemOptions'"
      :options="iconOptions"
      @selectedItem="selectedItem"
    ></Options>

  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import RefreshList from '../../components/refresh/MescrollList.vue'
  import { getRecommandProductList, getCategories, getHotProduct, gethotAlbum, getAlbumList, submitFeedback } from '../../utils/dianping'
  import DropDownMenu from '../../components/select/DropDownMenu.vue'
  import Options from '../../components/Options.vue'
  import { getImageSuffix } from '../../utils/image'
  import StarView from '../../components/star-rating/starView.vue'
  import localEvent from '../../stores/localStorage'
  import { alertExpect } from '../../utils/dialogList'

  export default {
    data () {
      return {
        categories: [],
        list: [],
        hotProductList: [],
        hotAlbum: [],
        albumList: [],
        recommandProductList: [],
        orderBy: 1,
        category: {
          id: ''
        },
        sortOrderByName: '排序',
        swiperOption: {
          loop: false,
          effect: 'cubeEffect',
          centeredSlides: false,
          slidesPerView: 'auto',
          spaceBetween: 0,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 60,
            modifier: 2,
            slideShadows: false
          },
          pagination: {
            el: 'null'
          }
        },
        iconOptions: []
      }
    },
    computed: {
      prevOtherData () {
        return {category_id: this.category.id, orderBy: this.orderBy}
      },
      nextOtherData () {
        return {category_id: this.category.id, orderBy: this.orderBy}
      }
    },
    components: {
      swiper,
      swiperSlide,
      RefreshList,
      DropDownMenu,
      Options,
      StarView
    },
    methods: {
      showExpect () {
        alertExpect(this, (num, text) => {
          if (num === 0) {
            submitFeedback(this, text, (res) => {
            })
          }
        })
      },
      getImageSuffix (img, width, height) {
        return getImageSuffix(img, width, height)
      },
      goGroups () {
        window.mui('#dropDownMenuWrapper').popover('toggle')
        this.$router.replace('/groups')
      },
      goAskOffers () {
        window.mui('#dropDownMenuWrapper').popover('toggle')
        this.$router.replace('/ask/offers')
      },
      selectedItem (item) {
        this.$refs.itemOptions.toggle()
        switch (item.text) {
          case '评分':
            this.orderBy = 1
            this.sortOrderByName = '评分'
            break
          case '热度':
            this.orderBy = 2
            this.sortOrderByName = '热度'
            break
          case '我是企业，需要产品服务':
            this.goCustomer()
            break
          case '我有产品，需要入驻展示':
            this.$router.pushPlus('/dianping/product/add')
            break
        }
      },
      selectSort () {
        this.iconOptions = []
        this.iconOptions.push(
          {
            text: '评分'
          },
          {
            text: '热度'
          }
        )
        this.$refs.itemOptions.toggle()
      },
      cooperation () {
        this.iconOptions = []
        this.iconOptions.push(
          {
            text: '我有产品，需要入驻展示'
          }
        )
        this.$refs.itemOptions.toggle()
      },
      goCustomer () {
        var information = ''

        localEvent.setLocalItem('needRefresh', {value: true})
        information = '我是产品服务方，需要合作入驻'

        localEvent.setLocalItem('information', information)
        window.trackMixpanelEvent('service-chat', '/chat/79', 'service-chat', information, this.$router.fullPath)
        this.$router.pushPlus('/chat/79')
      },
      showDropdownMenu () {
        // var searchInputHeight = document.querySelector('#searchWrapper').clientHeight
        var height = document.querySelector('.dianpingBanners').clientHeight - 20
        this.$refs.RefreshList.scrollTo(0, height)
        this.$refs.dropdownMenu.show()
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      refreshPageData () {
        getRecommandProductList(this, 5, (recommandProductList) => {
          this.recommandProductList = recommandProductList
        })

        getCategories(this, (categories) => {
          this.categories = categories
        })

        getHotProduct(this, 3, (hotProductList) => {
          this.hotProductList = hotProductList
        })

        gethotAlbum(this, (hotAlbum) => {
          this.hotAlbum = hotAlbum
        })

        getAlbumList(this, 100, (res) => {
          let listArry = res.data

          listArry.push({
            type: 'lastElement'
          })

          let len = listArry.length
          let n = 5 // 假设每行显示5个
          let lineNum = len % 5 === 0 ? len / 5 : Math.ceil(len / 5)
          let resD = []
          for (let i = 0; i < lineNum; i++) {
            let temp = listArry.slice(i * n, i * n + n)
            resD.push(temp)
          }
          this.albumList = resD
        })
      }
    },
    created () {
      this.refreshPageData()
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
    mounted () {
      // var navWarp = document.querySelector('.productMenu')
      // if (this.$refs.RefreshList.mescroll.os.ios) {
      //   navWarp.classList.add('nav-sticky')
      // } else {
      //   this.$refs.RefreshList.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
      //     var height = document.querySelector('.dianpingBanners').clientHeight - 20
      //     console.log('up --> onScroll 列表当前滚动的距离 y = ' + y + ', 是否向上滑动 isUp = ' + isUp)
      //     if (y >= height) {
      //       navWarp.classList.add('nav-fixed')
      //     } else {
      //       navWarp.classList.remove('nav-fixed')
      //     }
      //   }
      // }

      // 左滑
      document.getElementById('home-content').addEventListener('swipeleft', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle >= 160) {
          this.$router.replace('/groups')
        }
      })
      // 右滑
      document.getElementById('home-content').addEventListener('swiperight', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle <= 20) {
          this.$router.replace('/ask/offers')
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .container-control-logoAndTabsAndSearch {
    top: 1.306rem !important;
    z-index: 9;
    background: #ffffff;
  }
  .line-river-after-top.marginTop {
    top: 1.306rem;
    z-index: 10;
  }
  .listWrapper {
    top: 1.173rem !important;
    bottom: 50px !important;
  }
  .mui-content {
    background: #fff !important;
  }
  .main-content {
    margin-top: 1.306rem;
  }
  .moreAlbum {
    .swiper-slide {
      margin-right: 0 !important;
      width: auto !important;
    }
  }

  .moreAlbum .swiper-wrapper .swiper-slide:last-child .display {
    margin-right: 10px !important;
  }

  .topTitle {
    color: #3C3E44;
    font-size: 20px;
    padding: 18px 16px 0;
  }
  .heatAlbum {
    padding: 0 16px;
    margin-top: 13px;
  }

  .albumList {
    display: inline-block;
    vertical-align: top;
    &:nth-of-type(1) {
      .componentCarAlbum {
        width: 228px;
      }
    }
    &:nth-of-type(2) {
      .componentCarAlbum {
        margin-right: 0;
      }
    }
    &:last-child {
      .componentCarAlbum {
        margin-right: 0;
      }
    }
    .componentCarAlbum {
      width: 113px;
      height: 152.500px;
      position: relative;
      border-radius: 4px;
      margin: 1px 2px 0 0;
      background: linear-gradient(39deg, rgba(60, 87, 119, 1) 0%, rgba(28, 44, 66, 1) 100%);
      .albumName {
        position: relative;
        z-index: 1;
        color: #FFFFFF;
        font-size: 14px;
        padding: 20px 15px 0;
        line-height: 22px;
      }
      .tags {
        position: absolute;
        z-index: 1;
        left: 15px;
        bottom: 20px;
        height: 15px;
        padding: 0 5px;
        line-height: 15px;
        border-radius: 0px 4px 0px 4px;
        background: linear-gradient(45deg, rgba(83, 223, 221, 1) 0%, rgba(41, 188, 184, 1) 100%);
        span {
          color: #1C2C42;
          font-size: 10px;
          line-height: 14px;
        }
      }
      .backgroundSmall {
        position: absolute;
        top: 0;
        left: 0;
        width: 113px;
        height: 152.500px;
      }
      .backgroundBig {
        position: absolute;
        top: 0;
        left: 0;
        width: 228px;
        height: 152.5px;
      }
    }
  }

  .albumList .componentCarAlbum .backgroundSmall img,
  .albumList .componentCarAlbum .backgroundBig img {
    width: 100%;
    height: 100%;
  }
  .heatProduct {
    margin-top: 15px;
  }
  .productList {
    margin-top: 10px;
    padding: 0 16px;
  }
  .componentCarProduct {
    padding: 15px;
    background: #FFFFFF;
    border-radius: 4px;
    box-shadow: 0px 0px 26px 0px rgba(232, 241, 241, 1);

    .topInfo {
      display: flex;
      justify-content: space-between;

      .left {
        display: flex;
        .nameMark {
          .title {
            width: 204px;
            color: #3C3E44;
            font-size: 16px;
            line-height: 22.500px;
            margin-bottom: 7px;
          }
          .stars {
            display: flex;
            margin-top: -5px;
            .span {
              font-size: 11px;
              line-height: 15px;
              margin-left: 3px;
              margin-top: 4px;
              display: inline-block;
            }
          }
        }
        .logo {
          width: 44px;
          height: 44px;
          margin-right: 10px;
          overflow: hidden;
          border-radius: 4px;
          border: 0.500px solid #ECECEE;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }

      .right {
        display: flex;
        .heatICon {
          width: 9px;
          height: 11.500px;
          margin-right: 4px;
          img {
            width: 100%;
            height: 100%;
            vertical-align: top;
          }
        }
        .textNumber {
          color: #3C3E44;
          font-size: 12px;
          line-height: 14.500px;
          margin-top: 1px;
        }
      }
    }

    .bottom {
      .describe {
        color: #808080;
        font-size: 14px;
        line-height: 22.500px;
        margin-top: 10px;
      }
    }
  }

  .specialWrapper {
    width: 100%;
    height: 446.500px;
    padding: 0px 0 0 0px;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 80px;

    .specialList {
      position: relative;
      margin: 10px 0px 0 0;

      .img {
        width: 166.500px;
        height: 79.500px;
        border-radius: 4px;
        img {
          height: 100%;
          width: 100%;
          border-radius: 4px;
        }
      }
      .text {
        font-size: 13px;
        color: #FFFFFF;
        position: absolute;
        bottom: 15px;
        left: 15px;
        white-space: normal;
        padding-right: 15px;
      }
      .mask {
        width: 166.500px;
        height: 79.500px;
        background: linear-gradient(180deg, rgba(28, 44, 66, 0) 0%, rgba(28, 44, 66, 1) 100%);
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px;
      }
    }
  }

  .display {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }

  .marginR {
    margin-right: 20px;
  }

  .expectWrapper {
    width: 166.500px;
    height: 78px;

    .content {
      height: 100%;
      line-height: 78px;
      border-radius: 4px;
      border: 0.500px solid #DCDCDC;

      .iconfont {
        font-size: 13px;
        color: #3C3E44;
        margin-left: 15px;
        margin-right: 3.500px;
      }

      .expectText {
        color: #808080;
        font-size: 13px;
      }
    }
  }
</style>

<style>
  .dianpingBanners .swiper-pagination-bullet {
    width: 5px; /* px不转换 */
    height: 5px; /* px不转换 */
    margin: 0 2px !important; /* px不转换 */
    background: #D8D8D8;
    opacity: 1;
  }

  .dianpingBanners .swiper-pagination-bullets .swiper-pagination-bullet-active {
    background: #03AEF9;
    width: 7.5px; /* px不转换 */
    border-radius: 100px !important; /* px不转换 */
  }
</style>
