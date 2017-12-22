<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
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
        <div class="community">
          顾问社区<i class="bot"></i>
        </div>
        <ul class="categoryMenu">
          <li @tap.stop.prevent="judge(1)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanyewenda-"></use>
            </svg>
            <p>专业问答</p>
            <i>分红</i>
          </li>
          <li @tap.stop.prevent="judge(2)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-hudongwenda-"></use>
            </svg>
            <p>互动问答</p>
          </li>
          <li @tap.stop.prevent="$router.pushPlus('/discover/hottopic')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tijiaowenzhang1"></use>
            </svg>
            <p>动态分享</p>
          </li>
          <li @tap.stop.prevent="$router.pushPlus('/home/ActiveList')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-huodongjiyu"></use>
            </svg>
            <p>活动机遇</p>
          </li>
          <li @tap.stop.prevent="judge(5)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fujinqiye1"></use>
            </svg>
            <p>附近企业</p>
          </li>
        </ul>
        <ServiceRecommendation @alertClick="alertClick"></ServiceRecommendation>
        <ul class="recommend">
          <p class="recommend_title">精选推荐</p>
          <li v-for="(recommend, index) in list"  @tap.stop.prevent="goDetial(recommend.read_type,recommend)">
             <div class="container-image">
               <img :src="recommend.data ? recommend.data.img:''"  />
               <p class="container_type yellow" v-if="recommend.read_type == '1'">动态分享</p>
               <p class="container_type blue" v-if="recommend.read_type == '2'">专业问答</p>
               <p class="container_type blue" v-if="recommend.read_type == '3'">互动提问</p>
               <p class="container_type pink" v-if="recommend.read_type == '4' || recommend.read_type == '5'">活动机遇</p>
               <p class="container_type blue" v-if="recommend.read_type == '6'">互动回答</p>
               <!--<p class="container_type blue" v-if="recommend.read_type == '5'">互动提问</p>-->
             </div>
            <p class="recommend_content mui-ellipsis-2" >{{recommend.data ? recommend.data.title:''}}</p>
            <p class="recommend_time">{{recommend.created_at}}</p>
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
  import { alertCompanyUser, alertDiscoverCompany } from '../../utils/dialogList'
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
      alertClick (title) {
        if (this.is_company) {
          alertCompanyUser(this, () => {
            postRequest(`company/applyService`, {
              service_title: title
            }).then(response => {
              var code = response.data.code
              // 如果请求不成功提示信息 并且返回上一页；
              if (code !== 1000) {
                window.mui.alert(response.data.message)
                window.mui.back()
                return
              }
              if (response.data.data) {
                window.mui.toast(response.data.data.tips)
              }
            })
          })
        } else {
          alertDiscoverCompany(this)
        }
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

/*菜单栏*/
  .categoryMenu{
    width:100%;
    height:92px;
    background: #FFFFFF;
    padding: 0 4%;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
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
    top: 19px;
    right: -7px;
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
  .categoryMenu li{
    display: flex;
    flex-direction:column ;
    justify-content:center;
    align-items:center;
    flex:1;
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
    padding:15px 4% 0 4%;
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
    position: absolute;
    top:15.5px;
    left:0;
    width: 68.5px;
    height:23px;
    opacity: 0.7;
    border-radius:0 50px 50px 0;
    text-align: center;
    line-height: 23px;
    color: #FFFFFF;
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
  .recommend_time{
    width:100%;
    height:34.5px;
    background:#FFFFFF;
    font-size:12px;
    color:#b4b4b6;
    text-align: right;
    line-height:34.5px;
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
    height:43px;
    line-height: 43px;
    font-size:16px;
    color: #444444;
    position:relative;
    background: #FFFFFF;
  }

</style>
