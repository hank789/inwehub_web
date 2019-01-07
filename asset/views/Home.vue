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
        <div class="addIcon" @tap.stop.prevent="jumpToDiscoverAdd">
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

      <div class="leftTopFixed fixedData"></div>

      <SwiperMescrollList
        ref="RefreshList"
        class="refreshListWrapper"
        :api="'readList'"
        :listDataConfig="listDataConfig"
        v-model="lists"
        @curNavIndexChange="curNavIndexChange"
        @listScroll="listScroll"
      >

        <template v-for="(listData, listDataIndex) in listDataConfig">
          <div :slot="'swiperList-' + listDataIndex">
            <div v-for="(item, itemIndex) in lists[listDataIndex]" :key="itemIndex">

              <div class="container-wrapper" @tap.stop.prevent="goArticle(item)">
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
                        <div class="heatWrapper border-football" @tap.stop.prevent="addHeat(item)">
                          <div class="addOne" v-if="item.isFollowed">
                            <i></i>
                            <span>+1</span>
                          </div>
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

    <BottomActions
      ref="BottomActions"
      :regions="regions"
      :iconMenu="iconMenus"
      @clickedItem="detailMenuIcon"
      @clickDelete="clickDelete"
      @choiceItem="choiceItem"
    >
    </BottomActions>

    <PageMore
      ref="share"
      :shareOption="shareOption"
      :hideShareBtn="true"
      :iconMenu="shareIconMenus"
      @success="shareSuccess"
      @fail="shareFail"
      @clickedItem="iconMenusClickedItem"
    ></PageMore>
  </div>
</template>

<script>
  import SwiperMescrollList from '../components/refresh/SwiperMescrollList.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { postRequest } from '../utils/request'
  import { timeToHumanText, getTimestampByDateStr } from '../utils/time'
  import { saveLocationInfo } from '../utils/allPlatform'
  import userAbility from '../utils/userAbility'
  import { goThirdPartyArticle } from '../utils/webview'
  import { openAppUrlByUrl } from '../utils/plus'
  import BottomActions from '../components/BottomActions'
  import { upvote, deleteItem } from '../utils/discover'
  import PageMore from '../components/PageMore.vue'
  import { getIconMenus, iconMenusClickedItem } from '../utils/feed'
  import { getTextDiscoverDetail } from '../utils/shareTemplate'

  export default {
    data () {
      return {
        loading: true,
        lists: [],
        regions: [],
        shareOption: {},
        itemOptionsObj: {},
        shareIconMenus: [
          {
            icon: '#icon-shoucangdilantongyi',
            text: '收藏',
            isBookMark: 0
          },
          {
            icon: '#icon-jubao',
            text: '举报'
          }
        ],
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 0,
          freeMode: true
        },
        type: 0,
        isShowAddOne: false,
        isFollowed: 0,
        isUpvoted: '',
        item: {}
      }
    },
    components: {
      SwiperMescrollList,
      swiper,
      swiperSlide,
      BottomActions,
      PageMore
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
      },
      iconMenus () {
        return [
          {
            icon: '#icon-shoucang-xiao',
            text: '分享'
          },
          {
            icon: '#icon-pinglun',
            text: '评论'
          },
          {
            icon: '#icon-zan',
            text: this.isUpvoted ? '已赞' : '赞',
            isUpvoted: this.isUpvoted
          }
        ]
      }
    },
    activated: function () {},
    methods: {
      choiceItem (item) {
        var tags = item.value
        postRequest(`article/regionOperator`, {
          id: this.item.id,
          tags: tags
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
        })
      },
      showItemMore (item) {
        item.feed_type = 16
        item.user = {
          id: 0
        }
        item.feed = {
          is_bookmark: item.is_upvoted,
          submission_id: item.id
        }
        this.shareIconMenus = getIconMenus(item)
        this.itemOptionsObj = item
        this.shareOption = getTextDiscoverDetail(
          '/c/' + item.category_id + '/' + item.slug,
          item.title,
          item.img,
          '',
          '精选推荐'
        )
        this.$refs.share.share()
      },
      iconMenusClickedItem (item) {
        this.itemOptionsObj.feed_type = 16
        this.itemOptionsObj.user = {
          id: 0
        }
        this.itemOptionsObj.feed = {
          is_bookmark: this.itemOptionsObj.is_upvoted,
          submission_id: this.itemOptionsObj.id
        }
        iconMenusClickedItem(this, this.itemOptionsObj, item, () => {
          this.shareIconMenus = getIconMenus(this.itemOptionsObj)
        })
      },
      shareFail () {

      },
      shareSuccess () {

      },
      clickDelete () {
        this.$refs.BottomActions.cancelShare()
        deleteItem(this.item.id)
      },
      detailMenuIcon (item) {
        switch (item.text) {
          case '评论':
            this.$router.pushPlus('/comment/' + this.item.category_id + '/' + this.item.slug + '/' + this.item.id)
            break
          case '赞':
            upvote(this, this.item.id, (response) => {
              this.isUpvoted = 1
              window.mui.toast(response.data.data.tip)
              setTimeout(() => {
                this.$refs.BottomActions.cancelShare()
                this.$set(this.item, 'isFollowed', this.item.isFollowed ? !this.item.isFollowed : true)
                this.item.rate ++
              }, 2000)
            }, (response) => {
              this.isUpvoted = 0
              window.mui.toast(response.data.data.tip)
              setTimeout(() => {
                this.$refs.BottomActions.cancelShare()
              }, 2000)
            })
            break
          case '已赞':
            upvote(this, this.item.id, (response) => {
              this.isUpvoted = 1
              window.mui.toast(response.data.data.tip)
              setTimeout(() => {
                this.$refs.BottomActions.cancelShare()
              }, 2000)
            }, (response) => {
              this.isUpvoted = 0
              window.mui.toast(response.data.data.tip)
              setTimeout(() => {
                this.$refs.BottomActions.cancelShare()
                this.item.rate --
              }, 2000)
            })
            break
          case '分享':
            this.$refs.ShareBtn.share()
            break
        }
      },
      goArticle: function (detail) {
        if (detail.link_url.indexOf(process.env.H5_ROOT) === 0) {
          openAppUrlByUrl(detail.link_url)
        } else {
          goThirdPartyArticle(
            detail.link_url,
            detail.id,
            detail.title,
            '/c/' + detail.category_id + '/' + detail.slug,
            detail.img
          )
        }
      },
      listScroll (index, y, isUp) {
        var navWarp = document.querySelector('.leftTopFixed')
        if (this.$refs.RefreshList.$refs.RefreshList[index].mescroll.os.ios) {
          if (y < 10) {
            navWarp.classList.remove('leftTopFixedShow')
            navWarp.classList.remove('nav-sticky')
          } else {
            navWarp.classList.add('leftTopFixedShow')
            navWarp.classList.add('nav-sticky')
          }
        } else {
          if (y >= 10) {
            navWarp.classList.add('leftTopFixedShow')
            navWarp.classList.add('nav-fixed')
          } else {
            navWarp.classList.remove('leftTopFixedShow')
            navWarp.classList.remove('nav-fixed')
          }
        }

        var bmpPosition = ''
        var positionValues = this.$refs.RefreshList.positionValues[index]
        for (var i = 0; i < positionValues.length; i++) {
          if (positionValues[i].offsetTop <= y) {
            bmpPosition = positionValues[i].text
          }
        }
        navWarp.innerHTML = "<svg class='icon' aria-hidden='true'><use xlink:href='#icon-rili'></use></svg>" + bmpPosition
        console.log(bmpPosition)
      },
      toDetail (item) {
        switch (item.type) {
          case 'link':
          case 'text':
          case 'article':
            this.$router.pushPlus('/c/' + item.category_id + '/' + item.slug)
            break
          default:
        }
      },
      jumpToDiscoverAdd () {
        userAbility.jumpToDiscoverAdd(this, '?from=home')
      },
      addHeat (item) {
        this.$refs.BottomActions.show()
        this.item = item
        this.isUpvoted = item.is_upvoted
        console.log(item.title)
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
        console.log('indexTAG:' + index)
        this.$refs.inTags.swiper.slideTo(index - 1, 1000)
        this.$refs.RefreshList.slideTo(index)
      },
      getAllRecommend () {
        this.type = 0
        this.$refs.RefreshList.slideTo(0)
      },
      curNavIndexChange (index) {
        this.type = index
        this.$refs.inTags.swiper.slideTo(index - 1, 1000)
      },
      refreshPageData () {
        postRequest(`home`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.regions = response.data.data.regions
        })
      }
    },
    mounted () {
      this.refreshPageData()
      saveLocationInfo()
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #FFFFFF;}
  .container-control-logoAndTabsAndSearch .topSearchWrapper .searchFrame {
    width: 8.266rem;}
  .tagLabel {
    width: auto !important;}

  .splitCircle {
    display: inline-block;
    position: relative;
    top: -0.053rem;
    border-radius: 50%;
    width: 0.053rem;
    height: 0.053rem;
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
    /*margin-top: 0.4rem;*/
    .dateWrapper {
      padding-left: 0.426rem;
      height: 0.56rem;
      display: inline-block;
      line-height: 0.56rem;
      margin-bottom: 0.48rem;

      .icon {
        font-size: 0.4rem;
      }
      span {
        color: #444444;
        font-size: 0.32rem;
      }
    }
    .container-list {
      padding: 0 0.426rem 0 0.373rem;
      position: relative;
      .pointLine {
        display: inline-block;
        position: absolute;
        top: 0;
        .number {
          color: #444444;
          font-size: 0.293rem;
        }
        .splitCircle {
          width: 0.106rem;
          height: 0.106rem;
          z-index: 100;
          background: #444444;
        }
        .splitLine {
          width: 0.026rem;
          height: 3.253rem;
          display: inline-block;
          background: #DCDCDC;
          position: absolute;
          top: 0.346rem;
          left: 0.026rem;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
      }
      .content {
        width: 8.8rem;
        margin-left: 0.466rem;
        display: inline-block;
      }
      .top-time {
        span {
          color: #B4B4B6;
          font-size: 0.293rem;
          line-height: 0.293rem;
        }
      }
      .middle {
        /*display: flex;*/
        /*overflow: hidden;*/
        height: 71px;
        margin-bottom: 0.533rem;
        .left {
          width: 5.12rem;
          display: inline-block;
          .title {
            color: #444444;
            font-size: 0.426rem;
            line-height: 0.613rem;
          }
          .heatWrapper {
            height: 0.506rem;
            margin-top: 0.24rem;
            width: max-content;
            padding: 0 0.133rem;
            position: relative;
            .addOne {
              height: 21px;
              position: absolute;
              top: -28px;
              left: 16px;
              opacity: 0;
              animation: addone 3s;
              -moz-animation: addone 3s; /* Firefox */
              -webkit-animation: addone 3s; /* Safari and Chrome */
              -o-animation: addone 3s; /* Opera */
              i {
                width: 0;
                height: 0;
                border-left: 3px solid transparent;
                border-right: 3px solid transparent;
                border-top: 3px solid #FA4975;
                position: absolute;
                top: 20px;
                left: 6px;
              }
              span {
                width: 23px;
                height: 18px;
                line-height: 18px;
                color: #FFFFFF;
                font-size: 11px;
                text-align: center;
                border-radius: 4px;
                background: #FA4975;
                display: inline-block;
              }
            }
            span {
              color: #C8C8C8;
              font-size: 0.293rem;
              margin-right: 0.106rem;
              position: relative;
              top: -0.026rem;
              left: -0.053rem;
            }
            .icon {
              position: relative;
              top: -0.053rem;
              &:nth-of-type(1) {
                color: #FA4975;
                font-size: 0.226rem;
              }
              &:nth-of-type(2) {
                color: #808080;
                font-size: 0.24rem;
              }
            }
          }
          .border-football {
            &:after {
              border-radius: 0.213rem;
            }
          }
        }
        .right {
          float: right;
          margin-right: 0.106rem;
          .articleImg {
            width: 2.586rem;
            height: 1.893rem;
            border-radius: 0.106rem;
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
    top: 2.08rem !important;
    bottom: 1.333rem !important;
  }

  .nav-sticky {
    z-index: 9999;
    position: -webkit-sticky;
    position: sticky;
    top: 0.373rem;
  }

  .nav-fixed{
    z-index: 9999;
    position: absolute;
    top: 2.08rem !important;
    left: 0;
    width: 100%;
  }
  .fixedData {
    color: #FFFFFF;
    padding-left: 0.426rem;
    padding-right: 0.266rem;
    background: #03AEF9;
    font-size: 0.32rem;
    display: none;
    border-top-right-radius: 1.333rem;
    border-bottom-right-radius: 1.333rem;
    box-shadow:0rem 0.133rem 0.266rem -0.053rem rgba(205,215,220,1);
    .icon {
      font-size: 0.426rem;
    }
  }

  .leftTopFixedShow{
    display: inline-block;
  }


  @keyframes addone
  {
    from {
      top: -28px;
      opacity: 0;
    }
    to {
      top: -45px;
      opacity: 1;
    }
  }

  @-moz-keyframes addone /* Firefox */
  {
    from {
      top: -28px;
      opacity: 0;
    }
    to {
      top: -45px;
      opacity: 1;
    }
  }

  @-webkit-keyframes addone /* Safari and Chrome */
  {
    from {
      top: -28px;
      opacity: 0;
    }
    to {
      top: -45px;
      opacity: 1;
    }
  }

  @-o-keyframes addone /* Opera */
  {
    from {
      top: -28px;
      opacity: 0;
    }
    to {
      top: -45px;
      opacity: 1;
    }
  }
</style>
