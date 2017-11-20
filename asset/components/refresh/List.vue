<template>
  <div class="mui-scroll-wrapper" :class="{hideUpToRefreshDescription:!isShowUpToRefreshDescription}"
       id="refreshContainer" v-show="!loading">
    <div class="mui-scroll">
      <Empty v-if="nothing===1 && autoShowEmpty"></Empty>
      <div class="listWrapper" id="listWrapper" v-else>
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
        loading: true,
        currentPage: 0,
        list: []
      }
    },
    props: {
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
        default: '下拉可以刷新'
      },
      contentover: {
        type: String,
        default: '释放立即刷新'
      },
      downcontentrefresh: {
        type: String,
        default: '正在刷新...'
      },
      upcontentrefresh: {
        type: String,
        default: '正在加载...'
      },
      upcontentnomore: {
        type: String,
        default: '没有更多数据了'
      },

      pageMode: {
        type: Boolean,
        default: false
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
      refreshPageData (prevOtherData) {
        this.loading = 1
        this.prevOtherData = prevOtherData
        this.getPrevList()
      },
      setPageData (prevOtherData) {
        this.loading = 1
        this.prevOtherData = prevOtherData
        this.getPrevList()
      },
      scrollToTop () {
        if (window.mui('#refreshContainer')) {
          window.mui('#refreshContainer').pullRefresh().scrollTo(0, 0, 100)
        }
      },
      scrollToBottom () {
        if (window.mui('#refreshContainer')) {
          var posY = document.querySelector('#listWrapper').scrollHeight
          var obj = document.getElementById('refreshContainer')
          if (obj.scrollTo) {
            obj.scrollTo(0, posY)
          } else {
            obj.scrollTop = posY
          }
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

        param = Object.assign(param, this.prevOtherData)

        console.log(JSON.stringify(param))

        postRequest(this.api, param).then(response => {
          var code = response.data.code

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          var list = response.data.data

          if (this.pageMode) {
            list = response.data.data.data
            this.currentPage = response.data.data.current_page
          }

          if (list.length > 0) {
            this.list = list.concat(this.list)
          }

          this.loading = false

          if (list.length < 10) {
            if (window.mui('#refreshContainer').length) {
              window.mui('#refreshContainer').pullRefresh().endPulldownToRefresh(true)
              window.mui('#refreshContainer').pullRefresh().setStopped(true)
            }
          } else {
            if (window.mui('#refreshContainer').length) {
              window.mui('#refreshContainer').pullRefresh().endPulldownToRefresh()
            }
          }

          if (this.prevSuccessCallback) {
            this.prevSuccessCallback()
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
        param = Object.assign(param, this.prevOtherData)

        console.log(JSON.stringify(param))

        postRequest(this.api, param).then(response => {
          var code = response.data.code

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          var list = response.data.data

          if (this.pageMode) {
            list = response.data.data.data
            this.currentPage = response.data.data.current_page
          }

          if (list) {
            this.list = list
          }

          this.loading = false
          if (window.mui('#refreshContainer').length) {
            window.mui('#refreshContainer').pullRefresh().endPulldownToRefresh()

            setTimeout(() => {
              if (window.mui('#refreshContainer').length) {
                window.mui('#refreshContainer').pullRefresh().refresh(true)
              }
            }, 1000)
          }

          if (this.prevSuccessCallback) {
            this.prevSuccessCallback()
          }
        })
      },
      getDownLoadMoreModeNextList () {
        if (window.mui('#refreshContainer').length) {
          window.mui('#refreshContainer').pullRefresh().endPullupToRefresh(true)
        }
      },
      getNextList () {
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

        postRequest(this.api, param).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
          }

          var list = response.data.data

          if (this.pageMode) {
            list = response.data.data.data
            this.currentPage = response.data.data.current_page
          }

          if (list.length > 0) {
            this.list = this.list.concat(list)
          }

          if (list.length < 10) {
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
        })
      }
    },
    mounted () {
      window.mui.init({
        beforeback: goBack,
        pullRefresh: {
          container: this.$el,
          down: {
            auto: true,   // 可选,默认false.首次加载自动下拉刷新一次
            contentdown: this.contentdown ? this.contentdown : '下拉可以刷新',  // 可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: this.contentover ? this.contentover : '释放立即刷新',  // 可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: this.downcontentrefresh ? this.downcontentrefresh : '正在刷新...',  // 可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: this.downLoadMoreMode ? this.getDownLoadMoreModePrevList : this.getPrevList   // 必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          },
          up: {
            contentrefresh: this.upcontentrefresh ? this.upcontentrefresh : '正在加载...',
            contentnomore: this.upcontentnomore ? this.upcontentnomore : '没有更多数据了',   // 可选，请求完毕若没有更多数据时显示的提醒内容；
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
