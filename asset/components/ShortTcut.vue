<template>
	<div class="short_all">
	  <ul>
	  	<li>
	  		<svg class="icon" aria-hidden="true">
		       <use xlink:href="#icon-fabuxuqiu"></use>
		    </svg>
		    <span>发布需求</span>
	  	</li>       
	  	<li>
	  		<svg class="icon" aria-hidden="true">
		       <use xlink:href="#icon-zhuanyewenda"></use>
		    </svg>
		    <span>专业问答</span>
	  	</li>
	  	<li>
	  		<svg class="icon" aria-hidden="true">
		       <use xlink:href="#icon-chengweizhuanjia"></use>
		    </svg>
		    <span>成为专家</span>
	  	</li>
	  	<li>
	  		<svg class="icon" aria-hidden="true">
		       <use xlink:href="#icon-tijiaowenzhang"></use>
		    </svg>
		    <span>提交文章</span>
	  	</li>
	  	
	  </ul>
	  <p>
	  	<svg class="icon" aria-hidden="true">
		  <use xlink:href="#icon-guanbi"></use>
		</svg>
	  </p>
	</div>
</template>

<script>
	
//	show 
//	   
//	hide
	   
</script>

<style scoped="scoped">
	ul,li,div,p,span{
		margin: 0;
		padding: 0;
		list-style: none;
	}
.short_all{
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 9999;
	background: #f3f4f6;
	opacity: 0.85;
}
.short_all p{
	position: absolute;
	bottom: 38px;
	left: 48%;
	font-size: 17px;
	color: #808080;
	animation: rote 0.8s infinite;
	animation-iteration-count:1;	
}	

ul{
	width: 100%;
	height: 260px;
	/*background: #009689;*/
	position: absolute;
	bottom: 165px;
	/*transform:translateY(165px)*/
	animation: myfirst 0.8s infinite;
	animation-iteration-count:1;
}


@keyframes myfirst
	{  
	from {bottom:-200px; opacity: 0.7;}
	to {bottom:165px; opacity: 0.8;}
	}




ul li{
	width: 50%;
    height: 130px;
    float: left;
   
}
ul li:nth-of-type(1){
	/*background: #009689;*/
}
ul li svg{
	font-size: 53px;
	margin-left: 76px;
	margin-top: 28px;
}
ul li span{
	display: inline-block;
	width: 100%;
	text-align: center;
	margin-top: 13px;
}
</style>