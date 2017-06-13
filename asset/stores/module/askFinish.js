/**
 store for askType list;
 */
import { ASKS_FINISH_LIST, ASKS_FINISH_LIST_APPEND,ASKS_FINISH_INFO,ASKS_FINISH_INFO_APPEND } from '../types';

const state = {
  list: [],
  info:{
    lastY:0
  }
};

const mutations = {
  [ASKS_FINISH_LIST_APPEND] (state, items) {
    state.list = items;
  },
  [ASKS_FINISH_INFO_APPEND] (state, info) {
    state.info = info;
  }
};

const actions = {
  [ASKS_FINISH_LIST_APPEND]: (context, items) => {
      context.commit(ASKS_FINISH_LIST_APPEND, items);
  },
  [ASKS_FINISH_INFO_APPEND]: (context, info) => {
    context.commit(ASKS_FINISH_INFO_APPEND, info);
  }
};

const getters = {
  [ASKS_FINISH_INFO]: (state) => state.info,
  [ASKS_FINISH_LIST]: (state) => state.list
};

const store = {
  state,
  mutations,
  actions,
  getters
}

export default store;
