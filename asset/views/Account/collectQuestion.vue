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
      </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'followed/questions'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        class="listWrapper">
        <ul class="answer">
          <li v-for="(questions, index) in list" @tap.stop.prevent="toDetail(questions)">
            <p class="mui-ellipsis-2">{{questions.description}}</p>
            <p>
              <span>回答{{questions.answer_num}}</span>
              <a></a>
              <span>关注问题{{questions.follow_num}}</span>
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
  import RefreshList from '../../components/refresh/List.vue'
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
    height: 45px;
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
    height:39px;
    background: #f3f4f6;
    font-size:14px;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .menu span:nth-of-type(2){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(2) i{
    position:absolute;
    width:27px;
    height:1.5px;
    border-radius: 50px;
    background:#03aef9;
    top: 28px;
    left: 0;
    right: 0;
    margin: auto;
  }

  .bot {
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
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
    padding: 15px 0 13px 0;
    position: relative;
  }

  .answer li div {
    margin-bottom: 12px;
  }

  .answer li p:nth-of-type(1) {
    font-size: 15px;
    color: #444444;

  }

  .answer li p:nth-of-type(2) {
    margin-top: 6px;

  }

  .answer li p:nth-of-type(2) span:nth-of-type(1) {
    font-size: 12px;
    color: #b4b4b6;
  }

  .answer li p:nth-of-type(2) span:nth-of-type(2) {
    font-size: 12px;
    color: #03aef9;

  }

  .answer li p:nth-of-type(2) a {
    display: inline-block;
    width: 1px;
    height: 12px;
    background: #DCDCDC;
    margin: 0 9px -2px 7px;

  }

  /*listWrapper*/
  .listWrapper {
    top: 45px;
  }
</style>
