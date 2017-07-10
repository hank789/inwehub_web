/**
 store for askType list;
 */
import { RICHTEXT_ANSWER_SET, RICHTEXT_ANSWER_GET } from '../types';
import {getIndexByIdArray} from '../../utils/array';

const state = {
  answer: [],
};


const mutations = {
  [RICHTEXT_ANSWER_SET] (state, items) {
    var item = {
      id:items.id,
      content:items.content,
    };

    var index = getIndexByIdArray(state.answer, items.id);
    if (index > -1) {
      state.answer[index] = item;
    } else {
      state.answer.push(item);
    }
  },
};

const actions = {
  [RICHTEXT_ANSWER_SET]: (context, items) => {

      context.commit(RICHTEXT_ANSWER_SET, items);
  },
};

const getters = {
  [RICHTEXT_ANSWER_GET]: (state) => state.answer,
};

const store = {
  state,
  mutations,
  actions,
  getters
}

export default store;
