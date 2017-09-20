<template>

	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">问答详情</h1>
		</header>

		<div class="mui-content absolute">
			<!--导航栏-->
			<div class="menu">
				<span @tap.stop.prevent="$router.replace('/home/MajorDetailList')">专业问答</span>
				<span @tap.stop.prevent="">悬赏问答</span>
				<i class="bot"></i>
			</div>
			<div id="pullrefresh" :class="{'mui-content':false, 'mui-scroll-wrapper':true, 'task-list':true, 'emptyList':nothing}">
				<!--<div class="container" v-if="nothing == 1">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-zanwushuju"></use>
					</svg>
					<p>暂时还没有数据呀～</p>
				</div>-->

				<!--v-show="nothing == 0"-->

				<div class="mui-scroll">
					<!---->
					<ul>
						<li>
							<div class="major-t">
								<p>
									<img src="../../statics/images/balance1.png" />
									<svg class="icon" aria-hidden="true">
										<use xlink:href="#icon-zhuanjiabiaojishixin"></use>
									</svg>
								</p>
								<p>
									<span>匿名</span>
									<span>公司职位保密</span>
								</p>
								<p>￥88元</p>
							</div>
							<p class="mui-ellipsis-2">MIX2给了小米多少抗衡苹果的勇气！？小米在11号抢在iPhone前面一天发布。</p>
							<div class="major-b">
								<p>2人回答</p>
								<p> 倒计时 01：57：23 </p>
							</div>
							<i class="bot"></i>
						</li>
						<li>
							<div class="major-t">
								<p>
									<img src="../../statics/images/balance1.png" />
									<svg class="icon" aria-hidden="true">
										<use xlink:href="#icon-zhuanjiabiaojishixin"></use>
									</svg>
								</p>
								<p>
									<span>匿名</span>
									<span>公司职位保密</span>
								</p>
								<p>￥88元</p>
							</div>
							<p class="mui-ellipsis-2">MIX2给了小米多少抗衡苹果的勇气！？小米在11号抢在iPhone前面一天发布。</p>
							<div class="major-b">
								<p>2人回答</p>
								<p> 倒计时 01：57：23 </p>
							</div>
							<i class="bot"></i>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- <div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>-->
	</div>
</template>

<script>
	import { createAPI, addAccessToken, postRequest } from '../../utils/request';
	import userAbility from '../../utils/userAbility';
	const Chance = {
		data: () => ({
			list: [],
			data: "",
			loading: true
		}),
		created() {

		},
		computed: {
			//动态计算当前的页数；
			page() {
				if(this.data) {
					return parseInt(this.data.current_page) + 1;
				}
				return 1;

			},
			//有无数据；
			nothing() {
				if(this.loading) {
					return -1;
				}
				return this.list.length ? 0 : 1;
			},

		},
		methods: {
			//跳转；
			skip(id) {
				userAbility.applyActivity(this, id);
			},
			//下拉刷新;
			pulldownRefresh() {
				setTimeout(() => {
					this.getPrevList();
				}, 1000);
			},
			goUrl(url) {
				if(/resume/.test(url)) {
					this.$router.pushPlus(url + '&goback=1');
				} else {
					this.$router.pushPlus(url);
				}
			},
			//下拉刷新请求的数据；
			getPrevList() {
				postRequest(`activity/list`, {
					activity_type: 2,
					is_mine: 1
				}).then(response => {
					var code = response.data.code;
					//如果请求不成功提示信息 并且返回上一页；
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}
					console.log(response.data.data.data)
					if(response.data.data.data.length > 0) {

						this.list = response.data.data.data;
						this.data = response.data.data;

					}

					this.loading = 0;
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				});
			},
			//			//上拉加载；
			pullupRefresh() {
				setTimeout(() => {
					this.getNextList();
				}, 1000);
			},
			//上拉加载；
			getNextList() {
				postRequest("activity/list", {
					activity_type: 2,
					is_mine: 1,
					page: this.page
				}).then(response => {
					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}

					if(response.data.data.data) {
						this.list = this.list.concat(response.data.data.data)
						this.data = response.data.data;
					}

					this.loading = 0;

					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);

				});
			},

		},
		mounted() {
			//			//请求数据；
			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						callback: this.pulldownRefresh
					},
					up: {
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
						callback: this.getNextList
					}
				}
			});

			//加载页面请求一次；
			this.getPrevList();

		}

	}
	export default Chance;
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
	
	.mui-wechat .menu[data-v-4f45c199] {
		width: 100%;
		height: 45px;
		position: absolute;
		z-index: 10;
		background: #f3f4f6;
		top: 0;
	}
	
	.mui-content.absolute .menu~#pullrefresh {
		top: 45px;
	}
	
	.mui-content.absolute {
		background: #FEFFFE;
	}
	/*导航栏的样式*/
	
	.menu {
		width: 100%;
		height: 45px;
		position: absolute;
		z-index: 10;
		background: #f3f4f6;
	}
	
	.menu span {
		display: inline-block;
		width: 49%;
		height: 100%;
		font-size: 14px;
		color: #444444;
		text-align: center;
		line-height: 45px;
		font-weight: 600;
	}
	
	.menu span:nth-of-type(2) {
		color: #3c95f9;
	}
	
	.menu i {
		display: block;
		position: absolute;
		width: 55px;
		height: 1.8px;
		left: 67.6%;
		bottom: 0.5px;
		background: #03aef9;
	}
	/*滚动区域*/
	
	ul {
		width: 100%;
		overflow: hidden;
	}
	
	ul li {
		width: 92%;
		margin-left: 4%;
		height: 152px;
		position: relative;
		padding-top: 15px;
	}
	
	.major-t {
		width: 100%;
		height: 44px;
	}
	
	.major-t p:nth-of-type(1) {
		width: 13%;
		height: 100%;
		float: left;
		/*border: 1px solid #CCCCCC;*/
		position: relative;
	}
	
	.major-t p:nth-of-type(1) svg {
		position: absolute;
		right: -4px;
		bottom: 0;
		font-size: 20px;
	}
	
	.major-t p:nth-of-type(1) img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	
	.major-t p:nth-of-type(2) {
		width: 70%;
		height: 100%;
		float: left;
		margin-left: 2%;
		/*border: 1px solid #CCCCCC;*/
	}
	
	.major-t p:nth-of-type(2) span {
		display: block;
		width: 100%;
	}
	
	.major-t p:nth-of-type(2) span:nth-of-type(1) {
		font-size: 14px;
		color: #444444;
	}
	
	.major-t p:nth-of-type(2) span:nth-of-type(2) {
		font-size: 13px;
		color: #808080;
	}
	
	.major-t p:nth-of-type(3) {
		width: 14%;
		height: 100%;
		font-size: 12px;
		color: #fa4975;
		text-align: right;
		float: right;
	}
	
	ul li>p {
		width: 100%;
		height: 45px;
		font-size: 16px;
		color: #444444;
		margin-top: 12px;
		margin-bottom: 9px;
	}
	
	.major-b {
		width: 100%;
		height: 17px;
	}
	
	.major-b p {
		font-size: 12px;
		color: #B4B4B6;
	}
	
	.major-b p:nth-of-type(1) {
		float: left;
	}
	
	.major-b p:nth-of-type(2) {
		float: right;
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