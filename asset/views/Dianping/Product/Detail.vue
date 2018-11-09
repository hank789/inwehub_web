<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">{{ title }}</h1>
      <div class="topMore" @tap.stop.prevent="joinShare">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gengduo1"></use>
        </svg>
      </div>
    </header>
    <div class="mui-content" v-show="!loading">

      <vue-pull-refresh :on-refresh="refreshPageData" id="pullDownContainer">
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
                :starPoints="[48.3,190.9,46.5,190.8,43.2,189.7,41.6,188.7,40.4,187.7,38.4,185.2,37.2,182.3,36.9,179.1,37.1,177.5,46,125.9,8.5,89.4,7.4,88.2,5.9,85.4,5.1,82.4,5.2,79.3,5.6,77.7,6.2,76.2,8,73.6,10.4,71.6,13.2,70.3,14.8,69.9,66.6,62.4,89.8,15.4,90.6,14,92.7,11.7,95.4,10,98.4,9.1,100,9,101.6,9.1,104.7,10,107.3,11.6,109.4,14,110.2,15.4,133.4,62.4,185.2,69.9,186.8,70.2,189.7,71.5,192.1,73.5,193.8,76.2,194.4,77.7,194.8,79.3,194.9,82.4,194.1,85.4,192.6,88.2,191.5,89.4,154,125.9,162.9,177.5,163.1,179.1,162.7,182.2,161.5,185.1,159.6,187.6,158.4,188.7,157,189.6,154.1,190.7,151,190.9,147.9,190.2,146.4,189.6,100,165.2,53.7,189.6,51,190.6,48.3,190.9,48.3,190.9]"
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
        <div class="line-river-big" v-if="detail.recommend_users && detail.recommend_users.length"></div>

        <div class="recommend" v-if="detail.recommend_users && detail.recommend_users.length">
          <div class="recommendTitle">
            <span class="font-family-medium">推荐顾问</span>
          </div>

          <swiper :options="swiperOption" class="recommenBanners">
            <swiper-slide v-for="(advisers, index) in detail.recommend_users" :key="index">
              <div class="recommendList">
                <div class="avatar" @tap.stop.prevent="toResume(advisers.uuid)">
                  <img :src="advisers.avatar_url">
                </div>
                <div class="personalInfo">
                  <div class="name">
                    <span class="font-family-medium">{{ advisers.name }}</span>
                  </div>
                  <div class="good text-line-1">擅长“{{ advisers.skill }}”</div>
                </div>
                <div class="speak" @tap.stop.prevent="goChat(advisers.id)"><span class="border-football">沟通</span></div>
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
               @tap.stop.prevent="$router.pushPlus('/dianping/' + encodeURIComponent(detail.name) + '/comment')">
            查看全部{{ detail.review_count ? detail.review_count + '条' : '' }}点评
          </div>
        </div>

        <div class="line-river-big"></div>

        <div class="component-score">
          <div class="text">就您的感受而言，您会给他打多少分？</div>
          <starRating
            :increment="1"
            :padding="4"
            :activeColor="'#fcc816'"
            v-model="star"
            :star-size="23"
            :show-rating="false"
            :border-color="'#fcc816'"
            :border-width="3"
            :inactive-color="'#FFFFFF'"
            @rating-selected="waitGoDianping"
            :starPoints="[48.3,190.9,46.5,190.8,43.2,189.7,41.6,188.7,40.4,187.7,38.4,185.2,37.2,182.3,36.9,179.1,37.1,177.5,46,125.9,8.5,89.4,7.4,88.2,5.9,85.4,5.1,82.4,5.2,79.3,5.6,77.7,6.2,76.2,8,73.6,10.4,71.6,13.2,70.3,14.8,69.9,66.6,62.4,89.8,15.4,90.6,14,92.7,11.7,95.4,10,98.4,9.1,100,9,101.6,9.1,104.7,10,107.3,11.6,109.4,14,110.2,15.4,133.4,62.4,185.2,69.9,186.8,70.2,189.7,71.5,192.1,73.5,193.8,76.2,194.4,77.7,194.8,79.3,194.9,82.4,194.1,85.4,192.6,88.2,191.5,89.4,154,125.9,162.9,177.5,163.1,179.1,162.7,182.2,161.5,185.1,159.6,187.6,158.4,188.7,157,189.6,154.1,190.7,151,190.9,147.9,190.2,146.4,189.6,100,165.2,53.7,189.6,51,190.6,48.3,190.9,48.3,190.9]"
          ></starRating>
        </div>
        <div class="line-river-big"></div>
        <div class="allDianPing font-family-medium">相关推荐</div>
        <div class="line-river-after line-river-after-top"></div>

        <div class="productList">
          <div class="comment-product" v-for="(tag, index) in detail.related_tags" :key="index">
            <div class="product-info" @tap.stop.prevent="$router.pushPlus('/dianping/product/' + encodeURIComponent(tag.name))">
              <div class="product-img border-football">
                <img class="lazyImg" v-lazy="tag.logo" alt="">
              </div>
              <div class="product-detail">
                <div class="productName font-family-medium text-line-1">{{ tag.name }}</div>
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
                      :starPoints="[48.3,190.9,46.5,190.8,43.2,189.7,41.6,188.7,40.4,187.7,38.4,185.2,37.2,182.3,36.9,179.1,37.1,177.5,46,125.9,8.5,89.4,7.4,88.2,5.9,85.4,5.1,82.4,5.2,79.3,5.6,77.7,6.2,76.2,8,73.6,10.4,71.6,13.2,70.3,14.8,69.9,66.6,62.4,89.8,15.4,90.6,14,92.7,11.7,95.4,10,98.4,9.1,100,9,101.6,9.1,104.7,10,107.3,11.6,109.4,14,110.2,15.4,133.4,62.4,185.2,69.9,186.8,70.2,189.7,71.5,192.1,73.5,193.8,76.2,194.4,77.7,194.8,79.3,194.9,82.4,194.1,85.4,192.6,88.2,191.5,89.4,154,125.9,162.9,177.5,163.1,179.1,162.7,182.2,161.5,185.1,159.6,187.6,158.4,188.7,157,189.6,154.1,190.7,151,190.9,147.9,190.2,146.4,189.6,100,165.2,53.7,189.6,51,190.6,48.3,190.9,48.3,190.9]"
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
      </vue-pull-refresh>
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
  import { scrollToElement, scrollPage } from '../../../utils/dom'
  import VuePullRefresh from 'vue-awesome-pull-refresh'
  import starRating from '../../../components/star-rating/star-rating.vue'

  export default {
    data () {
      return {
        title: '产品服务',
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
        iconMenus: [],
        star: 0
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
          number: this.detail.followers,
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
      PageMore,
      'vue-pull-refresh': VuePullRefresh,
      starRating
    },
    methods: {
      waitGoDianping (rating) {
        localEvent.setLocalItem('dianping_rating', {rating: rating})
        setTimeout(() => {
          this.star = 0
          this.goDianping()
        }, 500)
      },
      toResume (uuid) {
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
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
          this.title = '产品服务'
          scrollToElement(this, '.product-introduce', '.pull-down-container')
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
    mounted () {
      scrollPage('.mui-content > #pullDownContainer', () => {
        this.title = this.detail.name
      }, null, () => {
        this.title = '产品服务'
      })
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
    box-shadow: 0rem 0.186rem 0.533rem 0rem rgba(240, 242, 245, 1);
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
        width: 4.5rem;
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
        width: 7.5rem;
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
  .container-menuFooter .menu .iconWrapper {
    color: red;
  }

  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 2.4rem;
    text-align: right;
    padding-right: 0.426rem;
  }
</style>

<style>
  .recommenBanners .swiper-pagination-bullet {
    width: 5px; /* px不转换 */
    height: 5px; /* px不转换 */
    margin: 0 2px !important; /* px不转换 */
    background: #D8D8D8;
    opacity: 1;
  }

  .recommenBanners .swiper-pagination-bullets .swiper-pagination-bullet-active {
    background: #03AEF9;
    width: 7.5px; /* px不转换 */
    border-radius: 100px !important; /* px不转换 */
  }

  .recommenBanners .container-menuFooter .menu .iconWrapper .icon {
    color: red;
  }
</style>
