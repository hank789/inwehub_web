<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">InweHub</h1>
    </header>

    <div class="mui-content">
      <div class="professor">
        <div class="avatar">
          <div class="avatarInner">
            <img src="images/uicon.jpg" class="avatar"/>
          </div>
        </div>
        <div class="text">
          <div class="realname">郭大红</div>
          <div class="label"><div class="collect"><span class="mui-icon fa fa-vimeo"></span></div>今日专家</div>
          <div class="options">
            <div class="buttonAsk"><span>+</span> 向他提问</div>
            <div class="collect"><span class="mui-icon fa fa-heart-o"></span></div>
            <div class="collect"><span class="mui-icon fa fa-share"></span></div>
          </div>
        </div>
      </div>

      <div class="professorDesc">
        <div class="title"><span class="icon"></span></div>
        <div class="detail mui-ellipsis-3">SAP咨询行业15年从业经历，熟悉离散制造行业，专注pp等模块，是一位非常自身的超级顾问。写三行，永远写三行都写三行。都写三行。都写三行。都写三行。都写三行。</div>
      </div>


      <div class="bountyDesc">
        <div class="title">
          <span class="icon"></span>奖励问答
            <span class="titleSub">优质问与答将会获现金奖励</span>
          <span class="more mui-navigate-right">更多</span>
        </div>
      </div>


      <div class="bountyDescList">

        <div class="detail">
          <div class="image">
            <img src="images/home-youzhitiwen.png"/>
          </div>
          <div class="text">
            <div class="content mui-ellipsis-3">
              SAP咨询行业15年从业经历，熟悉离散制造行业，好回答的问题标题，哈哈哈哈合肥市说u 发挥绥芬河市东方。
              AP咨询行业15年从业经历，熟悉离散制造行业，好回答的问题标题，哈哈哈哈合肥市说u 发挥绥芬河市东方。
          </div>
            <div class="realname">Mike zhang</div>
            <div class="amount">额外奖励100元</div>
          </div>
        </div>

        <div class="detail">
          <div class="image">
            <img src="images/home-youzhitiwen.png"/>
          </div>
          <div class="text">
            <div class="content mui-ellipsis-3">
              SAP咨询行业15年从业经历，熟悉离散制造行业，好回答的问题标题，哈哈哈哈合肥市说u 发挥绥芬河市东方。
              AP咨询行业15年从业经历，熟悉离散制造行业，好回答的问题标题，哈哈哈哈合肥市说u 发挥绥芬河市东方。
          </div>
            <div class="realname">Mike zhang</div>
            <div class="amount">额外奖励100元</div>
          </div>
        </div>
      </div>

      <div class="askDetail">
        <div class="buttonAsk"><span>+</span> 付费提问</div>
      </div>

    </div>

    <div class="mui-content loading" v-show="loading">
      <div class="loading">
        <img :src="loading_gif"/>
      </div>
    </div>


    <div class="mui-content" v-show="!loading">
      <div class="homeWrapper">
        <div class="topWrapper">
          <div class="left">
            <div class="title">资深专家推荐</div>
            <img :src="headerImageUrl"/>
          </div>
          <div class="right">
            <div class="item apply" @tap.stop.prevent="$router.push('/expert')">
              <div class="buttons">
                <span class="mui-icon fa fa-check"></span><span class="mui-icon fa fa-chevron-right"></span>
              </div>
              申请专家


            </div>

            <div class="item recommend" @tap.stop.prevent="$router.push('/expert/recommend')">
              <div class="buttons">
                <span class="mui-icon fa fa-gift"></span><span class="mui-icon fa fa-chevron-right"></span>
              </div>
              推荐专家


            </div>
          </div>
        </div>
        <div class="ask"><span class="title">本周优质提问</span><span class="mui-icon fa fa-refresh fa-spin" v-if="loopAsk"></span><span class="mui-icon fa fa-refresh" @tap.stop.prevent="getAsks" v-else></span></div>
        <div class="askList">
          <div class="person" v-for="(person, index) in recommendQa" >
            <div class="avatar">
              <div class="avatarInner">
                <img :src="person.user_avatar_url"/>
              </div>
            </div>
            <div class="mui-media-body">
              <span class="username">{{ person.user_name }}</span>
              <span class="status">专家已回答</span>
              <div class="mui-ellipsis-2">
                {{ person.description }}


              </div>
              <span class="amount">奖励{{ person.price }}元</span>
            </div>
          </div>
        </div>

        <div class="answer"><span class="title">SAP行业专业问答</span><span class="label">优质提问返现</span>
        </div>


        <div class="tags"><span>专业</span><span>|</span><span>高效</span><span>|</span><span>准确</span></div>
        <div class="askButton">
          <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.push('/ask')">
            立即提问<br/><span>平台服务保障</span></button>
        </div>
        <div class="tabs">
          <div class="tabs-item">
            <span class="mui-icon fa fa-user-secret"></span>
            <span class="text">{{ expertNumber }}名行业专家</span>
          </div>
          <div class="tabs-item">
            <span class="mui-icon fa fa-clock-o"></span>
            <span class="text">平均2小时应答</span>
          </div>
          <div class="tabs-item">
            <span class="mui-icon fa fa-thumbs-up"></span>
            <span class="text">跨越{{ industryNumber }}个行业</span>
          </div>
        </div>
        <div class="mb70"></div>
      </div>
    </div>

  </div>
</template>

<script>

  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../utils/request';
  import {apiRequest} from '../utils/request';
  import homeJiangli from '../statics/images/home-jiangli.png';
  import homeJinpai from '../statics/images/home-jinpai.png';

  const Home = {
    data: () => ({
      loopAsk:false,
      expertNumber:'--',
      loading:true,
      averageAnswerMinute:'--',
      industryNumber:'--',
      headerImageUrl:'',
      recommendQa:[],
      loading_gif:loading_gif,
      homeJiangli:homeJiangli,
      homeJinpai:homeJinpai
    }),
    created () {
      this.getData();
    },
    methods: {
      getData:function(){
        var t = this;
        apiRequest(`home`,{}).then(response_data => {
          t.expertNumber = response_data.expert_number;
          t.averageAnswerMinute = response_data.average_answer_minute;
          t.industryNumber = response_data.industry_number;
          t.headerImageUrl  = response_data.header_image_url;
          t.recommendQa  = response_data.recommend_qa;
          t.loading = false;
        });
      },
      getAsks:function(){
          this.getData();
          this.loopAsk = true;
          setTimeout(() => {
              this.loopAsk = false;
          }, 2000)
      }
    }
  };
  export default Home;
</script>

<style scoped>
  .homeWrapper{
    border-bottom:1px solid #f2f2f2;
  }
  .topWrapper {
    height: 164px;
    display: -webkit-flex;
    display: flex;
    background: #fff;
  }
  .topWrapper .left img{
    position:absolute;
    width:100%;
    height:100%;
    z-index: 2;
  }
  .topWrapper .left {
    position: relative;
    flex-grow: 1;
    -webkit-flex-grow: 1;
    border-bottom:1px solid #f2f2f2;
  }

  .topWrapper .left .title {
    font-weight: bold;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 3;
  }

  .topWrapper .right {
    width: 101px;
    border-left: 1px solid #f2f2f2;
  }

  .topWrapper .right .item {
    height: 82px;
    border-bottom: 1px solid #f2f2f2;
    text-align: center;
    padding-top: 10px;
  }

  .topWrapper .buttons {
    position: relative;
    margin-bottom: 5px;
  }

  .topWrapper .fa-check, .topWrapper .fa-gift{
    color: #587dd5;
    font-size: 32px;
    opacity: 0.5;
  }

  .topWrapper .fa-chevron-right {
    color: #bbb;
    position: relative;
    top: -7px;
    right: -7px;
    font-size: 18px;
  }

  .ask {
    height: 35px;
    line-height: 35px;
    position: relative;
  }

  .ask .title {
    padding-left: 10px;
    font-weight: bold;
  }

  .ask .mui-icon {
    font-size: 24px;
    color: #587dd5;
    position: absolute;
    opacity: 0.6;
    right: 20px;
    top: 5px;
  }

  .askList {
    background: #fff;
  }

  .askList .avatar {
    z-index: 0;
    color: #ffffff;
    float: left;
    display: inline-block;
    margin-top: 3px;
    margin-right: 10px;
    height: 32px;
    width: 32px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
  }

  .askList .avatarInner {
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

  .askList .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .askList .username, .askList .status {
    color: #a8a8a8;
    font-size: 12px;
  }

  .askList .mui-media-body {
    position: relative;
    padding-left: 10px;
  }

  .askList .mui-media-body div {
    color: #555;
    font-size: 12px;
  }

  .askList .mui-ellipsis-2 {
    margin-top: 5px;
  }

  .askList .amount {
    background: #e26153;
    color: #fff;
    border-radius: 5px;
    font-size: 12px;
    padding: 1px 5px;
    position: absolute;
    right: 0;
    top: 3px;
    -webkit-transform: scale(.8);
    transform: scale(.8);
  }

  .askList .person {
    margin: 0px 10px;
    padding: 10px 0;
    border-top: 1px solid #f2f2f2;
  }

  .answer {
    position: relative;
    height: 35px;
    line-height: 35px;
    border-top: 1px solid #f2f2f2;

  }

  .answer .title {
    font-weight: bold;
    margin-left: 10px;
  }

  .answer .label {
    background: #e26153;
    color: #fff;
    border-radius: 5px;
    font-size: 12px;
    padding: 1px 5px;
    position: absolute;
    line-height: 21px;
    right: 8px;
    top: 7px;
    -webkit-transform: scale(.8);
    transform: scale(.8);
  }

  .tabs {
    margin-top: 15px;
    padding-bottom: 10px;
  }

  .tabs .tabs-item {
    display: inline-block;
    text-align: center;
    width: 32%;
  }

  .tabs .tabs-item .mui-icon {
    display: block;
    color: #587dd5;
    font-size: 32px;
    margin-bottom: 10px;
  }

  .tabs .tabs-item .text {
    font-size: 14px;

  }

  .tags {
    padding-left: 15px;
  }

  .tags span {
    font-size: 14px;
    margin: 0 5px;
  }

  .askButton {
    margin-top: 15px;
    padding: 0 50px;
  }

  .askButton button {
    padding: 5px 0;
    border-radius: 8px;
    line-height: 22px;
    font-size: 22px;
  }

  .askButton button span {
    font-size: 14px;
  }

  .mui-content {
    background: #fff;
  }

  .mui-content.loading{
    background: none;
  }
</style>
