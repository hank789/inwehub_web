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
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*提问样式*/
  .recommendlist {
    width: 100%;
    height: 44px;
    overflow: hidden;
    background: #FFFFFF;
    position: relative;
  }
  .recommendlist p:nth-of-type(1){
    height:44px;
    float: left;
    line-height: 44px;
    font-size:16px;
    color: #444444;
    margin-left: 4%;
  }
  .recommendlist p:nth-of-type(2){
    width:81px;
    height:34px;
    margin-right: 4%;
    background:#a8dff7;
    border-radius: 4px;
    float: right;
    margin-top: 5px;
    line-height: 34px;
    font-size:14px;
    color: #444444;
    text-align: center;
    position: relative;
  }
  .recommendlist p:nth-of-type(2) svg{
    font-size: 22px;
    margin-bottom: -4px;
  }
  .recommendlist p:nth-of-type(2) i{
    position: absolute;
    font-style: normal;
    width: 30px;
    height: 17px;
    font-size: 12px;
    color: #FFFFFF;
    border-radius: 4px;
    background: #fa4975;
    text-align: center;
    line-height:16px;
    top: 2.5px;
    left: -24px;
  }
  .recommendlist p:nth-of-type(2) i:after {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background: #fa4975;
    /* border: 1px solid #dcdcdc; */
    position: absolute;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    right: -3px;
    top: 0px;
    bottom: 0;
    margin: auto;
  }


  /*问答列表*/
.listWrapper{
}
  .recommend_b {
    width: 100%;
    /*height: 200px;*/
    overflow: hidden;
  }

  .recommend_b li {
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    margin-bottom: 10px;
    padding: 12px 0;
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
    margin-bottom: 0px;
  }

  .mui-segmented-control .mui-control-item {
    line-height: 45px;
    font-size: 14px;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
    position: relative;
    color: #03aef9;
    border: none;
  }

  .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active:after {
    position: absolute;
    width: 56px;
    bottom: 0;
    left: 50%;
    margin-left: -28px;
    height: 2px;
    z-index: 999;
    content: '';
    background-color: #009FE8;
  }
  .listWrapper{
    top:90px;
  }



</style>

