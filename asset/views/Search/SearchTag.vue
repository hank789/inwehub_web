<template>
  <div>
    <div class="mui-content">
      <div class="search">
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder="" v-model.trim="searchText"/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShow">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p @tap.stop.prevent="back()">取消</p>
      </div>
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/searchQuestion?text=' + searchText)">问答</span>
        <span @tap.stop.prevent="$router.replace('/searchSubmission?text=' + searchText)">分享</span>
        <span @tap.stop.prevent="">标签<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchUser?text=' + searchText)">用户</span>
        <i class="bot"></i>
      </div>
      <!--搜索列表-->
      <RefreshList
        v-if="dataList != null"
        v-model="list"
        :api="'search/tag'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        class="listWrapper">
        <ul>
          <li v-for="(item, index) in list"  @tap.stop.prevent="toTagDetail(item.name)">
            <p v-html="getHighlight(item.name)"></p>
            <i class="bot"></i>
          </li>

        </ul>
      </RefreshList>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { searchText } from '../../utils/search'
  import RefreshList from '../../components/refresh/List.vue'
  import userAbility from '../../utils/userAbility'
  import { getLocalUserInfo } from '../../utils/user'
  const currentUser = getLocalUserInfo()
  export default {
    data () {
      return {
        user_level: currentUser.user_level,
        searchText: '',
        isShow: false,
        dataList: null,
        list: [],
        tagName: []
      }
    },
    computed: {
      isNewTag () {
        if (this.list[0] && typeof (this.list[0].value) === 'string') {
          return true
        }
        return false
      }
    },
    components: {
      RefreshList
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
          // 搜索进行延时操作
          searchText(newValue, (text) => {
            this.dataList = {
              search_word: newValue
            }
          })
          // 清空输入框的显隐
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
      back () {
        window.mui.back()
        return
      },
      // 文字高亮
      getHighlight (content) {
        var reg = new RegExp('(' + this.searchText + ')', 'gi')  // 正则验证匹配
        var newstr = content.replace(reg, '<span style="color: #03aef9">$1</span>')  // 动态添加颜色
        return newstr
      },
      // 标签
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      //  点击清空输入框
      empty () {
        this.searchText = ''
      }
    }
  }
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
      top: 2.2rem;
    }
    .search{
      width:100%;
      height:1.173rem;
      background: #ffffff;
      padding: 0 4%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      p{
        &:nth-of-type(1){
          width:75%;
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
          width:1.76rem;
          height:0.906rem;
          background: #03aef9;
          border-radius: 1.333rem;
          font-size: 0.373rem;
          color: #ffffff;
          text-align: center;
          line-height: 0.906rem;
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
        width:25%;
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
    /**/
    ul {
      width: 100%;
      overflow: hidden;
      li {
        width: 92%;
        margin-left: 4%;
        height: 1.173rem;
        position: relative;
        text-align: left;
        line-height: 1.173rem;
        font-size: 0.373rem;
        color: #808080;
      }
    }
  }

</style>
