<template>

	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">动态</h1>
		</header>
		<!--导航栏-->

		<div class="mui-content absolute ">
			<div class="mui-scroll-wrapper">
				<div class="content">
					<div class="menu">
						<span @tap.stop.prevent="$router.replace('/task')">任务</span>
						<span @tap.stop.prevent="">消息</span>
						<i></i>
					</div>

					<div class="mui-scroll" id="pullrefresh">
						<ul>
							<li @tap.stop.prevent="skip(1)">
								<img src="../../statics/images/inform1.png" />
								<div class="message" v-if="notice_count != 0">{{notice_count}}</div>
								<p>
									<span>通知公告</span>
									<span class="mui-ellipsis">{{notice_message.last_message ? notice_message.last_message.data.title : ""}}</span>
								</p>
								<a>{{notice_message.last_message ? notice_message.last_message.created_at:''}}</a>
								<i class="bot"></i>
							</li>
							<li @tap.stop.prevent="skip(2)">
								<img src="../../statics/images/balance1.png" />
								<div class="message" v-if="money_count != 0">{{money_count}}</div>
								<p>
									<span>余额变动</span>
									<span class="mui-ellipsis">{{money_message.last_message ? money_message.last_message.data.title : ""}} </span>
								</p>
								<a>{{money_message.last_message ? money_message.last_message.created_at:''}}</a>
								<i class="bot"></i>
							</li>
							<!--<li @tap.stop.prevent="$router.pushPlus('/integralbar')">
					       	 	<img src="../../statics/images/integral1.png" />
					       	 	<div class="message">99</div>
					       	 	<p>
					       	 	   <span>积分变动</span>
					       	 	   <span class="mui-ellipsis">回答了一条问题增加2积分</span>
					       	 	</p>
					       	 	<a>16:44</a>
					       	 	<i class="bot"></i>
					       	 </li>-->
							<li @tap.stop.prevent="skip(3)">
								<img src="../../statics/images/mission1.png" />
								<div class="message" v-if="task_count != 0">{{task_count}}</div>
								<p>
									<span>任务动态</span>
									<span class="mui-ellipsis">{{task_message.last_message ? task_message.last_message.data.title : ""}} </span>
								</p>
								<a>{{task_message.last_message ? task_message.last_message.created_at:''}}</a>
								<i class="bot"></i>
							</li>
							<li @tap.stop.prevent="skip(4)">
								<img src="../../statics/images/read1.png" />
								<div class="message" v-if="readhub_count != 0">{{readhub_count}}</div>
								<p>
									<span>阅读发现</span>
									<span class="mui-ellipsis">{{readhub_message.last_message ? readhub_message.last_message.data.title : ""}}</span>
								</p>
								<a>{{readhub_message.last_message ? readhub_message.last_message.created_at:''}}</a>
								<i class="bot"></i>
							</li>
							<!--<li @tap.stop.prevent="$router.pushPlus('/chat')">
       	 	<img src="../../statics/images/service1.png" />
       	 	<div class="message">{{99}}</div>
       	 	<p>
       	 	   <span>客服小哈</span>
       	 	   <span class="mui-ellipsis">===关于我们===Inwehub是一款一款一款一款</span>
       	 	</p>
       	 	<a>16:44</a>
       	 	<i class="bot"></i>
				</li>-->
						</ul>
					</div>
				</div>
			</div>
		</div>
		<!--<div id="statusBarStyle" background="#fff" bgColor="#fff" mode="dark"></div>-->
	</div>
</template>

<script type="text/javascript">
	import { createAPI, addAccessToken, postRequest } from '../../utils/request';
	const TaskMain = {
		data: () => ({
			count: "",
			notice_message: {},
			task_message: {}, //未读任务动态数
			readhub_message: {}, //未读阅读发现数
			money_message: {}, //未读资金变动数
			notice_count: 0,
			task_count: 0,
			readhub_count: 0,
			money_count: 0,
			loading: true
		}),
		methods: {
			skip(num) {
				switch(num) {
					case 1:
						this.notice_count = 0;
						this.$router.pushPlus('/informbar');
						break;
					case 2:
						this.money_count = 0;
						this.$router.pushPlus('/balancebar');
						break;
					case 3:
						this.task_count = 0;
						this.$router.pushPlus('/taskbar');
						break;
					case 4:
						this.readhub_count = 0;
						this.$router.pushPlus('/readbar');
						break;

				}

			},
			//下拉刷新;
			pulldownRefresh() {
				setTimeout(() => {
					this.getPrevList();
				}, 1000);
			},
			//下拉刷新请求的数据
			getPrevList() {
				postRequest(`notification/count`, {}).then(response => {
					var code = response.data.code;
					//如果请求不成功提示信息 并且返回上一页；
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
						return;
					}

					this.notice_message = response.data.data.notice_message;
					this.task_message = response.data.data.task_message;
					this.readhub_message = response.data.data.readhub_message;
					this.money_message = response.data.data.money_message;

					this.notice_count = this.notice_message.unread_count;
					this.task_count = this.task_message.unread_count;
					this.readhub_count = this.readhub_message.unread_count;
					this.money_count = this.money_message.unread_count;
					//	console.log(this.notice_message)；
					this.loading = 0;
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed

				});
			},
			//请求标记
			sign() {
				postRequest(`notification/mark_as_read`, {
					notification_type: 0
				}).then(response => {

					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
						return;
					}

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
					}
				}
			});
			this.getPrevList();
			this.sign();

		}
	}
	export default TaskMain;
</script>

<style scoped="scoped">
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
	/*导航栏的样式*/

	.mui-content {
		background: #FFFFFF;
	}

	.mui-wechat .menu {
		width: 100%;
		height: 45px;
		position: absolute;
		top: 0;
		z-index: 10;
		background: #f3f4f6;
	}

	.mui-wechat .content {
		margin-top: 45px;
	}

	.menu {
		width: 100%;
		height: 45px;
		position: absolute;
		top: 0;
		z-index: 99;
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
		width: 30px;
		height: 1.8px;
		right: 21.65%;
		bottom: 0.5px;
		background: #3c95f9;
	}
	/*内容区域*/

	.content {
		margin-top: 45px;
	}

	.content ul li {
		width: 100%;
		height: 60px;
		padding: 0 16px;
		position: relative;
	}

	.content ul li img {
		width: 42px;
		height: 42px;
		margin-top: 10px;
		float: left;
	}

	.content ul li p {
		float: left;
		margin-top: 10px;
		margin-left: 12px;
	}

	.content ul li a {
		position: absolute;
		top: 10px;
		right: 16px;
		font-size: 12px;
		color: #c8c8c8;
	}

	.content ul li p span:nth-of-type(1) {
		display: block;
		font-size: 16px;
		color: #444444;
	}

	.content ul li p {
		width: 81%;
	}

	.content ul li p span:nth-of-type(2) {
		display: block;
		width: 100%;
		height: 18px;
		font-size: 13px;
		color: #808080;
	}

	.message {
		position: absolute;
		font-size: 11px;
		color: #ffffff;
		min-width: 18px;
		height: 18px;
		background: #f03c69;
		border-radius: 50%;
		text-align: center;
		line-height: 18px;
		left: 45px;
		top: 5px;
	}
</style>
