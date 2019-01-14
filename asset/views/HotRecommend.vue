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
          <div class="date">01月08日星期二</div>
        </div>
      </div>

      <div class="domainWrapper">
        <div class="contentWrapper">

          <div class="newsList" v-for="(item, index) in list" :key="index" @tap.stop.prevent="goArticle(item)">
            <span class="indexNum">{{ index+1 }}.</span>
            <div class="middle">
              <div class="left">
                <div class="title font-family-medium text-line-2">{{ item.title }}</div>
                <div class="heatWrapper border-football">
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
                <span class="iconCircular one">
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
                <span class="iconCircular three">
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
  </div>

</template>

<script>
  import { postRequest } from '../utils/request'
  import { goThirdPartyArticle } from '../utils/webview'
  import { openAppUrlByUrl } from '../utils/plus'
  import { alertHotOpenNotice, alertSubscribeGZH, alertEmailSubscribe } from '../utils/dialogList'
  export default {
    data () {
      return {
        list: {}
      }
    },
    methods: {
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
        postRequest(`dailyReport`, {date: '2019-01-09'}).then(response => {
          this.list = response.data.data
        })
      },
      appPush () {
        alertHotOpenNotice(this)
      },
      subscribeGZH () {
        alertSubscribeGZH(this)
      },
      alertEmailSubscribe () {
        alertEmailSubscribe(this)
      }
    },
    mounted () {
      this.getDailyReport()
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
</style>
