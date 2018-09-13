<template>
<div>
  <div class="mui-content">
     <div class="search">
       <p>
         <svg class="icon" aria-hidden="true">
           <use xlink:href="#icon-sousuo"></use>
         </svg>
         <input  type="text" id="searchText" v-model.trim="searchText"/>
         <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShow">
           <use xlink:href="#icon-times1"></use>
         </svg>
       </p>
       <p @tap.stop.prevent="back()">取消</p>
     </div>
    <!--导航栏-->
    <div class="menu">
      <span @tap.stop.prevent="$router.replace('/searchSubmission?text=' + searchText)">分享</span>
      <span @tap.stop.prevent="" class="font-family-medium">问答<i></i></span>
      <span @tap.stop.prevent="$router.replace('/group/search?text=' + searchText)">圈子</span>
      <i class="bot"></i>
    </div>

    <!--搜索列表-->
    <RefreshList
      v-if="dataList != null"
      v-model="list"
      :api="'search/question'"
      :pageMode="true"
      :prevOtherData="dataList"
      :nextOtherData="dataList"
      :autoShowEmpty="false"
      :isShowUpToRefreshDescription="false"
      class="listWrapper">
      <AskCommunityListItem
        :list= "list"
        :searchText = "searchText"
      >
      </AskCommunityListItem>


      <div class="noResult" :class="!list.length ? 'increase' : ''">
        <svg class="icon addressIcon" aria-hidden="true">
          <use xlink:href="#icon-zanwushuju"></use>
        </svg>
        <div class="noResultText" v-if="list.length">无更多结果，快来发布相关分享~</div>
        <div class="noResultText" v-else>无更多结果，快来发布相关分享~</div>
        <div class="goRelease" @tap.stop.prevent="$router.pushPlus('/ask')">去提问</div>
      </div>
      <div class="line-river-big" v-if="list.length"></div>

    </RefreshList>

  </div>
</div>
</template>


<script type="text/javascript">
  import { searchText } from '../../utils/search'
  import RefreshList from '../../components/refresh/List.vue'
  import AskCommunityListItem from '../../components/AskCommunity/AskCommunityListItem'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        user_level: currentUser.user_level,
        searchText: '',
        dataList: null,
        list: [],
        isShow: false
      }
    },
    components: {
      RefreshList,
      AskCommunityListItem
    },
    created () {
      var text = this.$route.query.text
      if (text) {
        this.searchText = text
      }
    },
    watch: {
      searchText: function (newValue) {
//        if (this.user_level >= 3) {
        if (newValue) {
          searchText(newValue, (text) => {
            this.dataList = {
              search_word: newValue
            }
          })
          this.isShow = true
        } else {
          this.isShow = false
        }
//        } else {
//          userAbility.jumpJudgeGrade(this)
//        }
      }
    },
    mounted () {
      var searchText = this.$el.querySelector('#searchText')
      if (searchText) {
        setTimeout(() => {
          searchText.focus()
        }, 800)
      }
    },
    methods: {
      back () {
        window.mui.back()
        return
      },
      //  点击清空输入框
      empty () {
        this.searchText = ''
      }
    }
  }
</script>

<style lang="less" scoped>

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #ffffff;
    .listWrapper{
      top: 2.346rem;
    }
    .search{
      width:100%;
      padding: 0 0.426rem;
      display: flex;
      height:1.173rem;
      margin-top: 0.133rem;
      flex-direction: row;
      align-items: center;
      background: #ffffff;
      justify-content: space-between;
      p{
        &:nth-of-type(1){
          width: 7.813rem;
          height:0.906rem;
          border-radius: 1.333rem;
          background: #f3f4f6;
          border:0.026rem solid #dcdcdc;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.266rem;
          svg{
            color: #c8c8c8;
            &:nth-of-type(1){
              font-size: 0.48rem;
            }
            &:nth-of-type(2){
              margin-left: 0.266rem;
              font-size: 0.533rem;
            }
          }
          input{
            margin-top: 0.4rem;
            height:0.853rem;
            border: none;
            background: #f3f4f6;
            font-size: 0.373rem;
            color: #444444;
          }
        }
        &:nth-of-type(2){
          width: 1.066rem;
          font-size: 0.4rem;
          color: #03aef9;
          text-align: right;
          line-height: 0.56rem;
        }
      }
    }
    /*导航栏的样式*/
    .menu{
      width:100%;
      height:1.04rem;
      background: #ffffff;
      font-size:0.373rem;
      color: #444444;
      display: flex;
      flex-direction: row;
      position: relative;
      span{
        display: flex;
        width:33%;
        height:100%;
        justify-content: center;
        align-items: center;
        &:nth-of-type(2){
          font-size: 0.373rem;
          position:relative;
          color: #444444;
          font-weight: 500;
          i{
            position:absolute;
            width:0.72rem;
            height:0.053rem;
            border-radius: 1.333rem;
            background:#03aef9;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }
  }

  .increase {
    position: relative;
    z-index: 1000;
    top: 3.173rem;
  }

</style>
