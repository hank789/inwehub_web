/**
 store for askType list;
 */
import { TASK_INFO, TASK_LIST, TASK_INFO_APPEND, TASK_LIST_APPEND } from '../types';

const state = {
  list: [],
  info:{
    lastY:0
  }
};

const mutations = {
  [TASK_LIST_APPEND] (state, items) {
    state.list = items;
  },
  [TASK_INFO_APPEND] (state, info) {
    state.info = info;
  }
};

const actions = {
  [TASK_LIST_APPEND]: (context, items) => {
      context.commit(TASK_LIST_APPEND, items);
  },
  [TASK_INFO_APPEND]: (context, info) => {
    context.commit(TASK_INFO_APPEND, info);
  }
};

const getters = {
  [TASK_INFO]: (state) => state.info,
  [TASK_LIST]: (state) => state.list
};

const store = {
  state,
  mutations,
  actions,
  getters
}

export default store;
