<template>

	<div>
		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">问答社区</h1>
		</header>
		

		<div class="mui-content absolute">
			<!--导航栏-->
			<div class="menu">
				<span @tap.stop.prevent="">专业回答</span>
				<span @tap.stop.prevent="$router.replace('/home/RewardList')">悬赏提问</span>
				<i class="bot"></i>
			</div>
			<div id="pullrefresh" :class="{'mui-content':false, 'mui-scroll-wrapper':true, 'task-list':true}">
				<div class="container" >
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-zanwushuju"></use>
					</svg>
					<p>暂时还没有数据呀～</p>
				</div>
				<!--v-if="nothing == 1"  v-show="nothing == 0"-->
				
				
				<div class="mui-scroll"  >
				<!---->
				  <ul>
				     <li>
				     	<div class="">
				     		
				     	</div>
				     	<div class="">
				     		
				     	</div>
				     	<div class="">
				     		
				     	</div>
				     </li>
				  </ul>
				<!---->
				</div>
			</div>
		</div>

		<!-- <div id="statusBarStyle" background="#fff"   bgColor="#fff" mode="dark"></div>-->
	</div>
</template>

<script>
import { createAPI, addAccessToken, postRequest } from '../../utils/request';
import userAbility from '../../utils/userAbility';
	const Discount = {
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
			skip(id){
				 userAbility.applyActivity(this,id);
			},
			//下拉刷新;
			pulldownRefresh() {
				setTimeout(() => {
					this.getPrevList();
				}, 1000);
			},
			goUrl(url) {
			    if (/resume/.test(url)) {
			        this.$router.pushPlus(url + '&goback=1');
          } else {
            this.$router.pushPlus(url);
          }
      },
			//下拉刷新请求的数据；
			getPrevList() {
				postRequest(`activity/list`, {activity_type:1,is_mine:1}).then(response => {
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
					activity_type:1,
					is_mine:1,
					page:this.page
				}).then(response => {
					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						mui.back();
					}
   
                    
					if(response.data.data.data) {
					   this.list =  this.list.concat(response.data.data.data)
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
	export default Discount;
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
		right:0;
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
	.mui-content.absolute .menu ~ #pullrefresh {
    top: 45px;
  }
  .mui-content.absolute{
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
	
	.menu span:nth-of-type(1) {
		color: #3c95f9;
	}
	
	.menu i {
		display: block;
		position: absolute;
		width: 55px;
		height: 1.8px;
		left: 17%;
		bottom: 0.5px;
		background: #03aef9;
	}
	/*滚动区域*/
	  
</style>