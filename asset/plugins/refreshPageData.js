import { hideHeaderHandler } from '../utils/wechat'
import { autoHeight } from '../utils/statusBar'
import { scrollToTop } from '../utils/scrollToTop'
import EventObj from '../utils/event'
import { setWebviewNewUrl } from '../utils/plus'
import { showWebview } from '../utils/webview'

export default {
  install: function (Vue, options) {
    Vue.mixin({
      activated () {
        if (!this.$el || this.$el.id !== 'router-view') {
          return
        }

        console.log('global activated函数 被调用')

        autoHeight(this.$el)
        hideHeaderHandler(this, 'activated')
        scrollToTop(this.$el)
      },
      mounted () {
        if (!this.$el || this.$el.id !== 'router-view') {
          return
        }

        console.log('global mounted函数 被调用')

        // 调节状态栏高度方法
        EventObj.addLastEventListener('autoHeight', (e) => {
          console.log('calledEvent: autoHeight')
          autoHeight()
        })

        // 刷行数据方法
        if (this.refreshPageData) {
          EventObj.addLastEventListener('refreshPageData', (e) => {
            console.log('calledEvent: refreshPageData')
            if (this.refreshPageData) {
              console.log('calledMethod: refreshPageData')
              this.refreshPageData()
            }
          })
        }

        autoHeight(this.$el)
        hideHeaderHandler(this, 'mounted')
        scrollToTop(this.$el)
      },
      created () {
        // 当使用webview方式打开的话，会显示webview，并绑定侧滑事件
        if (this.$parent && this.$parent.$el && this.$parent.$el.id === 'app') {
          console.log('global created函数 被调用')

          setWebviewNewUrl()
          showWebview()
        }
      }
    })
  }
}
