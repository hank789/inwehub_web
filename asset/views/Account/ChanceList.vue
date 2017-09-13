<template>

	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">我的报名</h1>
		</header>
		<!--无内容的展示-->
		<!--<div class="mui-content list-empty" v-if="nothing==1">
			<div class="mui-table-view list-ask-item">
				<div class="mui-table-view-cell">
					<div>
						<div class="title">暂无任务</div>
						<div class="subTitle">稍安勿躁，是金子总会发光！<br/>平台正准备给您一展风采的机会呢！</div>
					</div>
				</div>
			</div>
		</div>-->

		<div class="mui-content absolute">
			<!--导航栏-->
			<div class="menu">
				<span @tap.stop.prevent="$router.push('/my/Discount')">活动</span>
				<span @tap.stop.prevent="" >机遇</span>
				<i class="bot"></i>
			</div>
			<div id="pullrefresh" :class="{'mui-content':false, 'mui-scroll-wrapper':true, 'task-list':true, 'emptyList':nothing}">
				<div class="mui-scroll">
				<!---->
				  <ul>
				     <li>
				     	<img src="../../statics/images/bg_login.png" />
				     	<p>3篇顾问周刊发布文稿征集</p>
				     	<p>
				     		<span>2017/02/14 </span>
				     		<span>我要报名</span>
				     	</p>
				     	<i class="bot"></i>
				     </li>
				  </ul>
				<!---->
				</div>
			</div>
		</div>

		<!-- <div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>-->
	</div>
</template>

<script>
	
	
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
		right:0;
		bottom: 0;
		left: 0;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(220, 220, 220);
	}
	.mui-wechat .menu[data-v-4f45c199] {
		width: 100%;
		height: 45px;
		position: absolute;
		z-index: 10;
		background: #f3f4f6;
		top: 0;
	}
	.mui-content.absolute .menu ~ #pullrefresh {
    top: 45px;
  }
  .mui-content.absolute{
  	background: #FEFFFE;
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
		display: inline-block;
		width: 49%;
		height: 100%;
		font-size: 14px;
		color: #444444;
		text-align: center;
		line-height: 45px;
		font-weight: 600;
	}
	
	.menu span:nth-of-type(1) {
		color: #3c95f9;
	}
	
	.menu i {
		display: block;
		position: absolute;
		width: 30px;
		height: 1.8px;
		left: 71%;
		bottom: 0.5px;
		background: #03aef9;
	}
	/*滚动区域*/
	ul{
		width: 100%;
		height: 227px;
		/*background:#CCCCCC;*/
		position: relative;
		
	}
	ul li{
		width: 92%;
		height: 227px;
		/*background:#E4E5E7;*/
		position: absolute;
		left: 0;
		right: 0;
		margin: auto;
		
	}
	ul li img{
		width: 100%;
		height: 143px;
		margin-top: 15px;
	}
	ul li  p:nth-of-type(1){
		font-size: 14px;
		color: #444444;
		margin-top: 5px;
	}
	ul li  p:nth-of-type(2){
		width: 100%;
        height: 19px;
		margin-top: 4px;
	}
	ul li  p:nth-of-type(2) span:nth-child(1){
		display: block;
		color: #b4b4b6;
		font-size: 12px;
		 line-height: 19px;
		float: left;
		
	}
	ul li  p:nth-of-type(2) span:nth-child(2){
	 display: block;
     width: 75px;
     height: 19px;
     float: right;
     background:#03aef9;
     color: #FFFFFF;
     font-size: 14px;
	 text-align: center;	
	 line-height: 19px;
	 border-radius: 50px;
	}
</style>