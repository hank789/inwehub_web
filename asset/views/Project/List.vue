<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav goheader">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="$router.push('/company/my')"></a>
      <h1 class="mui-title">需求管理</h1>
    </header>




    <div class="mui-content mui-scroll-wrapper" id="refurbish" >

    	  <div class="nocontent" v-if="nothing == 1">
    	  	<div class="Logo">
    	  	  <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/project/basic?id=' + item.id)">
                <use xlink:href="#icon-zanwushuju"></use>
          </svg>
          <p>暂时还没有数据呀～</p>
         </div>
    	  </div>


      <div class="mui-scroll" v-show="nothing == 0">
        <div class="mui-content">
          <ul class="projectList1" v-for="item in list" @tap.stop.prevent="$router.pushPlus('/project/review?id=' + item.id)">
            <li>
              <span class="mui-ellipsis">{{item.project_name}}</span>

              <span class="waiting" v-if="item.status =='1'">等待审核</span>
              <span class="fail"  v-if="item.status =='3'">审核未通过</span>
              <span class="pass"  v-if="item.status =='2'">审核通过</span>
              <svg class="icon" aria-hidden="true" @tap.stop.prevent="$router.pushPlus('/project/basic?id=' + item.id)" v-if="item.status !='2'">
                <use xlink:href="#icon-shuru"></use>
              </svg>
            </li>
            <li>
              <span class="mui-ellipsis">{{item.company_represent_person_name}}</span>
              <span></span>
              <span class="mui-ellipsis">{{item.company_name}}</span>
            </li>
            <li>{{item.updated_at}}</li>
          </ul>
        </div> 
  	 </div>
    </div>




  </div>
</template>
<script>
  import {apiRequest, postRequest} from '../../utils/request';
  export default {
    data(){
      return {
      list:[],
      loading: true
      }
    },
    created(){
      // 点击一次进行跳转；
      //showInwehubWebview();
    },
    methods: {

      //下拉刷新;
      pulldownRefresh() {
        setTimeout(() => {
          this.getPrevList();
        },1000);
      },
      //下拉刷新请求的数据；
      getPrevList(){
        postRequest(`project/myList`, {}).then(response => {

          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
          	this.list = response.data.data;
          }
          this.loading = 0;
          mui('#refurbish').pullRefresh().endPulldownToRefresh(); //refresh completed


        });
      },
      pullupRefresh() {
        setTimeout(() => {
          this.getNextList();
        },1000);
      },
      getNextList() {
        postRequest("project/myList", {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            //给请求的数据重新赋值；刷新最新的数据；
            this.list = this.list.concat(response.data.data);
          }

          this.loading = 0;

          mui('#refurbish').pullRefresh().endPullupToRefresh(false);

        });
      }
//  ,
//  	getdata(){
//     postRequest("project/myList", {}).then(response => {
//        var code = response.data.code;
//        if (code !== 1000) {
//          mui.alert(response.data.message);
//          return;
//        }
//
//  	      this.list = response.data.data; 
//  	      console.log(this.list)
//   });
//  }
    },
    computed: {
      //动态计算最后一个数据的id
      bottomId () {
        var length = this.list.length;
        if (length) {
          return this.list[length - 1].id;
        }
        return 0;
      },
      //有无数据；
      nothing () {
       	 if (this.loading) {
            return -1;
         }
        return this.list.length ? 0 : 1;
      },

    },
    mounted(){
      //每次进入页面进行刷新；
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-answerList');
        this.getPrevList();
      });
      //请求数据；
      mui.init({
        pullRefresh: {
          container: '#refurbish',
          down: {
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: this.pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: this.getNextList
          }
        }
      });

      //加载页面请求一次；
      this.getPrevList();
    }

  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
.nocontent{
  	width: 100%;
  	height: 100%;
  	background: #ffffff;
  	position: relative;
  	.Logo{
  		width: 205px;
  		height: 122px;
  		position: absolute;
  		left: 0;
  		right: 0;
  		top: 0;
  		bottom: 0;
  		margin: auto;
  		 svg{
  		 	width: 90px;
  		 	height:65px ;
  		 	display: block;
  		 	margin: 0 auto;

  		 }
  		 p{
  		 	width: 205px;
			height: 24px;
			font-family: "PingFangSC";
			font-size:14px;
			line-height: 24px;
			text-align: center;
			color: #808080;
			margin-top: 12px;
  		 }
  	}
  }

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
    height:100%;
    width:100%;
    background: #ececee;

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
          	display: inline-block;
            max-width: 180px;
            height: 22.5px;
            font-family: "PingFangSC";
            font-size: 16px;
            color: #444444;
            margin-bottom: -6px;
          }
          &:nth-child(2){
            height: 20px;
            border-radius: 50px;
            font-family: "PingFangSC";
            font-size: 11px;
            text-align:center;
            color: #ffffff;
            padding: 2px 11px 3px 10px;
            margin-left:8px;
            margin-bottom: 2px;
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
          	display: inline-block;
          	max-width: 130px;
          	height: 20px;
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
            margin-bottom: 2px;

          }
          &:nth-child(3){
          	display: inline-block;
          	max-width: 130px;
          	height: 20px;
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
