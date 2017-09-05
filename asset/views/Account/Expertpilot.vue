<template>
	<div>
		<header>
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<div>
				<p>
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-zhuanjiabiaoji"></use>
					</svg>
					<span>认证专家</span>
				</p>
				<p>发挥你的个人价值 </p>
			</div>
		</header>
		<div class="mui-content content">
			<ul class="why">
				<p><span>为什么</span>要成为平台认证专家？</p>
				<li><i></i><span>全面开启平台功能，发挥个人价值</span></li>
				<li><i></i><span>参与对接企业资源，直接服务企业</span></li>
				<li><i></i><span>树立打造个人品牌，建立商业模式</span></li>
			</ul>

			<ul class="when">
				<p><span>如何</span>才能成为平台认证专家？</p>
				<li><i></i><span>您在自己擅长行业领域有10年以上积累</span></li>
				<li><i></i><span>您的个人信息补充完整，建议在96%以上</span></li>
				<li><i></i><span>提交专家认证申请，等待平台核实</span></li>
			</ul>
		</div>

		<div class="contact">
			<p>如有疑问请联系</p>
			<p>邮箱：hi@inwehub.com/微信：hiinwe</p>
		</div>

		<div class="home-apply" @tap.stop.prevent = ApplicationJudge()>立刻申请</div>
	</div>
</template>

<script>
	//@tap.stop.prevent="$router.replace('/expert/apply')"
	import {getLocalUserInfo, getUserInfo } from '../../utils/user';
	import { USERS_APPEND } from '../../stores/types';

     var userInfo = getLocalUserInfo();
	export default {
		data() {
			return {
        loading:1,
				percent:userInfo.account_info_complete_percent,
        expert_apply_status:0,
			   }
		   },
		   methods: {
		   	 //判断资料的完善程度；
		   	ApplicationJudge(){
		   	  if(this.percent < 96){
		   	  	console.log ('申请专家认证需要保证个人资料完整度在96%以上，请前往进行维护。')
		   	  	var font = '<p style= "text-align:left">' + '申请专家认证需要保证个人资料完整度在96%以上，请前往进行维护。' + '</p>' ;
				var title = '<p style="font-size:16px; margin-bottom:15px">' +'温馨提示 ' +'</p>';
				var btnArray = ['取消', '确认'];
				var  that = this;
				mui.confirm(font, title, function(e) {
					 if (e.index == 1) {
                        that.$router.replace('/my/info');
                     } else {

                    }
				}, 'div');


		   	  }else{
		   	  	this.$router.replace('/expert/apply');
		   	  }

		   	},
		   	initData() {
				//执行刷新
				console.log('refresh-my');
				this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
					cb(user);
					this.percent = user.info.account_info_complete_percent;
          this.expert_apply_status  = user.info.expert_apply_status;

          switch(parseInt(this.expert_apply_status)) {
            case 0:
            case 3:
              this.loading = 0;
              break;
            case 2:
              mui.toast('您已经是专家');
              mui.back();
              break;
            case 1:
              mui.toast('认证审核中');
              mui.back();
              break;
          }


				}));
			}


		   },
		    mounted() {
		       console.log(userInfo.account_info_complete_percent);
		    },
			activated: function() {
				console.log('activated');
				this.initData();
			}
	      }
</script>

<style scoped="scoped">
	div,
	span,
	ul,
	li,
	a,
	img,
	i,
	p {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	header {
		width: 100%;
		height: 130px;
		background: #ececee;
	}

	header a {
		color: #808080;
		margin-top: 23px;
		margin-left: 16px;
	}

	header div {
		width: 115px;
		height: 50px;
		margin: 0 auto;
		padding-top: 45px;
		position: relative;
	}

	header div p span {
		position: absolute;
		font-size: 20px;
		color: #444444;
		left: 27px;
		top: 49px;
	}

	header div svg {
		font-size: 28px;
		color: #03AEF9;
		margin-bottom: -3px;
	}

	header div p:nth-of-type(2) {
		font-size: 13px;
		color: #808080;
	}

	.why {
		width: 100%;
		padding-left: 42px;
		margin-top: 40px;
	}

	.when {
		width: 100%;
		padding-left: 42px;
		margin-top: 35px;
	}

	ul p {
		margin-bottom: 10px;
		font-size: 14px;
	}

	ul p span {
		color: #03aef9;
	}

	ul li {
		font-size: 13px;
		color: #808080;
	}

	ul li i {
		display: inline-block;
		width: 6px;
		height: 6px;
		background: #03AEF9;
		border-radius: 50%;
		margin-bottom: 2px;
	}

	ul li span {
		margin-left: 8px;
	}

	.contact {
		width: 100%;
		padding-left: 42px;
		margin-top: 60px;
	}

	.contact p {
		font-size: 12px;
		color: #808080;
	}

	.home-apply {
		width: 91%;
		height: 41px;
		margin-left: 4.5%;
		border-radius: 5px;
		background: #03aef9;
		text-align: center;
		line-height: 41px;
		color: #f2f2f2;
		font-size: 16px;
		margin-top: 26px;
	}
</style>
