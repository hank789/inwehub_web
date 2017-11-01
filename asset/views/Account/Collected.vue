<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的收藏</h1>
    </header>


    <div class="mui-content">
      <!--导航栏-->
      <div class="menu">
        <span @tap.stop.prevent="">问答  <i></i></span>
        <span @tap.stop.prevent="$router.replace('/my/collectedArticle')">文章</span>
        
      </div>
      
      
      <RefreshList
        v-model="list"
        :api="'collected/answers'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        :list="list"
         class="listWrapper"
      >
        <ul class="hotAnswer_b">
          <li class="listBottomBorder" v-for="(item, index) in list" @tap.stop.prevent="toDetail(item)">
            <div class="mui-ellipsis title">{{ item.title }}</div>
            <div class="mui-ellipsis-2 titleSub">{{ item.description?item.description:'[图片]' }}</div>
            <div class="hotAnswer_d">
              <p>
                <img :src="item.user_avatar_url"/>
                <svg class="icon" aria-hidden="true" v-show="item.is_expert">
                  <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                </svg>
              </p>
              <p class="mui-ellipsis">回答者：{{ item.user_name}}</p>
            </div>
            <i class="bot"></i>
          </li>
        </ul>

      </RefreshList>
    </div>
  </div>
</template>

<script>
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import RefreshList from '../../components/refresh/List.vue';


  const Obj = {
    data: () => ({
      list: []
    }),
    components: {
      RefreshList
    },
    methods: {
      toDetail(item) {
          if (item.question_type === 2) {
            this.$router.pushPlus('/askCommunity/interaction/' + item.answer_id, 'list-detail-page', true, 'pop-in', 'hide', true);
          } else {
            this.$router.pushPlus('/askCommunity/major/' + item.question_id, 'list-detail-page', true, 'pop-in', 'hide', true);
          }
      },
    },
    computed: {
    },
    mounted(){
      window.addEventListener('refreshData', (e) => {
        //执行刷新
        console.log('refresh-onlookerslist');
      });
    }
  };
  export default Obj;

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

  .mui-content{
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
    width: 50%;
    height: 100%;
    float: left;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }
  
  .menu span:nth-of-type(1) {
    color: #3c95f9;
    position: relative;
  }
  
  .menu i {
    display: block;
    position: absolute;
    width: 27px;
    height: 1.5px;
    left: 42%;
    bottom: 0.5px;
    background: #3c95f9;
  }
  

  .bot {
    position: absolute;
    right: 15px;
    bottom: 0;
    left:15px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .hotAnswer_b {
    /*height: 200px;*/
    overflow: hidden;
  }

  .hotAnswer_b li {
    width: 100%;
    padding:15px 15px;
    position: relative;
  }

  .hotAnswer_b li > p {
    margin-top: 12px;
    font-size: 16px;
    color: #444444;
  }

  .hotAnswer_d {
    width: 100%;
    height: 32px;
  }

  .hotAnswer_d p {
    float: left;
  }

  .hotAnswer_d p:nth-child(1) {
    width: 32px;
    height: 32px;
    /*background: #CCCCCC;*/
    position: relative;
  }

  .hotAnswer_d p:nth-child(1) > svg {
    position: absolute;
    font-size: 14px;
    bottom: 0;
    right: -4px;
  }

  .hotAnswer_d p:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .hotAnswer_d p:nth-child(2) {
    width: 32%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    margin-left:10px;
    line-height: 15px;
  }

  .hotAnswer_d p:nth-child(3) {
    width: 21%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    border-right: 1px solid #c8c8c8;
    text-align: center;
    line-height: 15px;
  }

  .hotAnswer_d p:nth-child(4) {
    width: 37.5%;
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    text-align: center;
    line-height: 15px;
  }

  /*无数据的样式 */

  .container {
    position: absolute;
    top: 40%;
    left: 36%;
  }

  .container svg {
    font-size: 60px;
    margin-left: 23px;
    margin-bottom: 8px;
  }

  .container p {
    font-size: 12px;
    color: #c8c8c8;
  }

  .title{
    font-size:16px;
    color:#444;
  }
  .titleSub{
    font-size:14px;
    color:#808080;
    padding:5px 0 0;
  }
  
  .listWrapper{
    top: 45px;
  }
</style>
