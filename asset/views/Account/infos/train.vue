<template>
	<div>

		<header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">培训经历</h1>

		</header>

		<div class="mui-content">
			<ul class="mui-table-view">
				<li class="mui-table-view-cell">
					<div class="mui-input-row">
						<label class="mui-navigate">培训/认证名称</label>
						<input type="text" v-model.trim="train.certificate" placeholder="必填">
					</div>
				</li>
				<li class="mui-table-view-cell">
					<div class="mui-input-row">
						<label class="mui-navigate">培训/认证机构</label>
						<input type="text" v-model.trim="train.agency" placeholder="必填">
					</div>
				</li>
				<li class="mui-table-view-cell">
					<div class="mui-input-row" @tap.stop.prevent="initDate(3)">
						<label class="mui-navigate-right">培训/认证时间</label><label class="mui-pull-right account-setting-field">{{train.get_time?train.get_time:'请选择'}}</label>
					</div>
				</li>
			</ul>
			<div class="account_item_title">
				培训和认证经历详情描述

			</div>

			<MTextarea v-model.trim="description" :content="description" :rows="5" :descMaxLength="2000" :placeholder="'请详细填写该培训经历的详细信息'"></MTextarea>

		</div>

		<div class="options">
			<a @tap.stop.prevent="muiViewBack">取消</a>
			<a @tap.stop.prevent="submit" :disabled="buttonSaveDisabled">保存</a>
		</div>

		<div id="statusBarStyle" background="#fefefe" mode="light"></div>

	</div>
</template>

<script>
	import { NOTICE } from '../../../stores/types';
	import { createAPI, addAccessToken, postRequest } from '../../../utils/request';
	import localEvent from '../../../stores/localStorage';
	import ACCOUNT_API from '../../../api/account';
	import dPickerComponent from '../../../components/picker/date-picker.vue';
	import MTextarea from '../../../components/MTextarea.vue';

	export default {
		data: () => ({
			id: null,
			bak: '',
			object_type: '',
			train: {
				certificate: '',
				agency: '',
				get_time: '',
				description: '',
			},
			description: '',
			descMaxLength: 2000,
			buttonSaveDisabled: false
		}),
		methods: {
      refreshPageData:function(){
        this.getDetail();
      },
			getDetail:function(){
        let id = parseInt(this.$route.params.id);
        console.log("id:" + id);
        this.id = id;
        if(this.id) {
          var trains = localEvent.getLocalItem('trains');

          if(!trains || !trains[id]) {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '发生一些错误',
                time: 1500,
                status: false
              });
            });
            this.$router.back();
            return;
          }
          this.train = trains[id];
          this.description = this.train.description;
          this.bak = JSON.stringify(this.train);
        }
      },
			muiViewBack: function() {
				var newItemChange = JSON.stringify(this.train);
				if(this.bak != '' && newItemChange !== this.bak) {
					mui.confirm("您还未保存，确定退出么? ", '退出编辑', ['取消', '确定'], e => {
						if(e.index == 1) {
							mui.back();
						} else {
							return false;
						}
					}, 'div');
				} else {
					mui.back();
				}
			},
			initDate: function(objType) {
				let currentDate = new Date();

				var toNow = false;

				if(objType === 2) {
					toNow = true;
				}

				var value = '1990-07-01';
				switch(objType) {
					case 1:
						value = this.train.begin_time;
						break;
					case 2:
						value = this.train.end_time;
						break;
					case 3:
						value = this.train.get_time;
						break;
				}

				let param = {
					"type": "month",
					"beginYear": "1990",
					"endYear": currentDate.getFullYear(),
					"toNow": toNow,
					"value": value
				};

				let picker = new mui.DtPicker(param);
				picker.show((rs) => {

					rs.text = rs.text === '至今-至今' ? '至今' : rs.text;

					switch(objType) {
						case 1:
							this.train.begin_time = rs.text;
							break;
						case 2:
							this.train.end_time = rs.text;
							break;
						case 3:
							this.train.get_time = rs.text;
							break;
					}
				});
			},
			submit() {
				if(!this.train.certificate) {
					mui.toast("培训/认证名称不能为空");
					return;
				}

				if(!this.train.agency) {
					mui.toast("培训/认证机构不能为空");
					return;
				}

				if(!this.train.get_time) {
					mui.toast("培训/认证时间不能为空");
					return;
				}

				var url = '';
				if(this.id) {
					url = ACCOUNT_API.UPDATE_ACCOUNT_TRAIN;
				} else {
					url = ACCOUNT_API.ADD_ACCOUNT_TRAIN;
				}

				var data = this.train;

				if(this.id) {
					data.id = this.id;
				}

				if(this.buttonSaveDisabled) return;
				this.buttonSaveDisabled = true;

				data.description = this.description;

				postRequest(url, data).then(response => {
					this.buttonSaveDisabled = false;
					var code = response.data.code;

					if(code !== 1000) {
						mui.alert(response.data.message);
						return;
					}

					mui.toast('操作成功');
					this.bak = '';
					mui.back();
				});
			}
		},
		mounted() {
			window.addEventListener('refreshData', function(e) {
				//执行刷新
				console.log('refresh-train');
			});
		},

		beforeRouteLeave(to, from, next) {
			var popDiv = document.querySelector('.mui-dtpicker');
			if(popDiv) {
				document.body.removeChild(popDiv);
			}

			popDiv = document.querySelector('.mui-poppicker');
			if(popDiv) {
				document.body.removeChild(popDiv);
			}

			next();
		},

		components: {
			dPickerComponent,
			MTextarea
		},
    watch: {
      '$route': 'refreshPageData'
    },
		created() {
			//showInwehubWebview();
      this.getDetail();
		}
	}
</script>

<style scoped>
	.mui-input-row label {
		padding-right: 0;
	}

	.mui-input-row textarea {
		border: none !important;
	}

	.mui-input-row input {
		text-align: right;
		padding-right: 40px;
	}

	.mui-input-row a {
		font-family: 'Helvetica Neue', Helvetica, sans-serif;
		line-height: 1.1;
		float: left;
		width: 35%;
		padding: 11px 15px;
	}

	.mui-input-row a {
		font-family: 'Helvetica Neue', Helvetica, sans-serif;
		line-height: 1.1;
		float: left;
		width: 35%;
		padding: 11px 15px;
	}

	.mui-table-view-cell {
		padding: 0;
	}

	.deleteWrapper {
		text-align: right;
		padding: 10px;
	}

	.mui-table-view-cell .mui-navigate-right,
	.mui-table-view-cell .mui-navigate {
		color: #999;
	}

	.account_item_title {
		padding: 5px;
		color: #a6a6a6;
		font-size: 12px;
	}

	.account-setting-field {
		position: absolute;
		text-align: right;
		width: 200px;
		right: 40px;
		height: 32px;
		color: #3f3f3f;
		padding-right: 0;
	}
	/**/

	.account_item_title {
		padding-top: 8px;
		padding-bottom: 8px;
		color: #a6a6a6;
		font-size: 14px;
		margin-left: 10px;
	}

	.mui-table-view-cell:after {
		position: absolute;
		right: 15px;
		bottom: 0;
		left: 15px;
		height: 0.6px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #dcdcdc;
	}

	.mui-table-view:after {
		position: absolute;
		right: 15px;
		bottom: 0;
		left: 15px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #dcdcdc;
	}

	.mui-input-row {
		position: relative;
		font-size: 14px;
	}

	.textarea-wrapper[data-v-c8d6295a] {
		margin: 0 15px 0 14px;
		height: 100%;
		position: relative;
		border-radius: 5px;
		border: 1px solid #dcdcdc;
		padding-bottom: 20px;
		background: #FEFEFE;
	}

	.textarea-wrapper textarea {
		font-size: 14px;
		height: 100%;
		padding: 5px 10px;
		background: #fefefe;
	}

	.mui-content>.mui-table-view:first-child {
		margin-top: 15px;
		background: #fefefe;
		margin-top: 0px;
	}

	.mui-content {
		background: #fefefe;
	}
	/****取消和保存按钮样式****/

	.options {
		width: 100%;
		height: 41px;
		margin-top: 20px;
		padding: 0 15px;
	}

	.options a {
		display: block;
		width: 115px;
		height: 38px;
		font-size: 16px;
		text-align: center;
		line-height: 38px;
		border-radius: 50px;
	}

	.options a:nth-of-type(1) {
		float: left;
		background: #ececee;
		color: #03aef9;
	}

	.options a:nth-of-type(2) {
		float: right;
		background: #03aef9;
		color: #FFFFFF;
	}
</style>
