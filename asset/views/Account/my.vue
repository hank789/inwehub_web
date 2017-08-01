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
                <svg class="icon share" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/my/resume')">
				  <use xlink:href="#icon-fenxiang"></use>
				</svg>
	      	 	<span class="share" @tap.stop.prevent="$router.pushPlus('/my/resume')">分享名片</span>
	      	 	<i class="bot"></i>
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
	     	<p>关注<span>{{attention}}</span></p>
	     	<p>咨询<span>{{advisory}}</span></p>
	     	<p>评分<span>{{grade}}</span></p>
	     	<p>{{total_score}}</p>
	  </div>
	  
	  <div class="my-progress">
	    <span><i :style="'width:'+ account_info_complete_percent +'%'"></i></span>
	    <span>{{account_info_complete_percent}}%</span>
	    <span @tap.stop.prevent="$router.pushPlus('/my/info')">编辑名片</span>
	  </div>
	  <div class="my-apply">
	  	<div>
	  		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-zhuanjiabiaoji"></use>
			</svg>
			<p>
				<span>申请专家认证</span>
				<span v-if="expert_apply_status =='0'">未申请</span>
				<span v-if="expert_apply_status =='1'">认证审核中</span>
				<span v-if="expert_apply_status =='2'">认证成功</span>
				<span v-if="expert_apply_status =='3'">认证失败</span>
			</p>
			
	  	</div>
	  	<div @tap.stop.prevent="$router.pushPlus('/company/my')">
	  	 <svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-qiyezhanghao"></use>
		 </svg>
		 <p>
		 	<span>申请企业账号</span>
			<span v-if="company_apply_status =='0'">未申请</span>
			<span v-if="company_apply_status =='1'">认证审核中</span>
			<span v-if="expert_apply_status =='2'">认证成功</span>
			<span v-if="company_apply_status =='3'">认证失败</span>
		</p>
		
	  	</div>
	  </div>
	  
    </div>
    

      <div class="part2">
        <a class="item" @tap.stop.prevent="$router.pushPlus('/asks')">
          <span class="number">
          	<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-icon-test"></use>
			</svg>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-icon-test"></use>
			</svg>
          </span><span>我的提问</span>
        </a>
        <a class="item" @tap.stop.prevent="$router.pushPlus('/answers')">
          <span class="number">
          	<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-icon-test"></use>
			</svg>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-icon-test"></use>
			</svg>
          </span>
          <span>我的回答</span>
        </a>
        <a class="item" @tap.stop.prevent="$router.pushPlus('/bid')">
          <span class="number">
          	<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-icon-test"></use>
			</svg>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-icon-test"></use>
			</svg>
          </span>
          <span>我的竞标</span>
        </a>
        <a  class="item"  @tap.stop.prevent="$router.pushPlus('/company/my')">
          <span class="number">
          	<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-icon-test"></use>
			</svg>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-icon-test"></use>
			</svg>
          </span>
          <span>我的项目</span>
        </a>
        <i class="bott"></i>
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
			<i class="bot"></i>
        </li>
       	<li  @tap.stop.prevent="$router.pushPlus('/collect')">
       		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-wodeshoucang"></use>
			</svg>
			<span >我的收藏</span>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-chakangengduojiantou"></use>
			</svg>
			<i class="bot"></i>
        </li>
       	<li @tap.stop.prevent="$router.pushPlus('/feedback')">
       		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-wodefankuijianyi"></use>
			</svg>
			<span >反馈建议</span>
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-chakangengduojiantou"></use>
			</svg>
			<i class="bot"></i>
        </li>
       	<li @tap.stop.prevent="$router.pushPlus('/setting')">
       		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-wodeshezhi"></use>
			</svg>
			<span>设置</span>
			<svg class="icon" aria-hidden="true">
			 <use xlink:href="#icon-chakangengduojiantou"></use>
			</svg>
			<i class="bot"></i>
        </li>
       </ul>     

      
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
      const infomation = localEvent.getLocalItem('UserInfoReal');

      return {
      	attention:infomation.info.followers,
      	advisory:infomation.info.questions,
      	grade:infomation.info.feedbacks,
      	total_score:infomation.info.total_score,
      	expert_apply_status:infomation.info.expert_apply_status,
      	company_apply_status:infomation.info.company_status,
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
        my:"",
        
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
.bot{
 	position: absolute;
    right: 0;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220,220,220);
 	
 }
 
 .bott{
 	position: absolute;
    right:16px;
    bottom: 0;
    left: 16px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220,220,220);
 	
 }

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
   width:70%;
   height: 69px;
   margin: 30.5px 0 0 15.5px;
   float: left;
 } 
 
 .my-personal .my-info{
  width: 100%;
  height: 30px;		
  margin-bottom:9px;
  position: relative;
 }

 
 .my-personal .my-info span:nth-of-type(1){
 	font-family: "PingFangSC";
	font-size: 18px;
	font-weight: 600;
	color: #444444;
	margin-right: 1.5px;
	
 }
 
 .my-personal .my-info img{
 	width: 18px;
	height: 18px;
 	margin-bottom:-1px;
 	margin-left: 2px;
 	color:rgb(7,215,253);
 	position: relative;
 }
 
 .my-personal .my-info i:nth-of-type(1){
 	font-style: normal;
 	position:absolute;
 	left:68px;
 	z-index: 99;
 	font-size: 10px;
	text-align:center;
	color:#FFFFFF;
 }
 
 .my-personal .my-info svg:nth-of-type(1){
 	font-size:26px;
 	margin-bottom: -2px;
 	margin-left: -6px;
 	color:rgb(3,174,249);
 	position: relative;
 	
 	
 }
 
 .my-personal .my-info svg:nth-of-type(2){
 	font-size:19px;
 	color:rgb(3,174,249);
 	position: absolute;
 	right:26%;
 	
 	
 }
 
 .my-personal .my-info span:nth-of-type(2){
 	display: inline-block;
 	padding: 0;
 	margin: 0;
 	/*background: #007AFF;*/
 	font-family: "PingFangSC";
	font-size:13px;
	text-align: center;
	float: right;
	color: #808080;
    
	
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
	padding: 0 10px 0 10px;

 }
 
 .my-news p:last-child{
 	border-right:none;
 }
 
 .my-news p span{
  color: #fa4975;
 }
 
 .my-news p:nth-of-type(3) span{
 	color: rgb(68,68,68);
 }
 
.my-progress {
 width: 100%;
 margin-top: 20px;
}

.my-progress span:nth-of-type(1){
	display: inline-block;
	width: 70%;
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
	margin-right: 1px;
	
	
}
.my-progress span:nth-of-type(3){
	font-family: "PingFangSC";
	font-size:13px;
	color: rgb(3,174,249);
	float: right;
	margin-top: 2px;
	
	
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

.my-apply div:nth-of-type(2) svg{
	margin-top: 13px;
	margin-left: 10px;
	font-size: 32px;
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
    height: 70px;
    text-align: center;
    background: #fff;
    margin-top: 10px;
    position: relative;
  }

  .part2 .item {
    display: inline-block;
    width: 23%;
    text-align: center;
    color: #777;
  }
 .part2 .item span{
 	display: block;
 	font-size: 12px;
 }

.part2 .item .number svg{
	margin-top: 10px;
	margin-bottom: 7px;
	font-size: 13px;
	color: #444444;
}
.part2 .item .number svg:nth-of-type(2){
	margin-left: -8px;
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
	position: relative;
}

.my-option li span {
	margin-left: 10px;
}



.my-option li svg:nth-of-type(1){
	font-size: 22px;
	margin-bottom: -3px;
}
.my-option li svg:nth-of-type(2){
	float: right;
}


</style>
