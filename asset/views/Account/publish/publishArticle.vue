<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-if="uuid === this.$route.params.id">我的发布</h1>
      <h1 class="mui-title" v-else>Ta的发布</h1>
    </header>


    <!--组件-->
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/my/publishAnswers')">回答 </span>
        <span @tap.stop.prevent="$router.replace('/my/publishQuestions')">提问</span>
        <span @tap.stop.prevent="">文章  <i></i></span>
        <span @tap.stop.prevent="$router.replace('/my/publishComment')">评论</span>

      </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'readhub/mySubmission'"
        :prevOtherData="{type:0,uuid: this.$route.params.id}"
        :nextOtherData="{type:0,uuid: this.$route.params.id}"
        class="listWrapper">
        <ul class="answer">
          <li  v-for="(ask, index) in list" @tap.stop.prevent="toDetail(ask)">
            <div class="margin-10-0-0" v-if="ask.img && ask.type =='text'">
              <Images :images="ask.img" class="newestList"></Images>
            </div>
            <div class="container-image margin-10-0-0" v-if="ask.img && ask.type =='link'" >
              <img :src="ask.img" />
            </div>
            <p class="mui-ellipsis-2">{{ask.title}}<a v-if="ask.domain">{{ask.domain}}</a> </p>
            <p>
              <!--{{ask.created_at}}-->
              <timeago :since="timeago(ask.created_at)" :auto-update="60">
              </timeago>
              <a v-if="ask.category_name">#{{ask.category_name}}</a>
            </p>
            <i class="bot"></i>
          </li>
        </ul>
      </RefreshList>

      <!---->
    </div>
    <!---->

  </div>
</template>

<script>
  import RefreshList from '../../../components/refresh/List.vue'
  import Images from '../../../components/image/Images.vue'
  import { goThirdPartyArticle } from '../../../utils/webview'
  import localEvent from '../../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')

  const PublishAnswers = {
    data: () => ({
      list: [],
      uuid: currentUser.uuid
    }),
    created () {
    },
    computed: {

    },
    components: {
      RefreshList,
      Images
    },
    methods: {
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      toDetail (data) {
        switch (data.type) {
          case 'text':
            this.$router.pushPlus(data.comment_url, 'list-detail-page')
            break
          case 'link':
            goThirdPartyArticle(
              data.submission_url,
              data.id,
              data.title,
              data.comment_url,
              data.img
            )
            break
          default:
        }

      }
    },
    mounted () {
    },
    updated () {
//    console.error(this.list);
    }
  }
  export default PublishAnswers
</script>

<style scoped="scoped">
  .mui-wechat .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    top: 0;
  }

  .mui-content {
    background: #FFFFFF;
  }
  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
  }

  .menu span {
    display: block;
    width: 25%;
    height: 100%;
    float: left;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }

  .menu span:nth-of-type(3) {
    color: #3c95f9;
    position: relative;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 27px;
    height: 1.5px;
    left: 34%;
    bottom: 0.5px;
    background: #3c95f9;
  }

  .bot {
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
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
  /*滚动区域*/

  .answer {
    width: 92%;
    margin-left: 4%;
    overflow: hidden;
  }

  .answer li {
    width: 100%;
    overflow: hidden;
    padding: 15px 0 13px 0;
    position: relative;
  }
   .answer li div{
     margin-bottom: 12px;
   }
  .answer li p:nth-of-type(1){
    font-size:15px;
    color:#444444;


  }
  .answer li p:nth-of-type(1) a{
    font-size:12px;
    color:rgb(180,180,182);

  }
   .answer li p:nth-of-type(2){
      font-size:12px;
      color:#b4b4b6;
  }
  .answer li p:nth-of-type(2) a{
    font-size:12px;
    color:rgb(128,128,182);
  }


  /*状态的颜色*/
 .label_1,.label_2,.label_4{
    background: #fcc816;
 }

 .label_3,.label_5,.label_6,.label_7{
   background: #c8c8c8;
 }

  .listWrapper{
    top: 45px;
  }
  /*container-image margin-10-0-0*/
</style>
