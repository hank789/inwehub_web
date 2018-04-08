<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的关注</h1>
    </header>


    <!--组件-->
    <div class="mui-content">
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/collectUser')">用户</span>
        <span @tap.stop.prevent="$router.replace('')">问答<i></i></span>
        <span @tap.stop.prevent="$router.replace('/collectTags')">标签</span>
        <i class="bot"></i>
      </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'followed/questions'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :pageMode="true"
        class="listWrapper">
        <ul class="answer">
          <li v-for="(questions, index) in list" @tap.stop.prevent="toDetail(questions)">
            <p class="mui-ellipsis-2"  v-html="textToLink(questions.description)"></p>
            <p>
              <span>回答{{questions.answer_num}}</span>
              <a></a>
              <span>关注问题{{questions.follow_num}}</span>
            </p>
            <i class="bot"></i>
          </li>
        </ul>
      </RefreshList>
       <div class="superinduce" @tap.stop.prevent="$router.pushPlus('/askCommunity/majors')">新的关注</div>
      <!---->
    </div>
    <!---->

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { textToLinkHtml, secureHtml } from '../../utils/dom'
  const PublishAnswers = {
    data: () => ({
      list: []
    }),
    created () {
    },
    computed: {},
    components: {
      RefreshList
    },
    methods: {
      textToLink (text) {
        return secureHtml(textToLinkHtml(text))
      },
      toDetail (item) {
        if (item.question_type === 2) {
          this.$router.pushPlus('/askCommunity/interaction/answers/' + item.question_id)
        } else {
          this.$router.pushPlus('/askCommunity/major/' + item.question_id)
        }
      }
    },
    mounted () {
    },
    updated () {
//    console.error(this.list);
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
  .menu{
    width:100%;
    height:1.04rem;
    font-size:0.373rem;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  .menu span:nth-of-type(2){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(2) i{
    position:absolute;
    width:0.72rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.746rem;
    left: 0;
    right: 0;
    margin: auto;
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
    padding: 0.4rem 0 0.346rem 0;
    position: relative;
  }

  .answer li div {
    margin-bottom: 0.32rem;
  }

  .answer li p:nth-of-type(1) {
    font-size: 0.4rem;
    color: #444444;

  }

  .answer li p:nth-of-type(2) {
    margin-top: 0.16rem;

  }

  .answer li p:nth-of-type(2) span:nth-of-type(1) {
    font-size: 0.32rem;
    color: #b4b4b6;
  }

  .answer li p:nth-of-type(2) span:nth-of-type(2) {
    font-size: 0.32rem;
    color: #03aef9;

  }

  .answer li p:nth-of-type(2) a {
    display: inline-block;
    width: 0.026rem;
    height: 0.32rem;
    background: #DCDCDC;
    margin: 0 0.24rem -0.053rem 0.186rem;

  }

  /*listWrapper*/
  .listWrapper {
    top: 1.2rem;
  }
  .superinduce{
    width:3.04rem;
    height:1.173rem;
    background:rgba(3,174,249,1);
    color: #ffffff;
    font-size: 0.426rem;
    border-radius: 1.333rem;
    text-align: center;
    line-height:1.173rem;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0.4rem;
    margin: auto;
    z-index: 3;
  }
</style>
