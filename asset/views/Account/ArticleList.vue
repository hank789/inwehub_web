<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{user_uuid == uuid ? '我的专栏' : 'Ta的专栏'}}</h1>
    </header>

    <div class="mui-content">

      <!--列表-->
      <RefreshList
        v-model="list"
        :api="'article/user'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        class="listWrapper">
        <!--类别-->

        <ul class="recommend">
          <li v-for="(recommend, index) in list"  @tap.stop.prevent="goDetial(recommend)">
            <div class="container-image">
              <img :src="recommend.data ? recommend.data.img:''"  />
            </div>
            <p class="recommend_content mui-ellipsis-2" >{{recommend.data ? recommend.data.title:''}}</p>
            <div class="recommend_datail">
              <p class="answer-fouce">{{recommend.comments_number}}评论<i></i>{{recommend.upvotes}}赞</p>
            </div>
          </li>
        </ul>
      </RefreshList>

    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { goThirdPartyArticle } from '../../utils/webview'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        list: [],
        uuid: currentUser.uuid,
        user_uuid: '',
        dataList: {}
      }
    },
    created () {
      if (this.$route.query.id) {
        this.dataList = {
          uuid: this.$route.query.id
        }
        this.user_uuid = this.$route.query.id
      }
    },
    components: {
      RefreshList
    },
    methods: {
      goDetial (hot) {
        switch (hot.type) {
          case 'text':
            this.$router.pushPlus('/c/' + hot.category_id + '/' + hot.slug)
            break
          case 'link':
            goThirdPartyArticle(
              hot.data.url,
              hot.id,
              hot.title,
              '/c/' + hot.category_id + '/' + hot.slug,
              hot.data.img
            )
            break
          default:
        }
      }
    },
    mounted () {
    },
    updated () {}
  }
</script>
<style scoped="scoped">
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
  .mui-content{
    background: #fff;
  }

  /*列表*/
  .recommend{
    width:100%;
    background: #FFFFFF;
    overflow: hidden;
  }
  .recommend li{
    width:92%;
    padding:0px 0 13px 0;
    overflow: hidden;
    background: #FFFFFF;
    margin-bottom: 10px;
    margin-left: 4%;
    border-radius: 4px;
    box-shadow: 0px 0px 7px 2px #ececee;
  }
  .recommend li:nth-of-type(1){
    padding-top: 0;
  }
  .recommend li  .container-image{
    position: relative;
  }
  .recommend li .container_type{
    width: 64px;
    height:20px;
    float: left;
    border-radius:0 18px 18px 0;
    text-align: center;
    line-height: 20px;
    color: #FFFFFF;
    font-size: 12px;
  }
  /*颜色*/
  .recommend li .blue{
    background: #03aef9;
  }
  .recommend li .yellow{
    background: #fcc816;
  }
  .recommend li .pink{
    background:#fa4975;
  }

  /**/
  .recommend_content{
    margin-top: 12px;
    color:#444444;
    font-size:15px;
    line-height: 20px;
    padding: 0 15px;

  }
  .container-item .title{
    width:100%;
    height:42.5px;
    padding: 0 4%;
    line-height: 42.5px;
  }
  .container-item .title p:nth-of-type(1){
    float: left;
    font-size:16px;
    color:#444444;

  }
  .container-item .title p:nth-of-type(2){
    float: right;
    font-size:13px;
    color:#03aef9;

  }


  #home-recommend div:nth-of-type(1) {
    margin-left: 0px;
  }
  #home-card img{
    width:100%;
    height:100%;
    border-radius: 4px;
  }
  .listWrapper{
    margin-top: 0px;
    padding-top: 10px;
  }

  /*底部的详情*/
  .recommend_datail{
    width:100%;
    height:20px;
    margin-top: 9px;
  }
  /*回答 关注*/
  .answer-fouce{
    float: right;
    font-size:12px;
    color: #235280;
    padding-right: 15px;
  }
  .answer-fouce i{
    margin: 0;
    display: inline-block;
    width:1px;
    height:12px;
    background: #dbdbdb;
    margin: 0 9px -3px 9px;


  }

  /*榜单*/
  .mostInvitations{
    width:92%;
    height:60px;
    background: #fdc707;
    margin: 7px 4%;
    border-radius: 12px;
    padding-left: 15px;
    padding-top: 8px;
    position: relative;
  }
  .mostInvitations .Medal{
    width: 32px;
    position: absolute;
    right:18px;
    top:0;
  }
  .invitation{
    font-size:12px;
    color: #8e4c02;
  }
  .invitation span{
    font-size:16px;
    font-weight:500;
    color: #8e4c02;
    margin-right: 2px;
  }
  .invitation i{
    font-size:12px;
    color:#235280;
  }
  .credits-cions{
    font-size:12px;
    color: #8e4c02;
  }
  .credits-cions i{
    color: #235280;
  }
  .InvitationList{
    position: absolute;
    width:92px;
    height:34px;
    border:1px solid #fde07d;
    border-radius: 13px;
    font-size: 14px;
    color: #b56102;
    line-height: 34px;
    text-align: center;
    right: 56px;
    top: 13px;
    box-shadow:0px 0px 2px rgba(81, 55, 7, 0.5) inset;
    text-shadow: 0 0 1px rgb(238,134,16);
  }
  .InvitationList img{
    height:20px;
    margin-top: 6px;
  }
</style>
