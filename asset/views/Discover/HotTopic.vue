<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">发现</h1>
    </header>

    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">热门 <i></i></span>
        <span @tap.stop.prevent="$router.replace('/discover/newest')">最新 </span>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.replace('/discover/publishArticles')">
          <use xlink:href="#icon-xiugai"></use>
        </svg>

      </div>
      <!--滚动区域-->
      <!--内容区域-->
      <RefreshList
        v-model="list"
        :api="'article/list'"
        :pageMode="true"
        :prevOtherData="{sort:'hot', page:1}"
        :nextOtherData="{sort:'hot'}"
        class="listWrapper">
        <ul>
          <li class="Container" v-for="(hot, index) in list" v-if="hot.type == 'link'">
            <p>{{hot.data.title}}<i>{{hot.data.domain}}</i></p>
            <p class="container-image" v-if="hot.data.img">
              <img :src="hot.data.img">
            </p>
            <p class="timer">
              <timeago :since="timeago(hot.created_at)" :auto-update="60">
              </timeago>
              <a>#{{hot.category_name}}</a>
              <i class="bot"></i>
            </p>
            <p class="information">
          <span>
          <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gengduo"></use>
          </svg>
          </span>
              <span @tap.stop.prevent="bookmarkuBmission(hot)" :class="hot.is_bookmark ? 'blue':''">
          <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoucangxingxing"></use>
          </svg>
          </span>
              <span >
          <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
          </svg>
          {{hot.comments_number}}
          </span>
          <span @tap.stop.prevent="downvoteComment(hot)" :class="hot.is_upvoted ? 'blue':''">
          <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
          </svg>
          {{hot.upvotes}}
          </span>
            </p>
          </li>
          <!--带图片的样式-->
          <li class="imgContainer" v-for="(hot, num) in list" v-if="hot.type == 'text'">

            <div class="avatar">
              <p>
                <img :src="hot.owner.avatar"/>
                <svg class="icon" aria-hidden="true" v-if="hot.owner.is_expert == '1'">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </p>
              <p>{{hot.owner.username}}发布了分享</p>
            </div>
            <div class="textContainer mui-ellipsis-2">
              {{hot.title}}
            </div>

            <div class="PublishContainer" v-if="hot.data.img" >
              <template v-for="(item,number) in hot.data.img">
              <p class="container-image" v-if="hot.data.img.length > 1">
                <img :src="item"/>
              </p>
              <p class="container-image" id="container-image" v-if="hot.data.img.length < 2">
                <img :src="item"/>
              </p>
              </template>
            </div>

            <div class="timeContainer">
              <span>
                <timeago :since="timeago(hot.created_at)" :auto-update="60">
                </timeago>
              </span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dingwei1"></use>
              </svg>
              <span>曼哈顿 (金陵）商务酒店</span>
            </div>
            <div class="information">
            <span>
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-gengduo"></use>
               </svg>
            </span>
              <span @tap.stop.prevent="bookmarkuBmission(hot)" :class="hot.is_bookmark ? 'blue':''">
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoucangxingxing"></use>
               </svg>
            </span>
              <span >
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-pinglun1"></use>
               </svg>
              {{hot.comments_number}}
            </span>
              <span @tap.stop.prevent="downvoteComment(hot)" :class="hot.is_upvoted ? 'blue':''">
               <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dianzan1"></use>
            </svg>
              {{hot.upvotes}}
            </span>

            </div>


          </li>
        </ul>
      </RefreshList>
    </div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'
  const PublishAnswers = {
    data: () => ({
      list: []
    }),
    created () {
    },
    computed: {},
    components: {
      RefreshList
    },
    methods: {
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      // 赞文章
      downvoteComment (hot) {
        postRequest(`article/upvote-submission`, {
          submission_id : hot.id
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
             if(response.data.data.type == 'upvote'){
                 hot.upvotes += 1
                 hot.is_upvoted = 1
             }else{
               hot.is_upvoted = 0
               hot.upvotes -= 1
             }
          }
        })
      },
    // 赞文章
    bookmarkuBmission(hot) {
        console.error(hot.owner.id)
      postRequest(`article/bookmark-submission`, {
        id : hot.id
      }).then(response => {
        var code = response.data.code
        // 如果请求不成功提示信息 并且返回上一页；
        if (code !== 1000) {
          window.mui.alert(response.data.message)
          window.mui.back()
          return
        }
        if (response.data.data) {
          if(response.data.data.type == "bookmarked"){
            hot.is_bookmark = 1
          }else{
            hot.is_bookmark = 0
          }
        }
      })
    }
  },
  mounted()
  {

  }
  ,
  updated()
  {
//    console.error(this.list)
  }
  }
  export default PublishAnswers
</script>
<style scoped>
  .mui-wechat .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    top: 0;
  }

  .mui-content {
    background: #F3F4F5;
  }

  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    padding: 0 17px;
    border-bottom: 1px solid #dcdcdc;
  }

  .menu span {
    display: block;
    height: 100%;
    float: left;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }

  .menu span:nth-of-type(1) {
    position: relative;
  }

  .menu span:nth-of-type(2) {
    margin-left: 34px;
  }

  .menu svg {
    float: right;
    ont-size: 18px;
    color: #03aef9;
    margin-top: 13px;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 27px;
    height: 1.5px;
    left: 0%;
    bottom: 0.5px;
    background: #03aef9;
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
  ul {
    width: 100%;
    overflow: hidden;
    background: #F3F4F5;
    margin-top: 45px;
  }

  ul .Container {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding: 12px 16px 0 16px;
    margin-bottom: 10px;

  }

  ul .Container p:nth-of-type(1) {
    font-size: 15px;
    color: #444444;
    line-height: 20px;
  }

  ul .Container p:nth-of-type(1) i {
    font-size: 12px;
    color: rgb(180, 180, 182);
  }

  ul .Container .container-image {
    height: 124px;
    margin-top: 13px;
  }

  ul .Container p.timer {
    width: 100%;
    height: 44px;
    font-size: 12px;
    color: #b4b4b6;
    line-height: 44px;
    position: relative;
  }

  ul .Container p.timer a {
    font-size: 12px;
    color: rgb(128, 128, 128);
  }

  .information {
    width: 100%;
    height: 40px;
    padding: 0 17px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }

  .information span {
    color: #808080;

  }

  .information span svg {
    font-size: 17px;
  }

  .information span:nth-of-type(2) svg {
    font-size: 18px;
  }

  .information span:nth-of-type(3) svg {
    font-size: 17px;
    margin-right: 3px;

  }

  .information span:nth-of-type(4) svg {
    font-size: 17px;
    margin-right: 3px;
  }

  /*带定位和图片的样式*/
  .imgContainer {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding: 12px 16px 0 16px;
    margin-bottom: 10px;
  }

  .imgContainer:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 10px;
    background-color: #f3f4f6;
    width: 100%;
  }

  .imgContainer .avatar {
    width: 100%;
    height: 34px;
  }

  .avatar p:nth-of-type(1) {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    float: left;
    position: relative;
  }

  .avatar p:nth-of-type(1) svg {
    position: absolute;
    font-size: 17px;
    bottom: 0;
    right: -6px;
  }

  .avatar p:nth-of-type(1) img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar p:nth-of-type(2) {
    font-size: 13px;
    color: #808080;
    line-height: 34px;
    margin-left: 8px;
    float: left;
  }

  .textContainer {
    width: 100%;
    font-size: 15px;
    color: #444444;
    line-height: 20px;
    margin-top: 6px;
  }

  .timeContainer {
    width: 100%;
    height: 42px;
    font-size: 12px;
    line-height: 42px;

  }

  .timeContainer svg {
    font-size: 14px;
    color: #b4b4b6;
  }

  .timeContainer span:nth-of-type(1) {
    color: #b4b4b6;
  }

  .timeContainer span:nth-of-type(2) {
    color: #808080;
  }

  /*图片*/
  .PublishContainer {
    width: 100%;
    overflow: hidden;
    margin-top: 13px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    /*border:1px solid #000000;*/
  }

  .PublishContainer .container-image {
    width: 108px;
    /*border:1px solid #000000;*/

  }

  .PublishContainer .container-image img {
    width: 100%;
    height: 100%;
  }

  .PublishContainer p:nth-of-type(2), .PublishContainer p:nth-of-type(3) {
    margin-left: 2%;
  }

  #container-image {
    width: 150px;
    height: 226px;
  }

  /*适配*/
  @media (min-width: 320px) {
    .PublishContainer .container-image {
      height: 92px;
    }

  }

  @media (min-width: 375px) {
    .PublishContainer .container-image {
      height: 108px;
    }

  }

  @media (min-width: 414px) {
    .PublishContainer .container-image {
      height: 108px;
    }

  }

  .information .blue{
    color:#03aef9;
  }
</style>
