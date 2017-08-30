<template>

	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">客服小哈</h1>
		</header>

		<div class="mui-content">
			<!--
           点击出现拍照的相册
     -->
			<!--<div class="chat_picture" >
    	   	   <p>
    	   	   	 <svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-xiangce"></use>
			</svg>
    	   	   	 <span>相册</span>
    	   	   </p>
    	   	   <p>
    	   	   	 <svg class="icon" aria-hidden="true">
			   <use xlink:href="#icon-xiangji"></use>
			 </svg>
    	   	   	 <span>拍照</span>
    	   	   </p>
    	   </div>-->

			<div class="message" id="message">
				<input type="text" />
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#icon-plus"></use>
				</svg>
				<span>发送</span>
			</div>

		</div>
	</div>
</template>

<script>
	import { apiRequest } from '../../utils/request';
	import uploadHeader from '../../components/uploadHeader.vue';
	export default {
		data: () => ({}),
		created() {

		},
		components: {
			uploadHeader
		},
		mounted() {

		},
		methods: {
			//			uploadAvatar(){
			//			this.$refs.uploadHeader.uploadAvatar();
			//		  },
			//		  getStyle(element, attr){
			//		      if(element.currentStyle){
			//		        return element.currentStyle[attr];
			//		      }else{
			//		        return window.getComputedStyle(element,null)[attr];
			//		      }
			//		    },
			//			pop(event){
			//				var oImg = document.getElementById('message');
			//               window.getComputedStyle(oImg, null).bottom = '95px'; 
			//			      console.log(window.getComputedStyle(oImg, null).bottom)   
			//			}
		}
	}
</script>

<style scoped>
	.message {
		width: 100%;
		height: 47px;
		background: #ececee;
		position: absolute;
		bottom: 0;
		padding: 0 10px;
	}
	
	.message input {
		width: 305px;
		height: 35px;
		border-radius: 5px;
		background: #ffffff;
		border: none;
		box-shadow: 0 0 10px rgba(220, 220, 220, 1);
		margin-top: 6px;
		float: left;
	}
	
	.message svg {
		font-size: 30px;
		margin-top: 8px;
		margin-right: 6px;
		color: #C8C8C8;
		float: right;
	}
	
	.message span {
		display: block;
		margin-top: 5.5px;
		width: 40px;
		height: 35px;
		float: right;
		background: #c8c8c8;
		text-align: center;
		line-height: 35px;
		border-radius: 5px;
		color: #FFFFFF;
		font-size: 14px;
		display: none;
	}
	
	.chat_picture {
		width: 100%;
		height: 95px;
		background: #FFFFFF;
		position: absolute;
		bottom: 0;
		display: none;
	}
	
	.chat_picture p {
		float: left;
		margin-top: 13px;
		margin-left: 36px;
	}
	
	.chat_picture svg {
		font-size: 48px;
		color: #dcdcdc;
	}
	
	.chat_picture span {
		display: block;
		font-size: 13px;
		color: #808080;
		text-align: center;
		margin-top: 2px;
	}
</style>