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
        <span @tap.stop.prevent="$router.replace('/collectQuestion')">问答</span>
        <span @tap.stop.prevent="$router.replace('')">标签<i></i></span>
        <i class="bot"></i>
      </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'followed/tags'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :pageMode="true"
        class="listWrapper">
        <ul>
          <li class="tag-title" v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.tag_name)">
            <div class="tag-l" v-if="item.tag_logo">
              <img :src="item.tag_logo">
            </div>
            <div class="tag-l bg-grey" v-else>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
              </svg>
            </div>
            <div class="tag-r">
              <p>
                <span>{{item.tag_name}}</span>
              </p>
              <p class="mui-ellipsis-3">{{item.tag_summary}}</p>
            </div>
            <i class="bott"></i>
          </li>
        </ul>
      </RefreshList>
    </div>
    <!---->

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import userAbility from '../../utils/userAbility'

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
      toDetail (text) {
        userAbility.jumpToTagDetail(text)
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
  .menu span:nth-of-type(3){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(3) i{
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
  .bott {
     position: absolute;
     right: 4%;
     bottom: 0;
     left: 4%;
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
  .tag-title{
    width:100%;
    height:3.546rem;
    padding: 0 4%;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }
  .tag-l{
    width:2.453rem;
    height:2.453rem;
  }
  .tag-l img{
    width: 100%;
    height:100%;
    border-radius: 0.106rem;
  }
  .tag-l.bg-grey{
    background: #ececee;
    border-radius: 0.106rem;
    position: relative;
  }
  .tag-l.bg-grey svg{
    color: #c8c8c8;
    font-size: 1.333rem;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin:auto;
  }

  .tag-r{
    height:2.453rem;
    margin-left: 0.266rem;
  }
  .tag-r p:nth-of-type(1){
    font-size:0.48rem;
    color: #444444;
    font-weight:500;
  }

  .tag-r p:nth-of-type(2){
    margin-top: 0.293rem;
    font-size: 0.32rem;
    color: #808080;
    line-height: 0.48rem;
  }
  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 375px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 414px) {
    .tag-r {
      width: 73%;
    }
  }
  .listWrapper{
    top:4.72rem;
  }

  /*listWrapper*/
  .listWrapper {
    top: 1.2rem;
  }
</style>
