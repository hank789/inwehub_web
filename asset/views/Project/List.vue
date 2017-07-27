<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav goheader">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap.stop.prevent="$router.pushPlus('/company/my')"></a>
      <h1 class="mui-title">需求管理</h1>
    </header>
    <div class="mui-content mui-scroll-wrapper" id="refurbish">
      <div class="mui-scroll">
        <div class="mui-content">
          <ul class="projectList1" v-for="item in list">
            <li>
              <span @tap.stop.prevent="$router.pushPlus('/project/review?id=' + item.id)">{{item.project_name}}</span>

              <span class="waiting" v-if="item.status =='1'">等待审核</span>
              <span class="fail"  v-if="item.status =='3'">审核未通过</span>
              <span class="pass"  v-if="item.status =='2'">审核通过</span>
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
          //this.loading = 0;
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
          // this.loading = 0;

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
      //动态计算最后一个数据的id；
      bottomId () {
        var length = this.list.length;
        if (length) {
          return this.list[length - 1].id;
        }
        return 0;
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
