/**
 store for askType list;
 */
import { ASK_TYPES_SET, ASK_TYPES, ASK_SUB_TYPES, ASK_TYPE_SELECT,ASK_INFO } from '../types';

const state = {
  types: {},
  selected: '',
  info:{}
};

const mutations = {
  // 增加type
  [ASK_TYPES_SET] (state, types) {
    state.types = types;
  },
  [ASK_TYPE_SELECT] (state, type) {
    state.selected = type;
  },
  [ASK_INFO] (state, info) {
    state.info = info;
  }
};

const actions = {
  // 增加type
  [ASK_TYPES_SET]: (context, types) => {
      context.commit(ASK_TYPES_SET, types);
  },
  [ASK_TYPE_SELECT]: (context, type) => {
    context.commit(ASK_TYPE_SELECT, type);
  },
  [ASK_INFO]: (context, info) => {
    context.commit(ASK_INFO, info);
  }
};

const getters = {
  // 返回所有type
  [ASK_SUB_TYPES]: (state) => state.types,


  [ASK_TYPES]: (state) => {
    var subTypes = [];
    for(var i in state.types) {
      subTypes.push(i);
    }
    return subTypes;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
}

export default store;
