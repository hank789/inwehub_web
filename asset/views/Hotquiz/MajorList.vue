<template>

	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">问答社区</h1>
		</header>

		<div class="mui-content absolute">
			<div class="container">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#icon-zanwushuju"></use>
				</svg>
				<p>暂时还没有数据呀～</p>
			</div>
			<!--v-if="nothing == 1"  v-show="nothing == 0"-->
			<div>
				<!--热门问答 -->
				<div class="hotquiz">
					<div class="quiz">
						<p>
							<span>热门问答</span>
							<button @tap.stop.prevent="$router.pushPlus('/ask')">提问</button>
							<i class="bot"></i>
						</p>
					</div>
					<ul class="hotAnswer_b">
						<li v-for="(hot, index) in majorHot">
							<p class="mui-ellipsis-2">{{hot.description}}</p>
							<div class="hotAnswer_d">
								<p>
									<img :src="hot.answer_user_avatar_url" />
									<svg class="icon" aria-hidden="true" v-if="hot.answer_user_is_expert == 1">
										<use xlink:href="#icon-zhuanjiabiaojishixin"></use>
									</svg>
								</p>
								<p class="mui-ellipsis" v-if="hot.hide == 1">回答者：{{hot.answer_username}}</p>
								<p class="mui-ellipsis" v-if="hot.hide == 0">回答者:匿名</p>
								<p class="mui-ellipsis">{{hot.answer_user_title}}</p>
								<p class="mui-ellipsis">{{hot.answer_user_company}}</p>
							</div>
							<i class="bot"></i>
						</li>

					</ul>
				</div>
				<!--推荐问答-->
				<div class="recommendlist">
					<div class="recommend">
						<p>
							<span>推荐问答</span>
							<span>
            	   	  	
            	   	  	<a @tap.stop.prevent="selectType()">{{ type ? type.split(':')[0] : '全部'}}</a>
            	   	  	<svg class="icon" aria-hidden="true">
					  <use xlink:href="#icon-fenleichakan"></use>
					</svg>
					<i></i>
            	   	  </span>
							<i class="bot"></i>
						</p>
					</div>
					<!---->
					<ul class="recommend_b mui-content" id="pullrefresh">
						<div class="mui-scroll-wrapper">
							<div class="mui-scroll">
								<li v-for="(list, index) in majorlist">
									<p class="mui-ellipsis-2">{{list.description}}</p>
									<div class="recommend_d">
										<p>
											<img :src="list.answer_user_avatar_url" />
											<svg class="icon" aria-hidden="true" v-if="list.answer_user_is_expert == 1">
												<use xlink:href="#icon-zhuanjiabiaojishixin"></use>
											</svg>
										</p>
										<p class="mui-ellipsis" v-if="list.hide == 1">回答者：{{hot.answer_username}}</p>
										<p class="mui-ellipsis" v-if="list.hide == 0">回答者:匿名</p>
										<p class="mui-ellipsis">{{list.answer_user_title}}</p>
										<p class="mui-ellipsis">{{list.answer_user_company}}</p>
									</div>
									<i class="bot"></i>
								</li>
							</div>
						</div>
					</ul>

				</div>
				<!---->
			</div>
		</div>

	</div>
</template>

<script>
	import { createAPI, addAccessToken, postRequest } from '../../utils/request';
	import userAbility from '../../utils/userAbility';
	const MajorList = {
		data: () => ({
			majorHot: [],
			majorlist: [],
			loading: true,

		}),
		computed: {
			//获取请求数据最后一个数据的id；
			bottomId() {
				var length = this.majorlist.length;
				if(length) {
					return this.majorlist[length - 1].id;
				}
				return 0;
			},
			type() {
				return this.$store.state.askType.selected ? this.$store.state.askType.selected : '';
			}

			},
			methods: {				
			
			selectType(type_text) {
				this.$router.push('/ask/type');
			},
					//热门回答的列表；			
			getData() {
				postRequest(`question/majorHot`, {}).then(response => {
					var code = response.data.code;
					//如果请求不成功提示信息 并且返回上一页；
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}
					//请求成功的操作
					if(response.data.data) {
						this.majorHot = response.data.data;
					}
					//没有数据的显示框不显示；
					this.loading = 0;
				});
			},
			getPrevList() {
				postRequest(`question/majorList`, {}).then(response => {
					var code = response.data.code;
					//如果请求不成功提示信息 并且返回上一页；
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}
					console.log(response.data.data)
					//请求成功的操作
					if(response.data.data) {
						this.majorlist = response.data.data;
					}
					//没有数据的显示框不显示；
					this.loading = 0;
				});
			},
			pullupRefresh() {
				setTimeout(() => {
					this.getNextList();
				}, 1000);
			},
			getNextList() {
				postRequest(`question/majorList`, {
					bottom_id: this.bottomId,
					tag_id:this.type.split(':')[1]
				}).then(response => {
					console.log(1111);
					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}

					if(response.data.data.length > 0) {
						this.majorlist = this.majorlist.concat(response.data.data);
					}
					this.loading = 0;

					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);

				});
			}

		},
		mounted() {
			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					up: {
						contentrefresh: '正在加载...',
						contentnomore: '没有更多了',
						callback: this.pullupRefresh
					}
				}
			})
			this.getData();
			this.getPrevList();
			console.log(this.type.split(':')[1]);

		},
	}
	export default MajorList;
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
	/*提问样式*/
	
	.hotquiz {
		width: 100%;
		overflow: hidden;
		background: #FFFFFF;
	}
	
	.quiz {
		width: 92%;
		height: 44px;
		margin-left: 4%;
		background: #FFFFFF;
		position: relative;
	}
	
	.quiz span {
		display: block;
		font-size: 16px;
		color: #444444;
		line-height: 44px;
		float: left;
	}
	
	.quiz button {
		width: 65px;
		height: 29px;
		font-size: 14px;
		color: #FFFFFF;
		background: #03aef9;
		float: right;
		margin-top: 7px;
	}
	/*问答列表*/
	
	.hotAnswer_b {
		width: 100%;
		background: #FFFFFF;
		overflow: hidden;
	}
	
	.hotAnswer_b li {
		width: 92%;
		margin-left: 4%;
		height: 88px;
		position: relative;
	}
	
	.hotAnswer_b li>p {
		margin-top: 12px;
		font-size: 14px;
		color: #444444;
	}
	
	.hotAnswer_d {
		width: 100%;
		height: 32px;
		margin-top: 4.5px;
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
	/*推荐问答*/
	
	.recommendlist {
		width: 100%;
		overflow: hidden;
		background: #FFFFFF;
		margin-top: 10px;
	}
	
	.recommend {
		width: 92%;
		height: 44px;
		margin-left: 4%;
		background: #FFFFFF;
		position: relative;
	}
	
	.recommend span:nth-of-type(1) {
		display: block;
		font-size: 16px;
		color: #444444;
		line-height: 44px;
		float: left;
	}
	
	.recommend span:nth-of-type(2) {
		display: block;
		width: 70%;
		height: 44px;
		float: right;
		/*background: #CCCCCC;*/
	}
	
	.recommend span:nth-of-type(2) i {
		float: right;
		display: block;
		width: 1px;
		height: 13px;
		background: #dbdbdb;
		margin-top: 14px;
		margin-right: 15px;
	}
	
	.recommend span:nth-of-type(2) svg {
		float: right;
		display: block;
		font-size: 16px;
		margin-top: 14px;
		margin-right: 3px;
		color: #03aef9;
	}
	
	.recommend span:nth-of-type(2) a {
		float: right;
		display: block;
		height: 44px;
		line-height: 44px;
		color: #03aef9;
	}
	/*问答列表*/
	
	.recommend_b {
		width: 100%;
		background: #FFFFFF;
		overflow: hidden;
	}
	
	.recommend_b li {
		width: 92%;
		margin-left: 4%;
		height: 88px;
		position: relative;
	}
	
	.recommend_b li>p {
		margin-top: 12px;
		font-size: 14px;
		color: #444444;
	}
	
	.recommend_d {
		width: 100%;
		height: 32px;
		margin-top: 4.5px;
	}
	
	.recommend_d p {
		float: left;
	}
	
	.recommend_d p:nth-child(1) {
		width: 9.5%;
		height: 32px;
		/*background: #CCCCCC;*/
		position: relative;
	}
	
	.recommend_d p:nth-child(1)>svg {
		position: absolute;
		font-size: 14px;
		bottom: 0;
		right: -4px;
	}
	
	.recommend_d p:nth-child(1)>img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	
	.recommend_d p:nth-child(2) {
		width: 32%;
		height: 15px;
		margin-top: 8.5px;
		font-size: 13px;
		color: #808080;
		border-right: 1px solid #c8c8c8;
		text-align: center;
		line-height: 15px;
	}
	
	.recommend_d p:nth-child(3) {
		width: 21%;
		height: 15px;
		margin-top: 8.5px;
		font-size: 13px;
		color: #808080;
		border-right: 1px solid #c8c8c8;
		text-align: center;
		line-height: 15px;
	}
	
	.recommend_d p:nth-child(4) {
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
		display: none;
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
	/*滚动区域*/
	
	.mui-scroll-wrapper {
		position: relative;
		z-index: 2;
		top: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		width: 100%;
	}
	
	.mui-scroll {
		position: relative;
		z-index: 1;
		width: 100%;
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
	}
</style>