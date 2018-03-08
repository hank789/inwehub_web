<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答社区</h1>
    </header>


    <div class="mui-content absolute">
          <!--推荐问答 -->
          <RefreshList
            ref="RefreshList"
            v-model="list"
            :api="'question/list'"
            :pageMode = true
            :prevOtherData="{page: 1}"
            :nextOtherData="{}"
            class="listWrapper"
          >
            <AskCommunityListItem
              :list= "list">
            </AskCommunityListItem>
          </RefreshList>
          <div>
            <div class="quiz"  @tap.stop.prevent="$router.pushPlus('/ask')">
              <i>分红</i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhuanyewenda-"></use>
              </svg>
              提问
            </div>
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
      tags: []
    }),
    computed: {
    },
    components: {
      RefreshList,
      AskCommunityListItem
    },
    methods: {
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
  .quiz{
    position: fixed;
    z-index: 9;
    width:5.066rem;
    height:1.173rem;
    border-radius: 1.333rem;
    background: #03aef9;
    bottom: 0.4rem;
    left:0;
    right:0;
    margin: auto;
    text-align: center;
    line-height:1.173rem;
    font-size: 0.426rem;
    color: #ffffff;
    svg{
      font-size: 0.666rem;
      margin-bottom: -0.106rem;
    }
    i{
      position: absolute;
      font-style: normal;
      width: 0.8rem;
      height: 0.453rem;
      font-size: 0.32rem;
      color: #FFFFFF;
      border-radius: 0.106rem;
      background: #fa4975;
      text-align: center;
      line-height: 0.453rem;
      top: 0.266rem;
      left: 0.64rem;
        &::after {
        content: "";
        display: block;
        width: 0.16rem;
        height: 0.16rem;
        background: #fa4975;
        /* border: 0.026rem solid #dcdcdc; */
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


</style>

