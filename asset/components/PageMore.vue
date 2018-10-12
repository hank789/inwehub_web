<template>
  <div>
    <a class="mui-icon shareBtn mui-pull-right" @tap.stop.prevent="shareBtnClick()" v-if="!hideShareBtn">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-gengduo1"></use>
      </svg>
    </a>

    <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
      <div class="title">
        分享到
      </div>
      <div class="more">
        <div class="single" @tap.stop.prevent="shareToHaoyou()">
          <img src="../statics/images/wechat_2x.png"/>
          <span>微信</span>
        </div>
        <div class="single" @tap.stop.prevent="shareToPengyouQuan()">
          <img src="../statics/images/pengyouquan.png"/>
          <span>朋友圈</span>
        </div>
        <div class="single" @tap.stop.prevent="shareToChat()">
          <img src="../statics/images/sendFriend@2x.png"/>
          <span>私信</span>
        </div>
      </div>

      <div class="line-river-after line-river-after-height"></div>

      <div v-if="iconMenu.length">
        <div class="more twoLevel">
          <div class="delete single" @tap.stop.prevent="clickItem(item)"  v-for="(item, index) in iconMenu" :key="index">
          <span class="iconBorder">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.icon"></use>
            </svg>
          </span>
            <span class="text">{{item.text}}</span>
          </div>
        </div>
        <div class="line-river-after line-river-after-height"></div>
      </div>
      <div class="cancel" @tap.stop.prevent="cancelShare()"><span class="font-family-medium">取消</span></div>
    </div>

    <div id="shareShowWrapper" class="mui-popover mui-popover-action mui-popover-top"
         @tap.stop.prevent="toggleShareNav()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-dianzheli"></use>
      </svg>
    </div>

  </div>
</template>

<script type="text/javascript">

  import Share from '../utils/share'
  import { postRequest } from '../utils/request'
  import { setClipboardText } from '../utils/plus'
  import localEvent from '../stores/localStorage'

  export default {
    data () {
      return {
      }
    },
    components: {},
    props: {
      hideShareBtn: {
        type: Boolean,
        default: false
      },
      iconMenu: {
        type: Array,
        default: () => {
          return []
        }
      },
      shareOption: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    watch: {
      'link' (newVal, oldVal) {
        this.bindShare()
      }
    },
    mounted () {
      if (this.link) {
        this.bindShare()
      }
    },
    methods: {
      toggleShareNav () {
        window.mui('#shareShowWrapper').popover('toggle')
      },
      clickItem (item) {
        this.$emit('clickedItem', item)
      },
      cancelShare () {
        window.mui('#shareWrapper').popover('toggle')
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:cancel',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      shareToCopyLink () {
        setClipboardText(this.link)
        window.mui.toast('已复制')
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:copyLink',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      shareToChat () {
        window.mui('#shareWrapper').popover('toggle')
        this.hide()
        this.$router.pushPlus('/collectUser?from=all')
        // 保存链接
        localEvent.setLocalItem('share', this.link)
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:shareToChat',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      bindShare () {
        if (this.$router.currentRoute.meta.wechatHideHeader && window.mui.os.wechat) {
          this.hideShareBtn = true
        }
        var currentUser = localEvent.getLocalItem('UserInfo')
        var fromUser = 0
        if (currentUser.user_id) {
          fromUser = currentUser.user_id
        }
        var shareParams = 'isShare=1&fromUser=' + fromUser
        if (this.link.indexOf('?') < 0) {
          shareParams = '?' + shareParams
        } else {
          shareParams = '&' + shareParams
        }
        var data = {
          title: this.shareOption.title,
          link: this.shareOption.link + shareParams,
          content: this.shareOption.content,
          imageUrl: this.shareOption.imageUrl,
          thumbUrl: this.shareOption.thumbUrl,
          pyqTitle: this.shareOption.pyqTitle,
          pyqContent: this.shareOption.pyqContent
        }

        Share.bindShare(
          this,
          data,
          this.successCallback,
          this.failCallback
        )
      },
      shareToHaoyou () {
        if (this.sendHaoyou) {
          this.sendHaoyou()
        }

        if (window.mui.os.plus) {
          window.mui('#shareWrapper').popover('hide')
        } else {
          window.mui('#shareWrapper').popover('hide')
          window.mui('#shareShowWrapper').popover('toggle')
        }
        this.hide()
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:shareToHaoyou',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      shareToPengyouQuan () {
        if (this.sendPengYouQuan) {
          this.sendPengYouQuan()
        }
        if (window.mui.os.plus) {
          window.mui('#shareWrapper').popover('hide')
        } else {
          window.mui('#shareWrapper').popover('hide')
          window.mui('#shareShowWrapper').popover('toggle')
        }
        this.hide()
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:shareToPengyouQuan',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      successCallback () {
        this.$emit('success')

        postRequest(`share/wechat/success`, {
          'target': this.shareOption.link,
          'title': this.shareOption.title,
          'target_type': this.shareOption.targetType,
          'target_id': this.shareOption.targetId
        }).then(response => {})

        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:success',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      failCallback (error) {
        this.$emit('fail', error)
        console.log(JSON.stringify(error))
        window.mui.toast('分享失败')
      },
      shareBtnClick () {
        this.$emit('shareBtnClick')
        this.share()
      },
      share () {
        if (this.link) {
          this.bindShare()
        }

        setTimeout(() => {
          window.mui('#shareWrapper').popover('toggle')
          window.mui('body').on('tap', '.mui-backdrop', () => {
            this.hide()
          })
        }, 150)

        this.$emit('share')
        if (process.env.NODE_ENV === 'production' && window.mixpanel.track) {
          // mixpanel
          window.mixpanel.track(
            'inwehub:share:show',
            {
              'app': 'inwehub',
              'user_device': window.getUserAppDevice(),
              'page': this.$route.fullPath,
              'page_name': this.$route.name,
              'page_title': this.$route.meta.title,
              'referrer_page': ''
            }
          )
        }
      },
      hide () {
        this.$emit('hide')
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .line-river-after-height {
    height: 0;
  }
  .shareBtn {
    position: fixed;
    right: 0.266rem;
    top: 0.266rem;
    z-index: 11;
    color: #3c3e44;
    font-size: 0.56rem;
  }

  .resumeWrapper .shareBtn {
    position: absolute;
    top: 0.64rem !important;
    font-size: 0.586rem;
    right: 0.826rem;
    color: #808080;
  }

  .mui-content {
    padding: 5.333rem;
    text-align: center;
  }

  .shareWrapper {
    text-align: left;
    .title {
      background: #FFF;
      text-align: center;
      font-size: 0.293rem;
      padding: 0.453rem 0 0;
      position: relative;
      color: #B4B4B6;
      line-height: 0.4rem;
      border-top-left-radius: 0.48rem;
      border-top-right-radius: 0.48rem;
    }
    .more {
      background: #fff;
      padding: 0.346rem 0.453rem 0.106rem;
      font-size: 0;
      .single {
        height: 1.866rem;
        display: inline-block;
        img {
          width: 1.173rem;
          height: 1.146rem;
          margin: 0 0.32rem;
        }
        span {
          display: block;
          font-size: 0.32rem;
          color: #808080;
          line-height: 0.426rem;
          text-align: center;
          margin-top: -0.08rem;
        }
      }
    }
    .more.twoLevel {
      padding: 0.4rem 0.453rem 0.106rem;
      .delete {
        .iconBorder {
          width: 1.173rem;
          height: 1.173rem;
          margin: 0 0.32rem;
          line-height: 1.306rem;
          text-align: center;
          display: inline-block;
          border-radius: 0.213rem;
          border: 0.026rem solid #DCDCDC;
          .icon {
            font-size: 0.586rem;
            color: #C8C8C8;
          }
        }
      }
      .text {
        display: block;
        font-size: 0.32rem;
        color: #808080;
        line-height: 0.426rem;
        text-align: center;
        margin-top: 0.213rem;
      }
    }
  }

  #shareShowWrapper {
    position: absolute;
    right: 0;
    top: 0;
    .icon {
      color: #fff;
      position: absolute;
      right: 0.4rem;
      top: 0.266rem;
      font-size: 1.866rem;
    }
  }
  .cancel {
    height: 1.386rem;
    line-height: 1.386rem;
    background: #FFF;
    text-align: center;
    span {
      color: #444444;
      font-size: 0.426rem;
    }
  }


</style>
