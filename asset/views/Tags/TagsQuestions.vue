<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">标签详情</h1>
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
      <!--推荐问答 -->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'question/majorList'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :pageMode = true
        class="listWrapper">
      <ul class="recommend_b">
        <li   v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.id)">
          <div class="description mui-ellipsis-3">{{item.description}}</div>
          <div class="avatar">
            <p>
              <img :src="item.answer_user_avatar_url"/>
              <svg class="icon" aria-hidden="true" v-if="item.answer_user_is_expert">
                <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
              </svg>
            </p>
            <p v-if="item.is_pay_for_view">查看回答</p>
            <p v-else>1元看答案／看评论</p>
          </div>
          <div class="question_info">
            <p>
              <span>回答者:</span> {{item.answer_username}}
              <i v-if="item.average_rate"></i>
              <span v-if="item.average_rate">{{item.average_rate}}好评</span>
            </p>
            <p>
                  <span class="support_number">
                    <svg class="icon" aria-hidden="true" >
                    <use xlink:href="#icon-dianzan1"></use>
                    </svg>
                    <i v-if="item.support_number">{{item.support_number}}</i>
                  </span>
              <span class="comment_number" >
                    <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-pinglun1"></use>
                    </svg>
                    <i v-if="item.comment_number">{{item.comment_number}}</i>
                  </span>
            </p>
          </div>
          <div class="component-dianzanList" v-if="item.support_number">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dianzan1"></use>
            </svg>
            <span  v-for="(supporter, index) in item.supporter_list">{{supporter.name}}</span>
            <span v-if="item.support_number > item.supporter_list.length">等{{item.support_number}}人</span>
          </div>
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

  /*问答列表*/
  .listWrapper{
  }
  .recommend_b {
    width: 100%;
    /*height: 200px;*/
    overflow: hidden;
    background: #f3f4f6;
  }

  .recommend_b li {
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    margin-bottom: 10px;
    padding: 12px 0 15px 0;
  }
  .recommend_b li div{
    width:92%;
    margin-left: 4%;
  }
  .recommend_b li .description{
    font-size:16px;
    color:#444444;
  }
  /*点赞样式*/
  .component-dianzanList{
    width:100%;
    margin-top: 12px;
    background:#f3f4f6;
    padding: 13px 15px 15px;
    border-radius: 4px;
  }
  /*.component-dianzanList*/
  .component-dianzanList span{
    font-size:13px;
    color:#03aef9;
  }
  .component-dianzanList svg{
    font-size:17px;
    color: #808080;
  }
  .avatar{
    height:44px;
    margin-top: 15px;
  }
  .avatar p:nth-of-type(1){
    height:44px;
    float: left;
    position: relative;
  }
  .avatar p:nth-of-type(1) img{
    width:33px;
    height:33px;
    border-radius: 50%;
    margin-top: 5.5px;
    float: left;
  }
  .avatar p:nth-of-type(1) svg{
    position: absolute;
    font-size: 14px;
    bottom: 5px;
    right: -5px;
  }
  .avatar p:nth-of-type(2){
    width:88%;
    height:44px;
    float: right;
    background:#03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 44px;
    font-size:16px;
    color: #f2f2f2;
  }
  .question_info{
    height:19px;
    /*background: #cccccc;*/
    margin-top: 12px;
    line-height:19px;
  }
  .question_info p:nth-of-type(1){
    float: left;
    font-size:13px;
    color: #747474;
  }
  .question_info p:nth-of-type(1) i{
    display: inline-block;
    width:1px;
    height:12px;
    background: #dbdbdb;
    margin:0 9px -1px 9px;
  }
  .question_info p:nth-of-type(1) span:nth-of-type(1){
    color: #b4b4b6;
  }
  .question_info p:nth-of-type(2){
    float: right;
    font-size: 13px;
    color: #808080;
  }
  .question_info p:nth-of-type(2) span{
    float: right;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(1){
    margin-left: 22px;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(1) svg{
    font-size: 18px;
    color: #808080;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(2) svg{
    font-size: 18px;
    margin-bottom: -2px;
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
