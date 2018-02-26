<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答社区</h1>
    </header>

    <div class="mui-content absolute">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/askCommunity/majors')">
            专业问答
        </a>
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            互动问答
          </a>
        </div>
      </div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'question/commonList'"
        :prevOtherData="data"
        :nextOtherData="{}"
        :pageMode = true
        class="listWrapper"
      >
        <div class="recommendlist">
          <div>
            <ul class="mui-table-view">
              <li class="mui-table-view-cell" v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.id)">
                <div class="second mui-ellipsis-2">{{ item.description }}</div>
                <div class="three">{{ item.answer_num }}人回答<span class="split"></span><span :class="{isFollowed:item.is_followed_question?false:true}">关注问题{{item.follow_num}}</span></div>
                <div class="respondent mui-ellipsis" v-if="item.answer_num">
                  回答者：<span  v-for="(answer, index) in item.answer_user_list" @tap.stop.prevent="toAvatar(answer.uuid)">{{answer.name}}<i>,</i></span>
                  <i v-if="item.answer_num >  item.answer_user_list.length">等{{item.answer_num}}人</i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </RefreshList>



    </div>

    <div class="button-wrapper">
      <p class="propose" @tap.stop.prevent="$router.pushPlus('/ask/interaction')">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiugai"></use>
        </svg>
        提问
      </p>
     <div class="select" v-if="isShow">
       <p class="hot">最热</p>
     </div>
      <div class="newest" @tap.stop.prevent="showNewest()">
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shaixuan"></use>
          </svg>
          最新
        </p>
      </div>
    </div>

  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'

  const InteractionList = {
    data: () => ({
      list: [],
      isShow: 0,
      data: {
        page: 1
      }
    }),
    components: {
      RefreshList
    },
    methods: {
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      showNewest () {
        var page = this.data.page === 1 ? '' : 1
        this.data = {
          page: page
        }
      },
      toDetail (id) {
        this.$router.pushPlus('/askCommunity/interaction/answers/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
      }
    }
  }
  export default InteractionList
</script>

<style scoped>

  .mui-content {
    background: #fff;
  }

  .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    background-color: #bdbdbd;
    display: inline-block;
    height: 4.3rem;
    width: 4.3rem;
    font-size: 2rem;
    text-align: center;
    border-radius: 50%;
  }

  .avatar .avatarInner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .mui-media-body {
    padding-left: 1rem;
  }
  .mui-table-view-cell:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 1.5rem;
    height: 0rem;
  }

  .mui-table-view:after {
    display: none;
  }
  .mui-table-view{
    background: #f3f4f6;
  }

  .mui-table-view li{
    background: #FFFFFF;
    margin-bottom: 1rem;
  }
  .mui-table-view:before {
    display: none;
  }

  .detail {
    font-size: 1.3rem;
    color: #808080;
  }

  .first {
    height: 5rem;
  }

  .three {
    font-size: 1.2rem;
    color: #b4b4b6;
    padding-top: 0.5rem;
    text-align: right;
  }

  .split {
    position: relative;
    top: 0.3rem;
    margin: 0 1rem;
    display: inline-block;
    width: 0.1rem;
    height: 1.3rem;
    background: #c8c8c8;
    transform: scaleX(.5);
  }

  .menu {
    position: relative;
    z-index: 7;
  }

  .list-empty .menu {
    margin-bottom: 0rem;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 4.5rem;
    font-size: 1.4rem;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    position: relative;
    color: #03aef9;
    border: none;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active:after {
    position: absolute;
    width: 5.6rem;
    bottom: 0;
    left: 50%;
    margin-left: -2.8rem;
    height: 0.2rem;
    z-index: 999;
    content: '';
    background-color: #009FE8;
  }

  .mui-segmented-control {
    background: #f3f4f6;
  }

  #refreshContainer {
    top: 4.5rem;
  }

  .container {
    text-align: center;
    padding: 2rem;
  }

  .container svg {
    font-size: 6rem;

  }

  .container p {
    font-size: 1.2rem;
    color: #c8c8c8;
  }
  /* fixed样式*/

  .button-wrapper {
    position: fixed;
    bottom:2.7rem;
    right:1.4rem;
    width: 100%;
    height: 6.8rem;
    padding: 0;
    z-index: 99;
    /*border: 0.1rem solid #cccccc;*/
  }
  .propose{
    width:8.4rem;
    height:3.4rem;
    background:#03aef9;
    border-radius: 5rem;
    color: #FFFFFF;
    position: absolute;
    right:9rem;
    bottom: 0;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content:center;
    align-items:center;
  }
  .propose svg{
    font-size:1.8rem;
    line-height:3.4rem;
    margin-right: 0.5rem;
  }
  .select{
    width:8.4rem;
    height:6.8rem;
    background: #FFFFFF;
    border:0.1rem solid #dcdcdc;
    position: absolute;
    bottom: 0;
    right: 0;
    border-radius:1rem;
  }
  .newest{
    width:8.5rem;
    height:3.4rem;
    background: #FFFFFF;
    position:absolute;
    bottom: -0rem;
    right:-0.1rem;
    border-radius: 5rem;
  }
  .newest p{
    width:8.4rem;
    height:3.4rem;
    background:#03aef9;
    border-radius: 5rem;
    color: #FFFFFF;
    position: absolute;
    bottom: 0;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content:center;
    align-items:center;
  }
  .newest p svg{
    font-size:1.8rem;
    line-height:3.4rem;
    margin-right: 0.5rem;
  }
  .hot{
    width:8.4rem;
    height:3.4rem;
    font-size: 1.5rem;
    border-radius: 5rem;
    color: #808080;
    position: absolute;
    top:0;
    display: flex;
    flex-direction: row;
    justify-content:flex-end;
    align-items:center;
    margin: 0;
    padding: 0;
    padding-right: 1.2rem;
  }
/*回答者的样式*/
  .respondent{
    width:100%;
    padding: 1.2rem 1.5rem;
    background: #f3f4f6;
    font-size:1.3rem;
    color:rgb(128,128,128);
    border-radius: 0.4rem;
    margin-top: 1.2rem;
  }
  .respondent span{
    color: #03aef9;
  }
  .respondent i{
    color:rgb(146,146,146);
    margin-right: 0.5rem;
  }
  .respondent span:nth-last-of-type(1) i{
    display: none;
  }
  .respondent i{
    font-size:1.3rem;
    color:rgb(128,128,128);
    font-style: normal;
  }
  .isFollowed{
    color:#03aef9;
  }

  .second{
    font-size:1.6rem;
  }
</style>
