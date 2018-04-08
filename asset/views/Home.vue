<template>
  <div>
    <div class="mui-content absolute">
        <!--轮播-->
      <div class="mui-slider">
        <div class="mui-slider-group mui-slider-loop">
          <!--支持循环，需要重复图片节点-->
          <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="http://pic1.win4000.com/wallpaper/e/58a54c0ad8c0f.jpg" /></a></div>
          <div class="mui-slider-item"><a href="#"><img src="http://pic1.win4000.com/wallpaper/e/58a54c016800e.jpg" /></a></div>
          <div class="mui-slider-item"><a href="#"> <img src="http://pic1.win4000.com/wallpaper/e/58a54c0548163.jpg" /></a></div>
          <div class="mui-slider-item"><a href="#"> <img src="http://pic1.win4000.com/wallpaper/e/58a54c0d70aa8.jpg" /></a></div>
          <div class="mui-slider-item"><a href="#"> <img src="http://pic1.win4000.com/wallpaper/e/58a54c0ad8c0f.jpg" /></a></div>
          <!--支持循环，需要重复图片节点-->
          <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="http://pic1.win4000.com/wallpaper/e/58a54c016800e.jpg" /></a></div>
        </div>
        <div class="mui-slider-indicator">
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
  const Home = {
    data: () => ({
    }),
    created () {

    },
    components: {
    },
    // 缓存；
    activated: function () {
    },
    mounted () {
//      var gallery = window.mui('.mui-slider')
//      gallery.slider({
//        interval: 5000 // 自动轮播周期，若为0则不自动播放，默认为0；
//      })
    },
    computed: {
    },
    methods: {
    }
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
