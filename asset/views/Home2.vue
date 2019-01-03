<template>
  <div>
    <div class="mui-content">

      <div class="container-control-logoAndTabsAndSearch">
        <div class="topSearchWrapper" @tap.stop.prevent="$router.pushPlus('/searchAll','list-detail-page-three')">
          <div class="searchFrame">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
            <span>搜产品、问答、圈子、内容</span>
          </div>
        </div>
        <div class="addIcon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tianjia"></use>
          </svg>
        </div>
      </div>

      <div class="container-tags-home container-tags-home-margin">
        <div id="container-tags-home-content">
          <div class="container-allTags" @tap.stop.prevent="getAllRecommend()">
            全部
          </div>
          <div class="container-tabLabels">
            <swiper ref="inTags" :options="swiperOption" class="container-upload-images">
              <swiper-slide v-for="(tag, index) in 15" :key="index" class="tagLabel">
                  <span class="tab"
                        @tap.stop.prevent="selectTag(tag)">标签</span>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>

      <div class="container-wrapper">
        <div class="container-list" v-for="(item, index) in 5" :key="index">
          <div class="pointLine">
            <span class="splitCircle"></span>
            <span class="splitLine"></span>
          </div>
          <div class="content">
            <div class="top-time">
              <span class="time">09:00</span>
              <i class="splitCircle"></i>
              <span class="linkURL">goodreads.com</span>
            </div>
            <div class="middle">
              <div class="left">
                <div class="title font-family-medium text-line-2">高通骁龙855AI算力飙升三倍，华为你怎么看？</div>
                <div class="heatWrapper border-football">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-huo"></use>
                  </svg>
                  <span>2</span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tianjia"></use>
                  </svg>
                </div>
              </div>
              <div class="right">
                <div class="articleImg"><img src="../../static/images/uicon.jpg" alt=""></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    data () {
      return {
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 0,
          freeMode: true
        }
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #FFFFFF;}
  .container-control-logoAndTabsAndSearch .topSearchWrapper .searchFrame {
    width: 310px;}
  .tagLabel {
    width: auto !important;}

  .splitCircle {
    display: inline-block;
    position: relative;
    top: -2px;
    border-radius: 50%;
    width: 2px;
    height: 2px;
    background: #B4B4B6;
  }
  .container-wrapper {
    margin-top: 15px;
    .container-list {
      padding: 0 16px 0 14px;
      position: relative;
      .pointLine {
        display: inline-block;
        position: absolute;
        top: 0;
        .splitCircle {
          width: 4px;
          height: 4px;
          z-index: 100;
          background: #444444;
        }
        .splitLine {
          width: 1px;
          height: 113px;
          display: inline-block;
          background: #DCDCDC;
          position: absolute;
          top: 13px;
          left: 1px;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
      }
      .content {
        width: 330px;
        margin-left: 17.5px;
        display: inline-block;
      }
      .top-time {
        span {
          color: #B4B4B6;
          font-size: 11px;
          line-height: 11px;
        }
      }
      .middle {
        display: flex;
        margin-bottom: 20px;
        .left {
          display: inline-block;
          .title {
            color: #444444;
            font-size: 16px;
            line-height: 23px;
            padding-right: 13.5px;
          }
          .heatWrapper {
            height: 19px;
            margin-top: 9px;
            width: max-content;
            padding: 0 5px;
            span {
              color: #C8C8C8;
              font-size: 11px;
              margin-right: 4px;
              position: relative;
              top: -1px;
              left: -2px;
            }
            .icon {
              position: relative;
              top: -2px;
              &:nth-of-type(1) {
                color: #FA4975;
                font-size: 8.5px;
              }
              &:nth-of-type(2) {
                color: #808080;
                font-size: 9px;
              }
            }
          }
          .border-football {
            &:after {
              border-radius: 8px;
            }
          }
        }
        .right {
          display: inline-block;
          .articleImg {
            width: 97px;
            height: 71px;
            border-radius: 4px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
</style>
