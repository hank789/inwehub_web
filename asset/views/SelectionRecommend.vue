<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">精选推荐</h1>
    </header>

    <div class="mui-content">

      <!--列表-->
      <RefreshList
        v-model="list"
        :api="'recommendRead'"
        :pageMode="true"
        :prevOtherData="{page: 1}"
        :nextOtherData="{}"
        :isShowUpToRefreshDescription="false"
        class="listWrapper">
        <!--类别-->

        <!--<ServiceRecommendation @alertClick="alertClick"></ServiceRecommendation>-->
        <ul class="recommend">
          <p class="recommend_title">精选推荐</p>
          <li v-for="(recommend, index) in list"  @tap.stop.prevent="goDetial(recommend.read_type,recommend)">
            <div class="container-image">
              <img :src="recommend.data ? recommend.data.img:''"  />
            </div>
            <p class="recommend_content mui-ellipsis-2" >{{recommend.data ? recommend.data.title:''}}</p>
            <!--<p class="recommend_time">{{recommend.created_at}}</p>-->
            <div class="recommend_datail">
              <p class="container_type yellow" v-if="recommend.read_type == '1'">动态分享</p>
              <p class="container_type blue"  v-else-if="recommend.read_type == '2'">专业问答</p>
              <p class="container_type blue"  v-else-if="recommend.read_type == '3'">互动提问</p>
              <p class="container_type pink"  v-else-if="recommend.read_type == '4' || recommend.read_type == '5'">活动机遇</p>
              <p class="container_type blue"  v-else-if="recommend.read_type == '6'">互动回答</p>
              <p class="answer-fouce" v-if="recommend.read_type == '3'">{{recommend.data.answer_number}}人回答<i></i>{{recommend.data.follower_number}}关注</p>
              <p class="answer-fouce" v-else-if="recommend.read_type == '2'">￥: {{recommend.data.price}}<i v-if="recommend.data.average_rate"></i><span v-if="recommend.data.average_rate">好评率{{recommend.data.average_rate}}</span></p>
              <p class="answer-fouce" v-else-if="recommend.read_type == '6' || recommend.read_type == '1'">{{recommend.data.comment_number}}评论<i></i>{{recommend.data.support_number}}赞</p>
            </div>
          </li>
        </ul>
      </RefreshList>

    </div>
  </div>
</template>
<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { postRequest } from '../utils/request'
  import RefreshList from '../components/refresh/List.vue'
  import userAbility from '../utils/userAbility'
  import ServiceRecommendation from '../components/feed/ServiceRecommendation'
  import localEvent from '../stores/localStorage'
  import { goThirdPartyArticle } from '../utils/webview'
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        swiperOption: {},
        servicesList: [],
        list: [],
        invitationList: [],
        is_company: currentUser.is_company
      }
    },
    components: {
      swiper,
      swiperSlide,
      RefreshList,
      ServiceRecommendation
    },
    props: {},
    watch: {},
    methods: {
      getInvitation () {
        postRequest(`rank/userInfo`, {}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            this.invitationList = response.data.data
          }
        })
      },
      judge (type) {
        postRequest(`auth/checkUserLevel`, {
          permission_type: type
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
//          console.error(response.data.data.is_valid)
          if (response.data.data) {
            if (response.data.data.is_valid) {
              switch (type) {
                case 1:
                  this.$router.pushPlus('/askCommunity/majors')
                  break
                case 2:
                  this.$router.pushPlus('/askCommunity/interactions')
                  break
//                case 4:
//                  this.$router.pushPlus('my/Discount')
//                  break
                case 5:
                  this.$router.pushPlus('/nearbyCompany')
                  break
                default:
              }
            } else {
              userAbility.jumpJudgeGrade(this)
            }
          }
        })
      },
      goDetial (type, recommend) {
        switch (type) {
          case 1:
            if (recommend.data.type === 'link') {
              goThirdPartyArticle(
                recommend.data.url,
                recommend.source_id,
                recommend.data.title,
                '/c/' + recommend.data.category_id + '/' + recommend.data.slug,
                recommend.data.img
              )
            } else {
              this.$router.pushPlus('/c/' + recommend.data.category_id + '/' + recommend.data.slug)
            }
            break
          case 2:
            this.$router.pushPlus('/askCommunity/major/' + recommend.source_id)
            break
          case 3:
            this.$router.pushPlus('/askCommunity/interaction/answers/' + recommend.source_id)
            break
          case 4:
            this.$router.pushPlus('/EnrollmentStatus/' + recommend.source_id)
            break
          case 5:
            this.$router.pushPlus('/EnrollmentStatus/' + recommend.source_id)
            break
          case 6:
            this.$router.pushPlus('/askCommunity/interaction/' + recommend.source_id)
            break
          default:

        }
      }
    },
    mounted () {
      this.getInvitation()
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
    background: #f3f4f6;
  }

  /*列表*/
  .recommend{
    width:100%;
    background: #FFFFFF;
    overflow: hidden;
  }
  .recommend_title{
    width:100%;
    padding: 0 4%;
    height:4.4rem;
    font-size:1.6rem;
    color: #444444;
    line-height: 4.4rem;
    background: #FFFFFF;
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
