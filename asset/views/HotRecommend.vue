<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">今日热点推荐</h1>
    </header>

    <div class="mui-content">

      <div class="topWrapper">
        <div class="bagImg">
          <img src="../statics/images/hotTopImg@3x.png">
        </div>
        <div class="dateWrapper">
          <div class="date">{{ dateShow }}</div>
        </div>
      </div>

      <div class="domainWrapper">
        <div class="contentWrapper">

          <div class="newsList" v-for="(item, index) in list" :key="index" @tap.stop.prevent="goArticle(item)">
            <span class="indexNum">{{ index+1 }}.</span>
            <div class="middle">
              <div class="left">
                <div class="title font-family-medium text-line-2">{{ item.title }}</div>
                <div class="heatWrapper border-football" @tap.stop.prevent="addHeat(item, index)">
                  <div class="addOne" v-if="item.startAnimation">
                    <i></i>
                    <span>+{{startAnimationNum}}</span>
                  </div>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-huo"></use>
                  </svg>
                  <span>{{ item.rate }}</span>
                  <svg class="icon heatAddIcon" aria-hidden="true">
                    <use xlink:href="#icon-tianjia"></use>
                  </svg>
                </div>
              </div>
              <div class="right">
                <div class="articleImg">
                  <ImageView :src="item.img" width="97" :isLazyload="true" :saveToLocal="true"></ImageView>
                </div>
              </div>
            </div>
          </div>

          <div class="bottomLine"></div>
          <div class="circular leftC"></div>
          <div class="circular rightC"></div>

          <div class="footerMenu">
            <div class="left">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dingyue-"></use>
              </svg>
              <div class="hotRecommend">
                <img src="../statics/images/hotrecommend@3x.png" alt="">
              </div>
            </div>
            <div class="right">
              <div class="oneLine"></div>
              <div class="menu" @tap.stop.prevent="appPush">
                <span class="iconCircular one" :class="isOpenNotification === 1 ? 'grey':''">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiazaiapp"></use>
                  </svg>
                </span>
                <div class="text">APP推送</div>
              </div>
              <div class="menu" @tap.stop.prvent="alertEmailSubscribe">
                <span class="iconCircular two">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-youxiang"></use>
                  </svg>
                </span>
                <div class="text">邮件</div>
              </div>
              <div class="menu" @tap.stop.prevent="subscribeGZH">
                <span class="iconCircular three" :class="wechat_subscribe === 1 ? 'grey':''">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-weixinfuwuhao"></use>
                  </svg>
                </span>
                <div class="text">微信服务号</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomActions
      ref="BottomActions"
      v-model="activeItem"
      :regions="regions"
      @clickDelete="clickDelete"
      @startAnimation="startAnimationEvent"
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
  import { postRequest } from '../utils/request'
  import { goThirdPartyArticle } from '../utils/webview'
  import { openAppUrlByUrl, checkPermission as checkPermissionMy, toSettingSystem } from '../utils/plus'
  import { alertHotOpenNotice, alertSubscribeGZH, alertEmailSubscribe } from '../utils/dialogList'
  import { timeToHumanDay } from '../utils/time'
  import BottomActions from '../components/BottomActions'
  import { getHomeData } from '../utils/home'
  import { deleteItem } from '../utils/discover'
  import PageMore from '../components/PageMore.vue'
  import Vue from 'vue'
  import { iconMenusClickedItem } from '../utils/feed'
  import { getHomeDetail } from '../utils/shareTemplate'
  export default {
    data () {
      return {
        list: {},
        date: '',
        dateTime: '',
        dateShow: '',
        activeItem: {},
        activeItemIndex: 0,
        regions: [],
        startAnimationNum: '',
        shareOption: {},
        shareIconMenus: [],
        itemOptionsObj: {},
        isOpenNotification: -1, // -1， 未知, 1 yes 0 no
        AppPush: 0,
        wechat_subscribe: -1
      }
    },
    components: {
      BottomActions,
      PageMore
    },
    methods: {
      appPush () {
        if (this.isOpenNotification !== 1) {
          alertHotOpenNotice(this, (num) => {
            if (num === 0) {
              toSettingSystem('NOTIFITION')
            }
          })
        }
      },
      checkPermissionSelf () {
        console.log('checkPermissionSelfs哈哈哈哈')
        checkPermissionMy('NOTIFITION', () => {
          this.isOpenNotification = 1
          this.AppPush = 1
          this.getNotification()
        }, (result) => {
          this.isOpenNotification = 0
          this.AppPush = 0
          // this.closeAll()
        })
      },
      getNotification () {
        postRequest(`notification/push/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.AppPush = response.data.data.push_daily_subscribe
          this.wechat_subscribe = response.data.data.wechat_daily_subscribe
        })
      },
      updateNotification () {
        postRequest(`notification/push/update`, {
          push_daily_subscribe: this.AppPush ? 1 : 0
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.AppPush = response.data.data.push_daily_subscribe
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
        this.shareIconMenus = [] // getIconMenus(item)
        this.itemOptionsObj = item
        this.shareOption = getHomeDetail(
          '/c/' + item.category_id + '/' + item.slug, // item.link_url,
          item.title,
          item.img
        )
        this.shareOption.targetId = item.slug
        this.shareOption.targetType = 'submission'
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
        iconMenusClickedItem(this, this.itemOptionsObj, item, () => {})
      },
      shareFail () {

      },
      shareSuccess () {
        this.activeItem.share_number++
        this.startAnimationEvent(3)
      },
      startAnimationEvent (num) {
        this.startAnimationNum = num
        this.activeItem.startAnimation = 1
        this.activeItem.rate += num
        Vue.set(this.list, this.activeListIndex, this.activeItem)

        setTimeout(() => {
          this.activeItem.startAnimation = 0
          Vue.set(this.list, this.activeListIndex, this.activeItem)
        }, 2500)
      },
      addHeat (item, itemIndex) {
        this.activeItem = item
        this.activeItemIndex = itemIndex
        this.$refs.BottomActions.show()
      },
      clickDelete () {
        this.$refs.BottomActions.cancelShare()
        deleteItem(this.activeItem.id, (context) => {
          this.lists.splice(this.activeItemIndex, 1)
        })
      },
      refreshPageData () {
        this.date = this.$route.params.date
        if (this.date) {
          this.dateTime = new Date(this.date.replace(/-/g, '/')).getTime() / 1000

          var day = timeToHumanDay(this.dateTime)
          var dates = this.date.split('-')
          this.dateShow = dates[1] + '月' + dates[2] + '日' + day

          this.getDailyReport()

          getHomeData((data) => {
            this.regions = data.regions
          })
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
      getDailyReport () {
        postRequest(`dailyReport`, {date: this.date}).then(response => {
          this.list = response.data.data
        })
      },
      subscribeGZH () {
        alertSubscribeGZH(this)
      },
      alertEmailSubscribe () {
        alertEmailSubscribe(this)
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
    },
    mounted () {
      this.getNotification()
      this.checkPermissionSelf()
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #6AD2FF;
  }
  .topWrapper {
    position: relative;
    .bagImg {
      width: 100%;
      height: 254px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .dateWrapper {
      position: absolute;
      top: 126px;
      left: 50%;
      transform: translateX(-50%);
      .date {
        height: 16px;
        padding: 0 5px;
        color: #ffffff;
        font-size: 12px;
        line-height: 16px;
        border-radius: 4px;
        background: #024FDE;
      }
    }

  }

  .domainWrapper {
    padding: 0 8px 8px;
    .contentWrapper {
      padding: 15px 17px 0;
      border-radius: 20px;
      background: #ffffff;
      margin-top: -56px;
      position: relative;
      .newsList {
        padding: 15px 0;
        .indexNum {
          font-size: 10px;
          color: #808080;
          line-height: 11px;
          font-family:HelveticaNeue-Medium;
        }
        .middle {
          display: flex;
          justify-content: space-between;
          .left {
            .title {
              color: #444444;
              font-size: 16px;
              line-height: 23px;
            }
            .heatWrapper {
              height: 0.506rem;
              margin-top: 0.24rem;
              width: max-content;
              padding: 0 0.666rem 0 0.213rem;
              position: relative;
              .addOne {
                height: 0.56rem;
                position: absolute;
                top: -0.746rem;
                left: 0.426rem;
                opacity: 0;
                transition-delay: 1.5s;
                -moz-transition-delay: 1.5s;
                -webkit-transition-delay: 1.5s; /* Safari 和 Chrome */
                -o-transition-delay: 1.5s;
                animation: addone 0.8s;
                -moz-animation: addone 0.8s; /* Firefox */
                -webkit-animation: addone 0.8s; /* Safari and Chrome */
                -o-animation: addone 0.8s; /* Opera */
                i {
                  width: 0;
                  height: 0;
                  border-left: 0.08rem solid transparent;
                  border-right: 0.08rem solid transparent;
                  border-top: 0.08rem solid #FA4975;
                  position: absolute;
                  top: 0.5rem;
                  left: 0.16rem;
                }
                span {
                  width: 0.613rem;
                  height: 0.48rem;
                  line-height: 0.48rem;
                  color: #FFFFFF;
                  font-size: 0.293rem;
                  text-align: center;
                  border-radius: 0.106rem;
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
                  font-size: 0.3rem;
                }
                &:nth-of-type(2) {
                  color: #808080;
                  font-size: 0.24rem;
                  top: 0.133rem;
                  position: absolute !important;
                  right: 0.213rem !important;
                }
              }
            }
            .border-football {
              &:after {
                border-radius: 0.213rem;
                border-color: #DCDCDC;
              }
            }
          }
          .right {
            margin-left: 0.48rem;
            margin-right: 0.106rem;
            .articleImg {
              width: 2.586rem;
              height: 1.893rem;
              border-radius: 0.106rem;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
        }
      }
    }
    .bottomLine {
      width: 100%;
      margin: 15px 0 20px;
      border: 0.5px dashed #DCDCDC;
    }
    .circular {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #82d1f8;
      position: absolute;
      bottom: 104px;
      &.leftC {
        left: -8px;
      }
      &.rightC {
        right: -8px;
      }
    }
    .footerMenu {
      display: flex;
      padding: 0 5px 20px;
      justify-content: space-between;
      .left {
        width: 46px;
        text-align: center;
        .icon {
          color: #C8C8C8;
          font-size: 21px;
          text-align: center;
        }
        .hotRecommend {
          width: 46px;
          height: 26px;
          margin-top: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .right {
        display: flex;
        .oneLine {
          width: 0.026rem;
          height: 1.173rem;
          background: #DCDCDC;
          margin-right: 0.4rem;
          position: relative;
          top: 0.266rem;
        }
        .menu {
          padding: 0 15px;
          text-align: center;
          &:last-child {
            padding-right: 0;
          }
          .one {
            background: #03AEF9;
          }
          .two {
            background: #5B84DE;
          }
          .three {
            background: #77C819;
          }
          .iconCircular {
            width: 1.173rem;
            height: 1.173rem;
            color: #FFFFFF;
            font-size: 23px;
            text-align: center;
            line-height: 1.173rem;
            border-radius: 50%;
            display: inline-block;
            &.grey {
              background: #F7F8FA;
              color: #808080;
            }
          }
          .text {
            color: #808080;
            font-size: 0.293rem;
            text-align: center;
            margin-top: 0.133rem;
          }
        }
      }
    }
  }

  @keyframes addone
  {
    0% {
      top: -0.746rem;
      opacity: 1;
    }
    50% {
      top: -0.746rem;
      opacity: 5;
    }
    100% {
      top: -1.2rem;
      opacity: 0;
    }
  }
  @-moz-keyframes addone /* Firefox */
  {
    0% {
      top: -0.746rem;
      opacity: 1;
    }
    50% {
      top: -0.746rem;
      opacity: 5;
    }
    100% {
      top: -1.2rem;
      opacity: 0;
    }
  }
  @-webkit-keyframes addone /* Safari and Chrome */
  {
    0% {
      top: -0.746rem;
      opacity: 1;
    }
    50% {
      top: -0.746rem;
      opacity: 5;
    }
    100% {
      top: -1.2rem;
      opacity: 0;
    }
  }
  @-o-keyframes addone /* Opera */
  {
    0% {
      top: -0.746rem;
      opacity: 1;
    }
    50% {
      top: -0.746rem;
      opacity: 5;
    }
    100% {
      top: -1.2rem;
      opacity: 0;
    }
  }
</style>
