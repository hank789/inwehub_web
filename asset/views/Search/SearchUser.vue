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
        <p @tap.stop.prevent="back()">取消</p>
      </div>
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/searchQuestion?text=' + searchText)">问答<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchSubmission?text=' + searchText)">分享</span>
        <span @tap.stop.prevent="$router.replace('/searchTag?text=' + searchText)">标签</span>
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
              <p v-html="getHighlight(item.user_name)"></p>
              <p class="mui-ellipsis">{{item.description}}<i></i></p>
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
        list: []
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
        if (this.user_level >= 3) {
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
        } else {
          userAbility.jumpJudgeGrade(this)
        }
      }
    },
    mounted () {
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
      top:2.133rem;
    }
    background: #ffffff;
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
              margin-right: 0.266rem;
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
        &:nth-of-type(4){
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
    width: 60%;
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
