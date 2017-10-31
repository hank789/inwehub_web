<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的发布</h1>
    </header>

    <!--无内容-->
    <!--<div class="mui-content list-empty absolute" >
        <div class="mui-table-view list-ask-item">
          <div class="mui-table-view-cell">
            <div>
              <div class="title">暂无任务</div>
              <div class="subTitle">稍安勿躁，是金子总会发光！<br/>平台正准备给您一展风采的机会呢！</div>
            </div>
          </div>
      </div>
    </div>-->

    <!--组件-->
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/my/publishAnswers')">回答 </span>
        <span @tap.stop.prevent="">提问</span>
        <span @tap.stop.prevent="$router.replace('/my/publishArticle')">文章  <i></i></span>
        <span @tap.stop.prevent="$router.replace('/my/publishComment')">评论</span>

      </div>
      <!--内容区域-->
      <RefreshList 
        ref="RefreshList" 
        v-model="list" 
        :api="'question/myList'"
        :downLoadMoreMode="true" 
        :isShowUpToRefreshDescription="true" 
        :prevOtherData="{type:0}" 
        :nextOtherData="{type:0}" 
        :list="list" 
        class="listWrapper">
        <ul class="answer">
          <li v-for="(ask, index) in list">
            <p class="mui-ellipsis-2">{{ask.description}}</p>
            <p>
              <span  class="label" :class="'label_' + ask.status">{{ask.status_description}}</span>
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
  import { createAPI, addAccessToken, postRequest } from '../../../utils/request';
  import RefreshList from '../../../components/refresh/List.vue';
  const PublishAnswers = {
    data: () => ({
      list: [],

    }),
    created() {
     

    },
    computed: {

    },
   components: {
      RefreshList
    },
    methods: {
     
  
    },
    mounted() {
      

    },
    updated() {
//    console.error(this.list);
    }
  }
  export default PublishAnswers;
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
  
  .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
  }
  
  .menu span {
    display: block;
    width: 25%;
    height: 100%;
    float: left;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }
  
  .menu span:nth-of-type(2) {
    color: #3c95f9;
    position: relative;
  }
  
  .menu i {
    display: block;
    position: absolute;
    width: 27px;
    height: 1.5px;
    left: 34%;
    bottom: 0.5px;
    background: #3c95f9;
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
    padding: 14px 0 13px 0;
    position: relative;
  }
  
  .answer li p:nth-of-type(2) {
    color: #444444;
    font-size: 16px;
  }
  
  .answer li p:nth-of-type(2) {
    overflow: hidden;
    margin-top: 6px;
    
  }
  
  .label {
    float: left;
    width: 50px;
    height: 17px;
    line-height: 17px;
    border-radius: 50px;
    background: #fcc816;
    color: #ffffff;
    font-size: 12px;
    text-align: center;
  }
  
  .answer li p:nth-of-type(2) span:nth-of-type(2) {
    float: right;
    font-size: 12px;
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
    top: 45px;
  }
</style>