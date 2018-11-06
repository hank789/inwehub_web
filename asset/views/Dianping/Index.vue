<template>
  <div>
    <div class="dianPingWrapper">
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
            <div class="container-product-comment" @tap.stop.prevent="$router.pushPlus('/dianping/comment/' + recommandProduct.slug)">
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
              <span>{{ !category.name?'选择类型': category.name }}</span>
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
                  <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
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

          <div class="noData" v-if="!list.length">
            <div class="DataImg">
              <img src="../../statics/images/empty@3x.png" alt="">
            </div>
            <div class="noDataText">暂时没有数据～</div>
          </div>
        </div>
        </RefreshList>
      </div>
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
  .dianPingWrapper {
    background: #FFFFFF;
  }
  .mui-content {
    background:linear-gradient(180deg,#DCDCDC 0%,#F3F4F6 100%);
  }
  .container-control-logoAndTabsAndSearch {
    background: #FFFFFF;
  }

  .dianpingBanners{
    padding-top:0.4rem;
    height: 6.72rem;
    .swiper-slide{
      width:auto !important;
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
    }
  }

  .comment-product {
    padding: 0.293rem 0.4rem 0.4rem;
    .product-info {
      overflow: hidden;
      background: #F7F8FA;
      padding: 0.266rem;
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
        }
      }
    }
  }
  .container-product-list {
    background: #ffffff;
    margin-top: 0.266rem;
    padding-bottom: 0.4rem;
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
      box-shadow:0rem 0.133rem 0.266rem 0rem rgba(249,249,251,1);
      .productType {
        .icon {
          color: #B4B4B6;
          font-size: 0.186rem;
        }
      }
      .productSort {
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
    bottom: -0.053rem;
  }
</style>

<style>
  .dianpingBanners .swiper-pagination-bullet {
    border-radius: 2.666rem !important;
  }
  .dianpingBanners .swiper-pagination-bullets .swiper-pagination-bullet-active {
    width: 0.28rem;
  }
</style>
