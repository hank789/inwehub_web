<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title" v-if="isSelf">我的发布</h1>
      <h1 class="mui-title" v-else>Ta的发布</h1>
    </header>

    <!--组件-->
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/my/publishAnswers/' + uuid)">回答 </span>
        <span @tap.stop.prevent="">提问  <i></i> </span>
        <span @tap.stop.prevent="$router.replace('/my/publishArticle/' + uuid)">分享</span>
        <span @tap.stop.prevent="$router.replace('/my/publishComment/' + uuid)">评论</span>
      </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'question/myList'"
        :prevOtherData="{type:0, uuid: this.uuid}"
        :nextOtherData="{type:0, uuid: this.uuid}"
        :list="list"
        class="listWrapper">
        <ul class="answer">
          <li v-for="(ask, index) in list" @tap.stop.prevent="toDetail(ask)">
            <p class="mui-ellipsis-2" v-html="textToLink(ask.description)"></p>
            <p>
              <span  class="label" :class="'label_' + ask.status">{{ask.status_description}}</span>
              <span>{{ask.created_at}}</span>
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
  import { textToLinkHtml, secureHtml } from '../../../utils/dom'
  import { getLocalUuid } from '../../../utils/user'

  const PublishAnswers = {
    data: () => ({
      list: [],
      uuid: getLocalUuid()
    }),
    activated: function () {
      this.refreshPageData()
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    },
    computed: {
      isSelf () {
        if (getLocalUuid() === this.$route.params.uuid) {
          return true
        }
        return false
      }
    },
    components: {
      RefreshList
    },
    methods: {
      refreshPageData () {
        if (this.$route.params.uuid) {
          this.uuid = this.$route.params.uuid
        }
      },
      textToLink (text) {
        return secureHtml(textToLinkHtml(text))
      },
      toDetail (item) {
        this.$router.pushPlus('/ask/offer/answers/' + item.id)
      }
    },
    mounted () {
    },
    updated () {}
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

  .menu span:nth-of-type(2) {
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

  .answer li p:nth-of-type(2) {
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
 .label_1,.label_2,.label_4{
    background: #fcc816;
 }

 .label_3,.label_5,.label_6,.label_7{
   background: #c8c8c8;
 }
  .listWrapper{
    top: 1.2rem;
  }
</style>
