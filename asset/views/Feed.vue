<template>
  <div>
    <header class="hidewechattitle mui-bar mui-bar-nav component-homeHeader">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-logowenzi"></use>
      </svg>
    </header>

    <div class="mui-content" v-show="!loading">
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :isShowUpToRefreshDescription="false"
        :list="list"
        class="listWrapper"
      >

          <!--x回答了专业问答-->
          <template v-for="(item, index) in list">
            <AnswerMajor v-if="item.feed_type === 1" :data="item"></AnswerMajor>
            <AnswerInteraction v-else-if="item.feed_type === 2" :data="item"></AnswerInteraction>
          </template>

      </RefreshList>

    </div>
    <div id="statusBarStyle" background="#f3f4f6" bgColor="#f3f4f6" mode="dark"></div>
  </div>

</template>
<script>
  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../utils/request';
  import AnswerMajor from '../components/feed/AnswerMajor';
  import AnswerInteraction from '../components/feed/AnswerInteraction';
  import RefreshList from '../components/refresh/List.vue';

  const Feed = {
    data: () => ({
      loading: false,
      list:[]
    }),
    created() {

    },
    components: {
      RefreshList,
      AnswerMajor,
      AnswerInteraction
    },
    //缓存；
    activated: function () {

    },
    mounted() {

    },
    computed: {},
    methods: {}
  };
  export default Feed;
</script>

<style lang="less" scoped>

</style>
