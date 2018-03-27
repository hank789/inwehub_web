<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答社区</h1>
    </header>


    <div class="mui-content absolute">
          <!--提问-->
           <div class="ask" @tap.stop.prevent="$router.pushPlus('/ask')">
             <div class="ask_img">
               <i>分红</i>
               <span>我要提问</span>
             </div>
           </div>
          <!--推荐问答 -->
          <RefreshList
            ref="RefreshList"
            v-model="list"
            :api="'question/list'"
            :pageMode = true
            :prevOtherData="dataList"
            :nextOtherData="{}"
            class="listWrapper"
          >
            <AskCommunityListItem
              :list= "list">
            </AskCommunityListItem>
          </RefreshList>
         <div class="switch"  @tap.stop.prevent="orderBy()">
           <svg class="icon" aria-hidden="true">
             <use xlink:href="#icon-shaixuanpaixu_"></use>
           </svg>
           {{sort === 2 ? '最热' : '最新'}}
         </div>
        </div>
      </div>

</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import AskCommunityListItem from '../../components/AskCommunity/AskCommunityListItem'

  const MajorList = {
    data: () => ({
      list: [],
      tags: [],
      sort: 1,
      dataList: {}
    }),
    computed: {
    },
    created () {
      this.dataList = {
        page: 1,
        order_by: this.sort
      }
    },
    components: {
      RefreshList,
      AskCommunityListItem
    },
    methods: {
      orderBy () {
        if (this.sort === 1) {
          this.sort = 2
        } else {
          this.sort = 1
        }
        this.dataList = {
          page: 1,
          order_by: this.sort
        }
      }
    },
    mounted () {
    }
  }
  export default MajorList
</script>

<style lang="less" scoped>
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

  .bot {
    position: absolute;
    right: 4%;
    bottom: 0;
    left: 4%;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }


  /*滚动区域*/
  .mui-content {
    background: #ffffff;
    .ask{
      width:100%;
      height:0.906rem;
      padding: 0 4%;
      .ask_img{
        width:100%;
        height:100%;
        background: #cccccc;
        position: relative;
        background: url("../../statics/images/askCommunity_bg@3x.png") no-repeat;
        background-size: cover;
        span{
          position: absolute;
          font-size: 0.373rem;
          color: #444444;
          left: 1.6rem;
          line-height: 0.96rem;
        }
        i{
          display: inline-block;
          font-style: normal;
          width: 0.8rem;
          height: 0.453rem;
          font-size: 0.32rem;
          color: #FFFFFF;
          border-radius: 0.106rem;
          background: #fa4975;
          text-align: center;
          line-height: 0.453rem;
          position: absolute;
          top: 0.24rem;
          left: 0.53rem;
          &::after {
            content: "";
            display: block;
            width: 0.16rem;
            height: 0.16rem;
            background: #fa4975;
            position: absolute;
            -webkit-transform: rotate(135deg);
            transform: rotate(135deg);
            right: -0.08rem;
            top: 0rem;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }
    .listWrapper{
      top:0.906rem
    }
    .switch{
      position: fixed;
      width:74px;
      height:34px;
      background: #444444;
      box-shadow: 0px 1px 10px 0px rgba(205,215,220,0.5);
      opacity:0.85;
      border-radius:50px;
      font-size:15px;
      color: #FFFFFF;
      bottom: 20px;
      right:16px;
      z-index: 9;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      svg{
        font-size: 17px;
        margin-right: 3px;
      }
    }
  }


</style>

