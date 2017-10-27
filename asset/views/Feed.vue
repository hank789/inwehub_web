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

          
          <template v-for="(item, index) in list">
            <!--x回答了专业问答-->
            <AnswerMajor v-if="item.feed_type === 1" :data="item"></AnswerMajor>
            
            <!--x回答了互动问答-->
            <AnswerInteraction v-else-if="item.feed_type === 2" :data="item"></AnswerInteraction>
            
            <!--x发布了互动问答-->
            <CreateFreeQuestion v-else-if="item.feed_type === 3" :data="item"></CreateFreeQuestion>
            
            <!--x发布了文章-->
            <SubmitReadhubAriticle v-else-if="item.feed_type === 5" :data="item"></SubmitReadhubAriticle>
            
            <!--x关注了互动问答-->
            <FllowFreeQuestion v-else-if="item.feed_type === 6" :data="item"></FllowFreeQuestion>
            
            <!--x关注了互动问答-->
            <FllowFreeQuestion v-else-if="item.feed_type === 6" :data="item"></FllowFreeQuestion>
            
            <!--x关注了新的朋友-->
            <FllowUser v-else-if="item.feed_type === 7" :data="item"></FllowUser>
                   
            <!--x评论了专业回答-->
            <CommentPayQustion v-else-if="item.feed_type === 8" :data="item"></CommentPayQustion>
            
            <!--x评论了互动回答-->
            <CommentFreeQuestion v-else-if="item.feed_type === 9" :data="item"></CommentFreeQuestion>
            
            <!--x评论了文章-->
            <CommentReadhubAriticle  v-else-if="item.feed_type === 10" :data="item"></CommentReadhubAriticle>
              
             <!--x赞了专业回答-->
            <UpvotePayQuestion v-else-if="item.feed_type === 11" :data="item"></UpvotePayQuestion>
            
             <!--x赞了互动回答-->
            <UpvoteFreeQuestion  v-else-if="item.feed_type === 12" :data="item"></UpvoteFreeQuestion>
            
             <!--x赞了文章-->
            <UpvoteReadhubAriticle  v-else-if="item.feed_type === 13" :data="item"></UpvoteReadhubAriticle>
            
            
            
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
  import CreateFreeQuestion from '../components/feed/CreateFreeQuestion';
  import SubmitReadhubAriticle from '../components/feed/SubmitReadhubAriticle';
  import FllowFreeQuestion from '../components/feed/FllowFreeQuestion';
  import FllowUser from '../components/feed/FllowUser';
  import CommentPayQustion from '../components/feed/CommentPayQustion';
  import CommentFreeQuestion from '../components/feed/CommentFreeQuestion';
  import CommentReadhubAriticle from '../components/feed/CommentReadhubAriticle';
  import UpvotePayQuestion from '../components/feed/UpvotePayQuestion';
  import UpvoteFreeQuestion from '../components/feed/UpvoteFreeQuestion';
  import UpvoteReadhubAriticle from '../components/feed/UpvoteReadhubAriticle';
  
  
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
      AnswerInteraction,
      CreateFreeQuestion,
      SubmitReadhubAriticle,
      FllowFreeQuestion,
      FllowUser,
      CommentPayQustion,
      CommentFreeQuestion,
      CommentReadhubAriticle,
      UpvotePayQuestion,
      UpvoteFreeQuestion,
      UpvoteReadhubAriticle
      
      
      
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
