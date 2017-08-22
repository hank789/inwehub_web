<template>

  <div>
    <header class="mui-bar mui-bar-nav">
    	  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">阅读发现</h1>
    </header>

    <div class="mui-content"  >
    	<div class="mui-scroll-wrapper" id="pullrefresh">
    <div class="mui-scroll">
   	  <ul>
   	  	<li>
   	  		<img src="../../statics/images/service1.png" />  
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">郭大红回复郭大红回复郭大红回复郭大红回复</span>
   	  			<span class="mui-ellipsis">前十四章节已经介绍了如何用django来建立一用djang节已经介绍了如何用django来建立一用</span>
   	  			<span class="mui-ellipsis">原回复：回复看别人的问题偷自己懒得提问只想看看别回复看别人的问题偷自己懒得提问只想看看别</span>
   	  		</p>
   	  		<div class="reader_time">2017/2/14 13:20</div>
   	  		<i class="bot"></i>
   	  	</li>
   	  	<li>
   	  		<img src="../../statics/images/service1.png" />
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">专业问答任务邀请</span>
   	  			<span class="mui-ellipsis">面好吃还是米饭好吃，面好吃还是米饭好吃</span>
   	  			<span class="mui-ellipsis">截止时间：<i>2015/6/30 18:00</i></span>
   	  		</p>
   	  		<div class="reader_time">2017/2/14 13:20</div>
   	  		<i class="bot"></i>
   	  	</li>
   	  	<li>
   	  		<img src="../../statics/images/service1.png" /> 
   	  		<div class="message"></div>
   	  		<p>
   	  			<span class="mui-ellipsis">专业问答任务邀请</span>
   	  			<span class="mui-ellipsis">面好吃还是米饭好吃，面好吃还是米饭好吃</span>
   	  			<span class="mui-ellipsis">截止时间：<i>2015/6/30 18:00</i></span>
   	  		</p>
   	  		<div class="reader_time">星期三17:00</div>
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
	import {createAPI, addAccessToken, postRequest} from '../../utils/request';
	const Readbar = {
		data: () => ({
			list:""
		}),
		created() {
			
		},
		methods: {
	       getPrevList(){
	        postRequest(`notification/readhub_list`, {}).then(response => {
	          var code = response.data.code;
	          //如果请求不成功提示信息 并且返回上一页；
	          if (code !== 1000) {
	            mui.alert(response.data.message);
	            mui.back();
	          }
	          //请求成功的操作
	          if (response.data.data) {
	            console.log(response.data.data)
	          }
	         
	        });
	      }
		 },
		mounted() {
		this.getPrevList()
		 
		 
		}
		
}
export default Readbar; 
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
	padding: 10px 16px 0px 16px;
	overflow: hidden;
}
ul li img{
	width: 12%;
	height: 12%;
	border-radius: 50%;
	float: left;
}
ul li p{
	margin-left: 2%;
	width: 86%;
	float: left;
}
ul li p span{
	display: block;
	margin-bottom: 7px;
	width: 100%;
	
}

ul li p span:nth-of-type(1){
	max-width:160px;
	font-size: 16px;
	color: #444444;
}
ul li p span:nth-of-type(2){
	font-size: 14px;
	color: #444444;

}
ul li p span:nth-of-type(3){
	font-size: 12px;
	color:#808080;

}

.message{
	width: 7px;
	height: 7px;
	background: #f03c69;
	border-radius: 50%;
	position: absolute;
	left: 14%; 
	top: 9%;
}
.reader_time{
	font-size: 12px;
	color: #b4b4b6;
	position: absolute;
	top: 10px;
	right: 16px;

}
</style>
