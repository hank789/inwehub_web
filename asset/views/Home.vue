<template>
	<div>
        
		<header class="hidewechattitle">	
			<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-logowenzi"></use>
		    </svg>
		</header>

		<div class="mui-content" v-show="!loading">
			<!--首页轮播-->
			<div id="slider" class="mui-slider" v-if="notices.length">
				<div class="mui-slider-group mui-slider-loop">
					<!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
					<div class="mui-slider-item mui-slider-item-duplicate" v-if="notices[notices.length-1]">
						<a href="#">
							<img :src="notices[notices.length-1].img_url">
						</a>
					</div>

					<div class="mui-slider-item" v-for="(notice, index) in notices">
						<a @tap.stop.prevent="goLink(notice.url)" target="_blank">
							<img :src="notice.img_url">
						</a>
					</div>

					<!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
					<div class="mui-slider-item mui-slider-item-duplicate" v-if="notices[0]">
						<a href="#">
							<img :src="notices[0].img_url">
						</a>
					</div>
				</div>
				<div class="mui-slider-indicator">
					<div :class="{'mui-indicator':true, 'mui-active':index==0}" v-for="(notice, index) in notices"></div>
				</div>
			</div>
			<!--专业问答 和 成为专家-->
			<div class="home-expert">
				<p @tap.stop.prevent="$router.pushPlus('/asks')">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-zhuanyewenda"></use>
					</svg>
					<span >专业问答</span>

				</p>
				<p @tap.stop.prevent="toApprove(is_expert)">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-chengweizhuanjia"></use>
					</svg>
					<span>成为专家</span>
				</p>
			</div>

			<!--
      	首页的特惠时间； 点击跳入特惠的详情；
      -->
			<div class="freeAskWrapper"  v-show="couponExpireAtText && couponExpireAtTime"  @tap.stop.prevent="$router.pushPlus('/activity/ask?couponExpireAtTime='+couponExpireAtTime)">
				<div class="freeAsk mui-navigate-right">
					<div class="icon"></div>
					<div class="text">你的首问1元特惠还剩
						<div v-html="couponExpireAtText"></div>
					</div>
				</div>
			</div>
			<!--人物推荐-->
			<swiper :options="swiperOption" class="home-recommend">
			    <swiper-slide class="home-card" v-for="(experts, index) in recommend_experts"  :key="index">
			        <img  :src="experts.avatar_url" />
					<span>
	      	      	       {{ experts.name }}
		      	      	<svg class="icon" aria-hidden="true">
						  <use xlink:href="#icon-zhuanjiabiaoji"></use>
						</svg>
	      	        </span>
					<span>{{ experts.title?experts.title:'　' }}</span>
					<span :class="experts.uuid">查看</span>
					<p>
					    {{experts.work_years?experts.work_years:"0"}}年
					</p>	
				</swiper-slide>
			 
              </swiper>

			<!--向你推荐 -->
			<div class="home-reading">
				<div class="reader-upper">
					<span>向你推荐</span>
					<span @tap.stop.prevent="$router.pushPlus('/discover')">更多</span>
					<i class="bot"></i>
				</div>
				<ul>
					<li v-for="(reads, index) in recommend_read"  @tap.stop.prevent= "detail(reads.view_url)">
						<img  :src="reads.img_url" />
						<div>
							<p class="mui-ellipsis-2">{{reads.title}}</p>
							<p>
								<span class="home-time">{{reads.publish_at}}</span>
								<span class="home-laud">
				  	  	   	  		<svg class="icon" aria-hidden="true">
									  <use xlink:href="#icon-dianzan1"></use>
									</svg>
									 <i>{{reads.upvotes}}</i>
  	  	   	  	                 </span>
						    </p>
						</div>
						<i class="bot"></i>
					</li>
					
				</ul>
			</div>
             
             <!--手机端-->
             <div class="suspend">
	            <p>
	            	    <svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-logotuxing"></use>
				    </svg>
	            </p>
	            <p>
	            	   <span>下载APP</span>
	            	   <span>查看更多专家信息</span>
	            </p>
	            <p>
	            	  立即打开
	            </p>
	        </div>
           <!---->
           <!--微信端-->
           <div class="suspension">
           	   <p>
           	   	  <svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-logotuxing"></use>
				    </svg>
           	   </p>
           	   <p>下载APP</p>
           	   <p>立即打开</p>
           </div>
           
           
			<div class="home-bot">
				你已经到达我的底线
			</div>

		</div>
		
		<!--http://localhost:8076/#/share/resume?id=05a855006c6b11e7b3a400163e000d6b&goback=1-->
		<div id="statusBarStyle" background="#f3f4f6"   bgColor="#f3f4f6" mode="dark"></div>
	</div>

</template>
<script>
	import { NOTICE, ASK_INFO, ASK_TYPE_SELECT } from '../stores/types';
	import { createAPI, addAccessToken, postRequest } from '../utils/request';
	import { apiRequest } from '../utils/request';
	import { TimeEndText } from '../utils/time';
	import { swiper, swiperSlide } from 'vue-awesome-swiper'

	const Home = {
		data: () => ({
			is_expert:"",
			recommend_read:"",
			recommend_experts:"",
			firstAsk: false,
			couponExpireAtTime: '',
			notices: [],
			currentTime: parseInt((new Date()).getTime() / 1000),
			loading: true,
			timeAutoEndTimeOut: false,
			swiperOption:{}
		}),
		created() {
			this.swiperOption = {
				pagination: '.swiper-pagination',
				loop: true,	
			    slidesPerView : 3,
                spaceBetween :10,
                preventClicks : false,
                onClick:this.swipperClick
			}
		},
		components: {
			swiper,
			swiperSlide
		},
		//缓存；  
	   activated: function () {
			this.getData();
		},
		mounted() {
			showInwehubWebview();
		},
		computed: {
			//首页倒计时；
			couponExpireAtText() {
				if(this.couponExpireAtTime) {
					return TimeEndText(this.currentTime, this.couponExpireAtTime);
				}
			}
		},
		methods: {
			swipperClick(swiper, event){
                	  console.log(event.srcElement.className)
        	           var uuid = event.srcElement.className
        	           //window.location.href="www.baidu.com";
        	           this.$router.push('/share/resume?id=' + uuid + '&goback=1');
			},
			detail(url){
			   this.goLink(url);
			},
			//认证专家跳转判断；
			toApprove(status) {
				
				switch(status) {
					case 1:
						mui.toast("您已经是认证专家了");
						break;
					default:
						this.$router.pushPlus('/company/submit');

				}

			},
			goLink: function(url) {
				if(/http/.test(url)) {
					if(mui.os.plus) {
						mui.openWindow({
							url: 'index.html#/webview/article',
							id: url,
							preload: false, //一定要为false
							createNew: false,
							show: {
								autoShow: true,
								aniShow: 'pop-in'
							},
							styles: {
								popGesture: 'hide'
							},
							waiting: {
								autoShow: false
							}
						});
					} else {
						window.location.href = url;
					}
				} else {
					this.$router.pushPlus(url);
				}
			},
			closeFreeAskSuccessTemplate: function() {
				var FreeTemplate = document.getElementById('freeAskSuccessTemplate');
				FreeTemplate.style.display = 'none';

				if(mui('.mui-backdrop')[0]) {
					document.body.removeChild(mui('.mui-backdrop')[0]);
				}
			},
			closeFreeAskTemplate: function() {
				var FreeTemplate = document.getElementById('freeAskTemplate');
				FreeTemplate.style.display = 'none';

				if(mui('.mui-backdrop')[0]) {
					document.body.removeChild(mui('.mui-backdrop')[0]);
				}
			},
			getFreeAsk: function() {
				postRequest(`activity/getCoupon`, {
					'coupon_type': 1
				}).then(response => {
					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						return;
					}
					this.getData();
					this.showFreeAskGetSuccess();
				});
			},
			showFreeAskGet: function() {
				var FreeTemplate = document.getElementById('freeAskTemplate');
				FreeTemplate.style.display = 'block';
				var mask = mui.createMask(() => {
					FreeTemplate.style.display = 'none';
				});
				mask.show(); //显示遮罩
			},
			showFreeAskGetSuccess: function() {
				this.closeFreeAskTemplate();

				var FreeTemplate = document.getElementById('freeAskSuccessTemplate');
				FreeTemplate.style.display = 'block';
				var mask = mui.createMask(() => {
					FreeTemplate.style.display = 'none';
				});
				mask.show(); //显示遮罩
			},
		  //对时间的处理；
			timeAutoEnd: function() {
				if(this.timeAutoEndTimeOut) {
					clearTimeout(this.timeAutoEndTimeOut);
				}
				this.timeAutoEndTimeOut = setTimeout(() => {
					this.currentTime = parseInt((new Date()).getTime() / 1000);
					this.timeAutoEnd();
				}, 1000);
			},
			//请求的数据；
			getData: function() {
				var deration = this;
				var t = this;
				apiRequest(`home`, {}, false).then(response_data => {
					if(response_data === false) {
						return;
					}
					
					console.log(response_data.is_expert)
				 
					//推荐专家；
				   t.recommend_experts = response_data.recommend_experts;
				   //推荐阅读；
				   t.recommend_read = response_data.recommend_read;
					//返回是否显示首次提问免费的福利；
					t.firstAsk = response_data.first_ask_ac.show_first_ask_coupon;
					//是否是专家；
					t.is_expert = response_data.is_expert;
					
					//返回的时间；
					var couponExpireAt = response_data.first_ask_ac.coupon_expire_at;

					if(couponExpireAt) {
						t.couponExpireAtTime = Date.parse(couponExpireAt.replace(/-/g, "/")) / 1000;
						t.timeAutoEnd();
					} else {
						t.couponExpireAtTime = null;
					}
                    
                    //轮播图；
					t.notices = response_data.notices;
						
					t.loading = 0;
					if(t.firstAsk) {
						t.showFreeAskGet();
					}
       
					if(t.notices.length) {
						setTimeout(function() {
							var slider = mui("#slider");
							slider.slider({
								interval: 5000
							});
						}, 100);
					}
				});
			}
		}
	};
	export default Home;
</script>

<style lang="less" scoped>
/*手机端*/
.suspend{
	width: 100%;
	height:64px;
	border-radius:4px;
	background:#252525;
	position: absolute;
	top:44px;
	z-index: 999;
	display: none;
}
.suspend p:nth-of-type(1){
	float: left;
	width: 47px;
	height: 47px;
	border-radius: 12px;
	background: #F3F4F6;
	margin-top: 8.5px;
	margin-left: 10px;
	text-align: center;	
}
.suspend p:nth-of-type(1)>svg{
	font-size: 34px;
	margin-top: 6px;
	color: #009fe8;
}
.suspend p:nth-of-type(2){
	width: 96px;
	height: 47px;
	margin-top: 8.5px;
	margin-left: 10px;
	padding-top: 5px;
	float: left;
}
.suspend p:nth-of-type(2)>span{
	display: block;
	color: #FFFFFF;
	font-size: 12px;
}
.suspend p:nth-of-type(2)>span:nth-of-type(1){
	font-size:16px
}
.suspend p:nth-of-type(2)>span:nth-of-type(2){
	margin-top: -3px;
}
.suspend p:nth-of-type(3){
	float:right;
	width: 76px;
	height:30px;
	border-radius:4px;
	background:#3c95f9;
	text-align: center;
	line-height: 30px;
	color: #FFFFFF;
	margin-top: 17px;
	margin-right: 10.5px;
	}
/*微信端*/
.suspension{
	width: 100%;
	height: 49px;
	position: absolute;
    top: 44px;
    background: #FFFFFF;
    z-index: 999;
    box-shadow:0px 3px 5px #b4b4b6;
    -webkit-box-shadow:0px 3px 5px #b4b4b6;
    -moz-box-shadow:0px 3px 5px #b4b4b6;
    display: none;
}
.suspension p:nth-of-type(1){
	float: left;
	width:35px;
	height:35px;
	border-radius:9px;
	background: #f3f4f6;
	margin-top: 7px;
	margin-left: 16px;
	text-align: center;
}
.suspension p:nth-of-type(1) svg{
	font-size: 25px;
	margin-top: 6px;
	color: #009fe8;
}
.suspension p:nth-of-type(2){
    float: left;
    font-size:16px;
	color:#171616;
	margin-top: 14px;
	margin-left: 10px;
}
.suspension p:nth-of-type(3){
	float:right;
	width:76px;
	height:30px;
	border-radius:4px;
	background: #3c95f9;
	font-size: 14px;
	color: #FFFFFF;
	text-align: center;
    line-height: 30px;
    margin-top: 10px;
    margin-right: 14px;
}
	/*2.0版本css样式*/
	
	.mui-content {
		overflow-y: auto;
	}
	
	div,
	span,
	p,
	ul,
	li,
	i,
	a {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	
	.bot {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0px;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(220, 220, 220);
	}
	/*头部样式*/
	
	header {
		width: 100;
		height: 44px;
		background: #f3f4f6;
		text-align: center;
		
	}
	
	header svg {
		font-size:80px;
	    color: #3c3e44;
	    margin-top: -13px;
	}
	/*轮播样式*/
	
	#slider img {
		height: 136px;
		width: 100%;
	}
	/*专业问答 和 成为专家 */
	
	.home-expert {
		width: 100%;
		height: 70px;
	}
	
	.home-expert p {
		float: left;
		width: 44.5%;
		height: 50px;
		background: #FFFFFF;
		border-radius: 4px;
		margin-top: 10px;
		padding-top: 13px;
	}
	
	.home-expert p:nth-of-type(1) {
		margin-left: 4%;
	}
	
	.home-expert p:nth-of-type(2) {
		margin-left: 3%;
	}
	
	.home-expert p svg {
		font-size: 25px;
		margin-left: 38px;
		margin-bottom: -4px;
	}
	
	.home-expert p span {
		font-size: 13px;
		color: #444444;
		margin-left:3px;
	}
	/*一元特惠*/
	
	.freeAskWrapper {
		position: relative;
		height: 48px;
	}
	
	.freeAsk {
		position: absolute;
		left: 15px;
		right: 15px;
	}
	
	.freeAsk .icon {
		position: absolute;
		width: 35px;
		left: -8px;
		top: -5px;
		height: 48px;
		display: inline-block;
		background-image: url("../statics/images/icon_xiaoha@2x.png");
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}
	
	.freeAsk .text {
		background: #dcdcdc;
		border: 1px #dcdcdc solid;
		border-radius: 50px;
		font-size: 14px;
		line-height: 14px;
		color: #323232;
		padding: 13px 0px 13px 35px;
	}
	
	.freeAsk .text div {
		display: inline-block;
	}
	
	.freeAskGet {
		position: fixed;
		top: 50%;
		margin-top: -181px;
		left: 10px;
		right: 10px;
		background: url("../statics/images/freeAskGet@2x.png") no-repeat center;
		background-size: contain;
		height: 262px;
		z-index: 999;
	}
	/*人物推荐*/
	
	.home-recommend {
		width: 100%;
		height: 170px;
		background: #FFFFFF;
		margin-top: 5px;
		margin-bottom: 10px;
	}
	
	.home-recommend div:nth-of-type(1) {
		margin-left: 0px;
	}
	
	.home-card {
		width: 114px;
		height: 148px;
		background: #ececee;
		margin-top: 11px;
		position: relative;
	}
	
	.home-card img {
		width: 50px;
		height: 50px;
		display: block;
		border-radius: 50%;
		margin-top: 10px;
		margin-left: 32px;
	}
	
	.home-card span {
		display: block;
	}
	
	.home-card span:nth-of-type(1) {
		display: inline-block;
		width: 100%;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
		color: #444444;
		margin-top: 6px;
	}
	
	.home-card span:nth-of-type(1) svg {
		font-size: 20px;
		color: #03aef9;
		margin-bottom: -2px;
		margin-left: -3px;
	}
	
	.home-card span:nth-of-type(2) {
		display: inline-block;
		width: 100%;
		text-align: center;
		font-size: 12px;
		color: #444444;
	}
	
	.home-card span:nth-of-type(3) {
		width: 70%;
		height: 24px;
		border-radius: 50px;
		border: 0.5px solid #03aef9;
		margin-left: 15%;
		margin-top: 6px;
		font-family: "PingFangSC";
		font-size: 14px;
		text-align: center;
		color: #03aef9;
	}
	
	.home-card p {
		position: absolute;
		top: 0px;
		right: 0px;
		width: 35px;
	    text-align: center;
		background: url("../statics/images/fill_1@2x.png") no-repeat;
		background-size: 100% 100%;
		font-size: 12px;
	    color: #ffffff;
	}
	
	
	/*向你推荐*/
	
	.home-reading {
		width: 100%;
		background: #FFFFFF;
	}
	
	.reader-upper {
		width: 90%;
		height: 50px;
		margin-left: 5%;
		position: relative;
	}
	
	.reader-upper span:nth-of-type(1) {
		float: left;
		line-height: 50px;
		font-size: 16px;
		color: #444444;
	}
	.reader-upper span:nth-of-type(2) {
		float: right;
		line-height: 50px;
		font-size: 13px;
		color: #03aef9;
	}
	
	
	.home-reading ul {
		width: 100%;
	}
	
	.home-reading ul li {
		width: 90%;
		height: 125px;
		margin-left: 5%;
		position: relative;
	}
	
	.home-reading ul li:last-child {
		.bot{
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0px;
		height: 0px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(220, 220, 220);	
		}
	}
	
	.home-reading ul li img {
		width: 35%;
		height: 80px;
		float: left;
		margin-top: 21px;
		border-radius: 4px;
	}
	
	.home-reading ul li div {
		float: left;
		width: 63%;
		margin-left: 2%;
		margin-top: 21px;
	}
	
	.home-reading ul li div p:nth-of-type(1) {
		font-size: 14px;
		color: #444444;
	}
	
	.home-reading ul li div p:nth-of-type(2) {
		font-size: 12px;
		color: #808080;
		margin-top: 20px;
	}
	
	
	
	.home-time {
		float: left;
		font-size: 12px;
		color: #b4b4b6;
	}
	
	.home-laud {
		float: right;
	}
	
	.home-laud>svg {
		font-size: 17px;
		color: #b4b4b6;
	}
	
	.home-laud>i {
		font-size: 20px;
		font-size: 13px;
		color: #03aef9;
		font-style: normal;
	}
	
	.home-bot {
		width: 100%;
		height: 140px;
		background: #FFFFFF;
		font-size: 14px;
		text-align: center;
		color: #c8c8c8;
	}
</style>