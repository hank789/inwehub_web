<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-if="isUuid === this.$route.params.id">我的发布</h1>
      <h1 class="mui-title" v-else>Ta的发布</h1>
    </header>


    <!--组件-->
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">回答  <i></i></span>
        <span @tap.stop.prevent="$router.replace('/my/publishQuestions/' + uuid)">提问</span>
        <span @tap.stop.prevent="$router.replace('/my/publishArticle/' + uuid)">分享</span>
        <span @tap.stop.prevent="$router.replace('/my/publishComment/' + uuid)">评论</span>
      </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'answer/myList'"
        :prevOtherData="{type:0,uuid: this.uuid }"
        :nextOtherData="{type:0,uuid: this.uuid }"
        :list="list"
        class="listWrapper">
        <ul class="answer">
          <li v-for="(ask, index) in list" @tap.stop.prevent="toDetail(ask)">
            <p class="mui-ellipsis-2" >{{ask.description}}</p>
            <p>
              <span class="label" :class="'label_' + ask.status">{{ask.status_description}}</span>
              <span>{{ask.created_at.split(' ')[0].replace(/-/g, '/') }}</span>
            </p>
            <i class="bot"></i>
          </li>
        </ul>
      </RefreshList>

      <!---->
    </div>
    <!---->

  </div>
</template>

<script>
  import RefreshList from '../../../components/refresh/List.vue'
  import localEvent from '../../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')

  const PublishAnswers = {
    data: () => ({
      list: [],
      uuid: currentUser.uuid,
      isUuid: currentUser.uuid
    }),
    created () {
      if (this.$route.params.id) {
        this.uuid = this.$route.params.id
      }
    },
    computed: {},
    components: {
      RefreshList
    },
    methods: {
      toDetail (item) {
        if (item.question_type === 2) {
          this.$router.pushPlus('/askCommunity/interaction/' + item.id)
        } else {
          this.$router.pushPlus('/answer/' + item.question_id)
        }
      }
    },
    mounted () {
    },
    updated () {

    }
  }
  export default PublishAnswers
</script>

<style scoped="scoped">
  .mui-wechat .menu {
    width: 100%;
    height: 1.2rem;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    top: 0;
  }

  .mui-content {
    background: #FFFFFF;
  }

  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 1.2rem;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
  }

  .menu span {
    display: block;
    width: 25%;
    height: 100%;
    float: left;
    font-size: 0.373rem;
    color: #444444;
    text-align: center;
    line-height: 1.2rem;
    font-weight: 600;
  }

  .menu span:nth-of-type(1) {
    color: #3c95f9;
    position: relative;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 0.72rem;
    height: 0.04rem;
    left:0;
    right:0;
    bottom: 0.013rem;
    margin:auto;
    background: #3c95f9;
  }

  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  /*滚动区域*/

  .answer {
    width: 92%;
    margin-left: 4%;
    overflow: hidden;
  }

  .answer li {
    width: 100%;
    overflow: hidden;
    padding: 0.373rem 0 0.346rem 0;
    position: relative;
  }

  .answer li p:nth-of-type(1) {
    color: #444444;
    font-size: 0.426rem;
  }

  .answer li p:nth-of-type(2) {
    overflow: hidden;
    margin-top: 0.16rem;
  }

  .label {
    float: left;
    width: 1.333rem;
    height: 0.453rem;
    line-height: 0.453rem;
    border-radius: 1.333rem;
    background: #fcc816;
    color: #ffffff;
    font-size: 0.32rem;
    text-align: center;
  }

  .answer li p:nth-of-type(2) span:nth-of-type(2) {
    float: right;
    font-size: 0.32rem;
    color: #b4b4b6;
  }

  /*状态的颜色*/
  .label_1, .label_2, .label_4 {
    background: #fcc816;
  }

  .label_3, .label_5, .label_6, .label_7 {
    background: #c8c8c8;
  }

  .listWrapper {
    top: 1.2rem;
  }
</style>
