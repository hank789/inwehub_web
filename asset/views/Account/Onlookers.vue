<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">我的围观</h1>
		</header>

		<div class="mui-content absolute">
			<div class="mui-scroll-wrapper" id="pullrefresh">

				<!--<div class="container">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-zanwushuju"></use>
					</svg>
					<p>暂时还没有数据呀～</p>
				</div>-->

				<div class="mui-scroll">
					<ul class="hotAnswer_b">
						<li>
							<p class="mui-ellipsis-2">MIX2给了小米多少抗衡苹果的勇气！？小米在11号抢在iPhone前面一天发布。</p>
							<div class="hotAnswer_d">
								<p>
									<img src="../../statics/images/balance1.png" />
									<svg class="icon" aria-hidden="true">
										<use xlink:href="#icon-zhuanjiabiaojishixin"></use>
									</svg>
								</p>
								<p class="mui-ellipsis">回答者：郭大红</p>
								<p class="mui-ellipsis">计算机科学与技术</p>
								<p class="mui-ellipsis">上海科技有限公司</p>
							</div>
							<i class="bot"></i>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { createAPI, addAccessToken, postRequest } from '../../utils/request';
	import userAbility from '../../utils/userAbility';
	//	const Discount = {
	//		data: () => ({
	//			list: [],
	//			data: "",
	//			loading: true
	//
	//		}),
	//		created() {
	//
	//		},
	//		computed: {
	//			//动态计算当前的页数；
	//			page() {
	//				if(this.data) {
	//					return parseInt(this.data.current_page) + 1;
	//				}
	//				return 1;
	//
	//			},
	//			//有无数据；
	//			nothing() {
	//				if(this.loading) {
	//					return -1;
	//				}
	//				return this.list.length ? 0 : 1;
	//			},
	//
	//		},
	//		methods: {
	//			//跳转；
	//			skip(id){
	//				 userAbility.jumpToApplyActivity(this,id);
	//			},
	//			//下拉刷新;
	//			pulldownRefresh() {
	//				setTimeout(() => {
	//					this.getPrevList();
	//				}, 1000);
	//			},
	//			goUrl(url) {
	//			    if (/resume/.test(url)) {
	//			        this.$router.pushPlus(url + '&goback=1');
	//        } else {
	//          this.$router.pushPlus(url);
	//        }
	//    },
	//			//下拉刷新请求的数据；
	//			getPrevList() {
	//				postRequest(`activity/list`, {activity_type:1,is_mine:1}).then(response => {
	//					var code = response.data.code;
	//					//如果请求不成功提示信息 并且返回上一页；
	//					if(code !== 1000) {
	//						mui.alert(response.data.message);
	//						mui.back();
	//					}
	//                    console.log(response.data.data.data)
	//					if(response.data.data.data.length > 0) {
	//
	//						this.list = response.data.data.data;
	//						this.data = response.data.data;
	//
	//
	//					}
	//
	//					this.loading = 0;
	//					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	//				});
	//			},
	////			//上拉加载；
	//			pullupRefresh() {
	//				setTimeout(() => {
	//					this.getNextList();
	//				}, 1000);
	//			},
	//			//上拉加载；
	//			getNextList() {
	//				postRequest("activity/list", {
	//					activity_type:1,
	//					is_mine:1,
	//					page:this.page
	//				}).then(response => {
	//					var code = response.data.code;
	//					if(code !== 1000) {
	//						mui.alert(response.data.message);
	//						mui.back();
	//					}
	//
	//
	//					if(response.data.data.data) {
	//					   this.list =  this.list.concat(response.data.data.data)
	//					   this.data = response.data.data;
	//					}
	//
	//					this.loading = 0;
	//
	//					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
	//
	//				});
	//			},
	//
	//
	//		},
	//		mounted() {
	////			//请求数据；
	//			mui.init({
	//				pullRefresh: {
	//					container: '#pullrefresh',
	//					down: {
	//						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
	//						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
	//						contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
	//						callback: this.pulldownRefresh
	//					},
	//					up: {
	//						contentrefresh: '正在加载...',
	//						contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
	//						callback: this.getNextList
	//					}
	//				}
	//			});
	//
	//			//加载页面请求一次；
	//			this.getPrevList();
	//
	//		}
	//
	//	}
	//	export default Discount;
</script>

<style scoped>
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
	
	.mui-bar-nav~.mui-content.absolute {
		top: 44px;
		background: #fff;
	}
	
	.bot {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(220, 220, 220);
	}
	
	.hotAnswer_b {
		width: 90%;
		margin-left: 5%;
		/*height: 200px;*/
		overflow: hidden;
	}
	
	.hotAnswer_b li {
		width: 100%;
		height: 93px;
		position: relative;
	}
	
	.hotAnswer_b li>p {
		margin-top: 12px;
		font-size: 16px;
		color: #444444;
	}
	
	.hotAnswer_d {
		width: 100%;
		height: 32px;
		margin-top: 8px;
	}
	
	.hotAnswer_d p {
		float: left;
	}
	
	.hotAnswer_d p:nth-child(1) {
		width: 9.5%;
		height: 32px;
		/*background: #CCCCCC;*/
		position: relative;
	}
	
	.hotAnswer_d p:nth-child(1)>svg {
		position: absolute;
		font-size: 14px;
		bottom: 0;
		right: -4px;
	}
	
	.hotAnswer_d p:nth-child(1)>img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	
	.hotAnswer_d p:nth-child(2) {
		width: 32%;
		height: 15px;
		margin-top: 8.5px;
		font-size: 13px;
		color: #808080;
		border-right: 1px solid #c8c8c8;
		text-align: center;
		line-height: 15px;
	}
	
	.hotAnswer_d p:nth-child(3) {
		width: 21%;
		height: 15px;
		margin-top: 8.5px;
		font-size: 13px;
		color: #808080;
		border-right: 1px solid #c8c8c8;
		text-align: center;
		line-height: 15px;
	}
	
	.hotAnswer_d p:nth-child(4) {
		width: 37.5%;
		height: 15px;
		margin-top: 8.5px;
		font-size: 13px;
		color: #808080;
		text-align: center;
		line-height: 15px;
	}
	/*无数据的样式 */
	
	.container {
		position: absolute;
		top: 40%;
		left: 36%;
	}
	
	.container svg {
		font-size: 60px;
		margin-left: 23px;
		margin-bottom: 8px;
	}
	
	.container p {
		font-size: 12px;
		color: #c8c8c8;
	}
</style>