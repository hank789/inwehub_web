<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的发布</h1>
    </header>



    <!--组件-->
    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/my/publishAnswers')">回答 </span>
        <span @tap.stop.prevent="$router.replace('/my/publishQuestions')">提问</span>
        <span @tap.stop.prevent="$router.replace('/my/publishArticle')">文章</span>
        <span @tap.stop.prevent="">评论  <i></i></span>

      </div>
      <!--内容区域-->
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'comment/myList'"
        :prevOtherData="{type:0}"
        :nextOtherData="{type:0}"
        :list="list"
        class="listWrapper">
        <ul class="answer">
          <!--{{ask.origin_title}}-->
          <li v-for="(ask, index) in list" @tap.stop.prevent="goToCommentPage(ask.type, ask.comment_url)">
            <p class="mui-ellipsis">{{ask.content}}</p>
            <p class="mui-ellipsis">{{ask.origin_title}}</p>
            <p>
              <span>
                <timeago :since="timeago(ask.created_at)" :auto-update="60">
               </timeago>
              </span>
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
  const PublishAnswers = {
    data: () => ({
      list: []
    }),
    created () {
    },
    computed: {
    },
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
      goToCommentPage (type, url) {
        if (type === 2) {
          this.router.pushReadHubPage(url)
        } else {
          this.router.pushPlus(url)
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

  .menu span:nth-of-type(4) {
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
    padding: 14px 0 13px 0;
    position: relative;
  }

  .answer li p:nth-of-type(1) {
    color: #444444;
    font-size: 14px;
  }
  .answer li p:nth-of-type(2) {
    color:#808080;
    font-size: 12px;
    margin-top: 3px;
  }

  .answer li p:nth-of-type(3) {
    overflow: hidden;
    margin-top: 6px;
    color:#b4b4b6;
    font-size: 12px;
  }



  .answer li p:nth-of-type(2) span:nth-of-type(1) {
    float:left;
    font-size: 12px;
    color: #b4b4b6;
  }
 .listWrapper{
    top: 45px;
  }

</style>
