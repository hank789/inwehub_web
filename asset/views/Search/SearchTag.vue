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
        <span @tap.stop.prevent="$router.replace('/searchQuestion')">问答</span>
        <span @tap.stop.prevent="$router.replace('/searchSubmission')">分享</span>
        <span @tap.stop.prevent="">标签<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchUser')">用户</span>
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
  import userAbility from '../../utils/userAbility'
  import { searchText } from '../../utils/search'
  import RefreshList from '../../components/refresh/List.vue'
  export default {
    data () {
      return {
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
    },
    watch: {
      searchText: function (newValue) {
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
      }
    },
    mounted () {
    },
    updated () {
    },
    methods: {
      back () {
        this.$router.go(-1)
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
      top: 60px;
    }
    .search{
      width:100%;
      height:44px;
      background: #ffffff;
      padding: 0 4%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      p{
        &:nth-of-type(1){
          width:75%;
          height:34px;
          border-radius: 50px;
          background: #f3f4f6;
          border:1px solid #dcdcdc;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          svg{
            color: #c8c8c8;
            &:nth-of-type(1){
              font-size: 18px;
              margin-right: 10px;
            }
            &:nth-of-type(2){
              margin-left: 10px;
              font-size: 20px;
            }
          }
          input{
            margin: 0;
            padding: 0;
            height:32px;
            border: none;
            background: #f3f4f6;
            font-size: 14px;
            color: #444444;
          }
        }
        &:nth-of-type(2){
          width:66px;
          height:34px;
          background: #03aef9;
          border-radius: 50px;
          font-size: 14px;
          color: #ffffff;
          text-align: center;
          line-height: 34px;
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
      justify-content: space-around;
      align-items: center;
      position: relative;
      span{
        &:nth-of-type(3){
          font-size: 14px;
          position:relative;
          color: #444444;
          font-weight: 500;
          i{
            position:absolute;
            width:0.72rem;
            height:2px;
            border-radius: 1.333rem;
            background:#03aef9;
            top: 0.746rem;
            left: 0;
            right: 0;
            margin: auto;
          }
        }
      }
    }
    /**/
    ul {
      width: 100%;
      overflow: hidden;
      margin-top: 0.586rem;
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
