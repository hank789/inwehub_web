<template>
  <div>
    <div class="mui-content absolute">
      <!--search-->
      <div class="search">
        <div class="search-l">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-kefu"></use>
          </svg>
          <p>客服</p>
          <span class="mui-badge">34</span>
        </div>
        <div class="search-r" @tap.stop.prevent="$router.pushPlus('/searchQuestion','list-detail-page-three')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <p>搜内容、问答、圈子</p>
        </div>
      </div>
      <!--轮播-->
      <div id="slider" class="mui-slider mui-fullscreen">
        <div class="mui-slider-group  mui-slider-loop">
          <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="http://img4.imgtn.bdimg.com/it/u=4030994974,1460597878&fm=200&gp=0.jpg" /></a></div>
          <div class="mui-slider-item"><a href="#"><img src="http://img5.imgtn.bdimg.com/it/u=2348549693,626845470&fm=27&gp=0.jpg" /></a></div>
          <div class="mui-slider-item"><a href="#"><img src="http://img0.imgtn.bdimg.com/it/u=3349114606,1031631726&fm=27&gp=0.jpg" /></a></div>
          <div class="mui-slider-item"><a href="#"><img src="http://img0.imgtn.bdimg.com/it/u=3482806277,687126973&fm=27&gp=0.jpg" /></a></div>
          <div class="mui-slider-item"><a href="#"><img src="http://img4.imgtn.bdimg.com/it/u=4030994974,1460597878&fm=200&gp=0.jpg" /></a></div>
          <!--支持循环，需要重复图片节点-->
          <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="http://img5.imgtn.bdimg.com/it/u=2348549693,626845470&fm=27&gp=0.jpg" /></a></div>
        </div>
        <div class="home mui-slider-indicator">
          <div class="mui-indicator mui-active"></div>
          <div class="mui-indicator"></div>
          <div class="mui-indicator"></div>
          <div class="mui-indicator"></div>
        </div>
      </div>
      <!--功能列表-->
      <ul class="categoryMenu">
       <li>
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-zhuanyewenda-"></use>
         </svg>
        <p>问答</p>
       </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wodequanzi-shouye"></use>
          </svg>
          <p>圈子</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhaoguwenyuanshi"></use>
          </svg>
          <p>附近</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fujinqiye1"></use>
          </svg>
          <p>服务</p>
        </li>
        <li>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xunhezuo"></use>
          </svg>
          <p>合作</p>
        </li>
      </ul>
      <div class="gray"></div>
      <!--精选推荐-->
      <ul class="recommend">
        <p class="title">精选推荐</p>
        <li>
          <img src="http://pic1.win4000.com/wallpaper/e/58a54c0ad8c0f.jpg" />
          <div class="text-content">
            <p class="text-line-3">
              <span>专业问答</span>
              那些刺痛PP顾问们的物料单位与规格的问题们的物料单位与规格的问题
            </p>
            <p class="information">
              <span>88浏览<i></i></span>
              <span>88点赞<i></i></span>
              <span>好评率96%</span>
            </p>
          </div>
          <i class="bot"></i>
        </li>
        <div class="more">更多精选推荐</div>
      </ul>
      <!---->
    </div>
  </div>
</template>
<script>
  import {postRequest, apiRequest} from '../utils/request'
  import userAbility from '../utils/userAbility'
  import { autoTextArea, AppInit } from '../utils/plus'
  import { saveLocationInfo } from '../utils/allPlatform'
  const Home = {
    data () {
      return {
      }
    },
    created () {
      this.getHomeData()
    },
    components: {
    },
    // 缓存；
    activated: function () {
    },
    computed: {
    },
    methods: {
      getHomeData () {
        postRequest(`home`, {}, false).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          // 是否弹受邀红包
          if (response.data.data.invitation_coupon.show) {
            userAbility.InvitationCoupon(this)
          }
        })
      }
    },
    mounted () {
      // 轮播
      window.mui('.mui-slider').slider({
        interval: 5000
      })
      // 新手任务
      userAbility.newbieTask(this)
      autoTextArea()
      saveLocationInfo()
      AppInit(this)
    },
  }
  export default Home
</script>

<style lang="less" scoped>
  .mui-content {
    overflow-y: auto;
  }

  div,
  span,
  p,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
  }
  /*search*/
  .search{
    width:92%;
    height:34px;
    margin-left: 4%;
    position: absolute;
    top:8px;
    z-index: 2;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .search-l{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .search-l svg{
    font-size:25px;
    color: rgba(255,255,255,1);
  }
  .search-l p{
    font-size:10px;
    color: rgba(255,255,255,1);
    line-height: 14px;
    margin-bottom: 5px;
  }
  .search-r{
    width: 57%;
    height:100%;
    background:rgba(255,255,255,1);
    opacity:0.9477;
    border-radius: 50px;
    font-size: 14px;
    color:rgba(200,200,200,1);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .search-r svg{
    font-size: 17px;
    color: rgba(68,68,68,1);
    margin-left: 16px;
    margin-right: 6px;
  }
  #slider{
    height:200px;
    background: #cccccc;
    position: relative;
  }
  .categoryMenu{
    width:100%;
    height:80px;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
  .categoryMenu li{
    height:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .categoryMenu li svg{
    font-size:30px;
  }
  .categoryMenu li p{
    font-size:13px;
    color:rgba(128,128,128,1);
    line-height:14px;
    margin-top: 8px;
  }
  /*精选推荐*/
  .recommend{
    width:100%;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .recommend .title{
    width:100%;
    padding-left: 4%;
    margin-top: 11px;
    text-align: left;
    font-size: 16px;
    color: rgba(68,68,68,1);
    font-weight: 500;
  }
  .recommend li{
    width: 92%;
    height:110px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .recommend li img{
    width:121px;
    height:81px;
    border-radius:4px;
    object-fit: cover;
  }
  .recommend li .text-content{
    height:81px;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .text-content p:nth-of-type(1){
    font-size: 14px;
    color: RGBA(68, 68, 68, 1);
    font-weight: 500;
    line-height: 20px;
    height: 65px;
  }
  .text-content p:nth-of-type(1) span{
    display: inline-block;
    font-size: 10px;
    color: RGBA(128, 128, 128, 1);
    background:rgba(236,236,238,1);
    padding: 1px 5px;
    border-radius:4px;
  }
  .information{
    width:100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    color: RGBA(128, 128, 128, 1);
  }
  .information i{
   display: inline-block;
    width:1px;
    height:12px;
    background:RGBA(219, 219, 219, 1);
    margin: 0 10px;
    margin-bottom: -3px;
  }
  .more{
    width:100%;
    text-align: center;
    font-size: 14px;
    font-width:500;
    margin-top: 11px;
    color:rgba(3,174,249,1);
    line-height:20px;
  }
  .gray{
    width:100%;
    height:10px;
    background: #F3F4F5;
  }
</style>
<style>
  .search-l  .mui-badge{
    position: absolute;
    top: 3px;
    right: -108%;
    display: inline-block;
    background: #fa4975;
    color: #fff;
    padding: 0rem 0.08rem;
    min-width: 0.4rem;
    min-height: 0.4rem;
    border-radius: 0.4rem;
    line-height: 0.4rem;
  }
  .home.mui-slider-indicator{
    text-align: right;
    padding-right: 4%;
  }
  .home.mui-slider-indicator .mui-indicator{
    width: 6px;
    height: 6px;
    margin: 0.026rem 5px;
    background: rgba(216,216,216,1);
    -webkit-box-shadow: 0 0 0.026rem 0.026rem rgba(1216,216,216, .7);
     box-shadow: 0 0 0.026rem 0.026rem rgba(216,216,216, .7);
  }
  .home.mui-slider-indicator .mui-active.mui-indicator{
    width: 12px;
    height:6px;
    background:rgba(3,174,249,1);
    border-radius: 50px;
    -webkit-box-shadow: 0 0 0.026rem 0.026rem rgba(3,174,249, .7);
    box-shadow: 0 0 0.026rem 0.026rem rgba(3,174,249, .7);
  }
</style>

<!--<form class="mui-input-group search" >-->
  <!--<div class="mui-input-row">-->
    <!--<svg class="icon" aria-hidden="true">-->
      <!--<use xlink:href="#icon-sousuo"></use>-->
    <!--</svg>-->
    <!--<input type="text" class="mui-input-clear" placeholder="搜内容、问答、圈子">-->
  <!--</div>-->
<!--</form>-->
<!--.mui-input-group{-->
<!--width:57%;-->
<!--height:34px;-->
<!--position: absolute;-->
<!--top: 8px;-->
<!--right: 4%;-->
<!--z-index: 2;-->
<!--background: #ffffff;-->
<!--opacity:0.9477;-->
<!--border-radius: 50px ;-->
<!--}-->
<!--.mui-input-group input{-->
<!--width:83%;-->
<!--height:34px;-->
<!--line-height: 34px;-->
<!--padding: 0 30px 0 0;-->
<!--font-size:14px;-->
<!--color:rgba(68,68,68,1);-->
<!--}-->
<!--.mui-input-group svg{-->
<!--font-size: 17px;-->
<!--color:rgba(68,68,68,1);-->
<!--margin-left: 16px;-->
<!--}-->
<!--<style>-->
  <!--.search .mui-input-row .mui-input-clear ~ .mui-icon-clear{-->
    <!--width:30px;-->
    <!--height: 30px;-->
    <!--top: 13%;-->
    <!--text-align: left;-->
  <!--}-->
<!--</style>-->
