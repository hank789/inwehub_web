<template>
  <div>
    <div class="mui-content">

      <!-- <div class="container-tags-home container-tags-home-margin isFiexd">
        <div id="">
          <div class="container-allTags" @tap.stop.prevent="getAllRecommend()">
            全部
          </div>
          <div class="container-tabLabels">
            <swiper ref="inTags" :options="swiperOption" class="container-upload-images">
              <swiper-slide v-for="(tag, index) in regions" :key="index" class="tagLabel">
                    <span class="tab"
                          @tap.stop.prevent="selectTag(tag)">{{ tag.text }}</span>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div> -->

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

      <div class="container-tags-home container-tags-home-margin" id="container-tags-home-content">
        <div>
          <div class="container-allTags " :class="type === 0 ? 'active' : ''" @tap.stop.prevent="getAllRecommend()">
            全部<i class="" :class="type === 0 ? 'activeLine':''"></i>
          </div>
          <div class="container-tabLabels">
            <swiper ref="inTags" :options="swiperOption" class="container-upload-images">
              <swiper-slide v-for="(tag, index) in regions" :key="index" class="tagLabel">
                    <span class="tab" :class="type === index+1 ? 'active' : ''"
                          @tap.stop.prevent="selectTag(index + 1)">{{ tag.text }}</span>
                <i class="" :class="type === index+1 ? 'activeLine' : ''" ></i>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>

      <SwiperMescrollList
        ref="RefreshList"
        class="refreshListWrapper"
        :api="'readList'"
        :listDataConfig="listDataConfig"
        v-model="lists"
        @curNavIndexChange="curNavIndexChange"
      >

        <template v-for="(listData, listDataIndex) in listDataConfig">
          <div :slot="'swiperList-' + listDataIndex">
            <div v-for="(item, itemIndex) in lists[listDataIndex]" :key="itemIndex">

              <div class="container-wrapper">
                <div class="dateWrapper" v-if="showData(item,itemIndex, listDataIndex)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-riliyouse"></use>
                  </svg>
                  <span>{{ timeToHumanText(item.created_at) }}</span>
                </div>
                <div class="container-list">
                  <div class="pointLine" v-if="type === 0">
                    <span class="splitCircle"></span>
                    <span class="splitLine" v-if="itemIndex !== lists[listDataIndex].length - 1"></span>
                  </div>
                  <div class="pointLine" v-if="type !== 0">
                    <span class="number">{{ itemIndex+1 }}.</span>
                  </div>
                  <div class="content">
                    <div class="top-time">
                      <span class="time">{{ item.created_at.split(' ')[1] }}</span>
                      <i class="splitCircle"></i>
                      <span class="linkURL">{{ item.domain }}</span>
                    </div>
                    <div class="middle">
                      <div class="left">
                        <div class="title font-family-medium text-line-2">{{ item.title }}</div>
                        <div class="heatWrapper border-football" @tap.stop.prevent="addHeat">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-huo"></use>
                          </svg>
                          <span>{{ item.rate }}</span>
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tianjia"></use>
                          </svg>
                        </div>
                      </div>
                      <div class="right">
                        <div class="articleImg"><img :src="item.img" alt=""></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </SwiperMescrollList>

    </div>
  </div>
</template>

<script>
  import SwiperMescrollList from '../components/refresh/SwiperMescrollList.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import localEvent from '../stores/localStorage'
  import { postRequest } from '../utils/request'
  import { timeToHumanText, getTimestampByDateStr } from '../utils/time'
  import { alertHomeHeat } from '../utils/dialogList'

  export default {
    data () {
      return {
        loading: true,
        list: [],
        lists: [],
        regions: [],
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 0,
          freeMode: true
        },
        type: 0
      }
    },
    components: {
      SwiperMescrollList,
      swiper,
      swiperSlide
    },
    computed: {
      listDataConfig () {
        var rs = this.regions.map(item => {
          return {
            api: 'readList',
            data: {
              tagFilter: item.value
            },
            autoShow: false
          }
        })
        rs.unshift({
          api: 'readList',
          data: {
            tagFilter: ''
          },
          autoShow: true
        })
        return rs
      }
    },
    activated: function () {
      this.refreshPageData()
    },
    methods: {
      addHeat () {
        alertHomeHeat(this)
      },
      timeToHumanText (time) {
        return timeToHumanText(getTimestampByDateStr(time))
      },
      showData (item, index, listDataIndex) {
        if (index >= 0) {
          let currentData = item.created_at.split(' ')[0]
          let prevData = this.lists[listDataIndex][index - 1] && this.lists[listDataIndex][index - 1].created_at.split(' ')[0]
          return currentData !== prevData
        }
      },
      selectTag (index) {
        this.$refs.RefreshList.slideTo(index)
      },
      getAllRecommend () {
        this.type = 0
        this.listDataConfig = [
          {
            api: 'readList',
            data: {
              tagFilter: ''
            }
          }
        ]
      },
      curNavIndexChange (index) {
        this.type = index
      },
      refreshPageData () {
        this.getHomeTags()
        this.showData()
      },
      getHomeTags () {
        postRequest(`home`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.regions = response.data.data.regions
        })
      },
      prevSuccessCallback (data) {
        localEvent.setLocalItem('HomeDataList', data)
        this.$refs.RefreshList.mescroll.optUp.onScroll = function (mescroll, y, isUp) {
          console.log('up --> onScroll 列表当前滚动的距离 y = ' + y + ', 是否向上滑动 isUp = ' + isUp)
          if (y >= 44) {
            document.querySelector('.isFiexd').classList.add('showTags')
          } else {
            document.querySelector('.isFiexd').classList.remove('showTags')
          }
        }
      }
    },
    mounted () {
      this.refreshPageData()
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
  .isFiexd {
    position: relative;
    z-index: 999;
    display: none;
    &.showTags {
      display: block;
    }
  }
  .container-wrapper {
    /*margin-top: 15px;*/
    .dateWrapper {
      padding-left: 16px;
      height: 21px;
      display: inline-block;
      line-height: 21px;
      margin-bottom: 18px;
      &.active {
        /*width: 103px;*/
        padding-right: 10px;
        background: #03AEF9;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        box-shadow:0px 5px 10px -2px rgba(205,215,220,1);
        span {
          color: #FFFFFF;
          position: relative;
          top: -1px;
        }
      }
      .icon {
        font-size: 15px;
      }
      span {
        color: #444444;
        font-size: 12px;
      }
    }
    .container-list {
      padding: 0 16px 0 14px;
      position: relative;
      .pointLine {
        display: inline-block;
        position: absolute;
        top: 0;
        .number {
          color: #444444;
          font-size: 11px;
        }
        .splitCircle {
          width: 4px;
          height: 4px;
          z-index: 100;
          background: #444444;
        }
        .splitLine {
          width: 1px;
          height: 122px;
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
        /*display: flex;*/
        overflow: hidden;
        margin-bottom: 20px;
        .left {
          width: 192px;
          display: inline-block;
          .title {
            color: #444444;
            font-size: 16px;
            line-height: 23px;
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
          float: right;
          margin-right: 4px;
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

  .refreshListWrapper{
    top: 147px !important;
    bottom: 50px !important;
  }
</style>
