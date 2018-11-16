<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title" v-if="isSelf">我的发布</h1>
      <h1 class="mui-title" v-else>Ta的发布</h1>
    </header>

    <div class="mui-content">
      <div class="container-searchMenu">
        <span @tap.stop.prevent="$router.replace('/my/publishAnswers/' + uuid)">回答</span>
        <span @tap.stop.prevent="$router.replace('/my/publishQuestions/' + uuid)">提问</span>
        <span class="font-family-medium">分享<i></i></span>
        <span @tap.stop.prevent="$router.replace('/my/publishComment/' + uuid)">评论</span>
        <span @tap.stop.prevent="$router.replace('/dianping/my/publishComments/' + uuid)">点评</span>
        <i class="bot"></i>
      </div>

      <RefreshList
        ref="RefreshList"
        :pageMode="true"
        v-model="list"
        :api="'readhub/mySubmission'"
        :prevOtherData="{type:0,uuid: this.uuid}"
        :nextOtherData="{type:0,uuid: this.uuid}"
        class="listWrapper">

        <ul class="answer">
          <li  v-for="(ask, index) in list" @tap.stop.prevent="toDetail(ask)">
            <div class="margin-10-0-0" v-if="ask.img.length && ask.type === 'text'">
              <Images :images="ask.img" class="newestList"></Images>
            </div>
            <div class="container-image margin-10-0-0" v-if="ask.img && ask.type !== 'text'" >
              <img :src="ask.img" />
            </div>
            <p class="mui-ellipsis-2"><span  v-html="textToLink(ask.title)"></span><a v-if="ask.domain">{{ask.domain}}</a> </p>
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
  import { textToLinkHtml, secureHtml } from '../../../utils/dom'
  import Images from '../../../components/image/Images.vue'
  import { getLocalUuid } from '../../../utils/user'

  const PublishAnswers = {
    data: () => ({
      list: [],
      uuid: getLocalUuid()
    }),
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    },
    activated: function () {
      this.refreshPageData()
    },
    computed: {
      isSelf () {
        if (getLocalUuid() === this.$route.params.uuid) {
          return true
        }
        return false
      }
    },
    components: {
      RefreshList,
      Images
    },
    methods: {
      refreshPageData () {
        if (this.$route.params.uuid) {
          this.uuid = this.$route.params.uuid
        }
      },
      textToLink (text) {
        return secureHtml(textToLinkHtml(text))
      },
      // 时间处理；
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      toDetail (data) {
        this.$router.pushPlus(data.comment_url, 'list-detail-page')
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

  .mui-content {
    background: #FFFFFF;
  }
  .listWrapper {
    top: 1.04rem;
  }
  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  /*滚动区域*/
  .margin-10-0-0 {
    margin-top: 0;
  }
  .margin-10-0-0 .newestList {
    margin: 0;
    padding: 0;
  }
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

  .answer {
    width: 92%;
    margin-left: 4%;
    overflow: hidden;
  }

  .answer li {
    width: 100%;
    overflow: hidden;
    padding: 0.4rem 0 0.346rem 0;
    position: relative;
  }
   .answer li div{
     margin-bottom: 0.32rem;
   }
  .answer li p:nth-of-type(1){
    font-size:0.4rem;
    color:#444444;


  }
  .answer li p:nth-of-type(1) a{
    font-size:0.32rem;
    color:rgb(180,180,182);

  }
   .answer li p:nth-of-type(2){
      font-size:0.32rem;
      color:#b4b4b6;
  }
  .answer li p:nth-of-type(2) a{
    font-size:0.32rem;
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
    top: 1.2rem;
  }

  .container-searchMenu {
    margin-top: 0;
  }
</style>
