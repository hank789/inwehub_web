<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">发现</h1>
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
        <div class="discover-container">
          <ul class="categoryMenu">
            <li @tap.stop.prevent="judge(1)">
              <div class="discover-round">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanyewenda-"></use>
                </svg>
              </div>
              <p>问答社区</p>
              <i>分红</i>
            </li>
            <li @tap.stop.prevent="$router.pushPlus('/discover/hottopic')">
              <div class="discover-round">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-tijiaowenzhang1"></use>
                </svg>
              </div>
              <p>文章分享</p>
            </li>
            <li @tap.stop.prevent="$router.pushPlus('/discover/company/services')">
              <div class="discover-round">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fujinqiye1"></use>
                </svg>
              </div>
              <p>企业服务</p>
            </li>
            <li @tap.stop.prevent="$router.pushPlus('/nearbyCompany')">
              <div class="discover-round">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhaoguwenyuanshi"></use>
                </svg>
              </div>
              <p>附近发现</p>
            </li>
          </ul>
        </div>


        <div class="mostInvitations"  v-if="invitationList.show_rank" @tap.stop.prevent="$router.pushPlus('/invitationList')">
          <div class="invitation"><span>{{invitationList.user_name}}</span>本月邀请<i>{{invitationList.current_month_invited_users}}</i>人</div>
          <div class="credits-cions">贡献值<i>{{invitationList.user_coins}}</i>&nbsp;&nbsp;|&nbsp;&nbsp;本月获赞<i>{{invitationList.current_month_user_upvotes}}</i></div>
          <div class="InvitationList" >
            <img src="../../statics/images/discover-invitation-list2x.png" />
          </div>
          <img src="../../statics/images/goldmedal@2x.png" class="Medal"/>
        </div>
        <div class="grey" v-else></div>


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
              <p class="container_type yellow" v-if="recommend.read_type == '1'">文章分享</p>
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
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import userAbility from '../../utils/userAbility'
  import ServiceRecommendation from '../../components/feed/ServiceRecommendation'
  import localEvent from '../../stores/localStorage'
  import { goThirdPartyArticle } from '../../utils/webview'
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
//      alertClick (title) {
//        if (this.is_company) {
//          alertCompanyUser(this, () => {
//            postRequest(`company/applyService`, {
//              service_title: title
//            }).then(response => {
//              var code = response.data.code
//              // 如果请求不成功提示信息 并且返回上一页；
//              if (code !== 1000) {
//                window.mui.alert(response.data.message)
//                window.mui.back()
//                return
//              }
//              if (response.data.data) {
//                window.mui.toast(response.data.data.tips)
//              }
//            })
//          })
//        } else {
//          alertDiscoverCompany(this)
//        }
//      },
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
          if (response.data.data) {
            if (response.data.data.is_valid) {
              switch (type) {
                case 1:
                  this.$router.pushPlus('/askCommunity/majors')
                  break
                case 2:
                  this.$router.pushPlus('/askCommunity/interactions')
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
  .bot {
    position: absolute;
    right:5%;
    bottom: 0;
    left:5%;
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .discover-container{
    background: #FFFFFF;
  }

/*菜单栏*/
  .categoryMenu{
    width:100%;
    height:10rem;
    background: #FFFFFF;
    display: flex;
    flex-direction: row;
  }

  .categoryMenu li{
    display: flex;
    flex-direction:column ;
    justify-content:center;
    align-items:center;
    flex:1;
  }
  .categoryMenu li:nth-of-type(1){
    position: relative;
  }
  .categoryMenu li:nth-of-type(1) i{
    position: absolute;
    font-style: normal;
    width: 3rem;
    height: 1.7rem;
    font-size: 1.2rem;
    color: #FFFFFF;
    border-radius: 0.4rem;
    background: #fa4975;
    text-align: center;
    line-height:1.7rem;
    top: 2.2rem;
    right: 0rem;
  }
  .categoryMenu li:nth-of-type(1) i:after {
    content: "";
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    background: #fa4975;
    /* border: 0.1rem solid #dcdcdc; */
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -0.3rem;
    top: 0rem;
    bottom: 0;
    margin: auto;
  }
  .categoryMenu li .discover-round{
    width:5.3rem;
    height:5.3rem;
    /*background: #03aef9;*/
    border-radius: 50%;
    display: flex;
    flex-direction:column ;
    justify-content:center;
    align-items:center;
    background: -webkit-linear-gradient(rgb(89, 195, 253), rgb(113, 210, 253)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(89, 195, 253), rgb(113, 210, 253)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(89, 195, 253), rgb(113, 210, 253)); /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(89, 195, 253), rgb(113, 210, 253)); /* 标准的语法 */
  }
  .categoryMenu li svg{
    font-size:3rem;
  }
  .categoryMenu li p{
    font-size:1.3rem;
    color: #808080;
    margin-top: 0.5rem;
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
/*swiper*/
  .container-item{
    background: #FFFFFF;
    margin-bottom: 1rem;
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

  #home-recommend {
    width: 100%;
    height: 16.2rem;
    padding-left:4%;
    background: #FFFFFF;
  }

  #home-recommend div:nth-of-type(1) {
    margin-left: 0rem;
  }
   #home-card {
    height: 14.7rem;
    background: #ececee;
    position: relative;
    border-radius: 0.4rem;
  }
  #home-card img{
    width:100%;
    height:100%;
    border-radius: 0.4rem;
  }
.listWrapper{
  margin-top: 0rem;
  bottom: 5.1rem;
}
/*顾问社区*/
  .community{
    width:100%;
    padding:0 5%;
    height:3.3rem;
    line-height: 4.3rem;
    font-size:1.6rem;
    color: #444444;
    background: #FFFFFF;
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
  .grey{
    width:100%;
    height:1rem;
  }
</style>
