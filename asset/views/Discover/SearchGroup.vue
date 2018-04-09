<template>
  <div>
    <div class="mui-content">
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
      <!--菜单-->
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/searchFollow')">关注</span>
        <span class="bold">圈子<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchRecommend')">推荐</span>
        <i class="bot"></i>
      </div>
      <!---->
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
    updated () {
    }
  }
</script>

<style scoped="scoped">
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
    margin-top: 8px;
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
    color: rgba(200,200,200,1);
  }
  .search-l p{
    font-size:10px;
    color: rgba(128,128,128,1);
    line-height: 14px;
    margin-bottom: 5px;
  }
  .search-r{
    width: 57%;
    height:100%;
    background:rgba(243,244,246,1);
    opacity:0.9477;
    border-radius: 50px;
    font-size: 14px;
    color:rgba(128,128,128,1);
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
  /*菜单*/
  /*菜单*/
  .menu{
    width:100%;
    height: 1.173rem;
    background: #FFFFFF;
    font-size:14px;
    color:rgba(68,68,68,1);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: absolute;
  }
  .menu span{
    position:relative;
    margin-bottom: -0.293rem;
  }
  .menu span.bold{
    font-weight: 500;
  }
  .menu span  i{
    position:absolute;
    width: 0.7rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.67rem;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>
