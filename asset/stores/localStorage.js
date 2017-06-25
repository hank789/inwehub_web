const localEvent = {
  getLocalItem: (item) => {
    if (mui.os.plus) {
      return JSON.parse(plus.storage.getItem('inwehub_' + item)) || [];
    } else
      return JSON.parse(window.localStorage.getItem('inwehub_' + item)) || [];
  },

  setLocalItem: (item, obj) => {
    if (mui.os.plus) {
      return plus.storage.setItem('inwehub_' + item, JSON.stringify(obj));
    } else
      window.localStorage.setItem('inwehub_' + item, JSON.stringify(obj));
  },

  clearLocalItem: (item) => {
    if (mui.os.plus) {
      return plus.storage.removeItem('inwehub_' + item);
    } else
      window.localStorage.removeItem('inwehub_' + item);
  },

  clearLocalAll: () => {
    if (mui.os.plus) {
      plus.storage.clear();
    } else {
      window.localStorage.clear();
    }
  }
}

export default localEvent;

