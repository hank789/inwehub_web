import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// modules
import user from './module/user';
import notice from './module/noticeText';
import imageSwiper from './module/imageSwiper';
import showPost from './module/showPost';
import askType from './module/askType';
import task from './module/task';
import answers from './module/answer';
import asks from './module/ask';


import mutations from './mutations'
import actions from './actions'

const modules = {
  user,
  notice,
  imageSwiper,
  showPost,
  mutations,
  task,
  asks,
  answers,
  askType
}

const store = new Vuex.Store({
  modules,
  actions
});

export default store;
