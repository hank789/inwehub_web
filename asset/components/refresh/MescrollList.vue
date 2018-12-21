<template>
    <div class='mescrollListWrapper'>
      <div id='downloadTip' class='download-tip'>{{alertMsg}}</div>
      <mescroll-vue ref='mescroll' :down='config.down' :up='config.up' @init='mescrollInit'>
        <slot name="listHeader"></slot>

        <Empty v-if="nothing===1 && autoShowEmpty"
               :description="emptyDescription"
        ><div slot="emptyBottom"><slot name="emptyBottom"></slot></div></Empty>

        <slot name="emptyCustom" v-if="nothing === 1"></slot>

        <slot></slot>
      </mescroll-vue>
    </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import 'mescroll.js/mescroll.min.css'
  import { postRequest } from '../../utils/request'
  import Empty from '../../components/Empty.vue'

  export default {
    name: 'MescrollList',
    components: {
      MescrollVue,
      Empty
    },
    props: {
      isLoading: {
        type: Boolean,
        default: true
      },
      upcontentnomore: {
        type: String,
        default: '<p class="upwarp-nodata">无更多数据</p>'
      },
      emptyDescription: {  // 空描述
        type: String,
        default: '暂时还没有数据呀～'
      },
      isShowUpToRefreshDescription: {  // 是否显示上拉刷新的提示区域
        type: Boolean,
        default: true
      },
      api: {
        type: String,
        default: ''
      },
      prevOtherData: {
        type: Object,
        default: {}
      },
      nextOtherData: {
        type: Object,
        default: {}
      },
      autoShowEmpty: {
        type: Boolean,
        default: true
      },
      pageMode: {
        type: Boolean,
        default: false
      },
      isLoadingByRefresh: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      bottomId () {
        var length = this.list.length
        if (length) {
          return this.list[length - 1].id
        }
        return 0
      },
      nothing () {
        if (this.loading) {
          return -1
        }
        return this.list.length ? 0 : 1
      }
    },
    activated: function () {
      this.hideDownloadTip()
    },
    deactivated: function () {},
    data () {
      return {
        lastScrollTop: 0,
        lastBounce: null,
        currentPage: 0,
        loading: this.isLoading,
        list: [],
        alertMsg: '',
        mescroll: null,
        response: null,
        config: {
          down: {
            auto: false,
            offset: 60,
            htmlContent: '<p class="downwarp-progress"><p>',
            callback: this.downCallback
          },
          up: {
            auto: true,
            isBounce: false,
            htmlNodata: this.upcontentnomore,
            callback: this.upCallback
          }
        },
        localPrevOtherData: this.prevOtherData
      }
    },
    methods: {
      beforeRouteEnter () {
        console.log('mescrollList-beforeRouteEnter')
        if (this.mescroll) {
          // 滚动到之前列表的位置
          if (this.lastScrollTop) {
            this.mescroll.setScrollTop(this.lastScrollTop)
            setTimeout(() => { // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
              this.mescroll.setTopBtnFadeDuration(0) // 设置回到顶部按钮显示时无渐显动画
            }, 16)
          }
          // 恢复到之前设置的isBounce状态
          if (this.lastBounce != null) this.mescroll.setBounce(this.lastBounce)
          console.log('enter-lastScrollTop:' + this.lastScrollTop)
        }
      },
      beforeRouteLeave () {
        console.log('mescrollList-beforeRouteLeave')
        if (this.mescroll) {
          this.lastScrollTop = this.mescroll.getScrollTop() // 记录当前滚动条的位置
          this.mescroll.hideTopBtn(0) // 隐藏回到顶部按钮,无渐隐动画
          this.lastBounce = this.mescroll.optUp.isBounce // 记录当前是否禁止ios回弹
          this.mescroll.setBounce(true) // 允许bounce
          console.log('leave-lastScrollTop:' + this.lastScrollTop)
        }
      },
      showDownloadTip () {
        if (document.querySelector('#downloadTip')) {
          document.querySelector('#downloadTip').style.top = '0rem'
        }
      },
      hideDownloadTip () {
        if (document.querySelector('#downloadTip')) {
          document.querySelector('#downloadTip').style.top = '-31px'
        }
      },
      getResponse () {
        return this.response
      },
      refreshPageData (prevOtherData) {
        console.log('refreshList-refreshPageData fired')
        if (this.isLoadingByRefresh) {
          this.loading = 1
        }
        this.localPrevOtherData = prevOtherData
        this.getPrevList()
      },
      setPageData (prevOtherData) {
        this.loading = 1
        this.localPrevOtherData = prevOtherData
        this.getPrevList()
      },
      getPrevList () {
        this.list = []
        this.mescroll.resetUpScroll(true)
      },
      scrollToTop () {
        this.mescroll.scrollTo(0)
      },
      scrollTo (x, y, time) {
        this.mescroll.scrollTo(y, time)
      },
      scrollToBottom () {
        this.mescroll.scrollTo(99999)
      },
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      downCallback (mescroll) {
        mescroll.resetUpScroll(true)
      },
      upCallback (page, mescroll) {
        console.log('upcALLBACK')
        this.getData(page.num, page.size, (data) => {
          if (this.pageMode) {
            if (page.num === 1) {
              this.list = data
            } else {
              this.list = this.list.concat(data)
            }
            mescroll.endSuccess(data.length, !!this.response.data.data.next_page_url)
          } else {
            mescroll.endSuccess()
            this.list = data
          }
          if (page.num === 1) {
            if (this.alertMsg) {
              this.showDownloadTip()
            }
            setTimeout(() => {
              this.hideDownloadTip()
            }, 2000)
            this.$emit('prevSuccessCallback', this.list)
          } else {
            this.$emit('nextSuccessCallback', this.list)
          }
        }, () => {
          mescroll.endErr()
        })
      },
      getData (pageNum, pageSize, successCallback, errorCallback) {
        try {
          var param = {}
          if (pageNum === 0) {
            param = Object.assign(param, this.localPrevOtherData)
          } else {
            param.page = pageNum
            param = Object.assign(param, this.nextOtherData)
          }

          if (!this.pageMode) {
            param.bottom_id = this.bottomId
          }

          console.log(param)

          postRequest(this.api, param, false, {}, 0, false).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.toast(response.data.message)
              return
            }
            this.response = response

            var list = response.data.data

            this.alertMsg = response.data.data.alert_msg || ''

            if (this.pageMode) {
              list = response.data.data.data
              this.currentPage = response.data.data.current_page
            }

            successCallback && successCallback(list)
          })
        } catch (e) {
          console.dir(e)
          errorCallback && errorCallback()
        }
      }
    },
    watch: {
      list: function (newValue) {
        this.$emit('input', newValue)
      },
      prevOtherData: function (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.localPrevOtherData = newValue
          this.refreshPageData(newValue)
        }
      }
    }
  }
</script>

<style>
  /*旋转进度条*/
  .mescroll-downwarp .downwarp-progress,
  .mescroll-upwarp .upwarp-progress {
    width: 0.64rem;
    height: 0.64rem;
    border: none !important;
    margin: auto;
    background-image: url(../../statics/images/mescroll-progress.jpg);
    background-size: contain;
  }

  /*放大旋转动画*/
  .mescroll-rotate {
    -webkit-animation: animScale 0.6s linear, mescrollRotate 0.6s linear infinite;
    animation: animScale 0.6s linear, mescrollRotate 0.6s linear infinite;
  }

  @-webkit-keyframes animScale {
    0% {
      -webkit-transform: scale(1, 1) rotate(0deg)
    }
    50% {
      -webkit-transform: scale(1.2, 1.2) rotate(180deg)
    }
    100% {
      -webkit-transform: scale(1, 1) rotate(360deg)
    }
  }

  @keyframes animScale {
    0% {
      transform: scale(1, 1) rotate(0deg)
    }
    50% {
      transform: scale(1.2, 1.2) rotate(180deg)
    }
    100% {
      transform: scale(1, 1) rotate(360deg)
    }
  }

  /*下拉刷新回调的提示*/
  .download-tip {
    z-index: 9900;
    position: absolute;
    top: -31px;
    left: 0;
    width: 100%;
    height: 31px;
    line-height: 31px;
    font-size: 14px;
    text-align: center;
    background-color: #03AEF9;
    color: #FFFFFF;
    -webkit-transition: top 300ms;
    transition: top 300ms;
  }
</style>

<style scoped="scoped">
  .mescrollListWrapper{
    position: absolute;
    width:100%;
    overflow: hidden;
    top: 0;
    left:0;
  }
</style>
