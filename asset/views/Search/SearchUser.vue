<template>
  <div>
    <div class="mui-content">
      <div class="search">
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" placeholder=""  v-model.trim="searchText"/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="empty()" v-if="isShow">
            <use xlink:href="#icon-times1"></use>
          </svg>
        </p>
        <p>取消</p>
      </div>
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/searchQuestion')">问答<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchSubmission')">分享</span>
        <span @tap.stop.prevent="$router.replace('/searchTag')">标签</span>
        <span @tap.stop.prevent="">用户<i></i></span>
        <i class="bot"></i>
      </div>
      <RefreshList
        v-if="dataList != null"
        v-model="list"
        :api="'search/user'"
        :pageMode="true"
        :prevOtherData="dataList"
        :nextOtherData="dataList"
        class="listWrapper">
        <ul class="cions-list" >
          <li v-for="(item, index) in list">
            <div class="cions-avatar">
              <img :src="item.user_avatar_url"  @tap.stop.prevent="toAvatar(item.uuid)"/>
              <svg class="icon" aria-hidden="true" v-if="item.is_expert">
                <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
              </svg>
            </div>
            <div class="detail">
              <p>{{item.user_name}}</p>
              <p>{{item.description}}<i></i></p>
            </div>
            <div class="fouce" :class="item.is_followed?'grey':''"   @tap.stop.prevent='collectProfessor(item.uuid,index)'>{{item.is_followed ? '已关注' : '关注'}}</div>
            <i class="bot"></i>
          </li>
        </ul>
      </RefreshList>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { searchText } from '../../utils/search'
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  export default {
    data () {
      return {
        searchText: '',
        isShow: false,
        dataList: null,
        list: []
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
          // 做延时处理
          searchText(newValue, (text) => {
            this.dataList = {
              search_word: newValue
            }
          })
          this.isShow = true
        } else {
          this.isShow = false
        }
      }
    },
    mounted () {
    },
    methods: {
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume/' + uuid + '?goback=1' + '&time=' + (new Date().getTime()))
      },
      // 点击关注；
      collectProfessor (uuid, index) {
        postRequest(`follow/user`, {
          id: uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          if (response.data.data.type === 'unfollow') {
            this.list[index].is_followed = 0
          } else {
            this.list[index].is_followed = 1
          }
          window.mui.toast(response.data.data.tip)
        })
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
    .listWrapper{
      top:80px;
    }
    background: #ffffff;
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
        &:nth-of-type(4){
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
  }



  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:1.706rem;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
    background: #cccccc;
    margin-top: 0.266rem;
  }
  .cions-list li .cions-avatar img{
    width:1.173rem;
    height:1.173rem;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 0.533rem;
    right: -0.133rem;
    bottom: -0.053rem;
  }
  .cions-list li .detail{
    margin-top: 0.373rem;
    font-size:0.373rem;
    color: #444444;
    margin-left: 0.213rem;
  }
  .cions-list li .detail p:nth-of-type(2){
    font-size:0.32rem;
    color: rgb(128, 128, 128);
    margin-top: -0.053rem;
  }
  .cions-list li .detail p:nth-of-type(2) i{
    color: #235280;
  }
  .cions-list li .fouce{
    width:1.626rem;
    height:0.72rem;
    border: 0.026rem solid #03aef9;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 0.666rem;
    font-size:0.373rem;
    color: #03aef9;
    margin-top: 0.493rem;
    float: right;

  }
  .cions-list li .grey{
    color: #b4b4b6;
    border: 0.026rem solid #b4b4b6;
  }
</style>
