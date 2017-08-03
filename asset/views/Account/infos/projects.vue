<template>
	<div>

		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">项目经历</h1>
		</header>

		<div class="mui-content" v-show="!loading" id="container">
			<ul class="mui-table-view mui-table-view-chevron" v-show="projects.length == 0">
				<li class="mui-table-view-cell no-empty">请维护项目经历</li>
			</ul>

			<ul class="mui-table-view mui-table-view-chevron">
				<li v-for="project in projects" class="mui-table-view-cell intro">
					<p> {{ project.project_name }}</p>
					<p>

						<span>{{ project.begin_time }} 至 {{ project.end_time }}</span>
						<i></i>
						<span>{{ project.title }}</span>
					</p>
					<svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/my/info/project/'+project.id)">
						<use xlink:href="#icon-xiugai"></use>
					</svg>
				</li>
			</ul>

			<div class="add" @tap.stop.prevent="$router.pushPlus('/my/info/project/0')">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#icon-shuru"></use>
				</svg>
			</div>

		</div>
		
		<div id="statusBarStyle" background="#fff" mode="light"></div>
		
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
			projects: [],
			loading: true
		}),
		methods: {
			initData() {
				postRequest(`account/project/list`, {}).then(response => {

					var code = response.data.code;
					if(code !== 1000) {
						mui.alert(response.data.message);
						return;
					}

					this.projects = response.data.data;
					this.loading = false;

					var newProjects = [];
					for(var i in this.projects) {
						var info = this.projects[i];
						var id = info.id;
						newProjects[id] = info;
					}
					localEvent.setLocalItem('projects', newProjects);
				});
			}
		},
		mounted() {
			window.addEventListener('refreshData', (e) => {
				//执行刷新
				console.log('refresh-projects');
				this.initData();
			});
		},

		computed: {

		},

		created() {
			showInwehubWebview();
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
	
	.intro p:nth-of-type(1) {
		font-family: "PingFangSC";
		font-size: 14px;
		color: #444444;
	}
	
	.intro p:nth-of-type(2) span {
		font-family: "PingFangSC";
		font-size: 13px;
		color: #808080;
	}
	
	.intro p:nth-of-type(2) i {
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
		right: 17px;
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
</style>