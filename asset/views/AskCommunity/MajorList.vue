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

          <!--推荐问答-->

          <div class="recommendlist" >
            <div class="quiz">
              <p>
                <span>热门</span>
                <button @tap.stop.prevent="$router.pushPlus('/ask')">提问</button>
                <i class="bot"></i>
              </p>
            </div>
            <div>
              <ul class="recommend_b">
                <li @tap.stop.prevent="toDetail()">
                  <div class="recommend_d">
                    <p>
                      <img src="../../statics/images/guide_01.png"/>
                      <svg class="icon" aria-hidden="true" >
                        <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                      </svg>
                    </p>
                    <p class="mui-ellipsis">
                      李专家回答了专业问答
                    </p>
                  </div>
                  <p class="mui-ellipsis-2">最近开始研究S4 HANA，请问专家1610版本在PP主数据上有什么样的新变化？</p>
                  <p class="problem_details">
                    <span>80%好评</span>
                    <span>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-dianzan1"></use>
                      </svg>
                      <i>23232</i>
                    </span>
                    <span>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-pinglun1"></use>
                      </svg>
                      <i>23232</i>
                    </span>
                  </p>
                  <p class="problem_state">1元看答案／看评论</p>
                  <p class="problem_state">查看回答</p>
                  <!--v-show="index != recommendList.length-1" -->
                  <i class="bot"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

</template>

<script>
  import { postRequest } from '../../utils/request'

  const MajorList = {
    data: () => ({
      hotList: [],
      recommendList: [],
      busy: false,
      loading: true
    }),
    computed: {
    },
    components: {},
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
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  /*提问样式*/

  .quiz {
    width: 92%;
    height: 44px;
    margin-left: 4%;
    background: #FFFFFF;
    position: relative;
  }

  .quiz span {
    display: block;
    font-size: 16px;
    color: #444444;
    line-height: 44px;
    float: left;
  }

  .quiz button {
    width: 65px;
    height: 29px;
    font-size: 14px;
    color: #FFFFFF;
    background: #03aef9;
    float: right;
    margin-top: 7px;
    border: none;
  }


  /*推荐问答*/

  .recommendlist {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
  }

  /*问答列表*/

  .recommend_b {
    width: 90%;
    margin-left: 5%;
    /*height: 200px;*/
    overflow: hidden;
  }

  .recommend_b li {
    width: 100%;
    overflow: hidden;
    padding: 12px 0;
    position: relative;
  }

  .recommend_b li > p:nth-of-type(1) {
    font-size: 14px;
    color: #444444;
    margin-top: 5px;
  }
  .problem_details{
    width:100%;
    height:38px;
    font-size: 13px;
    line-height: 38px;
  }
  .problem_details span:nth-of-type(1){
    color: #b4b4b6;
    float:left;
  }
  .problem_details span:nth-of-type(2){
    color:#808080;
    float: right;
  }
  .problem_details span:nth-of-type(2) svg{
    color:#808080;
    font-size:18px;
  }
  .problem_details span:nth-of-type(3){
    color:#808080;
    float: right;
    margin-right: 30px;

  }
  .problem_details span:nth-of-type(3) svg{
    color:#808080;
    font-size:16px;
    margin-bottom: -2px;
  }
  .problem_state{
    width:100%;
    height:44px;
    background: #03aef9;
    border-radius: 50px;
    text-align: center;
    line-height: 44px;
    font-size:16px;
    color: #f2f2f2;
  }

  .recommend_d {
    width: 100%;
    height: 32px;
  }

  .recommend_d p {
    float: left;
  }

  .recommend_d p:nth-child(1) {
    width: 32px;
    height: 32px;
    /*background: #CCCCCC;*/
    position: relative;
  }

  .recommend_d p:nth-child(1) > svg {
    position: absolute;
    font-size: 14px;
    bottom: 0;
    right: -4px;
  }

  .recommend_d p:nth-child(1) > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .recommend_d p:nth-child(2) {
    /*width: 340px;*/
    height:32px;
    line-height: 32px;
    margin-left:8px;
    font-size: 13px;
    color: #808080;
  }

  .recommend_d p:nth-child(2) span:nth-child(1) {
    height: 15px;
    margin-top: 8.5px;

    text-align: center;
    line-height: 15px;
    padding: 0 3%;
  }

  .recommend_d p:nth-child(2) span:nth-child(2) {
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    border-right: 1px solid #c8c8c8;
    text-align: center;
    line-height: 15px;
    padding: 0 3%;
  }

  .recommend_d p:nth-child(2) span:nth-child(3) {
    height: 15px;
    margin-top: 8.5px;
    font-size: 13px;
    color: #808080;
    text-align: center;
    line-height: 15px;
    padding: 0 3%;
  }


  /*滚动区域*/

  .mui-content {
    background-color: #fff;
  }


  .menu {
    position: relative;
    z-index: 7;
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

</style>
