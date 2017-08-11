<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">关注我的</h1>
    </header>

    <div class="mui-content mui-scroll-wrapper task-list" id="pullrefresh">
      <div class="mui-scroll">
        <ul class="my-focus">
          <li class="my-focus-item" v-for="(item, index) in list" >
              <img :src="item.user_avatar_url" @tap.stop.prevent="$router.pushPlus('/share/resume?id=' + item.uuid + '&goback=1')"/>
              <div>
              	<p>
              		<span>{{item.user_name}}</span>
              		 <svg  class="icon" aria-hidden="true" v-if="item.is_expert =='1'">
					    <use xlink:href="#icon-zhuanjiabiaoji"></use>
				    	 </svg>
              	</p>
              	<p>
              	  <span>网络专员</span>
              	  <i></i>
              	  <span>樱伟信息科技</span>
              	</p>
              </div>
              <svg class="icon" aria-hidden="true"  @tap.stop.prevent="collectProfessor(item.uuid,index)" v-if="!item.is_following">
			    <use xlink:href="#icon-shoucang"></use>
		    	 </svg>
		    	 <svg class="icon" aria-hidden="true"  style="color: rgb(3,174,249);"  @tap.stop.prevent="collectProfessor(item.uuid,index)" v-else>
			    <use xlink:href="#icon-shoucanghover"></use>
		    	 </svg>
		    	 <i class="bot"></i>
          </li>


        </ul>
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
        loading: 1,
        tip:""
      }
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

        postRequest("follow_my/users", {}).then(response => {
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
        postRequest("follow_my/users", {bottom_id: this.bottomId}).then(response => {
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
      collectProfessor(id,index) {
        postRequest(`follow/user`, {id:id}).then(response => {
            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }
            console.log(this.list[index].is_following )
            this.list[index].is_following = !this.list[index].is_following;
            mui.toast(response.data.data.tip);
        });

      }
      },   
    computed: {
    	 nothing () {
       	 if (this.tip == "关注成功") {
            return 1;
         }
        return  0;
      },
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
            contentdown : "下拉可以刷新",
            contentover : "释放立即刷新",
            contentrefresh : "正在刷新...",
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
    font-size: 25px;
    margin-top: 10px;
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
