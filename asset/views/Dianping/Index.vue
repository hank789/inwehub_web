<template>
  <div>
    <div class="mui-content">
      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>
        <div class="logoAndTabsAndSearchTabs">
          <div class="tab" @tap.stop.prevent="$router.replace('/groups')">圈子</div>
          <div class="tab" @tap.stop.prevent="$router.replace('/ask/offers')">问答</div>
          <div class="tab active" @tap.stop.prevent="$router.replace('/dianping')">点评</div>
        </div>
        <svg class="icon searchIcon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/searchSubmission','list-detail-page-three')">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </div>

      <div class="line-river-after line-river-after-top"></div>

      <RefreshList
        ref="RefreshList"
        :api="'tags/productList'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        v-model="list"
        :autoShowEmpty="false"
        class="listWrapper"
      >

      <swiper v-if="recommandProductList.length" :options="swiperOption" class="dianpingBanners">

        <swiper-slide v-for="(recommandProduct, index) in recommandProductList" :key="index">
          <div class="container-product-comment" @tap.stop.prevent="$router.pushPlus('/dianping/comment/' + recommandProduct.id)">
            <div class="comment-info">
              <div class="avatarImg">
                <img class="lazyImg" v-lazy="recommandProduct.user.avatar" alt="">
              </div>
              <div class="comment-name">
                <div class="font-family-medium">{{ recommandProduct.user.name }}</div>
                <div><timeago :since="timeago(recommandProduct.created_at.date)" :auto-update="60"></timeago> </div>
              </div>
              <div class="comment-mark font-family-medium">{{ recommandProduct.rate_star }}分</div>
            </div>
            <div class="comment-content text-line-3">{{ recommandProduct.title }}</div>
            <div class="comment-product">
              <div class="product-info">
                <div class="product-img">
                  <img class="lazyImg" v-lazy="recommandProduct.tag.logo" alt="">
                </div>
                <div class="product-detail">
                  <div class="productName font-family-medium">{{ recommandProduct.tag.name }}</div>
                  <div class="productMark">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shoucangdilantongyi"></use>
                    </svg><span>{{ recommandProduct.tag.review_average_rate }}分</span>
                    <i></i><span>{{ recommandProduct.tag.review_count }}条评论</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

      <div class="container-product-list">
        <div class="productMenu">
          <div class="productType" @tap.stop.prevent="showDropdownMenu()">
            <span>产品类型</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangxiajiantou"></use>
            </svg>
          </div>
          <div class="productSort" @tap.stop.prevent="selectSort()">
            <span>排序</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-paixu"></use>
            </svg>
          </div>
        </div>

        <div class="productList">

          <div class="comment-product" v-for="(item, index) in list" :key="index">
            <div class="product-info"  @tap.stop.prevent="$router.pushPlus('/dianping/product/' + item.name)">
              <div class="product-img">
                <img class="lazyImg" v-lazy="item.logo" alt="">
              </div>
              <div class="product-detail">
                <div class="productName font-family-medium">{{ item.name }}</div>
                <div class="productMark">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shoucangdilantongyi"></use>
                  </svg><span>{{ item.review_average_rate }}分</span>
                  <i></i><span>{{ item.review_count }}条评论</span>
                </div>
              </div>
            </div>
            <div class="line-river-after line-river-after-top"></div>
          </div>

        </div>
      </div>
      </RefreshList>
    </div>

    <DropDownMenu
      ref="dropdownMenu"
      :tree="categories"
      v-model="category"
    ></DropDownMenu>

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
        swiperOption: {
          loop: true,
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
      selectedItem (text) {
        this.$refs.itemOptions.toggle()
        switch (text) {
          case '评分':
            this.orderBy = 1
            break
          case '热度':
            this.orderBy = 2
            break
        }
      },
      selectSort () {
        this.$refs.itemOptions.toggle()
      },
      showDropdownMenu () {
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
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background:linear-gradient(180deg,#DCDCDC 0%,#F3F4F6 100%);
  }
  .container-control-logoAndTabsAndSearch {
    background: #FFFFFF;
  }

  .dianpingBanners{
    padding-top:15px;
    height: 252px;
    .swiper-slide{
      width:auto !important;
    }
  }

  .container-product-comment {
    display: inline-block;
    width: 313px;
    background: #ffffff;
    border-radius: 8px;
    .comment-info {
      overflow: hidden;
      padding: 15px 15px 10px;
      .avatarImg {
        width: 34px;
        height: 34px;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .comment-name {
        color: #B4B4B6;
        font-size: 11px;
        line-height: 15px;
        float: left;
        margin-left: 8px;
        .font-family-medium {
          color: #444444;
          font-size: 13px;
          line-height: 18px;
          margin-bottom: 2px;
        }
      }
      .comment-mark {
        float: right;
        color: #FCC816;
        font-size: 13px;
        line-height: 18px;
      }
    }
    .comment-content {
      color: #444444;
      font-size: 14px;
      line-height: 22.5px;
      padding: 0 15px;
    }
  }

  .comment-product {
    padding: 11px 15px 15px;
    .product-info {
      overflow: hidden;
      background: #F7F8FA;
      padding: 10px;
      .product-img {
        width: 44px;
        height: 44px;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
      .product-detail {
        float: left;
        margin-left: 10px;
        .productName {
          color: #444444;
          font-size: 16px;
          line-height: 22.5px;
        }
        .productMark {
          .icon {
            color: #FCC816;
            font-size: 12px;
          }
          span {
            color: #B4B4B6;
            font-size: 11px;
            line-height: 15px;
            &:nth-of-type(1) {
              color: #FCC816;
              margin-left: 3px;
            }
          }
          i {
            width: 2px;
            height: 2px;
            margin-right: 5px;
            vertical-align: middle;
            border-radius: 50%;
            background: #B4B4B6;
            display: inline-block;
          }
        }
      }
    }
  }
  .container-product-list {
    background: #ffffff;
    margin-top: 10px;
    padding-bottom: 15px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    .productMenu {
      height: 34px;
      display: flex;
      color: #808080;
      font-size: 13px;
      padding: 0 16px;
      line-height: 34px;
      justify-content: space-between;
      box-shadow:0px 5px 10px 0px rgba(249,249,251,1);
      .productType {
        .icon {
          color: #B4B4B6;
          font-size: 7px;
        }
      }
      .productSort {
        .icon {
          color: #B4B4B6;
          font-size: 10px;
        }
      }
    }
    .productList {
      .comment-product {
        padding: 13px 15px 0;
        .product-info {
          padding: 0 0 15px;
          background: none;
        }
      }
    }
  }


  .listWrapper {
    top: 1.173rem;
    bottom: 50px; /* px不转换 */
  }
  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: -2px;
  }
</style>

<style>
  .dianpingBanners .swiper-pagination-bullet {
    border-radius: 100px !important;
  }
  .dianpingBanners .swiper-pagination-bullets .swiper-pagination-bullet-active {
    width: 10.5px;
  }
</style>
