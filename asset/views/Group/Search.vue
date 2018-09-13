<template>
  <div>
    <div class="mui-content">
      <div class="search">
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder=""   v-model.trim="searchText" />
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShow">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p @tap.stop.prevent="back()">取消</p>
      </div>
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/searchSubmission?text=' + searchText)">分享</span>
        <span @tap.stop.prevent="$router.replace('/searchQuestion?text=' + searchText)">问答</span>
        <span class="font-family-medium">圈子<i></i></span>
        <i class="bot"></i>
      </div>
      <RefreshList
        v-if="dataList != null"
        v-model="list"
        :api="'search/group'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        :autoShowEmpty="false"
        :isShowUpToRefreshDescription="false"
        class="listWrapper">
          <div class="group-container" v-for="(item, index) in list" v-if="list.length">
            <div class="component-group" @tap.stop.prevent="$router.pushPlus('/group/detail/' + item.id)">
              <div class="groupLogo">
                <img class="lazyImg" v-lazy="item.logo" />
              </div>
              <div class="groupContent">
                <div class="groupName">
                  <span class="font-family-medium text-line-1" v-html="getHighlight(item.name)"></span>
                  <span v-if="item.is_joined === 3">圈主</span>
                </div>
                <span class="groupDescribe text-line-1">{{item.description}}</span>
                <span class="groupText">{{item.subscribers}}人气</span>
                <span class="groupText">{{item.articles}}分享</span>
                <span class="groupText" v-if="!item.public">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-simi"></use>
              </svg>
              私密
            </span>
              </div>
              <i class="bot" v-if="index !== list.length-1"></i>
            </div>
          </div>

        <div class="line-river-big" v-if="list.length"></div>
        <div class="noResult" :class="!list.length ? 'increase' : ''">
          <svg class="icon addressIcon" aria-hidden="true">
            <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <div class="noResultText" v-if="list.length">无更多结果，快来创建新的圈子~</div>
          <div class="noResultText" v-else>暂无结果，快来创建新的圈子~</div>
          <div class="goRelease" @tap.stop.prevent="$router.pushPlus('/group/add')">建圈子</div>
        </div>
        <div class="line-river-big" v-if="list.length"></div>
      </RefreshList>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { searchText } from '../../utils/search'
  import RefreshList from '../../components/refresh/List.vue'
  //  import userAbility from '../../utils/userAbility'
  import { getLocalUserInfo } from '../../utils/user'
  import groupsList from '../../components/groups/GroupsList.vue'
  const currentUser = getLocalUserInfo()

  export default {
    data () {
      return {
        userId: currentUser.user_id,
        user_level: currentUser.user_level,
        searchText: '',
        isShow: false,
        dataList: null,
        list: []
      }
    },
    components: {
      RefreshList,
      groupsList
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
    },
    updated () {
    },
    methods: {
      // 文字高亮
      getHighlight (content) {
        var reg = new RegExp('(' + this.searchText + ')', 'gi')  // 正则验证匹配
        var newstr = content.replace(reg, '<span style="color: #03aef9">$1</span>')  // 动态添加颜色
        return newstr
      },
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
        &:nth-of-type(3){
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
