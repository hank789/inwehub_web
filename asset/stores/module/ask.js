/**
 store for askType list;
 */
import { ASKS_INFO, ASKS_LIST, ASKS_INFO_APPEND, ASKS_LIST_APPEND } from '../types';

const state = {
  list: [],
  info:{
    lastY:0
  }
};

const mutations = {
  [ASKS_LIST_APPEND] (state, items) {
    state.list = items;
  },
  [ASKS_INFO_APPEND] (state, info) {
    state.info = info;
  }
};

const actions = {
  [ASKS_LIST_APPEND]: (context, items) => {
      context.commit(ASKS_LIST_APPEND, items);
  },
  [ASKS_INFO_APPEND]: (context, info) => {
    context.commit(ASKS_INFO_APPEND, info);
  }
};

const getters = {
  [ASKS_INFO]: (state) => state.info,
  [ASKS_LIST]: (state) => state.list
};

const store = {
  state,
  mutations,
  actions,
  getters
}

export default store;
