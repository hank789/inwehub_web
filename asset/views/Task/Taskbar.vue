<template>

  <div>
    <header class="mui-bar mui-bar-nav">
    	  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">任务动态</h1>
    </header>

   <div id="pullrefresh"  class="mui-content mui-scroll-wrapper">
   <div class="mui-scroll">
   	  <ul>
   	  	<li>
   	  		<img src="../../../guide/images/lifeline.png" />
   	  		<p>
   	  			<span>专业问答任务邀请</span>
   	  			<span>面好吃还是米饭好吃，面好吃还是米饭好吃</span>
   	  			<span>截止时间：2015/6/30 18:00</span>
   	  			<span>2017/2/14 13:20</span>
   	  		</p>
   	  	</li>
   	  	<li></li>
   	  	<li></li>
   	  	<li></li>
   	  	<li></li>
   	  </ul>
   	 
   </div>
   </div>
    
  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken} from '../../utils/request';

 
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
</style>
