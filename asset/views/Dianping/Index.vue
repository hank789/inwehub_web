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
                    <img class="lazyImg" v-lazy="recommandProduct.user.avatar" alt="">
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
                  <div class="product-info">
                    <div class="product-img">
                      <img class="lazyImg" v-lazy="recommandProduct.tag.logo" alt="">
                    </div>
                    <div class="product-detail">
                      <div class="productName font-family-medium">{{ recommandProduct.tag.name }}</div>
                      <div class="productMark">
                        <div class="stars">
                          <star-rating
                            :padding="3"
                            :activeColor="'#fcc816'"
                            :star-size="11"
                            :show-rating="false"
                            :border-color="'#fcc816'"
                            :border-width="1"
                            :inactive-color="'#F7F8FA'"
                            :rating="recommandProduct.tag.review_average_rate"
                            :read-only="true"
                            :starPoints="[938.5,323.6,704,289.8,599,76.3,595.3,69.9,586.6,58.2,576.3,48,564.5,39.2,558.1,35.3,552.8,32.6,541.9,28.4,530.6,25.6,519,24.2,513,24.1,506.3,24.3,493,26.1,480.4,29.6,468.4,34.7,457.3,41.4,447.1,49.7,438.1,59.3,430.4,70.3,427,76.3,319.5,289.8,85,323.6,77.9,325,64.3,329.6,51.4,336.2,39.7,344.7,34.3,349.7,30.8,353.3,24.5,360.8,19,368.8,14.5,377.2,10.8,385.9,8,394.9,6.1,404,5,413.3,4.9,422.6,5.6,431.9,7.3,441.1,9.8,450.1,13.2,458.9,17.5,467.4,22.8,475.5,28.9,483.2,32.3,486.9,202.2,652.8,161.8,887.3,161.1,894.6,161.3,909.3,163.6,923.8,168,937.8,171,944.6,174.3,950.6,182,961.8,191,971.6,201.3,980.1,212.6,987.1,224.8,992.5,237.7,996.2,251.2,998.2,258,998.4,263.6,998.3,274.7,997.1,285.5,994.5,296,990.7,301.1,988.2,511,877.6,721.4,988.2,726.7,990.8,737.5,995.1,748.8,997.9,760.2,999.3,766,999.4,767.5,999.4,774.1,999.1,780.8,998.4,785.6,997.5,794.8,995.1,803.8,991.9,812.3,987.8,820.3,982.9,827.7,977.2,834.6,970.7,840.9,963.4,843.8,959.5,846.5,955.6,851.4,947.4,855.4,938.8,858.6,929.9,860.8,920.7,862.1,911.3,862.4,901.7,861.8,892.1,861.2,887.3,820.7,652.8,990.7,486.9,995.7,481.4,1004.2,469.5,1010.9,456.6,1015.4,442.6,1016.8,435.2,1017.7,430.3,1018.5,420.6,1018.4,411,1017.3,401.6,1015.3,392.4,1012.4,383.5,1008.6,375,1004,366.9,998.7,359.3,992.7,352.3,985.9,345.8,978.6,340,970.6,334.9,962,330.6,953,327.1,943.4,324.5,938.5,323.6,938.5,323.6]"
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

        <div class="container-product-list">
          <div class="productMenu">
            <div class="productType" @tap.stop.prevent="showDropdownMenu()">
              <span>{{ !category.name ? '选择类型' : category.name }}</span>
              <div class="jianTou">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiangxiajiantou"></use>
                </svg>
              </div>
            </div>
            <div class="productSort" @tap.stop.prevent="selectSort()">
              <span>{{ orderByName }}</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-paixu"></use>
              </svg>
            </div>
          </div>

          <div class="productList">

            <div class="comment-product" v-for="(item, index) in list" :key="'comment-product_' + index">
              <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + item.name)">
                <div class="product-img">
                  <img class="lazyImg" v-lazy="item.logo" alt="">
                </div>
                <div class="product-detail">
                  <div class="productName font-family-medium text-line-1">{{ item.name }}</div>
                  <div class="productMark">
                    <div class="stars">
                      <star-rating
                        :padding="3"
                        :activeColor="'#fcc816'"
                        :star-size="11"
                        :show-rating="false"
                        :border-color="'#fcc816'"
                        :border-width="1"
                        :inactive-color="'#FFFFFF'"
                        :rating="item.review_average_rate"
                        :read-only="true"
                        :starPoints="[938.5,323.6,704,289.8,599,76.3,595.3,69.9,586.6,58.2,576.3,48,564.5,39.2,558.1,35.3,552.8,32.6,541.9,28.4,530.6,25.6,519,24.2,513,24.1,506.3,24.3,493,26.1,480.4,29.6,468.4,34.7,457.3,41.4,447.1,49.7,438.1,59.3,430.4,70.3,427,76.3,319.5,289.8,85,323.6,77.9,325,64.3,329.6,51.4,336.2,39.7,344.7,34.3,349.7,30.8,353.3,24.5,360.8,19,368.8,14.5,377.2,10.8,385.9,8,394.9,6.1,404,5,413.3,4.9,422.6,5.6,431.9,7.3,441.1,9.8,450.1,13.2,458.9,17.5,467.4,22.8,475.5,28.9,483.2,32.3,486.9,202.2,652.8,161.8,887.3,161.1,894.6,161.3,909.3,163.6,923.8,168,937.8,171,944.6,174.3,950.6,182,961.8,191,971.6,201.3,980.1,212.6,987.1,224.8,992.5,237.7,996.2,251.2,998.2,258,998.4,263.6,998.3,274.7,997.1,285.5,994.5,296,990.7,301.1,988.2,511,877.6,721.4,988.2,726.7,990.8,737.5,995.1,748.8,997.9,760.2,999.3,766,999.4,767.5,999.4,774.1,999.1,780.8,998.4,785.6,997.5,794.8,995.1,803.8,991.9,812.3,987.8,820.3,982.9,827.7,977.2,834.6,970.7,840.9,963.4,843.8,959.5,846.5,955.6,851.4,947.4,855.4,938.8,858.6,929.9,860.8,920.7,862.1,911.3,862.4,901.7,861.8,892.1,861.2,887.3,820.7,652.8,990.7,486.9,995.7,481.4,1004.2,469.5,1010.9,456.6,1015.4,442.6,1016.8,435.2,1017.7,430.3,1018.5,420.6,1018.4,411,1017.3,401.6,1015.3,392.4,1012.4,383.5,1008.6,375,1004,366.9,998.7,359.3,992.7,352.3,985.9,345.8,978.6,340,970.6,334.9,962,330.6,953,327.1,943.4,324.5,938.5,323.6,938.5,323.6]"
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
        // newDate.setTime(Date.parse(time.replace(/-/g, '/')))
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
          .starsText {
          }
        }
      }
    }
  }

  .container-product-list {
    background: #ffffff;
    margin-top: -0.373rem;
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
        .icon {
          color: #B4B4B6;
          font-size: 0.186rem;
        }
        .jianTou {
          margin-left: 0.08rem;
          margin-top: -0.053rem;
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
    bottom: 0.64rem;
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
