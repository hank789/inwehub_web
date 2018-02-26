<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">标签详情</h1>
    </header>
    <div class="mui-content absolute">
      <TagsInfo :tagName = tagName></TagsInfo>
    <!--导航栏-->
    <div class="menu">
      <span @tap.stop.prevent="">问答  <i></i></span>
      <span @tap.stop.prevent="$router.replace('/tag/detail/' + encodeURIComponent(tagName) + '/discover')">分享</span>
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
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume/' + uuid + '?goback=1' + '&time=' + (new Date().getTime()))
      },
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
    watch: {
      '$route': 'refreshPageData'
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
    height: 0.1rem;
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
    height:3.9rem;
    background: #FFFFFF;
    font-size:1.4rem;
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
    width:2.7rem;
    height:1.0.5rem;
    border-radius: 5rem;
    background:#03aef9;
    top: 2.8rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  /*问答列表*/
  .listWrapper{
  }
  .recommend_b {
    width: 100%;
    /*height: 20rem;*/
    overflow: hidden;
    background: #f3f4f6;
  }

  .recommend_b li {
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    margin-bottom: 1rem;
    padding: 1.2rem 0 1.5rem 0;
  }
  .recommend_b li div{
    width:92%;
    margin-left: 4%;
  }
  .recommend_b li .description{
    font-size:1.6rem;
    color:#444444;
  }
  /*点赞样式*/
  .component-dianzanList{
    width:100%;
    margin-top: 1.2rem;
    background:#f3f4f6;
    padding: 1.3rem 1.5rem 1.5rem;
    border-radius: 0.4rem;
  }
  /*.component-dianzanList*/
  .component-dianzanList span{
    font-size:1.3rem;
    color:#03aef9;
  }
  .component-dianzanList svg{
    font-size:1.7rem;
    color: #808080;
  }
  .avatar{
    height:4.4rem;
    margin-top: 1.5rem;
  }
  .avatar p:nth-of-type(1){
    height:4.4rem;
    float: left;
    position: relative;
  }
  .avatar p:nth-of-type(1) img{
    width:3.3rem;
    height:3.3rem;
    border-radius: 50%;
    margin-top: 5.0.5rem;
    float: left;
  }
  .avatar p:nth-of-type(1) svg{
    position: absolute;
    font-size: 1.4rem;
    bottom: 0.5rem;
    right: -0.5rem;
  }
  .avatar p:nth-of-type(2){
    width:88%;
    height:4.4rem;
    float: right;
    background:#03aef9;
    border-radius: 5rem;
    text-align: center;
    line-height: 4.4rem;
    font-size:1.6rem;
    color: #f2f2f2;
  }
  .question_info{
    height:1.9rem;
    /*background: #cccccc;*/
    margin-top: 1.2rem;
    line-height:1.9rem;
  }
  .question_info p:nth-of-type(1){
    float: left;
    font-size:1.3rem;
    color: #747474;
  }
  .question_info p:nth-of-type(1) i{
    display: inline-block;
    width:0.1rem;
    height:1.2rem;
    background: #dbdbdb;
    margin:0 0.9rem -0.1rem 0.9rem;
  }
  .question_info p:nth-of-type(1) span:nth-of-type(1){
    color: #b4b4b6;
  }
  .question_info p:nth-of-type(2){
    float: right;
    font-size: 1.3rem;
    color: #808080;
  }
  .question_info p:nth-of-type(2) span{
    float: right;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(1){
    margin-left: 2.2rem;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(1) svg{
    font-size: 1.8rem;
    color: #808080;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(2) svg{
    font-size: 1.8rem;
    margin-bottom: -0.2rem;
  }




  .listWrapper{
    top:17.7rem;
  }

  .hudongWrapper .three {
    font-size: 1.2rem;
    color: #b4b4b6;
    padding-top: 0.5rem;
    text-align: right;
  }

  .hudongWrapper .split {
    position: relative;
    top: 0.3rem;
    margin: 0 1rem;
    display: inline-block;
    width: 0.1rem;
    height: 1.3rem;
    background: #c8c8c8;
    transform: scaleX(.5);
  }

  .hudongWrapper .isFollowed{
    color:#03aef9;
  }

  /*回答者的样式*/
  .hudongWrapper .respondent{
    width:100%;
    padding: 1.2rem 1.5rem;
    background: #f3f4f6;
    font-size:1.3rem;
    color:rgb(128,128,128);
    border-radius: 0.4rem;
    margin-top: 1.2rem;
  }
  .hudongWrapper .respondent span{
    color: #03aef9;
  }
  .hudongWrapper .respondent i{
    color:rgb(146,146,146);
    margin-right: 0.5rem;
  }
  .hudongWrapper .respondent span:nth-last-of-type(1) i{
    display: none;
  }
  .hudongWrapper .respondent i{
    font-size:1.3rem;
    color:rgb(128,128,128);
    font-style: normal;
  }


</style>
