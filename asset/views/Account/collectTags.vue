<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的关注</h1>
    </header>


    <!--组件-->
    <div class="mui-content">
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/collectUser')">用户</span>
        <span @tap.stop.prevent="$router.replace('/collectQuestion')">问答</span>
        <span @tap.stop.prevent="$router.replace('')">标签<i></i></span>
        <i class="bot"></i>
      </div>
      <!--内容区域-->
      <!--<RefreshList-->
        <!--ref="RefreshList"-->
        <!--v-model="list"-->
        <!--:api="'followed/questions'"-->
        <!--:prevOtherData="{}"-->
        <!--:nextOtherData="{}"-->
        <!--class="listWrapper">-->
      <!--</RefreshList>-->

        <ul>
          <li class="tag-title">
            <div class="tag-l">
              <img src="../../statics/images/guide_01.png">
            </div>
            <!--<div class="tag-l bg-grey">-->
              <!--<svg class="icon" aria-hidden="true">-->
                <!--<use xlink:href="#icon-biaozhunlogoshangxiayise"></use>-->
              <!--</svg>-->
            <!--</div>-->
            <div class="tag-r">
              <p>
                <span>供应链</span>
              </p>
              <p class="mui-ellipsis-3">供应链的概念是从扩大的生产概念发展而来，现代管理教育对供应链的定义为“供应链是围绕核心企业，通过对商流、信息流、物流...
                资金
                控制，从采购原材料开始到制成中间产品及最终产品、最后由销售网络把产品送到消费者手中的一个由供应商、制造商、分销商（零售商，批发商等）直到最终用户所连成的整体功能网链结构”。
                中文名 供应链 外文名 Supply Chain</p>
            </div>
            <i class="bott"></i>
          </li>
        </ul>
    </div>
    <!---->

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  const PublishAnswers = {
    data: () => ({
      list: []
    }),
    created () {
    },
    computed: {},
    components: {
      RefreshList
    },
    methods: {
    },
    mounted () {
    },
    updated () {
    }
  }
  export default PublishAnswers
</script>

<style scoped="scoped">
  .mui-wechat .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    top: 0;
  }

  .mui-content {
    background: #FFFFFF;
  }

  /*导航栏的样式*/
  .menu{
    width:100%;
    height:39px;
    font-size:14px;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  .menu span:nth-of-type(3){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(3) i{
    position:absolute;
    width:27px;
    height:1.5px;
    border-radius: 50px;
    background:#03aef9;
    top: 28px;
    left: 0;
    right: 0;
    margin: auto;
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
  .bott {
     position: absolute;
     right: 4%;
     bottom: 0;
     left: 4%;
     height: 1px;
     -webkit-transform: scaleY(.5);
     transform: scaleY(.5);
     background-color: rgb(220, 220, 220);
   }

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

  /*滚动区域*/
  .tag-title{
    width:100%;
    height:133px;
    padding: 0 4%;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }
  .tag-l{
    width:92px;
    height:92px;
  }
  .tag-l img{
    width: 100%;
    height:100%;
    border-radius: 4px;
  }
  .tag-l.bg-grey{
    background: #ececee;
    border-radius: 4px;
    position: relative;
  }
  .tag-l.bg-grey svg{
    color: #c8c8c8;
    font-size: 50px;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin:auto;
  }

  .tag-r{
    height:92px;
    margin-left: 10px;
  }
  .tag-r p:nth-of-type(1){
    font-size:18px;
    color: #444444;
    font-weight:500;
  }

  .tag-r p:nth-of-type(2){
    margin-top: 11px;
    font-size: 12px;
    color: #808080;
    line-height: 18px;
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
  .listWrapper{
    top:177px;
  }

  /*listWrapper*/
  .listWrapper {
    top: 45px;
  }
</style>
