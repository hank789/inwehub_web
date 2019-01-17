<template>
  <div id="hotHomeHeat" class="mui-popover mui-popover-action mui-popover-bottom">
    <div class="heat-wrapper">
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
                <span class="iconCircular one" :class="isOpenAppPush === 1 ? 'grey':''">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiazaiapp"></use>
                  </svg>
                </span>
            <div class="text">{{ isOpenAppPush ? '已订阅':'APP推送' }}</div>
          </div>
          <div class="menu" @tap.stop.prvent="subscribeEmail">
                <span class="iconCircular two":class="isOpenEmailPush ? 'grey':''">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-youxiang"></use>
                  </svg>
                </span>
            <div class="text">{{ isOpenEmailPush ? '已订阅':'邮件' }}</div>
          </div>
          <div class="menu" @tap.stop.prevent="subscribeGZH">
              <span class="iconCircular three" :class="isOpenWeChatPush ? 'grey' : ''">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-weixinfuwuhao"></use>
                </svg>
              </span>
            <div class="text">{{ isOpenWeChatPush ? '已订阅':'微信服务号' }}</div>
          </div>
        </div>
      </div>

      <div class="cancelW" @tap.stop.prevent="cancelShare">
        <div class="bot"></div>
        <span>取消</span>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { postRequest } from '../utils/request'
  import { setHotRecommendAppPushStatus, setHotRecommendEmailStatus, setHotRecommendWechatStatus } from '../utils/push'
  import { alertSubscribeGZH, alertEmailSubscribe, alertEditEmailSubscribe } from '../utils/dialogList'

  export default {
    data () {
      return {
        isOpenAppPush: -1,
        isOpenEmailPush: -1,
        isOpenWeChatPush: -1,
        emailText: ''
      }
    },
    props: {
    },
    computed: {
    },
    created () {
      this.refreshPageData()
    },
    watch: {
    },
    methods: {
      subscribeEmail () {
        if (!this.isOpenEmailPush) {
          if (!this.emailText) {
            this.cancelShare()
            alertEmailSubscribe(this, (num, text) => {
              if (num === 0) {
                this.emailText = text
                setHotRecommendEmailStatus(1, this.emailText, () => {
                  window.mui.toast('订阅成功，可前往设置进行订阅管理')
                }, () => {
                  this.isOpenEmailPush = 0
                })
              }
            })
            return
          }
        }
      },
      subscribeGZH () {
        setHotRecommendWechatStatus(this.isOpenWeChatPush, () => {
          if (!this.isOpenWeChatPush) {
            this.cancelShare()
            alertSubscribeGZH(this)
          } else {
            this.isOpenWeChatPush = 0
            window.mui.toast('已关闭“微信订阅”')
          }
        }, () => {
          this.isOpenWeChatPush = 0
        })
      },
      getNotification () {
        postRequest(`notification/push/info`, {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          var res = response.data.data

          this.isOpenAppPush = res.push_daily_subscribe
          this.emailText = res.email_daily_subscribe
          this.isOpenWeChatPush = res.wechat_daily_subscribe
          this.isOpenEmailPush = res.email_daily_subscribe
          if (this.emailText) {
            this.isOpenEmailPush = 1
          }
        })
      },
      refreshPageData () {
        this.getNotification()
      },
      cancelShare () {
        window.mui('#hotHomeHeat').popover('toggle')
        this.hide()
      },
      hide () {},
      show () {
        setTimeout(() => {
          window.mui('#hotHomeHeat').popover('toggle')
          window.mui('body').on('tap', '.mui-backdrop', () => {
            this.hide()
          })
        }, 150)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .heat-wrapper {
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 999;
    padding-top: 0.533rem;
    background: #ffffff;
    border-top-left-radius: 0.48rem;
    border-top-right-radius: 0.48rem;
    .cancelW {
      position: relative;
      text-align: center;
      .bot {
        top: 0 !important;
      }
      span {
        color: #444444;
        font-family: PingFangSC-Medium;
        font-size: 0.426rem;
        text-align: center;
        line-height: 1.386rem;
      }
    }
  }
  .footerMenu {
    display: flex;
    padding: 0 5px 20px;
    justify-content: space-between;
    .left {
      width: 46px;
      text-align: center;
      margin-left: 30px;
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
          padding-right: 25px;
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
</style>
