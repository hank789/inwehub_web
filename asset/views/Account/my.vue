<template>

   <div>
    <div class="mui-content">
    <div class="my-top">
       <div class="professor">
	      <div class="my-img">
	          <img :src="avatar" class="avatar"/>
	      </div>
	      
	      <div class="my-personal">
	      	 <div class="my-info">
	      	 	<span>郭大红</span>
	      	 	<img src="../../statics/images/rank.png" />
	      	 	<i>1</i>
				<svg class="icon" aria-hidden="true">
				  <use xlink:href="#icon-zhuanjiabiaoji"></use>
				</svg>
                <svg class="icon share" aria-hidden="true" @tap.stop.prevent="share">
				  <use xlink:href="#icon-fenxiang"></use>
				</svg>
	      	 	<span class="share" @tap.stop.prevent="share">分享名片</span>
	      	 </div>
	      	 
	      	 <div class="my-detail">
	      	 	<span class="grow">成长值:</span> 
	      	 	<span>{{user_credits }}</span>
                <span class="integral">贡献值:</span>
                <span>{{user_coins }}</span>
	      	 </div> 
	      </div>
	      
      </div>
      <div class="my-news">
	     	<p>关注<span>1</span></p>
	     	<p>咨询<span>2</span></p>
	     	<p>评分<span>3</span></p>
	     	<p>综合评分暂无</p>
	  </div>
	  
	  <div class="my-progress">
	    <span><i></i></span>
	    <span>72%</span>
	    <span @tap.stop.prevent="$router.pushPlus('/my/info')">编辑名片</span>
	  </div>
	  <div class="my-apply">
	  	<div>
	  		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-zhuanjiabiaoji"></use>
			</svg>
			<p>
				<span>申请专家认证</span>
				<span>专家已认证</span>
			</p>
			
	  	</div>
	  	<div>
	  	 <svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-zhuanjiabiaoji"></use>
		 </svg>
		 <p>
			<span>申请企业账号</span>
			<span>企业认证中</span>
		</p>
		
	  	</div>
	  </div>
	  
    </div>
    

      <div class="part2">
        <a class="item" @tap.stop.prevent="$router.pushPlus('/asks')">
          <span class="number">{{ questions }}</span><span>我的提问</span>
        </a>
        <a class="item" @tap.stop.prevent="$router.pushPlus('/answers')">
          <span class="number">{{ answers }}</span><span>我的回答</span>
        </a>
        <a class="item" @tap.stop.prevent="$router.pushPlus('/bid')">
          <span class="number">0</span><span>我的竞标</span>
        </a>
        <a  class="item"  @tap.stop.prevent="$router.pushPlus('/company/my')">
          <span class="number">{{ projects }}</span><span>我的项目</span>
        </a>
      </div>

       <ul class="my-option">
       	<li>
       		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-wodeguanzhu"></use>
			</svg>
			<span>我的关注</span>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-chakangengduojiantou"></use>
			</svg>
        </li>
       	<li  @tap.stop.prevent="$router.pushPlus('/collect')">
       		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-wodeshoucang"></use>
			</svg>
			<span >我的收藏</span>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-chakangengduojiantou"></use>
			</svg>
        </li>
       	<li @tap.stop.prevent="$router.pushPlus('/feedback')">
       		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-wodefankuijianyi"></use>
			</svg>
			<span >反馈建议</span>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-chakangengduojiantou"></use>
			</svg>
        </li>
       	<li @tap.stop.prevent="$router.pushPlus('/setting')">
       		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-wodeshezhi"></use>
			</svg>
			<span>设置</span>
			<svg class="icon" aria-hidden="true">
			 <use xlink:href="#icon-chakangengduojiantou"></use>
			</svg>
        </li>
       </ul>     

      
    </div>
    
     <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
          <div class="title">分享到</div>
          <div class="more">
               <div class="single" id="wechatShareBtn">
                   <img src="../../statics/images/wechat_2x.png"/>
               </div>
              <div class="single" id="wechatShareBtn2">
                <img src="../../statics/images/pengyouquan.png"/>
              </div>

          </div>
      </div>
    
	
  </div>
</template>
<script>
  import localEvent from '../../stores/localStorage';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND, USERS_APPEND} from '../../stores/types';
  import {updateUserInfoCache, getUserInfo} from '../../utils/user';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        im_tokenMsg: '',
        name: currentUser.name,
        phone: currentUser.phone,
        avatar: currentUser.avatar_url,
        title: currentUser.title,
        company: currentUser.company,
        account_info_complete_percent: currentUser.account_info_complete_percent,
        isExpert: currentUser.is_expert,
        total_money: currentUser.total_money,
        user_level:currentUser.user_level,
        user_credits:currentUser.user_credits,
        user_coins:currentUser.user_coins,
        questions:currentUser.questions,
        answers:currentUser.answers,
        tasks:currentUser.tasks,
        projects:currentUser.projects,
        expert_level:currentUser.expert_level,
        show_my_wallet:currentUser.show_my_wallet,
        show_resume: true,
        my:""
      }
    },
    methods: {
    	getData:function(){
        postRequest(`profile/resumeInfo`, {uuid:this.uuid}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
          }
          this.my = response.data.data;
          this.loading = 0;
          this.bindWechatShare();
        });
      },
      yaoqing(){
        mui.alert('您可以通过贡献值换取邀请码，邀请更多的用户注册并获取更多回报。在此之前请先提升您的平台成长值和等级。');
      },
      shareOut(){
        mui.alert('我们还暂时不建议您分享！');
      },
      integralDemo(){
          //mui.alert('小哈正在帮大家争取福利，请再稍等一阵！');
      },
      getToken(){
        var im_token = JSON.parse(sessionStorage.getItem('im_token'))
        this.im_tokenMsg = im_token;
      },
      share(){
        setTimeout(()=>{
          mui('#shareWrapper').popover('toggle');
        }, 150);
      },
      initData(){
        //执行刷新
        console.log('refresh-my');
        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user);
          this.account_info_complete_percent = user.info.account_info_complete_percent;
          this.isExpert = user.info.is_expert;
          this.user_level = user.info.user_level;
          this.user_credits = user.info.user_credits;
          this.user_coins = user.info.user_coins;
          this.questions = user.info.questions;
          this.answers = user.info.answers;
          this.tasks = user.info.tasks;
          this.projects = user.info.projects;
          this.expert_level = user.info.expert_level;
          this.show_my_wallet = user.info.show_my_wallet;

          this.avatar = user.info.avatar_url;
          this.name = user.info.name;
          this.title = user.info.title;
        }));
      }
    },
    created () {
      showInwehubWebview();
    },
    activated: function () {
      this.initData();
    },
    mounted(){
      this.getToken();
    }
  }

</script>

<style  lang="less" rel="stylesheet/less"  scoped>
 .my-top{
 	width: 100%;
 	height: 310px;
 	padding: 0 15px 0 17px;
 	background-color: #ffffff;
 }

  .professor{
    width: 100%;
    height: 100px;
  } 
  
  .professor .avatar {
  	width: 69px;
  	height: 68.5px;
  	border-radius: 50%;
  	margin-top: 30.5px;
  	float: left;
  }
 
 .my-personal {
   width:75%;
   height: 69px;
   margin: 30.5px 0 0 15.5px;
   float: left;
 } 
 
 .my-personal .my-info{
  width: 100%;
  height: 30px;	
  border-bottom:1.5px solid rgb(220,220,220);	
  margin-bottom:9px;
 }

 
 .my-personal .my-info span:nth-of-type(1){
 	font-family: "PingFangSC";
	font-size: 18px;
	font-weight: 600;
	color: #444444;
	margin-right: 1.5px;
	
 }
 
 .my-personal .my-info img{
 	width: 17px;
	height: 17px;
 	margin-bottom:-1px;
 	margin-left: 2px;
 	color:rgb(7,215,253);
 	position: relative;
 }
 
 .my-personal .my-info i{
 	font-style: normal;
 	position:absolute;
 	left:169px;
 	z-index: 99;
 	font-size: 10px;
	text-align:center;
	color: #ffffff;
 }
 
 .my-personal .my-info svg:nth-of-type(1){
 	font-size:26px;
 	margin-bottom: -3px;
 	margin-left: -6px;
 	color:rgb(3,174,249);
 }
 
 .my-personal .my-info svg:nth-of-type(2){
 	font-size:19px;
 	margin-left:60px;
 	color:rgb(3,174,249);
 	position: relative;
 }
 
 .my-personal .my-info span:nth-of-type(2){
 	font-family: "PingFangSC";
	font-size:13px;
	text-align: center;
	color: #808080;
	position: absolute;
    margin-left:8px;
	
 }
 
 
 .my-personal .my-detail{
	 width: 100%;
	 height: 30px; 
	 }

 .my-detail span:nth-of-type(1),span:nth-of-type(3){
 	font-family:"PingFangSC";
	font-size: 14px;
	color: #808080;
 }
 .my-detail span:nth-of-type(3){
 	margin-left: 3px;
 }
 
 .my-detail span:nth-of-type(2),span:nth-of-type(4){
 	font-family:"PingFangSC";
	font-size: 14px;
	color:#fa4975;
 }
 
 .my-news{
 	width: 100%;
 	height: 36px;
 	border-radius: 4px;
	background: #ffffff;
    margin-top: 32px;
    padding-top: 10px;
  -webkit-box-shadow:0 0 10px rgb(243,244,246);  
  -moz-box-shadow:0 0 10px rgb(243,244,246);  
  box-shadow:0 0 10px rgb(243,244,246);    
 }
 
 
 .my-news p{
 	display:inherit;
 	float: left;
 	height: 16px;
 	line-height: 16px;
 	font-family: ".PingFangSC";
	font-size: 14px;
	color: #808080;
	border-right: 1px solid #c8c8c8;
	padding: 0 10px 0 15px;

 }
 
 .my-news p:last-child{
 	border-right:none;
 }
 
 .my-news p span{
  color: #fa4975;
 }
 
.my-progress {
 width: 100%;
 margin-top: 20px;
}

.my-progress span:nth-of-type(1){
	display: inline-block;
	width: 73%;
	height: 12px;
	border-radius: 50px;
	overflow: hidden;
	border: 0.5px solid rgb(3,174,249);
	margin-bottom: -2px;
}
.my-progress span:nth-of-type(1) i{
	display: inline-block;
	font-style: normal;
	margin-bottom: 8px;
	width:100px;
	height:12px;
	background:rgb(3,174,249) ;
}
.my-progress span:nth-of-type(2){
	font-family: "PingFangSC";
	font-size: 12px;
	color: #808080;
	
}
.my-progress span:nth-of-type(3){
	font-family: "PingFangSC";
	font-size:13px;
	color: rgb(3,174,249);
	margin-left: 4px;
	
}

.my-apply{
	margin-top: 20px;
	width: 100%;
	height: 61px;
}

.my-apply div{
	display: inline-block;
	width: 49%;
	height: 61px;
	border-radius:4px;
	background-color: #ececee;

}
.my-apply div svg{
	margin-top: 10px;
	margin-left: 10px;
	font-size: 40px;
	color: rgb(3,174,249);
	float: left;
}
.my-apply div p{
	margin-top: 10px;
	margin-left:10px;
	
}
.my-apply div p span{
 display: block;
}

.my-apply div p span:nth-of-type(1){
	font-family: "PingFangSC";
	font-size: 14px;
	color: #444444;

}

.my-apply div p span:nth-of-type(2){
	font-family: "PingFangSC";
	font-size: 13px;
	color: #808080;

}
  /*.professor .label {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 14px;
  }*/

  /*.professor .text .realname {
    font-size: 20px;
    font-weight: bolder;
    margin-left: 20px;
  }

  .professor .myicon-share{
    width:15px;
    height:16px;
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
  }*/


  .part2 {
    height: 60px;
    text-align: center;
    background: #fff;
    margin-top: 10px;
  }

  .part2 .item {
    display: inline-block;
    width: 23%;
    text-align: center;
    color: #777;
  }

  .part2 .item .number {
    padding-top: 10px;
    color: #161616;
    display: block;
    font-size: 20px;
    font-weight: bold;
  }

.my-option{
	width: 100%;
	height: 237px;
	background: #FFFFFF;
	padding: 0;
	margin: 0;
	list-style: none;
	padding-left:16px;
	padding-right: 16px;
}

.my-option li{
	width: 100%;
	height: 44px;
	padding-top:12px;
	padding-bottom: 12px;
	border-top: 1px solid rgb(220,220,220);
}

.my-option li:last-child{
	border-bottom: 1px solid rgb(220,220,220);
}

.my-option li svg:nth-of-type(1){
	font-size: 22px;
}
.my-option li svg:nth-of-type(2){
	float: right;
}

 #shareShowWrapper{
    position: absolute;
    right:0;
    top:0;
  }
   #shareShowWrapper .icon{
        color:#fff;
        position: absolute;
        right:15px;
        top:10px;
        font-size: 70px;
    }

.shareWrapper {
      .title{
        background: #ececee;
        text-align: center;
        font-size:14px;
        padding:12px 0;
      }

    .more{
      background: #fff;
      padding:10px;

      .single{
        width:55px;
        height:55px;
        margin:0 10px;
        display: inline-block;

        img{
          width:100%;
          height:100%;
        }
      }
    }
  }
</style>
