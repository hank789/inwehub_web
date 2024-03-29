<template>
  <div class="mui-scroll-wrapper" :class="{hideUpToRefreshDescription:!isShowUpToRefreshDescription}"
       id="refreshContainer">
    <div class="mui-scroll">
      <slot name="listHeader"></slot>
      <Empty v-if="nothing===1 && autoShowEmpty"
        :description="emptyDescription"
      ><div slot="emptyBottom"><slot name="emptyBottom"></slot></div></Empty>
      <div class="listWrapper" id="listWrapper" v-show="!loading" v-else>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

  import { postRequest } from '../../utils/request'
  import Empty from '../../components/Empty.vue'
  import { goBack } from '../../utils/webview'

  export default {
    data () {
      return {
        loading: this.isLoading,
        currentPage: 0,
        perPage: 10,
        response: null,
        disableLoadMore: false,
        list: [],
        localPrevOtherData: this.prevOtherData
      }
    },
    props: {
      isLoading: {
        type: Boolean,
        default: true
      },
      emptyDescription: {  // 空描述
        type: String,
        default: '暂时还没有数据呀～'
      },
      isShowUpToRefreshDescription: {  // 是否显示上拉刷新的提示区域
        type: Boolean,
        default: true
      },
      downLoadMoreMode: {  // 下来加载更多模式
        type: Boolean,
        default: false
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
      prevSuccessCallback: {
        type: Function,
        default: null
      },
      autoShowEmpty: {
        type: Boolean,
        default: true
      },
      nextSuccessCallback: {
        type: Function,
        default: null
      },
      contentdown: {
        type: String,
        default: '下拉刷新'
      },
      contentover: {
        type: String,
        default: '释放刷新'
      },
      downcontentrefresh: {
        type: String,
        default: '刷新中'
      },
      upcontentrefresh: {
        type: String,
        default: '正在载入'
      },
      upcontentnomore: {
        type: String,
        default: '无更多数据'
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
    components: {
      Empty
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
    methods: {
      getResponse () {
        return this.response
      },
      refreshPageData (prevOtherData) {
        console.log('refreshList-refreshPageData fired')
        if (this.isLoadingByRefresh) {
          this.loading = 1
        }

        this.localPrevOtherData = prevOtherData

        if (this.downLoadMoreMode) {
          this.currentPage = 0
          this.list = []
          this.getDownLoadMoreModePrevList()
        } else {
          this.getPrevList()
        }
      },
      setPageData (prevOtherData) {
        this.loading = 1
        this.localPrevOtherData = prevOtherData
        this.getPrevList()
      },
      scrollToTop () {
        if (window.mui('#refreshContainer')) {
          window.mui('#refreshContainer').pullRefresh().scrollTo(0, 0, 100)
        }
      },
      scrollTo (x, y, time) {
        if (window.mui('#refreshContainer')) {
          window.mui('#refreshContainer').pullRefresh().scrollTo(x, y, time)
        }
      },
      scrollToBottom () {
        if (window.mui(this.$el)) {
          window.mui(this.$el).scroll().reLayout()
          window.mui(this.$el).scroll().scrollToBottom(500) // 毫秒

//          var posY = document.querySelector('#listWrapper').scrollHeight
//          var obj = document.getElementById('refreshContainer')
//          if (obj.scrollTo) {
//            obj.scrollTo(0, posY)
//          } else {
//            obj.scrollTop = posY
//          }
        }
      },
      getDownLoadMoreModePrevList () {
        var param = {}
        if (this.pageMode) {
          param = {
            page: this.currentPage + 1
          }
        } else {
          param = {
            bottom_id: this.bottomId
          }
        }

        param = Object.assign(param, this.localPrevOtherData)

        console.log('getDownLoadMoreModePrevList 额外的参数:' + JSON.stringify(param))

        postRequest(this.api, param, false).then(response => {
          var code = response.data.code

          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.response = response.data

          var list = response.data.data

          if (this.pageMode) {
            list = response.data.data.data
            this.currentPage = response.data.data.current_page
          }

          if (list.length > 0) {
            this.list = list.concat(this.list)
          }

          this.loading = false

          if (response.data.data.per_page) {
            this.perPage = response.data.data.per_page
          }

          if (list.length < this.perPage) {
            if (window.mui('#refreshContainer').length && window.mui('#refreshContainer').pullRefresh()) {
              window.mui('#refreshContainer').pullRefresh().endPulldownToRefresh(true)
              window.mui('#refreshContainer').pullRefresh().setStopped(true)
            }
          } else {
            if (window.mui('#refreshContainer').length && window.mui('#refreshContainer').pullRefresh()) {
              window.mui('#refreshContainer').pullRefresh().endPulldownToRefresh()
            }
          }

          if (this.prevSuccessCallback) {
            this.prevSuccessCallback(this.list)
          }
        })
      },
      getPrevList () {
        var param = {}

        if (this.pageMode) {
          param = {
            page: 1
          }
        } else {
          param = {}
        }
        param = Object.assign(param, this.localPrevOtherData)

        console.log('getPrevList 额外的参数:' + JSON.stringify(param))

        postRequest(this.api, param, false, {}, 0, false).then(response => {
          var code = response.data.code

          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.response = response.data

          var list = response.data.data

          if (this.pageMode) {
            list = response.data.data.data
            this.currentPage = response.data.data.current_page
          }

          if (response.data.data.per_page) {
            this.perPage = response.data.data.per_page
          }

//          if (list.length < this.perPage) {
//            this.disableLoadMore = true
//          }

          if (list) {
            this.list = list
          }

          this.loading = false
          if (window.mui('#refreshContainer').length) {
            setTimeout(() => {
              if (window.mui('#refreshContainer').pullRefresh()) {
                window.mui('#refreshContainer').pullRefresh().endPulldownToRefresh()
              }
              if (window.mui('#refreshContainer').length && window.mui('#refreshContainer').pullRefresh()) {
                window.mui('#refreshContainer').pullRefresh().refresh(true)
              }
            }, 1000)
          }

          if (this.prevSuccessCallback) {
            this.prevSuccessCallback(this.list)
          }
        }).finally(() => {
          this.loading = false
          if (window.mui('#refreshContainer').length) {
            setTimeout(() => {
              if (window.mui('#refreshContainer').pullRefresh()) {
                window.mui('#refreshContainer').pullRefresh().endPulldownToRefresh()
              }
              if (window.mui('#refreshContainer').length && window.mui('#refreshContainer').pullRefresh()) {
                window.mui('#refreshContainer').pullRefresh().refresh(true)
              }
            }, 1000)
          }
        })
      },
      getDownLoadMoreModeNextList () {
        if (window.mui('#refreshContainer').length) {
          window.mui('#refreshContainer').pullRefresh().endPullupToRefresh(true)
        }
      },
      getNextList () {
        if (this.disableLoadMore) {
          if (window.mui('#refreshContainer').length) {
            window.mui('#refreshContainer').pullRefresh().endPullupToRefresh(true)
          }
          return
        }

        var param = {}
        if (this.pageMode) {
          param = {
            page: this.currentPage + 1
          }
        } else {
          param = {
            bottom_id: this.bottomId
          }
        }

        param = Object.assign(param, this.nextOtherData)

        postRequest(this.api, param, false, {}, 0, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            if (window.mui('#refreshContainer').length) {
              window.mui('#refreshContainer').pullRefresh().endPullupToRefresh(true)
            }
            return
          }

          this.response = response.data

          var list = response.data.data

          if (this.pageMode) {
            list = response.data.data.data
            this.currentPage = response.data.data.current_page
          }

          if (list.length > 0) {
            this.list = this.list.concat(list)
          }

          if (response.data.data.per_page) {
            this.perPage = response.data.data.per_page
          }

          var isHaveNext = true
          if (response.data.data.next_page_url === null) {
            isHaveNext = false
          }

          if (!isHaveNext) {
            if (window.mui('#refreshContainer').length) {
              window.mui('#refreshContainer').pullRefresh().endPullupToRefresh(true)
            }
          } else {
            if (window.mui('#refreshContainer').length) {
              window.mui('#refreshContainer').pullRefresh().endPullupToRefresh(false)
            }
          }

          this.loading = false

          if (this.nextSuccessCallback) {
            this.nextSuccessCallback()
          }
        }).finally(() => {
          if (window.mui('#refreshContainer').length) {
            window.mui('#refreshContainer').pullRefresh().endPullupToRefresh(false)
          }
        })
      }
    },
    mounted () {
      window.mui.init({
        beforeback: goBack,
        pullRefresh: {
          container: this.$el,
          deceleration: 0.001,  // 默认值 0.0006, 系数越小滑动越灵敏
          down: {
            auto: true,   // 可选,默认false.首次加载自动下拉刷新一次
            contentdown: this.contentdown ? this.contentdown : '下拉刷新',  // 可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: this.contentover ? this.contentover : '释放刷新',  // 可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: this.downcontentrefresh ? this.downcontentrefresh : '正在刷新...',  // 可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: this.downLoadMoreMode ? this.getDownLoadMoreModePrevList : this.getPrevList   // 必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          },
          up: {
            contentrefresh: this.upcontentrefresh ? this.upcontentrefresh : '正在载入',
            contentnomore: this.upcontentnomore ? this.upcontentnomore : '无更多数据',   // 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: this.downLoadMoreMode ? this.getDownLoadMoreModeNextList : this.getNextList
          }
        }
      })
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

<style scoped="scoped">
  .listWrapper {
  }
</style>
