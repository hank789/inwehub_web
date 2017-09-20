const localEvent = {
  getLocalItem: (item) => {
    return JSON.parse(window.localStorage.getItem('inwehub_' + item)) || [];
  },

  setLocalItem: (item, obj) => {
    window.localStorage.setItem('inwehub_' + item,JSON.stringify(obj));
  },     

  clearLocalItem: (item) => {
    window.localStorage.removeItem('inwehub_' + item);
  },

  clearLocalAll: () => {
    window.localStorage.clear();
  }
}

export default localEvent;

