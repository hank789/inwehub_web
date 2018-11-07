<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">产品服务</h1>
      <div class="topMore" @tap.stop.prevent="joinShare">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gengduo1"></use>
        </svg>
      </div>
    </header>
    <div class="mui-content" v-show="!loading">

      <div class="product-introduce">
        <div class="companyLogo border-football">
          <img class="lazyImg" v-lazy="detail.logo" alt="">
        </div>
        <div class="companyNmae font-family-medium">{{ detail.name }}</div>
        <div class="companyMark">
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
              :rating="detail.review_average_rate"
              :read-only="true"
              :starPoints="[938.5,323.6,704,289.8,599,76.3,595.3,69.9,586.6,58.2,576.3,48,564.5,39.2,558.1,35.3,552.8,32.6,541.9,28.4,530.6,25.6,519,24.2,513,24.1,506.3,24.3,493,26.1,480.4,29.6,468.4,34.7,457.3,41.4,447.1,49.7,438.1,59.3,430.4,70.3,427,76.3,319.5,289.8,85,323.6,77.9,325,64.3,329.6,51.4,336.2,39.7,344.7,34.3,349.7,30.8,353.3,24.5,360.8,19,368.8,14.5,377.2,10.8,385.9,8,394.9,6.1,404,5,413.3,4.9,422.6,5.6,431.9,7.3,441.1,9.8,450.1,13.2,458.9,17.5,467.4,22.8,475.5,28.9,483.2,32.3,486.9,202.2,652.8,161.8,887.3,161.1,894.6,161.3,909.3,163.6,923.8,168,937.8,171,944.6,174.3,950.6,182,961.8,191,971.6,201.3,980.1,212.6,987.1,224.8,992.5,237.7,996.2,251.2,998.2,258,998.4,263.6,998.3,274.7,997.1,285.5,994.5,296,990.7,301.1,988.2,511,877.6,721.4,988.2,726.7,990.8,737.5,995.1,748.8,997.9,760.2,999.3,766,999.4,767.5,999.4,774.1,999.1,780.8,998.4,785.6,997.5,794.8,995.1,803.8,991.9,812.3,987.8,820.3,982.9,827.7,977.2,834.6,970.7,840.9,963.4,843.8,959.5,846.5,955.6,851.4,947.4,855.4,938.8,858.6,929.9,860.8,920.7,862.1,911.3,862.4,901.7,861.8,892.1,861.2,887.3,820.7,652.8,990.7,486.9,995.7,481.4,1004.2,469.5,1010.9,456.6,1015.4,442.6,1016.8,435.2,1017.7,430.3,1018.5,420.6,1018.4,411,1017.3,401.6,1015.3,392.4,1012.4,383.5,1008.6,375,1004,366.9,998.7,359.3,992.7,352.3,985.9,345.8,978.6,340,970.6,334.9,962,330.6,953,327.1,943.4,324.5,938.5,323.6,938.5,323.6]"
            ></star-rating>
          </div>
          <div class="starsText">
            <span>{{ detail.review_average_rate }}分</span>
            <i></i><span class="comment">{{ detail.review_count }}条评论</span>
          </div>
        </div>
        <div class="companyDescribe">{{ detail.summary }}</div>
        <div class="supply" v-if="detail.vendor"
             @tap.stop.prevent="$router.pushPlus('/companyDetails/' + detail.vendor.id)"><span>供应商</span><span
          class="font-family-medium">{{ detail.vendor.name }}</span></div>
      </div>
      <div class="optionlList">
        <template v-for="(category, index) in detail.categories">
          <div class="list" @tap.stop.prevent="$router.pushPlus('/dianping/products/' + category.id + '/' + encodeURIComponent(category.name))">
            <span>{{ category.name }}</span>
            <span class="ranking">No.{{ category.rate }}</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jinru"></use>
            </svg>
          </div>
          <div class="line-river-after line-river-after-top" v-if="index !== detail.categories.length-1"></div>
        </template>
      </div>
      <div class="line-river-big"></div>

      <div class="recommend" v-if="detail.recommend_users && detail.recommend_users.length">
        <div class="recommendTitle">
          <span class="font-family-medium">推荐顾问</span>
        </div>

        <swiper :options="swiperOption" class="recommenBanners">
          <swiper-slide v-for="(advisers, index) in detail.recommend_users" :key="index">
            <div class="recommendList" @tap.stop.prevent="goChat(advisers.id)">
              <div class="avatar">
                <img class="lazyImg" v-lazy="advisers.avatar_url" alt="">
              </div>
              <div class="personalInfo">
                <div class="name">
                  <span class="font-family-medium">{{ advisers.name }}</span>
                </div>
                <div class="good">擅长“{{ advisers.skill }}”</div>
              </div>
              <div class="speak"><span class="border-football">沟通</span></div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>

      </div>
      <div v-if="detail.review_count">
        <div class="line-river-big"></div>
        <div class="allDianPing font-family-medium">点评 {{ detail.review_count ? '(' + detail.review_count + ')' : '' }}</div>
        <div class="line-river-after line-river-after-top"></div>

        <div>
          <template v-for="(comment, index) in productComments">
            <feedDianping :item="comment" @showItemMore="showItemMore"></feedDianping>
          </template>
        </div>

        <div class="openAllDianPing font-family-medium"
             @tap.stop.prevent="$router.pushPlus('/dianping/' + detail.name + '/comment')">
          查看全部{{ detail.review_count ? detail.review_count + '条' : '' }}点评
        </div>
      </div>

      <div class="line-river-big"></div>

      <div class="component-score" @tap.stop.prevent="goDianping()">
        <div class="text">就您的感受而言，您会给他打多少分？</div>
        <div class="stars">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xingxingkongxin"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xingxingkongxin"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xingxingkongxin"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xingxingkongxin"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xingxingkongxin"></use>
          </svg>
        </div>
      </div>
      <div class="line-river-big"></div>
      <div class="allDianPing font-family-medium">相关推荐</div>
      <div class="line-river-after line-river-after-top"></div>

      <div class="productList">
        <div class="comment-product" v-for="(tag, index) in detail.related_tags" :key="index">
          <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(tag.name))">
            <div class="product-img">
              <img class="lazyImg" v-lazy="tag.logo" alt="">
            </div>
            <div class="product-detail">
              <div class="productName font-family-medium">{{ tag.name }}</div>
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
                    :rating="tag.review_average_rate"
                    :read-only="true"
                    :starPoints="[938.5,323.6,704,289.8,599,76.3,595.3,69.9,586.6,58.2,576.3,48,564.5,39.2,558.1,35.3,552.8,32.6,541.9,28.4,530.6,25.6,519,24.2,513,24.1,506.3,24.3,493,26.1,480.4,29.6,468.4,34.7,457.3,41.4,447.1,49.7,438.1,59.3,430.4,70.3,427,76.3,319.5,289.8,85,323.6,77.9,325,64.3,329.6,51.4,336.2,39.7,344.7,34.3,349.7,30.8,353.3,24.5,360.8,19,368.8,14.5,377.2,10.8,385.9,8,394.9,6.1,404,5,413.3,4.9,422.6,5.6,431.9,7.3,441.1,9.8,450.1,13.2,458.9,17.5,467.4,22.8,475.5,28.9,483.2,32.3,486.9,202.2,652.8,161.8,887.3,161.1,894.6,161.3,909.3,163.6,923.8,168,937.8,171,944.6,174.3,950.6,182,961.8,191,971.6,201.3,980.1,212.6,987.1,224.8,992.5,237.7,996.2,251.2,998.2,258,998.4,263.6,998.3,274.7,997.1,285.5,994.5,296,990.7,301.1,988.2,511,877.6,721.4,988.2,726.7,990.8,737.5,995.1,748.8,997.9,760.2,999.3,766,999.4,767.5,999.4,774.1,999.1,780.8,998.4,785.6,997.5,794.8,995.1,803.8,991.9,812.3,987.8,820.3,982.9,827.7,977.2,834.6,970.7,840.9,963.4,843.8,959.5,846.5,955.6,851.4,947.4,855.4,938.8,858.6,929.9,860.8,920.7,862.1,911.3,862.4,901.7,861.8,892.1,861.2,887.3,820.7,652.8,990.7,486.9,995.7,481.4,1004.2,469.5,1010.9,456.6,1015.4,442.6,1016.8,435.2,1017.7,430.3,1018.5,420.6,1018.4,411,1017.3,401.6,1015.3,392.4,1012.4,383.5,1008.6,375,1004,366.9,998.7,359.3,992.7,352.3,985.9,345.8,978.6,340,970.6,334.9,962,330.6,953,327.1,943.4,324.5,938.5,323.6,938.5,323.6]"
                  ></star-rating>
                </div>
                <div class="starsText">
                  <span>{{ tag.review_average_rate }}分</span>
                  <i></i><span>{{ tag.review_count }}条评论</span>
                </div>
              </div>
            </div>
          </div>
          <div class="line-river-after line-river-after-top"  v-if="index !== 4 && index !== detail.related_tags.length-1"></div>
        </div>
      </div>
      <div class="line-river-big"></div>
    </div>

    <FooterMenu
      :options="footerMenus"
      @clickedItem="footerMenuClickedItem"
    ></FooterMenu>

    <PageMore
      ref="share"
      :shareOption="shareOption"
      :hideShareBtn="true"
      :iconMenu="iconMenus"
    ></PageMore>

  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import feedDianping from '../../../components/Feed.vue'
  import { getProductDetail, getProductComments, collectProduct } from '../../../utils/dianping'
  import userAbility from '../../../utils/userAbility'
  import FooterMenu from '../../../components/DianPingFooterMenu.vue'
  import PageMore from '../../../components/PageMore.vue'
  import {getDianpingProductDetail} from '../../../utils/shareTemplate'
  const currentUser = localEvent.getLocalItem('UserInfo')
  import localEvent from '../../../stores/localStorage'
  import { urlencode } from '../../../utils/string'

  export default {
    data () {
      return {
        loading: 1,
        id: '',
        userName: currentUser.name,
        detail: {
          reviews: 0,
          followers: 0
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
        },
        productComments: [],
        shareOption: {},
        iconMenus: []
      }
    },
    computed: {
      footerMenus () {
        return [{
          icon: '#icon-yaoqing',
          text: '邀人点评',
          number: 0,
          disable: false,
          rightLine: true,
          isLight: false
        },
        {
          icon: '#icon-shoucang',
          text: '关注',
          number: 0,
          disable: this.detail.followers,
          rightLine: true,
          isLight: false
        },
        {
          // icon: '#icon-pinglun',
          text: '写点评',
          number: 0,
          disable: false,
          rightLine: false,
          isLight: true
        }]
      }
    },
    components: {
      swiper,
      swiperSlide,
      feedDianping,
      FooterMenu,
      PageMore
    },
    methods: {
      showItemMore (shareOption, item) {
        this.iconMenus = []
        this.shareOption = shareOption
        this.$refs.share.share()
      },
      joinShare () {
        this.iconMenus = []
        var shareOption = getDianpingProductDetail(
          this.userName,
          this.detail.name,
          this.detail.summary,
          this.detail.logo
        )
        this.shareOption = Object.assign(this.shareOption, shareOption)
        this.$refs.share.share()
      },
      goChat (uid) {
        userAbility.jumpToChat(uid, this)
      },
      refreshPageData () {
        let id = this.$route.params.id

        if (!id) {
          window.mui.toast('请求异常')
          window.mui.back()
          return
        }
        this.id = id

        getProductDetail(this, id, (data) => {
          this.detail = data
          this.loading = 0
        })

        getProductComments(this, id, 3, (productComments) => {
          this.productComments = productComments
        })
      },
      goDianping () {
        this.$router.pushPlus('/dianping/add/' + urlencode(this.detail.name))
      },
      footerMenuClickedItem (item) {
        switch (item.text) {
          case '写点评':
            this.goDianping()
            break
          case '关注':
            collectProduct(this, this.detail.id, () => {
              this.detail.followers = 1
            }, () => {
              this.detail.followers = 0
            })
            break
          case '邀人点评':
            this.joinShare()
            break
        }
      }
    },
    created () {
      this.refreshPageData()
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
    bottom: 1.33333rem;
  }
  .recommenBanners {
    height: 3.28rem;
    padding-top: 1.173rem;
    .swiper-slide {
      width: auto !important;
    }
  }
  .topMore {
    float: right;
    color: #3C3E44;
    margin-top: 0.266rem;
    font-size: 0.56rem;
  }
  .product-introduce {
    width: 9.146rem;
    margin: 0 auto;
    padding: 0.266rem 0 0.453rem;
    background: #ffffff;
    border-bottom-left-radius: 0.533rem;
    border-bottom-right-radius: 0.533rem;
    box-shadow: 0rem 0.186rem 0.346rem 0rem rgba(240, 242, 245, 1);
    .companyLogo {
      width: 1.6rem;
      height: 1.6rem;
      margin: 0 auto 0.266rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0.106rem;
        object-fit: cover;
      }
    }
    .companyNmae {
      color: #444444;
      font-size: 0.48rem;
      text-align: center;
      line-height: 0.666rem;
    }
    .companyMark {
      color: #FCC816;
      font-size: 0.293rem;
      line-height: 0.4rem;
      text-align: center;
      margin-top: 0.213rem;
      .stars {
        display: inline-block;
      }
      .starsText {
        display: inline-block;
        position: relative;
        top: -0.026rem;
      }
      .comment {
        color: #B4B4B6;
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
    .companyDescribe {
      color: #808080;
      font-size: 0.32rem;
      padding: 0 0.426rem;
      margin-top: 0.24rem;
      line-height: 0.506rem;
      letter-spacing: 0.013rem
    }
    .supply {
      text-align: right;
      padding: 0 0.426rem;
      span {
        color: #444444;
        font-size: 0.32rem;
        line-height: 0.44rem;
        &:nth-of-type(1) {
          color: #B4B4B6;
          margin-right: 0.08rem;
        }
      }
    }
  }

  .optionlList {
    .list {
      color: #444444;
      font-size: 0.373rem;
      padding: 0.32rem 0.426rem;
      display: flex;
      position: relative;
      justify-content: space-between;
      .ranking {
        color: #B4B4B6;
        font-size: 0.266rem;
        right: 0.88rem;
        position: absolute;
      }
      .icon {
        color: #808080;
        margin-top: 0.08rem;
      }
    }
    .line-river-after {
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
  }

  .recommend {
    position: relative;
    /*padding-bottom: 0.666rem;*/
    .recommendTitle {
      position: absolute;
      padding: 0.293rem 0.426rem 0;
      span {
        &:nth-of-type(1) {
          color: #444444;
          font-size: 0.426rem;
          line-height: 0.6rem;
          margin-top: 0.293rem;
        }
      }
    }
  }

  .recommendList {
    width: 8.12rem;
    margin: 0 auto 0.666rem;
    padding: 0.266rem 0.4rem;
    background: #F7F8FA;
    border-radius: 0.213rem;
    overflow: hidden;
    .avatar {
      width: 1.173rem;
      height: 1.173rem;
      float: left;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .personalInfo {
      float: left;
      margin-top: 0.08rem;
      margin-left: 0.266rem;
      .name {
        color: #565656;
        line-height: 0.533rem;
        font-size: 0.373rem;
      }
      .good {
        color: #B4B4B6;
        font-size: 0.32rem;
        line-height: 0.44rem;
      }
    }
    .speak {
      float: right;
      margin-top: 0.226rem;
      span {
        color: #03AEF9;
        font-size: 0.32rem;
        padding: 0 0.266rem;
        line-height: 0.72rem;
        display: inline-block;
      }
      .border-football {
        &:after {
          border-color: #03AEF9;
        }
      }
    }
  }

  .allDianPing {
    padding: 0 0.426rem;
    color: #444444;
    font-size: 0.426rem;
    line-height: 1.173rem;
  }

  .openAllDianPing {
    text-align: center;
    font-size: 0.373rem;
    color: #808080;
    line-height: 1.173rem;
  }

  .component-score {
    padding: 0.333rem 0.426rem 0.4rem;
    .text {
      color: #B4B4B6;
      font-size: 0.32rem;
      line-height: 0.44rem;
      margin-bottom: 0.213rem;
    }
    .stars {
      .icon {
        font-size: 0.613rem;
        color: #FCC816;
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
          .stars {
            margin-top: 0.026rem;
          }
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

  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 2.4rem;
    right: -3.44rem;
    left: auto;
  }
</style>

<style>
  .recommenBanners .swiper-pagination-bullet {
    border-radius: 2.666rem !important;
  }

  .recommenBanners .swiper-pagination-bullets .swiper-pagination-bullet-active {
    width: 0.28rem;
  }
</style>
