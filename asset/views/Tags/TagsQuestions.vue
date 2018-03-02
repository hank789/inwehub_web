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
        class="listWrapper"
        :style="'top:'+ top +'rem'"
      >
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
  import localEvent from '../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')
  export default {
    data () {
      return {
        userId: currentUser.user_id,
        tagName: '',
        loading: 1,
        list: [],
        top: 4.584
      }
    },
    components: {
      RefreshList,
      TagsInfo
    },
    created () {
      console.error(localEvent.getLocalItem('tagsInfo_number' + this.userId) > 0, localEvent.getLocalItem('tagsInfo_number' + this.userId))
      this.top = localEvent.getLocalItem('tagsInfo_number' + this.userId) > 0 ? 6.29 : 4.584
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
      this.top = localEvent.getLocalItem('tagsInfo_number' + this.userId) > 0 ? 6.29 : 4.584
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
    height: 0.026rem;
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
    height:1.04rem;
    background: #FFFFFF;
    font-size:0.373rem;
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
    width:0.72rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.746rem;
    left: 0;
    right: 0;
    margin: auto;
  }

  /*问答列表*/
  .recommend_b {
    width: 100%;
    /*height: 5.333rem;*/
    overflow: hidden;
    background: #f3f4f6;
  }

  .recommend_b li {
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    margin-bottom: 0.266rem;
    padding: 0.32rem 0 0.4rem 0;
  }
  .recommend_b li div{
    width:92%;
    margin-left: 4%;
  }
  .recommend_b li .description{
    font-size:0.426rem;
    color:#444444;
  }
  /*点赞样式*/
  .component-dianzanList{
    width:100%;
    margin-top: 0.32rem;
    background:#f3f4f6;
    padding: 0.346rem 0.4rem 0.4rem;
    border-radius: 0.106rem;
  }
  /*.component-dianzanList*/
  .component-dianzanList span{
    font-size:0.346rem;
    color:#03aef9;
  }
  .component-dianzanList svg{
    font-size:0.453rem;
    color: #808080;
  }
  .avatar{
    height:1.173rem;
    margin-top: 0.4rem;
  }
  .avatar p:nth-of-type(1){
    height:1.173rem;
    float: left;
    position: relative;
  }
  .avatar p:nth-of-type(1) img{
    width:0.88rem;
    height:0.88rem;
    border-radius: 50%;
    margin-top: 0.146rem;
    float: left;
  }
  .avatar p:nth-of-type(1) svg{
    position: absolute;
    font-size: 0.373rem;
    bottom: 0.133rem;
    right: -0.133rem;
  }
  .avatar p:nth-of-type(2){
    width:88%;
    height:1.173rem;
    float: right;
    background:#03aef9;
    border-radius: 1.333rem;
    text-align: center;
    line-height: 1.173rem;
    font-size:0.426rem;
    color: #f2f2f2;
  }
  .question_info{
    height:0.506rem;
    /*background: #cccccc;*/
    margin-top: 0.32rem;
    line-height:0.506rem;
  }
  .question_info p:nth-of-type(1){
    float: left;
    font-size:0.346rem;
    color: #747474;
  }
  .question_info p:nth-of-type(1) i{
    display: inline-block;
    width:0.026rem;
    height:0.32rem;
    background: #dbdbdb;
    margin:0 0.24rem -0.026rem 0.24rem;
  }
  .question_info p:nth-of-type(1) span:nth-of-type(1){
    color: #b4b4b6;
  }
  .question_info p:nth-of-type(2){
    float: right;
    font-size: 0.346rem;
    color: #808080;
  }
  .question_info p:nth-of-type(2) span{
    float: right;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(1){
    margin-left: 0.586rem;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(1) svg{
    font-size: 0.48rem;
    color: #808080;
  }
  .question_info p:nth-of-type(2) span:nth-of-type(2) svg{
    font-size: 0.48rem;
    margin-bottom: -0.053rem;
  }



  .hudongWrapper .three {
    font-size: 0.32rem;
    color: #b4b4b6;
    padding-top: 0.133rem;
    text-align: right;
  }

  .hudongWrapper .split {
    position: relative;
    top: 0.08rem;
    margin: 0 0.266rem;
    display: inline-block;
    width: 0.026rem;
    height: 0.346rem;
    background: #c8c8c8;
    transform: scaleX(.5);
  }

  .hudongWrapper .isFollowed{
    color:#03aef9;
  }

  /*回答者的样式*/
  .hudongWrapper .respondent{
    width:100%;
    padding: 0.32rem 0.4rem;
    background: #f3f4f6;
    font-size:0.346rem;
    color:rgb(128,128,128);
    border-radius: 0.106rem;
    margin-top: 0.32rem;
  }
  .hudongWrapper .respondent span{
    color: #03aef9;
  }
  .hudongWrapper .respondent i{
    color:rgb(146,146,146);
    margin-right: 0.133rem;
  }
  .hudongWrapper .respondent span:nth-last-of-type(1) i{
    display: none;
  }
  .hudongWrapper .respondent i{
    font-size:0.346rem;
    color:rgb(128,128,128);
    font-style: normal;
  }


</style>
