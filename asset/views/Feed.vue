<template>
  <div>
    <div id="home-content" class="mui-content">

      <div class="container-control-logoAndTabsAndSearch">
        <svg class="icon logoIcon" aria-hidden="true">
          <use xlink:href="#icon-logowenzi"></use>
        </svg><span class="splitCircle"></span>

        <div class="topSearchWrapper" @tap.stop.prevent="$router.pushPlus('/searchSubmission','list-detail-page-three')">
          <div class="searchFrame">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
            <span>搜内容、问答、圈子</span>
          </div>
        </div>

        <!--<div class="logoAndTabsAndSearchTabs">-->
          <!--&lt;!&ndash;<div class="tab active">关注</div>&ndash;&gt;-->
          <!--<div class="tab" @tap.stop.prevent="toHome()">热点</div>-->
          <!--<div class="tab active" @tap.stop.prevent="toDiscover()">关注</div>-->
        <!--</div>-->
        <!--<svg class="icon searchIcon" aria-hidden="true"  @tap.stop.prevent="$router.pushPlus('/searchSubmission','list-detail-page-three')">-->
          <!--<use xlink:href="#icon-sousuo"></use>-->
        <!--</svg>-->
      </div>

      <div class="line-river-after line-river-after-top"></div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="true"
        :list="list"
        :emptyDescription="emptyDescription"
        :autoShowEmpty="false"
        class="listWrapper"
      >
        <div class="component-feed-item-guide feedListNo" v-if="list.length === 0">
          <div class="feed-IconImg">
            <img src="../statics/images/feed@3x.png" alt="">
          </div>
          <div class="desc">关注你感兴趣的人和圈子，了解他们的最新动态</div>
          <div class="buttonWrapper" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone?from=feed')">
            <button>去看看</button>
          </div>
        </div>

        <div v-for="(item, index) in list" :key="item.id">

         <!-- <div class="component-feed-item-guide" v-if="index === 3 && search_type === 2">
            <div class="feed-IconImg">
              <img src="../statics/images/feed@3x.png" alt="">
            </div>
            <div class="desc">关注你感兴趣的人和圈子，了解他们的最新动态</div>
            <div class="buttonWrapper" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone?from=feed')">
              <button>去看看</button>
            </div>
            <div class="line-river-after line-river-after-top"></div>
          </div> -->

          <div class="component-recommendFollow" v-if="index === 3 && search_type === 2">
            <div class="recommendFollowWrapper">
              <div class="title font-family-medium">值得关注的人</div>
              <swiper ref="inTags" :options="swiperOption">
                <swiper-slide v-for="(recommendFollow, recommendFollowIndex) in recommendFollowList" :key="recommendFollowIndex" :tagId="recommendFollow.value">

                  <div class="recommendFollowList">
                    <div class="recommendListWrapper">
                      <div class="delRecommend" @tap.stop.prevent="delRecommend(recommendFollow)">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-times--"></use>
                        </svg>
                      </div>
                      <div class="avatar" @tap.stop.prevent="toResume(recommendFollow.uuid)">
                        <ImageView :src="recommendFollow.avatar_url" width="50" height="50" :isLazyload="true" :key="'feed_avatar_' + recommendFollow.uuid" ></ImageView>
                      </div>
                      <div class="userName font-family-medium text-line-1">{{ recommendFollow.name }}</div>
                      <div class="commonFriend">{{ recommendFollow.description }}</div>
                    </div>
                    <div class="follow" @tap.stop.prevent="collectProfessor(recommendFollow)">
                      <div class="text" :class="recommendFollow.is_followed ? 'active' : ''">{{ recommendFollow.is_followed ? '已关注' : '关注' }}</div>
                    </div>
                  </div>

                </swiper-slide>
                <swiper-slide>
                  <div class="recommendFollowList">
                    <div class="recommendListWrapper">
                      <div class="feed-IconImg">
                        <img src="../statics/images/feed@3x.png" alt="">
                      </div>
                      <div class="desc" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone?from=feed')">看看更多<br>相关的人和圈子</div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>

              </div>
            <div class="line-river-after line-river-after-top"></div>
          </div>

          <FeedItem
            :item="item"
            :key="'feedItem_' + item.id"
            @showItemMore="showItemMore"
          ></FeedItem>
        </div>

      </RefreshList>

      <div class="goEditWrapper" @tap.stop.prevent="$router.pushPlus('/discover/add')">
        <div class="editIcon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fabu"></use>
          </svg>
        </div>
      </div>

    </div>

    <PageMore
      ref="share"
      :shareOption="shareOption"
      :hideShareBtn="true"
      :iconMenu="iconMenus"
      @success="shareSuccess"
      @fail="shareFail"
      @clickedItem="iconMenusClickedItem"
    ></PageMore>
  </div>
</template>
<script>
  import RefreshList from '../components/refresh/List.vue'
  import HomeSearch from '../components/search/Home'
  import FeedItem from '../components/Feed.vue'
  import PageMore from '../components/PageMore.vue'
  import { postRequest } from '../utils/request'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { getIconMenus, iconMenusClickedItem } from '../utils/feed'

  const Feed = {
    data: () => ({
      search_type: 2, // 1:关注,2:全部,3:问答,4:分享,5:他的动态,6:推荐,默认2
      emptyDescription: '暂无内容',
      unread_count: 0,
      contact_id: '',
      list: [],
      shareOption: {},
      itemOptionsObj: {},
      iconMenus: [],
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true
      },
      recommendFollowList: []
    }),
    created () {

    },
    updated () {
    },
    components: {
      RefreshList,
      HomeSearch,
      FeedItem,
      PageMore,
      swiperSlide,
      swiper
    },
    activated: function () {
      this.refreshPageData()
    },
    mounted () {
      // 左滑
      document.getElementById('home-content').addEventListener('swipeleft', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle >= 160) {
          this.$router.replace('/home')
        }
      })
      // 右滑
      document.getElementById('home-content').addEventListener('swiperight', (e) => {
        var angle = Math.abs(e.detail.angle)
        if (angle <= 20) {
          this.$router.replace('/home')
        }
      })

      this.getRecommendFollow()
    },
    computed: {
      prevOtherData () {
        return {search_type: this.search_type}
      },
      nextOtherData () {
        return {search_type: this.search_type}
      }
    },
    methods: {
      toResume (uuid) {
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      delRecommend (item) {
        postRequest(`follow/ignoreRecommendUser`, {user_id: item.id}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.recommendFollowList.splice(item, 1)
          window.mui.toast('操作成功！')
        })
      },
      collectProfessor (item) {
        postRequest('follow/user',
          {id: item.id}
        ).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          item.is_followed = !item.is_followed
          window.mui.toast(response.data.data.tip)
        })
      },
      getRecommendFollow () {
        postRequest(`follow/getRecommendUsers`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.recommendFollowList = response.data.data
        })
      },
      toHome () {
        this.$router.replace('home')
      },
      showItemMore (shareOption, item) {
        this.iconMenus = getIconMenus(item)
        this.itemOptionsObj = item
        this.shareOption = shareOption
        this.$refs.share.share()
      },
      shareFail () {

      },
      shareSuccess () {

      },
      iconMenusClickedItem (item) {
        iconMenusClickedItem(this, this.itemOptionsObj, item)
      },
      refreshPageData () {
        if (this.$route.query.refresh) {
          this.$refs.RefreshList.refreshPageData(this.prevOtherData)
        }
      },
      messagecountchange (obj) {
        if (obj.contact_id) {
          this.contact_id = obj.contact_id
          this.unread_count = obj.unread_count
        }
      },
      switchSearchType (filter) {
        this.search_type = filter
      }
    }
  }
  export default Feed
</script>

<style lang="less" scoped>
  .mui-content{
    background: #fff;
  }
  .listWrapper {
    top: 1.173rem;
    bottom: 50px; /* px不转换 */
  }
  .component-recommendFollow {
    padding: 0.293rem 0 0rem;
    .line-river-after:after {
      left: 0.426rem;
      right: 0.426rem;
    }
    .swiper-slide {
      width: auto !important;
      padding: 0.293rem 0 0.426rem;
      &:first-child {
        .recommendFollowList {
          margin-left: 0.426rem;
        }
      }
      &:last-child {
         .recommendFollowList {
           margin-right: 0.426rem;
         }
       }
    }
    .recommendFollowWrapper {
      /*padding: 0 0.426rem;*/
      .title {
        color: #444444;
        font-size: 0.426rem;
        line-height: 0.6rem;
        padding: 0 0.426rem;
      }
      .recommendFollowList {
        width: 3.413rem;
        height: 4.546rem;
        padding: 0 0.24rem;
        position: relative;
        background: #FFFFFF;
        margin: 0 0.133rem;
        box-shadow:0rem 0rem 0.346rem 0rem #F2F4F7;
        .recommendListWrapper {
          padding: 0.4rem 0 0;
          position: relative;
          text-align: center;
          .delRecommend {
            position: absolute;
            right: 0;
            top: 0.266rem;
            .icon {
              font-size: 0.213rem;
              color: #DCDCDC;
            }
          }
          .feed-IconImg {
            width: 1.893rem;
            height: 1.173rem;
            margin: 0.666rem auto 0.186rem;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .desc {
            color: #03AEF9;
            font-size: 0.293rem;
            line-height: 0.4rem;
            margin-bottom: 0.88rem;
          }
          .avatar {
            width: 1.333rem;
            height: 1.333rem;
            margin: 0 auto;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .userName {
            color: #444444;
            font-size: 0.373rem;
            line-height: 0.533rem;
            padding: 0.186rem 0 0.04rem;
          }
          .commonFriend {
            color: #B4B4B6;
            font-size: 0.293rem;
            line-height: 0.4rem;
          }
        }
        .follow {
          width: 2.933rem;
          position: absolute;
          bottom: 0.4rem;
          text-align: center;
          .text {
            height: 0.72rem;
            font-size: 0.32rem;
            padding: 0 0.4rem;
            line-height: 0.72rem;
            background: #03AEF9;
            color: #FFFFFF;
            border-radius: 2.666rem;
            display: inline-block;
            &.active {
              background: #DCDCDC;
              color: #B4B4B6;
            }
          }
        }
      }
    }
  }
  .component-feed-item-guide {
    padding-top: 0.8rem;
    &.feedListNo {
      margin-top: 2.666rem;
      button {
        margin-top: 0.453rem;
      }
    }
    .line-river-after {
      margin-top: 0.8rem;
      &:after {
        left: 0.426rem;
        right: 0.426rem;
      }
    }
    .feed-IconImg {
      width: 3.2rem;
      height: 1.973rem;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .newLink {
    margin-top: 0.24rem;
    // padding: 0 0.426rem;
    .newLinkBox {
      margin-top: 0.266rem;
      padding: 0.4rem 0.4rem 0.293rem;
      background: #F7F8FA;
      border-radius: 0.106rem;
      .container-image {
        margin-top: 0;
        margin-bottom: 0.213rem;
      }
      img {
        // width: 8.373rem;
        // height: 2.986rem;
        border-radius: 0.106rem;
      }
      .linkContent {
        font-size: 0.373rem;
        color: #808080;
        // line-height: 0.533rem;
      }
      .link {
        font-size: 0.32rem;
        color: #B4B4B6;
      }
    }
  }
  .feedResult {
    .noResult {
      padding-bottom: 0;
    }
    .noContent {
      /*padding-top: 3.2rem;*/
      .buttonWrapper {
        margin-bottom: 0.4rem;
      }
    }
  }
</style>
