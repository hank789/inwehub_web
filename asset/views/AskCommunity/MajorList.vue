<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">问答社区</h1>
    </header>


    <div class="mui-content absolute">

      <div class="menu">
        <div class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-primary">
          <a class="mui-control-item mui-active" @tap.stop.prevent="">
            专业问答
        </a>
          <a class="mui-control-item" @tap.stop.prevent="$router.replace('/askCommunity/interactions')">
            互动问答
          </a>
        </div>
      </div>
      <div class="recommendlist" >
          <p>热门问答</p>
          <p @tap.stop.prevent="$router.pushPlus('/ask')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhuanyewenda-"></use>
            </svg>
            提问
            <i>分红</i>
          </p>
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
              <!--<div class="recommend_d">-->
                <!--<p>-->
                  <!--<img :src="item.answer_user_avatar_url"/>-->
                  <!--<svg class="icon" aria-hidden="true" v-if="item.answer_user_is_expert">-->
                    <!--<use xlink:href="#icon-zhuanjiabiaojishixin"></use>-->
                  <!--</svg>-->
                <!--</p>-->
                <!--<p class="mui-ellipsis">-->
                  <!--{{ item.answer_username }}-->
                <!--</p>-->
              <!--</div>-->
              <!--<p class="mui-ellipsis-2">{{item.description}}</p>-->
              <!--<p class="problem_details">-->
                <!--<span v-if="item.average_rate" class="average_rate">{{item.average_rate}}好评</span>-->
                <!--<span class="support_number">-->
                  <!--<svg class="icon" aria-hidden="true" >-->
                    <!--<use xlink:href="#icon-dianzan1"></use>-->
                  <!--</svg>-->
                  <!--<i v-if="item.support_number">{{item.support_number}}</i>-->
                <!--</span>-->
                <!--<span class="comment_number" >-->
                  <!--<svg class="icon" aria-hidden="true">-->
                    <!--<use xlink:href="#icon-pinglun1"></use>-->
                  <!--</svg>-->
                  <!--<i v-if="item.comment_number">{{item.comment_number}}</i>-->
              <!--</span>-->
              <!--</p>-->
              <!--<p class="problem_state" v-if="!item.is_pay_for_view">1元看答案／看评论</p>-->
              <!--<p class="problem_state" v-else>查看回答</p>-->
              <!--&lt;!&ndash;v-show="index != recommendList.length-1" &ndash;&gt;-->
              <!--&lt;!&ndash;点赞&ndash;&gt;-->
              <!--<div class="component-dianzanList" v-if="item.support_number">-->
                <!--<svg class="icon" aria-hidden="true">-->
                  <!--<use xlink:href="#icon-dianzan1"></use>-->
                <!--</svg>-->
                <!--<span  v-for="(supporter, index) in item.supporter_list">{{supporter.name}}</span>-->
                <!--<span v-if="item.support_number > item.supporter_list.length">等{{item.support_number}}人</span>-->
              <!--</div>-->
            </li>
          </ul>
      </RefreshList>
        </div>
      </div>

</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import AnswerMajor from '../../components/feed/AnswerMajor'

  const MajorList = {
    data: () => ({
      list: []
    }),
    computed: {
    },
    components: {
      RefreshList,
      AnswerMajor
    },
    methods: {
      toDetail (id) {
        this.$router.pushPlus('/askCommunity/major/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
      },
      selectType (typeText) {
        this.$router.push('/ask/type?type=majorlist')
      }
    },
    mounted () {
    }
  }
  export default MajorList
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
    right: 4%;
    bottom: 0;
    left: 4%;
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*提问样式*/
  .recommendlist {
    width: 100%;
    height: 4.4rem;
    overflow: hidden;
    background: #FFFFFF;
    position: relative;
  }
  .recommendlist p:nth-of-type(1){
    height:4.4rem;
    float: left;
    line-height: 4.4rem;
    font-size:1.6rem;
    color: #444444;
    margin-left: 4%;
  }
  .recommendlist p:nth-of-type(2){
    width:8.1rem;
    height:3.4rem;
    margin-right: 4%;
    background:#a8dff7;
    border-radius: 0.4rem;
    float: right;
    margin-top: 0.5rem;
    line-height: 3.4rem;
    font-size:1.4rem;
    color: #444444;
    text-align: center;
    position: relative;
  }
  .recommendlist p:nth-of-type(2) svg{
    font-size: 2.2rem;
    margin-bottom: -0.4rem;
  }
  .recommendlist p:nth-of-type(2) i{
    position: absolute;
    font-style: normal;
    width: 3rem;
    height: 1.7rem;
    font-size: 1.2rem;
    color: #FFFFFF;
    border-radius: 0.4rem;
    background: #fa4975;
    text-align: center;
    line-height:1.6rem;
    top: 2.0.5rem;
    left: -2.4rem;
  }
  .recommendlist p:nth-of-type(2) i:after {
    content: "";
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    background: #fa4975;
    /* border: 0.1rem solid #dcdcdc; */
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -0.3rem;
    top: 0rem;
    bottom: 0;
    margin: auto;
  }


  /*问答列表*/
.listWrapper{
}
  .recommend_b {
    width: 100%;
    /*height: 20rem;*/
    overflow: hidden;
  }

  .recommend_b li {
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    margin-bottom: 1rem;
    padding: 1.2rem 0;
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


  /*滚动区域*/

  .mui-content {
    background: #f3f4f6;
  }


  .menu {
    position: relative;
    z-index: 7;
    background: #f3f4f6;
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
  .listWrapper{
    top:9rem;
  }



</style>

