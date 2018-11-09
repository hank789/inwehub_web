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
             @tap.stop.prevent="$router.pushPlus('/searchSubmission','list-detail-page-three')">
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
        :isShowUpToRefreshDescription="false"
        v-model="list"
        :autoShowEmpty="false"
        class="listWrapper"
      >
        <template slot="listHeader">
          <swiper v-if="recommandProductList.length" :options="swiperOption" class="dianpingBanners">

            <swiper-slide v-for="(recommandProduct, index) in recommandProductList" :key="'recommandProductList_' + index">
              <div class="container-product-comment"
                   @tap.stop.prevent="$router.pushPlus('/dianping/comment/' + recommandProduct.slug)">
                <div class="comment-info">
                  <div class="avatarImg">
                    <img :src="getImageSuffix(recommandProduct.user.avatar, 102)">
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
                      <img :src="getImageSuffix(recommandProduct.tag.logo, 132)">
                    </div>
                    <div class="product-detail">
                      <div class="productName font-family-medium">{{ recommandProduct.tag.name }}</div>
                      <div class="productMark">
                        <div class="stars">
                          <star-rating
                            :increment="0.1"
                            :padding="3"
                            :activeColor="'#fcc816'"
                            :star-size="11"
                            :show-rating="false"
                            :border-color="'#fcc816'"
                            :border-width="1"
                            :inactive-color="'#F7F8FA'"
                            :rating="recommandProduct.tag.review_average_rate"
                            :read-only="true"
                            :starPoints="[48.3,190.9,46.5,190.8,43.2,189.7,41.6,188.7,40.4,187.7,38.4,185.2,37.2,182.3,36.9,179.1,37.1,177.5,46,125.9,8.5,89.4,7.4,88.2,5.9,85.4,5.1,82.4,5.2,79.3,5.6,77.7,6.2,76.2,8,73.6,10.4,71.6,13.2,70.3,14.8,69.9,66.6,62.4,89.8,15.4,90.6,14,92.7,11.7,95.4,10,98.4,9.1,100,9,101.6,9.1,104.7,10,107.3,11.6,109.4,14,110.2,15.4,133.4,62.4,185.2,69.9,186.8,70.2,189.7,71.5,192.1,73.5,193.8,76.2,194.4,77.7,194.8,79.3,194.9,82.4,194.1,85.4,192.6,88.2,191.5,89.4,154,125.9,162.9,177.5,163.1,179.1,162.7,182.2,161.5,185.1,159.6,187.6,158.4,188.7,157,189.6,154.1,190.7,151,190.9,147.9,190.2,146.4,189.6,100,165.2,53.7,189.6,51,190.6,48.3,190.9,48.3,190.9]"
                          ></star-rating>
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
            <div class="comment-product" v-for="(item, index) in list" :key="'comment-product_' + index">
              <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(item.name))">
                <div class="product-img border-football">
                  <img class="lazyImg" v-lazy="getImageSuffix(item.logo, 132)" alt="">
                </div>
                <div class="product-detail">
                  <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
                  <div class="productMark">
                    <div class="stars">
                      <star-rating
                        :increment="0.1"
                        :padding="3"
                        :activeColor="'#fcc816'"
                        :star-size="11"
                        :show-rating="false"
                        :border-color="'#fcc816'"
                        :border-width="1"
                        :inactive-color="'#FFFFFF'"
                        :rating="item.review_average_rate"
                        :read-only="true"
                        :starPoints="[48.3,190.9,46.5,190.8,43.2,189.7,41.6,188.7,40.4,187.7,38.4,185.2,37.2,182.3,36.9,179.1,37.1,177.5,46,125.9,8.5,89.4,7.4,88.2,5.9,85.4,5.1,82.4,5.2,79.3,5.6,77.7,6.2,76.2,8,73.6,10.4,71.6,13.2,70.3,14.8,69.9,66.6,62.4,89.8,15.4,90.6,14,92.7,11.7,95.4,10,98.4,9.1,100,9,101.6,9.1,104.7,10,107.3,11.6,109.4,14,110.2,15.4,133.4,62.4,185.2,69.9,186.8,70.2,189.7,71.5,192.1,73.5,193.8,76.2,194.4,77.7,194.8,79.3,194.9,82.4,194.1,85.4,192.6,88.2,191.5,89.4,154,125.9,162.9,177.5,163.1,179.1,162.7,182.2,161.5,185.1,159.6,187.6,158.4,188.7,157,189.6,154.1,190.7,151,190.9,147.9,190.2,146.4,189.6,100,165.2,53.7,189.6,51,190.6,48.3,190.9,48.3,190.9]"
                      ></star-rating>
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

          <div class="noData" v-if="!list.length">
            <div class="DataImg">
              <img src="../../statics/images/empty@3x.png" alt="">
            </div>
            <div class="noDataText">暂时没有数据～</div>
          </div>
        </div>
      </RefreshList>

      <div class="container-product-list dianpingBannersHide">
        <div class="line-river-after line-river-after-top"></div>
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
      :options="['评分', '热度']"
      @selectedItem="selectedItem"
    ></Options>

  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import RefreshList from '../../components/refresh/List.vue'
  import { getRecommandProductList, getCategories } from '../../utils/dianping'
  import DropDownMenu from '../../components/select/DropDownMenu.vue'
  import Options from '../../components/Options.vue'
  import { scrollPage } from '../../utils/dom.js'
  import { getImageSuffix } from '../../utils/image'

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
        }
      }
    },
    computed: {
      prevOtherData () {
        return {category_id: this.category.id, orderBy: this.orderBy}
      },
      nextOtherData () {
        return {category_id: this.category.id, orderBy: this.orderBy}
      },
      orderByName () {
        switch (this.orderBy) {
          case 0:
            return '排序'
          case 1:
            return '评分'
          case 2:
            return '热度'
        }
      }
    },
    components: {
      swiper,
      swiperSlide,
      RefreshList,
      DropDownMenu,
      Options
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
      selectedItem (text) {
        this.$refs.itemOptions.toggle()
        switch (text) {
          case '评分':
            this.orderBy = 1
            this.sortOrderByName = '评分'
            break
          case '热度':
            this.orderBy = 2
            this.sortOrderByName = '热度'
            break
        }
      },
      selectSort () {
        this.$refs.itemOptions.toggle()
      },
      showDropdownMenu () {
        var height = document.querySelector('.dianpingBanners').clientHeight - 20
        this.$refs.RefreshList.scrollTo(0, -height, 800)
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
    mounted () {
      scrollPage('#refreshContainer > .mui-scroll', (container, y) => {
        var height = document.querySelector('.dianpingBanners').clientHeight - 20
        if (y > height) {
          document.querySelector('.dianpingBannersHide').classList.add('showTagsHome')
        }
      }, null, (container, y) => {
        var height = document.querySelector('.dianpingBanners').clientHeight - 20
        if (y < height) {
          document.querySelector('.dianpingBannersHide').classList.remove('showTagsHome')
        }
      })
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
          object-fit: cover;
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
    top: 1.173rem;
    bottom: 50px; /* px不转换 */
  }

  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 0.8rem;
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
