const localEvent = {
  getLocalItem: (item) => {
    console.log('getLocalItem key:inwehub_' + item)
    return JSON.parse(window.localStorage.getItem('inwehub_' + item)) || []
  },

  setLocalItem: (item, obj) => {
    console.log('setLocalItem key:inwehub_' + item + ', value:' + JSON.stringify(obj))
    window.localStorage.setItem('inwehub_' + item, JSON.stringify(obj))
  },

  clearLocalItem: (item) => {
    console.log('clearLocalItem key:inwehub_' + item)
    window.localStorage.removeItem('inwehub_' + item)
  },

  clearLocalAll: () => {
    console.log('clearLocalAll')
    window.localStorage.clear()
  }
}

export default localEvent

