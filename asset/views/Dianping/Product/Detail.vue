<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">产品服务</h1>
    </header>
    <div class="mui-content" v-show="!loading">

      <div class="product-introduce">
        <div class="companyLogo">
          <img class="lazyImg" v-lazy="detail.logo" alt="">
        </div>
        <div class="companyNmae font-family-medium">{{ detail.name }}</div>
        <div class="companyMark">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoucangdilantongyi"></use>
          </svg><span>{{ detail.review_average_rate }}分</span>
          <i></i><span class="comment">{{ detail.review_count }}条评论</span>
        </div>
        <div class="companyDescribe">{{ detail.description }}</div>
        <div class="supply" v-if="detail.vendor" @tap.stop.prevent="$router.pushPlus('/companyDetails/' + detail.vendor.id)"><span>供应商</span><span class="font-family-medium">{{ detail.vendor.name }}</span></div>
      </div>
      <div class="optionlList">
        <template v-for="(category, index) in detail.categories">
          <div class="list" @tap.stop.prevent="$router.pushPlus('/dianping/product')">
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
            <div class="recommendList" @tap.stop.prevent="goChat(advisers.uuid)">
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

      <div class="line-river-big"></div>

    </div>

    <FooterMenu
      :options="footerMenus"
      @clickedItem="footerMenuClickedItem"
    ></FooterMenu>

  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { getProductDetail } from '../../../utils/dianping'
  import userAbility from '../../../utils/userAbility'
  import FooterMenu from '../../../components/FooterMenu.vue'

  export default {
    data () {
      return {
        loading: 1,
        id: '',
        detail: {
          reviews: 0
        },
        footerMenus: [{
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
          disable: false,
          rightLine: true,
          isLight: false
        },
        {
          icon: '#icon-pinglun',
          text: '写点评',
          number: 0,
          disable: false,
          rightLine: false,
          isLight: true
        }],
        recommendAdvisers: [
          1,
          2,
          3,
          4,
          5
        ],
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
    components: {
      swiper,
      swiperSlide,
      FooterMenu
    },
    methods: {
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
      },
      footerMenuClickedItem (item) {
        switch (item.text) {
          case '写点评':
            this.$router.pushPlus('/dianping/add/' + this.detail.id)
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
  }
  .recommenBanners{
    height: 123px;
    padding-top: 44px;
    .swiper-slide{
      width:auto !important;
    }
  }
  .product-introduce {
    width: 343px;
    margin: 0 auto;
    padding: 10px 0 17px;
    background: #ffffff;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow:0px 7px 13px 0px rgba(240,242,245,1);
    .companyLogo {
      width: 60px;
      height: 60px;
      margin: 0 auto 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    .companyNmae {
      color: #444444;
      font-size: 18px;
      text-align: center;
      line-height: 25px;
    }
    .companyMark {
      color: #FCC816;
      font-size: 11px;
      line-height: 15px;
      text-align: center;
      margin-top: 8px;
      .comment {
        color: #B4B4B6;
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
    .companyDescribe {
      color: #808080;
      font-size: 12px;
      padding: 0 16px;
      margin-top: 9px;
      line-height: 19px;
      letter-spacing: 0.5px
    }
    .supply {
      text-align: right;
      padding: 0 16px;
      span {
        color: #444444;
        font-size: 12px;
        line-height: 16.5px;
        &:nth-of-type(1) {
          color: #B4B4B6;
          margin-right: 3px;
        }
      }
    }
  }
  .optionlList {
    .list {
      color: #444444;
      font-size: 14px;
      padding: 12px 16px;
      display: flex;
      position: relative;
      justify-content: space-between;
      .ranking {
        color: #B4B4B6;
        font-size: 10px;
        right: 33px;
        position: absolute;
      }
      .icon {
        color: #808080;
        margin-top: 3px;
      }
    }
    .line-river-after {
      &:after {
        left: 16px;
        right: 16px;
      }
    }
  }
  .recommend {
    position: relative;
    /*padding-bottom: 25px;*/
    .recommendTitle {
      position: absolute;
      padding: 11px 16px 0;
      span {
        &:nth-of-type(1) {
          color: #444444;
          font-size: 16px;
          line-height: 22.5px;
          margin-top: 11px;
        }
      }
    }
  }

  .recommendList {
    width: 304.5px;
    margin: 0 auto 25px;
    padding: 10px 15px;
    background: #F7F8FA;
    border-radius: 8px;
    overflow: hidden;
    .avatar {
      width: 44px;
      height: 44px;
      float: left;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .personalInfo {
      float: left;
      margin-top: 3px;
      margin-left: 10px;
      .name {
        color: #565656;
        line-height: 20px;
        font-size: 14px;
      }
      .good {
        color: #B4B4B6;
        font-size: 12px;
        line-height: 16.5px;
      }
    }
    .speak {
      float: right;
      margin-top: 8.5px;
      span {
        color: #03AEF9;
        font-size: 12px;
        padding: 0 10px;
        line-height: 27px;
        display: inline-block;
      }
      .border-football {
        &:after {
          border-color: #03AEF9;
        }
      }
    }
  }

  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 90px;
    right: -129px;
    left: auto;
  }
</style>

<style>
  .recommenBanners .swiper-pagination-bullet {
    border-radius: 100px !important;
  }
  .recommenBanners .swiper-pagination-bullets .swiper-pagination-bullet-active {
    width: 10.5px;
  }
</style>
