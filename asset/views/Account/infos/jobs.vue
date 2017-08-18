<template>
	<div>

		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">工作经历</h1>
		</header>

		<div class="mui-content" v-show="!loading" id="container">

			<div class="container" v-show="jobs.length == 0">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#icon-zanwushuju"></use>
				</svg>
				<p>暂时还没有数据呀～</p>
			</div>

			<ul class="mui-table-view mui-table-view-chevron" id="OA_task_1">
				<li v-for="(job,index) in jobs" class="intro  mui-table-view-cell">

					<div class="mui-slider-right mui-disabled" id="roof" @tap.stop.prevent="deleteItem(job.id, index)">
						<a class="mui-btn mui-btn-red " style="background: #fa4975">删除</a>
					</div>
					<div class="mui-slider-handle  slider">
						<p> {{ job.company }}</p>
						<p>

							<span>{{ job.begin_time }} 至 {{ job.end_time }}</span>
							<i></i>
							<span>{{ job.title }}</span>
						</p>
					</div>
					<svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/my/info/job/' + job.id)">
						<use xlink:href="#icon-xiugai"></use>
					</svg>
				</li>
			</ul>

			<div class="add box-shadow-3" @tap.stop.prevent="$router.pushPlus('/my/info/job/0')">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#icon-shuru"></use>
				</svg>
			</div>

		</div>

		<div id="statusBarStyle" background="#ffffff" mode="light"></div>
	</div>
</template>

<script>
	import { NOTICE } from '../../../stores/types';
	import { createAPI, addAccessToken, postRequest } from '../../../utils/request';
	import localEvent from '../../../stores/localStorage';
	import ACCOUNT_API from '../../../api/account';
	import dPickerComponent from '../../../components/picker/date-picker.vue';
	import popPickerComponent from '../../../components/picker/poppicker.vue';

	export default {
		data: () => ({
			jobs: [],
			loading: true
		}),
		methods: {
			initData() {
				postRequest(`account/job/list`, {}).then(response => {

					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						return;
					}

					this.jobs = response.data.data;

					var newJobs = [];
					for(var i in this.jobs) {
						var info = this.jobs[i];
						var id = info.id;
						newJobs[id] = info;
					}
					localEvent.setLocalItem('jobs', newJobs);

					this.loading = false;
				});
			},
			deleteItem(id, index) {
				var btnArray = ['否', '是'];
				mui.confirm('确认要删除？', '删除', btnArray, e => {
					if(e.index == 1) {
						var url = ACCOUNT_API.DELETE_ACCOUNT_JOB;
						postRequest(url, {
							id: id
						}).then(response => {
							mui.toast('删除成功');
							this.jobs.splice(index, 1);
						});
					}
				});
			}
		},
		mounted() {
			window.addEventListener('refreshData', (e) => {
				//执行刷新
				console.log('refresh-jobs');
				this.initData();
			});
		},

		computed: {

		},
		created() {
			//showInwehubWebview();
			this.initData();
		}
	}
</script>

<style scoped>
	#container {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}

	.intro {
		width: 100%;
		height: 60px;
		position: relative;
	}

	.intro .slider {
		width: 100%;
		height: 60px;
	}

	.intro .slider p:nth-of-type(1) {
		font-family: "PingFangSC";
		font-size: 14px;
		color: #444444;
	}

	.intro .slider p:nth-of-type(2) span {
		font-family: "PingFangSC";
		font-size: 13px;
		color: #808080;
	}

	.intro .slider p:nth-of-type(2) i {
		display: inline-block;
		width: 1px;
		height: 11px;
		margin: 0 3px -1px 3px;
		background: rgb(220, 220, 220);
	}

	.intro svg {
		position: absolute;
		font-size: 18px;
		color: rgb(3, 174, 249);
		top: 13px;
		right: 15px;
	}

	.add {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: rgb(3, 174, 249);
		position: absolute;
		left: 41%;
		bottom: 21px;
		text-align: center;
		line-height: 64px;
	}

	.add svg {
		font-size: 22px;
		color: #FFFFFF;
	}

	#roof {
		z-index: 999;
	}

	.mui-table-view:after {
		position: absolute;
		right: 15px;
		bottom: 0;
		left: 15px;
		height: 1px;
		content: '';
		background: #f2f2f2;
	}

	.mui-table-view-cell:after {
		position: absolute;
		right: 15px;
		bottom: 0;
		left: 15px;
		height: 1px;
		content: '';
		background: #f2f2f2;
	}

	.box-shadow-3 {
		-webkit-box-shadow: 0 0 5px rgba(3, 174, 249, .8);
		-moz-box-shadow: 0 0 5px rgba(3, 174, 249, .8);
		box-shadow: 0 0 5px rgba(3, 174, 249, .8);
	}

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
		font-family: "PingFangSC";
		font-size: 12px;
		color: #c8c8c8;
	}
</style>
