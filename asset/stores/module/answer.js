/**
 store for askType list;
 */
import { ANSWERS_INFO, ANSWERS_LIST, ANSWERS_INFO_APPEND, ANSWERS_LIST_APPEND } from '../types';

const state = {
  list: [],
  info:{
    lastY:0
  }
};

const mutations = {
  [ANSWERS_LIST_APPEND] (state, items) {
    state.list = items;
  },
  [ANSWERS_INFO_APPEND] (state, info) {
    state.info = info;
  }
};

const actions = {
  [ANSWERS_LIST_APPEND]: (context, items) => {
      context.commit(ANSWERS_LIST_APPEND, items);
  },
  [ANSWERS_INFO_APPEND]: (context, info) => {
    context.commit(ANSWERS_INFO_APPEND, info);
  }
};

const getters = {
  [ANSWERS_INFO]: (state) => state.info,
  [ANSWERS_LIST]: (state) => state.list
};

const store = {
  state,
  mutations,
  actions,
  getters
}

export default store;
