<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">圈子</h1>
    </header>
    <div class="mui-content">
      <!--圈子详情-->
      <GroupsInfo></GroupsInfo>
      <div class="gray"></div>
      <!--导航栏-->
      <div class="menu">
        <span :class="{bold: search_type === 1}" @tap.stop.prevent="chooseType(1)">全部<i v-if="search_type === 1"></i></span>
        <span :class="{bold: search_type === 2}" @tap.stop.prevent="chooseType(2)">圈住<i v-if="search_type === 2"></i></span>
        <span :class="{bold: search_type === 3}" @tap.stop.prevent="chooseType(3)">精华<i v-if="search_type === 3"></i></span>
        <i class="bot"></i>
      </div>
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        :list="list"
        class="listWrapper"
      >
        <div v-for="(item, index) in list" class="groups-list">
          <SubmitReadhubAriticle v-if="item.feed_type === 5 && item.feed.domain !== ''" :data="item"
                                 @comment="comment"
          ></SubmitReadhubAriticle>
        </div>
      </RefreshList>


    </div>
  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import GroupsInfo from '../../components/groups/GroupsInfo.vue'
  import SubmitReadhubAriticle from '../../components/feed/SubmitReadhubAriticle'
  export default {
    data () {
      return {
        list: [],
        search_type: 1
      }
    },
    computed: {
      prevOtherData () {
        return {id: 1, type: this.search_type}
      },
      nextOtherData () {
        return {id: 1, type: this.search_type}
      }
    },
    components: {
      RefreshList,
      GroupsInfo,
      SubmitReadhubAriticle
    },
    props: {},
    watch: {},
    methods: {
      chooseType (type) {
        this.list = []
        this.search_type = type
      }
    },
    mounted () {
    },
    updated () {}
  }
</script>

<style scoped="scoped">
  /*清掉自带样式*/
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
    right:0;
    bottom: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .gray{
    width:100%;
    height:10px;
    background: #f3f4f6;
  }
  .listWrapper[data-v-25ee4214] {
    top: 226px;
  }
  /*菜单*/
  .menu{
    width:100%;
    height: 1.173rem;
    background: #FFFFFF;
    font-size:0.373rem;
    color: #444444;
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
    width:0.746rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.67rem;
    left: 0;
    right: 0;
    margin: auto;
  }
  .groups-list{

  }
</style>
