<template>

  <div>
     <header class="mui-bar mui-bar-nav">
    	  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">客服小哈</h1>
    </header>

    <div class="mui-content">
    	
    	   <div class="message">
    	   	  <input type="text" />
    	   	  <span>发送</span>
    	   </div>
    </div>
  </div>
</template>

<script>

</script>


<style scoped>
   .message{
   	width: 100%;
   	height: 47px;
   	background: #ececee;
   	position: absolute;
   	bottom: 0;
   	padding: 0 10px;
   }
   .message input{
   	width: 305px;
	height: 35px;
	border-radius: 5px;
	background: #ffffff;
	border:0.5px solid #dcdcd;
	margin-top: 6px;
	float: left;
   }
   .message span{
   	display: block;
   	margin-top: 6px;
    	width: 40px;
    height: 35px;
    	float: right;
    	background: #c8c8c8;
    	text-align: center;
    line-height: 35px;
    border-radius: 5px;
    color: #FFFFFF;
    font-size: 14px;
    }
</style>
