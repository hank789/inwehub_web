// mapGetters 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性：
import {
  SHOW_FOOTER, // 显示底部
  HIDDE_FOOTER,
  SHOW_HEADER, // 显示头部定位
  HIDDE_HEADER
} from './mutation_types.js'

// 1 : 定义默认的 监测状态
const state = {
  showBottom: true, // 底部导航
  showHeader: true  // 头部定位
}

const mutations = {
  /* footer */
  [SHOW_FOOTER] (state) {
    state.showBottom = true
  },
  [HIDDE_FOOTER] (state) {
    state.showBottom = false
  },
  [SHOW_HEADER] (state) {
    state.showHeader = true
  },
  [HIDDE_HEADER] (state) {
    state.showHeader = false
  }
}

// 2 : 返回 状态
const getters = {
  // ...
  showBottom (state) {
    return state.showBottom
  },
  showHeader (state) {
    return state.showHeader
  }
}

export default {
  state,
  mutations,
  getters
}
