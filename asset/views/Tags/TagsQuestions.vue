<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">活动与机遇</h1>
    </header>
    <div class="mui-content absolute">
    <div class="tag-title">
       <div class="tag-l">
         <img src="../../statics/images/guide_01.png">
       </div>
       <div class="tag-r">
        <p>
          <span>供应链</span>
          <span class="grey">关注</span>
        </p>
        <p class="mui-ellipsis-3">供应链的概念是从扩大的生产概念发展而来，现代管理教育对供应链的定义为“供应链是围绕核心企业，通过对商流、信息流、物流...
          资金控制，从采购原材料开始到制成中间产品及最终产品、最后由销售网络把产品送到消费者手中的一个由供应商、制造商、分销商（零售商，批发商等）直到最终用户所连成的整体功能网链结构”。
          中文名 供应链 外文名 Supply Chain</p>
       </div>
    </div>
    <!--导航栏-->
    <div class="menu">
      <span @tap.stop.prevent="">问答  <i></i></span>
      <span @tap.stop.prevent="$router.replace('/tagssubmissions')">动态</span>
      <span @tap.stop.prevent="$router.replace('/tagsusers')">用户</span>
      <i class="bot"></i>
    </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'tags/questions'"
        :prevOtherData="{tag_id:2}"
        :nextOtherData="{tag_id:2}"
        :pageMode= true
        :list="list"
        class="listWrapper">
      <ul class="cions-list">
        <li  v-for="(item, index) in list">
          <div class="cions-avatar">
            <img :src="item.question_type ===1 ?item.answer_user_avatar_url : item.question_user_avatar_url" @tap.stop.prevent="toAvatar(item.uuid)"/>
            <svg class="icon" aria-hidden="true" v-if="item.answer_user_is_expert || item.question_user_is_expert">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </div>
          <div class="detail">
            <p>{{item.question_type ===1 ? item.answer_username : item.question_username}}</p>
            <p class="mui-ellipsis">{{item.description}}</p>
          </div>
          <div class="fouce grey" v-if="item.is_followed_question === 1">已关注</div>
          <div class="fouce" v-else-if="item.is_followed_question === 0">关注</div>
          <i class="bot"></i>
        </li>
      </ul>
      </RefreshList>

    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import Empty from '../../components/Empty.vue'

  export default {
    data () {
      return {
        loading: 1,
        list: []
      }
    },
    components: {
      Empty,
      RefreshList
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
      collect (uuid, item) {
        postRequest(`follow/user`, {
          id: uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          if (response.data.data.type === 'unfollow') {
            item.is_followed = 0
          } else {
            item.is_followed = 1
          }
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
    },
    updated () {}
  }
</script>

<style scoped>
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
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  .tag-title{
    width:100%;
    height:133px;
    background: #f3f4f6;
    padding: 0 4%;
    display: flex;
    flex-direction: row;
    align-items: center;
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
  .tag-r{
    height:92px;
    margin-left: 10px;
  }
  .tag-r p:nth-of-type(1){
    font-size:18px;
    color: #444444;
    font-weight:500;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2){
    float: right;
    width:62px;
    height:27px;
    background: #a8dff7;
    text-align: center;
    line-height: 26px;
    border-radius: 4px;
    font-size:14px;
    color: #235280;
  }
  .tag-r p:nth-of-type(1) span:nth-of-type(2).grey{
    color: #808080;
    background: #dcdcdc;
  }
  .tag-r p:nth-of-type(2){
   margin-top: 11px;
  }
  /*菜单*/
  .menu{
    width:100%;
    height:39px;
    background: #FFFFFF;
    font-size:14px;
    color: #444444;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: relative;
  }
  .menu span:nth-of-type(1){
    position:relative;
    color: #03aef9;
  }
  .menu span:nth-of-type(1) i{
    position:absolute;
    width:27px;
    height:1.5px;
    border-radius: 50px;
    background:#03aef9;
    top: 28px;
  }

  /*list*/


  /*关注和取消*/

  .my-focus-item .follows {
    position: absolute;
    width: 62px;
    height: 27px;
    border: 1px solid #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 27px;
    right: 0;
    top: 18px;
    font-size: 14px;
    color: #03aef9;
  }

  .my-focus-item .bgblue {
    background: #03aef9;
    color: #FFFFFF;
  }

  .my-focus-item div p:nth-of-type(1) span {
    display: inline-block;
    max-width: 126px;
    height: 20px;
    overflow: hidden;
    font-family: "PingFangSC";
    font-size: 14px;
    color: #565656;
  }

  .my-focus-item div p:nth-of-type(1) svg {
    font-size: 20px;
    margin-bottom: 2px;
    color: #3c95f9;
  }

  .my-focus-item div p:nth-of-type(2){
    width: 100%;
    height: 14px;
    font-size: 13px;
    color: #b4b4b6;
    line-height: 13px;
  }
  /*列表区域*/
  .cions-list{
    width:100%;
    overflow: hidden;
    padding: 0 4%;
  }
  .cions-list li{
    position: relative;
    height:64px;
  }
  .cions-list li div{
    float: left;
  }
  .cions-list li .cions-avatar{
    position: relative;
    width:44px;
    height:44px;
    border-radius:50%;
    background: #cccccc;
    margin-top: 10px;
  }
  .cions-list li .cions-avatar img{
    width:44px;
    height:44px;
    border-radius:50%;
  }
  .cions-list li .cions-avatar svg{
    position: absolute;
    font-size: 20px;
    right: -5px;
    bottom: -2px;
  }
  .cions-list li .detail{
    margin-top: 14px;
    font-size:14px;
    color: #444444;
    margin-left: 8px;
  }
  .cions-list li .detail p:nth-of-type(2){
    width:200px;
    font-size:12px;
    color: #b4b4b6;
    margin-top: -2px;
  }
  .cions-list li .fouce{
    width:61px;
    height:27px;
    border: 1px solid #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 25px;
    font-size:14px;
    color: #03aef9;
    margin-top: 18.5px;
    float: right;

  }
  .cions-list li .grey{
    color: #b4b4b6;
    border: 1px solid #b4b4b6;
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
</style>
