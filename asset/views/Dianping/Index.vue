<template>
  <div>
    <div id="home-content" class="mui-content">
      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg>
        <span class="splitCircle"></span>
        <div class="logoAndTabsAndSearchTabs">
          <div class="tab" @tap.stop.prevent="$router.replace('/groups')">圈子</div>
          <div class="tab" @tap.stop.prevent="$router.replace('/ask/offers')">问答</div>
          <div class="tab active" @tap.stop.prevent="$router.replace('/dianping')">点评</div>
        </div>
        <svg class="icon searchIcon" aria-hidden="true"
             @tap.stop.prevent="$router.pushPlus('/searchAll','list-detail-page-three')">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </div>

      <div class="line-river-after line-river-after-top"></div>

      <RefreshList
        ref="RefreshList"
        :api="'tags/productList'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode="true"
        :isShowUpToRefreshDescription="true"
        v-model="list"
        :autoShowEmpty="false"
        class="listWrapper"
      >

        <template slot="listHeader">

          <!--<div id="searchWrapper" class="searchWrapper" @tap.stop.prevent="$router.pushPlus('/dianping/search/products')">-->
            <!--<div class="searchInput">-->
              <!--<div class="searchLeft">-->
                <!--<svg class="icon" aria-hidden="true">-->
                  <!--<use xlink:href="#icon-sousuo"></use>-->
                <!--</svg>-->
                <!--<span>搜索产品、点评、分类、公司</span>-->
              <!--</div>-->
              <!--<div class="searchRight" @tap.stop.prevent="cooperation">-->
                <!--<i class="line-wall"></i>-->
                <!--<span>合作</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->

          <swiper v-show="recommandProductList.length" :options="swiperOption" class="dianpingBanners">

            <swiper-slide v-for="(recommandProduct, index) in recommandProductList" :key="'recommandProductList_' + recommandProduct.id">
              <div class="container-product-comment"
                   @tap.stop.prevent="$router.pushPlus('/dianping/comment/' + recommandProduct.slug)">
                <div class="comment-info">
                  <div class="avatarImg">
                    <ImageView :isLazyload="true" :src="recommandProduct.user.avatar" width="34" height="34"></ImageView>
                  </div>
                  <div class="comment-name">
                    <div class="font-family-medium">{{ recommandProduct.user.name }}</div>
                    <div>
                      <timeago :since="timeago(recommandProduct.created_at)" :auto-update="60"></timeago>
                    </div>
                  </div>
                  <div class="comment-mark font-family-medium">{{ recommandProduct.rate_star }}分</div>
                </div>
                <div class="comment-content text-line-3">{{ recommandProduct.title }}</div>
                <div class="comment-product">
                  <div class="product-info"  @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(recommandProduct.tag.name))">
                    <div class="product-img border-football">
                      <ImageView :src="recommandProduct.tag.logo" :isLazyload="true" width="44" height="44"></ImageView>
                    </div>
                    <div class="product-detail">
                      <div class="productName font-family-medium text-line-1">{{ recommandProduct.tag.name }}</div>
                      <div class="productMark">
                        <div class="stars">
                          <StarView :rating="recommandProduct.tag.review_average_rate"></StarView>
                        </div>
                        <div class="starsText">
                          <span>{{ recommandProduct.tag.review_average_rate }}分</span>
                          <i></i><span>{{ recommandProduct.tag.review_count }}条评论</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </template>

        <div class="container-product-list" id="containerProductList">
          <div class="productMenu">
            <div class="productType" @tap.stop.prevent="showDropdownMenu()">
              <span :class="category.name ? 'active' : ''">{{ !category.name ? '产品类型' : category.name }}</span>
              <div class="jianTou" :class="category.name ? 'active' : ''">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiangxiajiantou"></use>
                </svg>
              </div>
            </div>
            <div class="productSort" :class="sortOrderByName !== '排序' ? 'active' : ''" @tap.stop.prevent="selectSort()">
              <span>{{ sortOrderByName }}</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-paixu"></use>
              </svg>
            </div>
          </div>

          <div class="productList">
            <div class="comment-product" v-for="(item, index) in list" :key="'comment-product_' + item.id">
              <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
                <div class="product-img border-football">
                  <ImageView :src="item.logo" :isLazyload="true" :key="'product_logo_' + item.id" width="44" height="44"></ImageView>
                </div>
                <div class="product-detail">
                  <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
                  <div class="productMark">
                    <div class="stars">
                      <StarView :rating="item.review_average_rate" :key="'product_rate_' + item.id"></StarView>
                    </div>
                    <div class="starsText">
                      <span>{{ item.review_average_rate }}分</span>
                      <i></i><span>{{ item.review_count }}条评论</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="line-river-after line-river-after-top"></div>
            </div>

          </div>
        </div>

        <div class="noData" slot="emptyCustom">
          <div class="DataImg">
            <ImageView src="../../statics/images/empty@3x.png"></ImageView>
          </div>
          <div class="noDataText">暂时没有数据～</div>
        </div>
      </RefreshList>
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
  import { getRecommandProductList, getCategories } from '../../utils/dianping'
  import DropDownMenu from '../../components/select/DropDownMenu.vue'
  import Options from '../../components/Options.vue'
  import { getImageSuffix } from '../../utils/image'
  import StarView from '../../components/star-rating/starView.vue'
  import localEvent from '../../stores/localStorage'

  export default {
    data () {
      return {
        categories: [],
        list: [],
        recommandProductList: [],
        orderBy: 1,
        category: {
          id: ''
        },
        sortOrderByName: '排序',
        swiperOption: {
          loop: false,
          effect: 'coverflow',
          centeredSlides: true,
          slidesPerView: 'auto',
          spaceBetween: 30,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 60,
            modifier: 2,
            slideShadows: false
          },
          pagination: {
            el: '.swiper-pagination'
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
      var navWarp = document.querySelector('.productMenu')
      if (this.$refs.RefreshList.mescroll.os.ios) {
        navWarp.classList.add('nav-sticky')
      } else {
        this.$refs.RefreshList.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
          var height = document.querySelector('.dianpingBanners').clientHeight - 20
          console.log('up --> onScroll 列表当前滚动的距离 y = ' + y + ', 是否向上滑动 isUp = ' + isUp)
          if (y >= height) {
            navWarp.classList.add('nav-fixed')
          } else {
            navWarp.classList.remove('nav-fixed')
          }
        }
      }

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
  .mui-content {
    background: #FFFFFF;
  }

  .container-control-logoAndTabsAndSearch {
    background: #FFFFFF;
  }

  .container-product-list.dianpingBannersHide {
    margin-top: 0;
    border-radius: 0;
    padding-bottom: 0;
  }
  .dianpingBannersHide {
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
    top: -0.08rem;
    left:0;
    display: block;
  }
  .dianpingBanners {
    padding-top: 0.4rem;
    height: 7.466rem;
    background: linear-gradient(180deg, rgba(220, 220, 220, 1) 0%, rgba(243, 244, 246, 1) 100%);
    .swiper-slide {
      width: auto !important;
    }
  }

  .searchWrapper {
    padding-top: 0.24rem;
    background: #DCDCDC;
    .searchInput {
      width: 9.146rem;
      height: 0.906rem;
      margin: 0 auto;
      line-height: 0.906rem;
      border-radius: 2.666rem;
      background: #FFFFFF;
      display: flex;
      padding: 0 0.266rem;
      justify-content: space-between;
      .searchLeft {
        color: #C8C8C8;
        .icon {
          font-size: 0.453rem;
        }
        span {
          font-size: 0.373rem;
        }
      }
      .searchRight {
        color: #444444;
        font-size: 0.346rem;
        .line-wall {
          height: 0.373rem;
          top: 0.053rem;
          right: 0.16rem;
        }
      }
    }
  }

  .container-product-comment {
    display: inline-block;
    width: 8.346rem;
    background: #ffffff;
    border-radius: 0.213rem;
    .comment-info {
      overflow: hidden;
      padding: 0.4rem 0.4rem 0.266rem;
      .avatarImg {
        width: 0.906rem;
        height: 0.906rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .comment-name {
        color: #B4B4B6;
        font-size: 0.293rem;
        line-height: 0.4rem;
        float: left;
        margin-left: 0.213rem;
        .font-family-medium {
          color: #444444;
          font-size: 0.346rem;
          line-height: 0.48rem;
          margin-bottom: 0.053rem;
        }
      }
      .comment-mark {
        float: right;
        color: #FCC816;
        font-size: 0.346rem;
        line-height: 0.48rem;
      }
    }
    .comment-content {
      color: #444444;
      font-size: 0.373rem;
      line-height: 0.6rem;
      padding: 0 0.4rem;
      height: 1.733rem;
    }
    .product-detail {
      .productName {
        width: 5.5rem;
      }
    }
  }

  .comment-product {
    padding: 0.293rem 0.4rem 0.4rem;
    .product-info {
      overflow: hidden;
      background: #F7F8FA;
      padding: 0.266rem;
      border-radius: 0.106rem;
      .product-img {
        width: 1.173rem;
        height: 1.173rem;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.106rem;
          object-fit: contain;
        }
      }
      .product-detail {
        float: left;
        margin-left: 0.266rem;
        .productName {
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
        }
        .productMark {
          display: flex;
          .icon {
            color: #FCC816;
            font-size: 0.32rem;
          }
          span {
            color: #B4B4B6;
            font-size: 0.293rem;
            line-height: 0.4rem;
            &:nth-of-type(1) {
              color: #FCC816;
              margin-left: 0.08rem;
            }
          }
          i {
            width: 0.053rem;
            height: 0.053rem;
            margin-right: 0.133rem;
            vertical-align: middle;
            border-radius: 50%;
            background: #B4B4B6;
            display: inline-block;
          }
          .stars {
            display: flex;
            div {
              margin-right: 0.08rem;
            }
          }
          .starsText {
          }
        }
      }
    }
  }

  .container-product-list {
    background: #ffffff;
    margin-top: -0.533rem;
    padding-bottom: 0.4rem;
    position: relative;
    z-index: 10;
    border-top-left-radius: 0.426rem;
    border-top-right-radius: 0.426rem;
    .productMenu {
      background:#fff;
      height: 0.906rem;
      display: flex;
      color: #808080;
      font-size: 0.346rem;
      padding: 0 0.426rem;
      line-height: 0.906rem;
      justify-content: space-between;
      box-shadow: 0rem 0.133rem 0.266rem 0rem rgba(249, 249, 251, 1);
      .productType {
        display: flex;
        span {
          &:nth-of-type(1) {
            &.active {
              color: #444444;
              font-family:PingFangSC-Medium;
            }
          }
        }
        .icon {
          color: #B4B4B6;
          font-size: 0.186rem;
        }
        .jianTou {
          margin-left: 0.08rem;
          margin-top: -0.053rem;
          &.active {
            .icon {
              color: #444444;
            }
          }
        }
      }
      .productSort {
        &.active {
          color: #444444;
          font-family:PingFangSC-Medium;
          .icon {
            color: #444444;
          }
        }
        .icon {
          color: #B4B4B6;
          font-size: 0.266rem;
        }
      }
    }
    .productList {
      .comment-product {
        padding: 0.346rem 0.4rem 0;
        .product-info {
          padding: 0 0 0.4rem;
          background: none;
        }
        .productName {
          width: 7.573rem;
        }
      }
    }
  }

  .noData {
    margin-top: 1.333rem;
    margin-bottom: 1.333rem;
    .DataImg {
      width: 1.626rem;
      height: 2.373rem;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .noDataText {
      color: #C8C8C8;
      font-size: 0.32rem;
      line-height: 0.426rem;
      margin-top: 0.266rem;
      text-align: center;
    }
  }

  .listWrapper {
    top: 1.173rem !important;
    bottom: 50px !important; /* px不转换 */
  }

  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 0.8rem;
  }

  .nav-sticky {
    z-index: 9999;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }

  .nav-fixed{
    z-index: 9999;
    position: fixed;
    top: 1.6rem;
    left: 0;
    width: 100%;
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
