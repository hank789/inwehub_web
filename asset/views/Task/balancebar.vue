<template>

	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">余额变动</h1>
		</header>

		<div class="mui-content mui-scroll-wrapper" id="pullrefresh">

			<div class="container" v-if="nothing == 1">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#icon-zanwushuju"></use>
				</svg>
				<p>暂时还没有数据呀～</p>
			</div>

			<div class="mui-scroll" v-show="nothing == 0">
				<ul v-for="item in list">
					<p>{{item.read_at}}</p>
					<li>
						<p>
							<span class="check">
			  				<i>交易成功</i>
			  				<i>{{item.created_at}}</i>
   	  			             </span>
							<span><i v-if="item.data.io == 1">+</i><i v-if="item.data.io == -1">-</i><i>{{item.data.change_money}}</i></span>
							<span>{{item.data.title}}</span>
							<i class="bot"></i>
						</p>
						<p>
							<span>用户名：<i>{{item.data.name}}</i></span>
							<span>余&nbsp;&nbsp;&nbsp;额：<i>{{item.data.current_balance}}</i></span>
							<span v-if="item.data.extra_body">{{item.data.extra_body}}</span>
							<i class="bot"></i>
						</p>
						<p  @tap.stop.prevent="$router.pushPlus(item.data.url)">
							<span >查看详情</span>
							<svg class="icon" aria-hidden="true">
								<use xlink:href="#icon-chakangengduojiantou"></use>
							</svg>
						</p>
					</li>
				</ul>

			</div>
		</div>

		<div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>
	</div>
</template>

<script>
	import { createAPI, addAccessToken, postRequest } from '../../utils/request';
	const Readbar = {
		data: () => ({
			list: "",
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
			//下拉刷新;
			pulldownRefresh() {
				setTimeout(() => {
					this.getPrevList();
				}, 1000);
			},
			//下拉刷新请求的数据；
			getPrevList() {
				postRequest(`notification/money_list`, {}).then(response => {
					var code = response.data.code;
					//如果请求不成功提示信息 并且返回上一页；
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}
					//请求成功的操作
					response = {
						"status": true,
						"code": 1000,
						"message": "操作成功",
						"data": {
							"current_page": 1, //当前页
							"per_page": 10, //每页条数
							"from": 1, //起始位置
							"to": 10, //结束位置
							"data": [{
									"id": "f54c537e-f186-4338-8311-aab7870f8ac4", //通知id
									"type": "App\\Notifications\\Readhub\\SubmissionReplied", //类型
									"data": {
										"url": "/my", //通知跳转链接
										"avatar": "", //头像，暂时无用
										"name": "张三", //用户名
										"title": "问答服务费结算到账", //通知标题
										"change_money": "30", //变动金额
										"before_money": "100", //变动前金额
										"current_balance": "130", //当前余额
										"io": "-1", //1为入账，-1为出账
										"body": "交易成功", //通知内容
										"extra_body": "", //额外内容，为空就不显示
									},
									"read_at": '2017-04-20 12:24:25', //是否已读,null表示未读
									"created_at": "2017-04-20 12:24:25", //创建时间
								},
								{
									"id": "f54c537e-f186-4338-8311-aab7870f8ac4", //通知id
									"type": "App\\Notifications\\Readhub\\SubmissionReplied", //类型
									"data": {
										"url": "/my/finance", //通知跳转链接
										"avatar": "", //头像，暂时无用
										"name": "王五", //用户名
										"title": "问答服务费结算到账", //通知标题
										"change_money": "30", //变动金额
										"before_money": "100", //变动前金额
										"current_balance": "130", //当前余额
										"io": "1", //1为入账，-1为出账
										"body": "交易成功", //通知内容
										"extra_body": "感谢您对InweHub的信任!", //额外内容，为空就不显示
									},
									"read_at": "2017-08-21 16:30:05", //是否已读,null表示未读
									"created_at": "2017-04-20 12:24:25", //创建时间
								}
							]
						}
					}
					console.log(response.data)
					if(response.data.data.length > 0) {
						this.list = response.data.data;
						this.data = response.data;

					}
					this.loading = 0;
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				});
			},
			//上拉加载；
			pullupRefresh() {
				setTimeout(() => {
					this.getNextList();
				}, 1000);
			},
			//上拉加载；
			getNextList() {
				postRequest("notification/money_list", {
					page: this.page
				}).then(response => {
					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}
					//请求成功的操作

					if(response.data.data.length > 0) {
						//给请求的数据重新赋值；刷新最新的数据；
						this.list = response.data.data;
						this.data = response.data;
					}

					this.loading = 0;

					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);

				});
			},
			//请求标记
			sign() {
				postRequest(`notification/mark_as_read`, {
					notification_type: 2
				}).then(response => {

					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}
					//
					//					if(response.data.data.length > 0) {
					//						this.list = response.data.data;
					//					}

				});
			}

		},
		mounted() {
			//请求数据；
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
			this.sign()

		}

	}
	export default Readbar;
</script>

<style scoped>
	.bot {
		position: absolute;
		right: 0px;
		bottom: 0;
		left: 0px;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(220, 220, 220);
	}
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
	/*滚动区域*/
	.mui-bar-nav ~ .mui-content {
     padding-top: 0px; 
}
	.mui-wechat #pullrefresh {
		margin-top: 0px;
	}
	.mui-content {
		background: #FFFFFF;
	}
	/*主体部分样式*/
	
	ul {
		width: 100%;
		height: 304px;
		padding: 0px 16px 0 16px;
		margin-top: 11px;
	}
	
	ul p {
		text-align: center;
	}
	
	ul li {
		width: 100%;
		height: 265px;
		background: #f3f4f6;
		margin-top: 11px;
		border: 0.5px solid #dcdcdc;
		border-radius: 5px;
		padding: 12px 15px;
	}
	
	ul li p {
		position: relative;
	}
	
	ul li p:nth-of-type(1) {
		width: 100%;
		height: 110px;
	}
	
	.check {
		width: 100%;
		height: 20px;
	}
	
	.check i:nth-of-type(1) {
		float: left;
		font-size: 14px;
		color: #444444;
	}
	
	.check i:nth-of-type(2) {
		font-size: 12px;
		color: #808080;
		float: right;
	}
	
	ul li p:nth-of-type(1) span {
		display: block;
	}
	
	ul li p:nth-of-type(1) span:nth-of-type(2) {
		margin-top: 23px;
		font-size: 23px;
		color: #444444;
	}
	
	ul li p:nth-of-type(1) span:nth-of-type(3) {
		margin-top: 5px;
		font-size: 14px;
		color: #808080;
	}
ul li p:nth-of-type(1) span:nth-of-type(2) i:nth-child(1){
  font-size: 28px;
  color:#444444;
  
}
	
	ul li p:nth-of-type(2) {
		width: 100%;
		height: 103px;
	}
	
	ul li p:nth-of-type(2) span:nth-of-type(1) {
		margin-top: 14px;
	}
	
	ul li p:nth-of-type(2) span:nth-of-type(2) {
		margin-top: 6px;
	}
	
	ul li p:nth-of-type(2) span:nth-of-type(3) {
		margin-top: 6px;
	}
	
	ul li p:nth-of-type(2) span {
		width: 100%;
		float: left;
		text-align: left;
		display: block;
		color: rgb(128, 128, 128);
	}
	
	ul li p:nth-of-type(2) span i {
		color: rgb(68, 68, 68);
	}
	
	ul li p:nth-of-type(3) {
		width: 100%;
		height: 30px;
	}
	
	ul li p:nth-of-type(3) span {
		color: rgb(128, 128, 128);
	}
	
	ul li p:nth-of-type(3) span i {
		color: rgb(68, 68, 68);
	}
	
	ul li p:nth-of-type(3) span {
		float: left;
		font-size: 14px;
		color: #808080;
		margin-top: 9px;
	}
	
	ul li p:nth-of-type(3) svg {
		float: right;
		font-size: 13px;
		color: #808080;
		margin-top: 14px;
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