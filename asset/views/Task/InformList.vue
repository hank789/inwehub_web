<template>

  <div>
    <header class="mui-bar mui-bar-nav">
    	  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">动态</h1>
    </header>
     <!--导航栏-->
    <div class="menu">
    	    <span @tap.stop.prevent="$router.pushPlus('/task')">任务</span>
    	    <span  @tap.stop.prevent="">消息</span>
    	    <i></i>
    </div>
    <div class="mui-content content">
       <ul>
       	 <li  @tap.stop.prevent="$router.pushPlus('/informbar')">
       	 	<img src="../../statics/images/inform1.png" />  
       	 	<div class="message">99</div>
       	 	<p>
       	 	   <span>通知公告</span>
       	 	   <span class="mui-ellipsis">===关于我们===Inwehub是一款一款一款一款ub是一款一款一ub是一款一款一</span>
       	 	</p>
       	 	<a>16:44</a>
       	 	<i class="bot"></i>
       	 </li>
       	 <!--<li @tap.stop.prevent="$router.pushPlus('/balancebar')">
       	 	<img src="../../statics/images/balance1.png" />  
       	 	<p>
       	 	   <span>余额变动</span>
       	 	   <span class="mui-ellipsis">问答支出88元 </span>
       	 	</p>
       	 	<a>16:44</a>
       	 	<i class="bot"></i>
       	 </li>
       	 <li @tap.stop.prevent="$router.pushPlus('/integralbar')">
       	 	<img src="../../statics/images/integral1.png" />  
       	 	<p>
       	 	   <span>积分变动</span>
       	 	   <span class="mui-ellipsis">回答了一条问题增加2积分</span>
       	 	</p>
       	 	<a>16:44</a>
       	 	<i class="bot"></i>
       	 </li>-->
       	 <li @tap.stop.prevent="$router.pushPlus('/taskbar')">
       	 	<img src="../../statics/images/mission1.png" />  
       	 	<p>
       	 	   <span >任务动态</span>
       	 	   <span class="mui-ellipsis">刘明专家回答了你的提问 </span>
       	 	</p>
       	 	<a>16:44</a>
       	 	<i class="bot"></i>
       	 </li>
       	 <li @tap.stop.prevent="$router.pushPlus('/readbar')">
       	 	<img src="../../statics/images/read1.png" />  
       	 	<p>
       	 	   <span>阅读发现</span>
       	 	   <span class="mui-ellipsis">郭大红回复 </span>
       	 	</p>
       	 	<a>16:44</a>
       	 	<i class="bot"></i>
       	 </li>
       	 <!--<li @tap.stop.prevent="$router.pushPlus('/chat')">
       	 	<img src="../../statics/images/service1.png" />  
       	 	<p>
       	 	   <span>客服小哈</span>
       	 	   <span class="mui-ellipsis">===关于我们===Inwehub是一款一款一款一款</span>
       	 	</p>
       	 	<a>16:44</a>
       	 	<i class="bot"></i>-->
       	 </li>
       </ul> 
    </div>

  
    
    
    <div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>
  </div>
</template>

<script type="text/javascript">
	
</script>

<style scoped="scoped">
	
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
/*导航栏的样式*/
.mui-content{
	background: #FFFFFF;
}
.mui-wechat .menu{
    width: 100%;
    height: 45px;
    position: absolute;
    top: 0;
    z-index: 10;
    background: #f3f4f6;
    
    }
  .mui-wechat .content{
  	margin-top: 45px;
  }
.menu{
	width: 100%;
	height: 45px;
	position: absolute;
	top: 44px;
	z-index: 99;
	background:#f3f4f6;
}	
.menu span{
	display: inline-block;
	width: 49%;
	height: 100%;
	font-size: 14px;
	color: #444444;
	text-align: center;
     line-height: 45px;
     font-weight: 600;
}	
.menu span:nth-of-type(2){
	color: #3c95f9;
}
.menu i {
	display: block;
	position: absolute;
	width: 30px;
	height: 1.8px;
	right: 21.65%;
	bottom: 0.5px;
	background:#3c95f9;
}	

/*内容区域*/
.content{
	margin-top: 45px;
}
.content ul li{
	width: 100%;
	height: 60px;
	padding: 0 16px;
	position: relative;
}
.content ul li img{
	width: 42px;
	height:42px;
	margin-top: 10px;
	float: left;
}

.content ul li p{
	float: left;
	margin-top: 10px;
	margin-left: 12px;
}

.content ul li a{
	position: absolute;
	top: 10px;
	right: 16px;
	font-size: 12px;
	color: #c8c8c8;
}
.content ul li p span:nth-of-type(1){
	display: block;
	font-size: 16px;
	color: #444444;
}
.content ul li p{
	width: 81%;
	
}
.content ul li p span:nth-of-type(2){
	display: block;
	width: 100%;
	height:18px;
	font-size:13px;
	color: #808080;
	
}
.message{
	position: absolute;
	font-size: 11px;
	color: #ffffff;
	min-width: 18px;
	height: 18px;
	background: #f03c69;
	border-radius: 50%;
    text-align: center;
    line-height: 18px;
    left:45px;
    top: 5px;


}
</style>
