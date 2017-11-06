const sessionEvent = {
  getLocalItem: (item) => {
    return JSON.parse(window.sessionStorage.getItem('inwehub_' + item)) || []
  },

  setLocalItem: (item, obj) => {
    window.sessionStorage.setItem('inwehub_' + item, JSON.stringify(obj))
  },

  clearLocalItem: (item) => {
    window.sessionStorage.removeItem('inwehub_' + item)
  },

  clearLocalAll: () => {
    window.sessionStorage.clear()
  }
}

export default sessionEvent

