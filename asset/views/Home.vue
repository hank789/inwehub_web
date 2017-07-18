<template>
  <div>


    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-icon myicon myicon-project2 mui-pull-left" @tap.stop.prevent="$router.pushPlus('/company/my')"></a>
      <!--<h1 class="mui-title">InweHub</h1>-->
      <span class="mui-icon myicon myicon-home-title"></span>
      <a class="mui-icon myicon myicon-expert mui-pull-right" @tap.stop.prevent="expertNav"></a>
    </header>

    <div class="mui-content" v-show="!loading">


      <div class="professor">
        <div class="avatar">
          <div class="avatarInner">
            <img :src="recommend_expert_avatar_url" class="avatar"/>
          </div>
        </div>
        <div class="text">
          <div class="realname">{{ recommend_expert_name }}</div>
          <div class="label">
            <div class="collect myicon myicon-home-vip"></div>
            今日专家

          </div>
          <div class="options">
            <div class="buttonAsk" @tap.stop.prevent="$router.push('/ask?id=' + recommend_expert_uuid)"><span>+</span> 向Ta提问</div>
            <div class="collect" @tap.stop.prevent="collectProfessor" v-if="!recommend_expert_is_followed"><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucang"></use>
            </svg></div>
            <div class="collect collect-active" @tap.stop.prevent="collectProfessor" v-else><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucanghover"></use>
            </svg></div>
          </div>
        </div>
      </div>

      <div class="professorDesc">
        <div class="title"><span class="icon"></span>专家简介
             <span class="titleSub">资深专家每日更新</span>
        </div>
        <div class="detail">
          {{ recommend_expert_description }}

        </div>
      </div>

      <div class="freeAskWrapper" v-show="couponExpireAtText" @tap.stop.prevent="$router.pushPlus('/ask')">
        <div class="freeAsk mui-navigate-right">
          <div class="icon"></div>
          <div class="text">你的首问免费机会还剩 <div v-html="couponExpireAtText"></div></div>
        </div>
      </div>


      <div class="bountyDesc">
        <div class="title">
          <span class="icon"></span>最新奖励
                <span class="titleSub">现金奖励优质问答</span>
        </div>
      </div>


      <div class="bountyDescList">

        <div class="detail" v-for="item in recommend_qa">
          <div class="image">
            <img :src="item.user_avatar_url"/>
          </div>
          <div class="text">
            <div class="content mui-ellipsis-3">
              {{item.description}}
            </div>
            <div class="realname">{{ item.user_name }}</div>
            <div class="amount">额外奖励{{ item.price }}元</div>
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
      </ul>
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a @tap.stop.prevent="expertNav"><b>取消</b></a>
        </li>
      </ul>
    </div>

    <div id="freeAskTemplate" style="display: none;">
        <div class="freeAskGet"></div>
        <div class="freeAskGetButton" @tap.stop.prevent="getFreeAsk()"></div>
    </div>

    <div id="freeAskSuccessTemplate" style="display: none;">
      <div class="xiaoha"></div>
      <div class="success"></div>
      <div class="close" @tap.stop.prevent="closeFreeAskSuccessTemplate()"><svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-times"></use>
      </svg></div>
    </div>


  </div>

</template>
<script>

  import {NOTICE, ASK_INFO, ASK_TYPE_SELECT} from '../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../utils/request';
  import {apiRequest} from '../utils/request';
  import {TimeEndText} from '../utils/time';

  const Home = {
    data: () => ({
      recommend_expert_name:'',
      recommend_expert_description:'',
      recommend_expert_uuid:'',
      recommend_expert_uid:'',
      recommend_expert_avatar_url:'',
      recommend_qa:[],
      recommend_expert_is_followed:0,
      firstAsk:false,
      couponExpireAt:'',
      loading: true
    }),
    created () {

    },
    activated: function () {
      this.getData();
    },
    mounted(){
      showInwehubWebview();
      document.body.style.backgroundColor = '#fff';
    },
    beforeRouteLeave(to, from, next) {
      document.body.style.backgroundColor = '#efeff4';
      next();
    },
    computed: {
      couponExpireAtText(){
          if (this.couponExpireAt) {
              return TimeEndText(this.couponExpireAt);
          }
      }
    },
    methods: {
      closeFreeAskSuccessTemplate:function(){
        var FreeTemplate = document.getElementById('freeAskSuccessTemplate');
        FreeTemplate.style.display = 'none';
        if (mui('.mui-backdrop')[0]) {
          mui('.mui-backdrop')[0].style.display = 'none';
        }
      },
      getFreeAsk:function(){
        postRequest(`activity/getCoupon`, {'coupon_type':1}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }
          this.showFreeAskGetSuccess();
        });
      },
      showFreeAskGet:function(){
          var FreeTemplate = document.getElementById('freeAskTemplate');
          FreeTemplate.style.display = 'block';
          var mask = mui.createMask(() => {
            FreeTemplate.style.display = 'none';
          });
          mask.show();//显示遮罩
      },
      showFreeAskGetSuccess:function(){
        var FreeTemplate = document.getElementById('freeAskSuccessTemplate');
        FreeTemplate.style.display = 'block';
        var mask = mui.createMask(() => {
          FreeTemplate.style.display = 'none';
        });
        mask.show();//显示遮罩
      },
      shareProfessor:function(){
          mui.alert("我们还暂时不建议您分享！");
      },
      collectProfessor:function(){

        postRequest(`follow/user`, {id:this.recommend_expert_uid}).then(response => {
            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }
            this.recommend_expert_is_followed = !this.recommend_expert_is_followed;
            mui.toast(response.data.data.tip);
        });

      },
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

        if (mui.os.plus) {
          var a = [{
            title: "推荐专家"
          }];
          plus.nativeUI.actionSheet({
            cancel: "取消",
            buttons: a
          }, (b) => {
            switch (b.index) {
              case 0:
                  break;
              case 1:
                this.$router.pushPlus('/expert/recommend');
                break;
            }
          })
        } else {
          mui('#expert').popover('toggle');
        }
      },
      getData: function () {
        var t = this;
        apiRequest(`home`, {}).then(response_data => {
          if (response_data === false) {
            return;
          }
          t.recommend_expert_name = response_data.recommend_expert_name;
          t.recommend_expert_description = response_data.recommend_expert_description;
          t.recommend_expert_uuid = response_data.recommend_expert_uuid;
          t.recommend_expert_uid = response_data.recommend_expert_uid;
          t.recommend_expert_avatar_url = response_data.recommend_expert_avatar_url;
          t.recommend_qa = response_data.recommend_qa;
          t.recommend_expert_is_followed = response_data.recommend_expert_is_followed;
          t.firstAsk = response_data.first_ask_ac.show_first_ask_coupon;
          t.couponExpireAt = response_data.first_ask_ac.coupon_expire_at;
          t.loading = 0;
          if (t.firstAsk) {
              t.showFreeAskGet();
          }

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

<style>
  .freeAsk .text div span{
    color:#03aef9;
    margin-left:5px;
  }
  .mui-backdrop{
    background-color: rgba(0, 0, 0, .7) !important;
  }
</style>

<style scoped>
  .mui-bar .myicon-project2 {
    width:18px;
    height:18px;
    left: 10px;
    top: 12px;
  }

  .mui-bar .myicon-expert {
    width: 27px;
    height: 27px;
    right: 10px;
    top: 9px;
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
    width: 60%;
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
    width: 16px;
    height: 16px;
    opacity: 1;
    vertical-align: sub;
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

  .professor .options .collect .icon{
    font-size: 20px;
    position: relative;
    top: 1px;
  }

  .professor .options .collect-active{
    /*border:1px solid #4990E2;*/
  }
  .professor .options .collect-active .icon{
    color:#fff;
  }

  .professor .options .collect .myicon-share{
    width:15px;
    height:16px;
  }

  .professorDesc {
    color: #4A4A4A;
    font-size: 20px;
    background: #fff;
    padding: 10px 0 10px 20px;
  }

  .professorDesc .title {
    margin-bottom: 8px;
    font-size: 16px;
    padding-bottom:8px;
    position: relative;
  }

  .professorDesc .title .icon {
    position: relative;
    top: 2px;
    width: 16px;
    margin-right: 5px;
    display: inline-block;
    background: url("../statics/images/home-jinpai.png") no-repeat;
    height: 16px;
    background-size: cover;
  }

  .professorDesc .detail {
    font-size: 12px;
    line-height: 21px;
    padding-right:20px;
  }

  .bountyDesc {
    background: #fff;
    margin-top: 5px;
    padding:10px 0 0 20px;
  }

  .bountyDesc .title .icon {
    width: 13px;
    display: inline-block;
    background: url("../statics/images/home-jiangli.png") no-repeat;
    height: 16px;
    background-size: cover;
    position: relative;
    top: 2px;
    margin-right: 8px;
  }

  .bountyDesc .title {
    position: relative;
    line-height: 20px;
    font-size: 16px;
    color: #4A4A4A;
    padding-bottom: 11px;
  }

  .professorDesc .title:after{
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

  .bountyDesc .title:after{
    position: absolute;
    right: 0;
    bottom: 1px;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #D9D9D9;
  }


  .professorDesc .titleSub{
    display: inline-block;
    font-size: 12px;
    color: #9B9B9B;
    float:right;
    margin-right:20px;
    position: relative;
  }

  .bountyDesc .titleSub {
    display: inline-block;
    font-size: 12px;
    color: #9B9B9B;
    float:right;
    margin-right:20px;
    position: relative;
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
    bottom: -5px;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #D9D9D9;
  }

  .bountyDescList .detail:last-child .text:after {
    display: none;
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
    position: fixed;
    bottom:75px;
    left:50%;
    margin-left:-62px;
    z-index: 777;
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

  .myicon-home-title{
    position: absolute;
    left:50%;
    width:70px;
    margin-left:-35px !important;
    top:12px;
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

  .freeAskWrapper{
    position: relative;
    height:48px;
    margin-top:11px;
  }
  .freeAsk{
    position: absolute;
    left: 20px;
    right:20px;
  }
  .freeAsk .icon{
    position: absolute;
    width:35px;
    left:-8px;
    top:-5px;
    height:48px;
    display: inline-block;
    background-image: url("../statics/images/icon_xiaoha@2x.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .freeAsk .text{
     background: #dcdcdc;
     border:1px #dcdcdc solid;
     border-radius: 50px;
     font-size:14px;
     line-height: 14px;
     color:#323232;
     padding:13px 30px 13px 35px;

  }

  .freeAsk .text div{
    display: inline-block;
  }

  .freeAskGet{
    position: fixed;
    top:50%;
    left:50%;
    margin:-100px 0 0 -150px;
    background: url("../statics/images/freeAskGet@2x.png") no-repeat center;
    background-size:contain;
    width:300px;
    height:200px;
    z-index: 999;
  }

  .freeAskGetButton{
    position: fixed;
    top:50%;
    margin:-15px 0 0 -80px;
    left:50%;
    width:100px;
    height:50px;
    z-index: 1000;
  }

  .mui-navigate-right:after{
    right:10px;
    font-size:22px;
  }

  #freeAskSuccessTemplate .xiaoha{
    position: fixed;
    top:50%;
    left:50%;
    margin:-195px 0 0 -50px;
    background: url("../statics/images/xiaoha-welcome@2x.png") no-repeat center;
    background-size:contain;
    width:100px;
    height:150px;
    z-index: 999;
  }

  #freeAskSuccessTemplate .success{
    position: fixed;
    top:50%;
    left:50%;
    margin:-45px 0 0 -146px;
    background: url("../statics/images/getSuccess@2x.png") no-repeat center;
    background-size:contain;
    width:292px;
    height:91px;
    z-index: 999;
  }

  #freeAskSuccessTemplate .close{
    position: fixed;
    top:50%;
    left:50%;
    margin:90px 0 0 -19px;
    z-index: 999;
  }
  #freeAskSuccessTemplate .close .icon{
    font-size:38px;
    color: #b4b4b6;
  }

</style>
