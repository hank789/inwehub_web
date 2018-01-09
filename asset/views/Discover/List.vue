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
        <div class="community">顾问社区</div>
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
            <p>动态分享</p>
          </li>
          <li @tap.stop.prevent="$router.pushPlus('/home/ActiveList')">
            <div class="discover-round">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-huodongjiyu"></use>
              </svg>
            </div>
            <p>企业服务</p>
          </li>
          <li @tap.stop.prevent="judge(5)">
            <div class="discover-round">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fujinqiye1"></use>
              </svg>
            </div>
            <p>附近发现</p>
          </li>
        </ul>
        </div>
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
              <p class="answer-fouce" v-else-if="recommend.read_type == '2'">￥: {{recommend.data.price}}<i v-if="recommend.data.average_rate"></i><span v-if="recommend.data.average_rate">好评率{{recommend.data.average_rate}}%</span></p>
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
    mounted () {},
    updated () {
//      console.error(this.list)
//      /EnrollmentStatus/11   活动机遇

    }
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
    height: 1px;
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
    height:100px;
    background: #FFFFFF;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
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
    width: 30px;
    height: 17px;
    font-size: 12px;
    color: #FFFFFF;
    border-radius: 4px;
    background: #fa4975;
    text-align: center;
    line-height:17px;
    top: 22px;
    right: 0px;
  }
  .categoryMenu li:nth-of-type(1) i:after {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background: #fa4975;
    /* border: 1px solid #dcdcdc; */
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    left: -3px;
    top: 0px;
    bottom: 0;
    margin: auto;
  }
  .categoryMenu li .discover-round{
    width:53px;
    height:53px;
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
    font-size:30px;
  }
  .categoryMenu li p{
    font-size:13px;
    color: #808080;
    margin-top: 5px;
  }
/*列表*/
  .recommend{
    width:100%;
    background: #f3f4f6;
    overflow: hidden;
  }
  .recommend_title{
    width:100%;
    padding: 0 4%;
    height:44px;
    font-size:16px;
    color: #444444;
    line-height: 44px;
    background: #FFFFFF;
  }
  .recommend li{
    width:100%;
    padding:15px 4% 13px 4%;
    overflow: hidden;
    background: #FFFFFF;
    margin-bottom: 10px;


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
    border-radius:0 50px 0px 0;
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
    margin-top: 20px;
    color:#444444;
    font-size:15px;
    line-height: 20px;

  }
/*swiper*/
  .container-item{
    background: #FFFFFF;
    margin-bottom: 10px;
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

  #home-recommend {
    width: 100%;
    height: 162px;
    padding-left:4%;
    background: #FFFFFF;
  }

  #home-recommend div:nth-of-type(1) {
    margin-left: 0px;
  }
   #home-card {
    height: 147px;
    background: #ececee;
    position: relative;
    border-radius: 4px;
  }
  #home-card img{
    width:100%;
    height:100%;
    border-radius: 4px;
  }
.listWrapper{
  margin-top: 0px;
  bottom: 51px;
}
/*顾问社区*/
  .community{
    width:100%;
    padding:0 5%;
    height:33px;
    line-height: 43px;
    font-size:16px;
    color: #444444;
    background: #FFFFFF;
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
}
  .answer-fouce i{
    margin: 0;
    display: inline-block;
    width:1px;
    height:12px;
    background: #dbdbdb;
    margin: 0 9px -3px 9px;


  }
</style>
