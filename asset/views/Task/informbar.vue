<template>
  <div>
    <header class="mui-bar mui-bar-nav">
    	  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">通知公告</h1>
    </header>

    <div class="mui-content"  >
    	<div class="mui-scroll-wrapper" id="pullrefresh">
    <div class="mui-scroll">
   	  <ul>
   	  	<li>
   	  		<img src="../../statics/images/inform1.png" />
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">专业问答任务邀请</span>
   	  			<span>2017/2/14 13:20</span>
   	  		</p>
   	  		<i class="bot"></i>
   	  	</li>
   	  	<li>
   	  		<img src="../../statics/images/inform1.png" />
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">专业问答任务邀请</span>
   	  			<span>2017/2/14 13:20</span>
   	  		</p>
   	  		<i class="bot"></i>
   	  	</li>
   	  	<li>
   	  		<img src="../../statics/images/inform1.png" />
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">专业问答任务邀请</span>
   	  			<span>2017/2/14 13:20</span>
   	  		</p>
   	  		<i class="bot"></i>
   	  	</li>
   	  </ul>
   	 
   </div>
   </div>
   </div>
   
    
  <div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>
  </div>
</template>

<script>
  
 
</script>


<style scoped>
.bot {
		position: absolute;
		right: 16px;
		bottom: 0;
		left: 16px;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(220, 220, 220);
	}
/*清掉自带样式*/
div,p,span,i,img,ul,li,a{
	margin: 0;
	padding: 0;
	list-style: none;
	font-style: normal;
}
/*滚动区域*/
.mui-wechat #pullrefresh {
    margin-top: 0px;
}
#pullrefresh {
    margin-top: 45px;
}
/*主体部分样式*/

ul li{
	position: relative;
	padding: 10px 16px 10px 16px;
	overflow: hidden;
}
ul li img{
	display: block;
	width: 12.5%;
	height: 12.5%;
	float: left;
}
ul li p{
	margin-left: 3%;
	width: 84%;
	float: left;
}
ul li p span{
	display: block;
	margin-bottom:5px;
	width: 100%;
	
}

ul li p span:nth-of-type(1){
	font-size: 16px;
	color: #444444;
}
ul li p span:nth-of-type(2){
	margin-bottom:0px;
	font-size:12px;
	color: #b4b4b6;
}
.message{
	width: 7px;
	height: 7px;
	background: #f03c69;
	border-radius: 50%;
	position: absolute;
	left: 15.5%; 
	top: 10%;
}
</style>
