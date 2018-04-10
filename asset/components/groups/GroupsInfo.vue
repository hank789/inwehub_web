<template>
  <div>
    <div class="groups-title">
      <div class="groups-left">
        <img src="../../statics/images/guide_01.png"/>
        <p>丁冉</p>
        <p><i></i>圈主</p>
      </div>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-gengduo"></use>
      </svg>
      <i class="bot"></i>
    </div>
    <div class="tag-title">
      <div class="tag-l" >
        <img src="../../statics/images/guide_01.png">
      </div>
      <!--<div class="tag-l bg-grey">-->
      <!--<svg class="icon" aria-hidden="true">-->
      <!--<use xlink:href="#icon-biaozhunlogoshangxiayise"></use>-->
      <!--</svg>-->
      <!--</div>-->
      <div class="tag-r">
        <p>供应链</p>
        <p class="tag-info">
            <span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-simi"></use>
             </svg>
              私密
            </span>
          <span><i>12</i>/人气</span>
          <span><i>12</i>/分享</span>
        </p>
        <div class="tag-avatar">
          <div class="avatar">
            <img src="../../statics/images/guide_01.png"/>
            <img src="../../statics/images/guide_01.png"/>
            <img src="../../statics/images/guide_01.png"/>
          </div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    components: {
    },
    props: {},
    watch: {},
    methods: {

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
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right:5%;
    bottom: 0;
    left:5%;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .groups-title{
    width:100%;
    height:45px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .groups-title svg{
    font-size: 17px;
    color:rgba(128,128,128,1);
    margin-right: 4%;

  }
  .groups-left{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 4%;
  }
  .groups-left img{
    width:20px;
    height:20px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .groups-left p:nth-of-type(1){
    font-size:14px;
    color:rgba(86,86,86,1);
    margin-right: 7px;
  }
  .groups-left p:nth-of-type(2) {
    width: 38px;
    height: 18px;
    background: rgba(168, 223, 247, 1);
    border-radius: 6px;
    font-size: 12px;
    color: rgba(35,82,128,1);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .groups-left p:nth-of-type(2) i{
    display: inline-block;
    width:3px;
    height:3px;
    border-radius: 50%;
    background: #ffffff;
    margin: 0 3px;
  }
  .tag-title{
    width:100%;
    height:123px;
    background: #ffffff;
    padding: 1.5rem 4% 1.4rem 4%;
    /*padding: 0 4%;*/
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tag-l{
    width:92px;
    height:92px;
  }
  .tag-l img{
    width: 100%;
    height:100%;
    border-radius: 0.106rem;
  }
  .tag-l.bg-grey{
    background: #ececee;
    border-radius: 0.106rem;
    position: relative;
  }
  .tag-l.bg-grey svg{
    color: #c8c8c8;
    font-size: 1.333rem;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin:auto;
  }

  .tag-r{
    height:92px;
    margin-left: 0.266rem;
  }
  .tag-r p:nth-of-type(1){
    font-size:18px;
    color: rgba(68,68,68,1);
    font-weight:500;
    margin-bottom: 8px;
  }
  .tag-info{
    width:100%;
    font-size: 12px;
    color:rgba(180,180,182,1);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tag-info span{
    margin-right: 13px;
  }
  .tag-info span svg{
    font-size: 13px;
    color:rgba(180,180,182,1);
  }
  .tag-info span i{
    font-size: 14px;
    font-weight: 500;
    color: rgba(3,174,249,1);
  }
  .tag-avatar{
    width:100%;
    height:37px;
    border:1px solid rgba(220, 220, 220, 1);
    border-radius: 50px;
    padding: 0 4%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
  }
  .tag-avatar .avatar{
    width: 85%;
    height:100%;
    overflow: hidden;
  }
  .tag-avatar .avatar img{
    width:20px;
    height:20px;
    border-radius: 50%;
    margin-right: 2%;
    margin-bottom: -8px;
  }
  .tag-avatar svg{
    margin-right:13px;
    color: #808080;
  }
  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 375px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 414px) {
    .tag-r {
      width: 73%;
    }
  }
</style>
