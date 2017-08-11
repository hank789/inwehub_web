<template>

	<div>
		<div class="mui-content">
			<div class="my-top">
				<div class="professor">
					<div class="my-img">
						<img :src="avatar" class="avatar" />
					</div>

					<div class="my-personal">
						<div class="my-info">
							<span>{{name}}</span>
							<p>{{ user_level }}</p>
							<svg class="icon" aria-hidden="true" v-if="expert_apply_status =='2'">
								<use xlink:href="#icon-zhuanjiabiaoji"></use>
							</svg>
							<p>
								<svg class="icon share" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/my/resume')">
									<use xlink:href="#icon-fenxiang"></use>
								</svg>
								<span class="share" @tap.stop.prevent="$router.pushPlus('/my/resume')">分享名片</span>
							</p>
							<i class="bot"></i>
						</div>

						<div class="my-detail">
							<span class="grow">成长值</span>
							<span>{{user_credits }}</span>
							<span class="integral">贡献值</span>
							<span>{{user_coins }}</span>
						</div>
					</div>

				</div>
				<div class="my-news">
					<p @tap.stop.prevent="$router.pushPlus('/my/focus')">关注<span>{{attention}}</span></p>
					<p @tap.stop.prevent="$router.pushPlus('/answers')">咨询<span>{{answers}}</span></p>
					<p>评价<span>{{grade}}</span></p>
					<p>{{total_score}}</p>
				</div>

				<div class="my-progress">
					<span><i :style="'width:'+ account_info_complete_percent +'%'"></i></span>
					<span>{{account_info_complete_percent}}%</span>
					<span @tap.stop.prevent="$router.pushPlus('/my/info')">编辑名片</span>
				</div>
				<div class="my-apply">
					<div @tap.stop.prevent="toApply(expert_apply_status)">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-zhuanjiabiaoji"></use>
						</svg>
						<p>
							<span v-if="expert_apply_status =='2'">平台认证专家</span>
							<span v-else>申请专家认证</span>
							<span v-if="expert_apply_status =='0'">点击前往认证</span>
							<span v-if="expert_apply_status =='1'">认证处理中</span>
							<span v-if="expert_apply_status =='2'">身份已认证</span>
							<span v-if="expert_apply_status =='3'">失败，重新认证</span>
						</p>

					</div>
					<div @tap.stop.prevent="toApprove(expert_apply_status)">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#icon-qiyezhanghao"></use>
						</svg>
						<p>
							<span v-if="expert_apply_status =='2'">企业账号认证</span>
							<span v-else>申请企业账号</span>
							<span v-if="company_apply_status =='0'">点击前往申请</span>
							<span v-if="company_apply_status =='1'">申请审核中</span>
							<span v-if="company_apply_status =='2'">切换至企业版</span>
							<span v-if="company_apply_status =='3'">失败，重新认证</span>
						</p>

					</div>
				</div>

			</div>

			<ul class="part2">
				<li @tap.stop.prevent="$router.pushPlus('/asks')">
					<span v-html="getNumbers(questions)"></span>
					<span>我的提问</span>
				</li>
				<li @tap.stop.prevent="$router.pushPlus('/answers')">
					<span v-html="getNumbers(answers)"></span>
					<span>我的回答</span>
				</li>
				<li @tap.stop.prevent="$router.pushPlus('/bid')">
					<span v-html="getNumbers(0)"></span>
					<span>我的竞标</span>
				</li>
				<li @tap.stop.prevent="exclusive(expert_apply_status)">
					<span v-html="getNumbers(projects)"></span>
					<span>我的项目</span>
				</li>
				<i class="bott"></i>
			</ul>

			<ul class="my-option">
				<li @tap.stop.prevent="$router.pushPlus('/collect')">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-wodeguanzhu"></use>
					</svg>
					<span>我的关注</span>
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-chakangengduojiantou"></use>
					</svg>
					<i class="bot"></i>
				</li>
				<li @tap.stop.prevent="$router.pushPlus('/feedback')">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-wodefankuijianyi"></use>
					</svg>
					<span>反馈建议</span>
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-chakangengduojiantou"></use>
					</svg>
					<i class="bot"></i>
				</li>
				<li @tap.stop.prevent="$router.pushPlus('/setting')">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-wodeshezhi"></use>
					</svg>
					<span>设置</span>
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-chakangengduojiantou"></use>
					</svg>
					<i class="bot"></i>
				</li>
			</ul>

		</div>


		<div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>

	</div>
</template>
<script>
	import localEvent from '../../stores/localStorage';
	import { createAPI, addAccessToken, postRequest } from '../../utils/request';
	import { NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND, USERS_APPEND } from '../../stores/types';
	import { updateUserInfoCache, getUserInfo } from '../../utils/user';

	export default {
		data() {
			const currentUser = localEvent.getLocalItem('UserInfo');
			const infomation = localEvent.getLocalItem('UserInfoReal');

			return {
				attention: infomation.info.followers,
				advisory: infomation.info.questions,
				grade: infomation.info.feedbacks,
				total_score: infomation.info.total_score,
				expert_apply_status: infomation.info.expert_apply_status,
				company_apply_status: infomation.info.company_status,
				im_tokenMsg: '',
				name: currentUser.name,
				phone: currentUser.phone,
				avatar: currentUser.avatar_url,
				title: currentUser.title,
				company: currentUser.company,
				account_info_complete_percent: currentUser.account_info_complete_percent,
				isExpert: currentUser.is_expert,
				total_money: currentUser.total_money,
				user_level: currentUser.user_level,
				user_credits: currentUser.user_credits,
				user_coins: currentUser.user_coins,
				questions: currentUser.questions,
				answers: currentUser.answers,
				tasks: currentUser.tasks,
				projects: currentUser.projects,
				expert_level: currentUser.expert_level,
				show_my_wallet: currentUser.show_my_wallet,
				show_resume: true,
				my: "",

			}
		},
		methods: {
			//我的项目跳转判断
			exclusive(status){
				switch(status) {
					case 2:
						this.$router.pushPlus('/project/list');
						break;
					default:
						mui.toast("您还不是企业版账号，请点击申请企业账号前往认证");

				}
			},
			//认证专家跳转判断；
			toApprove(status) {
			this.$router.pushPlus('/company/my?back=/my');
//				switch(status) {
//					case 2:
//						this.$router.pushPlus('/company/my?back=/my');
//						break;
//					default:
//						this.$router.pushPlus('/company/submit');
//
//				}

			},
			toApply(status) {
				switch(status) {
					case 0:
						this.$router.pushPlus('/expert/apply');
						break;
					case 1:
						this.$router.pushPlus('/expert/apply/success?type=0');
						break;
					case 3:
						this.$router.pushPlus('/expert/apply');
						break;

				}

			},
			getNumbers: function(number) {
				var html = '';
				number = number.toString();
				for(var i = 0; i < number.length; i++) {
					var num = number[i];
					html += '<svg class="icon a" aria-hidden="true"><use xlink:href="#icon-' + num + '"></use></svg>';
				}
				return html;

			},
			yaoqing() {
				mui.alert('您可以通过贡献值换取邀请码，邀请更多的用户注册并获取更多回报。在此之前请先提升您的平台成长值和等级。');
			},
			shareOut() {
				mui.alert('我们还暂时不建议您分享！');
			},
			integralDemo() {
				//mui.alert('小哈正在帮大家争取福利，请再稍等一阵！');
			},
			getToken() {
				var im_token = JSON.parse(sessionStorage.getItem('im_token'))
				this.im_tokenMsg = im_token;
			},
			share() {
				setTimeout(() => {
					mui('#shareWrapper').popover('toggle');
				}, 150);
			},
			initData() {
				//执行刷新
				console.log('refresh-my');
				this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
					cb(user);
					this.account_info_complete_percent = user.info.account_info_complete_percent;
					this.isExpert = user.info.is_expert;
					this.user_level = user.info.user_level;
					this.user_credits = user.info.user_credits;
					this.user_coins = user.info.user_coins;
					this.questions = user.info.questions;
					this.answers = user.info.answers;
					this.tasks = user.info.tasks;
					this.projects = user.info.projects;
					this.expert_level = user.info.expert_level;
					this.show_my_wallet = user.info.show_my_wallet;

					this.avatar = user.info.avatar_url;
					this.name = user.info.name;
					this.title = user.info.title;
				}));
			}
		},
		created() {
			showInwehubWebview();
		},
		activated: function() {
			this.initData();
		},
		mounted() {
			this.getToken();

		}
	}
</script>

<style lang="less" rel="stylesheet/less" scoped>
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

	.bott {
		position: absolute;
		right: 15px;
		bottom: 0;
		left: 15px;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(220, 220, 220);
	}

	.my-top {
		width: 100%;
		height: 310px;
		padding: 0 13px 0 13px;
		background-color: #ffffff;
	}

	.professor {
		width: 100%;
		height: 100px;
	}

	.professor .avatar {
		width: 69px;
		height: 68.5px;
		border-radius: 50%;
		margin-top: 30.5px;
		float: left;
	}

	.my-personal {
		width: 71%;
		height: 69px;
		margin: 30.5px 0 0 6px;
		padding-right: 4px;
		float: left;
		position: absolute;
		right: 8px;
	}

	.my-personal .my-info {
		width: 100%;
		height: 30px;
		margin-bottom: 9px;
		position: relative;
	}

	.my-personal .my-info span:nth-of-type(1) {
		font-size: 18px;
		font-weight: 600;
		color: #444444;
		margin-right: 1.5px;
	}

	.my-personal .my-info p:nth-of-type(1) {
		width: 19px;
		height: 18px;
		display: inline-block;
		position: relative;
		top: -3px;
		font-style: normal;
		line-height: 15px;
		font-size: 10px;
		color:#FFFFFF;
		text-align: center;
		background:url("../../statics/images/rank.png") no-repeat;
		background-size: 19px 19px;
		background-position:top;


	}

	.my-personal .my-info svg:nth-of-type(1) {
		font-size: 26px;
		margin-bottom: -4px;
		margin-left: -3px;
		color: rgb(3, 174, 249);
		position: relative;
	}

	.my-personal .my-info p:nth-of-type(2) {
		display: inline-block;
		position: relative;
		float: right;
	}

	.my-personal .my-info p:nth-of-type(2) svg {
		font-size: 18px;
		color: rgb(3, 174, 249);
		margin-bottom: -3px;
	}

	.my-personal .my-info p:nth-of-type(2) span {
		font-size: 13px;
		text-align: center;
		font-weight: normal;
		float: right;
		color: #808080;
		margin-left: 5px;
	}

	.my-personal .my-detail {
		width: 100%;
		height: 30px;
	}

	.my-detail span:nth-of-type(1),
	span:nth-of-type(3) {
		font-size: 14px;
		color: #808080;
	}

	.my-detail span:nth-of-type(3) {
		margin-left: 3px;
	}

	.my-detail span:nth-of-type(2),
	span:nth-of-type(4) {
		font-size: 14px;
		color: #fa4975;
	}

	.my-news {
		width: 100%;
		height: 36px;
		border-radius: 4px;
		background: #ffffff;
		margin-top: 32px;
		padding-top: 10px;
		-webkit-box-shadow: 0 0 10px rgb(243, 244, 246);
		-moz-box-shadow: 0 0 10px rgb(243, 244, 246);
		box-shadow: 0 0 10px rgb(243, 244, 246);
	}

	.my-news p {
		display: inherit;
		float: left;
		width: 18%;
		height: 16px;
		font-size: 14px;
		color: #808080;
		text-align: center;
		border-right: 1px solid #c8c8c8;
	}

	.my-news p:last-child {
		border-right: none;
		width: 30%;
		margin-left: 8px;
	}

	.my-news p span {
		color: #fa4975;
	}

	.my-news p:nth-of-type(3) span {
		color: rgb(68, 68, 68);
	}

	.my-progress {
		width: 100%;
		margin-top: 20px;
	}

	.my-progress span:nth-of-type(1) {
		display: inline-block;
		width: 70%;
		height: 12px;
		border-radius: 50px;
		overflow: hidden;
		border: 0.5px solid rgb(3, 174, 249);
		margin-bottom: -2px;
	}

	.my-progress span:nth-of-type(1) i {
		display: inline-block;
		font-style: normal;
		margin-bottom: 8px;
		width: 100px;
		height: 12px;
		background: rgb(3, 174, 249);
	}

	.my-progress span:nth-of-type(2) {
		font-size: 12px;
		color: #808080;
		margin-right: 1px;
	}

	.my-progress span:nth-of-type(3) {
		font-size: 13px;
		color: rgb(3, 174, 249);
		float: right;
		margin-top: 2px;
	}

	.my-apply {
		margin-top: 20px;
		width: 100%;
		height: 61px;
	}

	.my-apply div {
		display: inline-block;
		width: 49%;
		height: 61px;
		border-radius: 4px;
		background-color: #ececee;
	}

	.my-apply div svg {
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 4px;
		font-size: 40px;
		color: rgb(3, 174, 249);
		float: left;
	}

	.my-apply div:nth-of-type(2) svg {
		margin-top: 13px;
		margin-left: 10px;
		margin-right: 8px;
		font-size: 32px;
		color: rgb(3, 174, 249);
		float: left;
	}

	.my-apply div p {
		margin-top: 10px;
	}

	.my-apply div p span {
		display: block;
	}

	.my-apply div p span:nth-of-type(1) {
		font-size: 14px;
		color: #444444;
	}

	.my-apply div p span:nth-of-type(2) {
		font-size: 13px;
		color: #808080;
	}

	.part2 {
		padding: 0;
		margin: 0;
		list-style: none;
		width: 100%;
		height: 70px;
		padding-left: 15px;
		padding-right: 15px;
		background: #FFFFFF;
		margin-top: 10px;
		position: relative;
	}

	.part2 li {
		display: inline-block;
		width: 23%;
		height: 70px;
		text-align: center;
	}

	.part2 li span:nth-of-type(1) {
		padding: 0;
		margin: 0;
		display: block;
		margin-top: 13px;
		margin-bottom: 3px;
		font-size: 13px;
		color: #444444;
	}

	.part2 li span:nth-of-type(2) {
		padding: 0;
		margin: 0;
		font-size: 12px;
		color: #808080;
		display: block;
	}

	.my-option {
		width: 100%;
		height: 130px;
		background: #FFFFFF;
		padding: 0;
		margin: 0;
		list-style: none;
		padding-left: 16px;
		padding-right: 16px;
	}

	.my-option li {
		width: 100%;
		height: 44px;
		padding-top: 12px;
		padding-bottom: 12px;
		position: relative;
	}

	.my-option li span {
		margin-left: 10px;
		font-size: 14px;
		color: #444444;
	}

	.my-option li svg:nth-of-type(1) {
		font-size: 22px;
		margin-bottom: -4px;
	}

	.my-option li svg:nth-of-type(2) {
		float: right;
	}
</style>
