<template>
  <div>


    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-icon myicon myicon-project2 mui-pull-left" @tap.stop.prevent="$router.push('/project')"></a>
      <h1 class="mui-title">InweHub</h1>
      <a class="mui-icon myicon myicon-expert mui-pull-right" @tap.stop.prevent="expertNav"></a>
    </header>

    <div class="mui-content">


      <div class="professor">
        <div class="avatar">
          <div class="avatarInner">
            <img src="../statics/images/uicon.jpg" class="avatar"/>
          </div>
        </div>
        <div class="text">
          <div class="realname">郭大红</div>
          <div class="label">
            <div class="collect"><span class="mui-icon fa fa-vimeo"></span></div>
            今日专家

          </div>
          <div class="options">
            <div class="buttonAsk" @tap.stop.prevent="$router.push('/ask')"><span>+</span> 向他提问</div>
            <div class="collect"><span class="mui-icon fa fa-heart-o"></span></div>
            <div class="collect"><span class="mui-icon fa fa-share"></span></div>
          </div>
        </div>
      </div>

      <div class="professorDesc">
        <div class="title"><span class="icon"></span>专家介绍</div>
        <div class="detail mui-ellipsis-3">
          SAP咨询行业15年从业经历，熟悉离散制造行业，专注pp等模块，是一位非常自身的超级顾问。写三行，永远写三行都写三行。都写三行。都写三行。都写三行。都写三行。

        </div>
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
            <img src="../statics/images/home-youzhitiwen.png"/>
          </div>
          <div class="text">
            <div class="content mui-ellipsis-3">
              SAP咨询行业15年从业经历，熟悉离散制造行业，好回答的问题标题，哈哈哈哈合肥市说u 发挥绥芬河市东方。


            </div>
            <div class="realname">Mike zhang</div>
            <div class="amount">额外奖励100元</div>
          </div>
        </div>

        <div class="detail">
          <div class="image">
            <img src="../statics/images/home_youzhihuida.png"/>
          </div>
          <div class="text">
            <div class="content mui-ellipsis-3">
              SAP咨询行业15年从业经历，熟悉离散制造行业，好回答的问题标题，哈哈哈哈合肥市说u 发挥绥芬河市东方。


            </div>
            <div class="realname">Mike zhang</div>
            <div class="amount">额外奖励100元</div>
          </div>
        </div>
      </div>

      <div class="askDetail">
        <div class="buttonAsk" @tap.stop.prevent="$router.push('/ask')"><span>+</span> 付费提问</div>
      </div>

      <div class="mb70"></div>
    </div>


    <div id="expert" class="mui-popover mui-popover-action mui-popover-bottom">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="goRecommand">推荐专家</a>
        </li>
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="goExpert">专家管理</a>
        </li>
      </ul>
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="expertNav"><b>取消</b></a>
        </li>
      </ul>
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
      loopAsk: false,
      expertNumber: '--',
      loading: true,
      averageAnswerMinute: '--',
      industryNumber: '--',
      headerImageUrl: '',
      recommendQa: [],
      loading_gif: loading_gif,
      homeJiangli: homeJiangli,
      homeJinpai: homeJinpai
    }),
    created () {
      this.getData();
    },
    mounted(){
      document.body.style.backgroundColor = '#fff';

//      var offCanvasInner = document.querySelector('.mui-inner-wrap');
//      offCanvasInner.addEventListener('drag', function(event) {
//        event.stopPropagation();
//      });
    },
    beforeRouteLeave(to, from, next) {
      document.body.style.backgroundColor = '#efeff4';
      next();
    },
    methods: {
      goRecommand: function () {
        this.expertNav();
        this.$router.push('/expert/recommend')
      },
      goExpert: function () {
        this.expertNav();
        this.$router.push('/expert')
      },
      toggleMenu(){
        mui('.mui-off-canvas-wrap').offCanvas('toggle');
      },
      expertNav: function () {
        mui('#expert').popover('toggle');
      },
      getData: function () {
        var t = this;
        apiRequest(`home`, {}).then(response_data => {
          if (response_data === false) {
            return;
          }
          t.expertNumber = response_data.expert_number;
          t.averageAnswerMinute = response_data.average_answer_minute;
          t.industryNumber = response_data.industry_number;
          t.headerImageUrl = response_data.header_image_url;
          t.recommendQa = response_data.recommend_qa;
          t.loading = false;
        });
      },
      getAsks: function () {
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
  .mui-bar .myicon-project2 {
    width:18px;
    height:18px;
    left: 10px;
    top: 10px;
  }

  .mui-bar .myicon-expert {
    width: 27px;
    height: 27px;
    right: 10px;
    top: 12px;
  }

  .professor {
    background-color: #161616;
    text-align: center;
    position: relative;
    height: 136px;
  }

  .professor .text {
    width: 65%;
    height: 100%;
    padding-top: 20px;
    padding-left: 0px;
    display: inline-block;
    color: #fff;
    text-align: left;

  }

  .professor .label {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 14px;
  }

  .professor .text .realname {
    font-size: 20px;
    font-weight: bolder;
    margin-left: 20px;
  }

  .avatar {
    z-index: 9;
    color: #ffffff;
    display: inline-block;
    margin-top: 10px;
    height: 100px;
    width: 100px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
    vertical-align: top;
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

  .professor .options {
    position: relative;
    margin-top: 30px;
    margin-left: 10px;
  }

  .professor .buttonAsk {
    position: relative;
    display: inline-block;
    width: 48%;
    height: 37px;
    font-size: 14px;
    line-height: 37px;
    text-align: center;
    border: 1px solid #fff;
    border-radius: 50px;
    padding-left: 20px;
  }

  .professor .buttonAsk span {
    position: absolute;
    font-size: 30px;
    left: 10px;
    top: -4px;
  }

  .professor .label .collect {
    display: inline-block;

    border: 1px solid #86C9EF;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #161616;
    text-align: center;
    font-size: 12px;
    margin-right: 3px;
    background: #86C9EF;
    opacity: 1;
  }

  .professor .options .collect {
    display: inline-block;
    border: 1px solid #fff;
    border-radius: 50%;
    width: 37px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    margin-left: 3%;
  }

  .professorDesc {
    color: #4A4A4A;
    font-size: 20px;
    background: #fff;
    padding: 10px 20px 10px;
  }

  .professorDesc .title {
    margin-bottom: 5px;
    font-size: 16px;
  }

  .professorDesc .title .icon {
    position: relative;
    top: 3px;
    width: 16px;
    margin-right: 2px;
    display: inline-block;
    background: url("../statics/images/home-jinpai.png") no-repeat;
    height: 16px;
    background-size: cover;
  }

  .professorDesc .detail {
    font-size: 12px;
    line-height: 24px;
  }

  .bountyDesc {
    background: #fff;
    margin-top: 5px;
    padding: 15px 0 0 20px;
  }

  .bountyDesc .title .icon {
    width: 13px;
    display: inline-block;
    background: url("../statics/images/home-jiangli.png") no-repeat;
    height: 16px;
    background-size: cover;
    position: relative;
    top: 2px;
    margin-right: 5px;
  }

  .bountyDesc .title {
    line-height: 20px;
    font-size: 16px;
    color: #4A4A4A;
    border-bottom: 1px solid #D9D9D9;
    padding-bottom: 10px;
  }

  .bountyDesc .titleSub {
    display: inline-block;
    font-size: 12px;
    color: #9B9B9B;
    position: relative;
    bottom: 1px;
  }

  .bountyDesc .more {
    display: inline-block;
    width: 63px;
    float: right;
    position: relative;
  }

  .bountyDescList {
    background: #fff;
  }

  .bountyDescList .detail {
    position: relative;
    padding: 20px 0 0 20px;
  }

  .bountyDescList .detail .image {
    position: absolute;
    display: inline-block;
    width: 60px;
  }

  .bountyDescList .detail .image img {
    width: 60px;
    height: 60px;
  }

  .bountyDescList .detail .text {
    margin-left: 70px;
    padding-bottom: 40px;
    padding-right: 10px;
    position: relative;
  }

  .bountyDescList .detail .text:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #D9D9D9;
  }

  .bountyDescList .detail:last-child .text {
    border-bottom: none;
  }

  .bountyDescList .detail .text .content {
    font-size: 12px;
    padding-right: 10px;
  }

  .bountyDescList .detail .realname {
    color: #4990E2;
    position: absolute;
    left: 0;
    bottom: 10px;
    font-size: 14px;
  }

  .bountyDescList .detail .amount {
    color: #F6A623;
    font-size: 14px;
    position: absolute;
    right: 20px;
    bottom: 10px;
  }

  .askDetail {
    height: 67px;
    line-height: 67px;
    text-align: center;
    background: #fff;
    margin-top: 5px;
  }

  .askDetail .buttonAsk {
    position: relative;
    background: #4990E2;
    display: inline-block;
    width: 125px;
    height: 37px;
    font-size: 14px;
    line-height: 37px;
    text-align: center;
    border-radius: 50px;
    padding-left: 20px;

    color: #fff;
  }

  .askDetail .buttonAsk span {
    position: absolute;
    font-size: 30px;
    left: 20px;
    top: -4px;
  }

  .footer-bar {
    background-color: #fff;
    box-shadow: none;
  }

  .footer-bar {
    border-top: 1px solid #D9D9D9;
  }

  .footer-bar .mui-active .myicon-point {
    width: 3px;
    height: 3px;
    top: 8px;
    left: -13px;
  }

  @media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
    .professor .options .collect {
      margin-left: 7% !important;
    }
  }

  @media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
    .professor .options .collect {
      margin-left: 9% !important;
    }
  }
</style>
