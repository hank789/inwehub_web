<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">发现</h1>
    </header>
    <div class="mui-content">
      <!--类别-->
      <ul class="categoryMenu">
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhuanyewenda-"></use>
          </svg>
          <p>专业问答</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-hudongwenda-"></use>
          </svg>
          <p>互动问答</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tijiaowenzhang1"></use>
          </svg>
          <p>发现分享</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-huodongjiyu"></use>
          </svg>
          <p>活动机遇</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fujinqiye1"></use>
          </svg>
          <p>附近企业</p>
        </li>
      </ul>
      <!--swiper-->
      <div class="container-item" >
        <div class="title">
          <p>企业服务</p>
          <p class="more">查看全部</p>
        </div>
        <swiper :options="swiperOption" id="home-recommend">
          <swiper-slide style="width: 220px;" id="home-card">
             <img src="../../statics/images/guide_01.png"/>
          </swiper-slide>
        </swiper>
      </div>

      <!--列表-->
      <ul class="recommend">
        <p class="recommend_title">精选推荐</p>
        <li>
           <div class="container-image">
             <img src="../../statics/images/guide_01.png"  />
             <p class="container_type">活动机遇</p>
           </div>
          <p class="recommend_content mui-ellipsis-2" >客户虐我千百遍，爱意如初永感念。客户虐我千百遍，爱意如初永感念</p>
          <p class="recommend_time">2017/02/14 </p>
        </li>
      </ul>

    </div>
  </div>
</template>
<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    data () {
      return {
        swiperOption: {}
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    props: {},
    created () {
      this.swiperOption = {
        pagination: '.swiper-pagination',
        slidesPerView: 1.66,
        spaceBetween: 10,
        onTap: this.swipperClick
      }
    },
    watch: {},
    mounted () {

    },
    methods: {
      swipperClick (swiper, event) {

      }
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
    right: 0px;
    bottom: 0;
    left: 0px;
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
    background: #03aef9;
    text-align: center;
    line-height: 23px;

  }
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
    margin-left:4%;

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



</style>
