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
    padding:0rem 0 1.3rem 0;
    overflow: hidden;
    background: #FFFFFF;
    margin-bottom: 1rem;
    margin-left: 4%;
    border-radius: 0.4rem;
    box-shadow: 0rem 0rem 0.7rem 0.2rem #ececee;
  }
  .recommend li:nth-of-type(1){
    padding-top: 0;
  }
  .recommend li  .container-image{
    position: relative;
  }
  .recommend li .container_type{
    width: 6.4rem;
    height:2rem;
    float: left;
    border-radius:0 1.8rem 1.8rem 0;
    text-align: center;
    line-height: 2rem;
    color: #FFFFFF;
    font-size: 1.2rem;
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
    margin-top: 1.2rem;
    color:#444444;
    font-size:1.5rem;
    line-height: 2rem;
    padding: 0 1.5rem;

  }
  .container-item .title{
    width:100%;
    height:4.25rem;
    padding: 0 4%;
    line-height: 4.25rem;
  }
  .container-item .title p:nth-of-type(1){
    float: left;
    font-size:1.6rem;
    color:#444444;

  }
  .container-item .title p:nth-of-type(2){
    float: right;
    font-size:1.3rem;
    color:#03aef9;

  }


  #home-recommend div:nth-of-type(1) {
    margin-left: 0rem;
  }
  #home-card img{
    width:100%;
    height:100%;
    border-radius: 0.4rem;
  }
  .listWrapper{
    margin-top: 0rem;
    padding-top: 1rem;
  }

  /*底部的详情*/
  .recommend_datail{
    width:100%;
    height:2rem;
    margin-top: 0.9rem;
  }
  /*回答 关注*/
  .answer-fouce{
    float: right;
    font-size:1.2rem;
    color: #235280;
    padding-right: 1.5rem;
  }
  .answer-fouce i{
    margin: 0;
    display: inline-block;
    width:0.1rem;
    height:1.2rem;
    background: #dbdbdb;
    margin: 0 0.9rem -0.3rem 0.9rem;


  }

  /*榜单*/
  .mostInvitations{
    width:92%;
    height:6rem;
    background: #fdc707;
    margin: 0.7rem 4%;
    border-radius: 1.2rem;
    padding-left: 1.5rem;
    padding-top: 0.8rem;
    position: relative;
  }
  .mostInvitations .Medal{
    width: 3.2rem;
    position: absolute;
    right:1.8rem;
    top:0;
  }
  .invitation{
    font-size:1.2rem;
    color: #8e4c02;
  }
  .invitation span{
    font-size:1.6rem;
    font-weight:500;
    color: #8e4c02;
    margin-right: 0.2rem;
  }
  .invitation i{
    font-size:1.2rem;
    color:#235280;
  }
  .credits-cions{
    font-size:1.2rem;
    color: #8e4c02;
  }
  .credits-cions i{
    color: #235280;
  }
  .InvitationList{
    position: absolute;
    width:9.2rem;
    height:3.4rem;
    border:0.1rem solid #fde07d;
    border-radius: 1.3rem;
    font-size: 1.4rem;
    color: #b56102;
    line-height: 3.4rem;
    text-align: center;
    right: 5.6rem;
    top: 1.3rem;
    box-shadow:0rem 0rem 0.2rem rgba(81, 55, 7, 0.5) inset;
    text-shadow: 0 0 0.1rem rgb(238,134,16);
  }
  .InvitationList img{
    height:2rem;
    margin-top: 0.6rem;
  }
</style>
