<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的关注</h1>
    </header>

    <div class="mui-content mui-scroll-wrapper task-list" id="pullrefresh">
      <div class="mui-scroll">
        <ul class="my-focus">
          <li class="my-focus-item" v-for="(item, index) in list" >
              <img :src="item.user_avatar_url"  @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1')" />
              <div>
              	<p>
              		<span>{{item.user_name}}</span>
              		 <svg  class="icon" aria-hidden="true">
					    <use xlink:href="#icon-zhuanjiabiaoji"></use>
				    	 </svg>
              	</p>
              	<p>
              	  <span>{{ item.description }}</span>
              	</p>
              </div>
              <svg class="icon" aria-hidden="true"   @tap.stop.prevent="$router.pushPlus('/ask?id=' + item.uuid)" >
			    <use xlink:href="#icon-tiwen"></use>
		    	 </svg>
		    	 
		    	 <i class="bot"></i>
          </li>


        </ul>
      </div>
    </div>

    <div class="mui-content list-empty" v-if="!this.list.length && !loading">
        <div class="mui-table-view-cell">
            <div class="title">暂无收藏</div>
        </div>
    </div>


  </div>
</template>
<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND} from '../../stores/types';
  import {apiRequest, postRequest} from '../../utils/request';

  export  default {
    data(){
      return {
        list: [],
        loading: 1
      }
    },
    activated: function () {

    },
    methods: {
      initData() {
          this.pulldownRefresh();
      },
      pulldownRefresh() {
        setTimeout(() => {
          this.getPrevList();
        },1000);
      },
      pullupRefresh() {
        setTimeout(() => {
          this.getNextList();
        },1000);
      },
      getPrevList(){

        postRequest(`followed/users`, {top_id: this.topId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.list = response.data.data;
          }
          this.loading = 0;
          mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
        });
      },
      getNextList() {
        postRequest(`followed/users`, {bottom_id: this.bottomId}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            mui.back();
          }

          if (response.data.data.length > 0) {
            this.list = this.list.concat(response.data.data);
          }
          this.loading = 0;
          mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
        });
      },
    },
    computed: {
      topId () {
        if (this.list.length) {
          return this.list[0].id;
        }
        return 0;
      },
      bottomId () {
        var length = this.list.length;
        if (length) {
          return this.list[length-1].id;
        }
        return 0;
      }
    },
    created(){
      showInwehubWebview();
    },
    mounted(){
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-collect');
        this.initData();
      });
      mui.init({
        pullRefresh: {
          container: '#pullrefresh',
          down: {
            callback: this.pulldownRefresh
          },
          up: {
            contentrefresh: '正在加载...',
            callback: this.pullupRefresh
          }
        }
      });
      this.getPrevList();
    }
  }

</script>

<style scoped>
 
  .bot{
 	position: absolute;
    right: 0;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220,220,220);
 	
 }
 p {
 	margin: 0;
 	padding: 0;
 }
 .mui-content{
 	background: #FFFFFF;
 }
 
 .my-focus{
 	margin: 0;
 	padding: 0;
 	list-style: none;
    padding-left:17px;
    padding-right: 17px;
 }
 .my-focus-item{
 	width: 100%;
 	height:63px;
 	list-style: none;
 	padding-top: 10px;
 	padding-bottom: 10px;
 	position: relative;
 	
 }
 .my-focus-item img{
 	width: 44px;
 	height: 44px;
 	border-radius: 50%;
 	margin-right: 8px;
 	float: left;
 }
 .my-focus-item div{
 	
 	float: left;
 }
 .my-focus-item>svg{
    font-size:60px;
    margin-top:-7px;
    float: right;
 }
 .my-focus-item div p:nth-of-type(1) span{
    font-family: "PingFangSC";
	font-size: 14px;
	color: #444444;
 	
 }
 
 .my-focus-item div p:nth-of-type(1) svg{
 	font-size:20px;
 	margin-bottom: -2px;
 	color: #3c95f9;

 }
 
 .my-focus-item div p:nth-of-type(2) span{
 	font-family: "PingFangSC";
	font-size:13px;
	color: #b4b4b6;
 }

 .my-focus-item div p:nth-of-type(2) i{
 	display: inline-block;
 	width: 1px;
 	height: 12px;
 	background:#b4b4b6;
 	margin-bottom: -2px;
 }
 
</style>
