const localEvent = {
  getLocalItem: (item) => {
    return JSON.parse(window.localStorage.getItem('inwehub_' + item)) || []
  },

  setLocalItem: (item, obj) => {
    window.localStorage.setItem('inwehub_' + item, JSON.stringify(obj))
    if (item.indexOf('selected') === 0) {
      // 需要返回刷新
      window.localStorage.setItem('inwehub_needRefresh', JSON.stringify({value: true}))
    }
  },

  clearLocalItem: (item) => {
    window.localStorage.removeItem('inwehub_' + item)
  },

  clearLocalAll: () => {
    window.localStorage.clear()
  }
}

export default localEvent

