<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">标签详情</h1>
    </header>
    <div class="mui-content absolute">
    <!--<div class="tag-title">-->
       <!--<div class="tag-l" v-if="tagDetail.logo">-->
         <!--<img :src="tagDetail.logo">-->
       <!--</div>-->
      <!--<div class="tag-l bg-grey" v-else>-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-biaozhunlogoshangxiayise"></use>-->
        <!--</svg>-->
      <!--</div>-->
       <!--<div class="tag-r">-->
        <!--<p>-->
          <!--<span>{{tagDetail.name}}</span>-->
          <!--<span class="grey" v-if="tagDetail.is_followed" @tap.stop.prevent="collectTag(tagDetail.id)">已关注</span>-->
          <!--<span  v-else @tap.stop.prevent="collectTag(tagDetail.id)">关注</span>-->
        <!--</p>-->
        <!--<p class="mui-ellipsis-3">{{tagDetail.summary}}</p>-->
       <!--</div>-->
    <!--</div>-->
      <TagsInfo :tagName = tagName></TagsInfo>
    <!--导航栏-->
    <div class="menu">
      <span @tap.stop.prevent="">问答  <i></i></span>
      <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/discover')">动态</span>
      <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/users')">用户</span>
      <i class="bot"></i>
    </div>
      <!--推荐问答 -->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'tags/questions'"
        :prevOtherData="{tag_name:tagName}"
        :nextOtherData="{tag_name:tagName}"
        :pageMode = true
        class="listWrapper">
      <ul class="recommend_b">
        <template v-for="(item, index) in list">
          <li v-if="item.question_type === 1" @tap.stop.prevent="toDetail(item)">
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

          <li class="mui-table-view-cell hudongWrapper" v-if="item.question_type === 2" @tap.stop.prevent="toDetail(item)">
            <div class="second mui-ellipsis-2">{{ item.description }}</div>
            <div class="three">{{ item.answer_num }}人回答<span class="split"></span><span :class="{isFollowed:item.is_followed_question?false:true}">关注问题{{item.follow_num}}</span></div>
            <div class="respondent mui-ellipsis" v-if="item.answer_num">
              回答者：<span  v-for="(answer, index) in item.answer_user_list" @tap.stop.prevent="toAvatar(answer.uuid)">{{answer.name}}<i>,</i></span>
              <i v-if="item.answer_num >  item.answer_user_list.length">等{{item.answer_num}}人</i>
            </div>
          </li>
        </template>
        <!--encodeURIComponent(tag)-->
      </ul>
      </RefreshList>

    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  import RefreshList from '../../components/refresh/List.vue'
  import TagsInfo from '../../components/tags/TagsInfo.vue'

  export default {
    data () {
      return {
        tagName: '',
        loading: 1,
        list: []
      }
    },
    components: {
      RefreshList,
      TagsInfo
    },
    created () {
      if (this.$route.params.tag) {
        this.tagName = this.$route.params.tag
      }
    },
    methods: {
      toDetail (item) {
        if (item.question_type === 2) {
          this.$router.pushPlus('/askCommunity/interaction/answers/' + item.id, 'list-detail-page', true, 'pop-in', 'hide', true)
        } else {
          this.$router.pushPlus('/askCommunity/major/' + item.id, 'list-detail-page', true, 'pop-in', 'hide', true)
        }
      },
      getTagInfo () {
        postRequest('tags/tagInfo', {
          tag_name: this.tagName
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.tagDetail = response.data.data
          this.loading = 0
        })
      },
      collectTag (id) {
        postRequest(`follow/tag`, {
          id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.tagDetail.is_followed = !this.tagDetail.is_followed
          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
      this.getTagInfo()
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
    left: 0;
    right: 0;
    margin: auto;
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




  .listWrapper{
    top:177px;
  }

  .hudongWrapper .three {
    font-size: 12px;
    color: #b4b4b6;
    padding-top: 5px;
    text-align: right;
  }

  .hudongWrapper .split {
    position: relative;
    top: 3px;
    margin: 0 10px;
    display: inline-block;
    width: 1px;
    height: 13px;
    background: #c8c8c8;
    transform: scaleX(.5);
  }

  .hudongWrapper .isFollowed{
    color:#03aef9;
  }

  /*回答者的样式*/
  .hudongWrapper .respondent{
    width:100%;
    padding: 12px 15px;
    background: #f3f4f6;
    font-size:13px;
    color:rgb(128,128,128);
    border-radius: 4px;
    margin-top: 12px;
  }
  .hudongWrapper .respondent span{
    color: #03aef9;
  }
  .hudongWrapper .respondent i{
    color:rgb(146,146,146);
    margin-right: 5px;
  }
  .hudongWrapper .respondent span:nth-last-of-type(1) i{
    display: none;
  }
  .hudongWrapper .respondent i{
    font-size:13px;
    color:rgb(128,128,128);
    font-style: normal;
  }
</style>
