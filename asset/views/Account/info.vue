<template>
	<div>
		<header class="mui-bar mui-bar-dark mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">我的名片</h1>
			<!--<a class="mui-icon myicon myicon-share mui-pull-right"></a>-->
		</header>

		<div class="mui-content" v-show="!loading">

			<div class="info-professor">
				<div class="info-look" @tap.stop.prevent="$router.pushPlus('/my/resume')">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-gongkai"></use>
					</svg>
					<span>预览</span>
				</div>
				<p @tap.stop.prevent="uploadAvatar()">
					<img :src="user.info.avatar_url" class="avatar" />
					<span>
     		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-xiangji"></use>
			</svg>
			</span>
				</p>
				<p>
					<span>{{ user.info.name }}</span>
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-zhuanjiabiaoji"></use>
					</svg>
				</p>
				<p>
					<span>{{ user.info.company }}</span>
					<i></i>
					<span>{{ user.info.title }}</span>
				</p>
				<p>
					{{ user.info.mobile }}
				</p>
				<p>
					{{ user.info.email }}
				</p>
			</div>
			<p class="info-progresbar">
				<span class="info-progress"><i :style="'width:'+ user.info.account_info_complete_percent +'%'"></i></span>
				<span class="info-text">{{ user.info.account_info_complete_percent }}%</span>
				<svg class="icon" aria-hidden="true" id='confirmBtn' @tap.stop.prevent="wran()">
				    <use xlink:href="#icon-jinggao"></use>
				</svg>
			   <!--<span @tap.stop.prevent="$router.pushPlus('/my/info')">编辑名片</span>-->
			</p>
			<div class="part3">
				<ul class="mui-table-view mui-table-view-chevron firstItem">
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/basic')">基本资料
							<span class="desc important">{{ user.infos }}</span>
						</a>

					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/jobs')">工作经历

						</a>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/projects')">项目经历

						</a>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/edus')">教育经历

						</a>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/trains')">培训认证

						</a>
					</li>
					<li class="mui-table-view-cell">
						<a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/privacy')"><span class="mui-icon myicon myicon-help"></span>隐私设置

						</a>
					</li>
				</ul>
			</div>

			<div class="paizhao">
				填写嫌麻烦，可发送简历到
				<a class="mailLink" href="mailto:hi@inwehub.com?subject=简历维护：用户姓名+注册手机号码" style="color: rgb( 3,174,249);">hi@inwehub.com</a> ,小哈帮您维护！
			</div>

			<uploadHeader ref="uploadHeader"></uploadHeader>

		</div>
		<div id="statusBarStyle" background="#ffffff" mode="light"></div>
	</div>
</template>

<script>
	import { NOTICE, USERS_APPEND } from '../../stores/types';
	import { apiRequest } from '../../utils/request';
	import localEvent from '../../stores/localStorage';
	import ACCOUNT_API from '../../api/account';
	import { updateUserInfoCache, getUserInfo } from '../../utils/user';
	import uploadHeader from '../../components/uploadHeader.vue';

	export default {
		data: () => ({
			user: {
				info: {
					name: '',
					gender: '',
					company: '',
					title: '',
					province: '',
					city: '',
					hometown_city: '',
					hometown_province: '',
					account_info_complete_percent: 0,
					address_detail: '',
					email: '',
					birthday: '',
					description: '',
					industry_tags: [],
				},
			},
			loading: true,
			loading_gif: loading_gif,
			
		}),
		created() {
			showInwehubWebview();
			this.getUserInfo();
		},
		components: {
			uploadHeader
		},
		mounted() {
			window.addEventListener('refreshData', (e) => {
				//执行刷新
				console.log('refresh-info');
				this.getUserInfo();
			});
		},
		methods: {
		//警告框
	wran(){
		var font = '<p style="text-align: left; color: #444444; margin-bottom:20px">'+'为保证每位用户信息都真实有效，请务必如实填写。如发现不实，首次将给予警告，第二次将永久封号。'+'</p>'+
		           '<p style="text-align: left; color: #444444;">'+'平台对所有个人信息绝对保密，不会提供给任何第三方。'+'</p>';
		var title='<p style="font-size:16px; margin-bottom:15px">'
		           +'<svg class="icon" aria-hidden="true" style="font-size:18px; color:#fcc816; margin-right:2px; margin-bottom:-1px">'
		           +'<use xlink:href="#icon-jinggao"></use>'
	               +'</svg>'
		           +'警告说明 '
		           +'</p>';
		
             var btnArray = ['取消', '确认'];
             mui.confirm(font, title,function() {}, 'div');
			},
			warning: function() {
				mui.confirm("<div style='text-align: left'>InweHub是一个真实诚信的社区，每一位用户的信息都真实有效，我们保证对平台所有个人信息绝对保密，绝不会提供给任何第三方，平台中个人信息的开放范围完全取决于用户个性的设置，默认值为不开放。\n【注意】您填写个人信息时务必真实，如发现虚假信息，第一次将给予警告，第二次发现将永久封号。</div>", '警告说明', ['我已了解', '继续补充'], function() {}, 'div');
			},
			uploadAvatar: function() {
				this.$refs.uploadHeader.uploadAvatar();
			},
			getUserInfo() {

				this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
					cb(user);

					var newJobs = [];
					for(var i in user.jobs) {
						var info = user.jobs[i];
						var id = info.id;
						newJobs[id] = info;
					}
					localEvent.setLocalItem('jobs', newJobs);

					var newProjects = [];
					for(var i in user.projects) {
						var info = user.projects[i];
						var id = info.id;
						newProjects[id] = info;
					}
					localEvent.setLocalItem('projects', newProjects);

					var newEdus = [];
					for(var i in user.edus) {
						var info = user.edus[i];
						var id = info.id;
						newEdus[id] = info;
					}
					localEvent.setLocalItem('edus', newEdus);

					var newTrains = [];
					for(var i in user.trains) {
						var info = user.trains[i];
						var id = info.id;
						newTrains[id] = info;
					}
					localEvent.setLocalItem('trains', newTrains);

					this.work_city = user.info.province.name + ' ' + user.info.city.name;
					this.home_city = user.info.hometown_province.name + ' ' + user.info.hometown_city.name;

   					this.user = user;
   				
   					console.log(user);
					this.loading = 0;

				}));
			}
		}
	}
</script>
<style scoped>
	.mui-bar .myicon {
		width: 16px;
		height: 16px;
		right: 8px;
		top: 8px;
	}
	
	p,
	span {
		margin: 0;
		padding: 0;
	}
	
	.info-professor {
		width: 100%;
		padding: 20px 15px 0px 16px;
		background: #F3F4F6;
		text-align: center;
		position: relative;
	}
	
	.info-look {
		position: absolute;
		top: 20px;
		right: 15px;
	}
	
	.info-look svg {
		font-size: 24px;
		color: rgb(3, 174, 249);
		margin-bottom: -2px;
	}
	
	.info-look span {
		
		font-size: 14px;
		color: #444444;
	}
	
	.info-professor p:nth-of-type(1) img {
		width: 69px;
		height: 69px;
		border-radius: 50%;
	}
	
	.info-professor p:nth-of-type(1) span {
		display: inline-block;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #FFFFFF;
		margin-left: -18px;
		margin-bottom: 6px;
		position: relative;
	}
	
	.info-professor p:nth-of-type(1) span svg {
		font-size: 25px;
		color: #808080;
		position: absolute;
		left: -4px;
		top: -3px;
	}
	
	.info-professor p:nth-of-type(2) {
		margin-top: 6px;
	}
	
	.info-professor p:nth-of-type(2) span {
		
		font-size: 16px;
		font-weight: 600;
		color: #444444;
	}
	
	.info-professor p:nth-of-type(2) svg {
		font-size: 20px;
		color: rgb(3, 174, 249);
		margin-bottom: -2px;
	}
	
	.info-professor p:nth-of-type(3) {
		margin-top: 7px;
	}
	
	.info-professor p:nth-of-type(3) span {
		
		font-size: 13px;
		color: #444444;
	}
	
	.info-professor p:nth-of-type(3) i {
		display: inline-block;
		width: 1px;
		height: 13px;
		background: #c8c8c8;
		margin: 0 3px -2px 3px;
	}
	
	.info-professor p:nth-of-type(4) {
		margin-top: 7px;
	}
	
	.info-professor p:nth-of-type(5) {
		margin-top: 6px;
	}
	
	.info-professor p:nth-of-type(4),
	.info-professor p:nth-of-type(5) {
		
		font-size: 14px;
		color: #444444;
	}
	
	.info-progresbar {
		width: 100%;
		height: 50px;
		padding: 10px 17px 0 16px;
		background: #F3F4F6;
		
	}
	.info-progresbar svg{
	  float: right;
      font-size: 15px;
      color: #fcc816; 
      margin-left: 0px;
      margin-top: 4px;
      
    }
    
   
	
	.info-progresbar .info-progress {
		display: inline-block;
		width: 80%;
		height: 12px;
		border-radius: 50px;
		overflow: hidden;
		border: 0.5px solid rgb(3, 174, 249);
		margin-bottom: -2px;
	}
	
	.info-progresbar .info-progress>i {
		display: inline-block;
		font-style: normal;
		margin-bottom: 8px;
		margin-left: -14px;
		height: 12px;
		background: rgb(3, 174, 249);
	}
	
	.info-progresbar .info-text {
		font-size: 12px;
		color: #808080;
	}
	
	.paizhao {
		width: 100%;
		height: 100px;
		background: #FFFFFF;
		padding: 19px 12px 0 12px;
		
		font-size: 12px;
		color: rgb(128, 128, 128);
	}
	
	.part3 .desc {
		margin-left: 40px;
		font-size: 12px;
	}
	
	.part3 .important {
		color: #F6A623;
	}
	
	.info-choose {
		width: 100%;
		height: 95px;
		background: #FFFFFF;
		position: absolute;
		bottom: 0;
		padding-top: 13px;
		padding-left: 39px;
		z-index: 999;
		display: none;
	}
	
	.info-choose p {
		width: 45px;
		height: 71px;
		float: left;
	}
	
	.info-choose p:nth-of-type(2) {
		margin-left: 36px;
	}
	
	.info-choose p svg {
		font-size: 48px;
		color: rgb(220, 220, 220);
	}
	
	.info-choose p span {
		display: block;
		margin-left: 10px;
		margin-top: 2px;
		color: #808080;
		font-size: 13px;
	}
	
	#mui-popover-action {
		background: #FFFFFF;
	}
	.mui-table-view:after {
    position: absolute;
    right: 16px;
    bottom: 0;
    left: 14px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #F2F2F2;
}
.mui-table-view-cell:after {
    position: absolute;
    right: 16px;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    }

   .mui-table-view:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #fff;
}
	@media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
		.part2 .progressBar {
			width: 160px !important;
		}
	}
	
	@media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
		.part2 .progressBar {
			width: 160px !important;
		}
	}
</style>