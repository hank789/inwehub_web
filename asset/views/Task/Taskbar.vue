<template>

  <div>
    <header class="mui-bar mui-bar-nav">
    	  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">任务动态</h1>
    </header>

    <div class="mui-content"  >
    	<div class="mui-scroll-wrapper" id="pullrefresh">
    <div class="mui-scroll">
   	  <ul>
   	  	<li>
   	  		<img src="../../statics/images/mission1.png" />
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">专业问答任务邀请</span>
   	  			<span class="mui-ellipsis">面好吃还是米饭好吃，面好吃还是米饭好吃</span>
   	  			<span class="mui-ellipsis">截止时间：<i>2015/6/30 18:00</i></span>
   	  			<span>2017/2/14 13:20</span>
   	  		</p>
   	  		<i class="bot"></i>
   	  	</li>
   	  	<li>
   	  		<img src="../../statics/images/mission1.png" />
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">专业问答任务邀请</span>
   	  			<span class="mui-ellipsis">面好吃还是米饭好吃，面好吃还是米饭好吃</span>
   	  			<span class="mui-ellipsis">截止时间：<i>2015/6/30 18:00</i></span>
   	  			<span >2017/2/14 13:20</span>
   	  		</p>
   	  		<i class="bot"></i>
   	  	</li>
   	  	<li>
   	  		<img src="../../statics/images/mission1.png" />
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">专业问答任务邀请</span>
   	  			<span class="mui-ellipsis">面好吃还是米饭好吃，面好吃还是米饭好吃</span>
   	  			<span class="mui-ellipsis">截止时间：<i>2015/6/30 18:00</i></span>
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
#pullrefresh {
    margin-top: 45px;
}
/*主体部分样式*/

ul li{
	position: relative;
	padding: 10px 16px 0px 16px;
	overflow: hidden;
}
ul li img{
	width: 11%;
	height: 11%;
	float: left;
}
ul li p{
	margin-left: 3%;
	width: 86%;
	float: left;
}
ul li p span{
	display: block;
	margin-bottom: 6px;
	width: 100%;
	
}

ul li p span:nth-of-type(1){
	font-size: 16px;
	color: #444444;
}
ul li p span:nth-of-type(2){
	font-size: 14px;
	color: #808080;

}
ul li p span:nth-of-type(3){
	font-size: 14px;
	color:rgb( 68,68,68);
	font-weight: 500;
	

}
ul li p span:nth-of-type(3) i{
	font-size: 14px;
	color:#3c95f9;
	

}
ul li p span:nth-of-type(4){
	font-size: 12px;
	color: #b4b4b6;

}
.message{
	width: 7px;
	height: 7px;
	background: #f03c69;
	border-radius: 50%;
	position: absolute;
	left: 14.5%; 
	top: 8%;
}
</style>
