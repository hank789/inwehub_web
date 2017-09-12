<template>
	
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">3篇顾问周刊发布文稿征集</h1>
		</header>
		<div class="mui-content absolute">
			<div class="enroll">
			  <img src="../../statics/images/bg_login.png" />
			  <div class="enroll-text">
			  	<p>3篇顾问周刊发布文稿征集</p>
			  	<p>2017/02/14</p>
			  </div>
			  <textarea></textarea>
			</div>
			 <div class="btn">
			 <button>立即报名</button>
			 </div>
			 
			 <div class="feedback">
			 	<div class="send">
				 	<input type="text"  placeholder="在此留言"/>
				 	<svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-fasong"></use>
					</svg>
				</div>
			 </div>
		</div>
    </div>
</template>
<script>
</script>

<style scoped="scoped">
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
	.mui-content.absolute{
  	background: #F3F4F5;
  	/*border-color: #FFFFFF;*/
  	
  }
  .enroll{
  	width: 100%;
  	/*height: 100%;*/
  	padding:15px 16px 0 16px;
  	background: #FEFFFE;
  }
  .enroll img{
  	width: 100%;
  	height: 143px;
  }
  .enroll-text{
  	width: 100%;
  	height: 57px;
  	/*background: #CCCCCC;*/
  	margin-top: 8px;
  	border-bottom: 0.5px solid #DCDCDC;
  }
   .enroll-text p:nth-of-type(1){
   	font-size: 14px;
   	color: #444444;
   	font-weight: 500;
   	
   }
   .enroll-text p:nth-of-type(2){
   	font-size: 12px;
   	color: #b4b4b6;
   	margin-top: 3px;
   	
   }
   textarea{
   	margin-top: 15px;
   	border-color: #DCDCDC;
   	height: 318px;
   }
   
   
   .btn{
   		width: 100%;
  	    padding:15px 16px 0 16px;
  	    background: #FEFFFE;
  	    margin-top: 10px;
   }
   
   button{
   	 width: 100%;
   	 height: 44px;
   	 background: #03aef9;
   	 color: #FFFFFF;
   	 font-size: 16px;
   	 border-radius: 5px;
   	 margin-bottom: 15px;	 
   }
   
   .feedback{
   		width: 100%;
   		min-height:80px;
  	    padding:15px 16px 0px 16px;
  	    background: #FEFFFE;
  	    margin-top: 10px;
  	    border: none;
  	    
   }
   .send{
   	width: 100%;
   	height: 42px;
   	border: 0.5px solid #DCDCDC;
   }
   .feedback input{
   	width: 80%;
   	height: 40px;
   	float: left;
   	font-size: 14px;
   	border: none;
   }
   .feedback svg{
   	font-size: 30px;
    float: right;
    margin-right: 10px;
    margin-top: 5px;
    color: #03aef9;
  }
   
</style>