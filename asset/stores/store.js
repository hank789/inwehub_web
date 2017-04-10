import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// modules
import user from './module/user';
import notice from './module/noticeText';
import imageSwiper from './module/imageSwiper';
import showPost from './module/showPost';

import mutations from './mutations'
import actions from './actions'

const modules = {
  user,
  notice,
  imageSwiper,
  showPost,
  mutations
}

const store = new Vuex.Store({
  modules,
  actions
});

export default store;
