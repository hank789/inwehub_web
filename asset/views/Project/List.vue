<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">需求管理</h1>
    </header>
  <div class="mui-content" id="refurbish">
  	  <ul class="projectList1" v-for="item in list">
  	  	<li>
  	  		<span @tap.stop.prevent="$router.pushPlus('/project/review?id=' + item.id)">{{item.project_name}}</span>
<<<<<<< HEAD

  	  		<span class="waiting" v-if="item.status =='1'">等待审核</span>
  	  		<span class="fail"  v-if="item.status =='3'">审核未通过</span>
  	  		<span class="pass"  v-if="item.status =='2'">审核通过</span>
=======
  	  		<span>等待审核</span>
>>>>>>> d9ab6e2995c61fdc3f30d3a19229a82ae63dd119
  	  		<svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/project/basic?id=' + item.id)">
			  <use xlink:href="#icon-shuru"></use>
			</svg>
  	  	</li>
  	  	<li>
  	  		<span>{{item.company_represent_person_name}}</span>
  	  		<span></span>
  	  		<span>{{item.company_name}}</span>
  	  	</li>
  	  	<li>{{item.updated_at}}</li>
  	  </ul>
  </div>



</div>
</template>
<script>
	import {apiRequest, postRequest} from '../../utils/request';
	export default {
    data(){
      return {
      	 list:[]
      }
    },
    created(){
    	// 点击一次进行跳转；
    showInwehubWebview();
    },
    methods: {
//  	pulldownRefresh() {
//      setTimeout(() => {
//        this.getPrevList();
//      },1000);
//    },
//  pullupRefresh() {
//      setTimeout(() => {
//        this.getNextList();
//      },1000);
//    },
    getNextList() {
        postRequest("project/myList", {bottom_id: this.bottomId, type:'1'}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.asks = this.asks.concat(response.data.data);
          }
          this.loading = 0;

          mui('#refurbish').pullRefresh().endPullupToRefresh(false);

        });
     },
    	getdata(){
       postRequest("project/myList", {type:'1'}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

    	      this.list = response.data.data; 
    	      console.log(this.list)
     });
    }
    	},
    mounted(){
    	//每次进入页面进行刷新；
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-answerList');
        this.getPrevList();
      });
    	//请求数据；
    	  this.getdata();
    	  mui.init({
        pullRefresh: {
          container: '#refurbish',
          down: {
            callback: this.pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多了',
            callback: this.pullupRefresh
          }
        }
      });

  }
	}
</script>

<style lang="less" rel="stylesheet/less" scoped>
 ul {
 	padding: 0;
 	margin: 0;
 	li{
 		list-style: none;
 	}
 }
 .waiting{
	background: #a8dff7;
 }
 .pass{
 	background: #03aef9;
 }
 .fail{
 	background: #f03c69;
 }
  .mui-content{
    position: fixed;
    height:100%;
    width:100%;
    background: #ececee;
    overflow-y: auto;

  }
  .projectList1{
	width: 100%;
	background: #ffffff;
	padding: 17px 16px 16px 16px;
	margin-bottom: 10px;
	position: relative;
	li{
		&:nth-child(1){
		width: 309px;
	  	span{
	  		&:nth-child(1){
		  		width: 125px;
				height: 22.5px;
				font-family: "PingFangSC";
				font-size: 16px;
				color: #444444;
			}
			&:nth-child(2){
				height: 20px;
			    border-radius: 50px;
				/*background: #a8dff7;*/
				font-family: "PingFangSC";
		        font-size: 11px;
	            text-align:center;
	            color: #ffffff;
	            padding: 2px 11px 3px 10px;
	            margin-left:8px;
			}
			}
			svg{
				position:absolute;
				top: 20px;
				right: 16px;
				width: 16px;
				height: 17px;
				color: #03aef9;
			}
  }
  &:nth-child(2){
  	margin-top: 10px;
  	width: 100%;
  	height: 14px;
  	span{
  	&:nth-child(1){
		height: 14px;
		font-family: ".PingFangSC";
		color: #808080;
  	    font-size: 14px;
		}
	&:nth-child(2){
	display: inline-block;
	width: 1px;
	height: 14px;
	background:#c8c8c8;
	margin-left: 8px;
	margin-right: 8px;
	margin-bottom: -2px;

	}
  &:nth-child(3){
	height: 14px;
	font-family: ".PingFangSC";
	color: #808080;
	color: #808080;
  	font-size: 14px;
   }

  }

  }
  &:nth-child(3){
  	margin-top: 15.5px;
  	width:100%;
	height: 16.5px;
	font-family: "PingFangSC";
	font-size: 12px;
	color: #b4b4b6;
  }
  }
  }

</style>
